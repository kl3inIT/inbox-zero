"use client";

import { useAction } from "next-safe-action/hooks";
import {
  adminSyncStripeForAllUsersAction,
  adminSyncAllStripeCustomersToDbAction,
} from "@/utils/actions/admin";
import { Button } from "@/components/ui/button";
import { toastError, toastSuccess } from "@/components/Toast";
import { getActionErrorMessage } from "@/utils/error";

export const AdminSyncStripe = () => {
  const { execute, isExecuting } = useAction(adminSyncStripeForAllUsersAction, {
    onSuccess: () => {
      toastSuccess({
        title: "Đã đồng bộ Stripe",
        description: "Stripe đã được đồng bộ",
      });
    },
    onError: (error) => {
      toastError({
        title: "Lỗi khi đồng bộ Stripe",
        description: getActionErrorMessage(error.error),
      });
    },
  });

  return (
    <Button onClick={() => execute()} loading={isExecuting} variant="outline">
      Đồng bộ Stripe
    </Button>
  );
};

export const AdminSyncStripeCustomers = () => {
  const { execute, isExecuting } = useAction(
    adminSyncAllStripeCustomersToDbAction,
    {
      onSuccess: (result) => {
        toastSuccess({
          title: "Đã đồng bộ khách hàng Stripe",
          description:
            result.data?.success ||
            "Tất cả khách hàng Stripe đã được đồng bộ vào cơ sở dữ liệu",
        });
      },
      onError: (error) => {
        toastError({
          title: "Lỗi khi đồng bộ khách hàng Stripe",
          description: getActionErrorMessage(error.error),
        });
      },
    },
  );

  return (
    <Button onClick={() => execute()} loading={isExecuting} variant="outline">
      Đồng bộ tất cả khách hàng Stripe vào DB
    </Button>
  );
};
