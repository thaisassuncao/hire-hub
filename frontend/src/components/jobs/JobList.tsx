import { useTranslation } from "react-i18next";
import type { Job } from "../../types/job";
import JobCard from "./JobCard";

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  error: string;
}

export default function JobList({ jobs, isLoading, error }: JobListProps) {
  const { t } = useTranslation();

  if (isLoading) return <p>{t("common.loading")}</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (jobs.length === 0) return <p>{t("jobs.noJobs")}</p>;

  return (
    <div>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
