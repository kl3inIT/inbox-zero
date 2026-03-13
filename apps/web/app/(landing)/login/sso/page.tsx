"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { toastError, toastSuccess } from "@/components/Toast";
import { useRouter } from "next/navigation";
import type {
  GetSsoSignInParams,
  GetSsoSignInResponse,
} from "@/app/api/sso/signin/route";

const ssoLoginSchema = z.object({
  email: z.string().email("Vui lòng nhập địa chỉ email hợp lệ"),
  organizationSlug: z
    .string()
    .regex(
      /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/,
      "Vui lòng nhập organization slug hợp lệ",
    )
    .max(63, "Organization slug phải có tối đa 63 ký tự"),
});

type SsoLoginBody = z.infer<typeof ssoLoginSchema>;

export default function SSOLoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SsoLoginBody>({
    resolver: zodResolver(ssoLoginSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<SsoLoginBody> = useCallback(
    async (data) => {
      setIsSubmitting(true);
      try {
        const params: GetSsoSignInParams = {
          email: data.email,
          organizationSlug: data.organizationSlug,
        };

        const paramsString = new URLSearchParams(params).toString();
        const url = new URL(
          `/api/sso/signin?${paramsString}`,
          window.location.origin,
        );

        const response = await fetch(url.toString());
        const responseData = await response.json();

        if (!response.ok) {
          toastError({
            title: "Lỗi đăng nhập SSO",
            description:
              responseData.error || "Không thể khởi tạo đăng nhập SSO",
          });
          return;
        }

        const res: GetSsoSignInResponse = responseData;

        if (res.redirectUrl) {
          toastSuccess({ description: "Đang chuyển tới nhà cung cấp SSO..." });
          router.push(res.redirectUrl);
        }
      } catch {
        toastError({
          title: "Lỗi đăng nhập SSO",
          description: "Đã xảy ra lỗi. Vui lòng thử lại.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [router],
  );

  return (
    <div className="flex h-screen flex-col justify-center text-foreground">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col text-center">
          <h1 className="font-title text-2xl text-foreground">Đăng nhập SSO</h1>
          <p className="mt-4 text-muted-foreground">
            Đăng nhập vào tài khoản tổ chức của bạn
          </p>
        </div>

        <div className="mt-4">
          <div className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Input
                type="email"
                name="email"
                label="Email"
                registerProps={register("email")}
                error={errors.email}
              />

              <Input
                type="text"
                name="organizationSlug"
                label="Organization Slug"
                placeholder="your-org-slug"
                registerProps={register("organizationSlug")}
                error={errors.organizationSlug}
              />

              <Button type="submit" size="lg" full loading={isSubmitting}>
                Tiếp tục với SSO
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
