export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: {
    id: string;
    name: string;
  };
}
