import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux"
import { useTranslation } from 'react-i18next';

const Loader = () => {
  const { t } = useTranslation();
  const { loader } = useSelector(state => state.customFlow)

  return (
    <>
      {
        loader?.active &&
        <Box
          position={"absolute"}
          width={"100%"}
          height={"100%"}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          flexDirection={"row"}
          bgcolor={"rgba(255,255,255,0.5)"}
          zIndex={100}
          top={0}
          gap={5}
        >
          <CircularProgress size={70} />
          <Typography variant='h2' component={"h1"} color={"#000"}>
          {t('common.message.loading_text')}
          </Typography>
        </Box >
      }
    </>

  )
}

export default Loader;

//  <>
// {  
//   loader?.active &&
//   <Box
//     position={"absolute"}
//     width={"100%"}
//     height={"100%"}
//     display={'flex'}
//     justifyContent={'center'}
//     alignItems={'center'}
//     flexDirection={"column"}
//     bgcolor={"rgba(0,0,0,0.1)"}
//     zIndex={100}
//     top={0}
//     gap={5}
//   >
//     //<CircularProgress size={70} />
//    // <Typography variant='h5' component={"h1"} color={"#fff"}>
//     // {"Loading"}
//    // </Typography>
//   </Box >
// }
// </>