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

  if (isLoading) return <div className="loading"><p>{t("common.loading")}</p></div>;
  if (error) return <p className="message-error">{error}</p>;

  const visibleApps = applications.filter((app) => app.job != null);

  if (visibleApps.length === 0) return <p className="message-muted">{t("applications.noApplications")}</p>;

  return (
    <div>
      {visibleApps.map((app) => (
        <div key={app.id} className="card">
          <h3 className="card-title">
            <Link to={`/jobs/${app.job_id}`}>{app.job?.title}</Link>
          </h3>
          <p className="card-subtitle">
            {app.job?.company} — {app.job?.location}
          </p>
          {(app.job?.salary_min || app.job?.salary_max) && (
            <p className="card-subtitle">
              {t("jobs.salary")}:{" "}
              {app.job!.salary_min && app.job!.salary_max
                ? `R$ ${app.job!.salary_min.toLocaleString()} - R$ ${app.job!.salary_max.toLocaleString()}`
                : app.job!.salary_min
                  ? `R$ ${app.job!.salary_min.toLocaleString()}+`
                  : `R$ ${app.job!.salary_max?.toLocaleString()}`}
            </p>
          )}
          <p className="card-meta">
            {app.job?.is_active === false ? (
              <span className="badge badge-warning">{t("jobs.jobClosed")}</span>
            ) : (
              <>{t("applications.status")}: {t(`applications.${app.status}`)}</>
            )}
          </p>
          <p className="card-meta">
            {formatDate(app.created_at, i18n.language)}
          </p>
        </div>
      ))}
    </div>
  );
}
