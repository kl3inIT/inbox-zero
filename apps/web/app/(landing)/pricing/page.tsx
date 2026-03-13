import type { Metadata } from "next";
import { BasicLayout } from "@/components/layouts/BasicLayout";
import { Pricing } from "@/components/new-landing/sections/Pricing";
import { PricingComparisonTable } from "@/app/(landing)/pricing/PricingComparisonTable";
import { PricingFAQs } from "@/app/(landing)/pricing/PricingFAQs";
import { SectionContent } from "@/components/new-landing/common/Section";
import { getBrandTitle } from "@/utils/branding";

export const metadata: Metadata = {
  title: getBrandTitle("Bảng giá"),
  description:
    "Bảng giá đơn giản, minh bạch. Không phí ẩn. Huỷ bất cứ lúc nào.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <BasicLayout>
      <Pricing />
      <SectionContent>
        <PricingComparisonTable />
      </SectionContent>
      <PricingFAQs />
    </BasicLayout>
  );
}
