"use client";

import { useState } from "react";
import { ArrowRightIcon, ChromeIcon, MailsIcon } from "lucide-react";
import { PageHeading, TypographyP } from "@/components/Typography";
import { IconCircle } from "@/app/(app)/[emailAccountId]/onboarding/IconCircle";
import { OnboardingWrapper } from "@/app/(app)/[emailAccountId]/onboarding/OnboardingWrapper";
import { Button } from "@/components/ui/button";
import { OnboardingImagePreview } from "@/app/(app)/[emailAccountId]/onboarding/ImagePreview";
import { EXTENSION_URL } from "@/utils/config";
import { BRAND_NAME } from "@/utils/branding";

export function StepExtension({ onNext }: { onNext: () => Promise<void> }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="grid xl:grid-cols-2">
      <OnboardingWrapper className="py-0">
        <IconCircle size="lg" className="mx-auto">
          <MailsIcon className="size-6" />
        </IconCircle>

        <div className="mt-4 text-center">
          <PageHeading>{`Cài tiện ích tab của ${BRAND_NAME}`}</PageHeading>
          <TypographyP className="mx-auto mt-2 max-w-lg">
            Thêm các tab vào Gmail để chỉ hiển thị{" "}
            <strong>những email chưa được xử lý</strong> theo từng nhãn.
            <br />
            Bạn có thể chỉ xem email cần trả lời, hoặc chỉ xem bản tin rồi lưu
            trữ toàn bộ chúng trong một lần bấm.
          </TypographyP>
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild size="sm">
            <a href={EXTENSION_URL} target="_blank" rel="noopener noreferrer">
              <ChromeIcon className="mr-2 size-4" />
              Cài tiện ích
            </a>
          </Button>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              setIsLoading(true);
              onNext().finally(() => {
                setIsLoading(false);
              });
            }}
            loading={isLoading}
          >
            Để sau <ArrowRightIcon className="ml-2 size-4" />
          </Button>
        </div>
      </OnboardingWrapper>

      <div className="fixed top-0 right-0 hidden h-screen w-1/2 items-center justify-center bg-white xl:flex">
        <OnboardingImagePreview
          src="/images/onboarding/extension.png"
          alt={`Tiện ích tab ${BRAND_NAME}`}
          width={672}
          height={1200}
        />
      </div>
    </div>
  );
}
