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

const faqs = [
  {
    question: `${BRAND_NAME} hỗ trợ nhà cung cấp email nào?`,
    answer:
      "Chúng tôi hỗ trợ các tài khoản Gmail, Google Workspace và Microsoft Outlook.",
  },
  {
    question: "Làm thế nào để tôi yêu cầu một tính năng mới?",
    answer: (
      <span>
        Hãy gửi{" "}
        <Anchor href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>email</Anchor>{" "}
        cho chúng tôi. Chúng tôi luôn sẵn lòng lắng nghe ý kiến để cải thiện
        trải nghiệm email của bạn.
      </span>
    ),
  },
  {
    question: `${BRAND_NAME} có thay thế ứng dụng email hiện tại của tôi không?`,
    answer: `Không. ${BRAND_NAME} hoạt động song song với ứng dụng email hiện tại của bạn, nên bạn vẫn dùng Gmail hoặc Outlook như bình thường.`,
  },
  {
    question: `Tôi có thể triển khai ${BRAND_NAME} trên hạ tầng riêng không?`,
    answer: `Có. ${BRAND_NAME} phù hợp cho các đội ngũ cần quyền kiểm soát cao hơn về dữ liệu, triển khai và quy trình vận hành.`,
  },
  {
    question: "Bạn có chính sách hoàn tiền không?",
    answer: (
      <span>
        Có, nếu bạn cảm thấy chúng tôi không mang lại giá trị cho mình, hãy gửi{" "}
        <Anchor href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>email</Anchor>{" "}
        cho chúng tôi trong vòng 14 ngày kể từ khi nâng cấp và chúng tôi sẽ hoàn
        tiền cho bạn.
      </span>
    ),
  },
  {
    question: `Tôi có thể dùng thử ${BRAND_NAME} miễn phí không?`,
    answer:
      "Chắc chắn rồi, chúng tôi có chương trình dùng thử miễn phí 7 ngày cho tất cả các gói dịch vụ để bạn có thể trải nghiệm ngay lập tức, không cần thẻ tín dụng.",
  },
];

export function FAQs() {
  return (
    <Section>
      <SectionHeading>Câu hỏi thường gặp</SectionHeading>
      <SectionContent>
        <CardWrapper>
          <dl className="grid gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <Card
                variant="extra-rounding"
                className="gap-4"
                key={faq.question}
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
