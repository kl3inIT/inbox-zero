"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { cleanupAIDraftsAction } from "@/utils/actions/user";
import { toastError, toastSuccess } from "@/components/Toast";
import { getActionErrorMessage } from "@/utils/error";
import { BRAND_NAME } from "@/utils/branding";

export function CleanupDraftsSection({
  emailAccountId,
}: {
  emailAccountId: string;
}) {
  const [result, setResult] = useState<{
    deleted: number;
    skippedModified: number;
  } | null>(null);

  const { execute, isExecuting } = useAction(
    cleanupAIDraftsAction.bind(null, emailAccountId),
    {
      onSuccess: (res) => {
        if (res.data) {
          setResult(res.data);
          if (res.data.deleted === 0 && res.data.skippedModified === 0) {
            toastSuccess({ description: "Không tìm thấy bản nháp cũ nào." });
          } else if (res.data.deleted === 0) {
            toastSuccess({
              description:
                "Mọi bản nháp cũ đều đã được bạn chỉnh sửa nên không bản nháp nào bị xóa.",
            });
          } else {
            toastSuccess({
              description: `Đã dọn ${res.data.deleted} bản nháp.`,
            });
          }
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
    <>
      <ItemSeparator />
      <Item size="sm">
        <ItemContent>
          <ItemTitle>Dọn bản nháp AI</ItemTitle>
          <ItemDescription>
            {`Xóa các bản nháp do ${BRAND_NAME} tạo ra đã quá 3 ngày và chưa được bạn chỉnh sửa`}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            size="sm"
            variant="outline"
            loading={isExecuting}
            onClick={() => execute()}
          >
            Xóa bản nháp
          </Button>
        </ItemActions>
      </Item>
      {result && result.deleted > 0 && result.skippedModified > 0 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground">
            Đã giữ lại {result.skippedModified} bản nháp vì bạn đã chỉnh sửa
            {result.skippedModified === 1 ? " nó" : " chúng"}
          </p>
        </div>
      )}
    </>
  );
}
