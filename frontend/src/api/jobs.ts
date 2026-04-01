import api from "./client";
import type { Job, CreateJobRequest, JobListResponse } from "../types/job";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function createJob(data: CreateJobRequest): Promise<Job> {
  const response = await api.post<ApiResponse<{ job: Job }>>("/jobs", data);
  return response.data.data.job;
}

export async function listJobs(page = 1, pageSize = 10): Promise<JobListResponse> {
  const response = await api.get<ApiResponse<JobListResponse>>("/jobs", {
    params: { page, page_size: pageSize },
  });
  return response.data.data;
}

export async function listMyJobs(page = 1, pageSize = 10): Promise<JobListResponse> {
  const response = await api.get<ApiResponse<JobListResponse>>("/jobs/mine", {
    params: { page, page_size: pageSize },
  });
  return response.data.data;
}

export async function getJob(id: string): Promise<Job> {
  const response = await api.get<ApiResponse<{ job: Job }>>(`/jobs/${id}`);
  return response.data.data.job;
}

export async function searchJobs(q: string, page = 1, pageSize = 10): Promise<JobListResponse> {
  const response = await api.get<ApiResponse<JobListResponse>>("/jobs/search", {
    params: { q, page, page_size: pageSize },
  });
  return response.data.data;
}
