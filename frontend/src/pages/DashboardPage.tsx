import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useMyJobs } from "../hooks/useJobs";
import { useMyApplications } from "../hooks/useApplications";
import JobList from "../components/jobs/JobList";
import ApplicationList from "../components/applications/ApplicationList";

type Tab = "jobs" | "applications";

export default function DashboardPage() {
  const { t } = useTranslation();
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
        <JobList jobs={jobs} isLoading={jobsLoading} error={jobsError} emptyMessage={t("jobs.noMyJobs")} showStatus />
      )}

      {tab === "applications" && (
        <ApplicationList
          applications={applications}
          isLoading={appsLoading}
          error={appsError}
        />
      )}
    </div>
  );
}
