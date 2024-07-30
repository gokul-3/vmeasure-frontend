import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux'
import { CircularProgress } from "@mui/material";

function RootPage() {
  console.log('rootpage')
  const { userInfo, isLoading } = useSelector((state) => state.userAuth)
  if (isLoading) {
    return <CircularProgress />
  } else if (userInfo) {
    return <Navigate to={'/menu'}></Navigate>
  } else {
    return <Navigate to='/auth/sign-in'></Navigate>
  }

}

export default RootPage;