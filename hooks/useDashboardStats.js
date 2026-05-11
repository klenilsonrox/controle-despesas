"use client";

import { useCallback, useEffect, useState } from "react";

export function useDashboardStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stats/dashboard", { credentials: "include" });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Erro ao carregar");
        setData(null);
        return;
      }
      setData(json);
    } catch {
      setError("Erro de rede");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
}
