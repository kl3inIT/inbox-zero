import Link from "next/link";
import { env } from "@/env";
import { EXTENSION_URL } from "@/utils/config";
import { BRAND_NAME, SUPPORT_EMAIL } from "@/utils/branding";

export type FooterLink = {
  name: string;
  href: string;
  target?: string;
};

export const footerNavigation: {
  main: FooterLink[];
  useCases: FooterLink[];
  industries: FooterLink[];
  compare: FooterLink[];
  tools: FooterLink[];
  support: FooterLink[];
  company: FooterLink[];
  legal: FooterLink[];
  social: FooterLink[];
} = {
  main: [
    {
      name: `${BRAND_NAME} Tabs (Tiện ích Chrome)`,
      href: EXTENSION_URL,
    },
    { name: "Trợ lý Email AI", href: "/ai-automation" },
    { name: "Tóm tắt cuộc họp", href: "/brief-my-meeting" },
    { name: "Reply Zero", href: "/reply-zero-ai" },
    { name: "Hủy đăng ký email hàng loạt", href: "/bulk-email-unsubscriber" },
    { name: "Dọn dẹp inbox", href: "/clean-inbox" },
    { name: "Chặn email lạnh", href: "/block-cold-emails" },
    { name: "Phân tích email", href: "/email-analytics" },
    { name: "Tự động chuyển tiếp email", href: "/auto-forward-emails" },
  ],
  useCases: [
    { name: "Nhà sáng lập", href: "/founders" },
    { name: "Doanh nghiệp nhỏ", href: "/small-business" },
    { name: "Nhà sáng tạo nội dung", href: "/creator" },
    { name: "Môi giới BĐS", href: "/real-estate" },
    { name: "Chăm sóc khách hàng", href: "/support" },
    { name: "Thương mại điện tử", href: "/ecommerce" },
  ],
  industries: [
    { name: "MSPs", href: "/msp" },
    { name: "Quản lý bất động sản", href: "/property-management" },
    { name: "Hãng luật", href: "/law-firms" },
    { name: "Công ty kế toán", href: "/accounting-firms" },
  ],
  compare: [
    { name: "vs Fyxer.ai", href: "/best-fyxer-alternative" },
    {
      name: "vs Trợ lý email Perplexity",
      href: "/best-perplexity-email-assistant-alternative",
    },
  ],
  tools: [
    {
      name: "Kiểm tra khả năng gửi email",
      href: "/tools/email-deliverability-checker",
    },
    { name: "Trắc nghiệm tính cách Gmail", href: "/tools/gmail-quiz" },
    { name: "Phân tích tiêu đề email", href: "/tools/subject-line-analyzer" },
    { name: "Tạo chữ ký email", href: "/tools/email-signature-generator" },
    { name: "Tính chi phí cuộc họp", href: "/tools/meeting-cost-calculator" },
  ],
  support: [
    { name: "Bảng giá", href: "/pricing" },
    {
      name: "Liên hệ",
      href: `mailto:${SUPPORT_EMAIL}`,
      target: "_blank",
    },
  ],
  company: [
    { name: "Blog", href: "/blog" },
    { name: "Nghiên cứu tình huống", href: "/case-studies" },
  ],
  legal: [
    { name: "Điều khoản", href: "/terms" },
    { name: "Quyền riêng tư", href: "/privacy" },
    { name: "Sơ đồ trang", href: "/sitemap.xml" },
  ],
  social: [],
};

const selfHostedFooter: {
  resources: FooterLink[];
  legal: FooterLink[];
} = {
  resources: [{ name: "Bảng giá", href: "/pricing" }],
  legal: [
    { name: "Điều khoản", href: "/terms" },
    { name: "Quyền riêng tư", href: "/privacy" },
  ],
};

export function Footer() {
  const copyrightName =
    BRAND_NAME === "FocusMail" ? "FocusMail Inc." : BRAND_NAME;

  if (env.NEXT_PUBLIC_BYPASS_PREMIUM_CHECKS) {
    return (
      <footer className="relative">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 lg:px-8">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {selfHostedFooter.resources.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.target}
                rel={
                  item.target === "_blank" ? "noopener noreferrer" : undefined
                }
                className="text-sm leading-6 text-gray-600 hover:text-gray-900"
              >
                {item.name}
              </Link>
            ))}
            {selfHostedFooter.resources.length ? (
              <span className="text-gray-300">|</span>
            ) : null}
            {selfHostedFooter.legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.target}
                rel={
                  item.target === "_blank" ? "noopener noreferrer" : undefined
                }
                className="text-sm leading-6 text-gray-600 hover:text-gray-900"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <p className="mt-6 text-center text-xs leading-5 text-gray-500">
            FocusMail
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-5 xl:col-span-2 xl:mt-0">
          <div>
            <FooterList title="Sản phẩm" items={footerNavigation.main} />
          </div>
          <div>
            <FooterList
              title="Trường hợp dùng"
              items={footerNavigation.useCases}
            />
            <div className="mt-6">
              <FooterList title="Ngành" items={footerNavigation.industries} />
            </div>
            <div className="mt-6">
              <FooterList title="So sánh" items={footerNavigation.compare} />
            </div>
          </div>
          <div>
            <FooterList title="Hỗ trợ" items={footerNavigation.support} />
            <div className="mt-6">
              <FooterList
                title="Công cụ miễn phí"
                items={footerNavigation.tools}
              />
            </div>
          </div>
          <div>
            <FooterList title="Công ty" items={footerNavigation.company} />
          </div>
          <div>
            <FooterList title="Pháp lý" items={footerNavigation.legal} />
          </div>
        </div>

        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; {new Date().getFullYear()} {copyrightName}. Bảo lưu mọi quyền.
        </p>
      </div>
    </footer>
  );
}

function FooterList(props: { title: string; items: FooterLink[] }) {
  return (
    <>
      <h3 className="text-sm font-semibold leading-6 text-gray-900">
        {props.title}
      </h3>
      <ul className="mt-6 space-y-4">
        {props.items.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              target={item.target}
              prefetch={item.target !== "_blank"}
              className="text-sm leading-6 text-gray-600 hover:text-gray-900"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
