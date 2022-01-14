import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from "./Nav.module.sass"
import { setTheme } from '../../ducks/modules/UI'

// import { Link } from 'react-router-dom'
import { ReactComponent as LogoLight } from './FastKeysLogoLight.svg'
import { ReactComponent as LogoDark } from './FastKeysLogoDark.svg'

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
                {/* <Link to={'/'} target="_self"> */}
                {/* </Link> */}
                <li><a href="/">
                    {/* <img src={logo} alt="" className={styles.logo} /> */}
                    {theme === 'light' ? <LogoLight className={styles.logo}/> : <LogoDark className={styles.logo}/>}
                    {/* <Logo className={styles.logo}/> */}
                </a></li>
                <li onClick={toggleTheme} className={`${styles.link} ${styles.lightSwitch}`}>{theme}</li>
            </ul>
        </nav>
    )
}