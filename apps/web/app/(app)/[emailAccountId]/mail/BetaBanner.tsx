"use client";

import { useLocalStorage } from "usehooks-ts";
import { Banner } from "@/components/Banner";

export function BetaBanner() {
  const [bannerVisible] = useLocalStorage<boolean | undefined>(
    "mailBetaBannerVisibile",
    true,
  );

  if (bannerVisible && typeof window !== "undefined")
    return (
      <Banner title="Beta">
        Tính năng Mail hiện đang trong giai đoạn thử nghiệm (beta). Tính năng
        này chưa được thiết kế để thay thế hoàn toàn ứng dụng email hiện tại của
        bạn.
      </Banner>
    );

  return null;
}
