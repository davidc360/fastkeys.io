import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './Stats.module.sass'
import { InfIcon } from '../shared/Icons'
import { endGame } from '../../ducks/modules/game'

export default function Stats() {
  const partialSpeed = useSelector(state => state.game.speed.partial)
  return (
    <div className={styles.statsCtn}>
      <SpeedIndicator
        speed={Math.round(partialSpeed)}
        type={'current'} />
      <Timer />
    </div>
  )
}

function SpeedIndicator({ speed, type }) {
  return (
    <div className={styles.speedInd}>
      <div>
        <div className={styles.speedText}>{speed}</div>
      </div>
      <div className={styles.speedUnit}>
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
        <div className={styles.timerWrapper}>
        <div className={styles.timer}>
            {timeMode === 0
                    ? (<>
                            00: <InfIcon />
                            <div className={styles.showStats}
                                onClick={ ()=>dispatch(endGame()) } >
                                stop
                            </div>
                        </>)
                : elapsed > 0 ? secToMMSS(timeLeft) : secToMMSS(timeMode)}
        </div>
        </div>
    )
}

function secToMMSS(time) {
  return (new Date(time * 1000).toISOString().substr(11, 8)).slice(-5)
}