import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useMyJobs } from "../hooks/useJobs";
import { useMyApplications } from "../hooks/useApplications";
import JobList from "../components/jobs/JobList";
import { formatDate } from "../utils/date";

type Tab = "jobs" | "applications";

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState<Tab>("jobs");
  const { jobs, isLoading: jobsLoading, error: jobsError } = useMyJobs();
  const {
    applications,
    isLoading: appsLoading,
    error: appsError,
  } = useMyApplications(tab === "applications");

  const tabStyle = (active: boolean) => ({
    padding: "8px 16px",
    cursor: "pointer" as const,
    borderBottom: active ? "2px solid #333" : "2px solid transparent",
    background: "none",
    fontWeight: active ? ("bold" as const) : ("normal" as const),
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>{t("dashboard.title")}</h1>
        <Link to="/jobs/new" style={{ padding: "8px 16px" }}>
          {t("jobs.create")}
        </Link>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "1px solid #e5e5e5" }}>
        <button style={tabStyle(tab === "jobs")} onClick={() => setTab("jobs")}>
          {t("dashboard.myJobs")}
        </button>
        <button style={tabStyle(tab === "applications")} onClick={() => setTab("applications")}>
          {t("dashboard.myApplications")}
        </button>
      </div>

      {tab === "jobs" && (
        <JobList jobs={jobs} isLoading={jobsLoading} error={jobsError} />
      )}

      {tab === "applications" && (
        <>
          {appsLoading && <p>{t("common.loading")}</p>}
          {appsError && <p style={{ color: "red" }}>{appsError}</p>}
          {!appsLoading && !appsError && applications.length === 0 && (
            <p>{t("applications.noApplications")}</p>
          )}
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
              <p style={{ margin: "4px 0" }}>
                {t("applications.status")}: {t(`applications.${app.status}`)}
              </p>
              <p style={{ margin: "4px 0", fontSize: 12, color: "#999" }}>
                {formatDate(app.created_at, i18n.language)}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
