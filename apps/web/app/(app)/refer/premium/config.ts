import { env } from "@/env";
import type { PremiumTier } from "@/generated/prisma/enums";

type Feature = { text: string; tooltip?: string };

export type Tier = {
  name: string;
  tiers: { monthly: PremiumTier; annually: PremiumTier };
  price: { monthly: number; annually: number };
  discount: { monthly: number; annually: number };
  quantity?: number;
  description: string;
  features: Feature[];
  cta: string;
  ctaLink?: string;
  mostPopular?: boolean;
};

const pricing: Record<PremiumTier, number> = {
  BASIC_MONTHLY: 16,
  BASIC_ANNUALLY: 8,
  PRO_MONTHLY: 16,
  PRO_ANNUALLY: 10,
  STARTER_MONTHLY: 25,
  STARTER_ANNUALLY: 18,
  PLUS_MONTHLY: 35,
  PLUS_ANNUALLY: 28,
  PROFESSIONAL_MONTHLY: 50,
  PROFESSIONAL_ANNUALLY: 42,
  COPILOT_MONTHLY: 500,
  LIFETIME: 299,
};

const variantIdToTier: Record<number, PremiumTier> = {
  [env.NEXT_PUBLIC_BASIC_MONTHLY_VARIANT_ID]: "BASIC_MONTHLY",
  [env.NEXT_PUBLIC_BASIC_ANNUALLY_VARIANT_ID]: "BASIC_ANNUALLY",
  [env.NEXT_PUBLIC_PRO_MONTHLY_VARIANT_ID]: "PRO_MONTHLY",
  [env.NEXT_PUBLIC_PRO_ANNUALLY_VARIANT_ID]: "PRO_ANNUALLY",
  [env.NEXT_PUBLIC_BUSINESS_MONTHLY_VARIANT_ID]: "STARTER_MONTHLY",
  [env.NEXT_PUBLIC_BUSINESS_ANNUALLY_VARIANT_ID]: "STARTER_ANNUALLY",
  [env.NEXT_PUBLIC_COPILOT_MONTHLY_VARIANT_ID]: "COPILOT_MONTHLY",
};

export const BRIEF_MY_MEETING_PRICE_ID_MONTHLY =
  "price_1SjoaXKGf8mwZWHnOdyaf2IN";
export const BRIEF_MY_MEETING_PRICE_ID_ANNUALLY =
  "price_1SjoawKGf8mwZWHnfAeShYhb";

const STRIPE_PRICE_ID_CONFIG: Record<
  PremiumTier,
  {
    priceId?: string;
    oldPriceIds?: string[];
  }
> = {
  BASIC_MONTHLY: { priceId: "price_1RfeDLKGf8mwZWHn6UW8wJcY" },
  BASIC_ANNUALLY: { priceId: "price_1RfeDLKGf8mwZWHn5kfC8gcM" },
  PRO_MONTHLY: {},
  PRO_ANNUALLY: {},
  STARTER_MONTHLY: {
    priceId: env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PRICE_ID,
    oldPriceIds: [
      "price_1T9FhCKGf8mwZWHn1olNzv6X",
      "price_1S5u73KGf8mwZWHn8VYFdALA",
      "price_1RMSnIKGf8mwZWHnlHP0212n",
      "price_1RfoILKGf8mwZWHnDiUMj6no",
      "price_1RfeAFKGf8mwZWHnnnPzFEky",
      "price_1RfSoHKGf8mwZWHnxTsSDTqW",
      "price_1Rg0QfKGf8mwZWHnDsiocBVD",
      "price_1Rg0LEKGf8mwZWHndYXYg7ie",
      "price_1Rg03pKGf8mwZWHnWMNeQzLc",
      BRIEF_MY_MEETING_PRICE_ID_MONTHLY,
    ],
  },
  STARTER_ANNUALLY: {
    priceId: env.NEXT_PUBLIC_STRIPE_BUSINESS_ANNUALLY_PRICE_ID,
    oldPriceIds: [
      "price_1S5u6uKGf8mwZWHnEvPWuQzG",
      "price_1S1QGGKGf8mwZWHnYpUcqNua",
      "price_1RMSnIKGf8mwZWHnymtuW2s0",
      "price_1RfSoxKGf8mwZWHngHcug4YM",
      BRIEF_MY_MEETING_PRICE_ID_ANNUALLY,
    ],
  },
  PLUS_MONTHLY: {
    priceId: env.NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID,
  },
  PLUS_ANNUALLY: {
    priceId: env.NEXT_PUBLIC_STRIPE_PLUS_ANNUALLY_PRICE_ID,
  },
  PROFESSIONAL_MONTHLY: {
    priceId: env.NEXT_PUBLIC_STRIPE_BUSINESS_PLUS_MONTHLY_PRICE_ID,
    oldPriceIds: [
      "price_1S5u6NKGf8mwZWHnZCfy4D5n",
      "price_1RMSoMKGf8mwZWHn5fAKBT19",
    ],
  },
  PROFESSIONAL_ANNUALLY: {
    priceId: env.NEXT_PUBLIC_STRIPE_BUSINESS_PLUS_ANNUALLY_PRICE_ID,
    oldPriceIds: [
      "price_1S5u6XKGf8mwZWHnba8HX1H2",
      "price_1RMSoMKGf8mwZWHnGjf6fRmh",
    ],
  },
  COPILOT_MONTHLY: {},
  LIFETIME: {},
};

export function getStripeSubscriptionTier({
  priceId,
}: {
  priceId: string;
}): PremiumTier | null {
  const entries = Object.entries(STRIPE_PRICE_ID_CONFIG);

  for (const [tier, config] of entries) {
    if (config.priceId === priceId || config.oldPriceIds?.includes(priceId)) {
      return tier as PremiumTier;
    }
  }
  return null;
}

export function getStripePriceId({
  tier,
}: {
  tier: PremiumTier;
}): string | null {
  return STRIPE_PRICE_ID_CONFIG[tier]?.priceId ?? null;
}

function discount(monthly: number, annually: number) {
  return ((monthly - annually) / monthly) * 100;
}

export const starterTierName = "Cá nhân";

const starterTier: Tier = {
  name: starterTierName,
  tiers: {
    monthly: "STARTER_MONTHLY",
    annually: "STARTER_ANNUALLY",
  },
  price: {
    monthly: pricing.STARTER_MONTHLY,
    annually: pricing.STARTER_ANNUALLY,
  },
  discount: {
    monthly: 0,
    annually: discount(pricing.STARTER_MONTHLY, pricing.STARTER_ANNUALLY),
  },
  description:
    "Dành cho cá nhân, nhà sáng lập và người điều hành muốn tiết kiệm thời gian xử lý email.",
  features: [
    {
      text: "Tự động phân loại và gắn nhãn email",
    },
    {
      text: "Soạn phản hồi theo giọng điệu của bạn",
    },
    {
      text: "Chặn email tiếp thị lạnh",
    },
    {
      text: "Hủy đăng ký và lưu trữ email hàng loạt",
    },
    {
      text: "Phân tích email",
    },
    {
      text: "Tóm tắt trước cuộc họp",
      tooltip:
        "Nhận bản tóm tắt AI trước mỗi cuộc họp với thông tin người tham dự và ngữ cảnh lấy từ hộp thư của bạn.",
    },
  ],
  cta: "Dùng thử miễn phí 7 ngày",
  mostPopular: false,
};

const plusTier: Tier = {
  name: "Nâng cao",
  tiers: {
    monthly: "PLUS_MONTHLY",
    annually: "PLUS_ANNUALLY",
  },
  price: {
    monthly: pricing.PLUS_MONTHLY,
    annually: pricing.PLUS_ANNUALLY,
  },
  discount: {
    monthly: 0,
    annually: discount(pricing.PLUS_MONTHLY, pricing.PLUS_ANNUALLY),
  },
  description:
    "Dành cho người dùng chuyên sâu cần tích hợp ngoài và kho tri thức lớn hơn.",
  features: [
    {
      text: "Bao gồm mọi thứ trong gói Cá nhân, cùng với:",
    },
    {
      text: "Tích hợp Slack",
      tooltip:
        "Tự động chuyển tiếp email quan trọng và thông báo vào các kênh Slack của bạn.",
    },
    {
      text: "Tự động lưu tệp đính kèm",
      tooltip:
        "Tự động sắp xếp và lưu tệp đính kèm email vào nơi lưu trữ bạn chọn.",
    },
    {
      text: "Kho tri thức không giới hạn",
      tooltip:
        "Kho tri thức được dùng để hỗ trợ soạn phản hồi. Bạn có thể lưu trữ không giới hạn nội dung.",
    },
  ],
  cta: "Dùng thử miễn phí 7 ngày",
  mostPopular: true,
};

const professionalTier: Tier = {
  name: "Nhóm",
  tiers: {
    monthly: "PROFESSIONAL_MONTHLY",
    annually: "PROFESSIONAL_ANNUALLY",
  },
  price: {
    monthly: pricing.PROFESSIONAL_MONTHLY,
    annually: pricing.PROFESSIONAL_ANNUALLY,
  },
  discount: {
    monthly: 0,
    annually: discount(
      pricing.PROFESSIONAL_MONTHLY,
      pricing.PROFESSIONAL_ANNUALLY,
    ),
  },
  description:
    "Dành cho đội nhóm và doanh nghiệp đang tăng trưởng với lượng email lớn.",
  features: [
    {
      text: "Bao gồm mọi thứ trong gói Nâng cao, cùng với:",
    },
    { text: "Phân tích theo nhóm" },
    { text: "Hỗ trợ ưu tiên" },
    {
      text: "Chuyên viên onboarding riêng",
      tooltip:
        "Đội ngũ sẽ hỗ trợ thiết lập trong cuộc gọi onboarding. Bạn có thể đặt nhiều buổi hỗ trợ nếu cần.",
    },
  ],
  cta: "Dùng thử miễn phí 7 ngày",
  mostPopular: false,
};

const enterpriseTier: Tier = {
  name: "Doanh nghiệp",
  tiers: {
    monthly: "COPILOT_MONTHLY",
    annually: "COPILOT_MONTHLY",
  },
  price: { monthly: 0, annually: 0 },
  discount: { monthly: 0, annually: 0 },
  description:
    "Dành cho tổ chức có yêu cầu cao về bảo mật, tuân thủ và hạ tầng triển khai riêng.",
  features: [
    {
      text: "Bao gồm mọi thứ trong gói Nhóm, cùng với:",
    },
    {
      text: "Đăng nhập SSO",
    },
    {
      text: "Triển khai on-premise (tùy chọn)",
    },
    {
      text: "Bảo mật nâng cao và SLA",
    },
    {
      text: "Quản lý tài khoản riêng và đào tạo đội ngũ",
    },
  ],
  cta: "Liên hệ tư vấn",
  ctaLink: "/pricing",
  mostPopular: false,
};

export function getLemonSubscriptionTier({
  variantId,
}: {
  variantId: number;
}): PremiumTier {
  const tier = variantIdToTier[variantId];
  if (!tier) throw new Error(`Unknown variant id: ${variantId}`);
  return tier;
}

export const tiers: Tier[] = [starterTier, plusTier, professionalTier];
export { enterpriseTier };
