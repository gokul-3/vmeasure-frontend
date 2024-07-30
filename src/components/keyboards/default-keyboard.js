import React, { useState, useRef, useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import { Grid, Paper } from '@mui/material'
import { useKeyboard } from "../../hooks/useKeyboard";
import "react-simple-keyboard/build/css/index.css";
import "./customKeyboard.css"
import Draggable from "react-draggable";
import { useSelector } from "react-redux";

function KeyboardLayout() {
  const [layoutName, setLayoutName] = useState("default");
  const inputValuefrom = useSelector(state => state.keyboardState)
  const keyboardRef = useRef();
  const [showKeyboard, hideKeyboard, changeInput] = useKeyboard()

  const display = {
    "{close}": "x",
    "{shift}": "shift",
    "{tab}": "tab",
    "{lock}": "caps",
    "{enter}": "< enter",
    "{bksp}": "⬅",
    "{space}": " ",
  }

  const layout = {
    default: [
      "` 1 2 3 4 5 6 7 8 9 0 - = {close}",
      "{tab} q w e r t y u i o p [ ] \\",
      "{lock} a s d f g h j k l ; ' {enter}",
      "{shift} z x c v b n m , . / {shift}",
      "{bksp} {space}"
    ],
    shift: [
      "~ ! @ # $ % ^ & * ( ) _ + {close}",
      "{tab} Q W E R T Y U I O P { } |",
      "{lock} A S D F G H J K L : \" {enter}",
      "{shift} Z X C V B N M < > ? {shift}",
      "{bksp} {space}"
    ],
  }

  const btnTheme = [
    {
      class: "bkspBtn",
      buttons: "{bksp}",
    },
    {
      class: "closebtn",
      buttons: "{close}"
    }
  ];


  const onKeyPress = (button) => {
    if (button === "{shift}" || button === "{lock}") {
      handleShift()
    } else if (button === "{close}") {
      handleClose()
    } else if (button === "{bksp}") {
      const newInput = inputValuefrom.input.slice(0, -1);
      changeInput({ inputValue: newInput })
      keyboardRef.current.setInput(newInput);
    } else if (button === "{space}") {
      const newInput = inputValuefrom.input + " "
      changeInput({ inputValue: newInput })
      keyboardRef.current.setInput(newInput)
    } else if (button === "{tab}") {
      const newInput = inputValuefrom.input + "    "
      changeInput({ inputValue: newInput })
      keyboardRef.current.setInput(newInput)
    } else {
      if ((button !== "{enter}")) {
        const newInputValue = inputValuefrom?.input + button || button;
        changeInput({ inputValue: newInputValue });
      }
    }
  };

  const handleShift = () => {
    const newLayoutName = layoutName === "default" ? "shift" : "default";
    setLayoutName(newLayoutName);
  };


  const handleClose = () => {
    hideKeyboard()
  }

  return (
    <Draggable axis="both">
      <Paper sx={{ padding: 3 }} variant="outlined">
        <Keyboard
          keyboardRef={(r) => (keyboardRef.current = r)}
          inputName={inputValuefrom?.inputName}
          layoutName={layoutName}
          layout={layout}
          theme={"hg-theme-default hg-layout-default default-keyboard"}
          buttonTheme={btnTheme}
          display={display}
          onKeyPress={onKeyPress}
          physicalKeyboardSupport={true}
        />
      </Paper>
    </Draggable>
  );
}

export default KeyboardLayout;