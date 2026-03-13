"use client";

import { useState } from "react";
import { CreditCardIcon, ReceiptIcon } from "lucide-react";
import Link from "next/link";
import { env } from "@/env";
import { Button } from "@/components/ui/button";
import { toastError } from "@/components/Toast";
import { getBillingPortalUrlAction } from "@/utils/actions/premium";

export function ManageSubscription({
  premium: { stripeSubscriptionId, lemonSqueezyCustomerId },
}: {
  premium: {
    stripeSubscriptionId: string | null | undefined;
    lemonSqueezyCustomerId: number | null | undefined;
  };
}) {
  const { loading: loadingBillingPortal, openBillingPortal } =
    useOpenBillingPortal();

  const hasBothStripeAndLemon = !!(
    stripeSubscriptionId && lemonSqueezyCustomerId
  );

  return (
    <>
      {stripeSubscriptionId && (
        <Button loading={loadingBillingPortal} onClick={openBillingPortal}>
          <CreditCardIcon className="mr-2 h-4 w-4" />
          Quản lý gói{hasBothStripeAndLemon ? " Stripe" : ""}
        </Button>
      )}

      {lemonSqueezyCustomerId && (
        <Button asChild>
          <Link
            href={`https://${env.NEXT_PUBLIC_LEMON_STORE_ID}.lemonsqueezy.com/billing`}
            target="_blank"
          >
            <CreditCardIcon className="mr-2 h-4 w-4" />
            Quản lý gói{hasBothStripeAndLemon ? " Lemon" : ""}
          </Link>
        </Button>
      )}
    </>
  );
}

export function ViewInvoicesButton({
  premium: { stripeCustomerId, lemonSqueezyCustomerId },
}: {
  premium: {
    stripeCustomerId: string | null | undefined;
    lemonSqueezyCustomerId: number | null | undefined;
  };
}) {
  const { loading, openBillingPortal } = useOpenBillingPortal();

  if (!stripeCustomerId && !lemonSqueezyCustomerId) return null;

  const hasBoth = !!(stripeCustomerId && lemonSqueezyCustomerId);

  return (
    <>
      {stripeCustomerId && (
        <Button
          variant="outline"
          size="sm"
          loading={loading}
          onClick={openBillingPortal}
        >
          <ReceiptIcon className="mr-2 h-4 w-4" />
          Xem hóa đơn{hasBoth ? " Stripe" : ""}
        </Button>
      )}

      {lemonSqueezyCustomerId && (
        <Button asChild variant="outline" size="sm">
          <Link
            href={`https://${env.NEXT_PUBLIC_LEMON_STORE_ID}.lemonsqueezy.com/billing`}
            target="_blank"
          >
            <ReceiptIcon className="mr-2 h-4 w-4" />
            Xem hóa đơn{hasBoth ? " Lemon" : ""}
          </Link>
        </Button>
      )}
    </>
  );
}

function useOpenBillingPortal() {
  const [loading, setLoading] = useState(false);

  const openBillingPortal = async () => {
    setLoading(true);
    const result = await getBillingPortalUrlAction({});
    setLoading(false);
    const url = result?.data?.url;
    if (result?.serverError || !url) {
      toastError({
        description:
          result?.serverError ||
          "Lỗi khi tải trang thanh toán. Vui lòng liên hệ hỗ trợ.",
      });
    } else {
      window.location.href = url;
    }
  };

  return { loading, openBillingPortal };
}
