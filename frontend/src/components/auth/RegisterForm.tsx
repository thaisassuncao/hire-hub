import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";
import type { AxiosError } from "axios";

interface ApiErrorResponse {
  error_code?: string;
}

export default function RegisterForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    if (password.length < 6) {
      setError(t("auth.passwordTooShort"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const data = await registerUser({ email, password });
      login(data.tokens, data.user);
      navigate("/dashboard");
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const code = axiosError.response?.data?.error_code;
      if (code === "DUPLICATE_EMAIL") {
        setError(t("auth.duplicateEmail"));
      } else if (code === "VALIDATION_ERROR") {
        setError(t("auth.validationError"));
      } else {
        setError(t("common.error"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 400, margin: "0 auto" }}>
      <h1>{t("auth.registerTitle")}</h1>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="email">{t("auth.email")}</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          style={{ display: "block", width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="password">{t("auth.password")}</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          required
          autoComplete="new-password"
          style={{ display: "block", width: "100%", padding: 8 }}
        />
      </div>

      {error && <p role="alert" style={{ color: "red", marginBottom: 12 }}>{error}</p>}

      <button type="submit" disabled={isSubmitting} style={{ padding: "8px 24px" }}>
        {isSubmitting ? t("common.loading") : t("auth.register")}
      </button>

      <p style={{ marginTop: 16 }}>
        {t("auth.hasAccount")} <Link to="/login">{t("auth.login")}</Link>
      </p>
    </form>
  );
}
