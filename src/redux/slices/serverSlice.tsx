import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store/store";
import fetch from "cross-fetch";

interface LoginRequestUser {
  email: string;
  password: string;
}

interface LoggedInUser {
  email: string;
  username: string;
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
    loginSuccessful: (state, action: PayloadAction<LoggedInUser>) => {
      const { email, username } = action.payload;
      state.isAuth = true;
      state.user.email = email;
      state.user.username = username;
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
export const sendLoginAsync = (user: LoginRequestUser): AppThunk => (
  dispatch
) => {
  //Send server
  // Once completed with success response from server
  fetch("http://localhost:9000/login", {
    method: "GET",
  }).then(
    (res) => {
      res.json().then((json) => {
        console.log(json);
        dispatch(
          loginSuccessful({ email: user.email, username: json.username })
        );
      });
    },
    (error) => {
      console.log(error);
    }
  );
};

export default serverSlice.reducer;
