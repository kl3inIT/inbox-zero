"use client";

import { useCallback, useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormSection, FormSectionLeft } from "@/components/Form";
import { toastError, toastSuccess } from "@/components/Toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@/components/Select";
import { Frequency } from "@/generated/prisma/enums";
import {
  type SaveEmailUpdateSettingsBody,
  saveEmailUpdateSettingsBody,
} from "@/utils/actions/settings.validation";
import { updateEmailSettingsAction } from "@/utils/actions/settings";
import { useAccount } from "@/providers/EmailAccountProvider";

export function EmailUpdatesSection({
  summaryEmailFrequency,
  mutate,
}: {
  summaryEmailFrequency: Frequency;
  mutate: () => void;
}) {
  return (
    <FormSection id="email-updates">
      <FormSectionLeft
        title="Cập nhật qua email"
        description="Nhận email tổng hợp hàng tuần về các mục cần bạn chú ý."
      />

      <SummaryUpdateSectionForm
        summaryEmailFrequency={summaryEmailFrequency}
        mutate={mutate}
      />
    </FormSection>
  );
}

function SummaryUpdateSectionForm({
  summaryEmailFrequency,
  mutate,
}: {
  summaryEmailFrequency: Frequency;
  mutate: () => void;
}) {
  const { emailAccountId } = useAccount();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SaveEmailUpdateSettingsBody>({
    resolver: zodResolver(saveEmailUpdateSettingsBody),
    defaultValues: {
      summaryEmailFrequency:
        summaryEmailFrequency === "WEEKLY" ? "WEEKLY" : "NEVER",
    },
  });

  const onSubmit: SubmitHandler<SaveEmailUpdateSettingsBody> = useCallback(
    async (data) => {
      const res = await updateEmailSettingsAction(emailAccountId, data);

      if (res?.serverError) {
        toastError({
          description: "Đã xảy ra lỗi khi cập nhật cài đặt.",
        });
      } else {
        toastSuccess({ description: "Đã cập nhật cài đặt!" });
      }

      mutate();
    },
    [emailAccountId, mutate],
  );

  const options: { label: string; value: Frequency }[] = useMemo(
    () => [
      {
        label: "Không bao giờ",
        value: Frequency.NEVER,
      },
      {
        label: "Hàng tuần",
        value: Frequency.WEEKLY,
      },
    ],
    [],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* <Select
        label="Stats Update Email"
        options={options}
        {...register("statsEmailFrequency")}
        error={errors.statsEmailFrequency}
      /> */}
      <Select
        label="Email tổng hợp"
        options={options}
        {...register("summaryEmailFrequency")}
        error={errors.summaryEmailFrequency}
      />

      <Button type="submit" loading={isSubmitting}>
        Lưu
      </Button>
    </form>
  );
}
