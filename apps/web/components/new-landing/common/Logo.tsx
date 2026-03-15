import Image from "next/image";
import { BRAND_LOGO_URL, BRAND_NAME } from "@/utils/branding";

interface LogoProps {
  variant?: "default" | "mobile" | "glass";
}

function CustomLogo({
  logoUrl,
  variant = "default",
}: {
  logoUrl: string;
  variant?: LogoProps["variant"];
}) {
  const dimensions =
    variant === "mobile"
      ? { width: 98, height: 17 }
      : { width: 142, height: 19 };
  const sizeClass = variant === "mobile" ? "h-4 w-auto" : "h-5 w-auto";

  return (
    <Image
      src={logoUrl}
      alt={`${BRAND_NAME} logo`}
      width={dimensions.width}
      height={dimensions.height}
      className={sizeClass}
      unoptimized
    />
  );
}

export function Logo({ variant = "default" }: LogoProps) {
  if (BRAND_LOGO_URL) {
    return <CustomLogo logoUrl={BRAND_LOGO_URL} variant={variant} />;
  }

  return (
    <span className="inline-flex items-center text-2xl font-bold text-gray-900 md:text-4xl">
      FocusMail
    </span>
  );
}
