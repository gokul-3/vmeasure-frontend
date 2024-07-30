import React, { useContext, useEffect, useRef, useState, } from "react";
import {
    UNSAFE_NavigationContext as NavigationContext,
} from "react-router-dom";
import ConfirmationDialog from "../components/dialogs/confirmation-dialog";

function useConfirmExit(isConfirmExit, when = true) {
    const { navigator } = useContext(NavigationContext);

    useEffect(() => {
        if (!when) {
            return;
        }

        const push = navigator.push;
        
        navigator.push = async (...args) => {
            const result = await isConfirmExit();
            if (result !== false) {
                push(...args);
            }
        };

        return () => {
            navigator.push = push;
        };
    }, [navigator, isConfirmExit, when]);
}

export function usePrompt(title, content, when = true) {

    const [isOpen, setIsOpen] = useState(false);
    const resolveRef = useRef()

    useEffect(() => {
        if (when) {
            window.onbeforeunload = function () {
                return content;
            };
        }

        return () => {
            window.onbeforeunload = null;
        };
    }, [content, when]);

    const isConfirmExit = async () => {
        return new Promise((resolve, reject)=>{
            resolveRef.current = resolve
            setIsOpen(true);
        })
    }

    const handleClose = (isConfirmed) => {
        setIsOpen(false);
        resolveRef.current(isConfirmed)
    }

    useConfirmExit(isConfirmExit, when);

    const prompt = <ConfirmationDialog
        title={title}
        content={content}
        onClose={handleClose}
        open={isOpen}
    />

    return [prompt];
}