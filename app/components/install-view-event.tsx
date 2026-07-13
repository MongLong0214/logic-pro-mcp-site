"use client";

import { useEffect, useState } from "react";
import { emitInstallViewed, type AnalyticsClient } from "../lib/analytics";

export function InstallViewEvent({ client, path }: Readonly<{ client: AnalyticsClient; path: `/install/${AnalyticsClient}` }>) {
  const [navigationOwner] = useState<object>(() => ({}));
  useEffect(() => {
    emitInstallViewed({ name: "install_viewed", page: path, placement: "navigation", destination_host: "", client }, navigationOwner);
  }, [client, navigationOwner, path]);

  return null;
}
