import MuiSwitch from "@mui/material/Switch";
import styled from "styled-components/macro";

const Switch = styled(MuiSwitch)(({ theme }) => ({
  width: 75,
  height: 40,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(2px)",
    "&.Mui-checked": {
      transform: "translateX(32px)",
    },
    '&.Mui-checked .MuiSwitch-thumb': {
      color: theme.palette.primary.main
    }
  },
  "& .MuiSwitch-thumb": {
    width: 36,
    height: 36,
    color: theme.palette.grey.secondary
  },
  "& .MuiSwitch-thumb": {
    width: 36,
    height: 36,
    color: theme.palette.grey.secondary
  },
  "& .MuiSwitch-track": {
    borderRadius: 20,
  },
}));

export const PrimaryColorSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-thumb": {
    width: 36,
    height: 36,
    color: theme.palette.primary.main
  },
  "& .MuiSwitch-track": {
    backgroundColor: theme.palette.primary.main
  },
}));

export default Switch;