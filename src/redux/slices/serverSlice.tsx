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
    secret: sessionUserInfo !== null ? sessionUserInfo.secret : "",
  },
  registrationSuccess: false,
  sendingRegistration: false,
  sendingLogin: false,
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
      state.sendingLogin = false;
      sessionStorage.setItem(
        "user-info",
        JSON.stringify({
          email: state.user.email,
          username: state.user.username,
          secret: state.user.secret,
        })
      );
    },
    logOutSuccessful: (state) => {
      console.log("clearing");
      sessionStorage.clear();
      state.isAuth = false;
      state.user.email = "";
      state.user.username = "";
      state.user.secret = "";
    },
    registrationSuccessful: (state, action: PayloadAction<boolean>) => {
      state.registrationSuccess = action.payload;
      state.sendingRegistration = !action.payload;
    },
    updateSendingRegistration: (state, action: PayloadAction<boolean>) => {
      state.sendingRegistration = action.payload;
    },
    updateSendingLogin: (state, action: PayloadAction<boolean>) => {
      state.sendingLogin = action.payload;
    },
  },
});

// Actions
export const {
  loginSuccessful,
  logOutSuccessful,
  registrationSuccessful,
  updateSendingRegistration,
  updateSendingLogin,
} = serverSlice.actions;

// Selectors
export const getIsAuth = (state: RootState) => state.server.isAuth;
export const getUser = (state: RootState) => state.server.user;
export const getRegistrationSuccess = (state: RootState) =>
  state.server.registrationSuccess;
export const getSendingRegistration = (state: RootState) =>
  state.server.sendingRegistration;
export const getSendingLogin = (state: RootState) => state.server.sendingLogin;

export const registrationRequest = (user: RegistrationRequest): AppThunk => (
  dispatch
) => {
  //Send server
  // Once completed with success response from server
  dispatch(updateSendingRegistration(true));
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
          dispatch(registrationSuccessful(true));
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

export const loginRequest = (user: LoginRequestUser): AppThunk => (
  dispatch
) => {
  //Send server
  // Once completed with success response from server
  dispatch(updateSendingLogin(true));
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
      res
        .json()
        .then((response) => {
          if (response.message === "Success") {
            dispatch(
              loginSuccessful({
                email: user.email,
                username: user.email,
                secret: response.secret,
              })
            );
          } else {
            console.log(response.message);
            console.log(response.description);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    (error) => {
      console.log(error);
    }
  );
};

export const logOutUser = (): AppThunk => (dispatch) => {
  // Fetch
  fetch(`${apiUrl}/login`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(
    (resRaw) => {
      resRaw.json().then((response) => {
        dispatch(logOutSuccessful());
        if (response.message === "Success") {
        } else {
          console.log("Could not logout");
        }
      });
    },
    (error) => {
      console.log(error);
    }
  );
};

export default serverSlice.reducer;
