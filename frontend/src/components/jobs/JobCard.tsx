import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { Job } from "../../types/job";
import { formatDate } from "../../utils/date";

interface JobCardProps {
  job: Job;
  showStatus?: boolean;
}

export default function JobCard({ job, showStatus = false }: JobCardProps) {
  const { t, i18n } = useTranslation();

  return (
    <div className="card">
      <h3 className="card-title">
        <Link to={`/jobs/${job.id}`}>{job.title}</Link>
      </h3>
      <p className="card-subtitle">
        {job.company} — {job.location}
      </p>
      {(job.salary_min || job.salary_max) && (
        <p className="card-subtitle">
          {t("jobs.salary")}:{" "}
          {job.salary_min && job.salary_max
            ? `R$ ${job.salary_min.toLocaleString()} - R$ ${job.salary_max.toLocaleString()}`
            : job.salary_min
              ? `R$ ${job.salary_min.toLocaleString()}+`
              : `R$ ${job.salary_max?.toLocaleString()}`}
        </p>
      )}
      <p className="card-meta">
        {formatDate(job.created_at, i18n.language)}
      </p>
      {showStatus && (
        <p className="card-meta">
          Status:{" "}
          <span className={`badge ${job.is_active ? "badge-success" : "badge-warning"}`}>
            {job.is_active ? t("jobs.statusOpen") : t("jobs.statusClosed")}
          </span>
        </p>
      )}
    </div>
  );
}
