export function FlagIcon({ code, className }: { code: string; className?: string }) {
  const flagCodeMap: { [key: string]: string } = {
    en: "gb", // Assuming 'en' is Great Britain
    fr: "fr",
  }

  const countryCode = flagCodeMap[code] || code

  return <span className={`fi fi-${countryCode} ${className}`}></span>
}

