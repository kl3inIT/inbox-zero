"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { BrainIcon } from "lucide-react";
import { ViewLearnedPatterns } from "@/app/(app)/[emailAccountId]/assistant/group/ViewLearnedPatterns";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createGroupAction } from "@/utils/actions/group";
import { useAccount } from "@/providers/EmailAccountProvider";
import { toastError } from "@/components/Toast";
import { getActionErrorMessage } from "@/utils/error";
import { Skeleton } from "@/components/ui/skeleton";

export function LearnedPatternsDialog({
  ruleId,
  groupId,
  disabled,
}: {
  ruleId: string;
  groupId: string | null;
  disabled?: boolean;
}) {
  const { emailAccountId } = useAccount();

  const [learnedPatternGroupId, setLearnedPatternGroupId] = useState<
    string | null
  >(groupId);

  const { execute, isExecuting } = useAction(
    createGroupAction.bind(null, emailAccountId),
    {
      onSuccess: (data) => {
        if (data.data?.groupId) {
          setLearnedPatternGroupId(data.data.groupId);
        } else {
          toastError({
            description: "Đã xảy ra lỗi khi thiết lập pattern đã học.",
          });
        }
      },
      onError: (error) => {
        toastError({
          description: getActionErrorMessage(error.error),
        });
      },
    },
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          Icon={BrainIcon}
          disabled={disabled}
          onClick={async () => {
            if (!ruleId) return;
            if (groupId) return;
            if (isExecuting) return;

            execute({ ruleId });
          }}
        >
          Xem pattern đã học
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pattern đã học</DialogTitle>
          <DialogDescription>
            Pattern đã học là các pattern mà AI rút ra từ lịch sử email của bạn.
            Khi một pattern đã học khớp, các điều kiện quy tắc khác sẽ được bỏ
            qua và quy tắc này được chọn tự động.
          </DialogDescription>
        </DialogHeader>

        {isExecuting ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          learnedPatternGroupId && (
            <ViewLearnedPatterns groupId={learnedPatternGroupId} />
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
