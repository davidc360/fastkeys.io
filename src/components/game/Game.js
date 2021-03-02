import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import styles from './Game.module.sass'
import WordDisplay from './WordDisplay'
import Settings from './Settings'
import Stats from './Stats'
import EndGame from './EndGame'
import ScrollIndicator from './ScrollIndicator'

import { windowIsScrollable } from '../shared/helpers'

import { setScrollable } from '../../ducks/modules/UI'
import { resetGame } from '../../ducks/modules/game'

import { BrowserView, MobileView } from "react-device-detect"

export default function Game() {
    const dispatch = useDispatch()
    const gameInProgress = useSelector(state => state.game.gameInProgress)
    const startTime = useSelector(state => state.game.timer.start)
    const gameStarted = startTime !== null
   
    useEffect(set_scroll_listener => {
        function handleScroll(e) {
            dispatch(setScrollable(windowIsScrollable())) 
        }

        window.addEventListener('scroll', handleScroll)
        return () => { window.removeEventListener('scroll', handleScroll) }
    }, [])

    useEffect(() => {
        dispatch(setScrollable(windowIsScrollable()))
    })
    useEffect(() => {
        return () => dispatch(resetGame())
    }, [])

    return (
        <>
        <MobileView>
            Please view this on a desktop browser.
        </MobileView>
        <BrowserView>
            <div className={styles.gameContainer}>
                <Settings />
                {!gameStarted || gameInProgress ?
                <>
                    <WordDisplay />
                    <Stats />
                </> : <EndGame />}
                {/* <EndGame /> */}

                <ScrollIndicator />
            </div>
        </BrowserView>
        </>
    )
}