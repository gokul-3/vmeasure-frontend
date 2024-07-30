import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showConfirmation: false,
  pairedStatus:false,
  lastAction:null,
  autoLoginRequest:false,
  refreshTime : false,
  isTimeSynced : false,
  operator:{
    id:null,
    name:null,
    email:null,
    user_type:null
  }
}

const DeviceAPISlice = createSlice({
  name: 'device-api',
  initialState,
  reducers: {
    openConfirmation(state,action) {
      state.showConfirmation = action?.payload?.showConfirmation;
    },
    closeConfirmation(state,action) {
      state.showConfirmation = action?.payload?.showConfirmation; 
      state.pairedStatus = action?.payload?.pairedStatus;
      state.lastAction = action?.payload?.lastAction;
    },
    updateAutoLoginRequest(state,action){
      state.autoLoginRequest = action?.payload?.autoLogin;
      state.operator.id = action?.payload?.user_id;
      state.operator.name = action?.payload?.user_name;
      state.operator.email = action?.payload?.email;
      state.operator.user_type = action?.payload?.user_type;
    },
    disableAutoLoginRequest(state){
      state.autoLoginRequest = false
    },
    setPairStatus(state,action){
      state.pairedStatus = action?.payload
    },
    triggerRefreshTime(state,action){
      state.refreshTime = action?.payload
    },
    updateTimeSync(state,action){
      state.isTimeSynced = action?.payload
    }
  },
});

const data = {
  actions: DeviceAPISlice.actions,
  reducer: DeviceAPISlice.reducer
}
export default data
