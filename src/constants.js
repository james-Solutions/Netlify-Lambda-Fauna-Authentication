export const USER_ERRORS = {
  NO_CODE: "User has does not a verification code",
  ALREADY_VERIFIED: "User has already verified their account",
  NO_CODE_UNVERIFIED: "Generated new code, check email to obtain it",
  USER_DOES_NOT_EXIST: "No user with the supplied email exists in the database",
  CODE_DOES_NOT_MATCH: "The code you entered is not correct",
};

export const STATUS = {
  SUCCESS: "Success",
  FAILURE: "Failure",
};

export const URL = {
  DOMAIN:
    process.env.NODE_ENV !== "production"
      ? "https://localhost:3000"
      : "https://modest-cori-434d1e.netlify.app",
};
