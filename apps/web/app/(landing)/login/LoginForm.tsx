"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Button as UIButton } from "@/components/ui/button";
import { SectionDescription } from "@/components/Typography";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { signIn } from "@/utils/auth-client";
import { WELCOME_PATH } from "@/utils/config";
import { toastError } from "@/components/Toast";
import { isInternalPath } from "@/utils/path";
import { getPossessiveBrandName } from "@/utils/branding";

export function LoginForm({ showLocalBypass }: { showLocalBypass: boolean }) {
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");
  const { callbackURL, errorCallbackURL } = getAuthCallbackUrls(next);

  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingMicrosoft, setLoadingMicrosoft] = useState(false);
  const [loadingLocalBypass, setLoadingLocalBypass] = useState(false);

  const handleGoogleSignIn = async () => {
    await handleSocialSignIn({
      provider: "google",
      providerName: "Google",
      callbackURL,
      errorCallbackURL,
      setLoading: setLoadingGoogle,
    });
  };

  const handleMicrosoftSignIn = async () => {
    await handleSocialSignIn({
      provider: "microsoft",
      providerName: "Microsoft",
      callbackURL,
      errorCallbackURL,
      setLoading: setLoadingMicrosoft,
    });
  };

  const handleLocalBypassSignIn = async () => {
    setLoadingLocalBypass(true);
    try {
      const response = await fetch("/api/auth/sign-in/local-bypass", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ callbackURL }),
      });

      if (!response.ok) {
        throw new Error("Local bypass login failed");
      }

      const result: { callbackURL?: string } = await response.json();

      window.location.assign(
        result.callbackURL && isInternalPath(result.callbackURL)
          ? result.callbackURL
          : callbackURL,
      );
    } catch (error) {
      console.error("Error signing in with local bypass:", error);
      toastError({
        title: "Lỗi khi bỏ qua đăng nhập",
        description:
          "Hãy đảm bảo LOCAL_AUTH_BYPASS_ENABLED=true trong môi trường local của bạn.",
      });
    } finally {
      setLoadingLocalBypass(false);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-2 px-4 sm:px-16">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="2xl">
            <span className="flex items-center justify-center">
              <Image
                src="/images/google.svg"
                alt=""
                width={24}
                height={24}
                unoptimized
              />
              <span className="ml-2">Đăng nhập với Google</span>
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đăng nhập</DialogTitle>
          </DialogHeader>
          <SectionDescription>
            Việc {getPossessiveBrandName()} sử dụng và chuyển giao thông tin
            nhận được từ Google APIs sang bất kỳ ứng dụng nào khác sẽ tuân thủ{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              className="underline underline-offset-4 hover:text-gray-900"
            >
              Chính sách Dữ liệu Người dùng của Google API Services
            </a>{" "}
            , bao gồm cả các yêu cầu về Limited Use.
          </SectionDescription>
          <div>
            <Button loading={loadingGoogle} onClick={handleGoogleSignIn}>
              Tôi đồng ý
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        size="2xl"
        loading={loadingMicrosoft}
        onClick={handleMicrosoftSignIn}
      >
        <span className="flex items-center justify-center">
          <Image
            src="/images/microsoft.svg"
            alt=""
            width={24}
            height={24}
            unoptimized
          />
          <span className="ml-2">Đăng nhập với Microsoft</span>
        </span>
      </Button>

      <UIButton
        variant="ghost"
        size="lg"
        className="w-full hover:scale-105 transition-transform"
        asChild
      >
        <Link href="/login/sso">Đăng nhập với SSO</Link>
      </UIButton>

      {showLocalBypass && (
        <Button
          size="2xl"
          color="white"
          loading={loadingLocalBypass}
          onClick={handleLocalBypassSignIn}
        >
          Bỏ qua đăng nhập (chỉ local)
        </Button>
      )}
    </div>
  );
}

function getAuthCallbackUrls(next: string | null) {
  const callbackURL = next && isInternalPath(next) ? next : WELCOME_PATH;
  const errorCallbackURL = isOrganizationInvitationPath(callbackURL)
    ? "/login/error?reason=org_invite"
    : "/login/error";

  return { callbackURL, errorCallbackURL };
}

function isOrganizationInvitationPath(path: string) {
  const pathname = path.split("?")[0];
  return /^\/organizations\/invitations\/[^/]+\/accept\/?$/.test(pathname);
}

async function handleSocialSignIn({
  provider,
  providerName,
  callbackURL,
  errorCallbackURL,
  setLoading,
}: {
  provider: "google" | "microsoft";
  providerName: "Google" | "Microsoft";
  callbackURL: string;
  errorCallbackURL: string;
  setLoading: (loading: boolean) => void;
}) {
  setLoading(true);
  try {
    await signIn.social({
      provider,
      errorCallbackURL,
      callbackURL,
    });
  } catch (error) {
    console.error(`Error signing in with ${providerName}:`, error);
    toastError({
      title: `Lỗi đăng nhập với ${providerName}`,
      description: "Vui lòng thử lại hoặc liên hệ hỗ trợ",
    });
  } finally {
    setLoading(false);
  }
}
