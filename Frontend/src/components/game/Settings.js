import React, { useState, useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import {useSelector, useDispatch } from 'react-redux'

import {
    setTimeMode,
    setNumRows,
    setIgnoreInc,
    setLimitInputWord,
    setShowCurrentTyped,
    setCaps,
    setPunc
} from '../../ducks/modules/settings'

import { InfIcon, GearIcon }  from '../shared/Icons'
import styles from './Settings.module.sass'

import {
    setShow
} from '../../ducks/modules/settings'

function Settings() {
    const dispatch = useDispatch()
    const show = useSelector(state => state.settings.show)
    const toggleShow = () => dispatch(setShow(!show))

    return (
        <div className={styles.settingsContainer}>
            {/* <GearIcon onClick={toggleShow} className={styles.gearIcon} /> */}
            <SettingsPane show={show} />
        </div>
    )
}

function SettingsPane({ show }) {
    const version = useSelector(state => state.settings.version)
    const showSty = {
        maxHeight: '8em',
        transition: 'max-height 0.5s ease',
        overflow: 'hidden'
    }
    
    const noshowSty = {
        maxHeight: 0,
        transition: 'max-height 0.5s ease'
    }

    return (
        <div
            className={`${styles.settingsPane} ${show ? '' : styles.hideOverflow}`}
            style={show ? showSty : noshowSty}
        >
            <div style={{ marginRight: '1em' }}>
                <TypingModeSetting />
                <WordSettings />
            </div>
            <div>
                <WordRowSettings />
                <TimeSettings className={styles.timeSettings}></TimeSettings>
                {/* <div className={styles.version}>{version}</div>       */}
            </div>
        </div>
    )
}

function TypingModeSetting() {
    const ignoreInc = useSelector(state => state.settings.ignoreInc)
    const inputLimitWord = useSelector(state => state.settings.limitInputWord)
    const showCurrentTyped = useSelector(state => state.settings.showCurrentTyped)
    const dispatch = useDispatch()

    function handleIgnoreInc(e) {
        dispatch(setIgnoreInc(!ignoreInc))
    }

    function handleLimitWord(e) {
        dispatch(setLimitInputWord(!inputLimitWord))
    }

    function handleCurrentTyped(e) {
        dispatch(setShowCurrentTyped(!showCurrentTyped))
    }

    return (
        <div className={`${styles.typingModeSetting}`} >
            <div onClick={handleIgnoreInc}>
                <input type="checkbox" checked={ignoreInc} onChange={handleIgnoreInc} />
                Ignore incorrect letters
            </div>
            <div onClick={handleLimitWord}>
                <input type="checkbox" checked={inputLimitWord} onChange={handleLimitWord} />
                Space jumps to next word
            </div>
            <div onClick={handleCurrentTyped}>
                <input type="checkbox" checked={showCurrentTyped} onChange={handleCurrentTyped} />
                Show typed letters
            </div>
        </div>
    )
}

function WordRowSettings() {
  const gameInProgress = useSelector(state => state.game.gameInProgress)
  const dispatch = useDispatch()
  const numRows = useSelector(state => state.settings.numRows)

  function handleChange(e) {
    let num = Math.floor(e.target.value/10)
    dispatch(setNumRows(num))
  }
  
  return (
    <div className={styles.numRowsCtn}>
        <input className={styles.slider}
        type='range' onChange={handleChange}
        min={10} max={100} value={numRows*10}/>
        <div className={styles.inputLabels}>
            <div className={styles.numRowLabel}>Rows of words</div>
            <div>{numRows}</div>
        </div>
    </div>
  )
}

function TimeSettings() {
    const dispatch = useDispatch()
    const oppData = useSelector(state => state.game.opponentData)
    const gameInProgress = useSelector(state => state.game.gameInProgress)
    const timeMode = useSelector(state => state.settings.timeMode)
    const sels = useSelector(state => state.settings.timeModes)
    const selIdx = sels.indexOf(timeMode)

    function handleSlide(e) {
        if(!oppData)
            dispatch(setTimeMode(sels[e.target.value]))
    }
        
    const timeEl = useCallback((time) => {
        let unit
        let num
        if (time === 0) {
        unit = 'infinity'
        } else if (time < 60) {
        unit = 'sec'
        num = time
        } else if (time >= 60) {
        unit = 'min'
        num = `${Math.floor(time / 60)}${time % 60 ? ':' + ('0' + time % 60).slice(-2) : ''}`
        }
        return (
        <div className={styles.timeNum}>
            {time === 0 ? <InfIcon className={styles.infIcon}/> : num}
            <div className={styles.timeUnit}>{unit}</div>
        </div>
        )
    }, [])

    function makeTimeModeSetter(index) {
        return () => {
            if(!oppData)
                dispatch(setTimeMode(sels[index]))
        }
    }

    return (
        <div>
        <input onChange={handleSlide} type="range" 
            min={0} max={sels.length - 1} value={selIdx}
            className={styles.slider}
        />
        <div className={styles.inputLabels}>
            {
            sels.map((sel, i) => (
                <div
                className={`${styles.time}
                ${i === selIdx ? styles.active : styles.nonActive}`}
                key={i}
                onClick={makeTimeModeSetter(i)}
                >
                { timeEl(sel) }
                </div>
            ))
            }
        </div>
        </div>
    )
}

function WordSettings() {
    const oppData = useSelector(state => state.game.opponentData)
    const dispatch = useDispatch()
    const caps = useSelector(state => state.settings.withCaps)
    const punc = useSelector(state => state.settings.withPunc)


    function handleCaps(e) {
        if(!oppData)
            dispatch(setCaps(!caps))
    }

    function handlePunc(e) {
        if(!oppData)
            dispatch(setPunc(!punc))
    }

    return (
        <div className={`${styles.typingModeSetting}`} >
            <div onClick={handleCaps}>
                <input type="checkbox" checked={caps} onChange={handleCaps} />
                Capitalization
            </div>
            <div onClick={handlePunc}>
                <input type="checkbox" checked={punc} onChange={handlePunc} />
                Punctuations
            </div>
        </div>
    )
}

export default Settings
