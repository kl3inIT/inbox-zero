"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeading, TypographyP } from "@/components/Typography";
import { useAccount } from "@/providers/EmailAccountProvider";
import { toastError } from "@/components/Toast";
import { getAccountLinkingUrl } from "@/utils/account-linking";
import { BRAND_NAME } from "@/utils/branding";

export default function PermissionsConsentPage() {
  const { provider, isLoading: accountLoading } = useAccount();
  const [isReconnecting, setIsReconnecting] = useState(false);
  const isMicrosoft = provider === "microsoft";

  const handleReconnect = async () => {
    setIsReconnecting(true);

    try {
      const accountProvider = provider === "microsoft" ? "microsoft" : "google";
      const url = await getAccountLinkingUrl(accountProvider);
      window.location.href = url;
    } catch {
      toastError({
        title: "Lỗi khi bắt đầu kết nối lại",
        description: "Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ",
      });
    } finally {
      setIsReconnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center sm:p-20 md:p-32">
      <PageHeading className="text-center">Thiếu quyền truy cập 😔</PageHeading>

      <TypographyP className="mx-auto mt-4 max-w-prose text-center">
        {isMicrosoft
          ? `Tài khoản Microsoft của bạn đã được kết nối, nhưng ${BRAND_NAME} đang thiếu một hoặc nhiều quyền bắt buộc của Microsoft 365.`
          : `Bạn cần đăng nhập và cấp đầy đủ tất cả quyền cần thiết để ${BRAND_NAME} hoạt động.`}
      </TypographyP>

      {isMicrosoft && (
        <TypographyP className="mx-auto mt-3 max-w-prose text-center text-muted-foreground">
          Nếu tổ chức của bạn hạn chế việc người dùng tự cấp quyền, hãy nhờ quản
          trị viên Microsoft 365 phê duyệt {BRAND_NAME} rồi kết nối lại tài
          khoản của bạn.
        </TypographyP>
      )}
      {!isMicrosoft && (
        <TypographyP className="mx-auto mt-3 max-w-prose text-center text-muted-foreground">
          Hãy kết nối lại tài khoản và chấp nhận tất cả các quyền được yêu cầu.
        </TypographyP>
      )}

      <Button
        className="mt-4"
        onClick={handleReconnect}
        loading={isReconnecting}
        disabled={isReconnecting || accountLoading}
      >
        Kết nối lại tài khoản
      </Button>

      <p className="mt-8 text-center text-muted-foreground">
        Gặp sự cố?{" "}
        <Link href="/logout" className="underline hover:text-primary">
          Đăng xuất
        </Link>{" "}
        rồi đăng nhập lại.
      </p>

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
}
