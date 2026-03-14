"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BasicLayout } from "@/components/layouts/BasicLayout";
import { ErrorPage } from "@/components/ErrorPage";
import { useUser } from "@/hooks/useUser";
import { LoadingContent } from "@/components/LoadingContent";
import { Loading } from "@/components/Loading";
import { WELCOME_PATH } from "@/utils/config";
import { CrispChatLoggedOutVisible } from "@/components/CrispChat";
import { getAndClearAuthErrorCookie } from "@/utils/auth-cookies";
import { BRAND_NAME, SUPPORT_EMAIL } from "@/utils/branding";

const errorMessages: Record<string, { title: string; description: string }> = {
  email_not_found: {
    title: "Tài khoản chưa được cấp quyền",
    description:
      "Tài khoản của bạn chưa được cấp quyền truy cập ứng dụng này. Có thể email của bạn không thuộc tổ chức được cho phép. Vui lòng liên hệ quản trị viên hoặc thử đăng nhập bằng tài khoản khác.",
  },
  email_already_linked: {
    title: "Email đã được liên kết",
    description: `Địa chỉ email này đã được liên kết với một tài khoản ${BRAND_NAME} khác. Vui lòng đăng nhập bằng tài khoản gốc hoặc dùng địa chỉ email khác.`,
  },
  org_invite_invalid_code: {
    title: "Không thể đăng nhập từ lời mời tổ chức",
    description:
      "Không thể hoàn tất đăng nhập khi tham gia tổ chức này. Vui lòng mở lại từ liên kết mời. Nếu vẫn lỗi, hãy đăng nhập bằng tài khoản gốc của hộp thư này rồi chấp nhận lời mời lại.",
  },
  invalid_code: {
    title: "Phiên đăng nhập đã hết hạn",
    description:
      "Liên kết đăng nhập không còn hợp lệ. Điều này có thể xảy ra nếu luồng đăng nhập được mở hai lần, bị hết thời gian hoặc đã được sử dụng. Vui lòng bắt đầu lại từ trang đăng nhập.",
  },
  requiresreconsent: {
    title: "Cần cấp lại quyền truy cập",
    description: `Vui lòng đăng nhập lại và chấp thuận đầy đủ các quyền được yêu cầu. Nếu tổ chức Microsoft 365 của bạn cần quản trị viên phê duyệt, hãy nhờ quản trị viên phê duyệt ${BRAND_NAME} trước.`,
  },
};

function LoginErrorContent() {
  const { data, isLoading, error } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error")?.toLowerCase();
  const reason = searchParams.get("reason")?.toLowerCase();
  const resolvedErrorCode = resolveErrorCode({ errorCode, reason });

  useEffect(() => {
    if (data?.id) {
      const authErrorCookie = getAndClearAuthErrorCookie();

      if (authErrorCookie) {
        router.push("/accounts");
      } else {
        router.push(WELCOME_PATH);
      }
    }
  }, [data, router]);

  if (isLoading) return <Loading />;
  if (data?.id) return <Loading />;

  const errorInfo = resolvedErrorCode ? errorMessages[resolvedErrorCode] : null;
  const title = errorInfo?.title || "Đăng nhập không thành công";
  const supportText = `Nếu lỗi vẫn tiếp diễn, vui lòng dùng chat hỗ trợ hoặc gửi email đến ${SUPPORT_EMAIL}.`;
  const fallbackDescription = resolvedErrorCode
    ? `Vui lòng thử đăng nhập lại. (Mã lỗi: ${resolvedErrorCode}) ${supportText}`
    : `Vui lòng thử đăng nhập lại. ${supportText}`;
  const description = errorInfo?.description
    ? `${errorInfo.description} ${supportText}`
    : fallbackDescription;

  return (
    <LoadingContent loading={isLoading} error={error}>
      <ErrorPage
        title={title}
        description={description}
        button={
          <Button asChild>
            <Link href="/login">Đăng nhập lại</Link>
          </Button>
        }
      />
    </LoadingContent>
  );
}

export default function LogInErrorPage() {
  return (
    <BasicLayout>
      <Suspense fallback={<Loading />}>
        <LoginErrorContent />
      </Suspense>

      <Suspense>
        <CrispChatLoggedOutVisible />
      </Suspense>
    </BasicLayout>
  );
}

function resolveErrorCode({
  errorCode,
  reason,
}: {
  errorCode?: string;
  reason?: string;
}) {
  if (reason === "org_invite" && errorCode === "invalid_code") {
    return "org_invite_invalid_code";
  }

  return errorCode;
}
