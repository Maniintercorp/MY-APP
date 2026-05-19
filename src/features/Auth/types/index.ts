export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  expiresAt: string;
}
