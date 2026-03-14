"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import { subDays } from "date-fns/subDays";
import { EmailAnalytics } from "@/app/(app)/[emailAccountId]/stats/EmailAnalytics";
import { StatsSummary } from "@/app/(app)/[emailAccountId]/stats/StatsSummary";
import { StatsOnboarding } from "@/app/(app)/[emailAccountId]/stats/StatsOnboarding";
import { useStatLoader } from "@/providers/StatLoaderProvider";
import { EmailActionsAnalytics } from "@/app/(app)/[emailAccountId]/stats/EmailActionsAnalytics";
import { RuleStatsChart } from "./RuleStatsChart";
import { ResponseTimeAnalytics } from "./ResponseTimeAnalytics";
import { PageHeading } from "@/components/Typography";
import { PageWrapper } from "@/components/PageWrapper";
import { useOrgAccess } from "@/hooks/useOrgAccess";
import { LoadStatsButton } from "@/app/(app)/[emailAccountId]/stats/LoadStatsButton";
import { ActionBar } from "@/app/(app)/[emailAccountId]/stats/ActionBar";
import { DetailedStatsFilter } from "@/app/(app)/[emailAccountId]/stats/DetailedStatsFilter";
import { LayoutGrid } from "lucide-react";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CardBasic } from "@/components/ui/card";

const selectOptions = [
  { label: "Tuần trước", value: "7" },
  { label: "Tháng trước", value: "30" },
  { label: "3 tháng gần đây", value: "90" },
  { label: "Năm trước", value: "365" },
  { label: "Tất cả", value: "0" },
];
const defaultSelected = selectOptions[1];

function getPeriodLabel(period: "day" | "week" | "month" | "year") {
  const labels = { day: "ngày", week: "tuần", month: "tháng", year: "năm" };
  return labels[period];
}

export function Stats() {
  const [dateDropdown, setDateDropdown] = useState<string>(
    defaultSelected.label,
  );

  const now = useMemo(() => new Date(), []);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(now, Number.parseInt(defaultSelected.value)),
    to: now,
  });

  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">(
    "week",
  );

  const { isAccountOwner, accountInfo } = useOrgAccess();

  const onSetDateDropdown = useCallback(
    (option: { label: string; value: string }) => {
      const { label, value } = option;
      setDateDropdown(label);

      if (value === "7") {
        setPeriod("day");
      } else if (value === "30" && (period === "month" || period === "year")) {
        setPeriod("week");
      } else if (value === "90" && period === "year") {
        setPeriod("month");
      }
    },
    [period],
  );

  const { isLoading, onLoad } = useStatLoader();
  const refreshInterval = isLoading ? 5000 : 1_000_000;
  useEffect(() => {
    // Skip stat loading when viewing someone else's account
    if (isAccountOwner) {
      onLoad({ loadBefore: false, showToast: false });
    }
  }, [onLoad, isAccountOwner]);

  const title =
    !isAccountOwner && accountInfo?.name
      ? `Phân tích cho ${accountInfo.name}`
      : "Phân tích";

  return (
    <PageWrapper>
      <PageHeading>{title}</PageHeading>
      <ActionBar className="mt-6" rightContent={<LoadStatsButton />}>
        <DatePickerWithRange
          dateRange={dateRange}
          onSetDateRange={setDateRange}
          selectOptions={selectOptions}
          dateDropdown={dateDropdown}
          onSetDateDropdown={onSetDateDropdown}
        />
        <DetailedStatsFilter
          label={`Nhóm theo ${getPeriodLabel(period)}`}
          icon={<LayoutGrid className="mr-2 h-4 w-4" />}
          columns={[
            {
              label: "Ngày",
              checked: period === "day",
              setChecked: () => setPeriod("day"),
            },
            {
              label: "Tuần",
              checked: period === "week",
              setChecked: () => setPeriod("week"),
            },
            {
              label: "Tháng",
              checked: period === "month",
              setChecked: () => setPeriod("month"),
            },
            {
              label: "Năm",
              checked: period === "year",
              setChecked: () => setPeriod("year"),
            },
          ]}
        />
      </ActionBar>
      <div className="grid gap-2 sm:gap-4 mt-2 sm:mt-4">
        <ErrorBoundary fallback={<SectionError title="Tổng quan" />}>
          <StatsSummary
            dateRange={dateRange}
            refreshInterval={refreshInterval}
            period={period}
          />
        </ErrorBoundary>
        <ErrorBoundary fallback={<SectionError title="Phân tích email" />}>
          <EmailAnalytics
            dateRange={dateRange}
            refreshInterval={refreshInterval}
          />
        </ErrorBoundary>
        <ErrorBoundary fallback={<SectionError title="Thời gian phản hồi" />}>
          <ResponseTimeAnalytics
            dateRange={dateRange}
            refreshInterval={refreshInterval}
          />
        </ErrorBoundary>
        <ErrorBoundary fallback={<SectionError title="Thống kê quy tắc" />}>
          <RuleStatsChart
            dateRange={dateRange}
            title="Email đã được trợ lý xử lý"
          />
        </ErrorBoundary>
        {isAccountOwner && (
          <ErrorBoundary fallback={<SectionError title="Hành động email" />}>
            <EmailActionsAnalytics />
          </ErrorBoundary>
        )}
      </div>
      <StatsOnboarding />
    </PageWrapper>
  );
}

function SectionError({ title }: { title: string }) {
  return (
    <CardBasic>
      <p className="text-muted-foreground">
        Không thể tải {title}. Vui lòng thử tải lại trang.
      </p>
    </CardBasic>
  );
}
