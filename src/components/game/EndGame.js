import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import styles from "./EndGame.module.sass"
import { QuestionIcon, RestartIcon } from '../shared/Icons'
import { resetGame } from '../../ducks/modules/game'
import { setUsername } from '../../ducks/modules/settings'
import axios from "axios"
import { wordsetToCodes } from "../shared/helpers"

export default function () {
    const username = useSelector(state => state.settings.username)
    const positionSequence = useSelector(state => state.game.positionSequence)
    const typedFullWords = useSelector(state => state.game.typedWords.fullTotal)

    const speed = useSelector((state) => state.game.speed.partial)
    const accuracy = useSelector(state => state.game.accuracy)

    const withCaps = useSelector(state => state.settings.withCaps)
    const withPunc = useSelector(state => state.settings.withPunc)

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

    function updateUsername(e) {
        dispatch(setUsername(e.target.value))   
    }

    function createLink(e) {
        const wordsTypedCodes = wordsetToCodes(typedFullWords)
        axios.post('http://127.0.0.1:5000/game', {
            username: username,
            sequence: positionSequence,
            mode: { withPunc, withCaps },
            words: wordsTypedCodes,
            stats: { speed, accuracy }
        })
    }

    function Mode() {
        return (
            <div className={styles.modeCtn}>
                 With capitalization: {withCaps.toString()} <br/>
                 With punctuation: {withPunc.toString()}
            </div>
        )
    }
    

    function Stats() {
        return (
            <div className={styles.statCtn}>
                <div className={`${styles.speedCtn} ${styles.alignBtmCtn}`}>
                    <span className={`${styles.speedText} ${styles.alignBtmText}`}>{Math.floor(speed)}</span>
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
                    <div className={`${styles.accNum}`}>{Math.floor(accuracy * 100)}<span className={styles.percent}>%</span></div>
                </div>
            </div>
        )
    }

    function CreateLink() {
        return (
            <div className={styles.createLinkCtn}>
                <input className={styles.yourName} type="text" onChange={updateUsername} placeholder="Your name" maxLength={40} value={username}/>
                <div className={styles.createLink} onClick={createLink}>Create & Copy Link</div>
            </div>
        )
    }

    return (
        <div className={styles.endGameCtn}>
            <div className={styles.title}>Stats</div>
            <div className={styles.restartCtn} onClick={restartGame}>
                <div className={styles.restart}>
                    <div>
                        Restart <RestartIcon />
                    </div>
                    <div className={styles.pressEnter}>(press enter ↵)</div>
                </div>
            </div>
            <Stats />
            <Mode />
            <CreateLink />
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
        <div className={styles.ctn}>
            {
                missedKeysOnly.length === 0
                    ? (
                        <div className={styles.noMissed}>You did not miss type a single key!</div>
                    ) : (
                        <div className={styles.wrongKeysCtn}>
                            <div className={styles.tableLabel}>
                                <ToolTip tooltext={'These are most common letters you did not get correct.'}>
                                    Top characters you missed <QuestionIcon />
                                </ToolTip>
                            </div>
                                <IncLetTable incLetters={missedKeysOnly} type={'missedKeys'} />
                        </div>
                    )
            }
             <div className={styles.wrongKeysCtn}>
                <div className={styles.tableLabel}>
                    <ToolTip tooltext={'Keys you missed and what you\'re typing instead.'}>
                        Keys you mistype <QuestionIcon />
                    </ToolTip>
                    {/* <div>Keys You Mistype</div> */}
                </div>
                <IncLetTable incLetters={overallStats} type={'typedKeys'} />
            </div>
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
    return (
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
                {trs.length > 0 ? trs : <tr><td colSpan={3}>Not enough data.</td></tr>}
            </tbody>
        </table> 
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