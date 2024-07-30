import Done from '@mui/icons-material/Done';
import Close from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import RemoveCircle from "@mui/icons-material/RemoveCircle";
import AddCircle from "@mui/icons-material/AddCircle";
import Print from "@mui/icons-material/Print"
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline"
import CheckCircle from "@mui/icons-material/CheckCircle"
import CancelIcon from '@mui/icons-material/Cancel';
import Settings from "@mui/icons-material/Settings";
import SquareFoot from '@mui/icons-material/SquareFoot';
import AccessTime from "@mui/icons-material/AccessTime";

const availableIcons = {
    Done,
    Close,
    Visibility,
    VisibilityOff,
    RemoveCircle,
    AddCircle,
    Print,
    CheckCircleOutline,
    CheckCircle,
    CancelIcon,
    Settings,
    SquareFoot,
    AccessTime
}

const getIcon = (icon) => {
    try {
        return availableIcons[icon]
    } catch (err) {
        return Done
    }
}

export default getIcon