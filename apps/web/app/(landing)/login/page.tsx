import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/app/(landing)/login/LoginForm";
import { auth } from "@/utils/auth";
import { isLocalAuthBypassEnabled } from "@/utils/auth/local-bypass-config";
import { AlertBasic } from "@/components/Alert";
import { Button } from "@/components/ui/button";
import { WELCOME_PATH } from "@/utils/config";
import { CrispChatLoggedOutVisible } from "@/components/CrispChat";
import { MutedText } from "@/components/Typography";
import { isInternalPath } from "@/utils/path";
import {
  BRAND_NAME,
  SUPPORT_EMAIL,
  getBrandTitle,
  getPossessiveBrandName,
} from "@/utils/branding";

export const metadata: Metadata = {
  title: getBrandTitle("Đăng nhập"),
  description: `Đăng nhập vào ${BRAND_NAME}.`,
  alternates: { canonical: "/login" },
};

export default async function AuthenticationPage(props: {
  searchParams?: Promise<Record<string, string>>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  if (session?.user && !searchParams?.error) {
    if (searchParams?.next && isInternalPath(searchParams.next)) {
      redirect(searchParams.next);
    } else {
      redirect(WELCOME_PATH);
    }
  }

  return (
    <div className="flex h-screen flex-col justify-center text-foreground">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col text-center">
          <h1 className="font-title text-2xl text-foreground">Đăng nhập</h1>
          <p className="mt-4 text-muted-foreground">
            Trợ lý AI cá nhân cho email của bạn.
          </p>
        </div>
        <div className="mt-4">
          <Suspense>
            <LoginForm showLocalBypass={isLocalAuthBypassEnabled()} />
          </Suspense>
        </div>

        {searchParams?.error && <ErrorAlert error={searchParams?.error} />}

        <MutedText className="px-8 pt-10 text-center">
          Bằng việc bấm tiếp tục, bạn đồng ý với{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Điều khoản dịch vụ
          </Link>{" "}
          và{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Chính sách quyền riêng tư
          </Link>
          .
        </MutedText>

        <MutedText className="px-4 pt-4 text-center">
          Việc {getPossessiveBrandName()} sử dụng và chuyển giao thông tin nhận
          được từ Google APIs sang bất kỳ ứng dụng nào khác sẽ tuân thủ{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Chính sách Dữ liệu Người dùng của Google API Services
          </a>{" "}
          , bao gồm cả các yêu cầu về Limited Use.
        </MutedText>
      </div>
    </div>
  );
}

function ErrorAlert({ error }: { error: string }) {
  if (error === "RequiresReconsent") {
    return (
      <AlertBasic
        variant="destructive"
        title="Cần cấp lại quyền truy cập"
        description={`Vui lòng đăng nhập lại và chấp thuận tất cả quyền được yêu cầu. Nếu tổ chức Microsoft 365 của bạn cần admin phê duyệt, hãy nhờ admin phê duyệt ${BRAND_NAME} trước. Nếu lỗi vẫn tiếp diễn, vui lòng liên hệ hỗ trợ tại ${SUPPORT_EMAIL}`}
      />
    );
  }

  if (error === "OAuthAccountNotLinked") {
    return (
      <AlertBasic
        variant="destructive"
        title="Tài khoản đã gắn với người dùng khác"
        description={
          <>
            <span>Bạn có thể gộp tài khoản thay thế.</span>
            <Button asChild className="mt-2">
              <Link href="/accounts">Gộp tài khoản</Link>
            </Button>
          </>
        }
      />
    );
  }

  if (error === "email_already_linked") {
    return (
      <AlertBasic
        variant="destructive"
        title="Email đã được liên kết"
        description={`Địa chỉ email này đã được liên kết với một tài khoản ${BRAND_NAME} khác. Vui lòng đăng nhập bằng tài khoản ban đầu, hoặc dùng email khác. Nếu lỗi vẫn tiếp diễn, vui lòng liên hệ hỗ trợ tại ${SUPPORT_EMAIL}`}
      />
    );
  }

  return (
    <>
      <AlertBasic
        variant="destructive"
        title="Lỗi đăng nhập"
        description={`Đã xảy ra lỗi khi đăng nhập. Vui lòng thử đăng nhập lại. Nếu lỗi vẫn tiếp diễn, vui lòng liên hệ hỗ trợ tại ${SUPPORT_EMAIL}`}
      />
      <Suspense>
        <CrispChatLoggedOutVisible />
      </Suspense>
    </>
  );
}
