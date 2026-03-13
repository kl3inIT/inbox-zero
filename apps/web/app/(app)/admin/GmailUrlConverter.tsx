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
import { adminConvertGmailUrlAction } from "@/utils/actions/admin";
import {
  convertGmailUrlBody,
  type ConvertGmailUrlBody,
} from "@/utils/actions/admin.validation";
import { internalDateToDate } from "@/utils/date";

export function GmailUrlConverter() {
  const {
    execute: convertUrl,
    isExecuting,
    result,
  } = useAction(adminConvertGmailUrlAction, {
    onSuccess: () => {
      toastSuccess({ description: "Đã tìm thấy email!" });
    },
    onError: ({ error }) => {
      toastError({
        title: "Lỗi khi tra cứu email",
        description: error.serverError || "Đã xảy ra lỗi",
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConvertGmailUrlBody>({
    resolver: zodResolver(convertGmailUrlBody),
  });

  const onSubmit: SubmitHandler<ConvertGmailUrlBody> = useCallback(
    (data) => {
      convertUrl(data);
    },
    [convertUrl],
  );

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Tra cứu email</CardTitle>
        <CardDescription>
          Tìm ID luồng/email bằng RFC822 Message-ID từ header email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            name="rfc822MessageId"
            label="RFC822 Message-ID"
            placeholder="<abc123@email.example.com>"
            registerProps={register("rfc822MessageId")}
            error={errors.rfc822MessageId}
          />
          <Input
            type="email"
            name="email"
            label="Địa chỉ email"
            placeholder="user@example.com"
            registerProps={register("email")}
            error={errors.email}
          />
          <Button type="submit" loading={isExecuting}>
            Tra cứu
          </Button>
        </form>

        {result.data && (
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium">Thread ID: </span>
              <code className="text-sm">{result.data.threadId}</code>
            </div>
            <div>
              <span className="text-sm font-medium">Email: </span>
              <div className="space-y-1">
                {result.data.messages.map((msg) => (
                  <div key={msg.id} className="text-sm">
                    <code>{msg.id}</code>
                    {msg.date && (
                      <span className="ml-2 text-muted-foreground">
                        ({internalDateToDate(msg.date).toLocaleString()})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
