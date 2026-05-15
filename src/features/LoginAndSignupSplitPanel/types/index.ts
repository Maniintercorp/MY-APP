export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface SocialAuthRequest {
  provider: string;
  token: string;
}

export interface AuthResponse {
  userId: string;
  message: string;
}

export interface SigninResponse {
  token: string;
  message: string;
}
