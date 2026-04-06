import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="hero">
      <h1 className="hero-title">Hire Hub</h1>
      <p className="hero-subtitle">
        <Link to="/jobs" className="btn btn-primary">{t("nav.jobs")}</Link>
      </p>
    </div>
  );
}
