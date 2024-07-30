import React, { useState, useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./customKeyboard.css"
import {Paper } from '@mui/material'
import Draggable from "react-draggable";
import { getKeyboardInstance, setKeyboardInstance } from "./keyboard-instance";
import { useSelector } from "react-redux";
import { useKeyboard } from "../../hooks/useKeyboard";

export default function VirtualKeyboard() {

  const [layoutName, setLayoutName] = useState("default");
  const [showKeyboard, hideKeyboard] = useKeyboard()
  const inputStates = useSelector(state => state.keyboardState)

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
  const onKeyPress = button => {
    if (button === "{shift}" || button === "{lock}") {
      handleShift();
    } else if (button === "{close}") {
      handleClose()
    }
  };

  const handleClose = () => {
    hideKeyboard()
  }

  let keyboardInstance = getKeyboardInstance()
  const onChange = newvalue => {
    keyboardInstance = getKeyboardInstance()
    keyboardInstance.setInput(newvalue);
    const onChangeEvent = new CustomEvent('keyboardOnChangeEvent', {
      detail: {
        inputName: inputStates?.inputName,
        input: newvalue
      }
    });
    window.dispatchEvent(onChangeEvent);
  };

  const handleShift = () => {
    const newLayoutName = layoutName === "default" ? "shift" : "default";
    setLayoutName(newLayoutName);
  };

  const onKeyboardInit = kb => {
    setKeyboardInstance(kb)
  };

  return (
    <Draggable axis="both">
      <Paper sx={{ padding: 3 }} variant="outlined">
        <Keyboard
          inputName={inputStates?.inputName}
          layoutName={layoutName}
          layout={layout}
          theme={"hg-theme-default hg-layout-default default-keyboard"}
          buttonTheme={btnTheme}
          display={display}
          onChange={onChange}
          onKeyPress={onKeyPress}
          physicalKeyboardHighlight
          onInit={onKeyboardInit}
        />
      </Paper>
    </Draggable>
  )
}