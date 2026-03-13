"use client";

import { Button } from "@/components/Button";
import { usePostHog } from "posthog-js/react";
import { landingPageAnalytics } from "@/hooks/useAnalytics";

export function CTAButtons() {
  const posthog = usePostHog();
  return (
    <div className="flex flex-col md:flex-row justify-center mt-10 gap-2">
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
          link={{ href: "/sales", target: "_blank" }}
          onClick={() => landingPageAnalytics.talkToSalesClicked(posthog)}
        >
          Liên hệ tư vấn
        </Button>
      </div>
    </div>
  );
}
