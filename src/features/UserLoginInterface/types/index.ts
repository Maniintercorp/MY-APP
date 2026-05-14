export interface LoginForm {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
}
