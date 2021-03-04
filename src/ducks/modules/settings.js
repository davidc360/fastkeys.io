import produce from 'immer'

export const SET_TIME_MODE               = 'settings/SET_TIME_MODE'
const locTimeMode                        = localStorage.getItem('timeMode')
export const SET_NUM_ROWS                = 'settings/SET_NUM_ROWS'
const locNumRows                         = localStorage.getItem('numRows')
const SET_SHOW                           = 'settings/SET_SHOW'
const TOGGLE_SHOW                        = 'TOGGLE_SHOW' 
const SHOW_CURRENT_TYPED                 = 'SHOW_CURRENT_TYPED'
const locShowCurrentTyped                = localStorage.getItem('showCurrentTyped')

const SET_IGNORE_INC       = 'SET_IGNORE_INC'
const locIgnoreInc         = localStorage.getItem('ignoreIncorrect')
const SET_INPUT_LIMIT_WORD = 'SET_INPUT_LIMIT_WORD'
const locLimitInputWord    = localStorage.getItem('limitInputWord')

export const SET_PUNC    = 'SET_PUNC'
const locPunc            = localStorage.getItem('punc')
export const SET_CAPS    = 'SET_CAPS'
const locCaps            = localStorage.getItem('caps')

export const SET_USERNAME    = 'SET_USERNAME'
const locUsername            = localStorage.getItem('username')



const initialState  = {
    show             : false,
    username         : locUsername,
    numRows          : locNumRows ? +locNumRows : 4,
    ignoreInc        : JSON.parse(locIgnoreInc) ?? false,
    limitInputWord   : JSON.parse(locLimitInputWord) ?? false,
    showCurrentTyped : JSON.parse(locShowCurrentTyped) ?? false, 
    withPunc         : JSON.parse(locPunc) ?? false,
    withCaps         : JSON.parse(locCaps) ?? false,
    timeMode         : locTimeMode ? +locTimeMode : 5,
    timeModes        : [5, 10, 30, 60, 120, 0],
    version          : 'v 0.0.4.0'
}

export default produce((draft, action = {}) => {
    switch (action.type) {
        case SET_TIME_MODE:
            localStorage.setItem('timeMode', action.timeMode)
            draft.timeMode = action.timeMode
            return
        
        case SET_NUM_ROWS:
            localStorage.setItem('numRows', action.num)
            draft.numRows = action.num
            return

        case SET_SHOW:
            draft.show = action.show
            return

        case SET_IGNORE_INC:
            localStorage.setItem('ignoreIncorrect', action.bool)
            draft.ignoreInc = action.bool
            return

        case SET_INPUT_LIMIT_WORD:
            localStorage.setItem('limitInputWord', action.bool)
            draft.limitInputWord = action.bool 
            return

        case SHOW_CURRENT_TYPED:
            localStorage.setItem('showCurrentTyped', action.bool)
            draft.showCurrentTyped = action.bool
            return

        case SET_CAPS:
            localStorage.setItem('caps', action.bool)
            draft.withCaps = action.bool
            return
        
        case SET_PUNC:
            localStorage.setItem('punc', action.bool)
            draft.withPunc = action.bool
            return
            
        case SET_USERNAME:
            localStorage.setItem('username', action.name)
            draft.username = action.name
            return
    }
}, initialState)

export const setTimeMode = (secs) => ({
    type: SET_TIME_MODE,
    timeMode: secs,
})

export const setNumRows = (num) => ({
    type: SET_NUM_ROWS,
    num: num,
})

export const setShow = (show) => ({
    type: SET_SHOW,
    show: show,
})

export const toggleShow = (show) => ({
    type: TOGGLE_SHOW,
}) 

export const setIgnoreInc = (bool) => ({
    type: SET_IGNORE_INC,
    bool: bool
})

export const setLimitInputWord = (bool) => ({
    type: SET_INPUT_LIMIT_WORD,
    bool: bool
})

export const setShowCurrentTyped = (bool) => ({
    type: SHOW_CURRENT_TYPED,
    bool: bool
})

export const setPunc = bool => ({
    type: SET_PUNC,
    bool: bool
})

export const setCaps = bool => ({
    type: SET_CAPS,
    bool: bool
})

export const setUsername = name => ({
    type: SET_USERNAME,
    name: name
})