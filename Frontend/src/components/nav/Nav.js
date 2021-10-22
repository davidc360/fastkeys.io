import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from "./Nav.module.sass"
import { setTheme } from '../../ducks/modules/UI'

// import { Link } from 'react-router-dom'

export default function () {
    const dispatch = useDispatch()
    const theme = useSelector(state => state.UI.theme)
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    })
    function toggleTheme(e) {
        dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))
    }
    return (
        <nav>
            <ul className={styles.navLinks}>
                <li><a href="/">Home</a></li>
                <li onClick={toggleTheme} className={`${styles.link} ${styles.lightSwitch}`}>{theme}</li>
            </ul>
        </nav>
    )
}