import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {},
}

const pageFocusSlice = createSlice({
  name: 'focus-input-scan',
  initialState,
  reducers: {
    updateFieldData(state, action) {
      state.data = action?.payload?.data;
    },
    updateFieldDataFromChild(state, action) {
      const { keyData, valueData } = action.payload;
      state.data[keyData] = valueData;
    },
    resetFieldData(state, action) {
      state.data = {}
    }
  },
})

const data = {
  actions: pageFocusSlice.actions,
  reducer: pageFocusSlice.reducer
}
export default data
