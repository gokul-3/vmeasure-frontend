import React from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './customKeyboard.css'
import { Paper } from '@mui/material';

export default function EthernetKeyboard({handleKeyPress}) {
    const display = {
        "{bksp}": "⬅",
        "{enter}": "Close",
    }

    const btnTheme = [
        { class: "hg-blue", buttons: "{bksp} {enter} .", },
    ]

    const layout = {
        default: [
            '1 2 3',
            '4 5 6',
            '7 8 9',
            '{bksp} 0 .',
            // '{enter}'
        ],
    };

    return (
            <Paper variant='outlined' sx={{ width: 'fit-content', display: 'flex', margin: 'auto' }} >
                <Keyboard
                    onKeyPress={handleKeyPress}
                    inputName="default"
                    layout={layout}
                    display={display}
                    theme={"numbers-keyboard hg-theme-default numbers-keyboard.hg-layout-default "}
                    maxLength={10}
                    physicalKeyboardHighlightPress={true}
                    buttonTheme={btnTheme}
                />
            </Paper>
    );
}
