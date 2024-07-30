import React, { useEffect } from 'react'
import InstallButton from './update-buttons/install';
import CloseButton from './update-buttons/close';
import DownloadCompletes from './update-states-components/download.completed';
import DownloadFailed from './update-states-components/download-failed';
import { Dialog, DialogContent, Box, DialogContentText, DialogTitle, DialogActions, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { SoftwareUpdateState } from '../../constants/sw-update';
import { useTranslation } from "react-i18next";
import { useNavbar } from '../../hooks/useNavbar';
import softwareUpdate from "../../redux/reducers/software-update";
import usePermission from '../../hooks/usePermission';
import { PermissionModules } from '../../constants';
import CustomServiceNote from './update-utils/custom-service-note';
import { useLocation } from 'react-router-dom';

function SoftwareUpdateLayoutDialog() {
  const { t } = useTranslation();
  const [disabledNavBar, enabledNavBar] = useNavbar();
  const dispatch = useDispatch();

  const location = useLocation();

  const {
    software_update_state,
    is_control_in_update_page
  } = useSelector((state) => state.softwareUpdate);

  const [hasPermission] = usePermission(PermissionModules.SOFTWARE_UPDATE);

  const { success: authSuccess } = useSelector((state) => state.userAuth);
  const { status: workflowDownloadStatus } = useSelector((state) => state.workflow);
  const { blockPopupsAfterMeasureStart: blockPopupsAfterCustomServiceMeasureStart } = useSelector(state => state.customFlow);
  const handleInstallLater = () => {
    dispatch(softwareUpdate.actions.updateSoftwareUpdateState({ update_state: SoftwareUpdateState.REBOOT_PENDING_AFTER_SUCCESS }))
  }

  return (
    <Dialog
      open={
        !is_control_in_update_page && 
        location.pathname !== "/logout" &&
        authSuccess && //once after login
        workflowDownloadStatus && //once after workflow download complete
        (
          software_update_state === SoftwareUpdateState.FAILED ||
          software_update_state === SoftwareUpdateState.READY_TO_UPDATE
        ) &&
        !blockPopupsAfterCustomServiceMeasureStart
      }
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xl"
      fullWidth={true}
    >
      <DialogTitle margin={4}>
        <Typography variant="h3">
          {t("software_update_page.page_title")}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ marginX: 4 }}>
        <DialogContentText id="alert-dialog-description" component="span">
          <Box sx={{ display: "flex", alignItems: "flex-start", flexDirection: "column", gap: '0.4vh' }}>
            {
              software_update_state === SoftwareUpdateState.READY_TO_UPDATE &&
              <>
                <DownloadCompletes headerProps={{ variant: "h4" }} />
                <CustomServiceNote />
              </>
            }

            {
              software_update_state === SoftwareUpdateState.FAILED &&
              <DownloadFailed headerProps={{ variant: "h4" }} />
            }
          </Box>
        </DialogContentText>

      </DialogContent>
      <DialogActions sx={{ margin: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", height: "100%", width: "100%", gap: "1vw" }}>
          {
            software_update_state === SoftwareUpdateState.READY_TO_UPDATE &&
            <InstallButton onInstallLater={handleInstallLater} enabledNavBar={enabledNavBar} redirectFromUpdatePage={true} />
          }
          {
            software_update_state === SoftwareUpdateState.FAILED &&
            <CloseButton enabledNavBar={enabledNavBar} redirectFromUpdatePage={true} />
          }
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default SoftwareUpdateLayoutDialog