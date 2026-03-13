"use client";

import { AlertError } from "@/components/Alert";
import { useEmailAccountFull } from "@/hooks/useEmailAccountFull";
import { getProviderRateLimitBannerLabel } from "@/utils/email/rate-limit-mode-error";

export function ProviderRateLimitBanner() {
  const { data, isLoading, error } = useEmailAccountFull();

  if (isLoading || error || !data?.providerRateLimit) return null;

  const { provider, retryAt } = data.providerRateLimit;
  const providerLabel = getProviderRateLimitBannerLabel(provider);

  const retryAtDate = new Date(retryAt);
  const retryAtLabel = Number.isNaN(retryAtDate.getTime())
    ? retryAt
    : retryAtDate.toLocaleString();

  return (
    <div className="mx-auto max-w-screen-xl w-full px-4 mt-6 mb-2">
      <AlertError
        title={`${providerLabel} đang giới hạn tốc độ tài khoản này`}
        description={
          <p className="mt-2">
            Các thao tác của Inbox Zero tạm thời bị tạm dừng cho đến khoảng{" "}
            <strong>{retryAtLabel}</strong>. Giới hạn này được áp dụng bởi{" "}
            {providerLabel}, và các ứng dụng khác kết nối với hộp thư này cũng
            có thể góp phần vào cùng một giới hạn dùng chung.
          </p>
        }
      />
    </div>
  );
}
