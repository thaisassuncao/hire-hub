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

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{t("dashboard.title")}</h1>
        <Link to="/jobs/new" className="btn btn-primary">
          {t("jobs.create")}
        </Link>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === "jobs" ? "tab-active" : ""}`} onClick={() => setTab("jobs")}>
          {t("dashboard.myJobs")}
        </button>
        <button className={`tab ${tab === "applications" ? "tab-active" : ""}`} onClick={() => setTab("applications")}>
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
