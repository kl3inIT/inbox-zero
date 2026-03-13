import useSWR from "swr";
import type { DateRange } from "react-day-picker";
import { BarChart } from "@/app/(app)/[emailAccountId]/stats/BarChart";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getDateRangeParams } from "@/app/(app)/[emailAccountId]/stats/params";
import type {
  SenderEmailsQuery,
  SenderEmailsResponse,
} from "@/app/api/user/stats/sender-emails/route";
import type { ZodPeriod } from "@inboxzero/tinybird";
import { LoadingContent } from "@/components/LoadingContent";
import { SectionHeader } from "@/components/Typography";
import { EmailList } from "@/components/email-list/EmailList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getGmailFilterSettingsUrl } from "@/utils/url";
import { Tooltip } from "@/components/Tooltip";
import { AlertBasic } from "@/components/Alert";
import { MoreDropdown } from "@/app/(app)/[emailAccountId]/bulk-unsubscribe/common";
import { useLabels } from "@/hooks/useLabels";
import type { Row } from "@/app/(app)/[emailAccountId]/bulk-unsubscribe/types";
import { useThreads } from "@/hooks/useThreads";
import { useAccount } from "@/providers/EmailAccountProvider";
import { onAutoArchive } from "@/utils/actions/client";
import { COLORS } from "@/utils/colors";

export function NewsletterModal(props: {
  newsletter?: Pick<Row, "name" | "unsubscribeLink" | "autoArchived">;
  onClose: (isOpen: boolean) => void;
  refreshInterval?: number;
  mutate: () => Promise<any>;
}) {
  const { newsletter, refreshInterval, onClose, mutate } = props;

  const { emailAccountId, userEmail } = useAccount();

  const { userLabels } = useLabels();

  const posthog = usePostHog();

  return (
    <Dialog open={!!newsletter} onOpenChange={onClose}>
      <DialogContent className="lg:min-w-[880px] xl:min-w-[1280px]">
        {newsletter && (
          <>
            <DialogHeader>
              <DialogTitle>Thống kê cho {newsletter.name}</DialogTitle>
            </DialogHeader>

            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <a
                  href={newsletter.unsubscribeLink || undefined}
                  target="_blank"
                  rel="noreferrer"
                >
                  Hủy đăng ký
                </a>
              </Button>
              <Tooltip content="Tự động lưu trữ email bằng bộ lọc Gmail">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onAutoArchive({
                      emailAccountId,
                      from: newsletter.name,
                    });
                  }}
                >
                  Tự động lưu trữ
                </Button>
              </Tooltip>
              {newsletter.autoArchived && (
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={getGmailFilterSettingsUrl(userEmail)}
                    target="_blank"
                  >
                    <ExternalLinkIcon className="mr-2 h-4 w-4" />
                    Xem bộ lọc tự động lưu trữ
                  </Link>
                </Button>
              )}
              <MoreDropdown
                item={newsletter}
                userEmail={userEmail}
                emailAccountId={emailAccountId}
                labels={userLabels}
                posthog={posthog}
                mutate={mutate}
              />
            </div>

            <div>
              <EmailsChart
                fromEmail={newsletter.name}
                period="week"
                refreshInterval={refreshInterval}
              />
            </div>
            <div className="lg:max-w-[820px] xl:max-w-[1220px]">
              <Emails
                fromEmail={newsletter.name}
                refreshInterval={refreshInterval}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function useSenderEmails(props: {
  fromEmail: string;
  dateRange?: DateRange | undefined;
  period: ZodPeriod;
  refreshInterval?: number;
}) {
  const params: SenderEmailsQuery = {
    ...props,
    ...getDateRangeParams(props.dateRange),
  };
  const { data, isLoading, error } = useSWR<
    SenderEmailsResponse,
    { error: string }
  >(`/api/user/stats/sender-emails/?${new URLSearchParams(params as any)}`, {
    refreshInterval: props.refreshInterval,
  });

  return { data, isLoading, error };
}

function EmailsChart(props: {
  fromEmail: string;
  dateRange?: DateRange | undefined;
  period: ZodPeriod;
  refreshInterval?: number;
}) {
  const { data, isLoading, error } = useSenderEmails(props);

  return (
    <LoadingContent loading={isLoading} error={error}>
      {data && (
        <BarChart
          data={data.result}
          config={{
            Emails: { label: "Emails", color: COLORS.analytics.green },
          }}
          xAxisKey="startOfPeriod"
        />
      )}
    </LoadingContent>
  );
}

function Emails(props: { fromEmail: string; refreshInterval?: number }) {
  return (
    <>
      <SectionHeader>Email</SectionHeader>
      <Tabs defaultValue="unarchived" className="mt-2" searchParam="modal-tab">
        <TabsList>
          <TabsTrigger value="unarchived">Chưa lưu trữ</TabsTrigger>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
        </TabsList>

        <div className="mt-2">
          <TabsContent value="unarchived">
            <UnarchivedEmails fromEmail={props.fromEmail} />
          </TabsContent>
          <TabsContent value="all">
            <AllEmails fromEmail={props.fromEmail} />
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}

function UnarchivedEmails({
  fromEmail,
  refreshInterval,
}: {
  fromEmail: string;
  refreshInterval?: number;
}) {
  const { data, isLoading, error, mutate } = useThreads({
    fromEmail,
    refreshInterval,
  });

  return (
    <LoadingContent loading={isLoading} error={error}>
      {data && (
        <EmailList
          threads={data.threads}
          emptyMessage={
            <AlertBasic
              title="Không có email chưa lưu trữ"
              description={`Không có email chưa lưu trữ. Chuyển sang tab "Tất cả" để xem toàn bộ email từ người gửi này.`}
            />
          }
          hideActionBarWhenEmpty
          refetch={() => mutate()}
        />
      )}
    </LoadingContent>
  );
}

function AllEmails({
  fromEmail,
  refreshInterval,
}: {
  fromEmail: string;
  refreshInterval?: number;
}) {
  const { data, isLoading, error, mutate } = useThreads({
    fromEmail,
    type: "all",
    refreshInterval,
  });

  return (
    <LoadingContent loading={isLoading} error={error}>
      {data && (
        <EmailList
          threads={data.threads}
          emptyMessage={
            <AlertBasic
              title="Không có email"
              description="Không có email nào từ người gửi này."
            />
          }
          hideActionBarWhenEmpty
          refetch={() => mutate()}
        />
      )}
    </LoadingContent>
  );
}
