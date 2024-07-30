import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import * as operatorService from '../../services/operator.service'

const initialState = {
  isLoading: false,
  error: null,
  success: false,
  userInfo: null,
  systemInfo: null,
  refresh_login_page: false
}

const userLogin = createAsyncThunk(
  'user/login',
  async ({ id, pin }, { rejectWithValue }) => {
    try {
      const data = await operatorService.validateOperatorPIN({ id, pin });
      console.log('user auth : data : ', data)
      if (!data.status) {
        return rejectWithValue(data.error.message)
      }
      return data
    } catch (error) {
      // return custom error message from API if any
      if (error?.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  }
)

const userLogout = createAsyncThunk(
  'user/logout',
  async (data, { rejectWithValue }) => {
    try {
      return await operatorService.logoutOperatorSession();
    } catch (error) {
      // return custom error message from API if any
      if (error?.response?.data?.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetState(state, action) {
      state.isLoading = false;
      state.error = null;
      state.success = false;
      state.userInfo = null;
    },
    doAutoLogin(state, action) {
      state.isLoading = false;
      state.error = null;
      state.success = action.payload?.autoLogin;
      state.userInfo = {
        id: action.payload?.user_id,
        name: action.payload?.user_name,
        email: action.payload?.email,
        user_type:  action.payload?.user_type,
      };
    },
    updateSystemInfo(state, action) {
      state.systemInfo = action.payload
    },
    updateUserLoginInfo(state, action) {
      state.isLoading = false;
      state.success = action.payload.isAuthSuccess;
      state.userInfo = action.payload.operator;
    },
    autoRefreshLoginPage(state,action) {
      state.refresh_login_page = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.success = false;
      })
      .addCase(userLogin.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.success = payload.status;
        console.log('success ', payload)
        if (payload.status) {
          state.userInfo = payload.data.operator;
        } else {
          state.error = payload.error;
        }

      })
      .addCase(userLogin.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.success = false;
        state.error = payload;
      })
      .addCase(userLogout.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.userInfo = null;
        state.error = null;
        state.success = false;
      })
      .addCase(userLogout.pending, (state, { payload }) => {
        state.isLoading = true
      })
      .addCase(userLogout.rejected, (state, { payload }) => {
        console.log("userLogout.rejected  : ", payload)
        state.isLoading = false
        state.error = payload
        state.success = false
        state.userInfo = null
        state.error = null
        state.success = false
      })
  },
})

const data = {
  actions: userSlice.actions,
  reducers: userSlice.reducer,
  extraActions: {
    userLogin,
    userLogout
  }
}

export default data
