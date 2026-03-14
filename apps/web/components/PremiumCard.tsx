"use client";

import { useState } from "react";
import Link from "next/link";
import { XIcon, CreditCardIcon, AlertTriangleIcon } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { isPremium } from "@/utils/premium";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils";
import { HoverCard } from "@/components/HoverCard";
import { MutedText } from "@/components/Typography";

interface PremiumData {
  lemonSqueezyRenewsAt?: Date | string | null;
  lemonSqueezySubscriptionId?: number | string | null;
  stripeSubscriptionId?: string | null;
  stripeSubscriptionStatus?: string | null;
  tier?: string | null;
}

interface PremiumExpiredCardProps {
  onDismiss?: () => void;
  premium: PremiumData | null | undefined;
}

export function PremiumExpiredCardContent({
  premium,
  onDismiss,
  isCollapsed = false,
}: PremiumExpiredCardProps & { isCollapsed?: boolean }) {
  // Convert string dates to Date objects if needed
  const lemonSqueezyRenewsAt = premium?.lemonSqueezyRenewsAt
    ? typeof premium.lemonSqueezyRenewsAt === "string"
      ? new Date(premium.lemonSqueezyRenewsAt)
      : premium.lemonSqueezyRenewsAt
    : null;

  const isUserPremium = isPremium(
    lemonSqueezyRenewsAt,
    premium?.stripeSubscriptionStatus || null,
  );

  if (isUserPremium) return null;

  const getSubscriptionMessage = () => {
    const UPGRADE_MESSAGE = {
      title: "Nâng cấp Premium",
      description: "Nâng cấp Premium để bật trợ lý email AI của bạn.",
    };

    if (!premium) {
      return UPGRADE_MESSAGE;
    }

    const status = premium.stripeSubscriptionStatus;
    const hasLemonSqueezyExpired =
      lemonSqueezyRenewsAt && lemonSqueezyRenewsAt < new Date();

    // Check if user never had a subscription
    const hasNoSubscription =
      !status &&
      !premium.stripeSubscriptionId &&
      !premium.lemonSqueezySubscriptionId;

    if (!premium || hasNoSubscription) {
      return {
        title: "Nâng cấp Premium",
        description: "Nâng cấp Premium để bật trợ lý email AI của bạn.",
      };
    }

    if (status === "past_due") {
      return {
        title: "Thanh toán đang quá hạn",
        description: "Hãy cập nhật phương thức thanh toán để tiếp tục sử dụng",
      };
    }

    if (status === "canceled" || status === "cancelled") {
      return {
        title: "Gói đã bị hủy",
        description: "Kích hoạt lại để tiếp tục dùng các tính năng AI cho email",
      };
    }

    if (status === "incomplete" || status === "incomplete_expired") {
      return {
        title: "Thanh toán chưa hoàn tất",
        description: "Hoàn tất thanh toán để kích hoạt dịch vụ",
      };
    }

    if (status === "unpaid") {
      return {
        title: "Cần thanh toán",
        description: "Cập nhật thanh toán để tiếp tục dùng các tính năng AI",
      };
    }

    if (hasLemonSqueezyExpired || status === "expired") {
      return {
        title: "Gói đã hết hạn",
        description: "Gia hạn gói để tiếp tục sử dụng",
      };
    }

    // Default fallback
    return {
      title: "Có vấn đề với gói đăng ký",
      description: "Vui lòng kiểm tra trạng thái gói đăng ký của bạn",
    };
  };

  const { title, description } = getSubscriptionMessage();

  const isNewUser =
    !premium ||
    (!premium.stripeSubscriptionStatus &&
      !premium.stripeSubscriptionId &&
      !premium.lemonSqueezySubscriptionId);

  const buttonText = isNewUser ? "Nâng cấp" : "Kích hoạt lại";
  const buttonHref = isNewUser ? "/premium" : "/settings";

  // When collapsed, show only the alert icon with a hover card
  if (isCollapsed) {
    return (
      <HoverCard
        className="w-64"
        content={
          <div className="space-y-2">
            <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">
              {title}
            </p>
            <MutedText>{description}</MutedText>
            <Button
              asChild
              size="sm"
              className="w-full bg-orange-600 text-white hover:bg-orange-700 border-0 shadow-sm h-8 mt-2"
            >
              <Link
                href={buttonHref}
                className="flex items-center justify-center gap-1.5"
              >
                <CreditCardIcon className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{buttonText}</span>
              </Link>
            </Button>
          </div>
        }
      >
        <Link
          href={buttonHref}
          className="flex items-center justify-center p-2 rounded-lg bg-orange-100 hover:bg-orange-200 transition-colors dark:bg-orange-900/30 dark:hover:bg-orange-900/50"
        >
          <AlertTriangleIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        </Link>
      </HoverCard>
    );
  }

  return (
    <Card
      className={cn(
        "border-orange-200 bg-gradient-to-tr from-transparent via-orange-50/80 to-orange-500/15 shadow-sm",
        "dark:border-orange-900 dark:from-orange-950/50 dark:via-orange-900/20 dark:to-orange-800/10",
      )}
    >
      <div className="p-3">
        <div className="flex items-start gap-2">
          <AlertTriangleIcon className="h-4 w-4 flex-shrink-0 text-orange-600 dark:text-orange-400 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-orange-800 dark:text-orange-200 leading-tight">
              {title}
            </p>
            <p className="text-xs text-orange-700/80 dark:text-orange-300/80 mt-1">
              {description}
            </p>
          </div>

          {onDismiss && (
            <button
              type="button"
              className="flex-shrink-0 rounded p-1 text-orange-600 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors dark:text-orange-400 dark:hover:bg-orange-900/20 dark:focus:ring-orange-700"
              onClick={onDismiss}
              aria-label="Đóng thông báo"
            >
              <XIcon className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="mt-3">
          <Button
            asChild
            size="sm"
            className="w-full bg-orange-600 text-white hover:bg-orange-700 border-0 shadow-sm h-8"
          >
            <Link
              href={buttonHref}
              className="flex items-center justify-center gap-1.5"
            >
              <CreditCardIcon className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{buttonText}</span>
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function PremiumCard({
  isCollapsed = false,
}: {
  isCollapsed?: boolean;
}) {
  const [dismissed, setDismissed] = useState(false);
  const { data: user, isLoading } = useUser();

  if (isLoading || dismissed || !user) return null;

  return (
    <div className={cn("px-3 pt-4", isCollapsed && "flex justify-center")}>
      <PremiumExpiredCardContent
        premium={user.premium}
        onDismiss={isCollapsed ? undefined : () => setDismissed(true)}
        isCollapsed={isCollapsed}
      />
    </div>
  );
}
