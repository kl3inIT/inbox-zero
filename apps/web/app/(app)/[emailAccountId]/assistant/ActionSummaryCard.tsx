import { TagIcon } from "lucide-react";
import type { CreateRuleBody } from "@/utils/actions/rule.validation";
import { ActionType } from "@/generated/prisma/enums";
import { CardBasic } from "@/components/ui/card";
import {
  ACTION_TYPE_TEXT_COLORS,
  ACTION_TYPE_ICONS,
} from "@/app/(app)/[emailAccountId]/assistant/constants";
import { TooltipExplanation } from "@/components/TooltipExplanation";
import { getEmailTerminology } from "@/utils/terminology";
import type { EmailLabel } from "@/providers/EmailProvider";
import { BRAND_NAME } from "@/utils/branding";

export function ActionSummaryCard({
  action,
  typeOptions,
  provider,
  labels,
}: {
  action: CreateRuleBody["actions"][number];
  typeOptions: { label: string; value: ActionType }[];
  provider: string;
  labels: EmailLabel[];
}) {
  // don't display
  if (action.type === ActionType.DIGEST) {
    return null;
  }

  const terminology = getEmailTerminology(provider);
  const actionTypeLabel =
    typeOptions.find((opt) => opt.value === action.type)?.label || action.type;

  const delaySuffix = formatDelay(action.delayInMinutes);

  let summaryContent: React.ReactNode = actionTypeLabel;
  let tooltipText: string | undefined;

  switch (action.type) {
    case ActionType.LABEL: {
      const labelId = action.labelId?.value || "";
      const labelName = labelId
        ? labels.find((label) => label.id === labelId)?.name
        : action.labelId?.name || "";

      if (action.labelId?.ai) {
        summaryContent = labelName
          ? `AI ${terminology.label.action}: ${labelName}`
          : `AI ${terminology.label.action}`;
      } else {
        summaryContent = `${terminology.label.action} là "${labelName || "chưa đặt"}"`;
      }
      break;
    }

    case ActionType.DRAFT_EMAIL: {
      if (action.content?.setManually) {
        const contentValue = action.content?.value || "";
        summaryContent = (
          <>
            <span>Soạn thư trả lời nháp</span>
            {action.to?.value && (
              <span className="text-muted-foreground">
                {" "}
                tới {action.to.value}
              </span>
            )}
            {contentValue && (
              <>
                <span>:</span>
                <span className="mt-2 block text-muted-foreground">
                  {contentValue}
                </span>
              </>
            )}
            <OptionalEmailFields
              cc={action.cc?.value}
              bcc={action.bcc?.value}
            />
          </>
        );
      } else {
        summaryContent = (
          <>
            <div className="flex items-center gap-2">
              <div>
                <span>AI soạn thư trả lời nháp</span>
                {action.to?.value && (
                  <span className="text-muted-foreground">
                    {" "}
                    tới {action.to.value}
                  </span>
                )}
              </div>
              <TooltipExplanation
                size="md"
                text="AI sẽ tạo một câu trả lời theo giọng văn của bạn. AI sẽ dùng kiến thức đã lưu và các cuộc trao đổi trước đây với người gửi để soạn trả lời."
              />
            </div>
            <OptionalEmailFields
              cc={action.cc?.value}
              bcc={action.bcc?.value}
            />
          </>
        );
      }
      break;
    }

    case ActionType.REPLY: {
      if (action.content?.setManually) {
        const contentValue = action.content?.value || "";
        summaryContent = (
          <>
            <span>Trả lời</span>
            {action.to?.value && (
              <span className="text-muted-foreground">
                {" "}
                tới {action.to.value}
              </span>
            )}
            {contentValue && (
              <>
                <span>:</span>
                <span className="mt-2 block text-muted-foreground">
                  {contentValue}
                </span>
              </>
            )}
            <OptionalEmailFields
              cc={action.cc?.value}
              bcc={action.bcc?.value}
            />
          </>
        );
      } else {
        summaryContent = (
          <>
            <span>AI trả lời</span>
            {action.to?.value && (
              <span className="text-muted-foreground">
                {" "}
                tới {action.to.value}
              </span>
            )}
            <OptionalEmailFields
              cc={action.cc?.value}
              bcc={action.bcc?.value}
            />
          </>
        );
      }
      break;
    }

    case ActionType.FORWARD:
      summaryContent = (
        <>
          <span>Chuyển tiếp tới {action.to?.value || "chưa đặt"}</span>
          {action.content?.value && (
            <span className="mt-2 block text-muted-foreground">
              {action.content.value}
            </span>
          )}
          <OptionalEmailFields cc={action.cc?.value} bcc={action.bcc?.value} />
        </>
      );
      break;

    case ActionType.SEND_EMAIL:
      summaryContent = (
        <>
          <span>Gửi email tới {action.to?.value || "chưa đặt"}</span>
          {action.subject?.value && (
            <span className="text-muted-foreground">
              {" "}
              - "{action.subject.value}"
            </span>
          )}
          <OptionalEmailFields cc={action.cc?.value} bcc={action.bcc?.value} />
        </>
      );
      break;

    case ActionType.CALL_WEBHOOK:
      summaryContent = `Gọi webhook: ${action.url?.value || "chưa đặt"}`;
      tooltipText =
        "Gửi thông tin email và dữ liệu thực thi quy tắc tới endpoint webhook của bạn khi quy tắc được kích hoạt.";
      break;

    case ActionType.ARCHIVE:
      summaryContent = "Lưu trữ";
      break;

    case ActionType.MARK_READ:
      summaryContent = "Đánh dấu đã đọc";
      break;

    case ActionType.MARK_SPAM:
      summaryContent = "Đánh dấu spam";
      break;

    case ActionType.MOVE_FOLDER:
      summaryContent = `Thư mục: ${action.folderName?.value || "chưa đặt"}`;
      break;

    case ActionType.NOTIFY_SENDER:
      summaryContent = "Thông báo cho người gửi";
      tooltipText = `Gửi một thông báo tự động từ ${BRAND_NAME} (không phải từ email của bạn) cho người gửi biết email của họ đã bị lọc là email tiếp cận lạnh.`;
      break;

    default:
      summaryContent = actionTypeLabel;
  }

  const Icon = ACTION_TYPE_ICONS[action.type] || TagIcon;
  const textColorClass =
    ACTION_TYPE_TEXT_COLORS[action.type] || "text-gray-500";

  return (
    <CardBasic className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <Icon className={`size-5 ${textColorClass}`} />
        <div className="whitespace-pre-wrap">
          {summaryContent}
          {delaySuffix && (
            <span className="text-muted-foreground">{delaySuffix}</span>
          )}
        </div>
        {tooltipText && <TooltipExplanation size="md" text={tooltipText} />}
      </div>
    </CardBasic>
  );
}

function EmailField({
  label,
  value,
  className = "mt-1",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <span>{label}:</span>
      <span className="ml-1 text-muted-foreground">{value}</span>
    </div>
  );
}

function OptionalEmailFields({
  cc,
  bcc,
}: {
  cc?: string | null;
  bcc?: string | null;
}) {
  if (!cc && !bcc) return null;

  return (
    <div className="mt-3 flex flex-col gap-1">
      {cc && <EmailField label="cc" value={cc} />}
      {bcc && <EmailField label="bcc" value={bcc} />}
    </div>
  );
}

function formatDelay(delayInMinutes: number | null | undefined): string {
  if (!delayInMinutes) return "";

  if (delayInMinutes < 60) {
    return ` after ${delayInMinutes} minute${delayInMinutes === 1 ? "" : "s"}`;
  } else if (delayInMinutes < 1440) {
    const hours = Math.floor(delayInMinutes / 60);
    return ` after ${hours} hour${hours === 1 ? "" : "s"}`;
  } else {
    const days = Math.floor(delayInMinutes / 1440);
    return ` after ${days} day${days === 1 ? "" : "s"}`;
  }
}
