import Link from "next/link";
import { env } from "@/env";
import { Logo } from "@/components/new-landing/common/Logo";
import { cn } from "@/utils";
import { FooterLineLogo } from "@/components/new-landing/FooterLineLogo";
import { Paragraph } from "@/components/new-landing/common/Typography";
import { UnicornScene } from "@/components/new-landing/UnicornScene";
import { footerNavigation } from "@/app/(landing)/home/Footer";
import { BRAND_LOGO_URL } from "@/utils/branding";

interface FooterProps {
  className: string;
  variant?: "default" | "simple";
}

const selfHostedFooter = {
  resources: [{ name: "Bảng giá", href: "/pricing" }],
  legal: [
    { name: "Điều khoản", href: "/terms" },
    { name: "Quyền riêng tư", href: "/privacy" },
  ],
};

export function Footer({ className, variant = "default" }: FooterProps) {
  if (env.NEXT_PUBLIC_BYPASS_PREMIUM_CHECKS) {
    return (
      <footer className="relative z-50 overflow-hidden border-t border-[#E7E7E7A3] bg-cover bg-center bg-no-repeat">
        <div className={cn("overflow-hidden px-6 py-12 lg:px-8", className)}>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {selfHostedFooter.resources.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.target}
                rel={
                  item.target === "_blank" ? "noopener noreferrer" : undefined
                }
                className="text-sm leading-6 text-gray-500 hover:text-gray-900"
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
                className="text-sm leading-6 text-gray-500 hover:text-gray-900"
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
    <footer className="relative z-50 overflow-hidden border-t border-[#E7E7E7A3] bg-cover bg-center bg-no-repeat">
      {variant === "default" ? <UnicornScene className="opacity-15" /> : null}
      <div
        className={cn("overflow-hidden px-6 py-20 sm:py-24 lg:px-8", className)}
      >
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
            <div className="mt-6">
              <FooterList title="So sánh" items={footerNavigation.compare} />
            </div>
          </div>
        </div>
        <div className="mt-40 flex items-center justify-between">
          <Logo variant="glass" />
          {footerNavigation.social.length ? (
            <div className="flex items-center gap-4">
              {footerNavigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target={item.target}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">{item.name}</span>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {variant === "default" && !BRAND_LOGO_URL ? (
        <FooterLineLogo className="absolute bottom-0 left-1/2 mx-auto hidden -translate-x-1/2 px-6 lg:px-8 xl:block -z-10" />
      ) : null}
    </footer>
  );
}

function FooterList(props: {
  title: string;
  items: { name: string; href: string; target?: string }[];
}) {
  return (
    <>
      <Paragraph
        color="gray-900"
        size="sm"
        className="font-semibold leading-6"
        as="h3"
      >
        {props.title}
      </Paragraph>
      <ul className="mt-6 space-y-3">
        {props.items.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              target={item.target}
              prefetch={item.target !== "_blank"}
              className="text-sm leading-6 text-gray-500 hover:text-gray-900"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
