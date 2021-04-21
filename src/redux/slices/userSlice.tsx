import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store/store";
import fetch from "cross-fetch";
import {
  LoggedInUser,
  LoginRequestUser,
  RegistrationRequest,
  VerifyUser,
} from "../interfaces/interfaces";
import * as constants from "../../constants";

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
  loginError: false,
  loginErrorMessage: "",
  verificationCode: 0,
  verificationSuccess: false,
  verificationError: false,
  verificationErrorMessage: "",
  verificationSending: false,
};

// Redux Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccessful: (state, action: PayloadAction<LoggedInUser>) => {
      const { email, username, secret } = action.payload;
      state.isAuth = true;
      state.user.email = email;
      state.user.username = username;
      state.user.secret = secret;
      state.sendingLogin = false;
      state.loginError = false;
      state.loginErrorMessage = "";
      sessionStorage.setItem(
        "user-info",
        JSON.stringify({
          email: state.user.email,
          username: state.user.username,
          secret: state.user.secret,
        })
      );
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.sendingLogin = false;
      state.loginError = true;
      state.loginErrorMessage = action.payload;
    },
    logOutSuccessful: (state) => {
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
      state.loginError = !action.payload;
      state.loginErrorMessage = "";
    },
    setVerificationCode: (state, action: PayloadAction<number>) => {
      state.verificationCode = action.payload;
    },
    setVerificationSuccess: (state) => {
      state.verificationCode = 0;
      state.verificationError = false;
      state.verificationErrorMessage = "";
      state.verificationSuccess = true;
      state.verificationSending = false;
    },
    setVerificationFailure: (state, action: PayloadAction<string>) => {
      state.verificationError = true;
      state.verificationSending = false;
      state.verificationErrorMessage = action.payload;
    },
    setVerificationSending: (state, action: PayloadAction<boolean>) => {
      state.verificationError = false;
      state.verificationErrorMessage = "";
      state.verificationSending = action.payload;
    },
    setVerificationMessage: (state, action: PayloadAction<string>) => {
      state.verificationErrorMessage = action.payload;
    },
  },
});

// Actions
export const {
  loginSuccessful,
  loginFailure,
  logOutSuccessful,
  registrationSuccessful,
  updateSendingRegistration,
  updateSendingLogin,
  setVerificationCode,
  setVerificationSuccess,
  setVerificationFailure,
  setVerificationSending,
  setVerificationMessage,
} = userSlice.actions;

// Selectors
export const getIsAuth = (state: RootState) => state.user.isAuth;
export const getUser = (state: RootState) => state.user.user;
export const getRegistrationSuccess = (state: RootState) =>
  state.user.registrationSuccess;
export const getSendingRegistration = (state: RootState) =>
  state.user.sendingRegistration;
export const getSendingLogin = (state: RootState) => state.user.sendingLogin;
export const getLoginError = (state: RootState) => state.user.loginError;
export const getLoginErrorMessage = (state: RootState) =>
  state.user.loginErrorMessage;
export const getVerificationCode = (state: RootState) =>
  state.user.verificationCode;
export const getVerificationSuccess = (state: RootState) =>
  state.user.verificationSuccess;
export const getVerificationError = (state: RootState) =>
  state.user.verificationError;
export const getVerificationErrorMessage = (state: RootState) =>
  state.user.verificationErrorMessage;
export const getVerificationSending = (state: RootState) =>
  state.user.verificationSending;

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
          if (response.message === constants.STATUS.SUCCESS) {
            dispatch(
              loginSuccessful({
                email: user.email,
                username: user.email,
                secret: response.secret,
              })
            );
          } else {
            dispatch(loginFailure(response.description));
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
        if (response.message === constants.STATUS.SUCCESS) {
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

export const fetchVerificationCode = (user: VerifyUser): AppThunk => (
  dispatch
) => {
  // Fetch
  fetch(`${apiUrl}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
    }),
  }).then(
    (resRaw) => {
      resRaw.json().then((response) => {
        if (response.message === constants.STATUS.SUCCESS) {
          dispatch(setVerificationCode(response.code));
          if (
            response.description === constants.USER_ERRORS.NO_CODE_UNVERIFIED
          ) {
            dispatch(setVerificationMessage(response.description));
          }
        } else {
          dispatch(setVerificationFailure(response.description));
        }
      });
    },
    (error) => {
      console.log(error);
    }
  );
};

export const verifyVerificationCode = (user: {
  email: string;
  code: number;
}): AppThunk => (dispatch) => {
  dispatch(setVerificationSending(true));
  // Fetch
  fetch(`${apiUrl}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      code: user.code,
    }),
  }).then(
    (resRaw) => {
      resRaw.json().then((response) => {
        if (response.message === constants.STATUS.SUCCESS) {
          dispatch(setVerificationSuccess());
        } else {
          console.log("Could not validate the code");
          dispatch(setVerificationFailure(response.description));
        }
      });
    },
    (error) => {
      console.log(error);
    }
  );
};

export default userSlice.reducer;
