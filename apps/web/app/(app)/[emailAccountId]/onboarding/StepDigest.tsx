"use client";

import { MailsIcon } from "lucide-react";
import { PageHeading, TypographyP } from "@/components/Typography";
import { IconCircle } from "@/app/(app)/[emailAccountId]/onboarding/IconCircle";
import { OnboardingWrapper } from "@/app/(app)/[emailAccountId]/onboarding/OnboardingWrapper";
import { ContinueButton } from "@/app/(app)/[emailAccountId]/onboarding/ContinueButton";
import { DigestScheduleForm } from "@/app/(app)/[emailAccountId]/settings/DigestScheduleForm";
import { OnboardingImagePreview } from "@/app/(app)/[emailAccountId]/onboarding/ImagePreview";
import { Button } from "@/components/ui/button";

export function StepDigest({ onNext }: { onNext: () => void }) {
  return (
    <div className="grid xl:grid-cols-2">
      <OnboardingWrapper className="py-0">
        <IconCircle size="lg" className="mx-auto">
          <MailsIcon className="size-6" />
        </IconCircle>

        <div className="mt-4 text-center">
          <PageHeading>Tóm tắt hằng ngày</PageHeading>
          <TypographyP className="mx-auto mt-2 max-w-lg">
            Nhận một email tóm tắt ngắn gọn về những gì diễn ra trong hộp thư
            hôm nay. Đọc hộp thư trong 30 giây thay vì 30 phút.
          </TypographyP>
        </div>

        <DigestScheduleForm showSaveButton={false} />

        <div className="mt-8 flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={onNext}>
            Để sau
          </Button>

          <ContinueButton onClick={onNext} />
        </div>
      </OnboardingWrapper>

      <div className="fixed top-0 right-0 hidden h-screen w-1/2 items-center justify-center bg-white xl:flex">
        <OnboardingImagePreview
          src="/images/onboarding/digest.png"
          alt="Ví dụ email tóm tắt"
          width={672}
          height={1200}
        />
      </div>
    </div>
  );
}
