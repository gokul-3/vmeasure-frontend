import {
  Grid,
  Typography,
  Paper
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import Chip from '@mui/material/Chip';
import { PageTitle } from "../../components/custom-text-message/page-title";

export default function CalibrationHeader({ time, lastcalibratedMode }) {
  const { t } = useTranslation();
  const { is_calibration_completed } = useSelector((state) => state.appState);



  return (
    <Grid xs={12} display={"flex"} alignItems={"center"} justifyContent="space-between" >
      <Grid item width={"65%"} display={"flex"} justifyContent={"space-between"}>
        <Grid item display={"flex"} alignItems={"center"}>
          <PageTitle title={t('calibration_page.page_title')} />
        </Grid>
        <Grid item xs={8} display={"flex"} alignItems={"center"} justifyContent={"flex-end"}>
          <Typography variant="body5" marginRight={"2%"}>
            {t('calibration_page.last_calibrated_mode')}
          </Typography>
          <Chip label={lastcalibratedMode ?? "NA"} color="success" sx={{ fontSize: '2.3em', padding: "0.9em 0.5em" }} />
        </Grid>
      </Grid>
      <Grid item width={'32.5%'} display={"flex"} alignItems={"center"} justifyContent={'center'}>
        <Paper variant={'outlined'} sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          padding: "2%"
        }} >
          <Typography variant="body5">
            {(time && is_calibration_completed) ? t('calibration_page.calibration_expires_at') : t('calibration_page.calibration_status')}
          </Typography>
          <Typography variant="body4" fontWeight="200" marginLeft={'1%'}>
            {(time && is_calibration_completed) ?
              time :
              <Chip label={t("calibration_page.calibration_expired")} sx={{ fontSize: '1em', padding: "0.9em 0.5em", background: "rgb(242, 48, 34)", color: "white" }} />}
          </Typography>
        </Paper>
      </Grid>

    </Grid>
  )
}