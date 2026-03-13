import type { Metadata } from "next";
import { TermsContent } from "@/app/(landing)/terms/content";
import { getBrandTitle } from "@/utils/branding";

export const metadata: Metadata = {
  title: getBrandTitle("Điều khoản dịch vụ"),
  description: getBrandTitle("Điều khoản dịch vụ"),
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <TermsContent />;
}
