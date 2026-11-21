import JsonLd from "@/components/JsonLd";
import Studio from "@/components/Studio";
import { pageMetadata } from "@/lib/site";
import { homeStructuredData } from "@/lib/structured-data";

// Server wrapper so the home route can own its metadata. The interactive app
// is a client component (src/components/Studio.tsx), which cannot export
// `metadata` itself.
export const metadata = pageMetadata({ path: "/" });

export default function Home() {
  return (
    <>
      <JsonLd data={homeStructuredData()} />
      <Studio />
    </>
  );
}
