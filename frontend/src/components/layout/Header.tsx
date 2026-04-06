import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { displayNameFromEmail } from "../../utils/email";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === "pt-BR" ? "en" : "pt-BR";
    i18n.changeLanguage(newLang);
    try {
      localStorage.setItem("language", newLang);
    } catch {
      // localStorage unavailable in test environment
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`header ${menuOpen ? "header-open" : ""}`}>
      <div className="header-inner">
        <div className="header-mobile-bar" onClick={() => setMenuOpen(!menuOpen)}>
          <Link to="/" className="logo" onClick={(e) => e.stopPropagation()}>Hire Hub</Link>
          <button className="header-toggle" aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>

        <div className="header-left">
          <Link to="/" className="logo" onClick={closeMenu}>Hire Hub</Link>
          <Link to="/jobs" className="nav-link" onClick={closeMenu}>{t("nav.jobs")}</Link>
          {isAuthenticated && <Link to="/dashboard" className="nav-link" onClick={closeMenu}>{t("nav.dashboard")}</Link>}
        </div>

        <div className="header-right">
          <button onClick={toggleLanguage} className="btn-lang">
            {i18n.language === "pt-BR" ? "PT-BR" : "EN"} | {i18n.language === "pt-BR" ? "Switch to English" : "Mudar para o Português"}
          </button>

          {isAuthenticated ? (
            <>
              <span className="user-name">{t("jobs.greeting")} {user ? displayNameFromEmail(user.email) : ""}</span>
              <button onClick={() => { logout(); closeMenu(); }} className="btn btn-secondary btn-sm">
                {t("auth.logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={closeMenu}>{t("auth.login")}</Link>
              <Link to="/register" className="nav-link" onClick={closeMenu}>{t("auth.register")}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
