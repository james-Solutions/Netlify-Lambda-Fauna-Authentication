import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store/store";
import fetch from "cross-fetch";
import {
  LoggedInUser,
  LoginRequestUser,
  RegistrationRequest,
} from "../interfaces/interfaces";

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
    registrationSuccessful: (state, action: PayloadAction<object>) => {
      const { payload } = action;
    },
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
export const {
  registrationSuccessful,
  loginSuccessful,
  logOutUser,
} = serverSlice.actions;

// Selectors
export const getIsAuth = (state: RootState) => state.server.isAuth;
export const getUser = (state: RootState) => state.server.user;

export const sendRegistrationAsync = (user: RegistrationRequest): AppThunk => (
  dispatch
) => {
  //Send server
  // Once completed with success response from server
  fetch("/.netlify/functions/register", {
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
      res.json().then((json) => {
        // TODO: Return a true/false depending if the request was successful.
        // dispatch(
        //   registrationSuccessful({
        //     email: user.email,
        //     username: json.username,
        //     secret: json.secret,
        //   })
        // );
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
  fetch("/.netlify/functions/login", {
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
        dispatch(
          loginSuccessful({
            email: user.email,
            username: json.username,
            secret: json.secret,
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
