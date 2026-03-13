"use client";

import { useState } from "react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { toastError } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import {
  CardGreen,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cleanInboxAction } from "@/utils/actions/clean";
import { CleanAction } from "@/generated/prisma/enums";
import type { CleanupJob } from "@/generated/prisma/client";
import { PREVIEW_RUN_COUNT } from "@/app/(app)/[emailAccountId]/clean/consts";
import { useAccount } from "@/providers/EmailAccountProvider";

export function PreviewBatch({ job }: { job: CleanupJob }) {
  const { emailAccountId } = useAccount();
  const [, setIsPreviewBatch] = useQueryState("isPreviewBatch", parseAsBoolean);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunOnFullInbox = async () => {
    setIsLoading(true);
    setIsPreviewBatch(false);
    const result = await cleanInboxAction(emailAccountId, {
      daysOld: job.daysOld,
      instructions: job.instructions || "",
      action: job.action,
      skips: {
        reply: job.skipReply,
        starred: job.skipStarred,
        calendar: job.skipCalendar,
        receipt: job.skipReceipt,
        attachment: job.skipAttachment,
        conversation: job.skipConversation,
      },
    });

    setIsLoading(false);

    if (result?.serverError) {
      toastError({ description: result.serverError });
      return;
    }
  };

  return (
    <CardGreen className="mb-4">
      <CardHeader>
        <CardTitle>Chạy thử</CardTitle>
        {/* <CardDescription>
          We processed {total} emails. {archived} were{" "}
          {job.action === CleanAction.ARCHIVE ? "archived" : "marked as read"}.
        </CardDescription> */}
        <CardDescription>
          Chúng tôi đang dọn dẹp {PREVIEW_RUN_COUNT} email để bạn có thể xem thử
          cách hoạt động.
        </CardDescription>
        <CardDescription>
          Để hoàn tác, hãy di chuột lên nhãn "
          {job.action === CleanAction.ARCHIVE ? "Lưu trữ" : "Đánh dấu đã đọc"}"
          và bấm Hoàn tác.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Button onClick={handleRunOnFullInbox} loading={isLoading}>
          Chạy trên toàn bộ hộp thư
        </Button>
        {/* {disableRunOnFullInbox && (
          <CardDescription className="font-semibold">
            All emails have been processed
          </CardDescription>
        )} */}
      </CardContent>
    </CardGreen>
  );
}
