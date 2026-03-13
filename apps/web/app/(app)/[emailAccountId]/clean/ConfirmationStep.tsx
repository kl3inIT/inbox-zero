"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MutedText, TypographyH3 } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/Badge";
import { cleanInboxAction } from "@/utils/actions/clean";
import { toastError } from "@/components/Toast";
import { CleanAction } from "@/generated/prisma/enums";
import { PREVIEW_RUN_COUNT } from "@/app/(app)/[emailAccountId]/clean/consts";
import { HistoryIcon, SettingsIcon } from "lucide-react";
import { useAccount } from "@/providers/EmailAccountProvider";
import { prefixPath } from "@/utils/path";

export function ConfirmationStep({
  showFooter,
  action,
  timeRange,
  instructions,
  skips,
  reuseSettings,
}: {
  showFooter: boolean;
  action: CleanAction;
  timeRange: number;
  instructions?: string;
  skips: {
    reply: boolean;
    starred: boolean;
    calendar: boolean;
    receipt: boolean;
    attachment: boolean;
  };
  reuseSettings: boolean;
}) {
  const router = useRouter();
  const { emailAccountId } = useAccount();

  const handleStartCleaning = async () => {
    const result = await cleanInboxAction(emailAccountId, {
      daysOld: timeRange ?? 7,
      instructions: instructions || "",
      action: action || CleanAction.ARCHIVE,
      maxEmails: PREVIEW_RUN_COUNT,
      skips,
    });

    if (result?.serverError) {
      toastError({ description: result.serverError });
      return;
    }

    router.push(
      prefixPath(
        emailAccountId,
        `/clean/run?jobId=${result?.data?.jobId}&isPreviewBatch=true`,
      ),
    );
  };

  return (
    <div className="text-center">
      <Image
        src="/images/illustrations/business-success-chart.svg"
        alt="clean up"
        width={200}
        height={200}
        className="mx-auto dark:brightness-90 dark:invert"
        unoptimized
      />

      <TypographyH3 className="mt-2">
        Sẵn sàng dọn dẹp hộp thư của bạn
      </TypographyH3>

      <ul className="mx-auto mt-4 max-w-prose list-disc space-y-2 pl-4 text-left">
        <li>
          Chúng tôi sẽ xử lý {PREVIEW_RUN_COUNT} email trong lần dọn dẹp thử đầu
          tiên.
        </li>
        <li>
          Nếu bạn hài lòng với kết quả, chúng tôi sẽ tiếp tục xử lý phần còn lại
          của hộp thư đến.
        </li>
        {/* TODO: we should count only emails we're processing */}
        {/* <li>
          The full process to handle {unhandledCount} emails will take
          approximately {estimatedTime}
        </li> */}
        <li>
          {action === CleanAction.ARCHIVE ? (
            <>
              Các email đã lưu trữ sẽ được gắn nhãn{" "}
              <Badge color="green">Đã lưu trữ</Badge> trong Gmail.
            </>
          ) : (
            <>
              Các email được đánh dấu đã đọc sẽ được gắn nhãn{" "}
              <Badge color="green">Đã đọc</Badge> trong Gmail.
            </>
          )}
        </li>
        <li>Không email nào bị xóa - bạn vẫn có thể tìm lại bằng tìm kiếm.</li>
        {reuseSettings && (
          <li>
            Chúng tôi sẽ dùng lại các cài đặt từ lần dọn dẹp hộp thư trước của
            bạn. Bạn có thể điều chỉnh lại{" "}
            <Link
              className="font-semibold hover:underline"
              href={prefixPath(emailAccountId, "/clean/onboarding")}
            >
              tại đây
            </Link>
            .
          </li>
        )}
      </ul>

      <div className="mt-6">
        <Button size="lg" onClick={handleStartCleaning}>
          Bắt đầu dọn dẹp
        </Button>
      </div>

      {showFooter && (
        <MutedText className="mt-6 flex items-center justify-center space-x-6">
          <FooterLink
            icon={HistoryIcon}
            text="Lịch sử"
            href={prefixPath(emailAccountId, "/clean/history")}
          />
          <FooterLink
            icon={SettingsIcon}
            text="Chỉnh sửa cài đặt"
            href={prefixPath(emailAccountId, "/clean/onboarding")}
          />
        </MutedText>
      )}
    </div>
  );
}

const FooterLink = ({
  icon: Icon,
  text,
  href,
}: {
  icon: React.ElementType;
  text: string;
  href: string;
}) => (
  <Link
    href={href}
    className="flex items-center transition-colors hover:text-primary"
  >
    <Icon className="mr-1 h-4 w-4" />
    <span>{text}</span>
  </Link>
);
