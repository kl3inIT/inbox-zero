import Image from "next/image";
import { BRAND_LOGO_URL, BRAND_NAME } from "@/utils/branding";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  if (BRAND_LOGO_URL) {
    return (
      <Image
        src={BRAND_LOGO_URL}
        alt={`${BRAND_NAME} logo`}
        width={355}
        height={47}
        className={className}
        unoptimized
      />
    );
  }

  return (
    <span
      title={`${BRAND_NAME} logo`}
      className={`inline-flex items-center font-bold tracking-tight text-foreground ${className ?? ""}`}
    >
      FocusMaill
    </span>
  );
}
