import { ActionType } from "@/generated/prisma/enums";
import { Card, CardContent } from "@/components/ui/card";
import { getActionIcon } from "@/utils/action-display";
import { SectionHeader } from "@/components/Typography";
import { useAccount } from "@/providers/EmailAccountProvider";
import {
  getAvailableActions,
  getExtraActions,
} from "@/utils/ai/rule/create-rule-schema";
import { TooltipExplanation } from "@/components/TooltipExplanation";

const actionNames: Record<ActionType, string> = {
  [ActionType.LABEL]: "Gắn nhãn",
  [ActionType.MOVE_FOLDER]: "Chuyển vào thư mục",
  [ActionType.ARCHIVE]: "Lưu trữ",
  [ActionType.DRAFT_EMAIL]: "Soạn thư trả lời nháp",
  [ActionType.REPLY]: "Gửi trả lời",
  [ActionType.FORWARD]: "Chuyển tiếp",
  [ActionType.MARK_READ]: "Đánh dấu đã đọc",
  [ActionType.MARK_SPAM]: "Đánh dấu spam",
  [ActionType.SEND_EMAIL]: "Gửi email",
  [ActionType.CALL_WEBHOOK]: "Gọi webhook",
  [ActionType.DIGEST]: "Thêm vào bản tóm tắt",
  [ActionType.NOTIFY_SENDER]: "Thông báo cho người gửi",
};

const actionTooltips: Partial<Record<ActionType, string>> = {
  [ActionType.CALL_WEBHOOK]:
    "Dành cho nhà phát triển: kích hoạt tích hợp bên ngoài bằng cách gửi dữ liệu email tới một URL tuỳ chỉnh",
  [ActionType.DIGEST]:
    "Nhóm email lại và nhận chúng dưới dạng bản tóm tắt hàng ngày",
};

export function AvailableActionsPanel() {
  const { provider } = useAccount();
  return (
    <Card className="h-fit bg-slate-50 dark:bg-slate-900 hidden sm:block">
      <CardContent className="pt-4">
        <div className="grid gap-2">
          <ActionSection
            actions={[...getAvailableActions(provider), ...getExtraActions()]}
            title="Các hành động khả dụng"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ActionSection({
  title,
  actions,
}: {
  title: string;
  actions: ActionType[];
}) {
  return (
    <div>
      <SectionHeader>{title}</SectionHeader>
      <div className="grid gap-2 mt-1">
        {actions.map((actionType) => {
          const Icon = getActionIcon(actionType);
          const tooltip = actionTooltips[actionType];
          return (
            <div key={actionType} className="flex items-center gap-2">
              <Icon className="size-3.5 text-muted-foreground" />
              <span className="text-sm">{actionNames[actionType]}</span>
              {tooltip && <TooltipExplanation text={tooltip} size="sm" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
