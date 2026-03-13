"use client";

import { ArchiveIcon, MailOpenIcon, SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type BulkActionType = "archive" | "markRead";

interface BulkArchiveSettingsModalProps {
  onActionChange: (action: BulkActionType) => void;
  selectedAction: BulkActionType;
}

export function BulkArchiveSettingsModal({
  selectedAction,
  onActionChange,
}: BulkArchiveSettingsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <SettingsIcon className="mr-2 size-4" />
          Cài đặt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Cài đặt lưu trữ hàng loạt</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-8">
            <div className="space-y-2">
              <p className="font-medium">Hành động</p>
              <p className="text-sm text-muted-foreground">
                Chọn hành động sẽ xảy ra khi bạn bấm nút thao tác trên từng danh
                mục
              </p>
            </div>
            <Select
              value={selectedAction}
              onValueChange={(value) => onActionChange(value as BulkActionType)}
            >
              <SelectTrigger className="w-[180px] shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="archive">
                  <div className="flex items-center gap-2">
                    <ArchiveIcon className="size-4" />
                    <span>Lưu trữ</span>
                  </div>
                </SelectItem>
                <SelectItem value="markRead">
                  <div className="flex items-center gap-2">
                    <MailOpenIcon className="size-4" />
                    <span>Đánh dấu đã đọc</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function getActionLabels(action: BulkActionType) {
  if (action === "markRead") {
    return {
      buttonLabel: "Đánh dấu đã đọc",
      allLabel: "Đánh dấu tất cả đã đọc",
      countLabel: (selected: number, total: number) =>
        `Đánh dấu ${selected} trên ${total} là đã đọc`,
      completedLabel: "Đã đánh dấu đã đọc",
      icon: MailOpenIcon,
    };
  }
  return {
    buttonLabel: "Lưu trữ",
    allLabel: "Lưu trữ tất cả",
    countLabel: (selected: number, total: number) =>
      `Lưu trữ ${selected} trên ${total}`,
    completedLabel: "Đã lưu trữ",
    icon: ArchiveIcon,
  };
}
