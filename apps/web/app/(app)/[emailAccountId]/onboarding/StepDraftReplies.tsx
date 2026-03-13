"use client";

import { ArrowRightIcon } from "lucide-react";
import { PageHeading, TypographyP } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { DraftRepliesIllustration } from "@/app/(app)/[emailAccountId]/onboarding/illustrations/DraftRepliesIllustration";

export function StepDraftReplies({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="mb-6 h-[240px] flex items-end justify-center">
          <DraftRepliesIllustration />
        </div>

        <PageHeading className="mb-3">Soạn sẵn câu trả lời</PageHeading>

        <TypographyP className="text-muted-foreground mb-8">
          Khi bạn mở hộp thư, mọi email cần phản hồi sẽ có sẵn một câu trả lời
          được soạn trước theo đúng giọng văn của bạn.
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
