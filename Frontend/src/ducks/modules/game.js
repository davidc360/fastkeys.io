import produce from 'immer'
import { defaultNumRows } from './settings'

export const START_GAME             = 'STARTED_GAME'
export const END_GAME               = 'ENDED_GAME'
export const RESET_GAME             = 'RESET_GAME'
export const ICR_ACTIVE_ROW         = 'ICR_ACTIVE_ROW'
export const SET_DATA               = 'SET_DATA'
// export const SET_WORDS              = 'SET_WORDS'

export const SET_CUR_FOCUS_POS      = 'SET_CUR_FOCUS_POS'

export const UPDATE_ELAPSED         = 'UPDATED_ELAPSED'
export const UPDATE_ACCURACY        = 'UPDATED_ACCURACY'
export const UPDATE_PARTIAL_SPEED   = 'UPDATED_PARTIAL_SPEED'

export const SET_LAST_WAS_INC       = 'SET_LAST_WAS_INC'
export const RESET_INC_BUFFER       = "RESET_INC_BUFFER"
export const SET_CUR_INC_LETTERS    = 'SET_CUR_INC_LETTERS'
export const SET_CORRECT_NUMS       = 'SET_CORRECT_NUMS'
export const RESET_LAST_CORNUMS     = 'RESET_LAST_CORNUMS'
export const ADD_NONFORG_INC_LETTER = 'ADD_NONFORG_INC_LETTER'

export const ADD_POS_SEQ                 = 'ADD_POS_SEQ'
export const SET_OPPONENT_POS            = 'SET_OPPONENT_POS'
export const SET_TYPED_WORDS             = 'SET_TYPED_WORDS'
export const ADD_TYPED_TO_TOTAL          = 'ADD_TYPED_TO_TOTAL'
export const SET_TYPED_FULL_WORDS        = 'SET_TYPED_FULL_WORDS'


// the game renders numRows number of rows of words on the screen
// the focus will go from line to line
// when on the last line going to the next line, will start on top and rows will rerender with new words
// activeRow is the current active row on the screen
// activeRowId is id of the current active row, or the count how many rows have been rendered so far
const initialState = {
    activeRow            : 0,
    activeRowId          : 0,
    gameInProgress       : false,
    typedWords           : { current: [], total: [], full: [], fullTotal: []},
    currentFocus         : { pos: {} },
    accuracy             : 0,
    correctNums          : { current: { whole: 0, partial: 0 }, last: { whole: 0, partial: 0 } },
    incorrectLetters     : { lastWasInc: false, nonForget: {}, forgetting: {}, lastBuffer: {} },
    speed                : { whole: 0, partial: 0, top: 0 },
    timer                : { start: null, elapsed: 0 },
    positionSequence     : [],
    opponentSequence     : [],
    opponentWords        : [],
    opponentPos          : {},
    rowNums              : [...Array(defaultNumRows).keys()],
    currentLetterPos     : {},
}

const reducer = produce((draft, action = {}) => {
    switch (action.type) {
        case 'SET_FIRST_LETTER_OFFSET':
            draft.firstLetterOffset = action.offset
            return
        
        case 'SET_CURRENT_LETTER_POS':
            draft.currentLetterPos.y = action.pos.y
            draft.currentLetterPos.x = action.pos.x
            return

        case START_GAME:
            draft.timer.start = action.startTime
            draft.gameInProgress = true
            return

        case END_GAME:
            draft.gameInProgress = false
            // write incorrect letters to local
            let locStatsObj = localStorage.getItem('stats_incorrect_letters')
            let locStats = (locStatsObj && JSON.parse(locStatsObj)) ?? {}
            for (const [letCombo, newNum] of Object.entries(draft.incorrectLetters.nonForget)) {
                let curNum = locStats[letCombo] ?? 0
                locStats[letCombo] = curNum + newNum
            }
            localStorage.setItem('stats_incorrect_letters', JSON.stringify(locStats))
            return

        case SET_DATA:
            draft[action.key] = action.value
            return

        case ICR_ACTIVE_ROW:
            draft.activeRow = (draft.activeRow + 1) % action.numRows
            draft.activeRowId++
            return

        case SET_TYPED_WORDS:
            draft.typedWords.current = action.words
            return

        case SET_TYPED_FULL_WORDS:
            draft.typedWords.full = action.words
            return

        case ADD_TYPED_TO_TOTAL:
            draft.typedWords.total = [...draft.typedWords.total, ...draft.typedWords.current]
            // delete last word from full typed because it is added from being used to detect next row
            draft.typedWords.fullTotal.push(draft.typedWords.full.slice(0, -1))
            return

        case SET_CUR_FOCUS_POS:
            draft.currentFocus.pos = { ...action.pos }
            return

        case UPDATE_ACCURACY:
            const typedLength = draft.typedWords.total.join('').length
            // let incLength = 0
            // let incLetters = draft.incorrectLetters.forgetting
            // for (let letter in incLetters)
            //    incLength += incLetters[letter] 
            //    console.log(typedLength, incLength)
            const corNum = draft.correctNums.current.partial
            draft.accuracy = Math.max(0, corNum / typedLength)
            return

        case SET_CORRECT_NUMS:
            const { whole: lastCorWhole, partial: lastCorPart } = draft.correctNums.last
            const { whole, partial } = action.nums
            draft.correctNums.current.whole += whole - lastCorWhole
            draft.correctNums.current.partial += partial - lastCorPart

            draft.correctNums.last = { ...action.nums }
            return

        case RESET_LAST_CORNUMS:
            draft.correctNums.last = { whole: 0, partial: 0 }
            return

        case ADD_NONFORG_INC_LETTER:
            // keyCombo = typed letter + targeted letter in a string
            const keyCombo = action.keyCombo
            const curComboNum = draft.incorrectLetters.nonForget[keyCombo] || 0
            draft.incorrectLetters.nonForget[keyCombo] = curComboNum + 1 
            return
        
        case SET_LAST_WAS_INC:
            draft.incorrectLetters.lastWasInc = action.bool
            return

        case SET_CUR_INC_LETTERS:
            const incLets = action.obj

            for (const letter in incLets) {
                const lastBufferNum = draft.incorrectLetters.lastBuffer[letter] || 0
                const lastForget = draft.incorrectLetters.forgetting[letter] || 0 
                const curNum = incLets[letter]
                draft.incorrectLetters.forgetting[letter] = lastForget + (curNum - lastBufferNum) 
            }

            if (draft.incorrectLetters.lastBuffer) {
                const lastLetters = Object.keys(draft.incorrectLetters.lastBuffer)
                lastLetters.forEach(letter => {
                    if (!incLets[letter])
                        delete draft.incorrectLetters.forgetting[letter]
                })
            }

            draft.incorrectLetters.lastBuffer = { ...action.obj }
            return
        
        case ADD_POS_SEQ:
            if (draft.gameInProgress)
            draft.positionSequence.push({
                r: action.row,
                p: action.pos,
                t: draft.timer.elapsed
            })
            return

        case SET_OPPONENT_POS:
            draft.opponentPos = { pos: action.pos, row: action.row }
            return
        
        case RESET_INC_BUFFER:
            draft.incorrectLetters.lastBuffer = {}
            return

        case UPDATE_PARTIAL_SPEED:
            if(draft.timer.elapsed > 0)
                draft.speed.partial = (draft.correctNums.current.partial / 5) / (draft.timer.elapsed/1000) * 60
            return

        case UPDATE_ELAPSED:
            draft.timer.elapsed = action.elapsed
            return
        
        case RESET_GAME:
            return { ...draft, ...initialState }
  }
}, initialState)

export const startGame = (currentTime, duration) => ({
    type: START_GAME,
    startTime: currentTime,
    duration: duration
})

export const endGame = () => ({
    type: END_GAME
})

// export const setWords = words => ({
//     type: SET_WORDS,
//     words: words
// })

export const icrActiveRow = (numRows) => ({
    type: ICR_ACTIVE_ROW,
    numRows: numRows
})

export const setTypedWords = words => ({
    type: SET_TYPED_WORDS,
    words: words
})

export const addTypedToTotal = () => ({
    type: ADD_TYPED_TO_TOTAL
})

export const setCurFocusPos = pos => ({
    type: SET_CUR_FOCUS_POS,
    pos: pos
})

export const updateAccuracy = () => ({
    type: UPDATE_ACCURACY
})

export const setCorrectNums = obj => ({
    type: SET_CORRECT_NUMS,
    nums: obj
})

export const resetLastCorNums = () => ({
    type: RESET_LAST_CORNUMS
})

export const addNonforgIncLet = (combo) => ({
    type: ADD_NONFORG_INC_LETTER,
    keyCombo: combo
})

export const setIncorrectLetters = obj => ({
    type: SET_CUR_INC_LETTERS,
    obj: obj
})

export const setLastWasInc = bool => ({
    type: SET_LAST_WAS_INC,
    bool: bool
})

export const resetIncBuffer = () => ({
    type: RESET_INC_BUFFER,
})
       
export const updatePartialSpeed = () => ({
    type: UPDATE_PARTIAL_SPEED
})

export const updateElapsed = elapsed => ({
    type: UPDATE_ELAPSED,
    elapsed: elapsed
})

export const resetGame = () => ({
    type: RESET_GAME
})

export const setOpponentPos = (pos, row) => ({
    type: SET_OPPONENT_POS,
    pos: pos,
    row: row
})

export const addPosSeq = (pos, row) => ({
    type: ADD_POS_SEQ,
    pos: pos,
    row: row
})

export const setTypedFullWords = words => ({
    type: SET_TYPED_FULL_WORDS,
    words: words
})

export const setRowNums = nums => ({
    type: SET_DATA,
    key: 'rowNums',
    value: nums
})

export const setOpponentData= data => ({
    type: SET_DATA,
    key: 'opponentData',
    value: data
})

export const setFirstLetterOffset = offset => ({
    type: 'SET_FIRST_LETTER_OFFSET',
    offset: offset
})

export const setCurrentLetterPos = (pos) => ({
    type: "SET_CURRENT_LETTER_POS",
    pos: pos
})

export default reducer