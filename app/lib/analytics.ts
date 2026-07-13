export const analyticsStatus = "NOT_CONFIGURED" as const;

export type AnalyticsEventName =
  | "install_viewed"
  | "github_clicked"
  | "install_command_copied"
  | "docs_clicked"
  | "release_clicked"
  | "outbound_link_clicked";
export type AnalyticsClient = "claude-code" | "claude-desktop" | "cursor" | "vscode";
export type CommandStep = "install" | "register" | "permissions" | "doctor";
export type AnalyticsPlacement = "navigation" | "header" | "hero" | "workflow" | "sources";

declare global {
  interface Navigator {
    readonly globalPrivacyControl?: boolean;
  }
}

export type PrivacyNavigator = Pick<Navigator, "doNotTrack" | "globalPrivacyControl">;

export type AnalyticsEvent = Readonly<{
  name: AnalyticsEventName;
  page: string;
  placement: AnalyticsPlacement;
  destination_host: string;
  client?: AnalyticsClient;
  command_step?: CommandStep;
}>;

const allowedHosts = new Set(["", "github.com", "code.claude.com", "support.anthropic.com", "docs.cursor.com", "code.visualstudio.com", "modelcontextprotocol.io"]);
const allowedKeys = new Set(["name", "page", "placement", "destination_host", "client", "command_step"]);
const handledActivations = new WeakSet<Event>();
const viewedInstallRoutes = new WeakMap<object, Set<string>>();
const contractEventName = "logic-pro-mcp:analytics-contract";

function isEventName(value: string): value is AnalyticsEventName {
  return value === "install_viewed" || value === "github_clicked" || value === "install_command_copied" || value === "docs_clicked" || value === "release_clicked" || value === "outbound_link_clicked";
}
function isPlacement(value: string): value is AnalyticsPlacement {
  return value === "navigation" || value === "header" || value === "hero" || value === "workflow" || value === "sources";
}
function isClient(value: string): value is AnalyticsClient {
  return value === "claude-code" || value === "claude-desktop" || value === "cursor" || value === "vscode";
}
function isCommandStep(value: string): value is CommandStep {
  return value === "install" || value === "register" || value === "permissions" || value === "doctor";
}

export function sanitizeAnalyticsEvent(input: Readonly<Record<string, unknown>>): AnalyticsEvent | null {
  if (Object.keys(input).some((key) => !allowedKeys.has(key))) return null;
  const { name, page, placement, destination_host: destinationHost, client, command_step: commandStep } = input;
  if (typeof name !== "string" || !isEventName(name)) return null;
  if (typeof page !== "string" || !page.startsWith("/") || page.includes("?") || page.includes("#") || page.includes("@")) return null;
  if (typeof placement !== "string" || !isPlacement(placement)) return null;
  if (typeof destinationHost !== "string" || !allowedHosts.has(destinationHost) || destinationHost.includes("?") || destinationHost.includes("#")) return null;
  if (destinationHost === "" && name !== "install_command_copied" && name !== "install_viewed") return null;
  if (client !== undefined && (typeof client !== "string" || !isClient(client))) return null;
  if (commandStep !== undefined && (typeof commandStep !== "string" || !isCommandStep(commandStep))) return null;
  if (name === "install_command_copied" && commandStep === undefined) return null;
  if (name === "install_viewed" && (placement !== "navigation" || client === undefined || commandStep !== undefined || page !== `/install/${client}`)) return null;
  return { name, page, placement, destination_host: destinationHost, ...(typeof client === "string" && isClient(client) ? { client } : {}), ...(typeof commandStep === "string" && isCommandStep(commandStep) ? { command_step: commandStep } : {}) };
}

export function privacySignalEnabled(source: PrivacyNavigator): boolean {
  return source.doNotTrack === "1" || source.globalPrivacyControl === true;
}

function browserPrivacySource(): PrivacyNavigator | undefined {
  return typeof navigator === "undefined" ? undefined : {
    doNotTrack: navigator.doNotTrack,
    globalPrivacyControl: navigator.globalPrivacyControl,
  };
}

function announceAcceptedEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<AnalyticsEvent>(contractEventName, { detail: event }));
}

export function emitAnalytics(event: AnalyticsEvent, activation?: Event, privacySource = browserPrivacySource()): boolean {
  if (privacySource && privacySignalEnabled(privacySource)) return false;
  if (!sanitizeAnalyticsEvent(event)) return false;
  if (activation) {
    if (handledActivations.has(activation)) return false;
    handledActivations.add(activation);
  }
  announceAcceptedEvent(event);
  return true;
}

export function emitInstallViewed(event: AnalyticsEvent, navigationOwner: object, privacySource = browserPrivacySource()): boolean {
  if (event.name !== "install_viewed" || (privacySource && privacySignalEnabled(privacySource))) return false;
  if (!sanitizeAnalyticsEvent(event)) return false;
  const seenRoutes = viewedInstallRoutes.get(navigationOwner) ?? new Set<string>();
  if (seenRoutes.has(event.page)) return false;
  seenRoutes.add(event.page);
  viewedInstallRoutes.set(navigationOwner, seenRoutes);
  announceAcceptedEvent(event);
  return true;
}
