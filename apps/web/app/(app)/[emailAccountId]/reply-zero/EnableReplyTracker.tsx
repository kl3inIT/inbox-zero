"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/Badge";
import { EnableFeatureCard } from "@/components/EnableFeatureCard";
import { toastSuccess } from "@/components/Toast";
import { toastError } from "@/components/Toast";
import { SectionDescription } from "@/components/Typography";
import {
  markOnboardingAsCompleted,
  REPLY_ZERO_ONBOARDING_COOKIE,
} from "@/utils/cookies";
import { useAccount } from "@/providers/EmailAccountProvider";
import { prefixPath } from "@/utils/path";
import { getRuleLabel } from "@/utils/rule/consts";
import { SystemType } from "@/generated/prisma/enums";
import {
  enableDraftRepliesAction,
  toggleRuleAction,
} from "@/utils/actions/rule";
import { CONVERSATION_STATUS_TYPES } from "@/utils/reply-tracker/conversation-status-config";

export function EnableReplyTracker({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const { emailAccountId } = useAccount();

  return (
    <EnableFeatureCard
      title="Reply Zero"
      description={
        <>
          Hộp thư của bạn đầy những email không cần bạn xử lý.
          <br />
          Reply Zero chỉ hiển thị những email thực sự cần bạn quan tâm.
        </>
      }
      extraDescription={
        <div className="mt-4 text-left">
          <SectionDescription>
            Chúng tôi sẽ gắn nhãn email của bạn với:
          </SectionDescription>

          <SectionDescription>
            <Badge color="green">{getRuleLabel(SystemType.TO_REPLY)}</Badge> -
            email bạn cần trả lời.
          </SectionDescription>
          <SectionDescription>
            <Badge color="blue">
              {getRuleLabel(SystemType.AWAITING_REPLY)}
            </Badge>{" "}
            - email bạn đang chờ phản hồi.
          </SectionDescription>

          <SectionDescription className="mt-4">
            Bạn cũng có thể bật tự động soạn thảo trả lời cho các email xuất
            hiện trong hộp thư.
          </SectionDescription>
        </div>
      }
      imageSrc="/images/illustrations/communication.svg"
      imageAlt="Reply tracking"
      buttonText={enabled ? "Đã hiểu!" : "Bật Reply Zero"}
      onEnable={async () => {
        markOnboardingAsCompleted(REPLY_ZERO_ONBOARDING_COOKIE);

        if (enabled) {
          router.push(prefixPath(emailAccountId, "/reply-zero"));
          return;
        }

        const promises = [
          ...CONVERSATION_STATUS_TYPES.map((systemType) =>
            toggleRuleAction(emailAccountId, {
              enabled: true,
              systemType,
            }),
          ),
          enableDraftRepliesAction(emailAccountId, { enable: true }),
        ];

        const result = await Promise.race(promises);

        if (result?.serverError) {
          toastError({
            title: "Lỗi khi bật Reply Zero",
            description: result.serverError,
          });
        } else {
          toastSuccess({
            title: "Đã bật Reply Zero",
            description: "Reply Zero đã được bật cho tài khoản của bạn!",
          });
        }

        router.push(prefixPath(emailAccountId, "/reply-zero?enabled=true"));
      }}
    />
  );
}
