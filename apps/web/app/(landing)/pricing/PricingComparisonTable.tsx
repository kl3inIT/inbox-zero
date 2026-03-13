import { CheckIcon, MinusIcon } from "lucide-react";
import { CardWrapper } from "@/components/new-landing/common/CardWrapper";
import {
  Section,
  SectionContent,
} from "@/components/new-landing/common/Section";
import { SectionHeading } from "@/components/new-landing/common/Typography";
import { tiers } from "@/app/(app)/refer/premium/config";

type FeatureValue = boolean | string;

const features: {
  name: string;
  starter: FeatureValue;
  plus: FeatureValue;
  professional: FeatureValue;
}[] = [
  {
    name: "Sắp xếp và gắn nhãn email",
    starter: true,
    plus: true,
    professional: true,
  },
  {
    name: "Soạn sẵn trả lời theo giọng văn của bạn",
    starter: true,
    plus: true,
    professional: true,
  },
  {
    name: "Chặn email tiếp thị lạnh",
    starter: true,
    plus: true,
    professional: true,
  },
  {
    name: "Hủy đăng ký hàng loạt",
    starter: true,
    plus: true,
    professional: true,
  },
  {
    name: "Lưu trữ hàng loạt",
    starter: true,
    plus: true,
    professional: true,
  },
  {
    name: "Phân tích email",
    starter: true,
    plus: true,
    professional: true,
  },
  {
    name: "Tóm tắt trước cuộc họp",
    starter: true,
    plus: true,
    professional: true,
  },
  {
    name: "Tích hợp với Slack",
    starter: false,
    plus: true,
    professional: true,
  },
  {
    name: "Tự động lưu file đính kèm",
    starter: false,
    plus: true,
    professional: true,
  },
  {
    name: "Kho kiến thức",
    starter: "Giới hạn",
    plus: "Không giới hạn",
    professional: "Không giới hạn",
  },
  {
    name: "Phân tích cho toàn đội",
    starter: false,
    plus: false,
    professional: true,
  },
  {
    name: "Hỗ trợ ưu tiên",
    starter: false,
    plus: false,
    professional: true,
  },
  {
    name: "Chuyên viên triển khai riêng",
    starter: false,
    plus: false,
    professional: true,
  },
];

const tierHeaders = tiers.map((tier) => ({
  name: tier.name,
  price: `$${tier.price.monthly}`,
}));

function FeatureCell({ value }: { value: FeatureValue }) {
  if (typeof value === "string") {
    return <span className="text-sm text-gray-700">{value}</span>;
  }
  if (value) {
    return <CheckIcon className="h-5 w-5 text-blue-500 mx-auto" />;
  }
  return <MinusIcon className="h-5 w-5 text-gray-300 mx-auto" />;
}

export function PricingComparisonTable() {
  return (
    <Section>
      <SectionHeading>So sánh các gói</SectionHeading>
      <SectionContent>
        <CardWrapper>
          <div className="overflow-x-auto rounded-[20px] border border-[#E7E7E780] bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E7E7E780]">
                  <th className="py-4 px-6 text-sm font-medium text-gray-500">
                    Tính năng
                  </th>
                  {tierHeaders.map((tier) => (
                    <th
                      key={tier.name}
                      className="py-4 px-6 text-center min-w-[140px]"
                    >
                      <div className="text-sm font-semibold text-gray-900">
                        {tier.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {tier.price}/tháng
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={feature.name}
                    className={
                      index < features.length - 1
                        ? "border-b border-[#E7E7E780]"
                        : ""
                    }
                  >
                    <td className="py-3.5 px-6 text-sm text-gray-700">
                      {feature.name}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <FeatureCell value={feature.starter} />
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <FeatureCell value={feature.plus} />
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <FeatureCell value={feature.professional} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardWrapper>
      </SectionContent>
    </Section>
  );
}
