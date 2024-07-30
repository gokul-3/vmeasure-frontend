import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: '',
  counter: 0
}

const externalInputSlice = createSlice({
  name: 'external-input-scan',
  initialState,
  reducers: {
    emitExternalInputValue(state, action) {
      state.value = action?.payload?.value;
      state.counter = state.counter + 1;
    }
  },
})

const data = {
  actions: externalInputSlice.actions,
  reducer: externalInputSlice.reducer
}
export default data