import "@mui/lab/themeAugmentation";

import { createTheme as createMuiTheme } from "@mui/material/styles";
import variants from "./variants";
import typography from "./typography";
import breakpoints from "./breakpoints";
import components from "./components";
import shadows from "./shadows";

const createTheme = (name) => {
  let themeConfig = variants.find((variant) => variant.name === name.toUpperCase());
  if (!themeConfig) {
    console.warn(new Error(`The theme ${name} is not valid`));
    themeConfig = variants[0];
  }

  let fontConfig = typography.find((typography) => typography.name === name.toUpperCase())
  if (!fontConfig) {
    console.warn(new Error(`The fontConfig ${name} is not valid`));
    fontConfig = typography[0];
  }

  let componentConfig = components.find((component) => component.name === name.toUpperCase())
  if (!componentConfig) {
    console.warn(new Error(`The componentconfig ${name} is not valid`));
    componentConfig = components[0];
  }

  return createMuiTheme(
    {
      spacing: 4,
      breakpoints: breakpoints,
      components: componentConfig,
      typography: fontConfig,
      shadows: shadows,
      palette: themeConfig.palette,
    },
    {
      name: themeConfig.name,
      header: themeConfig.header,
      footer: themeConfig.footer,
      sidebar: themeConfig.sidebar,
    }
  );
};

export default createTheme;
