import { Badge } from "@/components/new-landing/common/Badge";
import { BlurFade } from "@/components/new-landing/common/BlurFade";
import { Card } from "@/components/new-landing/common/Card";
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
import { AutoOrganize } from "@/components/new-landing/icons/AutoOrganize";
import { Bell } from "@/components/new-landing/icons/Bell";
import { Calendar } from "@/components/new-landing/icons/Calendar";
import { Connect } from "@/components/new-landing/icons/Connect";
import { Envelope } from "@/components/new-landing/icons/Envelope";
import { Fire } from "@/components/new-landing/icons/Fire";
import { Gmail } from "@/components/new-landing/icons/Gmail";
import { Megaphone } from "@/components/new-landing/icons/Megaphone";
import { Newsletter } from "@/components/new-landing/icons/Newsletter";
import { Outlook } from "@/components/new-landing/icons/Outlook";
import { SnowFlake } from "@/components/new-landing/icons/SnowFlake";
import { SparkleBlue } from "@/components/new-landing/icons/SparkleBlue";
import { Team } from "@/components/new-landing/icons/Team";
import Image from "next/image";

interface StartedInMinutesProps {
  subtitle: React.ReactNode;
  title: React.ReactNode;
}

export function StartedInMinutes({ title, subtitle }: StartedInMinutesProps) {
  return (
    <Section>
      <SectionHeading>{title}</SectionHeading>
      <SectionSubtitle>{subtitle}</SectionSubtitle>
      <SectionContent className="sm:mx-10 md:mx-40 lg:mx-0">
        <CardWrapper className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5">
          <BlurFade inView>
            <DisplayCard
              title="Kết nối email Google hoặc Microsoft của bạn"
              description="Liên kết Gmail hoặc Outlook của bạn chỉ với hai lần nhấp để bắt đầu."
              icon={
                <Badge variant="dark-gray" size="sm" icon={<Connect />}>
                  BƯỚC 1
                </Badge>
              }
              centerContent={true}
              className="h-full"
            >
              <div className="flex gap-4">
                <CardWrapper padding="xs-2" rounded="full">
                  <Card variant="circle">
                    <div className="p-2 translate-y-1">
                      <Gmail width="64" height="64" />
                    </div>
                  </Card>
                </CardWrapper>
                <CardWrapper padding="xs-2" rounded="full">
                  <Card variant="circle">
                    <div className="p-2 translate-y-1">
                      <Outlook width="64" height="64" />
                    </div>
                  </Card>
                </CardWrapper>
              </div>
            </DisplayCard>
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <DisplayCard
              title="Sắp xếp hộp thư đến đúng như cách bạn muốn"
              description="Các danh mục thông minh được thiết lập tự động. Dùng danh mục có sẵn hoặc tự tạo danh mục của riêng bạn."
              icon={
                <Badge variant="dark-gray" size="sm" icon={<AutoOrganize />}>
                  BƯỚC 2
                </Badge>
              }
              centerContent
              className="h-full"
            >
              <div className="flex flex-col gap-2 scale-[110%]">
                <div className="flex gap-2">
                  <Badge variant="purple" icon={<Newsletter />}>
                    Bản tin
                  </Badge>
                  <Badge variant="dark-blue" icon={<Envelope />}>
                    Cần trả lời
                  </Badge>
                  <Badge variant="green" icon={<Megaphone />}>
                    Tiếp thị
                  </Badge>
                  <Badge variant="yellow" icon={<Calendar />}>
                    Lịch
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Badge variant="red" icon={<Bell />}>
                    Thông báo
                  </Badge>
                  <Badge variant="light-blue" icon={<SnowFlake />}>
                    Email bán hàng
                  </Badge>
                  <Badge variant="orange" icon={<Team />}>
                    Nhóm
                  </Badge>
                  <Badge variant="pink" icon={<Fire />}>
                    Khẩn cấp
                  </Badge>
                </div>
              </div>
            </DisplayCard>
          </BlurFade>
          <BlurFade delay={0.25 * 2} inView>
            <DisplayCard
              title="Soạn sẵn trả lời dựa trên lịch sử email và lịch của bạn"
              description="Mỗi email cần phản hồi sẽ có sẵn một bản nháp được viết trước."
              icon={
                <Badge variant="dark-gray" size="sm" icon={<SparkleBlue />}>
                  BƯỚC 3
                </Badge>
              }
            >
              <div className="pt-6 pl-6">
                <Image
                  src="/images/new-landing/new-message.png"
                  alt="Trả lời được soạn sẵn"
                  width={1000}
                  height={400}
                />
              </div>
            </DisplayCard>
          </BlurFade>
        </CardWrapper>
      </SectionContent>
    </Section>
  );
}
