// Returns an accurate professional role description based on both Type
// AND credential (Title) -- not just Type alone. "Psychiatrist" only
// applies to MD/DO; a PMHNP or PA-C prescriber is not a psychiatrist by
// definition, even though they prescribe in a psychiatric practice.
// Shared across individual provider pages and the directory pages so
// the logic (and any future correction to it) only has to change once.
export function getAccurateRole(typeVal, titleVal) {
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
