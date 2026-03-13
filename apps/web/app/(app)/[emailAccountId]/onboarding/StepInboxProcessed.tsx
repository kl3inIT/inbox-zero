"use client";

import { ArrowRightIcon } from "lucide-react";
import { PageHeading, TypographyP } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { InboxReadyIllustration } from "@/app/(app)/[emailAccountId]/onboarding/illustrations/InboxReadyIllustration";
import { ONBOARDING_PROCESS_EMAILS_COUNT } from "@/utils/config";
import { usePremium } from "@/components/PremiumAlert";

export function StepInboxProcessed({ onNext }: { onNext: () => void }) {
  const { isPremium } = usePremium();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="mb-6 h-[240px] flex items-end justify-center">
          <InboxReadyIllustration />
        </div>

        <PageHeading className="mb-3">
          Hộp thư xem trước đã sẵn sàng
        </PageHeading>

        <TypographyP className="text-muted-foreground mb-8">
          Chúng tôi đã gắn nhãn {ONBOARDING_PROCESS_EMAILS_COUNT} email gần nhất
          của bạn và soạn sẵn phản hồi (không có email nào bị lưu trữ).
          {!isPremium && (
            <>
              <br />
              Để email mới được xử lý tự động, bạn cần nâng cấp gói sử dụng.
            </>
          )}
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
