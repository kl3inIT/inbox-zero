"use client";

import { useCallback } from "react";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useSession } from "@/utils/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { usePostHog } from "posthog-js/react";
import { CrownIcon } from "lucide-react";
import { capitalCase } from "capital-case";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/Input";
import { LoadingContent } from "@/components/LoadingContent";
import { SettingsSection } from "@/components/SettingsSection";
import {
  saveMultiAccountPremiumBody,
  type SaveMultiAccountPremiumBody,
} from "@/app/api/user/settings/multi-account/validation";
import {
  claimPremiumAdminAction,
  updateMultiAccountPremiumAction,
} from "@/utils/actions/premium";
import type { MultiAccountEmailsResponse } from "@/app/api/user/settings/multi-account/route";
import { AlertBasic, AlertWithButton } from "@/components/Alert";
import { usePremium } from "@/components/PremiumAlert";
import type { PremiumTier } from "@/generated/prisma/enums";
import { getUserTier, isAdminForPremium } from "@/utils/premium";
import { usePremiumModal } from "@/app/(app)/refer/premium/PremiumModal";
import { useAction } from "next-safe-action/hooks";
import { toastError, toastSuccess } from "@/components/Toast";
import { getActionErrorMessage } from "@/utils/error";

export function MultiAccountSection() {
  const { data: session } = useSession();
  const { data, isLoading, error, mutate } = useSWR<MultiAccountEmailsResponse>(
    "/api/user/settings/multi-account",
  );
  const {
    isPremium,
    premium,
    isLoading: isLoadingPremium,
    error: errorPremium,
  } = usePremium();

  const premiumTier = getUserTier(premium);

  const { openModal, PremiumModal } = usePremiumModal();

  const { execute: claimPremiumAdmin } = useAction(claimPremiumAdminAction, {
    onSuccess: () => {
      toastSuccess({ description: "Đã nhận quyền quản trị." });
      mutate();
    },
    onError: (error) => {
      toastError({
        description: getActionErrorMessage(error.error, {
          prefix: "Không thể nhận quyền quản trị premium",
        }),
      });
    },
  });

  if (
    isPremium &&
    !isAdminForPremium(data?.admins || [], session?.user.id || "")
  ) {
    return null;
  }

  return (
    <SettingsSection
      id="manage-users"
      title="Quản lý quyền truy cập của nhóm"
      description="Cấp quyền premium cho các tài khoản email khác. Mỗi thành viên bổ sung sẽ được tính vào gói của bạn, và từng tài khoản vẫn giữ quyền riêng tư email riêng."
      className="space-y-4"
    >
      <LoadingContent loading={isLoadingPremium} error={errorPremium}>
        {isPremium ? (
          <LoadingContent loading={isLoading} error={error}>
            {data && (
              <div>
                {!data.admins.length && (
                  <div className="mb-4">
                    <Button onClick={() => claimPremiumAdmin()}>
                      Claim Admin
                    </Button>
                  </div>
                )}

                {premiumTier && (
                  <ExtraSeatsAlert
                    premiumTier={premiumTier}
                    emailAccountsAccess={premium?.emailAccountsAccess || 0}
                    seatsUsed={data.emailAccounts.length}
                  />
                )}

                <div className="mt-4">
                  <MultiAccountForm
                    emailAddresses={data.emailAccounts}
                    isLifetime={premium?.tier === "LIFETIME"}
                    emailAccountsAccess={premium?.emailAccountsAccess || 0}
                    pendingInvites={premium?.pendingInvites || []}
                    onUpdate={mutate}
                  />
                </div>
              </div>
            )}
          </LoadingContent>
        ) : (
          <AlertWithButton
            title="Nâng cấp"
            description="Nâng cấp premium để chia sẻ quyền truy cập với các địa chỉ email khác."
            icon={<CrownIcon className="h-4 w-4" />}
            button={<Button onClick={openModal}>Nâng cấp</Button>}
          />
        )}
      </LoadingContent>
      <PremiumModal />
    </SettingsSection>
  );
}

function MultiAccountForm({
  emailAddresses,
  isLifetime,
  emailAccountsAccess,
  pendingInvites,
  onUpdate,
}: {
  emailAddresses: { email: string; isOwnAccount: boolean }[];
  isLifetime: boolean;
  emailAccountsAccess: number;
  pendingInvites: string[];
  onUpdate?: () => void;
}) {
  const teamAccounts = emailAddresses.filter((e) => !e.isOwnAccount);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SaveMultiAccountPremiumBody>({
    resolver: zodResolver(saveMultiAccountPremiumBody),
    defaultValues: {
      emailAddresses: (() => {
        const existingEmails = new Set(teamAccounts.map((e) => e.email));
        const uniquePendingInvites = pendingInvites.filter(
          (email) => !existingEmails.has(email),
        );
        const initialEmails = [
          ...teamAccounts.map((e) => ({ email: e.email })),
          ...uniquePendingInvites.map((email) => ({ email })),
        ];
        return initialEmails.length ? initialEmails : [{ email: "" }];
      })(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "emailAddresses",
    control,
  });
  const posthog = usePostHog();

  const extraSeats = fields.length - emailAccountsAccess - 1;
  const needsToPurchaseMoreSeats = isLifetime && extraSeats > 0;

  const { execute: updateMultiAccountPremium, isExecuting } = useAction(
    updateMultiAccountPremiumAction,
    {
      onSuccess: () => {
        toastSuccess({ description: "Đã cập nhật danh sách người dùng." });
        onUpdate?.();
      },
      onError: (error) => {
        toastError({
          description: getActionErrorMessage(error.error, {
            prefix: "Không thể cập nhật người dùng",
          }),
        });
      },
    },
  );

  const onSubmit: SubmitHandler<SaveMultiAccountPremiumBody> = useCallback(
    async (data) => {
      if (!data.emailAddresses || needsToPurchaseMoreSeats) return;

      const emails = data.emailAddresses
        .map((e) => e.email.trim())
        .filter((email) => email.length > 0);
      updateMultiAccountPremium({ emails });
    },
    [needsToPurchaseMoreSeats, updateMultiAccountPremium],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        {fields.map((field, i) => (
          <Input
            key={field.id}
            type="text"
            name={`emailAddresses.${i}.email`}
            registerProps={register(`emailAddresses.${i}.email`)}
            error={errors.emailAddresses?.[i]?.email}
            onClickAdd={() => {
              append({ email: "" });
              posthog.capture("Clicked Add User");
            }}
            onClickRemove={() => {
              remove(i);
              posthog.capture("Clicked Remove User");
              if (fields.length === 1) {
                append({ email: "" });
              }
            }}
          />
        ))}
      </div>

      <Button type="submit" loading={isExecuting}>
        Lưu
      </Button>
    </form>
  );
}

function ExtraSeatsAlert({
  emailAccountsAccess,
  premiumTier,
  seatsUsed,
}: {
  emailAccountsAccess: number;
  premiumTier: PremiumTier;
  seatsUsed: number;
}) {
  if (emailAccountsAccess > seatsUsed) {
    return (
      <AlertBasic
        title="Số chỗ"
        description={`Bạn đang có quyền dùng ${emailAccountsAccess} chỗ.`}
        icon={<CrownIcon className="h-4 w-4" />}
      />
    );
  }

  return (
    <AlertBasic
      title="Chi phí thành viên bổ sung"
      description={`Bạn đang dùng gói ${capitalCase(
        premiumTier,
      )}. Bạn sẽ được tính phí cho từng thành viên bổ sung mà bạn thêm vào tài khoản.`}
      icon={<CrownIcon className="h-4 w-4" />}
    />
  );
}
