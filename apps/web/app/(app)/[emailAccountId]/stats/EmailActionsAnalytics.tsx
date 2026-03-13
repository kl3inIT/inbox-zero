"use client";

import { useOrgSWR } from "@/hooks/useOrgSWR";
import { LoadingContent } from "@/components/LoadingContent";
import { Skeleton } from "@/components/ui/skeleton";
import { CardBasic } from "@/components/ui/card";
import type { EmailActionStatsResponse } from "@/app/api/user/stats/email-actions/route";
import { BarChart } from "./BarChart";
import type { ChartConfig } from "@/components/ui/chart";
import { COLORS } from "@/utils/colors";
import { BRAND_NAME } from "@/utils/branding";

const chartConfig = {
  Archived: { label: "Đã lưu trữ", color: COLORS.analytics.green },
  Deleted: { label: "Đã xóa", color: COLORS.analytics.pink },
} satisfies ChartConfig;

export function EmailActionsAnalytics() {
  const { data, isLoading, error } = useOrgSWR<EmailActionStatsResponse>(
    "/api/user/stats/email-actions",
  );

  if (data?.disabled) {
    return (
      <CardBasic>
        <p>{`Số email bạn đã lưu trữ và xóa với ${BRAND_NAME}`}</p>
        <div className="mt-4 h-72 flex items-center justify-center text-muted-foreground">
          <p>
            Tính năng này đang bị tắt. Hãy liên hệ quản trị viên để bật lại.
          </p>
        </div>
      </CardBasic>
    );
  }

  return (
    <LoadingContent
      loading={isLoading}
      error={error}
      loadingComponent={<Skeleton className="h-32 w-full rounded" />}
    >
      {data && (
        <CardBasic>
          <p>{`Số email bạn đã lưu trữ và xóa với ${BRAND_NAME}`}</p>
          <div className="mt-4">
            <BarChart
              data={data.result}
              config={chartConfig}
              dataKeys={["Archived", "Deleted"]}
              xAxisKey="date"
            />
          </div>
        </CardBasic>
      )}
    </LoadingContent>
  );
}
