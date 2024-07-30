import { createSlice } from '@reduxjs/toolkit'
import { SoftwareUpdateState } from "../../constants/sw-update"
import { startSoftwareUpdateDownloadProcess } from '../../services/software-update.service'

const initialState = {
  is_download_in_progress: false,
  software_update_state: null,
  progress: 0,
  additional_info: null,
  is_control_in_update_page: false,
  is_update_available: false
}

const softwareUpdateSlice = createSlice({
  name: 'software-update',
  initialState,
  reducers: {

    startSoftwareUpdateDownload(state, action) {
      state.is_download_in_progress = true;
      state.software_update_state = SoftwareUpdateState.PREPARING;
      state.progress = 0;
      state.additional_info = null;
      startSoftwareUpdateDownloadProcess().catch((err) => {
        console.error("error occured in startSoftwareUpdateDownloadProcess ", JSON.stringify(err))
      });
    },

    updateSoftwareUpdateProgress(state, action) {

      state.is_download_in_progress = !(
        action?.payload?.update_state === SoftwareUpdateState.FAILED ||
        action?.payload?.update_state === SoftwareUpdateState.READY_TO_UPDATE ||
        action?.payload?.update_state === SoftwareUpdateState.UPTO_DATE ||
        action?.payload?.update_state === SoftwareUpdateState.REBOOT_PENDING_AFTER_SUCCESS
      );

      state.is_update_available = true;

      state.software_update_state = action?.payload?.update_state;
      state.additional_info = action?.payload?.additional_info;
      if (action?.payload?.download_progress) {
        state.progress = action?.payload?.download_progress;
      }

    },

    updateSoftwareUpdateState(state, action) {
      state.software_update_state = action?.payload?.update_state;
    },

    updateSoftwarePageControl(state, action) {
      state.is_control_in_update_page = action?.payload?.is_control_in_update_page;
    },

    updateIsUpdateAvailable(state, action) {
      state.is_update_available = action?.payload?.is_update_available;
    }
  },
})

const data = {
  actions: softwareUpdateSlice.actions,
  reducer: softwareUpdateSlice.reducer
}
export default data