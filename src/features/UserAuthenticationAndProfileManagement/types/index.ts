export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ProfileRequest {
  username: string;
  email: string;
  password: string;
}

export interface ProfileResponse {
  userId: string;
  username: string;
  email: string;
}
