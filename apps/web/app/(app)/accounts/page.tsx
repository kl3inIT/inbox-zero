"use client";

import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { MoreVertical, Settings, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LoadingContent } from "@/components/LoadingContent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccounts } from "@/hooks/useAccounts";
import { deleteEmailAccountAction } from "@/utils/actions/user";
import { toastError, toastSuccess } from "@/components/Toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { prefixPath } from "@/utils/path";
import { AddAccount } from "@/app/(app)/accounts/AddAccount";
import { PageHeader } from "@/components/PageHeader";
import { PageWrapper } from "@/components/PageWrapper";
import { logOut } from "@/utils/user";
import { getAndClearAuthErrorCookie } from "@/utils/auth-cookies";
import { getActionErrorMessage } from "@/utils/error";
import { BRAND_NAME } from "@/utils/branding";

export default function AccountsPage() {
  const { data, isLoading, error, mutate } = useAccounts();
  useAccountNotifications();

  return (
    <PageWrapper>
      <PageHeader title="Tài khoản" />

      <LoadingContent loading={isLoading} error={error}>
        <div className="grid grid-cols-1 gap-4 py-6 lg:grid-cols-2 xl:grid-cols-3">
          {data?.emailAccounts.map((emailAccount) => (
            <AccountItem
              key={emailAccount.id}
              emailAccount={emailAccount}
              onAccountDeleted={mutate}
            />
          ))}
          <AddAccount />
        </div>
      </LoadingContent>
    </PageWrapper>
  );
}

function AccountItem({
  emailAccount,
  onAccountDeleted,
}: {
  emailAccount: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    isPrimary: boolean;
  };
  onAccountDeleted: () => void;
}) {
  return (
    <Link href={prefixPath(emailAccount.id, "/automation")} className="block">
      <Card className="cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
        <AccountHeader
          emailAccount={emailAccount}
          onAccountDeleted={onAccountDeleted}
        />
      </Card>
    </Link>
  );
}

function AccountHeader({
  emailAccount,
  onAccountDeleted,
}: {
  emailAccount: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    isPrimary: boolean;
  };
  onAccountDeleted: () => void;
}) {
  return (
    <CardHeader className="flex flex-row items-center gap-3 space-y-0">
      <Avatar>
        <AvatarImage src={emailAccount.image || undefined} />
        <AvatarFallback>
          {emailAccount.name?.[0] || emailAccount.email?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col space-y-1.5">
        <CardTitle>{emailAccount.name}</CardTitle>
        <CardDescription>{emailAccount.email}</CardDescription>
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
          }
        }}
      >
        <AccountOptionsDropdown
          emailAccount={emailAccount}
          onAccountDeleted={onAccountDeleted}
        />
      </div>
    </CardHeader>
  );
}

function AccountOptionsDropdown({
  emailAccount,
  onAccountDeleted,
}: {
  emailAccount: {
    id: string;
    email: string;
    isPrimary: boolean;
  };
  onAccountDeleted: () => void;
}) {
  const { execute, isExecuting } = useAction(deleteEmailAccountAction, {
    onSuccess: async () => {
      toastSuccess({
        title: "Đã xóa tài khoản email",
        description: "Tài khoản email đã được xóa thành công.",
      });
      onAccountDeleted();
      if (emailAccount.isPrimary) {
        await logOut("/login");
      }
    },
    onError: (error) => {
      toastError({
        title: "Không thể xóa tài khoản email",
        description: getActionErrorMessage(error.error),
      });
      onAccountDeleted();
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem asChild>
          <Link
            href={prefixPath(emailAccount.id, "/setup")}
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Settings className="size-4" />
            Thiết lập
          </Link>
        </DropdownMenuItem>
        <ConfirmDialog
          trigger={
            <DropdownMenuItem
              onSelect={(e) => {
                e?.preventDefault();
                e?.stopPropagation?.();
              }}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-destructive focus:text-destructive"
              disabled={isExecuting}
            >
              <Trash2 className="size-4" />
              Xóa
            </DropdownMenuItem>
          }
          title="Xóa tài khoản"
          description={
            emailAccount.isPrimary
              ? `Bạn có chắc chắn muốn xóa "${emailAccount.email}"? Đây là tài khoản chính của bạn. Bạn sẽ bị đăng xuất và cần đăng nhập lại. Tài khoản còn lại lâu nhất sẽ trở thành tài khoản chính mới. Tất cả dữ liệu cho "${emailAccount.email}" sẽ bị xóa vĩnh viễn khỏi ${BRAND_NAME}.`
              : `Bạn có chắc chắn muốn xóa "${emailAccount.email}"? Thao tác này sẽ xóa toàn bộ dữ liệu của tài khoản này trên ${BRAND_NAME}.`
          }
          confirmText="Xóa"
          onConfirm={() => {
            execute({ emailAccountId: emailAccount.id });
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function useAccountNotifications() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authErrorCookie = getAndClearAuthErrorCookie();
    const errorParam = searchParams.get("error") || authErrorCookie;
    const successParam = searchParams.get("success");

    if (errorParam) {
      const errorMessages: Record<
        string,
        { title: string; description: string }
      > = {
        account_not_found_for_merge: {
          title: "Không tìm thấy tài khoản",
          description: `Tài khoản này chưa tồn tại trong ${BRAND_NAME}. Vui lòng chọn "Không, đây là tài khoản mới" thay thế.`,
        },
        account_already_exists_use_merge: {
          title: "Tài khoản đã tồn tại",
          description: `Tài khoản này đã có trong ${BRAND_NAME}. Vui lòng chọn "Có, đây là tài khoản ${BRAND_NAME} hiện có" để gộp.`,
        },
        already_linked_to_self: {
          title: "Tài khoản đã được liên kết",
          description: "Tài khoản này đã được liên kết với hồ sơ của bạn.",
        },
        invalid_state: {
          title: "Yêu cầu không hợp lệ",
          description: "Yêu cầu xác thực không hợp lệ. Vui lòng thử lại.",
        },
        missing_code: {
          title: "Xác thực thất bại",
          description: "Không nhận được mã xác thực. Vui lòng thử lại.",
        },
        consent_declined: {
          title: "Chưa cấp quyền Microsoft",
          description: `Đăng nhập Microsoft đã bị hủy trước khi ${BRAND_NAME} nhận đủ quyền cần thiết. Vui lòng thử lại và hoàn tất màn hình cấp quyền.`,
        },
        admin_consent_required: {
          title: "Cần quản trị viên phê duyệt",
          description:
            "Tổ chức Microsoft 365 của bạn yêu cầu quản trị viên phê duyệt trước khi FocusMail có thể truy cập tài khoản này. Hãy nhờ quản trị viên Microsoft 365 cấp quyền rồi thử lại.",
        },
        invalid_scope_configuration: {
          title: "Cấu hình ứng dụng Microsoft cần kiểm tra",
          description:
            "Microsoft từ chối các quyền được yêu cầu cho ứng dụng này. Hãy nhờ quản trị viên kiểm tra đăng ký ứng dụng FocusMail, quyền Microsoft Graph dạng delegated và các URL chuyển hướng rồi thử lại.",
        },
        consent_incomplete: {
          title: "Cần cấp thêm quyền Microsoft",
          description: `Microsoft đã kết nối tài khoản nhưng chưa cấp đủ mọi quyền cần thiết. Hãy kết nối lại và chấp thuận toàn bộ quyền được yêu cầu. Nếu tổ chức của bạn hạn chế việc cấp quyền, hãy nhờ quản trị viên phê duyệt ${BRAND_NAME} trước.`,
        },
        link_failed: {
          title: "Liên kết tài khoản thất bại",
          description:
            searchParams.get("error_description") ||
            "Không thể liên kết tài khoản. Vui lòng thử lại.",
        },
      };

      const errorMessage = errorMessages[errorParam] || {
        title: "Đã xảy ra lỗi",
        description:
          searchParams.get("error_description") ||
          "Có lỗi xảy ra. Vui lòng thử lại.",
      };

      toastError({
        title: errorMessage.title,
        description: errorMessage.description,
      });

      router.replace(pathname);
    }

    if (successParam) {
      const successMessages: Record<
        string,
        { title: string; description: string }
      > = {
        account_merged: {
          title: "Gộp tài khoản thành công",
          description: "Các tài khoản của bạn đã được gộp.",
        },
        account_created_and_linked: {
          title: "Thêm tài khoản thành công",
          description: "Tài khoản mới đã được liên kết.",
        },
        tokens_updated: {
          title: "Kết nối lại tài khoản thành công",
          description: "Quyền truy cập của tài khoản đã được làm mới.",
        },
      };

      const successMessage = successMessages[successParam] || {
        title: "Thành công",
        description: "Thao tác đã hoàn tất.",
      };

      toastSuccess({
        title: successMessage.title,
        description: successMessage.description,
      });

      router.replace(pathname);
    }
  }, [searchParams, router, pathname]);
}
