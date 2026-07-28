import { Suspense } from "react";
import { getAllProviders } from "../../lib/sheets";
import { getAccurateRole } from "../../lib/roles";
import ProviderDirectory from "../components/ProviderDirectory";

export const revalidate = 3600;

export const metadata = {
  title: "Meet Our Prescribers | Evolve Psychiatry",
  description:
    "Browse our full team of psychiatric prescribers -- search by name, filter by location or sex, and find the right provider for you.",
  alternates: {
    canonical: "https://evolvepsychiatry.com/prescribers",
  },
};

export default async function PrescribersPage() {
  const allProviders = await getAllProviders({ revalidate: 3600 });
  const providers = allProviders.filter((p) => /^prescriber$/i.test((p.Type || "").trim()));

  // Structured data built server-side from the full list -- more reliable
  // for SEO than the original's client-injected version, since it's
  // present in the initial HTML rather than added after a client fetch.
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Meet Our Prescribers",
    itemListElement: providers
      .map((p, i) => {
        const name = `${p["First Name"] || ""} ${p["Last Name"] || ""}`.trim();
        if (!name) return null;
        const physician = {
          "@type": "Physician",
          name,
          jobTitle: getAccurateRole(p.Type, p.Title),
        };
        if (p.Title) physician.honorificSuffix = p.Title.trim();
        if (p["Photo URL"]) physician.image = p["Photo URL"].trim();
        if (p.NPI) {
          physician.identifier = {
            "@type": "PropertyValue",
            propertyID: "NPI",
            value: p.NPI.trim(),
          };
        }
        return { "@type": "ListItem", position: i + 1, item: physician };
      })
      .filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Suspense fallback={null}>
        <ProviderDirectory
          providers={providers}
          typeLabel="Prescriber"
          heading="Meet Our Prescribers"
          crossLink={{
            text: "Looking for talk therapy?",
            href: "/therapists",
            linkText: "Click here to see our Therapists",
          }}
        />
      </Suspense>
    </>
  );
}
