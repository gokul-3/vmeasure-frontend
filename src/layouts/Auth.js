import { CssBaseline } from "@mui/material";
import styled from "styled-components/macro";
import MuiPaper from "@mui/material/Paper"
import React from "react";
import GlobalSnackbar from '../components/global-snackbar'
import { Outlet } from "react-router-dom";
import { spacing } from "@mui/system";
import Topbar from "../components/topbar";
// import UserNavItems from '../components/sidebar/menuitems/user'

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: ${(props) => props.theme.palette.background.default};
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

`;

const AuthLayout = ({ children }) => {
  return (
    <Root>
      <CssBaseline />
      <AppContent>
        <Topbar isAuthLayout={true}/>
        {/* <Toolbar sx={{visibility: 'hidden'}}/> */}
        <GlobalSnackbar />
        <MainContent p={5} >
          {children}
          <Outlet />
        </MainContent>
      </AppContent>
    </Root>
  );
};

export default AuthLayout;
