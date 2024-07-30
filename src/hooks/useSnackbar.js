import { useDispatch } from "react-redux";
import snackbar from "../redux/reducers/snackbar";

export const useSnackbar = () => {

  const dispatch = useDispatch()

  const showSnackbar = ({ message, autoHideDuration = 6000, vertical = "top", horizontal = "center", severity = "info" }) => {
    dispatch(snackbar.actions.showSnackbar({ message, autoHideDuration, vertical, horizontal, severity }))
  };

  const hideSnackbar = () => {
    dispatch(snackbar.actions.hideSnackbar())
  };

  return [showSnackbar, hideSnackbar];
};
