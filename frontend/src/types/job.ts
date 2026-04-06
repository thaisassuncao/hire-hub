import type { User } from "./auth";

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  is_active: boolean;
  posted_by: string;
  posted_by_user?: User;
  created_at: string;
  updated_at: string;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
}

export interface UpdateJobRequest {
  title?: string;
  description?: string;
  company?: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
}

export interface JobListResponse {
  jobs: Job[];
  total: number;
  page: number;
}
