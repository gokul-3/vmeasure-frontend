import { useDispatch } from "react-redux";
import navigationControl from "../redux/reducers/nav-bar-controller";

export const useNavbar = () => {

    const dispatch = useDispatch()

    const disabledNavBar = () => {
        dispatch(navigationControl.actions.disableNavigation())
    }

    const enabledNavBar = () => {
        dispatch(navigationControl.actions.enaleNavigation())
    }


    return [disabledNavBar, enabledNavBar]; 
};
