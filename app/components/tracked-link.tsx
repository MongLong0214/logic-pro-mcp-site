"use client";

import type { MouseEvent, ReactNode } from "react";
import { emitAnalytics, type AnalyticsEvent } from "../lib/analytics";

type TrackedLinkProps = Readonly<{
  href: string;
  event: AnalyticsEvent;
  children: ReactNode;
  className?: string;
  target?: "_blank";
  rel?: "noreferrer";
}>;

export function TrackedLink({ href, event, children, className, target, rel }: TrackedLinkProps) {
  const handleClick = (browserEvent: MouseEvent<HTMLAnchorElement>) => {
    emitAnalytics(event, browserEvent.nativeEvent);
  };
  return <a href={href} className={className} target={target} rel={rel} onClick={handleClick}>{children}</a>;
}
