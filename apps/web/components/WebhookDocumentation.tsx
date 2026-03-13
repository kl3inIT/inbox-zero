"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MutedText } from "@/components/Typography";

export function WebhookDocumentationDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dữ liệu webhook (payload)</DialogTitle>
        </DialogHeader>
        <WebhookPayloadDocumentation />
      </DialogContent>
    </Dialog>
  );
}

export function WebhookPayloadDocumentation() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const payloadExample = {
    email: {
      threadId: "thread_abc123",
      messageId: "message_xyz789",
      subject: "Important Contract Document",
      from: "client@company.com",
      cc: "team@company.com",
      bcc: "archive@company.com",
      headerMessageId: "<CAF=4sK9...@mail.gmail.com>",
    },
    executedRule: {
      id: "exec_rule_123",
      ruleId: "rule_456",
      reason: "Email matched rule: Archive contracts",
      automated: true,
      createdAt: "2024-01-15T10:30:00.000Z",
    },
  };

  const payloadJson = JSON.stringify(payloadExample, null, 2);

  return (
    <div className="space-y-4">
      <MutedText>
        Khi một quy tắc có hành động webhook được kích hoạt, chúng tôi sẽ gửi
        một request POST tới URL của bạn với payload sau:
      </MutedText>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Cấu trúc payload</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(payloadJson)}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
          <code>{payloadJson}</code>
        </pre>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h5 className="font-medium mb-2">Trường email</h5>
            <div className="space-y-1">
              <MutedText>
                <code>threadId</code> - ID luồng Gmail/Outlook
              </MutedText>
              <MutedText>
                <code>messageId</code> - ID message duy nhất
              </MutedText>
              <MutedText>
                <code>subject</code> - Tiêu đề email
              </MutedText>
              <MutedText>
                <code>from</code> - Email người gửi
              </MutedText>
              <MutedText>
                <code>cc/bcc</code> - Người nhận CC/BCC (tuỳ chọn)
              </MutedText>
              <MutedText>
                <code>headerMessageId</code> - Header Message-ID của email
              </MutedText>
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-2">Trường thực thi quy tắc</h5>
            <div className="space-y-1">
              <MutedText>
                <code>id</code> - ID thực thi
              </MutedText>
              <MutedText>
                <code>ruleId</code> - Quy tắc đã kích hoạt
              </MutedText>
              <MutedText>
                <code>reason</code> - Lý do quy tắc kích hoạt
              </MutedText>
              <MutedText>
                <code>automated</code> - Quy tắc có chạy tự động không
              </MutedText>
              <MutedText>
                <code>createdAt</code> - Thời điểm thực thi (ISO 8601)
              </MutedText>
            </div>
          </div>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md">
          <div className="text-sm text-blue-600 dark:text-blue-400">
            <strong>Xác thực:</strong> Mỗi request sẽ kèm{" "}
            <code>X-Webhook-Secret</code> header with your webhook secret for
            verification.
          </div>
        </div>
      </div>
    </div>
  );
}

export function WebhookDocumentationLink() {
  return (
    <WebhookDocumentationDialog>
      <Button
        variant="link"
        size="xs"
        className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
      >
        Xem cấu trúc payload
      </Button>
    </WebhookDocumentationDialog>
  );
}
