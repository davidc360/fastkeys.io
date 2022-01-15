import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import styles from './Stats.module.sass'
import './Stats.sass'
import { InfIcon, GearIcon } from '../shared/Icons'
import { endGame } from '../../ducks/modules/game'
import Settings from './Settings'

import {
    setShow
} from '../../ducks/modules/settings'

export default function Stats() {
    const dispatch = useDispatch()
    const partialSpeed = useSelector(state => state.game.speed.partial)
    const showSettings = useSelector(state => state.settings.show)
    
    return (
        <div className={'statsCtn'}>
        <SpeedIndicator
            speed={Math.round(partialSpeed)}
            type={'current'} />
        <Timer />
            <GearIcon className='gearIcon' onClick={()=>dispatch(setShow(!showSettings))}/>
        </div>
  )
}

function SpeedIndicator({ speed, type }) {
  return (
    <div className='speedInd'>
      <div>
        <div className='speedText'>{speed}</div>
      </div>
      <div className='speedUnit'>
        <div>{type}</div>
        <div>WPM</div>
      </div>
    </div>
  )
}

function Timer() {
    const dispatch = useDispatch()
    const timeMode = useSelector(state => state.settings.timeMode)
    const elapsed = useSelector(state => state.game.timer.elapsed)
    const timeLeft = Math.round(timeMode - elapsed/1000)
    return (
        <div className='timerWrapper'>
            <div className='timer'>
                {timeMode === 0
                        ? (<>
                        00: <InfIcon onClick={() => dispatch(endGame())} className="infIcon"/>
                            </>)
                    : elapsed > 0 ? secToMMSS(timeLeft) : secToMMSS(timeMode)}
            </div>
        </div>
    )
}

function secToMMSS(time) {
  return (new Date(time * 1000).toISOString().substr(11, 8)).slice(-5)
}