"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { TimeRange } from "./date-filter";

const timeRangeOptions = [
  { value: "all", label: "Tất cả" },
  { value: "3d", label: "Từ 3 ngày trở lên" },
  { value: "1w", label: "Từ 1 tuần trở lên" },
  { value: "2w", label: "Từ 2 tuần trở lên" },
  { value: "1m", label: "Từ 1 tháng trở lên" },
] as const;

export function TimeRangeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeRange = (searchParams.get("timeRange") as TimeRange) || "all";

  // nuqs would have been cleaner, but didn't seem to work for some reason
  const createQueryString = (value: TimeRange) => {
    const params = new URLSearchParams(searchParams);
    params.set("timeRange", value);
    params.delete("page");
    return params.toString();
  };

  return (
    <Select
      value={timeRange}
      onValueChange={(value: TimeRange) => {
        router.push(`${pathname}?${createQueryString(value)}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Chọn khoảng thời gian" />
      </SelectTrigger>
      <SelectContent>
        {timeRangeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
