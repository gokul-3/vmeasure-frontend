import { THEMES } from "../constants";

import { customBlue, customGrey, customYellow } from '../constants/color'

const defaultVariant = {
  name: THEMES.DEFAULT,
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  palette: {
    mode: "light",
    primary: {
      main: '#307EC7',//customBlue[100],
      contrastText: "#FFF",
    },
    secondary: {
      main: '#4caf50',
      contrastText: "#FFF",
    },
    grey: {
      primary: customGrey[100],
      secondary: customGrey[200]
    },
    highlight: {
      primary: '#ffcd00',
      secondary: '#FFFAE7'
    },
    border: {
      primary: '#eee',
      secondary: '#FFFAE7'
    },
    background: {
      // default: "#F9FAFB",
      default: '#eeeeee',
      paper: "#FFF",
    },
    danger: {
      primary: "#FF0000",
      secondary: "#FF4600"
    },
    highlightFields: {
      primary: '#e1f5fe',
      secondary: '#4fc3f7'
    }
  },
  header: {
    color: customGrey[100],
    background: "#FFF",
    search: {
      color: customGrey[200],
    },
    indicator: {
      background: customBlue[200],
    },
  },
  footer: {
    color: customGrey[100],
    background: "#FFF",
  },
  sidebar: {
    fontfamily: "'Arial', 'sans-serif'",
    color: "#fff",
    fontWeight: "600",
    background: "#0877c4",
    active: "#6AC2E6",
    header: {
      color: "#fff",
      background: "#233044",
      brand: {
        color: customBlue[200],
      },
    },
    footer: {
      color: customGrey[200],
      background: "#1E2A38",
      online: {
        background: customYellow[100],
      },
    },
    badge: {
      color: "#FFF",
      background: customBlue[500],
    },
  },
};


const variants = [
  defaultVariant,
];

export default variants;

