import { useTranslation } from "react-i18next";

export default function Loading() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <p>{t("common.loading")}</p>
    </div>
  );
}
