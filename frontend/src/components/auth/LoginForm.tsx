import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";
import type { AxiosError } from "axios";

interface ApiErrorResponse {
  error_code?: string;
}

export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = await loginUser({ email, password });
      login(data.tokens, data.user);
      navigate("/dashboard");
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.data?.error_code === "INVALID_CREDENTIALS") {
        setError(t("auth.invalidCredentials"));
      } else {
        setError(t("common.error"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="form">
      <h1 className="form-title">{t("auth.loginTitle")}</h1>

      <div className="form-group">
        <label htmlFor="email" className="form-label">{t("auth.email")}</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">{t("auth.password")}</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          required
          autoComplete="current-password"
          className="form-input"
        />
      </div>

      {error && <p role="alert" className="form-error">{error}</p>}

      <button type="submit" disabled={isSubmitting} className="btn btn-primary">
        {isSubmitting ? t("common.loading") : t("auth.login")}
      </button>

      <p className="form-footer">
        {t("auth.noAccount")} <Link to="/register">{t("auth.register")}</Link>
      </p>
    </form>
  );
}
