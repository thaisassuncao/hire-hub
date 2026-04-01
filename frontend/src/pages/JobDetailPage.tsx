import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Job } from "../types/job";
import { getJob } from "../api/jobs";
import { applyToJob } from "../api/applications";
import { useAuth } from "../hooks/useAuth";
import { formatDate } from "../utils/date";
import type { AxiosError } from "axios";

interface ApiErrorResponse {
  error_code?: string;
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [applyStatus, setApplyStatus] = useState<"idle" | "loading" | "applied" | "error">("idle");
  const [applyError, setApplyError] = useState("");

  const fetchJob = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await getJob(id);
      setJob(data);
    } catch {
      setError(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleApply = async () => {
    if (!id) return;
    setApplyStatus("loading");
    setApplyError("");

    try {
      await applyToJob(id);
      setApplyStatus("applied");
    } catch (err) {
      setApplyStatus("error");
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const code = axiosError.response?.data?.error_code;
      switch (code) {
        case "ALREADY_APPLIED":
          setApplyError(t("jobs.applied"));
          setApplyStatus("applied");
          break;
        case "OWN_JOB":
          setApplyError(t("common.error"));
          break;
        case "INACTIVE_JOB":
          setApplyError(t("jobs.inactive"));
          break;
        default:
          setApplyError(t("common.error"));
      }
    }
  };

  if (isLoading) return <p>{t("common.loading")}</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!job) return <p>{t("common.error")}</p>;

  const isOwnJob = user?.id === job.posted_by;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <Link to="/jobs">&larr; {t("common.back")}</Link>

      <h1 style={{ marginTop: 16 }}>{job.title}</h1>

      <p style={{ color: "#666" }}>
        {job.company} — {job.location}
      </p>

      {(job.salary_min || job.salary_max) && (
        <p style={{ color: "#666" }}>
          {t("jobs.salary")}:{" "}
          {job.salary_min && job.salary_max
            ? `R$ ${job.salary_min.toLocaleString()} - R$ ${job.salary_max.toLocaleString()}`
            : job.salary_min
              ? `R$ ${job.salary_min.toLocaleString()}+`
              : `R$ ${job.salary_max?.toLocaleString()}`}
        </p>
      )}

      <p style={{ fontSize: 12, color: "#999" }}>
        {formatDate(job.created_at, i18n.language)}
      </p>

      <div style={{ margin: "24px 0", whiteSpace: "pre-wrap" }}>
        {job.description}
      </div>

      {!job.is_active && (
        <p style={{ color: "orange", fontWeight: "bold" }}>{t("jobs.inactive")}</p>
      )}

      {isAuthenticated && !isOwnJob && job.is_active && (
        <div style={{ marginTop: 16 }}>
          {applyStatus === "applied" ? (
            <p style={{ color: "green", fontWeight: "bold" }}>{t("jobs.applied")}</p>
          ) : (
            <button
              onClick={handleApply}
              disabled={applyStatus === "loading"}
              style={{ padding: "8px 24px" }}
            >
              {applyStatus === "loading" ? t("common.loading") : t("jobs.apply")}
            </button>
          )}
          {applyError && applyStatus === "error" && (
            <p style={{ color: "red" }}>{applyError}</p>
          )}
        </div>
      )}

      {!isAuthenticated && job.is_active && (
        <p>
          <Link to="/login">{t("auth.login")}</Link> {t("jobs.apply").toLowerCase()}
        </p>
      )}
    </div>
  );
}
