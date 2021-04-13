export interface LoginRequestUser {
  email: string;
  password: string;
}

export interface LoggedInUser {
  email: string;
  username: string;
  secret: string;
}

export interface RegistrationRequest {
  email: string;
  username: string;
  password: string;
  accessLevel: string;
}
