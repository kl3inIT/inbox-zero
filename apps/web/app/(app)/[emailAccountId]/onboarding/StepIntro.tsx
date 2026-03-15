"use client";

import Image from "next/image";
import { MailIcon } from "lucide-react";
import { CardBasic } from "@/components/ui/card";
import { MutedText, PageHeading, TypographyP } from "@/components/Typography";
import { IconCircle } from "@/app/(app)/[emailAccountId]/onboarding/IconCircle";
import { OnboardingWrapper } from "@/app/(app)/[emailAccountId]/onboarding/OnboardingWrapper";
import { ContinueButton } from "@/app/(app)/[emailAccountId]/onboarding/ContinueButton";
import { BRAND_NAME } from "@/utils/branding";

export function StepIntro({ onNext }: { onNext: () => void }) {
  return (
    <OnboardingWrapper>
      <IconCircle size="lg" className="mx-auto">
        <MailIcon className="size-6" />
      </IconCircle>

      <div className="mt-4 text-center">
        <PageHeading>{`Làm quen với ${BRAND_NAME}`}</PageHeading>
        <TypographyP className="mx-auto mt-2 max-w-lg">
          Mình sẽ đưa bạn qua vài bước ngắn để bắt đầu nhanh và dùng hiệu quả
          ngay từ đầu.
        </TypographyP>
      </div>
      <div className="mt-8">
        <div className="grid gap-4 sm:gap-8">
          <Benefit
            index={1}
            title="Tự động phân loại email"
            description="Mỗi email sẽ được tự động sắp vào các nhóm như 'Cần trả lời', 'Bản tin' và 'Email tiếp thị lạnh'. Bạn cũng có thể tự tạo nhóm riêng."
            image="/images/onboarding/newsletters.png"
          />
          <Benefit
            index={2}
            title="Soạn sẵn câu trả lời"
            description="Khi mở hộp thư, những email cần phản hồi sẽ có sẵn bản nháp theo đúng giọng điệu của bạn để chỉ việc chỉnh nhẹ và gửi."
            image="/images/onboarding/draft.png"
          />
          <Benefit
            index={3}
            title="Hủy đăng ký hàng loạt"
            description="Xem những email bạn không bao giờ đọc rồi hủy đăng ký và lưu trữ chúng chỉ với một cú nhấp."
            image="/images/onboarding/bulk-unsubscribe.png"
          />
        </div>
        <div className="mt-8 flex justify-center">
          <ContinueButton onClick={onNext} />
        </div>
      </div>
    </OnboardingWrapper>
  );
}

function Benefit({
  index,
  title,
  description,
  image,
}: {
  index: number;
  title: string;
  description: string;
  image: string;
}) {
  return (
    <CardBasic className="grid max-h-[400px] gap-4 rounded-2xl p-0 pl-4 pt-4 shadow-none sm:grid-cols-5 sm:gap-8">
      <div className="col-span-2 flex items-center gap-4">
        <IconCircle>{index}</IconCircle>
        <div>
          <div className="text-lg font-semibold sm:text-xl">{title}</div>
          <MutedText className="mt-1 leading-6">{description}</MutedText>
        </div>
      </div>
      <div className="col-span-3 overflow-hidden rounded-tl-2xl border-t border-l border-slate-200 bg-slate-50 pl-4 pt-4 text-sm text-muted-foreground">
        <Image
          src={image}
          alt={title}
          width={700}
          height={700}
          className="h-full w-full rounded-tl-xl border-t border-l border-slate-200 object-cover object-left-top"
        />
      </div>
    </CardBasic>
  );
}
