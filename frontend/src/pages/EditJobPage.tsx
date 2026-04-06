import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Job } from "../types/job";
import { getJob } from "../api/jobs";
import JobForm from "../components/jobs/JobForm";

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJob = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getJob(id);
      setJob(data);
    } catch {
      // handled by empty state
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  if (isLoading) return <div className="loading"><p>{t("common.loading")}</p></div>;
  if (!job) return <p>{t("common.error")}</p>;

  return <JobForm job={job} />;
}
