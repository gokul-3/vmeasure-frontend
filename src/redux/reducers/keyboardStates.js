import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    inputName: '',
    input: ''
}

const keyboardState = createSlice({
    name: 'keyboard-state',
    initialState,
    reducers: {
        handleInputNameChange(state, action) {
            state.inputName = action.payload.inputNameValue;
        },
        handleInputChange(state, action) {
            const { inputValue } = action.payload;
            state.input = inputValue
        },
        handleInitialInput(state, action) {
            const { initialInput } = action.payload;
            state.input = {
                ...state.input,
                ...initialInput
            };
        }
    },
})

const data = {
    actions: keyboardState.actions,
    reducer: keyboardState.reducer
}
export default data