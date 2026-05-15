export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
}

export interface RegisterResponse {
  userId: number;
  message: string;
}

export interface RefreshTokenResponse {
  token: string;
}
