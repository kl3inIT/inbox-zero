"use client";

import { useState } from "react";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import type { PostHog } from "posthog-js";
import { Label, Radio, RadioGroup } from "@headlessui/react";
import { Sparkle } from "@/components/new-landing/icons/Sparkle";
import { Zap } from "@/components/new-landing/icons/Zap";
import { Check } from "@/components/new-landing/icons/Check";
import { CardWrapper } from "@/components/new-landing/common/CardWrapper";
import {
  Section,
  SectionContent,
} from "@/components/new-landing/common/Section";
import {
  Button,
  type ButtonVariant,
} from "@/components/new-landing/common/Button";
import { Card, CardContent } from "@/components/new-landing/common/Card";
import {
  Paragraph,
  SectionHeading,
  SectionSubtitle,
  Subheading,
} from "@/components/new-landing/common/Typography";
import {
  Badge,
  type BadgeVariant,
} from "@/components/new-landing/common/Badge";
import { Chat } from "@/components/new-landing/icons/Chat";
import { type Tier, tiers } from "@/app/(app)/refer/premium/config";
import { Briefcase } from "@/components/new-landing/icons/Briefcase";
import { landingPageAnalytics } from "@/hooks/useAnalytics";
import { cn } from "@/utils";

type PricingTier = Tier & {
  badges?: {
    message: string;
    variant?: BadgeVariant;
    annualOnly?: boolean;
  }[];
  button: {
    content: string;
    variant?: ButtonVariant;
    icon?: React.ReactNode;
    href: string;
    target?: string;
  };
  icon: React.ReactNode;
};

const pricingTiers: PricingTier[] = [
  {
    ...tiers[0],
    badges: [{ message: "Tiết kiệm 10%", annualOnly: true }],
    button: {
      variant: "secondary-two",
      content: "Dùng thử miễn phí 7 ngày",
      href: "/login",
    },
    icon: <Briefcase />,
  },
  {
    ...tiers[1],
    badges: [
      { message: "Tiết kiệm 20%", annualOnly: true },
      { message: "Phổ biến", variant: "green" },
    ],
    button: {
      content: "Dùng thử miễn phí 7 ngày",
      href: "/login",
    },
    icon: <Zap />,
  },
  {
    ...tiers[2],
    badges: [{ message: "Tiết kiệm 16%", annualOnly: true }],
    button: {
      variant: "secondary-two",
      content: "Dùng thử miễn phí 7 ngày",
      href: "/login",
    },
    icon: <Sparkle />,
  },
];

const frequencies = [
  { value: "annually", label: "Hàng năm" },
  { value: "monthly", label: "Hàng tháng" },
] as const;

export function Pricing() {
  const [frequency, setFrequency] = useState<(typeof frequencies)[number]>(
    frequencies[0],
  );
  const posthog = usePostHog();

  return (
    <Section id="pricing">
      <SectionHeading>Dùng thử miễn phí, gói trả phí hợp lý</SectionHeading>
      <SectionSubtitle>Không phí ẩn. Huỷ bất cứ lúc nào.</SectionSubtitle>
      <SectionContent
        noMarginTop
        className="mt-6 flex flex-col items-center justify-center"
      >
        <RadioGroup
          value={frequency}
          onChange={setFrequency}
          className="w-fit rounded-full p-1.5 text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200 mb-6 shadow-[0_0_7px_0_rgba(0,0,0,0.0.07)]"
        >
          <Label className="sr-only">Chu kỳ thanh toán</Label>
          {frequencies.map((item) => (
            <Radio
              key={item.value}
              value={item}
              className={({ checked }) =>
                cn(
                  checked ? "bg-black text-white" : "text-gray-500",
                  "cursor-pointer rounded-full px-6 py-1",
                )
              }
            >
              <span>{item.label}</span>
            </Radio>
          ))}
        </RadioGroup>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pricingTiers.map((tier, index) => (
            <CardWrapper key={tier.name}>
              <PricingCard
                tier={tier}
                tierIndex={index}
                isAnnual={frequency.value === "annually"}
                posthog={posthog}
              />
            </CardWrapper>
          ))}
        </div>
        <CardWrapper className="mt-6 w-full">
          <Card variant="extra-rounding">
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-gray-400">
                  <Sparkle />
                </div>
                <div>
                  <h3 className="font-title text-lg">Doanh nghiệp</h3>
                  <Paragraph size="sm" className="mt-1">
                    Cần SSO, triển khai on-premise, hoặc quản lý tài khoản
                    riêng?
                  </Paragraph>
                </div>
              </div>
              <Button variant="secondary-two" size="lg" asChild>
                <Link
                  href="https://go.getinboxzero.com/sales"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    landingPageAnalytics.pricingCtaClicked(
                      posthog,
                      "Enterprise",
                      "Liên hệ tư vấn",
                    )
                  }
                >
                  <Chat />
                  <span className="relative z-10">Liên hệ tư vấn</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </CardWrapper>
      </SectionContent>
    </Section>
  );
}

interface PricingCardProps {
  isAnnual: boolean;
  posthog: PostHog;
  tier: PricingTier;
  tierIndex: number;
}

function PricingCard({ tier, tierIndex, isAnnual, posthog }: PricingCardProps) {
  const { name, description, features } = tier;
  const price = isAnnual ? tier.price.annually : tier.price.monthly;
  const isFirstTier = !tierIndex;

  return (
    <Card
      title={name}
      description={description}
      icon={tier.icon}
      variant="extra-rounding"
      addon={
        <div className="h-0 flex items-center gap-1.5">
          {tier.badges
            ?.filter(({ annualOnly }) => !annualOnly || isAnnual)
            .map((badge) => (
              <Badge key={badge.message} variant={badge.variant}>
                {badge.message}
              </Badge>
            ))}
        </div>
      }
      className="h-full"
    >
      <div className="pt-0 px-6 pb-6">
        <div className="space-y-6">
          <div className="flex gap-2 items-end">
            {price ? (
              <>
                <Subheading>${price}</Subheading>
                <Paragraph size="xs" color="light" className="-translate-y-1">
                  /người dùng /tháng
                </Paragraph>
              </>
            ) : (
              <Subheading>Liên hệ</Subheading>
            )}
          </div>
          <Button auto size="lg" variant={tier.button.variant} asChild>
            <Link
              href={tier.button.href}
              target={tier.button.target}
              onClick={() =>
                landingPageAnalytics.pricingCtaClicked(
                  posthog,
                  tier.name,
                  tier.button.content,
                )
              }
            >
              {tier.button.icon}
              {/* z-10 keeps text above gradient background on hover to prevent color shift */}
              <span className="relative z-10">{tier.button.content}</span>
            </Link>
          </Button>
        </div>
      </div>
      <CardContent className="border-t border-[#E7E7E780]">
        {isFirstTier ? null : (
          <Paragraph size="sm" className="font-medium mb-4">
            {tier.features[0].text}
          </Paragraph>
        )}
        <ul className="space-y-3">
          {features
            .filter((_, index) => !!isFirstTier || index > 0)
            .map((feature) => (
              <li
                className="text-gray-500 flex items-center gap-2 text-sm"
                key={feature.text}
              >
                <div className="text-blue-500">
                  <Check />
                </div>
                {feature.text}
              </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  );
}
