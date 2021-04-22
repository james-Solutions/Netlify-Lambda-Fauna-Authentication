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
import { unapprovedUser } from "../../components/user/Interfaces";
const cookie = require("react-cookies");

let apiUrl = "/.netlify/functions";

if (process.env.REACT_APP_DEV === "true") {
  apiUrl = "http://localhost:9000" + apiUrl;
}

const cookieUserInfo = cookie.load("user-info");
let unverifiedUsers: unapprovedUser[] = [];

const initialState = {
  isAuth: cookieUserInfo !== undefined ? true : false,
  user: {
    email: cookieUserInfo !== undefined ? cookieUserInfo.email : "",
    username: cookieUserInfo !== undefined ? cookieUserInfo.username : "",
    secret: cookieUserInfo !== undefined ? cookieUserInfo.secret : "",
    accessLevel: cookieUserInfo !== undefined ? cookieUserInfo.accessLevel : "",
  },
  registrationSuccess: false,
  registrationSending: false,
  registrationErrorMessage: "",
  loginSending: false,
  loginError: false,
  loginErrorMessage: "",
  verificationCode: 0,
  verificationSuccess: false,
  verificationError: false,
  verificationErrorMessage: "",
  verificationSending: false,
  unverifiedUsers,
  fetchingUnverifiedUsers: false,
  fetchingUnverifiedUsersErrorMessage: "",
};

// Redux Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccessful: (state, action: PayloadAction<LoggedInUser>) => {
      const { email, username, secret, accessLevel } = action.payload;
      state.isAuth = true;
      state.user.email = email;
      state.user.username = username;
      state.user.accessLevel = accessLevel;
      state.user.secret = secret;
      state.loginSending = false;
      state.loginError = false;
      state.loginErrorMessage = "";
      cookie.save("user-info", state.user, {
        path: "/",
        maxAge: 21600,
      });
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loginSending = false;
      state.loginError = true;
      state.loginErrorMessage = action.payload;
    },
    logOutSuccessful: (state) => {
      cookie.remove("user-info", { path: "/" });
      state.isAuth = false;
      state.user.email = "";
      state.user.username = "";
      state.user.secret = "";
    },
    registrationSuccessful: (state) => {
      state.registrationSuccess = true;
      state.registrationSending = false;
    },
    registrationFailure: (state, action: PayloadAction<string>) => {
      state.registrationSuccess = false;
      state.registrationSending = false;
      state.registrationErrorMessage = action.payload;
    },
    updateSendingRegistration: (state, action: PayloadAction<boolean>) => {
      state.registrationSending = action.payload;
    },
    updateSendingLogin: (state, action: PayloadAction<boolean>) => {
      state.loginSending = action.payload;
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
    setFetchingUnverifiedUsers: (state) => {
      state.fetchingUnverifiedUsers = true;
    },
    unverifiedUsersSuccessful: (
      state,
      action: PayloadAction<Array<unapprovedUser>>
    ) => {
      state.unverifiedUsers = action.payload;
      state.fetchingUnverifiedUsers = false;
    },
    unverifiedUsersFailure: (state, action: PayloadAction<string>) => {
      state.fetchingUnverifiedUsersErrorMessage = action.payload;
      state.fetchingUnverifiedUsers = false;
    },
  },
});

// Actions
export const {
  loginSuccessful,
  loginFailure,
  logOutSuccessful,
  registrationSuccessful,
  registrationFailure,
  updateSendingRegistration,
  updateSendingLogin,
  setVerificationCode,
  setVerificationSuccess,
  setVerificationFailure,
  setVerificationSending,
  setVerificationMessage,
  setFetchingUnverifiedUsers,
  unverifiedUsersSuccessful,
  unverifiedUsersFailure,
} = userSlice.actions;

// Selectors
export const getIsAuth = (state: RootState) => state.user.isAuth;
export const getUser = (state: RootState) => state.user.user;
export const getRegistrationSuccess = (state: RootState) =>
  state.user.registrationSuccess;
export const getSendingRegistration = (state: RootState) =>
  state.user.registrationSending;
export const getRegistrationErrorMessage = (state: RootState) =>
  state.user.registrationErrorMessage;
export const getSendingLogin = (state: RootState) => state.user.loginSending;
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
export const getUnverifiedUsers = (state: RootState) =>
  state.user.unverifiedUsers;
export const getFetchingUnverifiedUsers = (state: RootState) =>
  state.user.fetchingUnverifiedUsers;
export const getUnverifiedUsersErrorMessage = (state: RootState) =>
  state.user.fetchingUnverifiedUsersErrorMessage;

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
        if (response.message === constants.STATUS.SUCCESS) {
          dispatch(registrationSuccessful());
        } else {
          dispatch(registrationFailure(response.description));
        }
      });
    },
    (error) => {
      dispatch(registrationFailure(error));
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
                username: response.username,
                secret: response.secret,
                accessLevel: response.accessLevel,
              })
            );
          } else {
            dispatch(loginFailure(response.description));
          }
        })
        .catch((error) => {
          dispatch(loginFailure(error));
        });
    },
    (error) => {
      dispatch(loginFailure(error));
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
      dispatch(setVerificationFailure(error));
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
          dispatch(setVerificationFailure(response.description));
        }
      });
    },
    (error) => {
      dispatch(setVerificationFailure(error));
    }
  );
};

export const fetchUnverifiedUsers = (): AppThunk => (dispatch) => {
  dispatch(setFetchingUnverifiedUsers());
  // Fetch
  fetch(`${apiUrl}/approve`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(
    (resRaw) => {
      resRaw.json().then((response) => {
        if (response.message === constants.STATUS.SUCCESS) {
          // Success
          dispatch(unverifiedUsersSuccessful(response.users));
        } else {
          // Failure
          dispatch(unverifiedUsersFailure(response.description));
        }
      });
    },
    (error) => {
      console.log(error);
    }
  );
};

export default userSlice.reducer;
