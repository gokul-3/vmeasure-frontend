import { useEffect } from "react";
import { useLocation } from "react-router-dom"

export default function AccessDenied() {
  const loc = useLocation();

  useEffect(() => {
    console.log('LOCATION : ',loc)
  }, [loc])

  return (
    <h1>
      Page Not Found
    </h1>
  )
}