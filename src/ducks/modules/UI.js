import produce from 'immer'

const SET_SCROLLABLE = 'SET_SCROLLABLE'
const SET_THEME = 'SET_THEME'

// const userPrefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches    
// const isNightTime = () => (new Date().getHours() < 6 || new Date().getHours() > 22)
const localTheme = localStorage.getItem('theme')
const theme = localTheme ?? 'light'
    // : userPrefersDark()  ? 'dark'
    // : isNightTime()      ? 'dark' : 'light'

const initialState = {
    theme: theme
}

const reducer = produce((draft, action={}) => {
    switch (action.type) {
        case SET_SCROLLABLE:
            draft.scrollable = action.bool
            return

        case SET_THEME:
            localStorage.setItem('theme', action.theme)
            draft.theme = action.theme
            return
    }
}, initialState)

export const setScrollable = bool => ({
    type: SET_SCROLLABLE,
    bool: bool
})

export const setTheme = t => ({
    type: SET_THEME,
    theme: t
})

export default reducer