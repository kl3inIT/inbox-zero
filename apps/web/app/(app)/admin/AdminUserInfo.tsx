"use client";

import { useCallback } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/Input";
import { toastError } from "@/components/Toast";
import { getActionErrorMessage } from "@/utils/error";
import { adminGetUserInfoAction } from "@/utils/actions/admin";
import {
  getUserInfoBody,
  type GetUserInfoBody,
} from "@/utils/actions/admin.validation";

export function AdminUserInfo() {
  const { execute, isExecuting, result } = useAction(adminGetUserInfoAction, {
    onError: (error) => {
      toastError({
        title: "Lỗi khi tra cứu người dùng",
        description: getActionErrorMessage(error.error),
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GetUserInfoBody>({
    resolver: zodResolver(getUserInfoBody),
  });

  const onSubmit: SubmitHandler<GetUserInfoBody> = useCallback(
    (data) => {
      execute({ email: data.email });
    },
    [execute],
  );

  const data = result.data;

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Thông tin người dùng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="user@example.com"
            registerProps={register("email")}
            error={errors.email}
          />
          <Button type="submit" loading={isExecuting}>
            Tra cứu
          </Button>
        </form>

        {data && (
          <div className="space-y-3 text-sm">
            <InfoRow label="ID người dùng" value={data.id} />
            <InfoRow label="Ngày tạo" value={formatDate(data.createdAt)} />
            <InfoRow
              label="Lần đăng nhập gần nhất"
              value={data.lastLogin ? formatDate(data.lastLogin) : "Chưa từng"}
            />
            <InfoRow
              label="Số tài khoản email"
              value={String(data.emailAccountCount)}
            />
            <InfoRow
              label="Gói trả phí"
              value={data.premium?.tier || "Không có"}
            />
            <InfoRow
              label="Trạng thái gói"
              value={data.premium?.subscriptionStatus || "Không có"}
            />
            <InfoRow
              label="Gia hạn vào"
              value={
                data.premium?.renewsAt
                  ? formatDate(data.premium.renewsAt)
                  : "Không có"
              }
            />

            {data.emailAccounts.map((ea) => (
              <div key={ea.email} className="space-y-1 rounded-md border p-3">
                <p className="font-medium">{ea.email}</p>
                <InfoRow label="Nhà cung cấp" value={ea.provider} />
                <InfoRow
                  label="Đã ngắt kết nối"
                  value={ea.disconnected ? "Có" : "Không"}
                />
                <InfoRow label="Số rule" value={String(ea.ruleCount)} />
                <InfoRow
                  label="Lần chạy rule gần nhất"
                  value={
                    ea.lastExecutedRuleAt
                      ? formatDate(ea.lastExecutedRuleAt)
                      : "Chưa từng"
                  }
                />
                <InfoRow
                  label="Hết hạn theo dõi"
                  value={
                    ea.watchExpirationDate
                      ? formatDate(ea.watchExpirationDate)
                      : "Không theo dõi"
                  }
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
