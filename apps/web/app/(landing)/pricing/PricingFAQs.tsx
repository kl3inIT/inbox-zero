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
    answer: "Có. Tất cả các gói đều bao gồm 7 ngày dùng thử miễn phí.",
  },
  {
    question: "Tôi có thể chuyển đổi giữa các gói không?",
    answer:
      "Có. Bạn có thể nâng cấp hoặc hạ cấp bất cứ lúc nào. Thay đổi sẽ có hiệu lực ngay và được tính phí theo phần chênh lệch tương ứng.",
  },
  {
    question: "Bạn chấp nhận phương thức thanh toán nào?",
    answer:
      "Chúng tôi chấp nhận các loại thẻ tín dụng và thẻ ghi nợ phổ biến thông qua Stripe.",
  },
  {
    question: "Có giảm giá khi thanh toán theo năm không?",
    answer:
      "Có. Bạn có thể tiết kiệm đến 20% khi chọn thanh toán theo năm.",
  },
  {
    question: "Có ưu đãi cho nhóm lớn, công ty nhỏ hoặc đội ngũ chuyên môn không?",
    answer: (
      <span>
        Có. Hãy gửi{" "}
        <Anchor href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>email</Anchor>{" "}
        cho chúng tôi để được tư vấn gói phù hợp cho đội sales, CSKH, vận hành
        hoặc nhóm làm việc nhiều tài khoản.
      </span>
    ),
  },
  {
    question: "Nếu tôi hủy thì sao?",
    answer:
      "Bạn có thể hủy bất cứ lúc nào. Gói đăng ký của bạn vẫn tiếp tục hoạt động đến hết chu kỳ thanh toán hiện tại.",
  },
  {
    question: "Có hoàn tiền không?",
    answer: (
      <span>
        Có. Nếu bạn thấy FocusMail chưa mang lại giá trị như kỳ vọng, hãy gửi{" "}
        <Anchor href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>email</Anchor>{" "}
        trong vòng 14 ngày kể từ khi nâng cấp và đội ngũ sẽ hỗ trợ hoàn tiền.
      </span>
    ),
  },
  {
    question: "Có gói riêng cho nhóm làm việc không?",
    answer:
      "Có. FocusMail hỗ trợ báo giá theo số lượng tài khoản, onboarding riêng và các lựa chọn hỗ trợ phù hợp cho nhóm làm việc hoặc doanh nghiệp nhỏ.",
  },
];

export function PricingFAQs() {
  return (
    <Section>
      <SectionHeading>Hỏi đáp về giá</SectionHeading>
      <SectionContent>
        <CardWrapper>
          <dl className="grid gap-6 md:grid-cols-2">
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
                    className="mb-4 font-semibold tracking-tight"
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
