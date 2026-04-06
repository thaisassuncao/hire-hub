import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { createJob, updateJob } from "../../api/jobs";
import type { Job } from "../../types/job";

interface JobFormProps {
  job?: Job;
}

export default function JobForm({ job }: JobFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isEditing = !!job;

  const [title, setTitle] = useState(job?.title ?? "");
  const [description, setDescription] = useState(job?.description ?? "");
  const [company, setCompany] = useState(job?.company ?? "");
  const [location, setLocation] = useState(job?.location ?? "");
  const [salaryMin, setSalaryMin] = useState(job?.salary_min?.toString() ?? "");
  const [salaryMax, setSalaryMax] = useState(job?.salary_max?.toString() ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const blockInvalidChars = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
      e.preventDefault();
    }
  };

  const validate = (): boolean => {
    if (!title.trim() || !description.trim() || !company.trim() || !location.trim() || !salaryMin || !salaryMax) {
      setError(t("auth.validationError"));
      return false;
    }
    if (description.trim().length < 10) {
      setError(t("jobs.descriptionTooShort"));
      return false;
    }
    const min = Number(salaryMin);
    const max = Number(salaryMax);
    if (max <= min) {
      setError(t("jobs.salaryMaxError"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        company: company.trim(),
        location: location.trim(),
        salary_min: salaryMin ? Number(salaryMin) : undefined,
        salary_max: salaryMax ? Number(salaryMax) : undefined,
      };

      if (isEditing) {
        await updateJob(job.id, data);
      } else {
        await createJob(data);
      }
      navigate("/dashboard");
    } catch (err) {
      const axiosError = err as import("axios").AxiosError<{ error_code?: string }>;
      if (axiosError.response?.data?.error_code === "VALIDATION_ERROR") {
        setError(t("auth.validationError"));
      } else {
        setError(t("common.error"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="form form-wide">
      <h1 className="form-title">{isEditing ? t("jobs.edit") : t("jobs.create")}</h1>

      <div className="form-group">
        <label htmlFor="title" className="form-label">{t("jobs.jobTitle")}</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">{t("jobs.description")}</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label htmlFor="company" className="form-label">{t("jobs.company")}</label>
        <input
          id="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="location" className="form-label">{t("jobs.location")}</label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="salaryMin" className="form-label">{t("jobs.salary")} Min</label>
          <input
            id="salaryMin"
            type="number"
            value={salaryMin}
            onChange={(e) => { setSalaryMin(e.target.value); setError(""); }}
            onKeyDown={blockInvalidChars}
            min={0}
            step={1}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="salaryMax" className="form-label">{t("jobs.salary")} Max</label>
          <input
            id="salaryMax"
            type="number"
            value={salaryMax}
            onChange={(e) => { setSalaryMax(e.target.value); setError(""); }}
            onKeyDown={blockInvalidChars}
            min={salaryMin ? Number(salaryMin) + 1 : 0}
            step={1}
            required
            className="form-input"
          />
        </div>
      </div>

      {error && <p role="alert" className="form-error">{error}</p>}

      <button type="submit" disabled={isSubmitting} className="btn btn-primary">
        {isSubmitting ? t("common.loading") : t("common.save")}
      </button>
    </form>
  );
}
