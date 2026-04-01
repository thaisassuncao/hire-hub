import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { createJob } from "../../api/jobs";

export default function JobForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await createJob({
        title,
        description,
        company,
        location,
        salary_min: salaryMin ? Number(salaryMin) : undefined,
        salary_max: salaryMax ? Number(salaryMax) : undefined,
      });
      navigate("/dashboard");
    } catch {
      setError(t("common.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = { display: "block" as const, width: "100%", padding: 8 };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>{t("jobs.create")}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="title">{t("jobs.title")}</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={2}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="description">{t("jobs.description")}</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          minLength={10}
          rows={5}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="company">{t("jobs.company")}</label>
        <input
          id="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          minLength={2}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="location">{t("jobs.location")}</label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          minLength={2}
          style={inputStyle}
        />
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="salaryMin">{t("jobs.salary")} Min</label>
          <input
            id="salaryMin"
            type="number"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
            min={0}
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="salaryMax">{t("jobs.salary")} Max</label>
          <input
            id="salaryMax"
            type="number"
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
            min={0}
            style={inputStyle}
          />
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} style={{ padding: "8px 24px" }}>
        {isSubmitting ? t("common.loading") : t("common.save")}
      </button>
    </form>
  );
}
