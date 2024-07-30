import { createSlice } from "@reduxjs/toolkit";
import { keyBoardPosition } from "../../constants/virtual-keyboard";

const initialState = {
    virtualKeyboardValue: "",
    visible: false,
    cursorPosition: 0,
    initialPosition: keyBoardPosition['default'],
    positionX: 0,
    positionY: 0,
}

export const virtualKeyboardSlice = createSlice({
    name: "virtualKeyboard",
    initialState,
    reducers: {
        // initializes keyboard
        // requires textfield state as virtualKeyboardValue
        //position accepts "top-left" || "top-center" || "top-right" || "center-left" || "center-center" || "center-right" || "bottom-left" || "bottom-center" || "bottom-right" defaults to "bottom-center"
        loadVirtualKeyboard: (state, action) => {
            state.visible = true;
            if(action.payload?.textInit){
                state.virtualKeyboardValue = action.payload?.virtualKeyboardValue || "";
            }
            const position = keyBoardPosition[action.payload.position] || keyBoardPosition['default'];
            state.initialPosition = { ...position };
        },

        updateTextValue: (state,action) => {
            state.virtualKeyboardValue = action.payload.virtualKeyboardValue;
        },

        // handles state change and cursor position while using physical keyboard
        // requires textfield state as virtualKeyboardValue
        handleKeyPress: (state, action) => {
            if (document.activeElement.tagName !== "INPUT" || !state.visible) return;
            state.virtualKeyboardValue = action.payload.virtualKeyboardValue || "";
            state.cursorPosition = document.activeElement.selectionStart;
        },

        //handles state change and cursor position while using keyboard component
        //requires the value of the keypressed as keyValue
        handleInputTextChange: (state, action) => {
            if (document.activeElement.tagName !== "INPUT") return;
            let tempInput = state.virtualKeyboardValue.split("");
            tempInput.splice(
                document.activeElement.selectionStart,
                0,
                action.payload.keyValue
            );
            state.virtualKeyboardValue = tempInput.join("");
            state.cursorPosition = document.activeElement.selectionStart + 1;
        },

        //handles state change and cursor position while pressing backspace in keyboard component
        handleBackspace: (state) => {
            if (
                document.activeElement.tagName !== "INPUT" ||
                !document.activeElement.selectionStart
            )
                return;
            let tempInput = state.virtualKeyboardValue.split("");
            tempInput.splice(document.activeElement.selectionStart - 1, 1);
            state.virtualKeyboardValue = tempInput.join("");
            state.cursorPosition = document.activeElement.selectionStart - 1;
        },

        //handles states while pressing clear all key
        handleClearAll: (state) => {
            state.virtualKeyboardValue = "";
        },

        // retains keyboard position during DragEvent
        //requires positionX and positionY as payload
        updateKeyboardPosition: (state, action) => {
            state.positionX = action.payload.positionX;
            state.positionY = action.payload.positionY;
        },

        //resets cursor positon during each state change
        resetCursorPosition: (state) => {
            if (document.activeElement.tagName !== "INPUT") return;
            document.activeElement.setSelectionRange(
                state.cursorPosition,
                state.cursorPosition
            );
        },

        //destroys keyboard component
        disableVirtualKeyboard: (state) => {
            state.visible = false;
        },
    },
});

const data = {
    actions: virtualKeyboardSlice.actions,
    reducer: virtualKeyboardSlice.reducer
}

export default data