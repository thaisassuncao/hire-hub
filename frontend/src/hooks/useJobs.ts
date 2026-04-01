import { useCallback, useEffect, useState } from "react";
import type { Job } from "../types/job";
import { listMyJobs } from "../api/jobs";

export function useMyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = useCallback(async (p: number) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await listMyJobs(p);
      setJobs(data.jobs);
      setTotal(data.total);
    } catch {
      setError("Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(page);
  }, [page, fetchJobs]);

  return { jobs, total, page, setPage, isLoading, error, refetch: () => fetchJobs(page) };
}
