export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  user: User;
  tokens: TokenPair;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
