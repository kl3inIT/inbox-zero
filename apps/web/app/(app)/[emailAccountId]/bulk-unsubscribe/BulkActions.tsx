import { useMemo, useState } from "react";
import { usePostHog } from "posthog-js/react";
import {
  ArchiveIcon,
  Loader2Icon,
  MailXIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useBulkUnsubscribe,
  useBulkApprove,
  useBulkAutoArchive,
  useBulkArchive,
  useBulkDelete,
} from "@/app/(app)/[emailAccountId]/bulk-unsubscribe/hooks";
import { PremiumTooltip, usePremium } from "@/components/PremiumAlert";
import { usePremiumModal } from "@/app/(app)/refer/premium/PremiumModal";
import { useAccount } from "@/providers/EmailAccountProvider";
import { cn } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DomainIcon } from "@/components/charts/DomainIcon";
import { extractDomainFromEmail } from "@/utils/email";
import type { NewsletterStatsResponse } from "@/app/api/user/stats/newsletters/route";
import { NewsletterStatus } from "@/generated/prisma/enums";
import type { NewsletterFilterType } from "@/app/(app)/[emailAccountId]/bulk-unsubscribe/hooks";

type Newsletter = NewsletterStatsResponse["newsletters"][number];

function ActionButton({
  icon: Icon,
  label,
  loadingLabel,
  onClick,
  loading,
  danger,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  loadingLabel?: string;
  onClick: () => void;
  loading?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
        "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        danger && "hover:text-red-600",
        loading && "opacity-50 cursor-not-allowed",
      )}
    >
      {loading ? (
        <Loader2Icon className="size-4 animate-spin" />
      ) : (
        <Icon className="size-4" />
      )}
      {loading && loadingLabel ? loadingLabel : label}
    </button>
  );
}

export function BulkActions({
  selected,
  mutate,
  onClearSelection,
  deselectItem,
  newsletters,
  filter,
  totalCount,
}: {
  selected: Map<string, boolean>;
  // biome-ignore lint/suspicious/noExplicitAny: matches SWR mutate return type
  mutate: () => Promise<any>;
  onClearSelection: () => void;
  deselectItem: (id: string) => void;
  newsletters?: Newsletter[];
  filter: NewsletterFilterType;
  totalCount: number;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [autoArchiveDialogOpen, setAutoArchiveDialogOpen] = useState(false);

  const posthog = usePostHog();
  const { hasUnsubscribeAccess, mutate: refetchPremium } = usePremium();
  const { PremiumModal, openModal } = usePremiumModal();
  const { emailAccountId } = useAccount();
  const { onBulkUnsubscribe } = useBulkUnsubscribe({
    hasUnsubscribeAccess,
    mutate,
    posthog,
    refetchPremium,
    emailAccountId,
    onDeselectItem: deselectItem,
    filter,
  });

  const { onBulkApprove } = useBulkApprove({
    mutate,
    posthog,
    emailAccountId,
    onDeselectItem: deselectItem,
    filter,
  });

  const { onBulkAutoArchive } = useBulkAutoArchive({
    hasUnsubscribeAccess,
    mutate,
    refetchPremium,
    emailAccountId,
    onDeselectItem: deselectItem,
    filter,
  });

  const { onBulkArchive, isBulkArchiving } = useBulkArchive({
    mutate,
    posthog,
    emailAccountId,
  });

  const { onBulkDelete, isBulkDeleting } = useBulkDelete({
    mutate,
    posthog,
    emailAccountId,
  });

  const getSelectedValues = () =>
    Array.from(selected.entries())
      .filter(([, value]) => value)
      .map(([name, value]) => ({
        name,
        value,
      }));

  const selectedCount = Array.from(selected.values()).filter(Boolean).length;
  const isVisible = selectedCount > 0;

  // Get the selected newsletters with their details
  const selectedNewsletters =
    newsletters?.filter((n) => selected.get(n.name)) || [];

  // Check if all selected newsletters are already approved
  const allSelectedAreApproved = useMemo(() => {
    if (selectedNewsletters.length === 0) return false;
    return selectedNewsletters.every(
      (n) => n.status === NewsletterStatus.APPROVED,
    );
  }, [selectedNewsletters]);

  const allSelectedCanUnsubscribe = selectedNewsletters.every(
    (n) => n.status !== NewsletterStatus.UNSUBSCRIBED,
  );

  const hasUnsubscribeLinks = selectedNewsletters.some(
    (n) => n.unsubscribeLink,
  );

  const hasBlockableLinks = selectedNewsletters.some((n) => !n.unsubscribeLink);

  const unsubscribeLabel =
    hasUnsubscribeLinks && hasBlockableLinks
      ? "Hủy đăng ký/Chặn"
      : hasBlockableLinks
        ? "Chặn"
        : "Hủy đăng ký";

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <PremiumTooltip
              showTooltip={!hasUnsubscribeAccess}
              openModal={openModal}
            >
              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between gap-3">
                {/* Left side: Close button and selection count */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClearSelection}
                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                  >
                    <XIcon className="size-4" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Đã chọn {selectedCount}/{totalCount}
                  </span>
                </div>

                {/* Right side: Action Buttons */}
                <div className="flex items-center gap-1 flex-nowrap">
                  {allSelectedCanUnsubscribe && (
                    <ActionButton
                      icon={MailXIcon}
                      label={unsubscribeLabel}
                      onClick={() => onBulkUnsubscribe(getSelectedValues())}
                    />
                  )}
                  <ActionButton
                    icon={ArchiveIcon}
                    label="Tự động lưu trữ"
                    onClick={() => setAutoArchiveDialogOpen(true)}
                  />
                  <ActionButton
                    icon={
                      allSelectedAreApproved ? ThumbsDownIcon : ThumbsUpIcon
                    }
                    label={
                      allSelectedAreApproved ? "Bỏ chấp thuận" : "Chấp thuận"
                    }
                    onClick={() =>
                      onBulkApprove(getSelectedValues(), allSelectedAreApproved)
                    }
                  />
                  <ActionButton
                    icon={ArchiveIcon}
                    label="Lưu trữ"
                    loadingLabel="Đang lưu trữ"
                    onClick={() => setArchiveDialogOpen(true)}
                    loading={isBulkArchiving}
                  />
                  <ActionButton
                    icon={TrashIcon}
                    label="Xoá"
                    loadingLabel="Đang xoá"
                    danger
                    onClick={() => setDeleteDialogOpen(true)}
                    loading={isBulkDeleting}
                  />
                </div>
              </div>
            </PremiumTooltip>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa tất cả email?</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tất cả email từ những người gửi này
              không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          {/* Selected Senders List */}
          {selectedNewsletters.length > 0 && (
            <div className="max-h-[300px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {selectedNewsletters.map((newsletter) => {
                  const domain =
                    extractDomainFromEmail(newsletter.name) || newsletter.name;
                  return (
                    <div
                      key={newsletter.name}
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <DomainIcon
                        domain={domain}
                        size={32}
                        variant="circular"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-sm truncate">
                          {newsletter.fromName || newsletter.name}
                        </span>
                        {newsletter.fromName && (
                          <span className="text-xs text-muted-foreground truncate">
                            {newsletter.name}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onBulkDelete(getSelectedValues());
                setDeleteDialogOpen(false);
              }}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation Dialog */}
      <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lưu trữ tất cả email?</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn lưu trữ tất cả email từ những người gửi này
              không?
            </DialogDescription>
          </DialogHeader>

          {/* Selected Senders List */}
          {selectedNewsletters.length > 0 && (
            <div className="max-h-[300px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {selectedNewsletters.map((newsletter) => {
                  const domain =
                    extractDomainFromEmail(newsletter.name) || newsletter.name;
                  return (
                    <div
                      key={newsletter.name}
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <DomainIcon
                        domain={domain}
                        size={32}
                        variant="circular"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-sm truncate">
                          {newsletter.fromName || newsletter.name}
                        </span>
                        {newsletter.fromName && (
                          <span className="text-xs text-muted-foreground truncate">
                            {newsletter.name}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setArchiveDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                onBulkArchive(getSelectedValues());
                setArchiveDialogOpen(false);
              }}
            >
              Lưu trữ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auto Archive Confirmation Dialog */}
      <Dialog
        open={autoArchiveDialogOpen}
        onOpenChange={setAutoArchiveDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Tự động lưu trữ email từ những người gửi này?
            </DialogTitle>
            <DialogDescription>
              Tự động lưu trữ tất cả email hiện tại và tương lai từ những người
              gửi này. Chúng sẽ không còn xuất hiện trong hộp thư đến của bạn.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAutoArchiveDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                onBulkAutoArchive(getSelectedValues());
                setAutoArchiveDialogOpen(false);
              }}
            >
              Tự động lưu trữ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PremiumModal />
    </>
  );
}
