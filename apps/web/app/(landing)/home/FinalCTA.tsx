import { CallToAction } from "@/components/new-landing/CallToAction";
import {
  Section,
  SectionContent,
} from "@/components/new-landing/common/Section";
import {
  SectionHeading,
  SectionSubtitle,
} from "@/components/new-landing/common/Typography";
import { BRAND_NAME } from "@/utils/branding";

export function FinalCTA() {
  return (
    <div
      className="bg-[url('/images/new-landing/buy-back-time-bg.png')] bg-cover bg-center bg-no-repeat"
      style={{ backgroundPosition: "center 44%" }}
    >
      <Section>
        <SectionHeading>
          Lấy lại một giờ mỗi ngày.
          <br />
          {`Bắt đầu dùng ${BRAND_NAME}.`}
        </SectionHeading>
        <SectionSubtitle>
          Ít thời gian hơn trong inbox. Nhiều thời gian hơn cho điều quan trọng.
        </SectionSubtitle>
        <SectionContent>
          <CallToAction
            text="Bắt đầu miễn phí"
            buttonSize="lg"
            className="mt-6"
          />
        </SectionContent>
      </Section>
    </div>
  );
}
