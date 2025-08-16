import { createSlice } from '@reduxjs/toolkit';

export interface interfaceStatus {
  loginStatus: boolean;
}

const initialStatus: interfaceStatus = {
  loginStatus: false,
};

export const interfaceStatus_slice = createSlice({
  name: 'InterfaceStatus',
  initialState: initialStatus,
  reducers: {
    showLogin: (state) => {
      state.loginStatus = true;
    },
    hiddenLogin: (state) => {
      state.loginStatus = false;
    },
  },
});

export const { showLogin, hiddenLogin } = interfaceStatus_slice.actions;
export default interfaceStatus_slice.reducer;
