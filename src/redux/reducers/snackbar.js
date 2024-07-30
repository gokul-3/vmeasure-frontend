import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  severity: 'info',
  message: '',
  autoHideDuration: 6000,
  vertical: 'top',
  horizontal: 'center',
  open: false,
}

const snackbarSlice = createSlice({
  name: 'global_snackbar',
  initialState,
  reducers: {
    showSnackbar(state, action) {
      state.autoHideDuration = action?.payload?.autoHideDuration;
      state.horizontal = action?.payload?.horizontal;
      state.message = action?.payload?.message;
      state.open = true;
      state.severity = action?.payload?.severity;
      state.vertical = action?.payload?.vertical;
    },
    hideSnackbar(state, payload) {
      state.open = false
    }
  },
})

const data = {
  actions: snackbarSlice.actions,
  reducer: snackbarSlice.reducer
}
export default data