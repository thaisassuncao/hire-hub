import { useTranslation } from "react-i18next";
import type { Job } from "../../types/job";
import JobCard from "./JobCard";

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  error: string;
  emptyMessage?: string;
  showStatus?: boolean;
}

export default function JobList({ jobs, isLoading, error, emptyMessage, showStatus = false }: JobListProps) {
  const { t } = useTranslation();

  if (isLoading) return <p>{t("common.loading")}</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (jobs.length === 0) return <p>{emptyMessage ?? t("jobs.noJobs")}</p>;

  return (
    <div>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} showStatus={showStatus} />
      ))}
    </div>
  );
}
