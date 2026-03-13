import clsx from "clsx";
import {
  BarChart2Icon,
  EyeIcon,
  LineChart,
  type LucideIcon,
  MousePointer2Icon,
  Orbit,
  ShieldHalfIcon,
  Sparkles,
  SparklesIcon,
  TagIcon,
  BellIcon,
  ReplyIcon,
} from "lucide-react";
import Image from "next/image";
import { BRAND_NAME } from "@/utils/branding";

type Side = "left" | "right";

export function FeaturesHome() {
  return (
    <>
      <FeaturesAiAssistant />
      <FeaturesReplyZero imageSide="right" />
      <FeaturesUnsubscribe />
      <FeaturesColdEmailBlocker imageSide="right" />
      <FeaturesStats />
    </>
  );
}

export function FeaturesWithImage({
  imageSide = "left",
  title,
  subtitle,
  description,
  image,
  features,
}: {
  imageSide?: "left" | "right";
  title: string;
  subtitle: string;
  description: React.ReactNode;
  image: string;
  features: {
    name: string;
    description: string;
    icon: LucideIcon;
  }[];
}) {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div
            className={clsx(
              "lg:pt-4",
              imageSide === "left"
                ? "lg:ml-auto lg:pl-4"
                : "lg:mr-auto lg:pr-4",
            )}
          >
            <div className="lg:max-w-lg">
              <h2 className="font-title text-base leading-7 text-blue-600">
                {title}
              </h2>
              <p className="mt-2 font-title text-3xl text-gray-900 sm:text-4xl">
                {subtitle}
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                {description}
              </p>
              {!!features.length && (
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        <feature.icon
                          className="absolute left-1 top-1 h-5 w-5 text-blue-600"
                          aria-hidden="true"
                        />
                        {feature.name}
                      </dt>{" "}
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
          <div
            className={clsx(
              "flex items-start",
              imageSide === "left"
                ? "justify-end lg:order-first"
                : "justify-start lg:order-last",
            )}
          >
            <div className="rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4">
              <Image
                src={image}
                alt="Ảnh chụp màn hình sản phẩm"
                className="w-[48rem] max-w-none rounded-xl shadow-2xl ring-1 ring-gray-400/10 sm:w-[57rem]"
                width={2400}
                height={1800}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesAiAssistant({ imageSide }: { imageSide?: Side }) {
  const title = "Trợ lý Cá nhân của Bạn";
  const subtitle = "Trợ lý Email AI Hoạt động Như Phép màu";
  const description = (
    <>
      Tất cả lợi ích của một trợ lý cá nhân với chi phí chỉ bằng một phần nhỏ.
      Nó soạn thảo câu trả lời, sắp xếp và gắn nhãn email cho bạn.
      <br />
      <br />
      Hãy nói cho trợ lý AI biết cách quản lý email của bạn bằng ngôn ngữ tự
      nhiên – giống như cách bạn dùng ChatGPT. Muốn lưu trữ và gắn nhãn bản tin?
      Đánh dấu các email quan trọng từ nhà đầu tư? Tự động soạn bản nháp cho các
      yêu cầu phổ biến? Chỉ cần yêu cầu.
      <br />
      <br />
      Sau khi được định cấu hình, trợ lý của bạn sẽ làm việc 24/7 để giữ cho hộp
      thư luôn ngăn nắp đúng như ý bạn. Không còn bị quá tải email. Không cần
      trợ lý là người thực đắt đỏ.
    </>
  );

  return (
    <FeaturesWithImage
      imageSide={imageSide}
      title={title}
      subtitle={subtitle}
      description={description}
      features={[]}
      image="/images/home/ai-email-assistant.png"
    />
  );
}

const featuresColdEmailBlocker = [
  {
    name: "Loại bỏ tiếng ồn",
    description:
      "Tự động lưu trữ hoặc gắn nhãn các email quảng cáo không mong muốn. Giữ cho hộp thư của bạn sạch sẽ và tập trung vào những điều quan trọng.",
    icon: ShieldHalfIcon,
  },
  {
    name: "Điều chỉnh lời nhắc email quảng cáo",
    description: `Cho ${BRAND_NAME} biết điều gì tạo nên một email quảng cáo đối với bạn. Nó sẽ chặn chúng dựa trên chỉ dẫn của bạn.`,
    icon: SparklesIcon,
  },
  {
    name: "Gắn nhãn email quảng cáo",
    description:
      "Tự động gắn nhãn các email quảng cáo để bạn có thể xem lại sau. Giữ cho hộp thư của bạn sạch sẽ và tập trung vào những điều quan trọng.",
    icon: TagIcon,
  },
];

export function FeaturesColdEmailBlocker({ imageSide }: { imageSide?: Side }) {
  const subtitle = "Không bao giờ phải đọc email quảng cáo nữa";
  const description =
    "Nói lời tạm biệt với những tiếp cận không mong muốn. Tự động lọc các email chào hàng và quảng cáo để bạn chỉ thấy những tin nhắn quan trọng.";

  return (
    <FeaturesWithImage
      imageSide={imageSide}
      title="Trình chặn Email Quảng cáo"
      subtitle={subtitle}
      description={description}
      image="/images/home/cold-email-blocker.png"
      features={featuresColdEmailBlocker}
    />
  );
}

const featuresStats = [
  {
    name: "Ai gửi email cho bạn nhiều nhất",
    description:
      "Ai đó đang gửi email quá nhiều cho bạn? Hãy tìm ra kế hoạch để xử lý việc này tốt hơn.",
    icon: Sparkles,
  },
  {
    name: "Bạn gửi email cho ai nhiều nhất",
    description:
      "Nếu có một người mà bạn liên tục liên lạc, liệu có cách nào giao tiếp tốt hơn không?",
    icon: Orbit,
  },
  {
    name: "Loại email bạn nhận được",
    description:
      "Bạn nhận được nhiều bản tin hoặc email quảng cáo? Hãy thử tự động lưu trữ và gắn nhãn chúng bằng AI của chúng tôi.",
    icon: LineChart,
  },
];

export function FeaturesStats({ imageSide }: { imageSide?: Side }) {
  return (
    <FeaturesWithImage
      imageSide={imageSide}
      title="Phân tích Email"
      subtitle="Cái gì đo lường được thì quản lý được"
      description="Hiểu rõ hộp thư của bạn là bước đầu tiên để xử lý nó. Hãy tìm hiểu điều gì đang làm đầy hộp thư của bạn, sau đó đưa ra kế hoạch hành động để giải quyết."
      image="/images/home/email-analytics.png"
      features={featuresStats}
    />
  );
}

const featuresUnsubscribe = [
  {
    name: "Hủy đăng ký chỉ với một cú nhấp chuột",
    description:
      "Đừng tìm nút hủy đăng ký nữa. Hủy đăng ký chỉ với một cú nhấp chuột, hoặc tự động lưu trữ thay thế.",
    icon: MousePointer2Icon,
  },
  {
    name: "Xem ai gửi email cho bạn nhiều nhất",
    description:
      "Xem ai đang gửi cho bạn nhiều email nhất để ưu tiên xem nên hủy đăng ký từ ai.",
    icon: EyeIcon,
  },
  {
    name: "Bạn đọc chúng thường xuyên như thế nào",
    description:
      "Xem tỷ lệ phần trăm email bạn đọc từ mỗi người gửi. Hủy đăng ký khỏi những người bạn không đọc.",
    icon: BarChart2Icon,
  },
];

export function FeaturesUnsubscribe({ imageSide }: { imageSide?: Side }) {
  return (
    <FeaturesWithImage
      imageSide={imageSide}
      title="Trình hủy đăng ký hàng loạt"
      subtitle="Hủy đăng ký hàng loạt khỏi những email bạn không bao giờ đọc"
      description="Hủy đăng ký khỏi các bản tin và email tiếp thị chỉ với một cú nhấp chuột. Chúng tôi hiển thị cho bạn những email bạn không bao giờ đọc để giúp việc này dễ dàng hơn."
      image="/images/home/bulk-unsubscriber.png"
      features={featuresUnsubscribe}
    />
  );
}

const featuresReplyZero = [
  {
    name: "Các bản nháp đã soạn sẵn",
    description:
      "Bản nháp do AI soạn sẵn đang chờ trong Gmail hoặc Outlook, sẵn sàng để gửi hoặc tùy chỉnh.",
    icon: ReplyIcon,
  },
  {
    name: "Tập trung vào những gì cần phản hồi",
    description:
      "Chúng tôi gắn nhãn mọi email cần phản hồi, giúp bạn dễ dàng tập trung vào những email quan trọng.",
    icon: EyeIcon,
  },
  {
    name: "Nhắc nhở theo dõi",
    description:
      "Không bao giờ mất dấu các cuộc hội thoại. Chúng tôi gắn nhãn các email đang chờ phản hồi và giúp bạn lọc những email đã quá hạn.",
    icon: BellIcon,
  },
  {
    name: "Theo dõi chỉ với một cú nhấp chuột",
    description:
      "Gửi những lời nhắc lịch sự một cách dễ dàng. AI của chúng tôi sẽ soạn tin nhắn theo dõi, giúp cuộc hội thoại luôn được tiếp tục.",
    icon: SparklesIcon,
  },
];

export function FeaturesReplyZero({ imageSide }: { imageSide?: Side }) {
  return (
    <FeaturesWithImage
      imageSide={imageSide}
      title="Phản hồi Zero"
      subtitle="Các bản nháp soạn sẵn đang chờ trong hộp thư của bạn"
      description="Chỉ tập trung vào những email cần sự chú ý của bạn. Phản hồi Zero nhận diện chúng và chuẩn bị các bản nháp, giúp bạn bỏ qua những thứ gây nhiễu và phản hồi nhanh hơn."
      image="/images/home/reply-zero.png"
      features={featuresReplyZero}
    />
  );
}
