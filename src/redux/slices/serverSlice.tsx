import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store/store";
import fetch from "cross-fetch";

interface User {
  email: string;
  password: string;
}

// Redux Slice
const serverSlice = createSlice({
  name: "server",
  initialState: {
    isAuth: false,
    user: {
      email: "",
      username: "",
    },
  },
  reducers: {
    sendRegistration: (state, action: PayloadAction<object>) => {
      const { payload } = action;
      console.log("after sent to server");
      console.log(payload);
    },
    loginSuccessful: (state, action: PayloadAction<User>) => {
      const { email, password } = action.payload;
      state.isAuth = true;
      state.user.email = email;
      state.user.username = "James";
    },
  },
});

// Actions
export const { sendRegistration, loginSuccessful } = serverSlice.actions;

// Selectors
export const getIsAuth = (state: RootState) => state.server.isAuth;
export const getUser = (state: RootState) => state.server.user;

export const sendRegistrationAsync = (user: object): AppThunk => (dispatch) => {
  //Send server
  console.log("Async sending to server");
  // Once completed with success response from server
  dispatch(sendRegistration(user));
};
export const sendLoginAsync = (user: User): AppThunk => (dispatch) => {
  //Send server
  console.log("Async sending to server");
  // Once completed with success response from server
  dispatch(loginSuccessful({ email: user.email, password: user.password }));
  fetch("http://localhost:9000/login", {
    method: "GET",
  }).then(
    (res) => {
      res.json().then((json) => {
        console.log(json);
      });
    },
    (error) => {
      console.log(error);
    }
  );
};

export default serverSlice.reducer;
