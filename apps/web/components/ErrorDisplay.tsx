"use client";

import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { logOut } from "@/utils/user";
import { env } from "@/env";

export function ErrorDisplay(props: {
  error: { info?: { error: string | object }; error?: string | object };
}) {
  const errorMessage =
    safeErrorToString(props.error?.info?.error) ||
    safeErrorToString(props.error?.error);

  if (errorMessage) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-destructive/10">
            <AlertCircle className="text-destructive" />
          </EmptyMedia>
          <EmptyTitle>Đã xảy ra lỗi</EmptyTitle>
          <EmptyDescription>{errorMessage}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (props.error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-destructive/10">
            <AlertCircle className="text-destructive" />
          </EmptyMedia>
          <EmptyTitle>Đã xảy ra lỗi</EmptyTitle>
          <EmptyDescription>
            Vui lòng tải lại trang hoặc liên hệ hỗ trợ tại{" "}
            <a href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
              {env.NEXT_PUBLIC_SUPPORT_EMAIL}
            </a>{" "}
            nếu lỗi tiếp tục xảy ra.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return null;
}

export const NotLoggedIn = () => {
  return (
    <div className="flex flex-col items-center justify-center sm:p-20 md:p-32">
      <div className="text-lg text-gray-700">Bạn chưa đăng nhập</div>
      <Button
        variant="outline"
        className="mt-2"
        onClick={() => logOut("/login")}
      >
        Đăng nhập
      </Button>
      <div className="mt-8">
        <Image
          src="/images/illustrations/falling.svg"
          alt=""
          width={400}
          height={400}
          unoptimized
          className="dark:brightness-90 dark:invert"
        />
      </div>
    </div>
  );
};

const safeErrorToString = (
  error: string | object | undefined,
): string | null => {
  if (!error) return null;
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    if ("issues" in error && Array.isArray(error.issues)) {
      return error.issues
        .map((issue) => issue.message || "Dữ liệu không hợp lệ")
        .join(", ");
    }
    try {
      return JSON.stringify(error);
    } catch {
      return "Định dạng dữ liệu không hợp lệ";
    }
  }
  return String(error);
};
