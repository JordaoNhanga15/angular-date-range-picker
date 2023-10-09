export const detectDateFormats = (date: string): string[] => {
  const dateFormats = [
    /(\d{2}[-./\s]\d{2}[-./\s]\d{4})/,
    /(\d{2}[-./\s]\d{2}[-./\s]\d{2})/,
    /(\d{2}[-./\s]\d{2}[-./\s]\d{2,4})/,
    /(\d{2}[-./\s]\d{2}[-./\s]\d{2,4})/,
    /(\d{2}[-./\s]\d{2}[-./\s]\d{4})/,
    /(\d{2}[-./\s]\d{2}[-./\s]\d{2})/,
    /(\d{2}[-./\s]\d{2}[-./\s]\d{2,4})/,
    /(\d{2}[-./\s]\d{2}[-./\s]\d{2,4})/,
    /(\d{2}[-./\s]\d{2}[-./\s]\d{4})/,
    /(\d{2}[-./\s]\d{2}[-./\s]\d{2})/,
    /(\d{2}[-./\s]\d{2}[-./\s]\d{2,4})/,
    /(\d{2}[-./\s]\d{2}[-./\s]\d{2,4})/,
    /(\d{2}[-./\s]\d{2}[-./\s]\d{4})/,
    /(\d{2}[-./\s]\d{2}[-./\s]\d{2})/,
    /(\d{2}[-./\s]\d{2}[-./\s]\d{2,4})/,
    /(\d{2}[-./\s]\d{2}[-./\s]\d{2,4})/,
    /(\d{2}[-./\s]\d{1}[-./\s]\d{2,4})/,
    /(\d{2}[-./\s]\d{1}[-./\s]\d{2})/,
    /(\d{2}[-./\s]\d{1}[-./\s]\d{4})/,
    /(\d{1}[-./\s]\d{1}[-./\s]\d{4})/,
    /(\d{1}[-./\s]\d{2}[-./\s]\d{4})/,
  ];

  const detectedFormats: string[] = [];

  for (const format of dateFormats) {
    const matches = date.match(format);

    if (detectedFormats.length > 0) continue;

    if (matches) {
      detectedFormats.push(matches[0]);
    }
  }

  return detectedFormats;
};

export const isInvalid = (type: string | number): boolean => {
  if (!type) return false;
  if (typeof type !== "string") return false;
  return true;
};

export const countryCodes = ["en", "ni", "do", "pa", "ph", "pr", "us"];

export const countriesWithDifferentDateFormat = [
  "zh",
  "ja",
  "tw",
  "se",
  "lt",
  // "kr",
];
