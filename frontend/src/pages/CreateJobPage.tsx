import { useTranslation } from "react-i18next";

export default function CreateJobPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("jobs.create")}</h1>
      <p>Create job form placeholder</p>
    </div>
  );
}
