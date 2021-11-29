import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux"
import styles from "./EndGame.module.sass"
import { QuestionIcon, RestartIcon } from '../shared/Icons'
import { resetGame } from '../../ducks/modules/game'
import { setUsername } from '../../ducks/modules/settings'
import axios from "axios"
import { wordsetToCodes } from "../shared/helpers"
import { ImHome2 } from "react-icons/im";

export default function () {
    const username = useSelector(state => state.settings.username)
    const positionSequence = useSelector(state => state.game.positionSequence)
    const typedFullWords = useSelector(state => state.game.typedWords.fullTotal)

    const speed = useSelector((state) => state.game.speed.partial)
    const accuracy = useSelector(state => state.game.accuracy)

    const oppData = useSelector(state => state.game.opponentData)

    const withCaps = useSelector(state => state.settings.withCaps)
    const withPunc = useSelector(state => state.settings.withPunc)
    const timeMode = useSelector(state => state.settings.timeMode)

    const [createLinkButtonText, setCreateLinkButtonText] = useState('Create Battle Link')
    const [buttonCallback, setButtonCallback] = useState(createLinkButtonText)
    const [gameId, setGameId] = useState()

    const dispatch = useDispatch()
    useEffect(() => {
        window.addEventListener('keydown', handleKeydown)
        function handleKeydown(e) {
            if (e.key === 'Enter')
                restartGame()
            else if (e.key === ' ')
                e.preventDefault()
        }
        return () => {
            window.removeEventListener('keydown', handleKeydown)
        }
    }, [])

    function restartGame() {
        dispatch(resetGame())
    }

    const linkRef = useRef()
    const buttonCopyTimeoutRef = useRef()
    function buttonCopyLink(e) {
        const link = linkRef.current.value
        navigator.clipboard.writeText(link)
        setCreateLinkButtonText('Copied!')
        clearTimeout(buttonCopyTimeoutRef.current)
        buttonCopyTimeoutRef.current = setTimeout(() => {
            setCreateLinkButtonText('Copy')
        }, 1000)
    }

    const inputCopyTimeoutRef = useRef()
    function inputCopyLink(e) {
        const link = linkRef.current.value
        navigator.clipboard.writeText(link)
        linkRef.current.value = 'Copied!'
        clearTimeout(inputCopyTimeoutRef.current)
        inputCopyTimeoutRef.current = setTimeout(() => {
            linkRef.current.value  = process.env.REACT_APP_DOMAIN + '/game/' + gameId
        }, 1000)
    }

    const nameInputRef = useRef()
    function updateUsername(e) {
        const value = e.target.value.replace(/[^a-zA-Z\d]/ig, "")
        dispatch(setUsername(value)) 
        if (value.length === 0) {
            nameInputRef.current.classList.add(styles.nameEmpty)
        } else {
            nameInputRef.current.classList.remove(styles.nameEmpty)
        }
    }
    function createLinkFunc(e) {
        console.log(username)
        if (username === undefined || username.length === 0) {
            nameInputRef.current.focus()
            nameInputRef.current.classList.add(styles.nameEmpty)
            return
        }
        e.onClick = null
        const wordsTypedCodes = wordsetToCodes(typedFullWords)
        console.log({
            // username: username,
            sequence: positionSequence,
            mode: { withPunc, withCaps, timeMode },
            words: wordsTypedCodes,
            stats: { speed, accuracy }
        })

        // change button text to loading dots
        let length = 0
        setCreateLinkButtonText('.'.repeat(length+1))
        const loadingDotsInterval = setInterval(() => {
            length = (length+1)%4
            // setCreateLinkButtonText('.'.repeat((length+1)%3+1))
            setCreateLinkButtonText('.'.repeat(length+1))
        }, 150)

        axios.post(process.env.REACT_APP_BACKEND_URL + '/game', {
            username: username,
            sequence: positionSequence,
            mode: { withPunc, withCaps, timeMode },
            words: wordsTypedCodes,
            stats: { speed: Math.round(speed), accuracy: accuracy.toFixed(2) }
        }).then(resp => {
            clearInterval(loadingDotsInterval)
            setCreateLinkButtonText('Copy')
            setGameId(resp.data)
        })
    }

    function Stats({ sp, acc }) {
        return (
            <div className={styles.statCtn}>
                <div className={`${styles.speedCtn} ${styles.alignBtmCtn}`}>
                    <span className={`${styles.speedText} ${styles.alignBtmText}`}>{Math.floor(sp)}</span>
                    <span className={styles.speedUnit}>WPM</span>
                </div>
                <div className={`${styles.accCtn}`}>
                        <ToolTip
                            classNames={styles.adjLabel}
                            tooltext={'If you missed a key and corrected it, it shall not count against you.'}
                        >
                            (adjusted) <QuestionIcon /> 
                        </ToolTip>      
                    <div className={`${styles.accLabel}`}>Accuracy</div>
                    <div className={`${styles.accNum}`}>{Math.floor(acc * 100)}<span className={styles.percent}>%</span></div>
                </div>
            </div>
        )
    }


    const totalScore = speed * accuracy
    const oppTotalScore = oppData?.wpm * oppData?.accuracy
    return (
        <div className={styles.endGameCtn}>
                {oppData ? (
                    <div className={styles.winnerTitle}>Winner: {totalScore == oppData ? "tie" : totalScore > oppTotalScore ? "you" : oppData.name}</div>
                ): (
                    <div className={styles.titleCtn}>
                        <div className={styles.title}>Stats</div>
                    </div>
                )}
            {oppData && <div className={styles.namedTitle}>Your stats: </div>}
            <Stats sp={speed} acc={accuracy}/>
            {oppData && (
                <>
                <div className={styles.namedTitle}>{oppData.name}'s' stats: </div>
                <Stats sp={oppData.wpm} acc={oppData.accuracy}/>
                </>
            )}
            <div className={styles.actionButtons}>
                <div className={styles.createLinkCtn}>
                    <div className={styles.createLink} onClick={gameId === undefined ? createLinkFunc : buttonCopyLink }>{createLinkButtonText}</div>
                    {gameId && <input readOnly className={`${styles.gameLink} ${styles.yourName}`} value={'https://types.ink/game/' + gameId} ref={linkRef} onClick={inputCopyLink}/>}
                    <input className={styles.yourName} ref={nameInputRef} key={'nameinput'} type="text" value={username ?? ''} onChange={updateUsername} placeholder="Your name (required)" maxLength={40} />
                </div>
                <div className={styles.restartCtn} onClick={restartGame}>
                    <div>
                        Restart <RestartIcon />
                    </div>
                    <div className={styles.pressEnter}>(press enter ↵)</div>
                </div>
            </div>
            <WrongKeys />
        </div>
    );
}


function ToolTip({ children, tooltext, classNames, childClassNames }) {
    const [pos, setPos] = useState()
    const [showChild, setShow] = useState(false)
    function updatePos(e) {
        setShow(true)
        setPos({
            left: e.clientX + 15,
            top: e.clientY + 10,
        })    
    }
    return (
        <div
            className={`${classNames} ${styles.tooltip}`}
            onMouseMove={updatePos}
            onMouseLeave={ () => setShow(false) }
        >
            {children}
            {showChild && (
                <div
                    className={`${childClassNames} ${styles.tooltext}`}
                    style={pos ? pos : null}
                >
                    {tooltext}
                </div>
            )} 
        </div>
    )
}

function WrongKeys() {
    const wrongKeysTyped = useSelector(state => state.game.incorrectLetters.nonForget) 
    // letter combo = 2 letter string containing missed key + typed key 
    let missedKeysOnly = {}
    for (const [letterCombo, incNum] of Object.entries(wrongKeysTyped)) {
        const missedKey = letterCombo[0]
        // add the missed key to obj
        const curNum =  missedKeysOnly[missedKey] ?? 0
        missedKeysOnly[missedKey] = curNum + 1 
    }

    const locOverallStats = localStorage.getItem('stats_incorrect_letters')
    const overallStats = (locOverallStats && JSON.parse(locOverallStats)) ?? {}

    return (
        <div className={styles.wrongKeysCtn}>
            {
                missedKeysOnly.length === 0
                    ? (
                        <div className={styles.noMissed}>You did not miss type a single key!</div>
                    ) : (
                        // <div className={styles.tableCtn}>
                        //     <div className={styles.tableLabel}>
                        //         <ToolTip tooltext={'These are most common letters you did not get correct.'}>
                        //             Top characters you missed <QuestionIcon />
                        //         </ToolTip>
                        //     </div>
                            <IncLetTable incLetters={missedKeysOnly} type={'missedKeys'} />
                        // </div>
                    )
            }
             {/* <div className={styles.tableCtn}> */}
                {/* <div className={styles.tableLabel}> */}
                    {/* <ToolTip tooltext={'Keys you missed and what you\'re typing instead.'}> */}
                        {/* Keys you mistype <QuestionIcon /> */}
                    {/* </ToolTip> */}
                    {/* <div>Keys You Mistype</div> */}
                {/* </div> */}
                {/* <IncLetTable incLetters={overallStats} type={'typedKeys'} /> */}
            {/* </div> */}
        </div >
    )
}

function IncLetTable({ incLetters, type }) {
    let trs = []
    if (incLetters) {
        //sort incLetters from high to low
        const sortedLetters = Object.keys(incLetters).sort((a, b) => incLetters[b] - incLetters[a])
        //pick top 3
        for (let i = 0; i < 3; i++) {
            let key = sortedLetters[i]
            const num = incLetters[key]

            if (num > 1)
                trs.push(
                    <TableRow num={num} letters={[...key]} key={i} />
                )
        }
    }

    if (trs.length === 0) {
        return null
    }
    return (
        <div className={styles.tableCtn}>
            <div className={styles.tableLabel}>
                <ToolTip tooltext={'These are most common letters you did not get correct.'}>
                    Top characters you missed <QuestionIcon />
                </ToolTip>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>missed key</td>
                        {type === 'typedKeys' && (
                        <td>you typed</td>   
                        )}
                        <td>#</td>
                    </tr>
                </thead>
                <tbody>
                    {trs}
                </tbody>
            </table> 
        </div>
        
    )
}

function TableRow({ num, letters }) {
    const tds = letters.map((letter, i) => {
        if(letter === ' ') letter = 'space'
        return (
            <td key={i}>{letter}</td>
        )
    })
    tds.push(
        <td key={2}>{num}</td> 
    )
    return (
        <tr>
            {tds}
        </tr>
    )
}