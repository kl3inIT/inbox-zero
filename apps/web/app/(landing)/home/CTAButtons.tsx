"use client";

import { Button } from "@/components/Button";
import { usePostHog } from "posthog-js/react";
import { landingPageAnalytics } from "@/hooks/useAnalytics";

export function CTAButtons() {
  const posthog = usePostHog();

  return (
    <div className="mt-10 flex flex-col justify-center gap-2 md:flex-row">
      <div>
        <Button
          size="2xl"
          color="blue"
          link={{ href: "/login" }}
          onClick={() => landingPageAnalytics.getStartedClicked(posthog)}
        >
          Bắt đầu miễn phí
        </Button>
      </div>
      <div>
        <Button
          size="2xl"
          color="transparent"
          link={{ href: "/pricing" }}
          onClick={() => landingPageAnalytics.talkToSalesClicked(posthog)}
        >
          Xem bảng giá
        </Button>
      </div>
    </div>
  );
}
