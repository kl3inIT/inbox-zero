"use client";

import { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import sortBy from "lodash/sortBy";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArchiveIcon,
  CheckIcon,
  ChevronDownIcon,
  InboxIcon,
  MailIcon,
  MailOpenIcon,
  MailXIcon,
  BellOffIcon,
  TrendingDownIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { EmailCell } from "@/components/EmailCell";
import { LoadingContent } from "@/components/LoadingContent";
import { cn } from "@/utils";
import {
  addToArchiveSenderQueue,
  useArchiveSenderStatus,
} from "@/store/archive-sender-queue";
import { useAccount } from "@/providers/EmailAccountProvider";
import { useThreads } from "@/hooks/useThreads";
import { formatShortDate } from "@/utils/date";
import { getEmailUrl } from "@/utils/url";
import {
  getArchiveCandidates,
  type ConfidenceLevel,
  type ArchiveCandidate,
} from "@/utils/bulk-archive/get-archive-candidates";
import type { CategorizedSendersResponse } from "@/app/api/user/categorize/senders/categorized/route";

const confidenceConfig = {
  high: {
    label: "An toàn để lưu trữ",
    description: "Email marketing và bản tin mà bạn có thể không cần",
    icon: MailXIcon,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    hoverBgColor: "hover:bg-green-100 dark:hover:bg-green-950/50",
    borderColor: "border-green-200 dark:border-green-900",
    badgeVariant: "default" as const,
  },
  medium: {
    label: "Có lẽ an toàn",
    description: "Thông báo tự động và các cập nhật hệ thống",
    icon: BellOffIcon,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    hoverBgColor: "hover:bg-amber-100 dark:hover:bg-amber-950/50",
    borderColor: "border-amber-200 dark:border-amber-900",
    badgeVariant: "secondary" as const,
  },
  low: {
    label: "Nên xem lại",
    description: "Người gửi có thể cần bạn kiểm tra kỹ hơn",
    icon: MailOpenIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    hoverBgColor: "hover:bg-blue-100 dark:hover:bg-blue-950/50",
    borderColor: "border-blue-200 dark:border-blue-900",
    badgeVariant: "outline" as const,
  },
};

export function BulkArchiveTab() {
  const { emailAccountId, userEmail } = useAccount();

  const { data, error, isLoading } = useSWR<CategorizedSendersResponse>(
    "/api/user/categorize/senders/categorized",
  );

  const emailGroups = useMemo(() => {
    if (!data) return [];
    const sorted = sortBy(data.senders, (sender) => sender.category?.name);
    return sorted.map((sender) => ({
      address: sender.email,
      name: sender.name,
      category:
        data.categories.find((c) => c.id === sender.category?.id) || null,
    }));
  }, [data]);

  const [expandedSenders, setExpandedSenders] = useState<
    Record<string, boolean>
  >({});
  const [selectedSenders, setSelectedSenders] = useState<
    Record<string, boolean>
  >({});
  const [expandedSections, setExpandedSections] = useState<
    Record<ConfidenceLevel, boolean>
  >({
    high: false,
    medium: false,
    low: false,
  });
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveComplete, setArchiveComplete] = useState(false);
  const [hasInitializedSelection, setHasInitializedSelection] = useState(false);

  const candidates = useMemo(
    () => getArchiveCandidates(emailGroups),
    [emailGroups],
  );

  // Initialize selection when data loads
  useEffect(() => {
    if (candidates.length > 0 && !hasInitializedSelection) {
      const initial: Record<string, boolean> = {};
      for (const candidate of candidates) {
        initial[candidate.address] =
          candidate.confidence === "high" || candidate.confidence === "medium";
      }
      setSelectedSenders(initial);
      setHasInitializedSelection(true);
    }
  }, [candidates, hasInitializedSelection]);

  const groupedByConfidence = useMemo(() => {
    const grouped: Record<ConfidenceLevel, ArchiveCandidate[]> = {
      high: [],
      medium: [],
      low: [],
    };
    for (const candidate of candidates) {
      grouped[candidate.confidence].push(candidate);
    }
    return grouped;
  }, [candidates]);

  const selectedCount = useMemo(() => {
    return Object.values(selectedSenders).filter(Boolean).length;
  }, [selectedSenders]);

  const totalCount = candidates.length;

  const toggleSection = (level: ConfidenceLevel) => {
    setExpandedSections((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  const toggleSenderSelection = (address: string) => {
    setSelectedSenders((prev) => ({
      ...prev,
      [address]: !prev[address],
    }));
  };

  const toggleSenderExpanded = (address: string) => {
    setExpandedSenders((prev) => ({
      ...prev,
      [address]: !prev[address],
    }));
  };

  const selectAllInSection = (level: ConfidenceLevel) => {
    setSelectedSenders((prev) => {
      const newSelected = { ...prev };
      for (const candidate of groupedByConfidence[level]) {
        newSelected[candidate.address] = true;
      }
      return newSelected;
    });
  };

  const deselectAllInSection = (level: ConfidenceLevel) => {
    setSelectedSenders((prev) => {
      const newSelected = { ...prev };
      for (const candidate of groupedByConfidence[level]) {
        newSelected[candidate.address] = false;
      }
      return newSelected;
    });
  };

  const getSelectedInSection = (level: ConfidenceLevel) => {
    return groupedByConfidence[level].filter((c) => selectedSenders[c.address])
      .length;
  };

  const archiveSelected = async () => {
    setIsArchiving(true);
    const toArchive = candidates.filter((c) => selectedSenders[c.address]);

    try {
      for (const candidate of toArchive) {
        await addToArchiveSenderQueue({
          sender: candidate.address,
          emailAccountId,
        });
      }
      setArchiveComplete(true);
    } catch {
      toast.error(
        "Lưu trữ một số người gửi không thành công. Vui lòng thử lại.",
      );
    } finally {
      setIsArchiving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-4">
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <LoadingContent loading={false} error={error}>
        {null}
      </LoadingContent>
    );
  }

  if (archiveComplete) {
    return (
      <div className="py-4">
        <Card className="border-green-200 bg-green-50 p-8 text-center dark:border-green-900 dark:bg-green-950/30">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
            <CheckIcon className="size-8 text-green-600" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-green-900 dark:text-green-100">
            Đã bắt đầu lưu trữ!
          </h2>
          <p className="mb-4 text-green-700 dark:text-green-300">
            {selectedCount} người gửi đang được lưu trữ ở chế độ nền.
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Email được lưu trữ, không bị xóa. Bạn có thể tìm lại trong Gmail bất
            cứ lúc nào.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              setArchiveComplete(false);
              setSelectedSenders({});
            }}
          >
            Hoàn tất
          </Button>
        </Card>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="py-4">
        <Card className="p-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <InboxIcon className="size-8 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">
            Không có người gửi cần lưu trữ
          </h2>
          <p className="text-muted-foreground">
            Khi AI phân loại xong người gửi, bạn sẽ thấy gợi ý lưu trữ tại đây.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Hero Card */}
      <Card className="mb-6 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
              <ArchiveIcon className="size-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="mb-1 text-xl font-semibold">
                Sẵn sàng dọn dẹp hộp thư
              </h2>
              <p className="mb-4 text-muted-foreground">
                Chúng tôi tìm thấy{" "}
                <span className="font-medium text-foreground">
                  {totalCount}
                </span>{" "}
                người gửi mà bạn có thể muốn lưu trữ
              </p>

              <div className="mb-4 flex flex-wrap gap-3 text-sm">
                {groupedByConfidence.high.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-green-500" />
                    <span>
                      {groupedByConfidence.high.length} người gửi an toàn để lưu
                      trữ
                    </span>
                  </div>
                )}
                {groupedByConfidence.medium.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-amber-500" />
                    <span>
                      {groupedByConfidence.medium.length} người gửi có lẽ an
                      toàn
                    </span>
                  </div>
                )}
                {groupedByConfidence.low.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-blue-500" />
                    <span>
                      {groupedByConfidence.low.length} người gửi nên xem lại
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={archiveSelected}
                  disabled={selectedCount === 0 || isArchiving}
                >
                  <ArchiveIcon className="mr-2 size-4" />
                  {isArchiving
                    ? "Đang lưu trữ..."
                    : `Lưu trữ ${selectedCount} người gửi`}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="border-t bg-muted/30 px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              <TrendingDownIcon className="mr-1.5 inline size-4" />
              Đã chọn {selectedCount}/{totalCount} người gửi
            </span>
            <span className="font-medium">
              {Math.round((selectedCount / totalCount) * 100)}% mức độ dọn dẹp
              hộp thư
            </span>
          </div>
          <Progress
            value={(selectedCount / totalCount) * 100}
            className="mt-2 h-2"
          />
        </div>
      </Card>

      {/* Confidence Sections */}
      <div className="space-y-4">
        {(["high", "medium", "low"] as ConfidenceLevel[]).map((level) => {
          const config = confidenceConfig[level];
          const senders = groupedByConfidence[level];
          const Icon = config.icon;
          const isExpanded = expandedSections[level];
          const selectedInSection = getSelectedInSection(level);

          if (senders.length === 0) return null;

          return (
            <Card
              key={level}
              className={cn("overflow-hidden", config.borderColor)}
            >
              <div
                className={cn(
                  "cursor-pointer p-4 transition-colors",
                  config.bgColor,
                  config.hoverBgColor,
                )}
                onClick={() => toggleSection(level)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleSection(level);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-lg bg-white dark:bg-gray-900",
                        config.color,
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{config.label}</h3>
                        <Badge variant={config.badgeVariant}>
                          {senders.length}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {config.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedInSection === senders.length) {
                          deselectAllInSection(level);
                        } else {
                          selectAllInSection(level);
                        }
                      }}
                    >
                      {selectedInSection === senders.length
                        ? "Bỏ chọn tất cả"
                        : "Chọn tất cả"}
                    </Button>
                    <span className="min-w-[60px] text-right text-sm text-muted-foreground">
                      {selectedInSection}/{senders.length}
                    </span>
                    <ChevronDownIcon
                      className={cn(
                        "size-5 text-muted-foreground transition-transform",
                        isExpanded && "rotate-180",
                      )}
                    />
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="divide-y border-t">
                  {senders.map((candidate) => (
                    <SenderRow
                      key={candidate.address}
                      candidate={candidate}
                      isSelected={!!selectedSenders[candidate.address]}
                      isExpanded={!!expandedSenders[candidate.address]}
                      onToggleSelection={() =>
                        toggleSenderSelection(candidate.address)
                      }
                      onToggleExpanded={() =>
                        toggleSenderExpanded(candidate.address)
                      }
                      userEmail={userEmail}
                    />
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function SenderRow({
  candidate,
  isSelected,
  isExpanded,
  onToggleSelection,
  onToggleExpanded,
  userEmail,
}: {
  candidate: ArchiveCandidate;
  isSelected: boolean;
  isExpanded: boolean;
  onToggleSelection: () => void;
  onToggleExpanded: () => void;
  userEmail: string;
}) {
  const status = useArchiveSenderStatus(candidate.address);

  return (
    <div className={cn(!isSelected && "opacity-50")}>
      <div
        className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-muted/50"
        onClick={onToggleExpanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleExpanded();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <Checkbox
          checked={isSelected}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelection();
          }}
          className="size-5"
        />
        <div className="min-w-0 flex-1">
          <EmailCell
            emailAddress={candidate.address}
            className={cn(
              "flex flex-col",
              !isSelected && "text-muted-foreground line-through",
            )}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {candidate.reason}
          </span>
          <ArchiveStatus status={status} />
          <ChevronDownIcon
            className={cn(
              "size-5 text-muted-foreground transition-transform",
              isExpanded && "rotate-180",
            )}
          />
        </div>
      </div>

      {isExpanded && (
        <ExpandedEmails sender={candidate.address} userEmail={userEmail} />
      )}
    </div>
  );
}

function ArchiveStatus({
  status,
}: {
  status: ReturnType<typeof useArchiveSenderStatus>;
}) {
  switch (status?.status) {
    case "completed":
      if (status.threadsTotal) {
        return (
          <span className="text-sm text-green-600">
            Đã lưu trữ {status.threadsTotal} email!
          </span>
        );
      }
      return <span className="text-sm text-muted-foreground">Đã lưu trữ</span>;
    case "processing":
      return (
        <span className="text-sm text-blue-600">
          {status.threadsTotal - status.threadIds.length} /{" "}
          {status.threadsTotal}
        </span>
      );
    case "pending":
      return <span className="text-sm text-muted-foreground">Đang chờ...</span>;
    default:
      return null;
  }
}

function ExpandedEmails({
  sender,
  userEmail,
}: {
  sender: string;
  userEmail: string;
}) {
  const { provider } = useAccount();

  const { data, isLoading, error } = useThreads({
    fromEmail: sender,
    limit: 5,
    type: "all",
  });

  if (isLoading) {
    return (
      <div className="border-t bg-muted/30 p-4">
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-t bg-muted/30 p-4 text-sm text-muted-foreground">
        Error loading emails
      </div>
    );
  }

  if (!data?.threads.length) {
    return (
      <div className="border-t bg-muted/30 p-4 text-sm text-muted-foreground">
        No emails found
      </div>
    );
  }

  return (
    <div className="border-t bg-muted/30">
      <div className="py-2">
        {data.threads.slice(0, 5).map((thread) => {
          const firstMessage = thread.messages[0];
          if (!firstMessage) return null;
          const subject = firstMessage.subject;
          const date = firstMessage.date;
          const snippet = thread.snippet || firstMessage.snippet;

          return (
            <div key={thread.id} className="flex">
              <div className="flex items-center pl-[26px]">
                <div className="h-full w-px bg-border" />
                <div className="h-px w-4 bg-border" />
              </div>
              <Link
                href={getEmailUrl(thread.id, userEmail, provider)}
                target="_blank"
                className="mr-2 flex flex-1 items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/50"
              >
                <MailIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-sm">
                  <span className="font-medium">
                    {subject.length > 50
                      ? `${subject.slice(0, 50)}...`
                      : subject}
                  </span>
                  {snippet && (
                    <span className="ml-2 text-muted-foreground">
                      {(() => {
                        const cleaned = snippet
                          .replace(/[\u034F\u200B-\u200D\uFEFF\u00A0]/g, "")
                          .trim()
                          .replace(/\s+/g, " ");
                        return cleaned.length > 80
                          ? `${cleaned.slice(0, 80).trimEnd()}...`
                          : cleaned;
                      })()}
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatShortDate(new Date(date))}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
