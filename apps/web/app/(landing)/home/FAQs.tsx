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
        Hãy gửi email cho chúng tôi hoặc tạo vấn đề (issue) trên{" "}
        <Anchor href="/github" newTab>
          GitHub
        </Anchor>
        . Chúng tôi luôn sẵn lòng lắng nghe ý kiến để cải thiện trải nghiệm
        email của bạn.
      </span>
    ),
  },
  {
    question: `${BRAND_NAME} có thay thế ứng dụng email hiện tại của tôi không?`,
    answer: `Không! ${BRAND_NAME} không phải là một ứng dụng email. Nó được sử dụng song song với ứng dụng email hiện tại của bạn. Bạn vẫn sử dụng Google hoặc Outlook như bình thường.`,
  },
  {
    question: "Mã nguồn có phải là nguồn mở không?",
    answer: (
      <span>
        Có! Bạn có thể xem toàn bộ mã nguồn của ứng dụng Inbox Zero trong{" "}
        <Anchor href="/github" newTab>
          kho lưu trữ GitHub
        </Anchor>
        của chúng tôi.
      </span>
    ),
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
      "Chắc chắn rồi, chúng tôi có chương trình dùng thử miễn phí 7 ngày cho tất cả các gói dịch vụ để bạn có thể trải nghiệm ngay lập tức, không cần thẻ tín dụng!",
  },
];

export function FAQs() {
  return (
    <Section>
      <SectionHeading>Câu hỏi thường gặp</SectionHeading>
      <SectionContent>
        <CardWrapper>
          <dl className="grid md:grid-cols-2 gap-6">
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
