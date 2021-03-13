import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Redux Slice
const serverSlice = createSlice({
  name: "server",
  initialState: {},
  reducers: {
    sendRegistration: (state, action: PayloadAction<object>) => {
      const { payload } = action;
      console.log(payload);
    },
    // setConnected: (state, action) => {
    //     state.isConnected = action.payload;
    // },
    // setUpload: (state, action) => {
    //     state.isUpload = action.payload;
    // },
    // setDownload: (state, action) => {
    //     state.isDownload = action.payload;
    // },
    // setIsFileInQueue: (state, action) => {
    //     state.isFileInQueue = action.payload;
    // },
    // setNumFilesInQueue: (state, action) => {
    //     state.numFilesInQueue = action.payload;
    // },
    // setProcessingHost: (state, action) => {
    //     state.processingHost = action.payload;
    // },
    // setCurrentProcessingFile: (state, action) => {
    //     state.currentProcessingFile = action.payload;
    // },
    // setCommandServerConnection: (state, action) => {
    //     const { payload } = action;
    //     // action payload is either connect or disconnect
    //     if (payload.toLowerCase() === 'connect') {
    //         commandServer.connect();
    //         state.isConnected = true;
    //     } else {
    //         commandServer.disconnect();
    //         state.isConnected = false;
    //     }
    // },
    // setFileServerConnection: (state, action) => {
    //     const { payload } = action;
    //     // action payload is either connect or disconnect
    //     if (payload.toLowerCase() === 'connect') {
    //         //TODO: Do we want to keep track of file server connection status in the store?
    //         // Currently, in `App.js` we are only updating `isConnected` for command server
    //         fileServer.connect();
    //     } else {
    //         fileServer.disconnect();
    //     }
    // },
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

export default serverSlice.reducer;
