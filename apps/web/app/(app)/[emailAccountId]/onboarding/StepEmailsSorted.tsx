"use client";

import { ArrowRightIcon } from "lucide-react";
import { PageHeading, TypographyP } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { EmailsSortedIllustration } from "@/app/(app)/[emailAccountId]/onboarding/illustrations/EmailsSortedIllustration";

export function StepEmailsSorted({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="mb-6 h-[240px] flex items-end justify-center">
          <EmailsSortedIllustration />
        </div>

        <PageHeading className="mb-3">Email được tự động sắp xếp</PageHeading>

        <TypographyP className="text-muted-foreground mb-8">
          Email của bạn sẽ được sắp xếp vào các nhóm như "Cần trả lời", "Bản
          tin" và "Email tiếp thị lạnh".
        </TypographyP>

        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Button className="w-full" onClick={onNext}>
            Tiếp tục
            <ArrowRightIcon className="size-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
