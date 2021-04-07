import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store/store";

// Redux Slice
const serverSlice = createSlice({
  name: "server",
  initialState: { isAuth: false },
  reducers: {
    sendRegistration: (state, action: PayloadAction<object>) => {
      const { payload } = action;
      console.log("after sent to server");
      console.log(payload);
    },
    sendLogin: (state, action: PayloadAction<object>) => {
      console.log(state.isAuth);
      const { payload } = action;
      console.log("after sent to server");
      console.log(payload);
      state.isAuth = true;
    },
  },
});

// Actions
export const { sendRegistration, sendLogin } = serverSlice.actions;

// Selectors
// export const selectConnectionInfo = (state) => {
//     const { isConnected, isUpload, isDownload } = state.server;

//     return { isConnected, isUpload, isDownload };
// };
// export const selectNumFilesInQueue = (state) => state.server.numFilesInQueue;

export const sendRegistrationAsync = (user: object): AppThunk => (dispatch) => {
  //Send server
  console.log("Async sending to server");
  // Once completed with success response from server
  dispatch(sendRegistration(user));
};
export const sendLoginAsync = (user: object): AppThunk => (dispatch) => {
  //Send server
  console.log("Async sending to server");
  // Once completed with success response from server
  dispatch(sendLogin(user));
};

export default serverSlice.reducer;
