// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** ThemeConfig Import
import themeConfig from '@configs/themeConfig'

const initialNavigation = () => {
    const item = window.localStorage.getItem('navigation')
    //** Parse stored json or if none return initialValue
    return item ? JSON.parse(item) : themeConfig.navigation
}

export const navigationSlice = createSlice({
    name: 'navigation',
    initialState: {
        navigation: initialNavigation()
    },
    reducers: {
        handleNavigation: (state, action) => {
            state.navigation = action.payload
            window.localStorage.setItem('navigation', JSON.stringify(action.payload))
        }
    }
})

export const {
    handleNavigation
} = navigationSlice.actions

export default navigationSlice.reducer
