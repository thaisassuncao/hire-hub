import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { Job } from "../../types/job";
import { formatDate } from "../../utils/date";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const { t, i18n } = useTranslation();

  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <Link to={`/jobs/${job.id}`} style={{ textDecoration: "none" }}>
        <h3 style={{ margin: "0 0 8px" }}>{job.title}</h3>
      </Link>
      <p style={{ margin: "4px 0", color: "#666" }}>
        {job.company} — {job.location}
      </p>
      {(job.salary_min || job.salary_max) && (
        <p style={{ margin: "4px 0", color: "#666" }}>
          {t("jobs.salary")}:{" "}
          {job.salary_min && job.salary_max
            ? `R$ ${job.salary_min.toLocaleString()} - R$ ${job.salary_max.toLocaleString()}`
            : job.salary_min
              ? `R$ ${job.salary_min.toLocaleString()}+`
              : `${t("jobs.salary")} R$ ${job.salary_max?.toLocaleString()}`}
        </p>
      )}
      <p style={{ margin: "4px 0", fontSize: 12, color: "#999" }}>
        {formatDate(job.created_at, i18n.language)}
      </p>
    </div>
  );
}
