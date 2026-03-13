"use client";

import { useCallback } from "react";
import { useAction } from "next-safe-action/hooks";
import { ShieldCheckIcon } from "lucide-react";
import { ActionCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toastSuccess, toastError } from "@/components/Toast";
import { getActionErrorMessage } from "@/utils/error";
import { updateAnalyticsConsentAction } from "@/utils/actions/organization";
import { useOrganizationMembership } from "@/hooks/useOrganizationMembership";
import { useAccount } from "@/providers/EmailAccountProvider";
import { hasOrganizationAdminRole } from "@/utils/organizations/roles";

export function OrgAnalyticsConsentBanner() {
  const { emailAccountId } = useAccount();
  const { data, isLoading, mutate } = useOrganizationMembership();

  const { execute, isPending } = useAction(
    updateAnalyticsConsentAction.bind(null, emailAccountId),
    {
      onSuccess: () => {
        toastSuccess({
          description:
            "Đã cho phép quản trị viên xem số liệu phân tích của bạn!",
        });
        mutate();
      },
      onError: (error) => {
        toastError({
          description: getActionErrorMessage(error.error, {
            prefix: "Cập nhật cài đặt thất bại",
          }),
        });
      },
    },
  );

  const handleAllow = useCallback(() => {
    execute({ allowOrgAdminAnalytics: true });
  }, [execute]);

  if (isLoading || !data?.organizationId || data.allowOrgAdminAnalytics) {
    return null;
  }

  const isAdmin = hasOrganizationAdminRole(data.role ?? "");

  const title = isAdmin
    ? "Bao gồm số liệu của bạn trong thống kê tổ chức"
    : "Cho phép quản trị viên tổ chức xem số liệu của bạn";

  const description = `Your email analytics are currently private. Enable access to let${isAdmin ? " other " : " "}organization admins view your inbox statistics and usage data. This helps your team understand productivity and collaborate more effectively.`;

  return (
    <ActionCard
      variant="blue"
      className="mt-6 max-w-full"
      icon={<ShieldCheckIcon className="h-4 w-4" />}
      title={title}
      description={
        isAdmin
          ? "Hiện tại số liệu email của bạn đang là riêng tư. Bật quyền truy cập để các quản trị viên khác trong tổ chức có thể xem thống kê hộp thư và dữ liệu sử dụng, giúp đội ngũ hiểu rõ hiệu suất và phối hợp hiệu quả hơn."
          : "Hiện tại số liệu email của bạn đang là riêng tư. Bật quyền truy cập để quản trị viên tổ chức có thể xem thống kê hộp thư và dữ liệu sử dụng của bạn, giúp đội ngũ hiểu rõ hiệu suất và phối hợp hiệu quả hơn."
      }
      action={
        <Button onClick={handleAllow} loading={isPending}>
          Cho phép truy cập
        </Button>
      }
    />
  );
}
