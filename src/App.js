import React from 'react'
import { Provider } from 'react-redux'
import store from './ducks/store'

import styles from "./App.module.sass"

import Nav from './components/nav/Nav'
import Game from './components/game/Game'

import { BrowserRouter, Route, Switch, useParams } from 'react-router-dom'

function App() {
    return (
        <Provider store={store}>
                <BrowserRouter>
                    <div className={styles.app}>
                    <Nav />
                    <Switch>    
                        <Route exact path='/' component={Game} />
                        <Route path='*' component={()=>(<div>Oh no!!!! Page not found.</div>)} />
                    </Switch>
                    </div>
                </BrowserRouter>
        </Provider> 
    )
}

export default App
