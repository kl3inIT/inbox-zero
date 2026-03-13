import { Anchor } from "@/components/new-landing/common/Anchor";
import { Card, CardContent } from "@/components/new-landing/common/Card";
import { CardWrapper } from "@/components/new-landing/common/CardWrapper";
import {
  Section,
  SectionContent,
} from "@/components/new-landing/common/Section";
import {
  Paragraph,
  SectionHeading,
} from "@/components/new-landing/common/Typography";
import { env } from "@/env";
import { BRAND_NAME } from "@/utils/branding";

const pricingFaqs = [
  {
    question: `Tôi có thể dùng thử ${BRAND_NAME} miễn phí không?`,
    answer: "Có! Tất cả gói đều bao gồm 7 ngày dùng thử miễn phí.",
  },
  {
    question: "Tôi có thể chuyển đổi giữa các gói không?",
    answer:
      "Có, bạn có thể nâng cấp hoặc hạ cấp bất cứ lúc nào. Thay đổi có hiệu lực ngay và sẽ được tính phí theo phần chênh lệch (prorated).",
  },
  {
    question: "Bạn chấp nhận phương thức thanh toán nào?",
    answer:
      "Chúng tôi chấp nhận các thẻ tín dụng/phí phổ biến thông qua Stripe.",
  },
  {
    question: "Có giảm giá khi thanh toán theo năm không?",
    answer:
      "Có! Tiết kiệm đến 20% khi chọn thanh toán theo năm ở bất kỳ gói nào.",
  },
  {
    question:
      "Có ưu đãi cho sinh viên, tổ chức phi lợi nhuận, hoặc dự án mã nguồn mở không?",
    answer: (
      <span>
        Có! Hãy gửi{" "}
        <Anchor href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>email</Anchor>{" "}
        cho chúng tôi và chúng tôi sẽ thiết lập gói ưu đãi cho bạn.
      </span>
    ),
  },
  {
    question: "Nếu tôi huỷ thì sao?",
    answer:
      "Bạn có thể huỷ bất cứ lúc nào. Gói đăng ký của bạn vẫn hoạt động đến hết chu kỳ thanh toán hiện tại.",
  },
  {
    question: "Có hoàn tiền không?",
    answer: (
      <span>
        Có, nếu bạn cảm thấy chúng tôi chưa mang lại giá trị, hãy gửi{" "}
        <Anchor href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>email</Anchor>{" "}
        trong vòng 14 ngày kể từ khi nâng cấp và chúng tôi sẽ hoàn tiền cho bạn.
      </span>
    ),
  },
  {
    question: "Cần gói tuỳ chỉnh cho doanh nghiệp?",
    answer: (
      <span>
        <Anchor href="https://go.getinboxzero.com/sales" newTab>
          Liên hệ đội ngũ tư vấn
        </Anchor>{" "}
        để nhận báo giá tuỳ chỉnh, SSO, triển khai on-premise và hỗ trợ riêng.
      </span>
    ),
  },
];

export function PricingFAQs() {
  return (
    <Section>
      <SectionHeading>Hỏi đáp về giá</SectionHeading>
      <SectionContent>
        <CardWrapper>
          <dl className="grid md:grid-cols-2 gap-6">
            {pricingFaqs.map((faq) => (
              <Card
                variant="extra-rounding"
                className="gap-4"
                key={typeof faq.question === "string" ? faq.question : ""}
              >
                <CardContent>
                  <Paragraph
                    as="dt"
                    color="gray-900"
                    className="font-semibold tracking-tight mb-4"
                  >
                    {faq.question}
                  </Paragraph>
                  <dd>
                    <Paragraph>{faq.answer}</Paragraph>
                  </dd>
                </CardContent>
              </Card>
            ))}
          </dl>
        </CardWrapper>
      </SectionContent>
    </Section>
  );
}
