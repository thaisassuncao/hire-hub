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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = await registerUser({ name, email, password });
      login(data.tokens, data.user);
      navigate("/dashboard");
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.data?.error_code === "DUPLICATE_EMAIL") {
        setError(t("auth.duplicateEmail"));
      } else {
        setError(t("common.error"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <h1>{t("auth.registerTitle")}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="name">{t("auth.name")}</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          style={{ display: "block", width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="email">{t("auth.email")}</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="password">{t("auth.password")}</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={{ display: "block", width: "100%", padding: 8 }}
        />
      </div>

      <button type="submit" disabled={isSubmitting} style={{ padding: "8px 24px" }}>
        {isSubmitting ? t("common.loading") : t("auth.register")}
      </button>

      <p style={{ marginTop: 16 }}>
        {t("auth.hasAccount")} <Link to="/login">{t("auth.login")}</Link>
      </p>
    </form>
  );
}
