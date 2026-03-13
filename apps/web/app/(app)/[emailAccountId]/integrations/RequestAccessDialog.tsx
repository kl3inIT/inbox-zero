"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy } from "lucide-react";
import { toastSuccess } from "@/components/Toast";
import { BRAND_NAME, SUPPORT_EMAIL } from "@/utils/branding";

interface RequestAccessDialogProps {
  integrationName?: string;
  trigger?: React.ReactNode;
}

export function RequestAccessDialog({
  integrationName,
  trigger,
}: RequestAccessDialogProps) {
  const isGenericRequest = !integrationName;
  const title = isGenericRequest
    ? "Yêu cầu tích hợp"
    : `Yêu cầu truy cập ${integrationName}`;
  const subject = isGenericRequest
    ? "Yêu cầu tích hợp"
    : `Yêu cầu truy cập: Tích hợp ${integrationName}`;

  const messageBody = isGenericRequest
    ? `Chào bạn,\n\nTôi muốn yêu cầu thêm một tích hợp mới cho ${BRAND_NAME}.\n\nTên tích hợp:\n\nTrường hợp sử dụng:\n\nXin cảm ơn!`
    : `Chào bạn,\n\nTôi quan tâm đến việc sử dụng tích hợp ${integrationName} với ${BRAND_NAME}.\n\nBạn có thể cho tôi biết khi nào tích hợp này sẽ khả dụng không?\n\nXin cảm ơn!`;

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(SUPPORT_EMAIL);
    toastSuccess({ description: "Đã sao chép email vào clipboard" });
  };

  const handleCopyMessage = async () => {
    const message = `Subject: ${subject}\n\n${messageBody}`;
    await navigator.clipboard.writeText(message);
    toastSuccess({ description: "Đã sao chép nội dung vào clipboard" });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline">
            Yêu cầu truy cập
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isGenericRequest
              ? "Gửi email cho chúng tôi để yêu cầu một tích hợp mới."
              : "Gửi email cho chúng tôi để yêu cầu quyền truy cập tích hợp này."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium">Email</div>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 rounded bg-muted px-3 py-2 text-sm">
                {SUPPORT_EMAIL}
              </code>
              <Button size="sm" variant="outline" onClick={handleCopyEmail}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Nội dung</div>
            <div className="flex flex-col gap-2 mt-1">
              <div className="rounded bg-muted px-3 py-2 text-sm">
                <div className="font-medium mb-2">Tiêu đề: {subject}</div>
                <div className="whitespace-pre-wrap text-muted-foreground">
                  {messageBody}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyMessage}
                className="self-end"
              >
                <Copy className="h-4 w-4 mr-2" />
                Sao chép nội dung
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
