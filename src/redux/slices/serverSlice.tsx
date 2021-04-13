import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store/store";
import fetch from "cross-fetch";
import {
  LoggedInUser,
  LoginRequestUser,
  RegistrationRequest,
} from "../interfaces/interfaces";

let apiUrl = "/.netlify/functions";

if (process.env.REACT_APP_DEV === "true") {
  apiUrl = "http://localhost:9000" + apiUrl;
}

const data = sessionStorage.getItem("user-info");
let sessionUserInfo = null;
if (data !== null) {
  sessionUserInfo = JSON.parse(data);
}

const initialState = {
  isAuth: sessionUserInfo !== null ? true : false,
  user: {
    email: sessionUserInfo !== null ? sessionUserInfo.email : "",
    username: sessionUserInfo !== null ? sessionUserInfo.username : "",
    secret: "",
  },
};

// Redux Slice
const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    loginSuccessful: (state, action: PayloadAction<LoggedInUser>) => {
      const { email, username, secret } = action.payload;
      state.isAuth = true;
      state.user.email = email;
      state.user.username = username;
      state.user.secret = secret;
      sessionStorage.setItem(
        "user-info",
        JSON.stringify({
          email: state.user.email,
          username: state.user.username,
        })
      );
      window.location.replace("/home");
    },
    logOutUser: (state) => {
      sessionStorage.clear();
      state.isAuth = false;
      state.user.email = "";
      state.user.username = "";
      state.user.secret = "";
    },
  },
});

// Actions
export const { loginSuccessful, logOutUser } = serverSlice.actions;

// Selectors
export const getIsAuth = (state: RootState) => state.server.isAuth;
export const getUser = (state: RootState) => state.server.user;

export const registrationRequest = (user: RegistrationRequest): AppThunk => (
  dispatch
) => {
  //Send server
  // Once completed with success response from server
  fetch(`${apiUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      username: user.username,
      password: user.password,
      accessLevel: user.accessLevel,
    }),
  }).then(
    (res) => {
      res.json().then((response) => {
        if (response.message === "Successful") {
          window.location.replace("/user/login");
          return true;
        } else {
          return false;
        }
      });
    },
    (error) => {
      console.log(error);
    }
  );
};

export const sendLoginAsync = (user: LoginRequestUser): AppThunk => (
  dispatch
) => {
  //Send server
  // Once completed with success response from server
  fetch(`${apiUrl}/login`, {
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
      res.json().then((response) => {
        dispatch(
          loginSuccessful({
            email: user.email,
            username: response.username,
            secret: response.secret,
          })
        );
      });
    },
    (error) => {
      console.log(error);
    }
  );
};

export const logOutUserAsync = (): AppThunk => (dispatch) => {
  dispatch(logOutUser());
};

export default serverSlice.reducer;
