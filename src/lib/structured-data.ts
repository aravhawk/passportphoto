import {
  SITE_DESCRIPTION,
  SITE_LANG,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

// schema.org JSON-LD for the home page: the site itself and the web app it
// hosts. Only facts the product states about itself are included (see
// README.md). Organization, Person and Article are intentionally absent: the
// site names no publisher or author and has no articles, so any such node
// would be invented. Add them once real details exist.

const websiteId = `${SITE_URL}/#website`;
const appId = `${SITE_URL}/#app`;

export function homeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: SITE_LANG,
      },
      {
        "@type": "WebApplication",
        "@id": appId,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: SITE_LANG,
        isPartOf: { "@id": websiteId },
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript and a modern web browser",
        countriesSupported: "US",
        featureList: [
          "Camera capture or photo upload",
          "Head and eye guides sized for a 2x2 inch US passport photo",
          "Automatic white background, processed in the browser",
          "300 DPI JPG or PNG export at 600 or 1200 pixels",
          "No uploads: every photo stays on the device",
        ],
      },
    ],
  };
}
