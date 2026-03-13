"use client";

import { useCallback, use } from "react";
import { useAction } from "next-safe-action/hooks";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { activateLicenseKeyAction } from "@/utils/actions/premium";
import { AlertBasic } from "@/components/Alert";
import { usePremium } from "@/components/PremiumAlert";
import { toastError, toastSuccess } from "@/components/Toast";
import type { ActivateLicenseKeyOptions } from "@/utils/actions/premium.validation";
import { PageWrapper } from "@/components/PageWrapper";
import { PageHeader } from "@/components/PageHeader";

export default function LicensePage(props: {
  searchParams: Promise<{ "license-key"?: string }>;
}) {
  const searchParams = use(props.searchParams);
  const licenseKey = searchParams["license-key"];

  const { premium } = usePremium();

  return (
    <PageWrapper>
      <PageHeader title="Kích hoạt giấy phép của bạn" />

      <div className="max-w-2xl py-4">
        {premium?.lemonLicenseKey && (
          <AlertBasic
            variant="success"
            title="Giấy phép của bạn đã được kích hoạt"
            description="Bạn đang có một khóa giấy phép đang hoạt động. Để thêm người dùng vào tài khoản của mình, hãy truy cập trang cài đặt."
            className="mb-4"
          />
        )}

        <ActivateLicenseForm licenseKey={licenseKey} />
      </div>
    </PageWrapper>
  );
}

function ActivateLicenseForm(props: { licenseKey?: string }) {
  const { execute: activateLicenseKey, isExecuting } = useAction(
    activateLicenseKeyAction,
    {
      onSuccess: () => {
        toastSuccess({ description: "Đã kích hoạt giấy phép!" });
      },
      onError: () => {
        toastError({ description: "Lỗi khi kích hoạt giấy phép!" });
      },
    },
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivateLicenseKeyOptions>({
    defaultValues: { licenseKey: props.licenseKey },
  });

  const onSubmit: SubmitHandler<ActivateLicenseKeyOptions> = useCallback(
    (data) => {
      activateLicenseKey({ licenseKey: data.licenseKey });
    },
    [activateLicenseKey],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="text"
        name="licenseKey"
        label="Khóa giấy phép"
        registerProps={register("licenseKey", { required: true })}
        error={errors.licenseKey}
      />
      <Button type="submit" loading={isExecuting}>
        Kích hoạt
      </Button>
    </form>
  );
}
