"use client";

import { useState, useCallback } from "react";
import { toastError, toastSuccess } from "@/components/Toast";
import { ArchiveIcon, RotateCcwIcon, TagsIcon } from "lucide-react";
import { SetupDialog } from "@/components/SetupCard";
import { Button } from "@/components/ui/button";
import { bulkCategorizeSendersAction } from "@/utils/actions/categorize";
import { useAccount } from "@/providers/EmailAccountProvider";
import { useCategorizeProgress } from "@/app/(app)/[emailAccountId]/smart-categories/CategorizeProgress";

const features = [
  {
    icon: <TagsIcon className="size-4 text-blue-500" />,
    title: "Tự động sắp xếp",
    description:
      "Chúng tôi nhóm người gửi vào các danh mục như Bản tin, Hóa đơn và Tiếp thị",
  },
  {
    icon: <ArchiveIcon className="size-4 text-blue-500" />,
    title: "Lưu trữ theo danh mục",
    description: "Dọn sạch cả một danh mục cùng lúc thay vì từng email một",
  },
  {
    icon: <RotateCcwIcon className="size-4 text-blue-500" />,
    title: "Luôn có thể hoàn tác",
    description:
      "Email chỉ được lưu trữ, không bị xóa — bạn có thể tìm lại bất cứ lúc nào",
  },
];

export function AutoCategorizationSetup({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { emailAccountId } = useAccount();
  const { setIsBulkCategorizing } = useCategorizeProgress();

  const [isEnabling, setIsEnabling] = useState(false);

  const enableFeature = useCallback(async () => {
    setIsEnabling(true);
    setIsBulkCategorizing(true);

    try {
      const result = await bulkCategorizeSendersAction(emailAccountId);

      if (result?.serverError) {
        throw new Error(result.serverError);
      }

      if (result?.data?.totalUncategorizedSenders) {
        toastSuccess({
          description: `Đang phân loại ${result.data.totalUncategorizedSenders} người gửi... Việc này có thể mất vài phút.`,
        });
      } else {
        toastSuccess({
          description: "Không tìm thấy người gửi chưa được phân loại nào.",
        });
        setIsBulkCategorizing(false);
      }
    } catch (error) {
      toastError({
        description: `Bật tính năng không thành công: ${error instanceof Error ? error.message : "Lỗi không xác định"}`,
      });
      setIsBulkCategorizing(false);
    } finally {
      setIsEnabling(false);
    }
  }, [emailAccountId, setIsBulkCategorizing]);

  return (
    <SetupDialog
      open={open}
      onOpenChange={onOpenChange}
      imageSrc="/images/illustrations/working-vacation.svg"
      imageAlt="Lưu trữ hàng loạt"
      title="Lưu trữ hàng loạt"
      description="Lưu trữ hàng nghìn email chỉ với vài lần nhấp."
      features={features}
    >
      <Button onClick={enableFeature} loading={isEnabling}>
        Bắt đầu
      </Button>
    </SetupDialog>
  );
}
