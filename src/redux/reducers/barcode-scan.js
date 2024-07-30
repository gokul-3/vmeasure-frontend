import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: '',
  category:'',
  counter: 0
}

const barcodeScanSlice = createSlice({
  name: 'barcode-scan',
  initialState,
  reducers: {
    emitBarcodeValue(state, action) {
      state.value = action?.payload?.value;
      state.category = action?.payload?.category;
      state.counter = state.counter + 1;
    }
  },
})

const data = {
  actions: barcodeScanSlice.actions,
  reducer: barcodeScanSlice.reducer
}
export default data
