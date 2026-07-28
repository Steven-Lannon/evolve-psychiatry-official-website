import { notFound } from "next/navigation";
import {
  getAllProviders,
  getProviderBySlug,
  formatLocation,
} from "../../lib/sheets";
import {
  LocationIcon,
  SuiteIcon,
  CheckIcon,
  XCircleIcon,
  MonitorIcon,
  UserPlusIcon,
  StethoscopeIcon,
  ChatIcon,
} from "../../lib/icons";
import ClickableProfilePhoto from "../components/ClickableProfilePhoto";

// Returns an accurate professional role description based on both Type
// AND credential (Title) -- not just Type alone. "Psychiatrist" only
// applies to MD/DO; a PMHNP or PA-C prescriber is not a psychiatrist by
// definition, even though they prescribe in a psychiatric practice.
// Used for the visible on-page subtitle and structured data jobTitle --
// NOT for the <title> tag/metadata, which keeps its own simpler wording.
function getAccurateRole(typeVal, titleVal) {
  const credential = (titleVal || "").trim().toUpperCase();
  if (/^prescriber$/i.test(typeVal)) {
    if (/^(MD|DO)$/.test(credential)) return "Psychiatrist";
    if (/^(PMHNP|PMHNP-BC|PMHNP-C|NP)$/.test(credential)) {
      return "Psychiatric Nurse Practitioner";
    }
    if (/^(PA|PA-C)$/.test(credential)) return "Psychiatric Physician Assistant";
    return "Psychiatric Prescriber";
  }
  if (/^therapist$/i.test(typeVal)) return "Therapist";
  return typeVal || "Clinician";
}


// Tells Next.js which slugs exist at build time, so every provider page
// is pre-rendered as real static HTML — bio and all — before anyone
// ever visits it. Revalidates hourly to pick up new/changed providers
// without needing a full manual rebuild.
export async function generateStaticParams() {
  const providers = await getAllProviders({ revalidate: 3600 });
  return providers.map((p) => ({ slug: p.slug }));
}

export const revalidate = 3600;

// This is what replaces manually typing SEO Title/Description into
// Squarespace's Page Settings for every single provider — it's now
// generated automatically from the same sheet data, for every provider,
// every time the data changes. Nobody has to remember to do this per page.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug, { revalidate: 3600 });

  if (!provider) {
    return { title: "Provider Not Found — Evolve Psychiatry" };
  }

  const displayName = provider.Title
    ? `${provider["First Name"]} ${provider["Last Name"]}, ${provider.Title}`
    : `${provider["First Name"]} ${provider["Last Name"]}`;

  const typeVal = (provider.Type || "").trim();
  const locationVal = (provider.Location || "").trim();
  const isRemote = /^remote$/i.test(locationVal);

  const roleWord = /^prescriber$/i.test(typeVal)
    ? "Psychiatric Prescriber"
    : /^therapist$/i.test(typeVal)
    ? "Therapist"
    : typeVal || "Clinician";

  const title = isRemote
    ? `${displayName} | Remote ${roleWord}`
    : locationVal
    ? `${displayName} | ${roleWord} in ${formatLocation(locationVal)}`
    : `${displayName} | Evolve Psychiatry`;

  const bio = (provider.Biography || "").trim();
  const description = bio
    ? bio.length > 300
      ? bio.slice(0, 297) + "..."
      : bio
    : `${displayName} is a ${roleWord.toLowerCase()} at Evolve Psychiatry${
        locationVal && !isRemote ? ` in ${formatLocation(locationVal)}` : ""
      }.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://evolvepsychiatry.com/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://evolvepsychiatry.com/${slug}`,
      images: provider["Photo URL"] ? [provider["Photo URL"]] : undefined,
    },
  };
}

export default async function ProviderPage({ params }) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug, { revalidate: 3600 });

  if (!provider) {
    notFound();
  }

  const firstName = provider["First Name"] || "";
  const lastName = provider["Last Name"] || "";
  const plainName = `${firstName} ${lastName}`.trim();
  const title = (provider.Title || "").trim();
  const displayName = title ? `${plainName}, ${title}` : plainName;

  const typeVal = (provider.Type || "").trim();
  const sexVal = (provider.Sex || "").trim();
  const npiVal = (provider.NPI || "").trim();
  const ageRangeVal = (provider["Age Range"] || "").trim();
  const suiteVal = (provider.Suite || "").trim();
  const locationVal = (provider.Location || "").trim();
  const bioVal = (provider.Biography || "").trim();
  const photoVal = (provider["Photo URL"] || "").trim();
  const newPatientsVal = (provider["New Patients"] || "").trim();
  const anyPatientsVal = (provider["Any Patients"] || "").trim();

  let backHref = "/clinicians";
  let backLabel = "Providers";
  if (/^prescriber$/i.test(typeVal)) {
    backHref = "/prescribers";
    backLabel = "Prescribers";
  } else if (/^therapist$/i.test(typeVal)) {
    backHref = "/therapists";
    backLabel = "Therapists";
  }

  const initials =
    (firstName[0] || "").toUpperCase() + (lastName[0] || "").toUpperCase();

  const notAcceptingNew = /^no$/i.test(newPatientsVal);
  const notAcceptingAny = /^no$/i.test(anyPatientsVal);
  const isRemote = /^remote$/i.test(locationVal);

  const accurateRole = getAccurateRole(typeVal, title);

  const locationPageHref =
    locationVal && !isRemote
      ? `/${locationVal.trim().toLowerCase().replace(/\s+/g, "-")}`
      : "";

  const facts = [];
  if (typeVal) facts.push(["Type", typeVal]);
  if (sexVal) facts.push(["Sex", sexVal]);
  if (npiVal) facts.push(["NPI", npiVal]);
  if (ageRangeVal) facts.push(["Age Range", ageRangeVal]);

  const photoAlt = `${displayName}${typeVal ? `, ${typeVal}` : ""}${
    locationVal ? ` in ${formatLocation(locationVal)}` : ""
  }`;

  const physicianJsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: plainName,
    url: `https://evolvepsychiatry.com/${slug}`,
    ...(title && { honorificSuffix: title }),
    ...(accurateRole && { jobTitle: accurateRole }),
    ...(photoVal && { image: photoVal }),
    ...(locationVal &&
      !isRemote && {
        address: {
          "@type": "PostalAddress",
          addressLocality: locationVal,
          addressRegion: "NY",
        },
      }),
    ...(npiVal && {
      identifier: { "@type": "PropertyValue", propertyID: "NPI", value: npiVal },
    }),
    ...(bioVal && { description: bioVal }),
    worksFor: {
      "@type": "MedicalOrganization",
      name: "Evolve Psychiatry",
      url: "https://evolvepsychiatry.com",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "All Clinicians",
        item: "https://evolvepsychiatry.com/clinicians",
      },
      ...(backHref !== "/clinicians"
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: backLabel,
              item: `https://evolvepsychiatry.com${backHref}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: backHref !== "/clinicians" ? 3 : 2,
        name: displayName,
        item: `https://evolvepsychiatry.com/${slug}`,
      },
    ],
  };

  return (
    <div className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <a href="/clinicians">All Clinicians</a>
        <span className="breadcrumb-sep">/</span>
        <a href={backHref}>{backLabel}</a>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{displayName}</span>
      </nav>

      <div className="profile-card">
        <div className="profile-header">
          <ClickableProfilePhoto
            photoVal={photoVal}
            alt={photoAlt}
            initials={initials}
          />
          <div className="profile-heading">
            <h1>{displayName}</h1>
            {accurateRole && <p className="profile-role-subtitle">{accurateRole}</p>}
            <div className="badge-row">
              {locationVal && (
                <span className="location-badge">
                  <LocationIcon />
                  {formatLocation(locationVal)}
                </span>
              )}
              {suiteVal && (
                <span className="suite-badge">
                  <SuiteIcon />
                  Suite {suiteVal}
                </span>
              )}
            </div>
          </div>
        </div>

        {notAcceptingAny ? (
          <div className="status-banner closed">
            <XCircleIcon />
            Currently not accepting any patients.
          </div>
        ) : notAcceptingNew ? (
          <div className="status-banner closed">
            <XCircleIcon />
            Currently not accepting new patients.
          </div>
        ) : newPatientsVal ? (
          <div className="status-banner open">
            <CheckIcon />
            Accepting new patients.
          </div>
        ) : null}

        {isRemote && !notAcceptingNew && (
          <div className="telehealth-note">
            <MonitorIcon />
            Telehealth appointments only.
          </div>
        )}

        {facts.length > 0 && (
          <div className="facts-panel">
            {facts.map(([label, value]) => (
              <div className="fact" key={label}>
                <span className="fact-label">{label}</span>
                <span className="fact-value">{value}</span>
              </div>
            ))}
          </div>
        )}

        {bioVal && (
          <>
            <div className="bio-heading">About {firstName || plainName}</div>
            <p className="bio-text">{bioVal}</p>
          </>
        )}

        <div className="cta-row">
          <a className="cta-primary" href="/new-patient">
            <UserPlusIcon />
            Become A New Patient
          </a>
          {locationPageHref && (
            <a className="cta-secondary" href={locationPageHref}>
              <LocationIcon />
              View {formatLocation(locationVal)}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
