import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("dashboard.title")}</h1>
      <p>Dashboard placeholder</p>
    </div>
  );
}
