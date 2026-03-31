import api from "./client";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error_code?: string;
}

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<ApiResponse<AuthResponse>>("/auth/register", data);
  return response.data.data;
}

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
  return response.data.data;
}
