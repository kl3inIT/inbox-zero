"use client";

import { useState } from "react";
import {
  ArrowRightIcon,
  ChartBarIcon,
  ClockIcon,
  ReplyIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";
import { MutedText, PageHeading, TypographyP } from "@/components/Typography";
import { IconCircle } from "@/app/(app)/[emailAccountId]/onboarding/IconCircle";
import { OnboardingWrapper } from "@/app/(app)/[emailAccountId]/onboarding/OnboardingWrapper";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { saveOnboardingFeaturesAction } from "@/utils/actions/onboarding";
import { BRAND_NAME } from "@/utils/branding";

const choices = [
  {
    label: "Trợ lý email AI",
    description: "Tự động gắn nhãn, soạn sẵn phản hồi và xử lý nhiều việc hơn.",
    icon: <SparklesIcon className="size-4" />,
    value: "AI Personal Assistant",
  },
  {
    label: "Hủy đăng ký hàng loạt",
    description:
      "Một lần bấm để hủy đăng ký và lưu trữ những email bạn không bao giờ đọc",
    icon: <ClockIcon className="size-4" />,
    value: "Bulk Unsubscriber",
  },
  {
    label: "Chặn email tiếp thị lạnh",
    description: "Chặn email bán hàng không mong muốn và thư rác",
    icon: <ShieldCheckIcon className="size-4" />,
    value: "Cold Email Blocker",
  },
  {
    label: "Reply Zero",
    description:
      "Không còn quên trả lời hay bỏ lỡ việc theo dõi khi người khác im lặng.",
    icon: <ReplyIcon className="size-4" />,
    value: "Reply/Follow-up Tracker",
  },
  {
    label: "Phân tích email",
    description: "Theo dõi và phân tích hoạt động email của bạn",
    icon: <ChartBarIcon className="size-4" />,
    value: "Email Analytics",
  },
];

export function StepFeatures({ onNext }: { onNext: () => void }) {
  const [selectedChoices, setSelectedChoices] = useState<Map<string, boolean>>(
    new Map(),
  );

  return (
    <OnboardingWrapper className="py-0">
      <IconCircle size="lg" className="mx-auto">
        <ZapIcon className="size-6" />
      </IconCircle>

      <div className="mt-4 text-center">
        <PageHeading>{`Bạn muốn dùng ${BRAND_NAME} theo cách nào?`}</PageHeading>
        <TypographyP className="mx-auto mt-2 max-w-lg">
          Bạn có thể chọn nhiều mục mình quan tâm.
        </TypographyP>

        <div className="mx-auto mt-4 grid max-w-3xl gap-4">
          {choices.map((choice) => (
            <button
              type="button"
              key={choice.value}
              className={cn(
                "flex min-h-24 items-center gap-4 rounded-xl border bg-card p-4 text-left text-card-foreground shadow-sm transition-all",
                selectedChoices.get(choice.value) &&
                  "border-blue-600 ring-2 ring-blue-100",
              )}
              onClick={() => {
                setSelectedChoices((prev) =>
                  new Map(prev).set(choice.value, !prev.get(choice.value)),
                );
              }}
            >
              <IconCircle size="sm">{choice.icon}</IconCircle>

              <div>
                <div className="font-medium">{choice.label}</div>
                <MutedText>{choice.description}</MutedText>
              </div>
            </button>
          ))}
        </div>

        <div className="mx-auto mt-6 flex w-full max-w-xs">
          <Button
            type="button"
            className="w-full"
            onClick={() => {
              const features = Array.from(selectedChoices.entries())
                .filter(([_, isSelected]) => isSelected)
                .map(([label]) => label);

              saveOnboardingFeaturesAction({ features });

              onNext();
            }}
          >
            Tiếp tục
            <ArrowRightIcon className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </OnboardingWrapper>
  );
}
