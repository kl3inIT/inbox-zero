"use client";

import Content from "./content.mdx";
import { LegalPage } from "@/components/LegalPage";

export function TermsContent() {
  return (
    <LegalPage
      date="2023-07-16"
      title="Điều khoản dịch vụ"
      content={<Content />}
    />
  );
}
