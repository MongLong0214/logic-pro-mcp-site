type JsonLdValue = Readonly<Record<string, unknown>>;

export function JsonLd({ value }: Readonly<{ value: JsonLdValue }>) {
  const serialized = JSON.stringify(value).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialized }} />;
}
