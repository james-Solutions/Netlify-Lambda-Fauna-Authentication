import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store/store";
import fetch from "cross-fetch";
import {
  approvalError,
  LoggedInUser,
  LoginRequestUser,
  RegistrationRequest,
  userApprovalUpdate,
  VerifyUser,
} from "../interfaces/interfaces";
import * as constants from "../../constants";
import { faunaUser } from "../../components/user/Interfaces";
const cookie = require("react-cookies");

let apiUrl = "/.netlify/functions";

if (process.env.NODE_ENV !== "production") {
  apiUrl = "http://localhost:9000" + apiUrl;
}

const cookieUserInfo = cookie.load("user-info");
let unapprovedUsers: faunaUser[] = [];

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
  unapprovedUsers,
  fetchingUsers: false,
  fetchingUsersErrorMessage: "",
  updateUsers: false,
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
    setFetchingUsers: (state) => {
      state.fetchingUsers = true;
    },
    fetchUsersSuccessful: (state, action: PayloadAction<Array<faunaUser>>) => {
      state.unapprovedUsers = action.payload;
      state.fetchingUsersErrorMessage = "";
      state.fetchingUsers = false;
      state.updateUsers = false;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.fetchingUsersErrorMessage = action.payload;
      state.fetchingUsers = false;
    },
    updateUserApprovalFailure: (
      state,
      action: PayloadAction<approvalError>
    ) => {
      state.unapprovedUsers[action.payload.index].errorMessage =
        action.payload.errorMessage;
      state.unapprovedUsers[action.payload.index].updating = false;
    },
    setUserUpdating: (state, action: PayloadAction<userApprovalUpdate>) => {
      state.unapprovedUsers[action.payload.index].updating = true;
      state.unapprovedUsers[action.payload.index].approved =
        action.payload.approved;
    },
    updateUnapprovedUserSuccess: (
      state,
      action: PayloadAction<userApprovalUpdate>
    ) => {
      state.unapprovedUsers[action.payload.index].updating = false;
      state.updateUsers = true;
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
  setFetchingUsers,
  fetchUsersSuccessful,
  fetchUsersFailure,
  setUserUpdating,
  updateUnapprovedUserSuccess,
  updateUserApprovalFailure,
} = userSlice.actions;

// Selectors
export const getIsAuth = (state: RootState) => state.user.isAuth;
export const getUser = (state: RootState) => state.user.user;
export const getUserAccessLevel = (state: RootState) =>
  state.user.user.accessLevel;
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
export const getUnapprovedUsers = (state: RootState) =>
  state.user.unapprovedUsers;
export const getFetchingUsers = (state: RootState) => state.user.fetchingUsers;
export const getUpdateUsers = (state: RootState) => state.user.updateUsers;
export const getFetchUsersErrorMessage = (state: RootState) =>
  state.user.fetchingUsersErrorMessage;

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
        if (response.message === constants.SERVER.STATUS.SUCCESS) {
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
          if (response.message === constants.SERVER.STATUS.SUCCESS) {
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
        if (response.message === constants.SERVER.STATUS.SUCCESS) {
          dispatch(setVerificationCode(response.code));
          if (
            response.description ===
            constants.USER.USER_ERRORS.NO_CODE_UNVERIFIED
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
        if (response.message === constants.SERVER.STATUS.SUCCESS) {
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

export const fetchUsers = (type: string): AppThunk => (dispatch) => {
  dispatch(setFetchingUsers());
  // Fetch
  fetch(`${apiUrl}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type,
    }),
  }).then(
    (resRaw) => {
      resRaw.json().then((response) => {
        if (response.message === constants.SERVER.STATUS.SUCCESS) {
          // Success
          dispatch(fetchUsersSuccessful(response.users));
        } else {
          // Failure
          dispatch(fetchUsersFailure(response.description));
        }
      });
    },
    (error) => {
      dispatch(fetchUsersFailure(error));
    }
  );
};

export const setUserApproval = (
  user: faunaUser,
  approvalUpdate: userApprovalUpdate
): AppThunk => (dispatch) => {
  // Dispatch that we are sending
  dispatch(setUserUpdating(approvalUpdate));
  fetch(`${apiUrl}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      approved: approvalUpdate.approved,
    }),
  }).then(
    (resRaw) => {
      resRaw.json().then((response) => {
        if (response.message === constants.SERVER.STATUS.SUCCESS) {
          dispatch(updateUnapprovedUserSuccess(approvalUpdate));
        } else {
          // Failure
          dispatch(
            updateUserApprovalFailure({
              index: approvalUpdate.index,
              errorMessage: response.description,
            })
          );
        }
      });
    },
    (error) => {
      dispatch(
        updateUserApprovalFailure({
          index: approvalUpdate.index,
          errorMessage: error,
        })
      );
    }
  );
};

export default userSlice.reducer;
