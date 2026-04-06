import { useCallback, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Job } from "../types/job";
import { getJob, closeJob, deleteJob } from "../api/jobs";
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
  const navigate = useNavigate();

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
          // ignore
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
      // silently fail
    } finally {
      setCloseLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm(t("jobs.deleteConfirm"))) return;

    try {
      await deleteJob(id);
      navigate("/dashboard");
    } catch {
      // silently fail
    }
  };

  if (isLoading) return <p>{t("common.loading")}</p>;
  if (error) return <p className="message-error">{error}</p>;
  if (!job) return <p>{t("common.error")}</p>;

  const isOwnJob = user?.id === job.posted_by;

  return (
    <div className="detail">
      <div className="detail-header">
        <Link to="/jobs" className="back-link">&larr; {t("common.back")}</Link>

        <h1 className="detail-title">{job.title}</h1>

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
      </div>

      <div className="detail-description">
        {job.description}
      </div>

      {!job.is_active && (
        <p className="message-warning">{t("jobs.jobClosed")}</p>
      )}

      {isAuthenticated && isOwnJob && (
        <div className="detail-actions">
          {job.is_active && (
            <>
              <Link
                to={`/jobs/${job.id}/edit`}
                className="btn btn-secondary"
              >
                {t("jobs.edit")}
              </Link>
              <button
                onClick={handleClose}
                disabled={closeLoading}
                className="btn btn-warning"
              >
                {closeLoading ? t("common.loading") : t("jobs.close")}
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            className="btn btn-danger"
          >
            {t("jobs.delete")}
          </button>
        </div>
      )}

      {isAuthenticated && !isOwnJob && (
        <div className="detail-actions">
          {!job.is_active ? (
            <p className="message-warning">{t("jobs.jobClosed")}</p>
          ) : applyStatus === "applied" ? (
            <p className="message-success">{t("jobs.applied")}</p>
          ) : (
            <button
              onClick={handleApply}
              disabled={applyStatus === "loading"}
              className="btn btn-primary"
            >
              {applyStatus === "loading" ? t("common.loading") : t("jobs.apply")}
            </button>
          )}
          {applyError && applyStatus === "error" && (
            <p className="message-error">{applyError}</p>
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
