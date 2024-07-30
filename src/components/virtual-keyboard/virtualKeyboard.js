import "./virtualKeyboard.css";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import Draggable from "react-draggable";
import { virtualKeyboardSlice } from "../../redux/reducers/virtual-keyboard";
import { keyboardRows } from "../../constants/virtual-keyboard";
import { IPC_Channel } from "../../constants";
const { ipcRenderer } = window.require('electron')

export function VirtualKeyboard({ setFocusingNetwork }) {
	const dispatch = useDispatch();
	const keyboard = useSelector((state) => state.virtualKeyboard);
	const [isCaps, setIsCaps] = useState(false);
	const [isShift, setIsShift] = useState(false);

	const newMethod = (key) => {
		console.log("key", key)
		const activeElement = document.activeElement;
		let value = activeElement.value;
		let selectionStart = document.activeElement.selectionStart

		//preparing the value based on the cursor position 
		if (selectionStart === value.length) {
			value += key
		} else {
			let tempInput = value.split("");
			tempInput.splice(
				selectionStart,
				0,
				key
			);
			value = tempInput.join("");
		}
		document.activeElement.setSelectionRange(selectionStart+1,selectionStart+1);

		const getElement = document.getElementsByName([activeElement.name])
		getElement[0].value = value;
		setFocusingNetwork((prevFocusingNetwork) => ({
			...prevFocusingNetwork,
			password: getElement[0].value,
		}));
	}

	const handleKeyClick = (key) => {
		switch (key) {
			case "Backspace":
				dispatch(virtualKeyboardSlice.actions.handleBackspace());
				break;
			case "Clear All":
				dispatch(virtualKeyboardSlice.actions.handleClearAll());
				break;
			case "\u21E7 Shift":
				handleShiftKey();
				break;
			case "Caps Lock":
				handleCapsLock();
				break;
			case "Tab":
			case "PageUp":
			case "PageDown":
			case "Esc":
			case "\u21B5 Enter":
				handleSpecialKey(key);
				break;
			default:
				handleRegularKey(key);
		}
	};
	const handleCapsLock = () => {
		const updatedCaps = !isCaps;
		setIsCaps(updatedCaps);
		const keys = document.querySelectorAll(".key");
		keys.forEach((key) => {
			const firstSpanElement = key.querySelector("span:first-child");
			if (firstSpanElement) {
				const keyText = firstSpanElement.innerText.toLowerCase();
				if (
					![
						"\u21E7 shift",
						"\u21B5 enter",
						"caps lock",
						"tab",
						"backspace",
						"clear all",
						"pageup",
						"pagedown",
						"esc",
					].includes(keyText)
				) {
					firstSpanElement.innerText =
						(updatedCaps && isShift) || (!updatedCaps && !isShift)
							? keyText.toLowerCase()
							: keyText.toUpperCase();
				}
				if (keyText === "caps lock") {
					firstSpanElement.parentElement.style.backgroundColor = updatedCaps
						? "#536974"
						: "#35454d";
				}
			}
		});
	};
	const handleShiftKey = () => {
		const updatedShift = !isShift;
		setIsShift(updatedShift);
		const keys = document.querySelectorAll(".key");
		keys.forEach((key) => {
			const firstSpanElement = key.querySelector("span:first-child");
			const secondSpanElement = key.querySelector("span:nth-child(2)");
			if (firstSpanElement) {
				const keyText = firstSpanElement.innerText.toLowerCase();
				if (
					![
						"\u21E7 shift",
						"\u21B5 enter",
						"caps lock",
						"tab",
						"backspace",
						"clear all",
						"pageup",
						"pagedown",
						"esc",
					].includes(keyText)
				) {
					if ((updatedShift && isCaps) || (!updatedShift && !isCaps)) {
						firstSpanElement.innerText = keyText.toLowerCase();
					} else {
						firstSpanElement.innerText = keyText.toUpperCase();
					}
					if (isShift) {
						if (secondSpanElement) {
							firstSpanElement.style.color = "#121212";
							firstSpanElement.style.fontSize = "22px";
							secondSpanElement.style.color = "white";
							secondSpanElement.style.fontSize = "34px";
						}
					} else {
						if (secondSpanElement) {
							firstSpanElement.style.color = "white";
							firstSpanElement.style.fontSize = "34px";
							secondSpanElement.style.color = "#121212";
							secondSpanElement.style.fontSize = "22px";
						}
					}
				}
				if (keyText === "\u21E7 shift") {
					firstSpanElement.parentElement.style.backgroundColor = updatedShift
						? "#536974"
						: "#35454d";
				}
			}
		});
	};

	const onClose = () => {
		dispatch(virtualKeyboardSlice.actions.disableVirtualKeyboard());
	};

	const handleSpecialKey = async (key) => {
		try {
			await ipcRenderer.invoke(IPC_Channel.KEY_PRESS, key);
		} catch (error) {
			console.error(error);
		}
	}

	const handleRegularKey = (key) => {
		const keys = key.split(/[._]/);
		let keyValue;

		if (keys.length > 1) {
			if (isShift) {
				keyValue = keys.length === 3 ? (keys[0] === ">" ? ">" : "_") : keys[0];
			} else {
				keyValue = keys.length === 3 ? (keys[0] === ">" ? "." : "-") : keys[1];
			}
		} else {
			keyValue = (isShift && isCaps) || (!isShift && !isCaps)
				? key.toLowerCase()
				: key.toUpperCase();
		}
		dispatch(virtualKeyboardSlice.actions.handleInputTextChange({ keyValue }));
	};

	return (
		<Box
			className="keyboard-anchor"
			sx={{
				position: "fixed",
				left: keyboard.initialPosition.left,
				top: keyboard.initialPosition.top,
				transform: "translate(-50%, -50%)",
				zIndex: "100000"
			}}
		>
			<Draggable
				defaultPosition={{ x: keyboard.positionX, y: keyboard.positionY }}
				bounds={{ left: -1600, top: -800, right: 1600, bottom: 800 }}
				onStop={(e, data) => {
					dispatch(
						virtualKeyboardSlice.actions.updateKeyboardPosition({
							positionX: data.lastX,
							positionY: data.lastY,
						})
					);
				}}
			>
				<div className="keyboard" id="keyboard">
					<div
						className="container"
						onMouseDown={(e) => {
							e.preventDefault();
						}}
						onTouchStart={(e) => { }}
					>
						<div className="row">
							{["Esc"].map((keyvalue, index) => (
								<div
									key={index}
									className="key"
									onClick={() => handleKeyClick(keyvalue)}
									onTouchStart={() => handleKeyClick(keyvalue)}
								>
									<span>{keyvalue}</span>
								</div>
							))}
							<div className="drag">
								<svg width="30" height="30" viewBox="0 0 2048 2048">
									<path
										fill="#ffffff"
										d="m245 1024l206 205l-91 91L0 960l360-360l91 91l-206 205h395v128H245zm1675-64l-356 355l-90-90l201-201h-395V896h395l-206-205l91-91l360 360zM695 446l-90-90L960 0l360 360l-91 91l-205-206v395H896V245L695 446zm534 1023l91 91l-360 360l-360-360l91-91l205 206v-395h128v395l205-206z"
									/>
								</svg>
							</div>
							<div
								className="close"
								onClick={onClose}
								onTouchStart={() =>
									dispatch(onClose)
								}
							>
								<svg width="30" height="30" viewBox="0 0 50 50">
									<g fill="#ffffff" stroke="#fff" strokeWidth="4">
										<path fill="#ffffff" d="M8 40L40 8" />
										<path fill="#ffffff" d="M8 8L40 40" />
									</g>
								</svg>
							</div>
						</div>

						<div className="row">
							{keyboardRows[0].map((keyvalue) => (
								<div
									key={keyvalue}
									className="key"
									onClick={() => handleKeyClick(keyvalue)}
									onTouchStart={() => handleKeyClick(keyvalue)}
								>
									{keyvalue.includes(".") ? (
										keyvalue
											.split(".")
											.map((part, index) => <span key={index}>{part}</span>)
									) : (
										<span>{keyvalue}</span>
									)}
								</div>
							))}
						</div>
						<div className="row">
							{keyboardRows[1].map((keyvalue) => (
								<div
									key={keyvalue}
									className="key"
									onClick={() => handleKeyClick(keyvalue)}
									onTouchStart={() => handleKeyClick(keyvalue)}
								>
									{keyvalue.includes("_") ? (
										keyvalue
											.split("_")
											.map((part, index) => <span key={index}>{part}</span>)
									) : (
										<span>{keyvalue}</span>
									)}
								</div>
							))}
						</div>
						<div className="row">
							{keyboardRows[2].map((keyvalue) => (
								<div
									key={keyvalue}
									className="key"
									onClick={() => handleKeyClick(keyvalue)}
									onTouchStart={() => handleKeyClick(keyvalue)}
								>
									{keyvalue.includes("_") ? (
										keyvalue
											.split("_")
											.map((part, index) => <span key={index}>{part}</span>)
									) : (
										<span>{keyvalue}</span>
									)}
								</div>
							))}
						</div>
						<div className="row">
							{keyboardRows[3].map((keyvalue, index) => (
								<div
									key={index}
									className="key"
									onClick={() => handleKeyClick(keyvalue)}
									onTouchStart={() => handleKeyClick(keyvalue)}
								>
									{keyvalue.includes("_") ? (
										keyvalue
											.split("_")
											.map((part, index) => <span key={index}>{part}</span>)
									) : (
										<span>{keyvalue}</span>
									)}
								</div>
							))}
						</div>
						<div className="row">
							{keyboardRows[4].map((keyvalue, index) => (
								<div
									key={index}
									className="key"
									onClick={() => handleKeyClick(keyvalue)}
									onTouchStart={() => handleKeyClick(keyvalue)}
								>
									<span>{keyvalue}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</Draggable>
		</Box>
	);
}
