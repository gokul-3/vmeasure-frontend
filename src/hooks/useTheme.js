import { useContext } from "react";
import { ThemeContext } from  "../components/context/theme-context"

const useTheme = () => {
    return useContext(ThemeContext)
};

export default useTheme;
