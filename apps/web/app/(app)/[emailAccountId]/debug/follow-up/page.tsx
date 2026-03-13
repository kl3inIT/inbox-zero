"use client";

import { useCallback, useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
import useSWR from "swr";
import { LoadingContent } from "@/components/LoadingContent";
import { PageWrapper } from "@/components/PageWrapper";
import { PageHeading } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import type { DebugFollowUpResponse } from "@/app/api/user/debug/follow-up/route";
import { useAccount } from "@/providers/EmailAccountProvider";

export default function DebugFollowUpPage() {
  const { emailAccountId } = useAccount();
  const { data, isLoading, error } = useSWR<DebugFollowUpResponse>(
    emailAccountId ? ["/api/user/debug/follow-up", emailAccountId] : null,
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data]);

  return (
    <PageWrapper>
      <PageHeading>Gỡ lỗi theo dõi</PageHeading>

      <LoadingContent loading={isLoading} error={error}>
        <div className="mt-6 space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DebugStat
              label="Đang chờ trả lời (ngày)"
              value={data?.emailAccount.followUpAwaitingReplyDays ?? "Off"}
            />
            <DebugStat
              label="Cần trả lời (ngày)"
              value={data?.emailAccount.followUpNeedsReplyDays ?? "Off"}
            />
            <DebugStat
              label="Tự động tạo nháp"
              value={
                data?.emailAccount.followUpAutoDraftEnabled ? "Bật" : "Tắt"
              }
            />
            <DebugStat
              label="Trình theo dõi chưa xử lý"
              value={data?.summary.unresolvedTrackers ?? 0}
            />
            <DebugStat
              label="Chưa xử lý + Đã áp dụng"
              value={data?.summary.unresolvedWithFollowUpApplied ?? 0}
            />
            <DebugStat
              label="Chưa xử lý + Đã tạo nháp"
              value={data?.summary.unresolvedWithFollowUpDraft ?? 0}
            />
          </div>

          <div className="rounded-lg border p-4 text-sm">
            <p>
              <span className="font-medium">
                Lần áp dụng theo dõi gần nhất:
              </span>{" "}
              {formatDate(data?.summary.lastFollowUpAppliedAt)}
            </p>
            <p className="mt-2">
              <span className="font-medium">
                Hoạt động trình theo dõi gần nhất:
              </span>{" "}
              {formatDate(data?.summary.lastTrackerActivityAt)}
            </p>
            <p className="mt-2 text-muted-foreground">
              Hoạt động trình theo dõi gần nhất là chỉ báo cho hoạt động xử lý
              theo dõi.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!data}
            >
              {copied ? (
                <CheckIcon className="mr-2 h-4 w-4" />
              ) : (
                <CopyIcon className="mr-2 h-4 w-4" />
              )}
              {copied ? "Đã sao chép" : "Sao chép JSON"}
            </Button>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <pre className="overflow-auto text-sm">
              {data ? JSON.stringify(data, null, 2) : "Đang tải..."}
            </pre>
          </div>
        </div>
      </LoadingContent>
    </PageWrapper>
  );
}

function DebugStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-medium">{value}</p>
    </div>
  );
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "Không bao giờ";
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString();
}
