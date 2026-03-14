"use client";

import useSWR from "swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Share2, Users, Trophy, GiftIcon } from "lucide-react";
import { toastError, toastSuccess } from "@/components/Toast";
import type { GetReferralStatsResponse } from "@/app/api/referrals/stats/route";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import type { GetReferralCodeResponse } from "@/app/api/referrals/code/route";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { generateReferralLink } from "@/utils/referral/referral-link";
import { PageHeading, PageSubHeading } from "@/components/Typography";

export function ReferralDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton sidebarName="left-sidebar">
          <GiftIcon />
          <span className="font-semibold">Giới thiệu bạn bè</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <Referrals />
      </DialogContent>
    </Dialog>
  );
}

export function Referrals() {
  const {
    data: codeData,
    isLoading: loadingCode,
    error: errorCode,
  } = useSWR<GetReferralCodeResponse>("/api/referrals/code");

  const {
    data: statsData,
    isLoading: loadingStats,
    error: errorStats,
  } = useSWR<GetReferralStatsResponse>("/api/referrals/stats");

  const loading = loadingCode || loadingStats;

  const link = generateReferralLink(codeData?.code || "");

  const copyToClipboard = async (text: string, type: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      toastSuccess({
        description: `Đã sao chép ${type === "code" ? "mã" : "liên kết"} giới thiệu!`,
      });
    } catch {
      toastError({
        title: `Không thể sao chép ${type === "code" ? "mã" : "liên kết"}`,
        description: "Vui lòng thử lại",
      });
    }
  };

  const shareReferralLink = async () => {
    if (!codeData?.code) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Tham gia FocusMail qua liên kết giới thiệu của mình",
          text: "Dùng liên kết giới thiệu của mình để bắt đầu với FocusMail!",
          url: link,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toastError({
            title: "Không thể chia sẻ",
            description: "Vui lòng thử lại",
          });
        }
      }
    } else {
      copyToClipboard(link, "link");
    }
  };

  if (loading) {
    return <ReferralDashboardSkeleton />;
  }

  if (errorCode || errorStats) {
    return <ErrorDisplay error={{ error: "Lỗi khi tải dữ liệu giới thiệu" }} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <PageHeading>Giới thiệu bạn bè, nhận quà</PageHeading>
        <PageSubHeading className="mt-2">
          Chia sẻ FocusMail với bạn bè và nhận 1 tháng miễn phí cho mỗi người
          hoàn tất giai đoạn dùng thử
        </PageSubHeading>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liên kết giới thiệu của bạn</CardTitle>
          <CardDescription>
            Chia sẻ với bạn bè để nhận phần thưởng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {codeData?.code ? (
            <div className="space-y-4">
              <div className="rounded-lg border bg-gray-50 p-3 sm:p-4">
                <div className="overflow-x-auto">
                  <span className="font-mono text-sm sm:text-base lg:text-lg font-bold text-gray-900 break-all">
                    {link}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => copyToClipboard(link, "link")}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Sao chép liên kết
                </Button>
                <Button
                  onClick={shareReferralLink}
                  variant="default"
                  className="flex-1"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Chia sẻ
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Không thể tải liên kết giới thiệu</p>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {statsData && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng lượt giới thiệu
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsData.stats.totalReferrals}
              </div>
              <p className="text-xs text-muted-foreground">
                Bạn bè bạn đã giới thiệu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Phần thưởng đã nhận
              </CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsData.stats.totalRewards}
              </div>
              <p className="text-xs text-muted-foreground">Số tháng miễn phí</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function ReferralDashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <Skeleton className="mx-auto h-8 sm:h-10 w-full max-w-sm" />
        <Skeleton className="mx-auto mt-3 sm:mt-4 h-5 sm:h-6 w-full max-w-md" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-2 h-4 w-full max-w-xs" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 sm:h-20 w-full" />
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-2 h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
