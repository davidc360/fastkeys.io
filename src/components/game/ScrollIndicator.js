import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from "./ScrollIndicator.module.sass"

import { DownIcon } from '../shared/Icons'

export default function () {
    const scrollable = useSelector(state => state.UI.scrollable)
    return (
        <div className={`${styles.ctn} ${!scrollable ? styles.hide : ""}`}>
            {scrollable &&
                <div className={styles.text}>
                    scroll for more <DownIcon />
                </div>
            }
        </div>
    )
}