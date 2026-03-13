"use client";

import { CheckCircleIcon } from "lucide-react";
import { userCount } from "@/utils/config";
import { BRAND_NAME } from "@/utils/branding";

export function WelcomeUpgradeHeader() {
  return (
    <div className="mb-8 flex flex-col items-start">
      <div className="mx-auto text-center">
        <h2 className="font-title text-base leading-7 text-blue-600">
          Dành ít hơn 50% thời gian cho email
        </h2>
        <div>
          <h1 className="mt-2 font-title text-2xl text-gray-900 sm:text-3xl">
            Bắt đầu dùng thử MIỄN PHÍ 7 ngày
          </h1>
          <p className="mt-2 text-lg text-gray-900 sm:text-xl">
            {`Tham gia cùng ${userCount} người dùng đang sử dụng ${BRAND_NAME} để làm việc hiệu quả hơn!`}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-4 flex flex-col items-start gap-2">
        <TrialFeature>Dùng thử 100% không rủi ro</TrialFeature>
        <TrialFeature>Miễn phí trong 7 ngày đầu</TrialFeature>
        <TrialFeature>Huỷ bất cứ lúc nào, nhanh gọn</TrialFeature>
      </div>
    </div>
  );
}

const TrialFeature = ({ children }: { children: React.ReactNode }) => (
  <p className="flex items-center text-gray-900">
    <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
    {children}
  </p>
);
