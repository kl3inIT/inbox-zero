import type { Metadata } from "next";
import { Testimonials } from "@/components/new-landing/sections/Testimonials";
import { Hero, HeroContent } from "@/app/(landing)/home/Hero";
import { Pricing } from "@/components/new-landing/sections/Pricing";
import { Awards } from "@/components/new-landing/sections/Awards";
import { EverythingElseSection } from "@/components/new-landing/sections/EverythingElseSection";
import { StartedInMinutes } from "@/components/new-landing/sections/StartedInMinutes";
import { BulkUnsubscribe } from "@/components/new-landing/sections/BulkUnsubscribe";
import { OrganizedInbox } from "@/components/new-landing/sections/OrganizedInbox";
import { PreWrittenDrafts } from "@/components/new-landing/sections/PreWrittenDrafts";
import { BasicLayout } from "@/components/layouts/BasicLayout";
import { FAQs } from "@/app/(landing)/home/FAQs";
import { FinalCTA } from "@/app/(landing)/home/FinalCTA";
import { WordReveal } from "@/components/new-landing/common/WordReveal";
import { env } from "@/env";
import { BRAND_NAME } from "@/utils/branding";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function NewLanding() {
  if (env.NEXT_PUBLIC_BYPASS_PREMIUM_CHECKS) {
    return (
      <BasicLayout>
        <Hero
          title={`${BRAND_NAME} cho đội ngũ tự host`}
          subtitle={`Triển khai ${BRAND_NAME} trên hạ tầng của bạn và tự động hoá hộp thư với toàn quyền kiểm soát dữ liệu.`}
        />
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <Hero
        title={
          <WordReveal
            spaceBetween="w-2 md:w-3"
            words={[
              "Gặp",
              "trợ",
              "lý",
              "email",
              "AI",
              "thực",
              "sự",
              <em key="actually">rất</em>,
              "hiệu",
              "quả",
            ]}
          />
        }
        subtitle={`${BRAND_NAME} sắp xếp hộp thư và lịch của bạn, soạn nháp trả lời theo giọng văn của bạn, và giúp bạn nhanh chóng đạt FocusMail. Không bỏ lỡ email quan trọng nữa.`}
      >
        <HeroContent />
      </Hero>
      <OrganizedInbox
        title={
          <>
            Tự động sắp xếp.
            <br />
            Không bỏ lỡ email quan trọng nữa.
          </>
        }
        subtitle="Quá tải email? Đừng tốn công ưu tiên thủ công. Trợ lý AI của chúng tôi sẽ tự động gắn nhãn mọi thứ."
      />
      <PreWrittenDrafts
        title="Bản nháp soạn sẵn chờ trong hộp thư"
        subtitle="Khi bạn mở inbox, mọi email cần phản hồi sẽ có sẵn bản nháp theo đúng giọng văn của bạn, sẵn sàng để gửi."
      />
      <StartedInMinutes
        title="Bắt đầu chỉ trong vài phút"
        subtitle="Cài đặt một chạm. Bắt đầu sắp xếp và soạn nháp trong vài phút."
      />
      <BulkUnsubscribe />
      <EverythingElseSection />
      <Awards />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <FAQs />
    </BasicLayout>
  );
}
