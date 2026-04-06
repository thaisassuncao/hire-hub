import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { Application } from "../../types/application";
import { formatDate } from "../../utils/date";

interface ApplicationListProps {
  applications: Application[];
  isLoading: boolean;
  error: string;
}

export default function ApplicationList({ applications, isLoading, error }: ApplicationListProps) {
  const { t, i18n } = useTranslation();

  if (isLoading) return <p>{t("common.loading")}</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (applications.length === 0) return <p>{t("applications.noApplications")}</p>;

  return (
    <div>
      {applications.map((app) => (
        <div
          key={app.id}
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <Link to={`/jobs/${app.job_id}`} style={{ textDecoration: "none" }}>
            <h3 style={{ margin: "0 0 4px" }}>{app.job?.title}</h3>
          </Link>
          <p style={{ margin: "4px 0", color: "#666" }}>
            {app.job?.company} — {app.job?.location}
          </p>
          {(app.job?.salary_min || app.job?.salary_max) && (
            <p style={{ margin: "4px 0", color: "#666" }}>
              {t("jobs.salary")}:{" "}
              {app.job.salary_min && app.job.salary_max
                ? `R$ ${app.job.salary_min.toLocaleString()} - R$ ${app.job.salary_max.toLocaleString()}`
                : app.job.salary_min
                  ? `R$ ${app.job.salary_min.toLocaleString()}+`
                  : `R$ ${app.job.salary_max?.toLocaleString()}`}
            </p>
          )}
          <p style={{ margin: "4px 0" }}>
            {t("applications.status")}: {t(`applications.${app.status}`)}
          </p>
          <p style={{ margin: "4px 0", fontSize: 12, color: "#999" }}>
            {formatDate(app.created_at, i18n.language)}
          </p>
        </div>
      ))}
    </div>
  );
}
