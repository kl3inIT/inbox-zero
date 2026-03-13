"use client";

import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/Input";
import {
  adminProcessHistorySchema,
  type AdminProcessHistoryOptions,
} from "@/app/(app)/admin/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  adminDeleteAccountAction,
  adminProcessHistoryAction,
  adminWatchEmailsAction,
  adminDisableAllRulesAction,
  adminCleanupDraftsAction,
} from "@/utils/actions/admin";
import { adminCheckPermissionsAction } from "@/utils/actions/permissions";
import { toastError, toastSuccess } from "@/components/Toast";
import { getActionErrorMessage } from "@/utils/error";

export const AdminUserControls = () => {
  const { execute: processHistory, isExecuting: isProcessing } = useAction(
    adminProcessHistoryAction,
    {
      onSuccess: () => {
        toastSuccess({
          title: "Đã xử lý lịch sử",
          description: "Lịch sử đã được xử lý",
        });
      },
      onError: () => {
        toastError({
          title: "Lỗi khi xử lý lịch sử",
          description: "Đã xảy ra lỗi khi xử lý lịch sử",
        });
      },
    },
  );
  const { execute: checkPermissions, isExecuting: isCheckingPermissions } =
    useAction(adminCheckPermissionsAction, {
      onSuccess: (result) => {
        toastSuccess({
          title: "Đã kiểm tra quyền truy cập",
          description: `Đã kiểm tra quyền truy cập. ${
            result.data?.hasAllPermissions
              ? "Đã có đầy đủ quyền"
              : "Thiếu quyền"
          }`,
        });
      },
      onError: (error) => {
        console.error(error);
        toastError({
          title: "Lỗi khi kiểm tra quyền truy cập",
          description: getActionErrorMessage(error.error),
        });
      },
    });
  const { execute: watchEmails, isExecuting: isWatching } = useAction(
    adminWatchEmailsAction,
    {
      onSuccess: (result) => {
        const results = result.data?.results || [];
        const successCount = results.filter(
          (r) => r.status === "success",
        ).length;
        const errorCount = results.filter((r) => r.status === "error").length;
        const description =
          successCount > 0
            ? `${successCount} thành công, ${errorCount} thất bại`
            : errorCount > 0
              ? `0 thành công, ${errorCount} thất bại`
              : "Không tìm thấy tài khoản email nào có thể theo dõi";
        toastSuccess({
          title: "Đã hoàn tất theo dõi",
          description,
        });
      },
      onError: (error) => {
        toastError({
          title: "Lỗi khi theo dõi email",
          description: getActionErrorMessage(error.error),
        });
      },
    },
  );
  const { execute: disableRules, isExecuting: isDisablingRules } = useAction(
    adminDisableAllRulesAction,
    {
      onSuccess: (result) => {
        toastSuccess({
          title: "Đã tắt rule",
          description: `Đã tắt rule và theo dõi cho ${result.data?.emailAccountCount} tài khoản`,
        });
      },
      onError: (error) => {
        toastError({
          title: "Lỗi khi tắt rule",
          description: getActionErrorMessage(error.error),
        });
      },
    },
  );
  const { execute: cleanupDrafts, isExecuting: isCleaningDrafts } = useAction(
    adminCleanupDraftsAction,
    {
      onSuccess: (result) => {
        toastSuccess({
          title: "Đã dọn dẹp bản nháp",
          description: `Đã xóa ${result.data?.deleted ?? 0} bản nháp, bỏ qua ${result.data?.skippedModified ?? 0} bản đã chỉnh sửa`,
        });
      },
      onError: (error) => {
        toastError({
          title: "Lỗi khi dọn dẹp bản nháp",
          description: getActionErrorMessage(error.error),
        });
      },
    },
  );
  const { execute: deleteAccount, isExecuting: isDeleting } = useAction(
    adminDeleteAccountAction,
    {
      onSuccess: () => {
        toastSuccess({
          title: "Đã xóa người dùng",
          description: "Người dùng đã được xóa",
        });
      },
      onError: () => {
        toastError({
          title: "Lỗi khi xóa người dùng",
          description: "Đã xảy ra lỗi khi xóa người dùng",
        });
      },
    },
  );

  const {
    register,
    formState: { errors },
    getValues,
  } = useForm<AdminProcessHistoryOptions>({
    resolver: zodResolver(adminProcessHistorySchema),
  });

  return (
    <form className="max-w-sm space-y-4">
      <Input
        type="email"
        name="email"
        label="Email"
        registerProps={register("email", { required: true })}
        error={errors.email}
      />
      <div className="flex gap-2">
        <Button
          variant="outline"
          loading={isProcessing}
          onClick={() => {
            processHistory({ emailAddress: getValues("email") });
          }}
        >
          Process History
        </Button>
        <Button
          variant="outline"
          loading={isCheckingPermissions}
          onClick={() => {
            checkPermissions({ email: getValues("email") });
          }}
        >
          Check Permissions
        </Button>
        <Button
          variant="outline"
          loading={isWatching}
          onClick={() => {
            watchEmails({ email: getValues("email") });
          }}
        >
          Watch
        </Button>
        <Button
          variant="outline"
          loading={isDisablingRules}
          onClick={() => {
            disableRules({ email: getValues("email") });
          }}
        >
          Disable Rules
        </Button>
        <Button
          variant="outline"
          loading={isCleaningDrafts}
          onClick={() => {
            cleanupDrafts({ email: getValues("email") });
          }}
        >
          Cleanup Drafts
        </Button>
        <Button
          variant="destructive"
          loading={isDeleting}
          onClick={() => {
            deleteAccount({ email: getValues("email") });
          }}
        >
          Xóa người dùng
        </Button>
      </div>
    </form>
  );
};
