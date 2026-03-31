import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();

  const toggleLanguage = () => {
    const newLang = i18n.language === "pt-BR" ? "en" : "pt-BR";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <Link to="/" style={{ fontWeight: "bold", fontSize: 20, textDecoration: "none" }}>
          Hire Hub
        </Link>
        <Link to="/jobs">{t("nav.jobs")}</Link>
        {isAuthenticated && <Link to="/dashboard">{t("nav.dashboard")}</Link>}
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <button onClick={toggleLanguage} style={{ cursor: "pointer" }}>
          {i18n.language === "pt-BR" ? "EN" : "PT"}
        </button>

        {isAuthenticated ? (
          <>
            <span>{user?.name}</span>
            <button onClick={logout} style={{ cursor: "pointer" }}>
              {t("auth.logout")}
            </button>
          </>
        ) : (
          <>
            <Link to="/login">{t("auth.login")}</Link>
            <Link to="/register">{t("auth.register")}</Link>
          </>
        )}
      </div>
    </header>
  );
}
