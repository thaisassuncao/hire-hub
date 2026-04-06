import { useTranslation } from "react-i18next";

export default function Loading() {
  const { t } = useTranslation();

  return (
    <div className="loading">
      <p>{t("common.loading")}</p>
    </div>
  );
}
