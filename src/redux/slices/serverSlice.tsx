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
  hashedSecret: string;
}
const data = sessionStorage.getItem("user-info");
let sessionUserInfo = null;
if (data !== null) {
  sessionUserInfo = JSON.parse(data);
}

const initialState = {
  isAuth: false,
  user: {
    email: sessionUserInfo !== null ? sessionUserInfo.email : "",
    username: sessionUserInfo !== null ? sessionUserInfo.username : "",
    hashedSecret: "",
  },
};

// Redux Slice
const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    sendRegistration: (state, action: PayloadAction<object>) => {
      const { payload } = action;
      console.log("after sent to server");
      console.log(payload);
    },
    loginSuccessful: (state, action: PayloadAction<LoggedInUser>) => {
      const { email, username, hashedSecret } = action.payload;
      state.isAuth = true;
      state.user.email = email;
      state.user.username = username;
      state.user.hashedSecret = hashedSecret;
      sessionStorage.setItem(
        "user-info",
        JSON.stringify({
          email: state.user.email,
          username: state.user.username,
        })
      );
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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      password: user.password,
    }),
  }).then(
    (res) => {
      res.json().then((json) => {
        console.log(json);
        dispatch(
          loginSuccessful({
            email: user.email,
            username: json.username,
            hashedSecret: json.hashedSecret,
          })
        );
      });
    },
    (error) => {
      console.log(error);
    }
  );
};

export default serverSlice.reducer;
