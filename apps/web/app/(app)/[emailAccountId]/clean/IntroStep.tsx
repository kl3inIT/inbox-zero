"use client";

import Image from "next/image";
import { SectionDescription } from "@/components/Typography";
import { TypographyH3 } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { useStep } from "@/app/(app)/[emailAccountId]/clean/useStep";
import { CleanAction } from "@/generated/prisma/enums";
import { PremiumAlertWithData } from "@/components/PremiumAlert";

export function IntroStep({
  unhandledCount,
  cleanAction,
}: {
  unhandledCount: number;
  cleanAction: CleanAction;
}) {
  const { onNext } = useStep();

  return (
    <div>
      <PremiumAlertWithData className="mb-20" activeOnly />
      <div className="text-center">
        <Image
          src="/images/illustrations/home-office.svg"
          alt="clean up"
          width={200}
          height={200}
          className="mx-auto dark:brightness-90 dark:invert"
          unoptimized
        />

        <TypographyH3 className="mt-2">
          Dọn dẹp hộp thư đến của bạn trong 5 phút
        </TypographyH3>

        {unhandledCount === null ? (
          <SectionDescription className="mx-auto mt-2 max-w-prose">
            Đang kiểm tra hộp thư của bạn...
          </SectionDescription>
        ) : (
          <>
            <SectionDescription className="mx-auto mt-2 max-w-prose">
              Bạn có {unhandledCount.toLocaleString()}{" "}
              {cleanAction === CleanAction.ARCHIVE
                ? "chưa được lưu trữ"
                : "chưa đọc"}{" "}
              email trong hộp thư đến.
            </SectionDescription>
            <SectionDescription className="mx-auto mt-2 max-w-prose">
              Hãy dọn dẹp hộp thư trong khi vẫn giữ an toàn các email quan
              trọng.
            </SectionDescription>
          </>
        )}

        <div className="mt-6">
          <Button onClick={onNext} disabled={unhandledCount === null}>
            Tiếp tục
          </Button>
        </div>
      </div>
    </div>
  );
}
