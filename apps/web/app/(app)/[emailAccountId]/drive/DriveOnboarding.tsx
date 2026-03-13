"use client";

import { Card } from "@/components/ui/card";
import {
  PageSubHeading,
  TypographyH3,
  TypographyH4,
} from "@/components/Typography";
import { ConnectDrive } from "./ConnectDrive";

const steps = [
  {
    number: 1,
    title: "Hãy cho chúng tôi biết bạn sắp xếp như thế nào",
    description:
      '"Hóa đơn vào thư mục Chi phí theo tháng. Hợp đồng vào thư mục Pháp lý."',
  },
  {
    number: 2,
    title: "Tệp đính kèm được tự động lưu trữ",
    description: "AI đọc từng tài liệu và lưu vào đúng thư mục phù hợp",
  },
  {
    number: 3,
    title: "Bạn luôn kiểm soát",
    description:
      "Nhận email khi tệp được sắp xếp — trả lời email để chỉnh sửa nếu cần",
  },
];

export function DriveOnboarding() {
  return (
    <div className="mx-auto max-w-xl py-8">
      <TypographyH3 className="text-center">
        Tệp đính kèm được tự động lưu khi bạn làm việc
      </TypographyH3>

      <div className="mt-10 space-y-6">
        {steps.map((step) => (
          <div key={step.number} className="flex gap-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              {step.number}
            </div>
            <div>
              <TypographyH4>{step.title}</TypographyH4>
              <PageSubHeading className="mt-1">
                {step.description}
              </PageSubHeading>
            </div>
          </div>
        ))}
      </div>

      <Card className="mt-10 p-6">
        <TypographyH4 className="text-center">
          Chúng tôi nên lưu tệp đính kèm của bạn ở đâu?
        </TypographyH4>
        <div className="mt-4 flex justify-center">
          <ConnectDrive />
        </div>
      </Card>
    </div>
  );
}
