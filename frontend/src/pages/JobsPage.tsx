import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Job } from "../types/job";
import { listJobs, searchJobs } from "../api/jobs";
import JobSearch from "../components/jobs/JobSearch";
import JobList from "../components/jobs/JobList";

export default function JobsPage() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchJobs = useCallback(async (query: string) => {
    setIsLoading(true);
    setError("");
    try {
      const data = query ? await searchJobs(query) : await listJobs();
      setJobs(data.jobs ?? []);
    } catch {
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(searchQuery);
  }, [searchQuery, fetchJobs]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <h1>{t("jobs.title")}</h1>
      <JobSearch onSearch={handleSearch} />
      <JobList jobs={jobs} isLoading={isLoading} error={error} />
    </div>
  );
}
