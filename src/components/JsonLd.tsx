// Renders a schema.org JSON-LD block. `<` is escaped so a string value can
// never close the script tag (see the Next.js JSON-LD guide).
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
