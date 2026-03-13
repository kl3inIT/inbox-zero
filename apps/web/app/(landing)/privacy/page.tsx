import type { Metadata } from "next";
import { PrivacyContent } from "@/app/(landing)/privacy/content";
import { getBrandTitle } from "@/utils/branding";

export const metadata: Metadata = {
  title: getBrandTitle("Chính sách bảo mật"),
  description: getBrandTitle("Chính sách bảo mật"),
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <PrivacyContent />;
}
