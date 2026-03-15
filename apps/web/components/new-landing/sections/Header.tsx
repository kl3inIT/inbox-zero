"use client";

import { usePostHog } from "posthog-js/react";
import { cn } from "@/utils";
import { Logo } from "@/components/new-landing/common/Logo";
import { Button } from "@/components/new-landing/common/Button";
import { landingPageAnalytics } from "@/hooks/useAnalytics";

interface HeaderProps {
  className: string;
}

export function Header({ className }: HeaderProps) {
  const posthog = usePostHog();

  return (
    <header
      className={cn(
        "bg-white mx-auto flex items-center justify-between h-16",
        className,
      )}
    >
      <div className="hidden md:block">
        <Logo />
      </div>
      <div className="block md:hidden">
        <Logo variant="mobile" />
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          onClick={() => landingPageAnalytics.logInClicked(posthog)}
        >
          Đăng nhập
        </Button>
        <Button onClick={() => landingPageAnalytics.getStartedClicked(posthog)}>
          <span className="relative z-10">Bắt đầu miễn phí</span>
        </Button>
      </div>
    </header>
  );
}
