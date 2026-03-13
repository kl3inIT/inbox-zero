"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/providers/EmailAccountProvider";
import { toastError } from "@/components/Toast";
import { captureException } from "@/utils/error";
import type { GetDriveAuthUrlResponse } from "@/app/api/google/drive/auth-url/route";
import { fetchWithAccount } from "@/utils/fetch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ConnectDrive() {
  const { emailAccountId } = useAccount();
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [isConnectingMicrosoft, setIsConnectingMicrosoft] = useState(false);
  const [googleDialogOpen, setGoogleDialogOpen] = useState(false);

  const handleConnectGoogle = async (access: "limited" | "full") => {
    setIsConnectingGoogle(true);
    try {
      const accessParam = access === "full" ? "?access=full" : "";
      const response = await fetchWithAccount({
        url: `/api/google/drive/auth-url${accessParam}`,
        emailAccountId,
        init: { headers: { "Content-Type": "application/json" } },
      });

      if (!response.ok) {
        throw new Error("Không thể bắt đầu kết nối Google Drive");
      }

      const data: GetDriveAuthUrlResponse = await response.json();

      if (!data?.url) throw new Error("Invalid auth URL");

      window.location.href = data.url;
    } catch (error) {
      captureException(error, {
        extra: { context: "Google Drive OAuth initiation" },
      });
      toastError({
        title: "Lỗi khi bắt đầu kết nối Google Drive",
        description: "Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ.",
      });
      setIsConnectingGoogle(false);
    }
  };

  const handleConnectMicrosoft = async () => {
    setIsConnectingMicrosoft(true);
    try {
      const response = await fetchWithAccount({
        url: "/api/outlook/drive/auth-url",
        emailAccountId,
        init: { headers: { "Content-Type": "application/json" } },
      });

      if (!response.ok) {
        throw new Error("Không thể bắt đầu kết nối OneDrive");
      }

      const data: GetDriveAuthUrlResponse = await response.json();

      if (!data?.url) throw new Error("Invalid auth URL");

      window.location.href = data.url;
    } catch (error) {
      captureException(error, {
        extra: { context: "OneDrive OAuth initiation" },
      });
      toastError({
        title: "Lỗi khi bắt đầu kết nối OneDrive",
        description: "Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ.",
      });
      setIsConnectingMicrosoft(false);
    }
  };

  return (
    <>
      <div className="flex gap-2 flex-wrap md:flex-nowrap">
        <Button
          onClick={() => setGoogleDialogOpen(true)}
          disabled={isConnectingGoogle || isConnectingMicrosoft}
          loading={isConnectingGoogle}
          variant="outline"
          className="flex items-center gap-2 w-full md:w-auto"
        >
          <Image
            src="/images/google.svg"
            alt="Google Drive"
            width={16}
            height={16}
            unoptimized
          />
          {isConnectingGoogle ? "Đang kết nối..." : "Thêm Google Drive"}
        </Button>

        <Button
          onClick={handleConnectMicrosoft}
          disabled={isConnectingGoogle || isConnectingMicrosoft}
          loading={isConnectingMicrosoft}
          variant="outline"
          className="flex items-center gap-2 w-full md:w-auto"
        >
          <Image
            src="/images/microsoft.svg"
            alt="OneDrive"
            width={16}
            height={16}
            unoptimized
          />
          {isConnectingMicrosoft ? "Đang kết nối..." : "Thêm OneDrive"}
        </Button>
      </div>

      <Dialog open={googleDialogOpen} onOpenChange={setGoogleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kết nối Google Drive</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Tiêu chuẩn</p>
                <p className="text-xs text-muted-foreground">
                  Bạn sẽ cần tạo các thư mục mới để lưu trữ
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setGoogleDialogOpen(false);
                  handleConnectGoogle("limited");
                }}
                disabled={isConnectingGoogle}
                loading={isConnectingGoogle}
              >
                Connect
              </Button>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Toàn quyền truy cập</p>
                <p className="text-xs text-muted-foreground">
                  Sử dụng các thư mục hiện có của bạn
                </p>
                <p className="mt-1 text-xs text-amber-600">
                  Google có thể hiển thị cảnh báo — chúng tôi đang làm việc để
                  xác minh
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setGoogleDialogOpen(false);
                  handleConnectGoogle("full");
                }}
                disabled={isConnectingGoogle}
                loading={isConnectingGoogle}
              >
                Connect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
