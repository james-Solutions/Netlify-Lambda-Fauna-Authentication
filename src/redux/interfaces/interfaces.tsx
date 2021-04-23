export interface LoginRequestUser {
  email: string;
  password: string;
}

export interface LoggedInUser {
  email: string;
  username: string;
  secret: string;
  accessLevel: string;
}

export interface RegistrationRequest {
  email: string;
  username: string;
  password: string;
  accessLevel: string;
}

export interface VerifyUser {
  email: string;
}

export interface userApprovalUpdate {
  index: number;
  approved: boolean;
  rejected: boolean;
}

export interface approvalError {
  index: number;
  errorMessage: string;
}
