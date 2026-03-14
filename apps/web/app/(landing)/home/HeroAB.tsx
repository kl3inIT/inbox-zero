"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/app/(landing)/home/Hero";
import {
  useHeroVariant,
  useHeroVariantEnabled,
  type HeroVariant,
} from "@/hooks/useFeatureFlags";
import { BRAND_NAME } from "@/utils/branding";

const copy: {
  [key in HeroVariant]: {
    title: string;
    subtitle: string;
  };
} = {
  control: {
    title: "Bớt quá tải email. Làm việc tập trung hơn.",
    subtitle: `${BRAND_NAME} giúp bạn sắp xếp hộp thư, soạn phản hồi nhanh hơn và không bỏ lỡ email quan trọng. Dùng cho Gmail và Outlook.`,
  },
  "clean-up-in-minutes": {
    title: "Dọn inbox chỉ trong vài phút",
    subtitle:
      "Hủy đăng ký email hàng loạt, tự động hóa hộp thư với AI, chặn email không mong muốn và theo dõi hiệu suất xử lý email mỗi ngày.",
  },
};

export function HeroAB() {
  const [title, setTitle] = useState(copy.control.title);
  const [subtitle, setSubtitle] = useState(copy.control.subtitle);
  const [isHydrated, setIsHydrated] = useState(false);

  const variant = useHeroVariant();
  const isFlagEnabled = useHeroVariantEnabled();

  useEffect(() => {
    if (variant && copy[variant]) {
      setTitle(copy[variant].title);
      setSubtitle(copy[variant].subtitle);
    }
    setIsHydrated(true);
  }, [variant]);

  if (isFlagEnabled === false) return <Hero />;

  return (
    <Hero
      title={
        <span
          className={`transition-opacity duration-300 ease-out ${
            isHydrated && isFlagEnabled ? "opacity-100" : "opacity-0"
          }`}
        >
          {title}
        </span>
      }
      subtitle={
        <span
          className={`transition-opacity duration-300 ease-out ${
            isHydrated && isFlagEnabled ? "opacity-100" : "opacity-0"
          }`}
        >
          {subtitle}
        </span>
      }
    />
  );
}
