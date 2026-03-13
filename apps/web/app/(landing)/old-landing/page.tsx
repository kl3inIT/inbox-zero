import type { Metadata } from "next";
import { Hero, HeroVideoPlayer } from "@/app/(landing)/home/Hero";
import { BasicLayout } from "@/components/layouts/BasicLayout";
import { FeaturesHome } from "@/app/(landing)/home/Features";
import { Privacy } from "@/app/(landing)/home/Privacy";
import { Testimonials } from "@/app/(landing)/home/Testimonials";
import { PricingLazy } from "@/app/(app)/refer/premium/PricingLazy";
import { FAQs } from "@/app/(landing)/home/FAQs";
import { FinalCTA } from "@/app/(landing)/home/FinalCTA";
import { BRAND_NAME } from "@/utils/branding";

export const metadata: Metadata = { alternates: { canonical: "/old-landing" } };

export default function Home() {
  return (
    <BasicLayout>
      <HeroHome />
      <FeaturesHome />
      <Testimonials />
      <div className="pb-32">
        <PricingLazy />
      </div>
      <Privacy />
      <FAQs />
      <FinalCTA />
    </BasicLayout>
  );
}

function HeroHome() {
  return (
    <Hero
      title="Gặp gỡ Trợ lý Email AI Thực sự Hiệu quả"
      subtitle={`${BRAND_NAME} sắp xếp hộp thư đến, soạn thảo câu trả lời bằng giọng văn của bạn và giúp bạn đạt được inbox zero nhanh chóng. Không bao giờ bỏ lỡ một email quan trọng nào nữa.`}
    >
      <HeroVideoPlayer />
    </Hero>
  );
}
