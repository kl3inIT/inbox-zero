import { BlurFade } from "@/components/new-landing/common/BlurFade";
import { CardWrapper } from "@/components/new-landing/common/CardWrapper";
import { DisplayCard } from "@/components/new-landing/common/DisplayCard";
import {
  Section,
  SectionContent,
} from "@/components/new-landing/common/Section";
import {
  SectionHeading,
  SectionSubtitle,
} from "@/components/new-landing/common/Typography";
import { Analytics } from "@/components/new-landing/icons/Analytics";
import { ChatTwo } from "@/components/new-landing/icons/ChatTwo";
import { Link } from "@/components/new-landing/icons/Link";
import Image from "next/image";

export function EverythingElseSection() {
  return (
    <Section>
      <SectionHeading>Thiết kế theo cách bạn thật sự làm việc</SectionHeading>
      <SectionSubtitle>
        Linh hoạt cho mọi quy trình. Đơn giản để thiết lập trong vài phút.
      </SectionSubtitle>
      <SectionContent
        noMarginTop
        className="mt-5 flex flex-col items-center gap-5 sm:mx-10 md:mx-40 lg:mx-0"
      >
        <CardWrapper className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5">
          <BlurFade inView>
            <DisplayCard
              title="Thống kê email. Đo được thì quản được"
              description="Xem ai gửi mail cho bạn nhiều nhất và điều gì đang làm nghẽn inbox. Có insight rõ ràng, rồi hành động."
              icon={<Analytics />}
            >
              <Image
                src="/images/new-landing/metrics.svg"
                alt="metrics"
                width={1000}
                height={400}
              />
            </DisplayCard>
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <DisplayCard
              title="Bản nháp hiểu lịch trình và thời gian rảnh của bạn"
              description="Kết nối lịch và CRM để soạn email dựa trên lịch thực tế và dữ liệu khách hàng."
              icon={<Link />}
            >
              <Image
                src="/images/new-landing/integrations.png"
                alt="App integrations"
                width={1000}
                height={400}
              />
            </DisplayCard>
          </BlurFade>
          <BlurFade delay={0.25 * 2} inView>
            <DisplayCard
              title="Vừa khít quy trình của bạn. Tuỳ biến bằng ngôn ngữ tự nhiên"
              description="Inbox của bạn, luật của bạn. Cấu hình mọi thứ bằng ngôn ngữ tự nhiên. Làm việc đúng theo cách bạn vận hành."
              icon={<ChatTwo />}
            >
              <Image
                src="/images/new-landing/create-rules.png"
                alt="Customize"
                width={1000}
                height={400}
              />
            </DisplayCard>
          </BlurFade>
        </CardWrapper>
      </SectionContent>
    </Section>
  );
}
