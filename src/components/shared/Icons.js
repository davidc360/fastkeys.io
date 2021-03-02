import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faInfinity,
    faQuestionCircle,
    faCaretDown,
    faUndo,
    faCog,
    faExternalLinkAlt,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import styles from "./Icons.module.sass"

export const InfIcon = ({ className, ...props }) => (
    <FontAwesomeIcon
        icon={faInfinity}
        {...props}
        className = {`${className}`}
    />
)

export const ExternalLinkIcon = () => (
    <FontAwesomeIcon icon={faExternalLinkAlt} className={styles.size60}/>
)

export const AngleRight = () => (
    <FontAwesomeIcon icon={faChevronRight} className={styles.size70}/>
)

export const QuestionIcon = () => (
    <FontAwesomeIcon icon={faQuestionCircle} />
)

export const DownIcon = () => (
    <FontAwesomeIcon icon={faCaretDown} />
)

export const RestartIcon = () => (
    <FontAwesomeIcon icon={faUndo} />
)

export const GearIcon = ({ className, ...props }) => (
    <FontAwesomeIcon
        icon = { faCog }
        {...props}
        className = {`${className} ${styles.gear}`}
    />
)