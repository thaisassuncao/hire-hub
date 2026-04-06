import api from "./client";
import type { Application, ApplicationListResponse } from "../types/application";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function applyToJob(jobId: string): Promise<Application> {
  const response = await api.post<ApiResponse<{ application: Application }>>(`/jobs/${jobId}/apply`);
  return response.data.data.application;
}

export async function checkApplied(jobId: string): Promise<boolean> {
  const response = await api.get<ApiResponse<{ applied: boolean }>>(`/jobs/${jobId}/applied`);
  return response.data.data.applied;
}

export async function listMyApplications(page = 1, pageSize = 10): Promise<ApplicationListResponse> {
  const response = await api.get<ApiResponse<ApplicationListResponse>>("/applications/mine", {
    params: { page, page_size: pageSize },
  });
  return response.data.data;
}
