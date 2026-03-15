import Image from "next/image";
import { BRAND_LOGO_URL, BRAND_NAME } from "@/utils/branding";
import { cn } from "@/utils";

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
      ? { width: 98, height: 24 }
      : { width: 148, height: 32 };
  const sizeClass = variant === "mobile" ? "h-6 w-auto" : "h-8 w-auto";

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

function FocusMailWordmark({
  variant = "default",
}: {
  variant?: LogoProps["variant"];
}) {
  const compact = variant === "mobile";
  const glass = variant === "glass";

  return (
    <div
      className={cn("inline-flex items-center text-slate-950", compact ? "gap-2" : "gap-3")}
      aria-label={`${BRAND_NAME} logo`}
    >
      <span
        className={`relative inline-flex items-center justify-center overflow-hidden rounded-2xl ${
          compact ? "h-8 w-8" : "h-10 w-10"
        } ${glass ? "border border-blue-100 bg-white/80 shadow-sm backdrop-blur" : "bg-blue-50"}`}
      >
        <span className="absolute inset-[3px] rounded-[14px] bg-gradient-to-br from-blue-500 via-sky-500 to-cyan-400" />
        <span
          className={`relative z-10 rounded-full border-2 border-white ${
            compact ? "h-3 w-3" : "h-4 w-4"
          }`}
        />
        <span
          className={`absolute rounded-full border-2 border-white ${
            compact ? "left-[6px] top-[8px] h-3.5 w-3.5" : "left-[7px] top-[10px] h-4.5 w-4.5"
          }`}
        />
      </span>

      <span
        className={`font-title leading-none tracking-[-0.04em] ${
          compact ? "text-xl" : "text-[1.8rem]"
        }`}
      >
        {BRAND_NAME}
      </span>
    </div>
  );
}

export function Logo({ variant = "default" }: LogoProps) {
  return (
    <Link href="/" aria-label={BRAND_NAME}>
      {BRAND_LOGO_URL ? (
        <CustomLogo logoUrl={BRAND_LOGO_URL} variant={variant} />
      ) : (
        <FocusMailWordmark variant={variant} />
      )}
    </Link>
  );
}
