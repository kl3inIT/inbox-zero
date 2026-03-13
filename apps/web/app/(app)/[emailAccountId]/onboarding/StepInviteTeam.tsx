"use client";

import { useState, useCallback } from "react";
import { ArrowRightIcon, UsersIcon } from "lucide-react";
import { PageHeading, TypographyP } from "@/components/Typography";
import { IconCircle } from "@/app/(app)/[emailAccountId]/onboarding/IconCircle";
import { OnboardingWrapper } from "@/app/(app)/[emailAccountId]/onboarding/OnboardingWrapper";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/TagInput";
import { toastSuccess, toastError } from "@/components/Toast";
import {
  inviteMemberAction,
  createOrganizationAndInviteAction,
} from "@/utils/actions/organization";
import { isValidEmail } from "@/utils/email";
import { BRAND_NAME } from "@/utils/branding";

export function StepInviteTeam({
  emailAccountId,
  organizationId,
  userName,
  onNext,
}: {
  emailAccountId: string;
  organizationId?: string;
  userName?: string | null;
  onNext: () => void;
}) {
  const [emails, setEmails] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailsChange = useCallback((newEmails: string[]) => {
    setEmails(newEmails.map((e) => e.toLowerCase()));
  }, []);

  const handleInviteAndContinue = useCallback(async () => {
    if (emails.length === 0) {
      return;
    }

    setIsSubmitting(true);

    if (!organizationId) {
      const result = await createOrganizationAndInviteAction(emailAccountId, {
        emails,
        userName,
      });

      setIsSubmitting(false);

      if (result?.serverError || result?.validationErrors) {
        toastError({
          description:
            "Không thể tạo tổ chức và gửi lời mời. Vui lòng thử lại.",
        });
        return;
      }

      if (result?.data) {
        const successCount = result.data.results.filter(
          (r) => r.success,
        ).length;
        const errorCount = result.data.results.filter((r) => !r.success).length;

        if (successCount > 0) {
          toastSuccess({
            description: `${successCount} lời mời đã được gửi thành công!`,
          });
        }
        if (errorCount > 0) {
          toastError({
            description: `Không thể gửi ${errorCount} lời mời.`,
          });
        }
        onNext();
      }

      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const email of emails) {
      const result = await inviteMemberAction({
        email,
        role: "member",
        organizationId,
      });

      if (result?.serverError || result?.validationErrors) {
        errorCount++;
      } else {
        successCount++;
      }
    }

    setIsSubmitting(false);

    if (successCount > 0) {
      toastSuccess({
        description: `${successCount} lời mời đã được gửi thành công!`,
      });
    }

    if (errorCount > 0) {
      toastError({
        description: `Không thể gửi ${errorCount} lời mời.`,
      });
    }

    if (successCount > 0) {
      onNext();
    }
  }, [emails, emailAccountId, organizationId, userName, onNext]);

  return (
    <OnboardingWrapper className="py-0">
      <IconCircle size="lg" className="mx-auto">
        <UsersIcon className="size-6" />
      </IconCircle>

      <div className="text-center mt-4">
        <PageHeading>Mời đồng nghiệp trong đội của bạn</PageHeading>
        <TypographyP className="mt-2 max-w-lg mx-auto">
          {`Hợp tác cùng đội ngũ của bạn trên ${BRAND_NAME}. Bạn luôn có thể thêm thành viên sau này.`}
        </TypographyP>

        <TagInput
          value={emails}
          onChange={handleEmailsChange}
          validate={(email) =>
            isValidEmail(email) ? null : "Vui lòng nhập địa chỉ email hợp lệ"
          }
          label="Địa chỉ email"
          id="email-input"
          placeholder="Nhập các địa chỉ email, ngăn cách bằng dấu phẩy"
          className="mt-6 max-w-md mx-auto text-left"
        />

        <div className="flex flex-col gap-2 w-full max-w-xs mx-auto mt-6">
          <Button
            type="button"
            className="w-full"
            onClick={handleInviteAndContinue}
            loading={isSubmitting}
            disabled={emails.length === 0}
          >
            Gửi lời mời & Tiếp tục
            <ArrowRightIcon className="size-4 ml-2" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onNext}
            disabled={isSubmitting}
          >
            Bỏ qua
          </Button>
        </div>
      </div>
    </OnboardingWrapper>
  );
}
