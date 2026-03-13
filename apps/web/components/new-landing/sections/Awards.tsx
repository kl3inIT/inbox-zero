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
import { cn } from "@/utils";
import Image from "next/image";

type Award = {
  title: string;
  description: string;
  image: string;
  imageSize?: number;
  top?: string;
  hideOnMobile?: boolean;
};

const awards: Award[] = [
  {
    title: "SOC2 Compliant",
    description: "Bảo mật cấp doanh nghiệp. Chứng nhận SOC 2 Type 2",
    image: "/images/new-landing/awards/soc-award.png",
  },
  {
    title: "#1 GitHub Trending",
    description: "Được tin dùng và yêu thích bởi lập trình viên trên toàn cầu",
    image: "/images/new-landing/awards/github-trending-award.png",
    imageSize: 160,
    top: "top-2",
    hideOnMobile: true,
  },
  {
    title: "#1 Product Hunt",
    description: "Sản phẩm của ngày trên Product Hunt",
    image: "/images/new-landing/awards/product-hunt-award.png",
    imageSize: 170,
  },
  {
    title: "9k GitHub Stars",
    description: "Mã nguồn mở. Xem chính xác code đang làm gì",
    image: "/images/new-landing/awards/github-stars-award.png",
    imageSize: 170,
    top: "top-3",
  },
];

const defaultAwardImageSize = 200;

export function Awards() {
  return (
    <Section>
      <SectionHeading>Ưu tiên quyền riêng tư và mã nguồn mở</SectionHeading>
      <SectionSubtitle>
        Dữ liệu của bạn luôn riêng tư — không dùng để huấn luyện AI, không
        “chiêu trò” mập mờ. Chúng tôi đạt các chứng nhận bảo mật hàng đầu, và
        bạn thậm chí có thể tự host Inbox Zero nếu muốn toàn quyền kiểm soát.
      </SectionSubtitle>
      <SectionContent
        noMarginTop
        className="mt-20 gap-x-5 gap-y-20 lg:gap-y-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      >
        {awards.map((award) => (
          <CardWrapper
            padding="sm"
            rounded="sm"
            key={award.title}
            className={cn(award.hideOnMobile && "hidden md:block")}
          >
            <Card
              variant="extra-rounding"
              className="gap-3 h-full relative pt-24 text-center"
            >
              <CardContent>
                <Image
                  className={cn(
                    "absolute left-1/2 -translate-x-1/2 -translate-y-20",
                    award.top || "top-0",
                  )}
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
