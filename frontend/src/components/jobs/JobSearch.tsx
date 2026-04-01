import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

interface JobSearchProps {
  onSearch: (query: string) => void;
}

export default function JobSearch({ onSearch }: JobSearchProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 24 }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("jobs.search")}
        style={{ flex: 1, padding: 8 }}
      />
      <button type="submit" style={{ padding: "8px 16px" }}>
        {t("common.search")}
      </button>
    </form>
  );
}
