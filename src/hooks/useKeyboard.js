import { useDispatch } from "react-redux";
import keyboard from "../redux/reducers/keyboard";
import keyboardStates from "../redux/reducers/keyboardStates"
import { closeOnboardKeyboard } from "../services/keyboard.service";

export const useKeyboard = () => {

  const dispatch = useDispatch()

  const showKeyboard = () => {
    dispatch(keyboard.actions.showKeyboard())
  };

  const hideKeyboard = () => {
    dispatch(keyboard.actions.hideKeyboard())
    closeOnboardKeyboard()
  };

  const changeInput = ({ inputValue }) => {
    dispatch(keyboardStates.actions.handleInputChange({ inputValue }))
  }

  const changeInputName = ({ inputNameValue }) => {
    dispatch(keyboardStates.actions.handleInputNameChange({ inputNameValue }))
  }

  const changeInitialInput = ({ initialInput }) => {
    dispatch(keyboardStates.actions.handleInitialInput({ initialInput }))
  }

  return [showKeyboard, hideKeyboard, changeInput, changeInputName, changeInitialInput];
};
