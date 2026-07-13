"use client";

import { useState, type MouseEvent } from "react";
import { emitAnalytics, type AnalyticsEvent } from "../lib/analytics";

type CopyCommandProps = Readonly<{ command: string; label: string; event: AnalyticsEvent; claimKey?: string }>;

export function CopyCommand({ command, label, event, claimKey }: CopyCommandProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "denied">("idle");
  const copy = async (browserEvent: MouseEvent<HTMLButtonElement>) => {
    try {
      await navigator.clipboard.writeText(command);
      setStatus("copied");
      emitAnalytics(event, browserEvent.nativeEvent);
    } catch (error: unknown) {
      if (error instanceof Error) setStatus("denied");
      else throw error;
    }
  };
  const statusText = status === "copied" ? "Copied" : status === "denied" ? "Copy unavailable; select the command manually" : "";
  return <div className="copy-command" data-claim-key={claimKey}><pre tabIndex={0}><code translate="no">{command}</code></pre><button type="button" onClick={copy}>{label}</button><span role="status" aria-live="polite">{statusText}</span></div>;
}
