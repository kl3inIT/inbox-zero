"use client";

import { BotIcon, CoinsIcon, CpuIcon } from "lucide-react";
import { formatStat } from "@/utils/stats";
import { StatsCards } from "@/components/StatsCards";
import { usePremium } from "@/components/PremiumAlert";
import { LoadingContent } from "@/components/LoadingContent";
import { env } from "@/env";
import { isPremium } from "@/utils/premium";
import type { RedisUsage } from "@/utils/redis/usage";

export function Usage(props: { usage: RedisUsage | null }) {
  const { premium, isLoading, error } = usePremium();

  return (
    <LoadingContent loading={isLoading} error={error}>
      <StatsCards
        stats={[
          {
            name: "Số lượt hủy đăng ký",
            value: isPremium(
              premium?.lemonSqueezyRenewsAt || null,
              premium?.stripeSubscriptionStatus || null,
            )
              ? "Không giới hạn"
              : formatStat(
                  premium?.unsubscribeCredits ??
                    env.NEXT_PUBLIC_FREE_UNSUBSCRIBE_CREDITS,
                ),
            subvalue: "lượt",
            icon: <CoinsIcon className="h-4 w-4" />,
          },
          {
            name: "Số lần gọi API LLM",
            value: formatStat(props.usage?.openaiCalls),
            subvalue: "lần",
            icon: <BotIcon className="h-4 w-4" />,
          },
          {
            name: "Số token LLM đã dùng",
            value: formatStat(props.usage?.openaiTokensUsed),
            subvalue: "token",
            icon: <CpuIcon className="h-4 w-4" />,
          },
        ]}
      />
    </LoadingContent>
  );
}
