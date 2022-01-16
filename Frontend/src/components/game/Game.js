import React, { useEffect, useState, useRef, memo, forwardRef } from "react"
import { useSelector, useDispatch } from 'react-redux'

import axios from "axios"

import styles from './Game.module.sass'

import Settings from './Settings'
import ScrollIndicator from '../nav/ScrollIndicator'
import Stats from './Stats'
import EndGame from './EndGame'

import { windowIsScrollable } from '../shared/helpers'
import { setScrollable } from '../../ducks/modules/UI'
import {
    setShow as setShowSettings,
    setOppTimeMode
} from "../../ducks/modules/settings"

import { ImArrowDown } from 'react-icons/im'

import { getRandomWords, INCORRECT_SYMBOL, formatWordSet, randomEndingPunc, wordHasEndingPunc, wordCodesToWords } from "../shared/helpers"
import {
    startGame,
    icrActiveRow,
    setCorrectNums,
    addNonforgIncLet,
    setIncorrectLetters,
    setLastWasInc,
    setCurFocusPos,
    addPosSeq,
    setTypedWords,
    setTypedFullWords,
    setOpponentPos,
    setRowNums,
    setOpponentData,
    resetGame,
    setFirstLetterOffset,
    setCurrentLetterPos,
} from "../../ducks/modules/game"

import { useParams } from 'react-router-dom'
// import { BrowserView, MobileView } from "react-device-detect"

export default function Game() {
    const { gameId } = useParams()
    const oppData    = useSelector(state => state.game.opponentData)

    // have a welcome text that says "type to start"
    // typed out letter by letter
    // const [displayedText, setDisplayedText] = useState('')
    // const reverseDisplayText = useRef(false)
    // const welcomeText = `Type to start!`
    // useEffect(() => {
    //     if (gameInProgress) {
    //         setDisplayedText('')
    //         return
    //     }
    //     if (displayedText.length === welcomeText.length) {
    //         reverseDisplayText.current = true
    //     } else if (displayedText.length === 0) {
    //         reverseDisplayText.current = false
    //     } 
    //     setTimeout(()=> setDisplayedText(welcomeText.slice(0, reverseDisplayText.current ? displayedText.length - 1 : displayedText.length + 1)), displayedText.length === welcomeText.length ? 1000 : 60 + Math.random() * 150 )
    // })

    
    const dispatch = useDispatch()
    const gameInProgress = useSelector(state => state.game.gameInProgress)
    const startTime = useSelector(state => state.game.timer.start)
    const gameStarted = (startTime !== null)
    
    // align the type to start arrow with first letter
    const firstLetterOffset = useSelector(state => state.game.firstLetterOffset)

    // Store the state of whether the page has more content than the window height, making it scrollable
    function updatePageScrollable() {
        const windowScrollable = windowIsScrollable()
        dispatch(setScrollable(windowScrollable)) 
    }

    // every time a user scrolls, update the scrollable state again, 
    // in case they scroll to the bottom and the page becomes no longer scrollable
    // and vice versa
    useEffect(() => {
        window.addEventListener('scroll', updatePageScrollable)
        return () => { window.removeEventListener('scroll', updatePageScrollable) }
    }, [])

    // every time components change, update scrollable state again
    useEffect(() => {
        updatePageScrollable()
    })

    // render words
    // see ducks/modules/game for explanation of state variables
    // and how words are displayed on screen
    const numRows = useSelector(state => state.settings.numRows)

    // the current active row 
    const activeRowId    = useSelector(state => state.game.activeRowId)
    const WordRows  = []
    
    const [loadingData, setLoadingData] = useState(gameId !== undefined)
    // set Opponent positions
    useEffect(() => {
        axios.put(process.env.REACT_APP_BACKEND_URL + '/api/views')
        if (gameId !== undefined) {
            // track games played
            axios.get(process.env.REACT_APP_BACKEND_URL + '/game/' + gameId)
            .then(res => {
                // console.log(res)
                // if game is found in db
                if (res.data !== null) {
                    const newOppData = {}
                    newOppData.words = wordCodesToWords(res.data.ws)
                    newOppData.name = res.data.usr
                    newOppData.sequence = res.data.se
                    newOppData.stats = res.data.st
                    newOppData.mode = res.data.m
                    newOppData.wpm = res.data.wpm
                    newOppData.accuracy = res.data.acc
                    dispatch(setOpponentData(newOppData))
                    dispatch(setOpponentPos(0, 0))
                    dispatch(setOppTimeMode(newOppData.mode.timeMode))
                    // dispatch(setOppName(res.data.usr))
                    // dispatch(setOppWords(wordCodesToWords(res.data.ws)))
                    setLoadingData(false)
                } else {
                    setLoadingData(false)
                }
            })
        }
    }, [])

    // useEffect(() => {
    //     console.log(gameId)
    // }, [])

    for (let i = 0;  i < numRows; i++) {
        WordRows.push(
            <WordRow key={i} row={i}
                shouldLoadOpponent={gameId !== undefined}
                opponentDataLoaded={!loadingData && gameId !== undefined}
            /> 
        )
    }

    return (
        <>
        {/* <MobileView>
            Please view this on a desktop browser.
        </MobileView> */}

        {/* <BrowserView> */}
                {/* if game hasn't started or is in progress, show the words on screen  */}
                {(!gameStarted || gameInProgress) ?
                <div className={styles.gameContainer}>
                    {oppData !== undefined ? (
                        <div className={styles.welcomeMessage}>
                            <u>{oppData.name}</u> challenged you to type {oppData.wpm}WPM with {oppData.accuracy * 100}% accuracy on this word set!
                        </div>

                    ) : (<div className={styles.topMargin}></div>)}
                    {/* if the first letter offset isn't set yet, don't show the arrow! */}
                    {(!gameInProgress && firstLetterOffset !== undefined) && (
                        <div className={styles.promptWrapper}>
                            <div className={styles.prompt}>
                                {/* {displayedText} */}
                                Type to start!
                                <div className={styles.startArrow} style={{ paddingLeft: firstLetterOffset + 'px' }}><ImArrowDown /></div>
                            </div>
                        </div>
                    )}
                    <div className={styles.wordsAreaContainer}>
                        {WordRows}
                    </div>
                    <Stats />
                    <Settings />
                </div>
                // otherwise, show the end game component        
                : <EndGame />}
                <ScrollIndicator />
        {/* </BrowserView> */}
        </>
    )
}

function WordRow({ row, shouldLoadOpponent, opponentDataLoaded }) {
    const dispatch       = useDispatch()
    const activeRow      = useSelector(state => state.game.activeRow)
    const active         = (row === activeRow)
    const gameInProgress = useSelector(state => state.game.gameInProgress)
    const activeRowId         = useSelector(state => state.game.activeRowId)
    const rowNums = useSelector(state => state.game.rowNums)
    const oppData    = useSelector(state => state.game.opponentData)

    const withCaps       = useSelector(state => state.settings.withCaps)
    const withPunc       = useSelector(state => state.settings.withPunc)

    const INIT_WORDS_CONF = {
        num: 30,
        withSpace: true,
        withCaps: withCaps,
        withPunc: withPunc
    }

    const [words, setWords] = useState([])
    function setNewWords() {
        setWords(getRandomWords(INIT_WORDS_CONF))
    }
    //set words for new game
    useEffect(() => {
        if (!gameInProgress) {
            resetTyped()
            if (!shouldLoadOpponent) {
                setNewWords()
            } else if (opponentDataLoaded && oppData !== undefined) {
                const oppWords = oppData.words
                let oppWordRow = oppWords[rowNums[row]]
                if (oppWordRow !== undefined) {
                    // if last row from opponent, add more words to fill in the whole row
                    if (rowNums[row] === oppWords.length - 1) {
                        oppWordRow = oppWordRow.concat(getRandomWords({
                            num: 30,
                            withSpace: true,
                            withCaps: oppData.mode.withCaps,
                            withPunc: oppData.mode.withPunc
                        }))
                    }
                    setWords(oppWordRow)
                } else {
                    setNewWords() 
                }
            }
        }
    }, [gameInProgress, opponentDataLoaded])

    //format words if word format changes
    useEffect(() => {
        if(words.length > 0)
            setWords(formatWordSet({
                ...INIT_WORDS_CONF,
                words
            }))
    }, [withCaps, withPunc])

    //add period to last word in line
    useEffect(() => {
        if (!withPunc) return
        if (!words.length > 0) return
        const wordEls = Array.from(wordRowEl.current.querySelectorAll('.' + styles.wordWrapper))
        let lastWordEl, resultEl, resultIdx
        for (let i = 0; i < wordEls.length; i++) {
            const wordEl = wordEls[i]
            if (lastWordEl && wordEl.getBoundingClientRect().top !== lastWordEl.getBoundingClientRect().top) {
                resultEl = lastWordEl
                resultIdx = i - 1
                break
            } else {
                lastWordEl = wordEl
            }
        }
        if (wordHasEndingPunc(words[resultIdx])) return

        const curLastWord = words[resultIdx]
        let newWords = [...words]
        newWords[resultIdx] = newWords[resultIdx]?.replace(/[\W_]+/g, "") + randomEndingPunc() + ' '
        if (newWords[resultIdx] !== curLastWord) setWords(newWords)
    }, [words])

    const timeMode       = useSelector(state => state.settings.timeMode)
    const ignoreInc      = useSelector(state => state.settings.ignoreInc)
    const limitInputWord = useSelector(state => state.settings.limitInputWord)
    const lastWasInc     = useSelector(state => state.game.incorrectLetters.lastWasInc)
    const typedWords     = useSelector(state => state.game.typedWords.current)
    const opponentPos    = useSelector(state => state.game.opponentPos)
    
    const resetTyped = () => setTypedWords([])
    const restartGame = (e) => {
        if (e.key === 'Enter') {
            for (const timeout of opponentPosTimeoutsRef.current) {
                clearTimeout(timeout)
                opponentPosTimeoutsRef.current = []
            }
            setTimeout(() => {
                dispatch(startGame())
                dispatch(resetGame())
            }, 0)
        }
    }
    //set key listener
    useEffect(() => {
        if (active) {
            window.addEventListener("keydown", restartGame)
            window.addEventListener("keydown", handleKeyDown)
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keydown", restartGame)
        }
    })

    const opponentPosTimeoutsRef = useRef([])
    function handleKeyDown(e) {
        if(!active) return
        let newWords = [...typedWords]
        const curTypedWi = Math.max(0, newWords.length - 1)
        const curTypedWord = newWords[curTypedWi] ?? ''

        const curWordLength = words[curTypedWi].length

        // key.length === 1 means it's a single letter pressed, including space
        if (e.key.length === 1) {
            const letIdx = newWords[curTypedWi]?.length ?? 0
            const curLet = words[curTypedWi][letIdx]

            if (curLet !== e.key) {
                if (letIdx < words[curTypedWi].length && !lastWasInc) {
                    dispatch(addNonforgIncLet(curLet + e.key))
                    dispatch(setLastWasInc(true))
                } 
                if (ignoreInc) return
            } else {
                dispatch(setLastWasInc(false))
            }
            

            if (limitInputWord) {
                newWords[curTypedWi] = curTypedWord + e.key
                if (e.key === ' ') {
                    newWords[curTypedWi + 1] = ''
                } 
            } else {
                    newWords[curTypedWi] = curTypedWord + e.key
                    if(newWords[curTypedWi].length === curWordLength) newWords[curTypedWi + 1] = '' 
            }
           
            if (!gameInProgress) {
                dispatch(setShowSettings(false))
                dispatch(startGame(Date.now(), timeMode))

                if (oppData !== undefined) {
                    oppData.sequence.forEach(sequence => {
                        opponentPosTimeoutsRef.current.push(setTimeout(() => {
                            dispatch(setOpponentPos(sequence.p, sequence.r))
                        }, sequence.t))
                    })
                }
            }
        
            // 8 === back space
        } else if (e.keyCode === 8) {
            if (e.metaKey) {
                newWords = []
            } else if (e.altKey) {
                newWords.splice(curTypedWi, 1)
            } else {
                if (newWords[curTypedWi]?.length > 0) {
                    newWords[curTypedWi] = newWords[curTypedWi].slice(0, -1) 
                } else {
                    newWords.splice(curTypedWi, 1)
                    newWords[curTypedWi - 1] = newWords[curTypedWi - 1]?.slice(0, -1)  
                }
            }
        }
        dispatch(addPosSeq(nextWordPos.current.pos, activeRowId))
        dispatch(setTypedWords(newWords))
    }

    
    const nextWordPos = useRef({ word: 0, letter: 0, pos: 0})
    const curCorNums = useRef({ whole: 0, partial: 0 })

    // update what words we currently passed
    useEffect(() => {
        dispatch(setTypedFullWords(words.slice(0, typedWords.length)))
    }, [nextWordPos.current.pos])

    // set current correct num of words
    useEffect(() => {
        if (!active) return
        dispatch(setCorrectNums(curCorNums.current))
    }, [typedWords])

    const numRows = useSelector(state => state.settings.numRows)
    const nextWordEl = useRef()


    /*---------------
    Compute letters
    ---------------*/
    const showCurrentTyped = useSelector(state => state.settings.showCurrentTyped)
    let letCnt = 0
    let wordEls
    const corNums = { whole: 0, partial: 0 }
    const incLets = {}
    const curIncLets = useRef({})
    // if (active) {
    if (true) {
        wordEls = words.map((word, wi) => {
            let wordHasIncLet = false
            let wordHasFocus = false
            const curTypedWi = Math.max(0, typedWords.length - 1)
            const curTypedWord = typedWords[curTypedWi] ?? ''
            const lastWord = words[wi - 1]
            const wordEl = (
                <WordWrapper key={wi}>
                    {
                        // li = letter index
                        [...word].map((letter, li) => {
                        let isNextFocus
                        if (li > 0) {
                            const letterIsLast = li === word.length - 1
                            if (wi === curTypedWi)
                                isNextFocus = active && ( li === curTypedWord?.length) || (letterIsLast && curTypedWord?.length > li)
                        } else {
                            isNextFocus = active && (wi === curTypedWi && curTypedWord.length === 0)
                        }
                        const isCorrect = (letter === typedWords[wi]?.charAt(li))
                        const isTyped = typedWords[wi]?.charAt(li) ? true : false
                        const shouldEval =  active && (isTyped || curTypedWi > wi) ? true : false
                        let letterEl = (
                            <Letter
                                text={letter}
                                key={li}
                                isCorrect={shouldEval ? isCorrect : undefined}
                                focus={active ? isNextFocus : false}
                                ref={isNextFocus ? nextWordEl : null}
                                isOpponentPos={gameInProgress && letCnt === opponentPos?.pos && rowNums[row] === opponentPos?.row}
                                oppName={oppData?.name}
                                shouldBlink={row === 0 && wi === 0 && li === 0 && !gameInProgress}
                            />
                        )
                        letCnt++
                        if (isNextFocus && active) {
                            nextWordPos.current = { word: wi, letter: li, pos: letCnt-1 }
                            wordHasFocus = true
                        }
                        if (isCorrect) {
                            corNums.partial++
                        } else {
                            wordHasIncLet = true

                            if (isTyped) {
                                const curIncNum = incLets[letter] || 0
                                incLets[letter] = curIncNum + 1
                            }
                        }
                        return letterEl
                    })}
                    {(wordHasFocus && (showCurrentTyped || typedWords
                    [wi]?.length > word.length - 1)) && (
                        <div className={styles.currentTypedWordCtn}
                            style={{
                                left: nextWordEl.current?.parentNode.offsetLeft ?? 0,
                                top: 0
                            }}
                        >
                            {curTypedWord}
                        </div>
                    )}
                </WordWrapper>
            )
            if (!wordHasIncLet) corNums.whole++
            return wordEl
        })
    } else {
        wordEls = words.map((word, wi) => (
            <WordWrapper key={wi}>
                {[...word].map((letter, li) => (
                    <Letter text={letter} key={li} />
                ))}
            </WordWrapper>
        ))
    }
    curCorNums.current = corNums
    curIncLets.current = incLets
    //update incorrect letters
    useEffect(() => {
        if (active) {
            dispatch(setIncorrectLetters(curIncLets.current))
        }
    })

    //check for new line
    useEffect(() => {
        let isNewLine = false
        if (!active) return
        let nextWord = nextWordEl.current?.parentNode
        let curWord = nextWordEl.current?.parentNode?.previousSibling
        // console.log(typedWords)
        
        if (typedWords.length <= 1) return
        
        // multiple words are displayed in a row, words that overflow the row are hidden 
        // we check if the next word is overflowed by checking element position
        // if cur word and next word are not on same Y axis
        // then next word belongs on a new line, meaning we should switch focus to the next line
        if (curWord?.getBoundingClientRect().top !== nextWord?.getBoundingClientRect().top)
            isNewLine = true

        // if not the last opponent word row, check if typed more words than opponent's row
        // reason has to be not last row is because opponent might not have typed the
        // entire row
        if (rowNums[row] < oppData?.words.length-1 && typedWords.length > oppData?.words[rowNums[row]]?.length)
            isNewLine = true
        //if new line
        if (isNewLine) {
            window.removeEventListener("keydown", handleKeyDown)
            dispatch(icrActiveRow(numRows))
            setNewWords()

            // increment the row number the current row is on
            const newRowNums = [...rowNums]
            newRowNums[row] = Math.max(...newRowNums) + 1
            dispatch(setRowNums(newRowNums))
        }
    }, [typedWords])

    const wordRowEl = useRef()

    const currentLetterPosTarget = useSelector(state => state.game.currentLetterPos)
    const currentLetterXTargetRef = useRef(currentLetterPosTarget.x)
    useEffect(() => {
        currentLetterXTargetRef.current = currentLetterPosTarget.x
    }, [currentLetterPosTarget])

    const currentLetterX = useRef(0)
    const currentLetterXInterval = useRef()
    const animationFrameRef = useRef()
    function moveCursor(timestamp) {
        if (!cursorRef.current) return
        const frameDiff = Math.abs(currentLetterX.current - currentLetterXTargetRef.current)
        const nextFrameCount = Math.max(frameDiff/4, 3)
        if (Math.abs(currentLetterX.current - currentLetterXTargetRef.current) < 3) {
            currentLetterX.current = currentLetterXTargetRef.current
            cursorRef.current.style.left = currentLetterX.current + 'px'
        }
        console.log(currentLetterX.current, currentLetterXTargetRef.current)
        if (!cursorRef.current) return
        if (currentLetterX.current < currentLetterXTargetRef.current) {
            if (currentLetterX.current + nextFrameCount <= currentLetterXTargetRef.current) {
                currentLetterX.current += nextFrameCount
                cursorRef.current.style.left = currentLetterX.current + 'px'
            }
        } else if (currentLetterX.current > currentLetterXTargetRef.current) {
            if (currentLetterX.current - nextFrameCount >= currentLetterXTargetRef.current) {
                currentLetterX.current -= nextFrameCount
                cursorRef.current.style.left = currentLetterX.current + 'px'
            }
        }
        if (activeRow === row && currentLetterX.current !== currentLetterXTargetRef.current)
            animationFrameRef.current = window.requestAnimationFrame(moveCursor)
    }
    useEffect(() => {
        if (activeRow === row)
        window.requestAnimationFrame(moveCursor)
    }, [activeRow])

    useEffect(() => {
        if (activeRow !== row) return
        // if first word then move cursor to instandly
        if (nextWordEl.current?.parentNode.previousSibling.previousSibling === null) { 
            currentLetterX.current = currentLetterPosTarget.x
            cursorRef.current.style.left = currentLetterPosTarget.x + 'px'
        }
        window.cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = window.requestAnimationFrame(moveCursor)
    }, [currentLetterPosTarget])

    useEffect(() => {
        if (activeRow === row) {
            currentLetterX.current = currentLetterPosTarget.x
            cursorRef.current.style.left = currentLetterPosTarget.x + 'px'
        }
    }, [activeRow])

    // blink cursor after 1000ms inactivity
    const blinkCursorTimeout = useRef()
    const cursorRef = useRef()
    useEffect(() => {
        if (!gameInProgress) return
        if (cursorRef.current)
            cursorRef.current.classList.remove(styles.blinkCursor)
        clearTimeout(blinkCursorTimeout.current)
        blinkCursorTimeout.current = setTimeout(() => {
            // add class to cursor
            if (cursorRef.current) cursorRef.current.classList.add(styles.blinkCursor)
        }, 400)
    }, [currentLetterX.current])

    // reset cursor animation color on theme change
    const theme = useSelector(state => state.UI.theme)
    useEffect(() => {
        if (cursorRef.current) {
            cursorRef.current.classList.remove(styles.blinkCursor)
            // use settiemout because if done consecutively, 
            // the change will be ignored
            setTimeout(() => {
                cursorRef.current.classList.add(styles.blinkCursor)
            }, 0);
        }
    }, [theme])
    return (
        <div className={`${styles.wordsRow}`} ref={wordRowEl}>
            {activeRow == row && 
                <div className={`${styles.cursor} ${gameInProgress ? "" : styles.blinkCursor}`}
                ref={cursorRef}></div>
            }
            {wordEls}
        </div>
    )
}

const WordWrapper = memo(({ children }) => {
    return <div className={styles.wordWrapper}>{children}</div>
})

const Letter = memo(forwardRef(({ text, shouldBlink, isCorrect, focus, isOpponentPos, oppName }, ref) => {
    const dispatch = useDispatch()
    const gameInProgress = useSelector(state => state.game.gameInProgress)
    // log location if focus
    useEffect(() => {
        if (focus) {
            const pos = ref.current.getBoundingClientRect()
            // dispatch(setCurrentLetterPos({y: ref.current.offsetTop, x: ref.current.offsetLeft}))
            dispatch(setCurrentLetterPos({y: pos.y, x: ref.current.offsetLeft}))
        }
    }, [focus, text])
    // set the first letter offset for "type to start" arrow
    useEffect(() => {
        if (!focus) return
        if (gameInProgress) return
        
        // get the element's left offset to calculate where the arrow needs to bea
        const letter = ref.current

        // sometimes the element changes position after initial render
        // and doesn't update the offset value (most likely because of using memo)
        // to work around, use a set interval, then set it to clear after 1 sec
        let mspassed = 0
        const offsetChecker = setInterval(() => {
            const letterWidth = letter.offsetWidth
            const letterLeft = letter.parentNode.offsetLeft
            dispatch(setFirstLetterOffset(letterLeft - 10 + letterWidth/2))

            // set current letter position
            if (focus && ref.current) {
                const pos = ref.current.getBoundingClientRect()
                // dispatch(setCurrentLetterPos({y: ref.current.offsetTop, x: ref.current.offsetLeft}))
                dispatch(setCurrentLetterPos({y: pos.y, x: ref.current.offsetLeft}))
            }

            mspassed += 10

            if (mspassed > 1000) clearInterval(offsetChecker)
        }, 10)
    }, [gameInProgress])

    return(
        <div
            className={`${styles.letter}
                ${text === " " ? styles.space : ""}
                ${isCorrect === undefined ? styles.letterUntyped
                        : isCorrect ? styles.letterCorrect : styles.letterIncorrect
                }
                ${focus ? styles.letterFocus : ""}
                ${isOpponentPos ? styles.opponentPosition : ""}
                ${shouldBlink ? styles.blink : ""}
            `}
            ref={ref}
        >
            <div className={isCorrect !== undefined ? styles.letterAnimation : ''}></div>
            {/* {shouldBlink && <div className={styles.aboveWord}>Type to start</div>} */}
            {isOpponentPos && <div className={styles.aboveWord}>{ oppName }</div>}
            {text}
        </div>
    )
}))