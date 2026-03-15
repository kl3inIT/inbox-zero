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
          title={`${BRAND_NAME} cho người đi làm bận rộn`}
          subtitle={`${BRAND_NAME} giúp bạn phân loại email, soạn phản hồi nhanh hơn và không bỏ lỡ những cuộc trò chuyện quan trọng trong công việc mỗi ngày.`}
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
              "Bớt",
              "quá",
              "tải",
              "email.",
              "Thêm",
              "thời",
              "gian",
              "cho",
              "công",
              "việc",
              "quan",
              "trọng.",
            ]}
          />
        }
        subtitle={`${BRAND_NAME} dành cho nhân viên văn phòng, người đi làm, freelancer và doanh nhân độc lập muốn phân loại hộp thư, soạn nháp phản hồi, nhắc follow-up và giữ mọi cơ hội trong tầm mắt.`}
      >
        <HeroContent />
      </Hero>
      <OrganizedInbox
        title={
          <>
            Tự động phân loại email.
            <br />
            Không còn lọt thư quan trọng.
          </>
        }
        subtitle="FocusMail giúp bạn làm nổi bật email cần xử lý trước, giảm nhiễu từ bản tin và thư quảng cáo để bạn tập trung vào đúng việc mang lại doanh thu và kết quả."
      />
      <PreWrittenDrafts
        title="Soạn nháp sẵn theo đúng giọng văn của bạn"
        subtitle="Mỗi email cần phản hồi đều có sẵn bản nháp để bạn xem lại, chỉnh sửa và gửi nhanh hơn. AI hỗ trợ, còn bạn luôn là người quyết định cuối cùng."
      />
      <StartedInMinutes
        title="Thiết lập nhanh, không cần kỹ thuật"
        subtitle="Chỉ cần mô tả bằng ngôn ngữ tự nhiên, FocusMail sẽ giúp bạn tạo quy tắc xử lý email, nhắc follow-up và tối ưu inbox trong vài phút."
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
