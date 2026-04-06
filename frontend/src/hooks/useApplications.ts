import { useCallback, useEffect, useState } from "react";
import type { Application } from "../types/application";
import { listMyApplications } from "../api/applications";

export function useMyApplications(enabled: boolean) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await listMyApplications();
      setApplications(data.applications ?? []);
    } catch {
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      fetchApplications();
    }
  }, [enabled, fetchApplications]);

  return { applications, isLoading, error };
}
