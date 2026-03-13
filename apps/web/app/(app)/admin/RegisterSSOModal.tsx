"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useCallback } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage, Input, Label } from "@/components/Input";
import { toastError, toastSuccess } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TextareaAutosize from "react-textarea-autosize";
import { registerSSOProviderAction } from "@/utils/actions/sso";
import {
  type SsoRegistrationBody,
  ssoRegistrationBody,
} from "@/utils/actions/sso.validation";
import { useDialogState } from "@/hooks/useDialogState";

export function RegisterSSOModal() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SsoRegistrationBody>({
    resolver: zodResolver(ssoRegistrationBody),
  });

  const { isOpen, onToggle, onClose } = useDialogState();

  const { executeAsync: executeRegisterSSO, isExecuting } = useAction(
    registerSSOProviderAction,
  );

  const onSubmit: SubmitHandler<SsoRegistrationBody> = useCallback(
    async (data) => {
      const result = await executeRegisterSSO(data);

      if (result?.serverError) {
        toastError({
          title: "Lỗi khi đăng ký SSO",
          description: result.serverError,
        });
      } else {
        toastSuccess({
          description: "Đã bắt đầu đăng ký SSO thành công!",
        });
        reset();
        onClose();
      }
    },
    [executeRegisterSSO, reset, onClose],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>
        <Button>Đăng ký nhà cung cấp SSO</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Đăng ký SSO cho doanh nghiệp (SAML)</DialogTitle>
          <DialogDescription>
            Cấu hình Single Sign-On (SAML) cho tổ chức của bạn. Tính năng này
            cho phép đội ngũ của bạn đăng nhập bằng nhà cung cấp danh tính SAML.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <Input
              type="text"
              name="organizationName"
              label="Tên tổ chức"
              placeholder="ví dụ: Công ty của bạn"
              registerProps={register("organizationName")}
              error={errors.organizationName}
            />

            <Input
              type="text"
              name="providerId"
              label="ID nhà cung cấp"
              placeholder="ví dụ: your-company-saml"
              registerProps={register("providerId")}
              error={errors.providerId}
            />

            <Input
              type="text"
              name="domain"
              label="Domain"
              placeholder="ví dụ: your-company.com"
              registerProps={register("domain")}
              error={errors.domain}
            />

            <div className="space-y-2">
              <Label name="idpMetadata" label="IDP Metadata (XML)" />
              <TextareaAutosize
                id="idpMetadata"
                className="block w-full flex-1 whitespace-pre-wrap rounded-md border border-border bg-background shadow-sm focus:border-black focus:ring-black sm:text-sm"
                minRows={3}
                rows={3}
                {...register("idpMetadata")}
                placeholder="Dán XML metadata SAML IDP từ nhà cung cấp danh tính của bạn vào đây."
              />
              {errors.idpMetadata && (
                <ErrorMessage message={errors.idpMetadata.message ?? ""} />
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button type="submit" loading={isExecuting}>
              Đăng ký SSO
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
