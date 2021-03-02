import {
    START_GAME,
    END_GAME,
    ICR_ACTIVE_ROW,
    setTypedWords,
    ADD_TYPED_TO_TOTAL,
    updatePartialSpeed,
    updateElapsed,
    endGame,
    updateAccuracy,
    resetIncBuffer,
    resetLastCorNums,
    resetGame,
    addTypedToTotal
} from "../modules/game"
import { setScrollable } from '../modules/UI'
import { SET_NUM_ROWS, SET_TIME_MODE, SET_CAPS, SET_PUNC } from '../modules/settings'
import { windowIsScrollable } from '../../components/shared/helpers'

let interval
export default (store) => (next) => (action) => {
    const { dispatch, getState} = store
    next(action)

    switch (action.type) {
        case START_GAME:
            const trackTime = getState().settings.timeMode

            const _do = f => x => f(x)
            const _pipe = (...fns) => x => fns.reduce((r, f) => f(r), x) 
            const _when = (cond, f) => x => cond(x) ? f(x) : x

            const dispatchUpdateSpeed = () => dispatch(updatePartialSpeed())
            const dispatchUpdateElapsed = () => {
                let elapsed = (Date.now() - action.startTime) / 1000
                dispatch(updateElapsed(elapsed))
                return elapsed
            }
            const checkForGameEnd = (elapsed) => {if (elapsed >= action.duration) dispatch(endGame())}
            
            const updateStates = _pipe(
                dispatchUpdateSpeed,
                dispatchUpdateElapsed,
                _when(() => trackTime, _do(checkForGameEnd))
            )
            interval = setInterval(() => {
                updateStates()
            }, 100)

            return
        
        case END_GAME:
            dispatch(addTypedToTotal())
            dispatch(updateAccuracy())
            clearInterval(interval)
            return
        
        case ICR_ACTIVE_ROW:
            dispatch(addTypedToTotal())
            dispatch(setTypedWords([]))
            dispatch(resetIncBuffer())
            dispatch(resetLastCorNums())
            return
            
        case ADD_TYPED_TO_TOTAL:
            dispatch(resetIncBuffer())
            return

        case SET_NUM_ROWS:
            dispatch(setScrollable(windowIsScrollable()))
            return
       
        case SET_CAPS:
        case SET_PUNC:
        case SET_TIME_MODE:
            dispatch(endGame())
            dispatch(resetGame())
            return
    }
}
