import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { displayNameFromEmail } from "../../utils/email";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();

  const toggleLanguage = () => {
    const newLang = i18n.language === "pt-BR" ? "en" : "pt-BR";
    i18n.changeLanguage(newLang);
    try {
      localStorage.setItem("language", newLang);
    } catch {
      // localStorage unavailable in test environment
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <Link to="/" className="logo">
            Hire Hub
          </Link>
          <Link to="/jobs" className="nav-link">{t("nav.jobs")}</Link>
          {isAuthenticated && <Link to="/dashboard" className="nav-link">{t("nav.dashboard")}</Link>}
        </div>

        <div className="header-right">
          <button
            onClick={toggleLanguage}
            className="btn-lang"
            title={t("nav.switchLanguage")}
          >
            {i18n.language === "pt-BR" ? "PT-BR" : "EN"} | {i18n.language === "pt-BR" ? "Switch to English" : "Mudar para o Português"}
          </button>

          {isAuthenticated ? (
            <>
              <span className="user-name">{user ? displayNameFromEmail(user.email) : ""}</span>
              <button onClick={logout} className="btn btn-secondary">
                {t("auth.logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">{t("auth.login")}</Link>
              <Link to="/register" className="nav-link">{t("auth.register")}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
