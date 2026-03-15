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
      "FocusMail hiện hỗ trợ Gmail, Google Workspace và Microsoft Outlook.",
  },
  {
    question: "Làm thế nào để tôi yêu cầu một tính năng mới?",
    answer: (
      <span>
        Hãy gửi{" "}
        <Anchor href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>email</Anchor>{" "}
        cho chúng tôi. Đội ngũ luôn sẵn sàng lắng nghe để cải thiện trải nghiệm
        quản lý email mỗi ngày.
      </span>
    ),
  },
  {
    question: `${BRAND_NAME} có thay thế ứng dụng email hiện tại của tôi không?`,
    answer: `Không. ${BRAND_NAME} hoạt động song song với Gmail hoặc Outlook hiện tại của bạn, nên bạn không cần thay đổi thói quen làm việc quen thuộc.`,
  },
  {
    question: `${BRAND_NAME} phù hợp với ai nhất?`,
    answer: `${BRAND_NAME} phù hợp với nhân viên văn phòng, người đi làm, đội sales, chăm sóc khách hàng, freelancer và doanh nhân độc lập đang phải xử lý email liên tục mỗi ngày.`,
  },
  {
    question: "Tôi có cần biết kỹ thuật để dùng không?",
    answer:
      "Không cần. Bạn có thể mô tả nhu cầu bằng ngôn ngữ tự nhiên và FocusMail sẽ hỗ trợ tạo quy tắc xử lý email mà không cần viết code hay thiết lập phức tạp.",
  },
  {
    question: "Bạn có chính sách hoàn tiền không?",
    answer: (
      <span>
        Có. Nếu bạn thấy sản phẩm chưa mang lại giá trị như mong đợi, hãy gửi{" "}
        <Anchor href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>email</Anchor>{" "}
        cho chúng tôi trong vòng 14 ngày kể từ khi nâng cấp và đội ngũ sẽ hỗ
        trợ hoàn tiền cho bạn.
      </span>
    ),
  },
  {
    question: `Tôi có thể dùng thử ${BRAND_NAME} miễn phí không?`,
    answer:
      "Có. Tất cả các gói đều có 7 ngày dùng thử miễn phí để bạn trải nghiệm trước khi quyết định nâng cấp.",
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
