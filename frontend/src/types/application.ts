import type { Job } from "./job";

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  status: string;
  job?: Job;
  created_at: string;
  updated_at: string;
}

export interface ApplicationListResponse {
  applications: Application[];
  total: number;
  page: number;
}
