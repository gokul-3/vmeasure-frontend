import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  disable_navigation: false
}

const navigationSlice = createSlice({
  name: 'navigation-controller',
  initialState,
  reducers: {
    disableNavigation(state, action) {
      state.disable_navigation = true
    },
    enaleNavigation(state, action) {
      state.disable_navigation = false
    }
  },
})

const data = {
  actions: navigationSlice.actions,
  reducer: navigationSlice.reducer
}
export default data