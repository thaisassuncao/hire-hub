import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>Hire Hub</h1>
      <p>
        <Link to="/jobs">{t("nav.jobs")}</Link>
      </p>
    </div>
  );
}
