"use client";

import { useCallback } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toastSuccess, toastError } from "@/components/Toast";
import { adminGetLabelsAction } from "@/utils/actions/admin";
import {
  getLabelsBody,
  type GetLabelsBody,
} from "@/utils/actions/admin.validation";

export function DebugLabels() {
  const { execute, isExecuting, result } = useAction(adminGetLabelsAction, {
    onSuccess: () => {
      toastSuccess({ description: "Đã tìm thấy label!" });
    },
    onError: ({ error }) => {
      toastError({
        title: "Lỗi khi lấy label",
        description: error.serverError || "Đã xảy ra lỗi",
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GetLabelsBody>({
    resolver: zodResolver(getLabelsBody),
  });

  const onSubmit: SubmitHandler<GetLabelsBody> = useCallback(
    (data) => {
      execute(data);
    },
    [execute],
  );

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Debug labels</CardTitle>
        <CardDescription>
          Lấy tất cả label cho một tài khoản email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            name="emailAccountId"
            label="ID tài khoản email"
            placeholder="ID tài khoản email"
            registerProps={register("emailAccountId")}
            error={errors.emailAccountId}
          />
          <Button type="submit" loading={isExecuting}>
            Lấy label
          </Button>
        </form>

        {result.data && (
          <pre className="text-sm">{JSON.stringify(result.data, null, 2)}</pre>
        )}
      </CardContent>
    </Card>
  );
}
