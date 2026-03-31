import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("auth.registerTitle")}</h1>
      <p>Register form placeholder</p>
    </div>
  );
}
