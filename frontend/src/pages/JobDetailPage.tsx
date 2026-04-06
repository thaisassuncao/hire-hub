import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Job } from "../types/job";
import { getJob, closeJob } from "../api/jobs";
import { applyToJob, checkApplied } from "../api/applications";
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
  const [closeLoading, setCloseLoading] = useState(false);

  const fetchJob = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await getJob(id);
      setJob(data);

      if (isAuthenticated && user?.id !== data.posted_by) {
        try {
          const applied = await checkApplied(id);
          if (applied) setApplyStatus("applied");
        } catch {
          // ignore — just means we can't check, show button as default
        }
      }
    } catch {
      setError(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  }, [id, t, isAuthenticated, user?.id]);

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
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const code = axiosError.response?.data?.error_code;
      if (code === "ALREADY_APPLIED") {
        setApplyStatus("applied");
      } else if (code === "INACTIVE_JOB") {
        setApplyStatus("error");
        setApplyError(t("jobs.inactive"));
      } else {
        setApplyStatus("error");
        setApplyError(t("common.error"));
      }
    }
  };

  const handleClose = async () => {
    if (!id) return;
    setCloseLoading(true);
    try {
      await closeJob(id);
      setJob((prev) => prev ? { ...prev, is_active: false } : prev);
    } catch {
      // silently fail — user can retry
    } finally {
      setCloseLoading(false);
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
        <p style={{ color: "orange", fontWeight: "bold" }}>{t("jobs.closed")}</p>
      )}

      {isAuthenticated && isOwnJob && job.is_active && (
        <div style={{ marginTop: 16 }}>
          <button
            onClick={handleClose}
            disabled={closeLoading}
            style={{ padding: "8px 24px", backgroundColor: "#dc2626", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
          >
            {closeLoading ? t("common.loading") : t("jobs.close")}
          </button>
        </div>
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
          {t("jobs.apply")}: <Link to="/login">{t("auth.login")}</Link>
        </p>
      )}
    </div>
  );
}
