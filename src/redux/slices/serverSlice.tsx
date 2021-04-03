import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store/store";

// Redux Slice
const serverSlice = createSlice({
  name: "server",
  initialState: {},
  reducers: {
    sendRegistration: (state, action: PayloadAction<object>) => {
      const { payload } = action;
      console.log("after sent to server");
      console.log(payload);
    },
  },
});

// Actions
export const { sendRegistration } = serverSlice.actions;

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

export default serverSlice.reducer;
