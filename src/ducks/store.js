import { createStore, applyMiddleware, combineReducers } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"

import middleware from "./middleware/middleware"
import settings   from "./modules/settings"
import game       from "./modules/game"
import UI         from "./modules/UI"

const reducer = combineReducers({
    settings,
    game,
    UI
})

export default createStore(
    reducer,
    composeWithDevTools(applyMiddleware(middleware))
)
