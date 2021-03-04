import React, { useEffect, useState, useRef, memo, forwardRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import styles from "./WordDisplay.module.sass"
import { getRandomWords, INCORRECT_SYMBOL, formatWordSet, randomEndingPunc, wordHasEndingPunc} from "../shared/helpers"
import { setShow as setShowSettings } from "../../ducks/modules/settings"
import { DownIcon } from '../shared/Icons'
import {
    startGame,
    icrActiveRow,
    setCorrectNums,
    addNonforgIncLet,
    setIncorrectLetters,
    setLastWasInc,
    setCurFocusPos,
    setTypedWords,
    addPosSeq
} from "../../ducks/modules/game"
import axios from "axios"

export default function WordDisplay() {
    const numRows = useSelector(state => state.settings.numRows)
    const WordRows = []
    for (let i = 0;  i < numRows; i++) {
        WordRows.push(
            <WordRow key={i} row={i} /> 
        )
    }
    return (
        <div className={styles.wordsAreaContainer}>
            {WordRows}
        </div>
    )
}

function WordRow({ row }) {
    const dispatch       = useDispatch()
    const activeRow      = useSelector(state => state.game.activeRow)
    const active         = (row === activeRow)
    const gameInProgress = useSelector(state => state.game.gameInProgress)

    const withCaps       = useSelector(state => state.settings.withCaps)
    const withPunc       = useSelector(state => state.settings.withPunc)
    const INIT_WORDS_CONF = {
        num: 30,
        withSpace: true,
        withCaps: withCaps,
        withPunc: withPunc
    }

    function setNewWords() {
        setWords(getRandomWords(INIT_WORDS_CONF))
    }
    const [words, setWords] = useState([])
    //set words for new game
    useEffect(() => {
        if (!gameInProgress) {
            resetTyped()
            setNewWords()
        }
    }, [gameInProgress])

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
    const [opponentPos, setOppPos]    = useState(0)
    
    const resetTyped = () => setTypedWords([])
    //set key listener
    useEffect(() => {
        if (active) window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    })

    // set Opponent positions
    useEffect(() => {
        axios.get('http://127.0.0.1:5000/game/9c41')
            .then(res => {
                for (const positions of res.data?.seq) {
                    setTimeout(() => {
                        setOppPos(positions.p)
                    }, positions.t)
                } 
            })
    }, [])

    function handleKeyDown(e) {
        let newWords = [...typedWords]
        const curTypedWi = Math.max(0, newWords.length - 1)
        const curTypedWord = newWords[curTypedWi] ?? ''

        const curWordLength = words[curTypedWi].length

        let positionChange = 0

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
        dispatch(addPosSeq(nextWordPos.current.pos))
        dispatch(setTypedWords(newWords))
    }

    
    const nextWordPos = useRef({ word: 0, letter: 0, pos: 0})
    const curCorNums = useRef({ whole: 0, partial: 0 })
    // add to pos sequence every time the current letter position changes
    useEffect(() => {
        dispatch(addPosSeq(nextWordPos.current.pos))
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
    if (active) {
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
                                isNextFocus = ( li === curTypedWord?.length) || (letterIsLast && curTypedWord?.length > li)
                        } else {
                            isNextFocus = (wi === curTypedWi && curTypedWord.length === 0)
                        }
                        const isCorrect = (letter === typedWords[wi]?.charAt(li))
                        const isTyped = typedWords[wi]?.charAt(li) ? true : false
                        const shouldEval =  (isTyped || curTypedWi > wi) ? true : false
                        let letterEl = (
                            <Letter
                                text={letter}
                                key={li}
                                isCorrect={shouldEval ? isCorrect : undefined}
                                focus={active ? isNextFocus : false}
                                ref={isNextFocus ? nextWordEl : null}
                                isOpponentPos={letCnt===opponentPos}
                            />
                        )
                        letCnt++
                        if (isNextFocus) {
                            nextWordPos.current = { word: wi, letter: li, pos: letCnt-1 }
                            // setNextLetPos(letCnt)
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
                        <div className={styles.currentTypedWordCtn}>
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
        if (!active) return
        let nextWord = nextWordEl.current?.parentNode
        let curWord = nextWordEl.current?.parentNode?.previousSibling
        if (!curWord) return
        //if new line
        if ( nextWord.getBoundingClientRect().top !== curWord.getBoundingClientRect().top) {
            window.removeEventListener("keydown", handleKeyDown)
            dispatch(icrActiveRow(numRows))
            setNewWords()
        }
    }, [typedWords])

    const wordRowEl = useRef()
    return <div className={styles.wordsRow} ref={wordRowEl}>{wordEls}</div>
}

const WordWrapper = memo(({ children }) => {
    return <div className={styles.wordWrapper}>{children}</div>
})

const letterTemplate = ({ text, isCorrect, focus, isOpponentPos }, ref) => {
    return(
        <div
            className={`${styles.letter}
                ${text === " " ? styles.space : ""}
                ${isCorrect === undefined ? ""
                        : isCorrect ? styles.letterCorrect : styles.letterIncorrect
                }
                ${focus ? styles.letterFocus : ""}
                ${isOpponentPos ? styles.opponentPosition : ""}
            `}
            ref={ref}
        >
            <div className={isCorrect !== undefined ? styles.letterAnimation : ''}></div>
            {isOpponentPos && <div className={styles.oppName}>daviddavid daviddavid</div>}
            {text}
            </div>
    )
}
const Letter = memo(forwardRef(letterTemplate))
