import { BotIcon, FilterIcon } from "lucide-react";
import type { CreateRuleBody } from "@/utils/actions/rule.validation";
import { ConditionType } from "@/utils/config";
import { CardBasic } from "@/components/ui/card";

export function ConditionSummaryCard({
  condition,
}: {
  condition: CreateRuleBody["conditions"][number];
}) {
  let summaryContent: React.ReactNode = condition.type;
  let Icon = FilterIcon;
  let textColorClass = "text-gray-500";

  switch (condition.type) {
    case ConditionType.AI: {
      Icon = BotIcon;
      textColorClass = "text-purple-500";
      summaryContent = condition.instructions || "Chưa thiết lập hướng dẫn nào";
      break;
    }

    case ConditionType.STATIC: {
      textColorClass = "text-blue-500";
      const parts: string[] = [];

      if (condition.from) {
        parts.push(`Người gửi (From): ${condition.from}`);
      }
      if (condition.to) {
        parts.push(`Người nhận (To): ${condition.to}`);
      }
      if (condition.subject) {
        parts.push(`Tiêu đề (Subject): ${condition.subject}`);
      }

      if (parts.length > 0) {
        summaryContent = (
          <>
            <span>Điều kiện tĩnh</span>
            <div className="mt-2 space-y-1">
              {parts.map((part, index) => (
                <div key={index} className="text-muted-foreground">
                  {part}
                </div>
              ))}
            </div>
          </>
        );
      } else {
        summaryContent = "Điều kiện tĩnh (chưa đặt bộ lọc nào)";
      }
      break;
    }

    default:
      summaryContent = `Điều kiện ${condition.type}`;
  }

  return (
    <CardBasic className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <Icon className={`size-5 ${textColorClass} flex-shrink-0`} />
        <div className="whitespace-pre-wrap">{summaryContent}</div>
      </div>
    </CardBasic>
  );
}
