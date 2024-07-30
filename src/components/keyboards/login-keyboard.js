import React, { useState, useEffect } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './customKeyboard.css'
import { Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function LoginKeyboard({ handleKeyPress, disabled, pinLength }) {

  const { t } = useTranslation() 
  const display = {
    "{bksp}": "⬅",
    "{enter}": t('login_page.keypad_login'),
  }

  const initialBtnTheme = [
    { class: "hg-blue", buttons: "{bksp} {enter}", },
    { class: "Enter-None", buttons: "{enter}", }
  ]
  const [keyboardTheme, setkeyboardTheme] = useState("numbers-keyboard hg-theme-default hg-layout-default myTheme");
  const [btntheme, setBtnTheme] = useState(initialBtnTheme);

  useEffect(() => {
    if (pinLength > 3) {
      setBtnTheme([
        { class: "hg-blue", buttons: "{bksp} {enter}", },
        { class: "Enter", buttons: "{enter}", }
      ])
    }
    else {
      setBtnTheme(initialBtnTheme)
    }
  }, [pinLength])

  const layout = {
    default: [
      '1 2 3',
      '4 5 6',
      '7 8 9',
      '{bksp} 0 {enter}',
    ],
  };

  useEffect(() => {
    if (disabled) {
      setkeyboardTheme("numbers-keyboard hg-theme-default hg-layout-default myTheme disabled")
    } else {
      setkeyboardTheme("numbers-keyboard hg-theme-default hg-layout-default myTheme")
    }

  }, [disabled])

  return (
    <Paper variant='outlined' sx={{ width: 'fit-content', display: 'flex', margin: 'auto' }} >
      <Keyboard
        onKeyPress={(btn) => { handleKeyPress(btn) }}
        inputName="default"
        layout={layout}
        display={display}
        theme={keyboardTheme}
        maxLength={10}
        physicalKeyboardHighlightPress={true}
        buttonTheme={btntheme}
      />
    </Paper>
  );
}
