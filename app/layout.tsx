import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const siteUrl = "https://logic-pro-mcp.monglong.chatgpt.site";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: "Logic Pro MCP Server for Claude, Cursor & AI Agents",
    description: "Install the open-source Logic Pro MCP server for Claude, Cursor, VS Code, and custom AI agents. Compose MIDI, control transport and mixer state, inspect projects, and verify every result.",
    applicationName: "Logic Pro MCP",
    authors: [{ name: "MongLong0214", url: "https://github.com/MongLong0214" }],
    creator: "MongLong0214",
    publisher: "MongLong0214",
    category: "DeveloperApplication",
    keywords: [
      "Logic Pro MCP",
      "Logic Pro MCP server",
      "Model Context Protocol Logic Pro",
      "Claude Logic Pro",
      "Cursor Logic Pro",
      "AI music production",
      "Logic Pro automation",
      "MCP server macOS",
    ],
    alternates: { canonical: siteUrl },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: "Logic Pro MCP Server for Claude, Cursor & AI Agents",
      description: "Compose, control, inspect, and verify real Logic Pro sessions through an open-source local MCP server.",
      url: siteUrl,
      siteName: "Logic Pro MCP",
      type: "website",
      locale: "en_US",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Logic Pro MCP agent control signal path" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Logic Pro MCP Server for AI Agents",
      description: "Open-source, verified Logic Pro control for Claude, Cursor, VS Code, and custom agents.",
      images: ["/og.png"],
    },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plexSans.variable} ${plexMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
