import React, { useCallback, useEffect, useState } from "react";
import usePermission from "../../hooks/usePermission";
import UpdateConfirmationPopup from "./update-utils/update-confirmation-popup";
import UpdatePageHeader from "./update-utils/update-page-header";
import softwareUpdate from "../../redux/reducers/software-update";

import CheckUpdate from "./update-states-components/check-update";
import UpdateAvailable from "./update-states-components/update-available";
import DownloadFlow from "./update-states-components/download-flow";
import DownloadCompletes from "./update-states-components/download.completed";
import DownloadFailed from "./update-states-components/download-failed";
import CheckUpdateFailed from "./update-states-components/check-update-failed";
import UpToDate from "./update-states-components/upto-date";
import DownloadButton from "./update-buttons/download";
import InstallButton from "./update-buttons/install";
import CloseButton from "./update-buttons/close";
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { SoftwareCheckState, SoftwareUpdateState } from "../../constants/sw-update";
import { checkForUpdates } from "../../services/software-update.service";
import { PermissionModules } from "../../constants";
import { useNavbar } from "../../hooks/useNavbar";

function UpdatePage() {

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [disabledNavBar, enabledNavBar] = useNavbar();

  const {
    is_download_in_progress,
    software_update_state,
    progress,
    additional_info
  } = useSelector((state) => state.softwareUpdate);

  const [hasPermission] = usePermission(PermissionModules.SOFTWARE_UPDATE);

  const [softwareCheckState, setSoftwareCheckState] = useState(null);
  const [releaseNotes, setReleaseNotes] = useState([]);
  const [version, setVersion] = useState(null);
  const [showConfirmationPopup, canShowConfirmationPopup] = useState(false);
  const [error, setError] = useState({ message: null, cause: null })
  const navigate = useNavigate();

  const checkForLatestUpdates = async () => {
    try {
      const { status, data, error } = await checkForUpdates();
      if (!status) {
        setSoftwareCheckState(SoftwareCheckState.CHECK_FOR_UPDATE_FAILED);
        setError({
          ...error,
          cause: error?.message,
          message: 'software_update_page.check_for_update.errors.' + error?.message
        });
        enabledNavBar();
        return;
      }

      if (data?.is_update_available) {
        const notes = data?.release_notes?.trim()?.split('\n');
        const finalReleseNotes = [];
        notes.forEach((note, index) => {
          if (note?.trim()) {
            finalReleseNotes.push(note);
          }
        })
        setReleaseNotes(finalReleseNotes);
        setSoftwareCheckState(SoftwareCheckState.UPDATE_AVAILABLE);
        setVersion(data?.app_version);
        enabledNavBar();
      } else {
        setSoftwareCheckState(SoftwareCheckState.UPTO_DATE);
        enabledNavBar();
      }
    } catch (err) {
      console.error("Error occured in checkForLatestUpdates :: ", JSON.stringify(err))
      setSoftwareCheckState(SoftwareCheckState.CHECK_FOR_UPDATE_FAILED);
      setError({ ...error, message: 'software_update_page.error.check_for_update', cause: null});
      enabledNavBar()
    }
  }

  const startDownload = () => {
    console.error('startDownload : ')
    canShowConfirmationPopup(false);
    setSoftwareCheckState(SoftwareCheckState.DOWNLOADING);
    dispatch(softwareUpdate.actions.startSoftwareUpdateDownload());
  }

  const handleSoftwareDownloadStateChange = () => {
    if (is_download_in_progress) {
      enabledNavBar();
      setSoftwareCheckState(SoftwareCheckState.DOWNLOADING)
    }

    else if (!is_download_in_progress && (
      software_update_state === SoftwareUpdateState.READY_TO_UPDATE ||
      software_update_state === SoftwareUpdateState.REBOOT_PENDING_AFTER_SUCCESS
    )) {
      setSoftwareCheckState(SoftwareCheckState.READY_TO_UPDATE);
    }

    else if (!is_download_in_progress && software_update_state === SoftwareUpdateState.FAILED) {
      setSoftwareCheckState(SoftwareCheckState.FAILED);
    }

    else if (!is_download_in_progress && software_update_state === SoftwareUpdateState.UPTO_DATE) {
      setSoftwareCheckState(SoftwareCheckState.UPTO_DATE);
    }

    else {
      setSoftwareCheckState(SoftwareCheckState.CHECKING_SOFTWARE_UPDATE)
      disabledNavBar();
      checkForLatestUpdates();
    }
  }


  useEffect(() => {

    if (software_update_state !== SoftwareUpdateState.DOWNLOADING_APPLICATION &&
      software_update_state !== SoftwareUpdateState.DOWNLOADING_SERVICES) {
      console.error('is_download_in_progress, software_update_state, progress, additional_info : ', is_download_in_progress, software_update_state, progress, additional_info);
    }

    handleSoftwareDownloadStateChange();
  }, [is_download_in_progress, software_update_state, progress, additional_info]);


  useEffect(() => {
    dispatch(softwareUpdate.actions.updateSoftwarePageControl({ is_control_in_update_page: true }));
    return () => {
      if (software_update_state === SoftwareUpdateState.FAILED) {
        dispatch(softwareUpdate.actions.updateSoftwareUpdateState({ update_state: SoftwareUpdateState.REINIT }));
      }
      dispatch(softwareUpdate.actions.updateSoftwarePageControl({ is_control_in_update_page: false }));
    }
  }, [])

  const onInstallLaterClick = () => {
    enabledNavBar();
    dispatch(softwareUpdate.actions.updateSoftwareUpdateState({ update_state: SoftwareUpdateState.REBOOT_PENDING_AFTER_SUCCESS }))
    navigate('/menu')
  }

  const handleBackButtonClick = () => {

    if (softwareCheckState === SoftwareCheckState.READY_TO_UPDATE) {
      onInstallLaterClick();
    } else {
      navigate(-1);
    }
  }

  return (
    <Grid container rowSpacing={5} height={'100%'}>
      <UpdatePageHeader onBackClick={handleBackButtonClick} />
      <Grid container item xs={12} height={'90%'} width={'auto'} >
        <Grid container item xs={12} height={'85%'} id="">

          <UpdateConfirmationPopup
            open={showConfirmationPopup}
            closeHandler={() => canShowConfirmationPopup(false)}
            proceedHandler={startDownload}
          />

          <Paper variant={'outlined'} elevation={0} sx={{ width: '100%' }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%", flexDirection: "column" }}>
              {
                softwareCheckState === SoftwareCheckState.CHECKING_SOFTWARE_UPDATE &&
                <CheckUpdate />
              }
              {
                softwareCheckState === SoftwareCheckState.CHECK_FOR_UPDATE_FAILED &&
                <CheckUpdateFailed error={error} />
              }
              {
                softwareCheckState === SoftwareCheckState.UPDATE_AVAILABLE &&
                <UpdateAvailable version={version} releaseNotes={releaseNotes} />
              }
              {
                softwareCheckState === SoftwareCheckState.DOWNLOADING &&
                <DownloadFlow />
              }
              {
                softwareCheckState === SoftwareCheckState.READY_TO_UPDATE &&
                <DownloadCompletes headerProps={{ marginBottom: '2vh' }} />
              }

              {
                softwareCheckState === SoftwareCheckState.FAILED &&
                <DownloadFailed headerProps={{ marginBottom: '2vh' }} />
              }
              {
                softwareCheckState === SoftwareCheckState.UPTO_DATE &&
                <UpToDate />
              }
            </Box>
          </Paper>
        </Grid>

        <Grid container item xs={12} height={'15%'} >
          <Box mt={3} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", height: "100%", width: "100%", gap: "2vw" }}>
            {
              hasPermission && softwareCheckState === SoftwareCheckState.UPDATE_AVAILABLE &&
              <DownloadButton canShowConfirmationPopup={canShowConfirmationPopup} />
            }
            {
              softwareCheckState === SoftwareCheckState.READY_TO_UPDATE &&
              <InstallButton onInstallLater={onInstallLaterClick} />
            }
            {
              (
                softwareCheckState === SoftwareCheckState.CHECK_FOR_UPDATE_FAILED ||
                softwareCheckState === SoftwareCheckState.FAILED ||
                softwareCheckState === SoftwareCheckState.UPTO_DATE
              ) &&
              <CloseButton enabledNavBar={enabledNavBar} redirectFromUpdatePage={true} />
            }
          </Box>
        </Grid>

      </Grid>
    </Grid>
  )
}

export default UpdatePage;