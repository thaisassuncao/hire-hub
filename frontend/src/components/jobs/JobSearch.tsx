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
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("jobs.search")}
        className="form-input"
      />
      <button type="submit" className="btn btn-primary">
        {t("common.search")}
      </button>
    </form>
  );
}
