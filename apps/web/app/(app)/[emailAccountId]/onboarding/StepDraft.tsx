"use client";

import Image from "next/image";
import { CheckIcon, PenIcon, XIcon } from "lucide-react";
import { PageHeading, TypographyP } from "@/components/Typography";
import { IconCircle } from "@/app/(app)/[emailAccountId]/onboarding/IconCircle";
import { OnboardingWrapper } from "@/app/(app)/[emailAccountId]/onboarding/OnboardingWrapper";
import { useCallback } from "react";
import { enableDraftRepliesAction } from "@/utils/actions/rule";
import { toastError } from "@/components/Toast";
import { OnboardingButton } from "@/app/(app)/[emailAccountId]/onboarding/OnboardingButton";

export function StepDraft({
  emailAccountId,
  onNext,
}: {
  emailAccountId: string;
  provider: string;
  onNext: () => void;
}) {
  const onSetDraftReplies = useCallback(
    async (value: string) => {
      const result = await enableDraftRepliesAction(emailAccountId, {
        enable: value === "yes",
      });

      if (result?.serverError) {
        toastError({
          description: `Đã xảy ra lỗi: ${result.serverError || ""}`,
        });
      }

      onNext();
    },
    [onNext, emailAccountId],
  );

  return (
    <div className="relative">
      <div className="xl:pr-[50%]">
        <OnboardingWrapper className="py-0">
          <IconCircle size="lg" className="mx-auto">
            <PenIcon className="size-6" />
          </IconCircle>

          <div className="text-center mt-4">
            <PageHeading>
              Bạn có muốn chúng tôi soạn sẵn phản hồi cho bạn?
            </PageHeading>
            <TypographyP className="mt-2 max-w-lg mx-auto">
              Các bản nháp sẽ xuất hiện trong hộp thư của bạn, được viết theo
              đúng giọng văn của bạn.
              <br />
              AI sẽ học từ các cuộc trao đổi trước đây để gợi ý câu trả lời phù
              hợp nhất.
            </TypographyP>
          </div>

          <div className="mt-4 grid gap-2">
            <OnboardingButton
              text="Có, hãy bật tính năng này"
              icon={<CheckIcon className="size-4" />}
              onClick={() => onSetDraftReplies("yes")}
            />

            <OnboardingButton
              text="Không, để sau"
              icon={<XIcon className="size-4" />}
              onClick={() => onSetDraftReplies("no")}
            />
          </div>
        </OnboardingWrapper>
      </div>

      <div className="fixed top-0 right-0 w-1/2 h-screen bg-white items-center justify-center hidden xl:flex px-10">
        <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200">
          <Image
            src="/images/onboarding/draft.png"
            alt="Bản nháp phản hồi"
            width={1200}
            height={800}
            className="rounded-xl border border-slate-200"
          />
        </div>
      </div>
    </div>
  );
}
