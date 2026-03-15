import Image from "next/image";
import { Card, CardContent } from "@/components/new-landing/common/Card";
import { CardWrapper } from "@/components/new-landing/common/CardWrapper";
import {
  Section,
  SectionContent,
} from "@/components/new-landing/common/Section";
import {
  Paragraph,
  SectionHeading,
  SectionSubtitle,
} from "@/components/new-landing/common/Typography";

type Award = {
  title: string;
  description: string;
  image: string;
  imageSize?: number;
  top?: string;
};

const awards: Award[] = [
  {
    title: "SOC2 Compliant",
    description: "Bảo mật cấp doanh nghiệp với chứng nhận SOC 2 Type 2.",
    image: "/images/new-landing/awards/soc-award.png",
  },
  {
    title: "#1 Product Hunt",
    description: "Được đón nhận mạnh mẽ ngay từ ngày đầu ra mắt.",
    image: "/images/new-landing/awards/product-hunt-award.png",
    imageSize: 170,
  },
];

const defaultAwardImageSize = 200;

export function Awards() {
  return (
    <Section>
      <SectionHeading>Ưu tiên quyền riêng tư và triển khai an toàn</SectionHeading>
      <SectionSubtitle>
        Dữ liệu của bạn luôn riêng tư, không dùng để huấn luyện AI đại trà. Chúng
        tôi tập trung vào bảo mật, quản trị và khả năng triển khai phù hợp cho
        đội ngũ vận hành nghiêm túc.
      </SectionSubtitle>
      <SectionContent
        noMarginTop
        className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-x-5 gap-y-20 md:grid-cols-2 lg:gap-y-0"
      >
        {awards.map((award) => (
          <CardWrapper padding="sm" rounded="sm" key={award.title}>
            <Card
              variant="extra-rounding"
              className="relative h-full gap-3 pt-24 text-center"
            >
              <CardContent>
                <Image
                  className={`absolute left-1/2 -translate-x-1/2 -translate-y-20 ${award.top || "top-0"}`}
                  src={award.image}
                  alt={award.title}
                  width={award.imageSize || defaultAwardImageSize}
                  height={award.imageSize || defaultAwardImageSize}
                />
                <Paragraph color="gray-900" size="md" className="font-bold">
                  {award.title}
                </Paragraph>
                <Paragraph size="sm" className="mt-4">
                  {award.description}
                </Paragraph>
              </CardContent>
            </Card>
          </CardWrapper>
        ))}
      </SectionContent>
    </Section>
  );
}
