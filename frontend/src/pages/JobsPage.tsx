import { useTranslation } from "react-i18next";

export default function JobsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("jobs.title")}</h1>
      <p>Jobs list placeholder</p>
    </div>
  );
}
