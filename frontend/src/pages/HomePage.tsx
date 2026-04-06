import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="hero">
      <div className="hero-logo">
        <img src="/favicon.svg" alt="" />
        <h1 className="hero-title">Hire Hub</h1>
      </div>
      <p className="hero-subtitle">
        <Link to="/jobs" className="btn btn-primary">{t("jobs.seeJobs")}</Link>
      </p>
    </div>
  );
}
