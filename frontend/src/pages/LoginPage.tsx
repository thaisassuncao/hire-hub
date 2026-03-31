import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("auth.loginTitle")}</h1>
      <p>Login form placeholder</p>
    </div>
  );
}
