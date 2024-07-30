import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  open: false,
}

const keyboardSlice = createSlice({
  name: 'keyboard',
  initialState,
  reducers: {
    showKeyboard(state, action) {
      state.open = true;
    },
    hideKeyboard(state, action) {
        state.open = false;
      }
  },
})

const data = {
  actions: keyboardSlice.actions,
  reducer: keyboardSlice.reducer
}
export default data