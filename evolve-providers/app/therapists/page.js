import { Suspense } from "react";
import { getAllProviders } from "../../lib/sheets";
import { getAccurateRole } from "../../lib/roles";
import ProviderDirectory from "../components/ProviderDirectory";

export const revalidate = 3600;

export const metadata = {
  title: "Meet Our Therapists | Evolve Psychiatry",
  description:
    "Browse our full team of therapists -- search by name, filter by location or sex, and find the right provider for you.",
  alternates: {
    canonical: "https://evolvepsychiatry.com/therapists",
  },
};

export default async function TherapistsPage() {
  const allProviders = await getAllProviders({ revalidate: 3600 });
  const providers = allProviders.filter((p) => /^therapist$/i.test((p.Type || "").trim()));

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Meet Our Therapists",
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
          typeLabel="Therapist"
          heading="Meet Our Therapists"
          crossLink={{
            text: "Looking for medication management?",
            href: "/prescribers",
            linkText: "Click here to see our Prescribers",
          }}
          description="Our therapists offer a supportive space where you can talk openly, work through life's challenges, and build the tools you need to feel your best. Whether you're navigating a tough season or working toward long-term growth, they'll meet you where you are."
        />
      </Suspense>
    </>
  );
}
