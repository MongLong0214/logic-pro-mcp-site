import type { Metadata } from "next";
import { ContentPage } from "./components/content-page";
import { pageRecords, type RoutePath } from "./content/page-records";
import { siteUrl } from "./site-config";

export function metadataFor(path: RoutePath): Metadata {
  const page = pageRecords[path];
  const url = `${siteUrl}${path}`;
  return { title: page.title, description: page.description, alternates: { canonical: url }, openGraph: { title: page.title, description: page.description, url, type: "website", images: ["/og.png"] }, twitter: { card: "summary_large_image", title: page.title, description: page.description, images: ["/og.png"] } };
}

export function routeFor(path: RoutePath) {
  return function Route() { return <ContentPage path={path} />; };
}
