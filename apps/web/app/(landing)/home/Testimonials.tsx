"use client";

import clsx from "clsx";
import Image from "next/image";
import Script from "next/script";
import { useTestimonialsVariant } from "@/hooks/useFeatureFlags";
import { BRAND_NAME } from "@/utils/branding";

type Testimonial = {
  body: string;
  author: {
    name: string;
    handle: string;
    imageUrl: string;
  };
};

const featuredTestimonial = {
  body: "Rất ưng! Tôi đã dọn sạch các bản tin và email khuyến mãi gây rối nhất chỉ trong vài phút.",
  author: {
    name: "Jonni Lundy",
    handle: "Resend",
    imageUrl: "/images/testimonials/jonnilundy.jpg",
    logoUrl: "/images/logos/resend.svg",
  },
};

const stevenTestimonial: Testimonial = {
  body: "Rất thích ứng dụng mã nguồn mở mới này của @elie2222: getinboxzero.com",
  author: {
    name: "Steven Tey",
    handle: "Dub",
    imageUrl: "/images/testimonials/steventey.jpg",
  },
};

const vinayTestimonial: Testimonial = {
  body: "Đây chính là thứ tôi đã tìm kiếm từ rất lâu — cảm ơn vì đã xây dựng nó.",
  author: {
    name: "Vinay Katiyar",
    handle: "@ktyr",
    imageUrl:
      "https://ph-avatars.imgix.net/2743360/28744c72-2267-49ed-999d-5bdab677ec28?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2",
  },
};

const yoniTestimonial: Testimonial = {
  body: "Wow. Tôi onboard và bắt đầu hủy đăng ký khỏi các nguồn spam tệ nhất chỉ trong 3 phút... Cảm ơn 🙏🏼",
  author: {
    name: "Yoni Belson",
    handle: "LeadTrap",
    imageUrl: "/images/testimonials/yoni.jpeg",
  },
};

const slimTestimonial: Testimonial = {
  body: "Tôi biết tới Inbox Zero khi đang tìm thuê trợ lý ảo để quản lý email, nhưng sau khi dùng thử công cụ này, nó thực sự thay đổi cuộc chơi.",
  author: {
    name: "Slim Labassi",
    handle: "Boomgen",
    imageUrl: "/images/testimonials/slim.png",
  },
};

const willTestimonial: Testimonial = {
  body: "Tôi rất thích tính linh hoạt và khả năng tùy chỉnh; đây là công cụ đầu tiên sau rất lâu giúp hộp thư của tôi vào khuôn. Cảm ơn!",
  author: {
    name: "Will Brierly",
    handle: "DreamKey",
    imageUrl: "/images/testimonials/will.jpeg",
  },
};

const valentineTestimonial: Testimonial = {
  body: "Tôi là một quản lý, từng ngập trong hàng trăm email mỗi ngày và phụ thuộc nhiều vào trợ lý điều hành để xử lý email. Điều tôi thích nhất ở Inbox Zero là nó thay thế liền mạch toàn bộ vai trò đó—các tính năng tự động hóa, ưu tiên và sắp xếp thông minh hoạt động như một trợ lý email chuyên biệt ngay trong quy trình làm việc của tôi.",
  author: {
    name: "Valentine Nwachukwu",
    handle: "Zaden Technologies",
    imageUrl: "/images/testimonials/valentine.png",
  },
};

const joelTestimonial: Testimonial = {
  body: "Đây là công cụ đầu tiên trong rất nhiều công cụ tôi thử có thể nắm được đúng giọng văn của tôi trong các phản hồi mà nó soạn.",
  author: {
    name: "Joel Neuenhaus",
    handle: "Outbound Legal",
    imageUrl: "/images/testimonials/joel.jpeg",
  },
};

const alexTestimonial: Testimonial = {
  body: "Cực kỳ hào hứng với công cụ này! Làm rất tốt, chắc chắn tôi sẽ dùng thường xuyên—tôi đã chờ một công cụ như vậy từ lâu, rất hợp lý khi có một lớp hỗ trợ nằm trên email.",
  author: {
    name: "Alex Bass",
    handle: "Efficient App",
    imageUrl:
      "https://ph-avatars.imgix.net/3523155/original?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2",
  },
};

const jamesTestimonial: Testimonial = {
  body: "Này bạn, công cụ của bạn đúng là thứ tôi tìm kiếm bao năm nay haha. Nó đúng là cứu tinh.",
  author: {
    name: "James",
    handle: "@james",
    imageUrl: "/images/testimonials/midas-hofstra-a6PMA5JEmWE-unsplash.jpg",
  },
};

const steveTestimonial: Testimonial = {
  body: "Mục tiêu của tôi chỉ là làm hộp thư bớt hỗn loạn hơn. Tôi từng bỏ sót nhiều việc cần làm vì email bị chôn vùi. Đến giờ thì công cụ này giúp rất nhiều.",
  author: {
    name: "Steve Radabaugh",
    handle: "@stevenpaulr",
    imageUrl: "/images/home/testimonials/steve-rad.png",
  },
};

const wilcoTestimonial: Testimonial = {
  body: "Cuối cùng cũng có một “ứng dụng hủy đăng ký” cho phép bạn *thực sự* hủy đăng ký và lọc bằng bộ lọc Gmail (thay vì luôn phải phụ thuộc ứng dụng bên thứ ba để lọc email đó). Đây là điểm cộng lớn với tôi vì tôi có tất cả bộ lọc ở một chỗ (ngay trong Gmail filters). Làm quá tốt! Tôi là fan rồi :)",
  author: {
    name: "Wilco de Kreij",
    handle: "@emarky",
    imageUrl:
      "https://ph-avatars.imgix.net/28450/8c4c8039-003a-4b3f-80ec-7035cedb6ac3?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=120&h=120&fit=crop&dpr=2",
  },
};

const desktopTestimonials: Testimonial[][][] = [
  [
    [stevenTestimonial, joelTestimonial, willTestimonial, vinayTestimonial],
    [slimTestimonial, alexTestimonial],
  ],
  [
    [valentineTestimonial, steveTestimonial],
    [yoniTestimonial, wilcoTestimonial, jamesTestimonial],
  ],
];

const mobileTestimonials: Testimonial[] = [
  joelTestimonial,
  valentineTestimonial,
  stevenTestimonial,
  yoniTestimonial,
  slimTestimonial,
  alexTestimonial,
  willTestimonial,
];

export function Testimonials() {
  const variant = useTestimonialsVariant();

  return (
    <div className="relative isolate bg-white pb-20 pt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-600">
            {`Yêu thích ${BRAND_NAME}`}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tham gia cùng hàng ngàn người dành ít thời gian hơn cho email
          </p>
        </div>

        {variant === "senja-widget" ? (
          <SenjaWidgetContent />
        ) : (
          <TestimonialsContent />
        )}
      </div>
    </div>
  );
}

function TestimonialsContent() {
  return (
    <>
      {/* Mobile */}
      <div className="mx-auto mt-16 grid max-w-2xl gap-4 text-sm leading-6 text-gray-900 sm:hidden">
        {mobileTestimonials.map((testimonial) => (
          <figure
            key={testimonial.author.name}
            className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5"
          >
            <blockquote className="text-gray-900">
              <p>{`"${testimonial.body}"`}</p>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-x-4">
              <Image
                className="h-10 w-10 rounded-full bg-gray-50"
                src={testimonial.author.imageUrl}
                alt={testimonial.author.name}
                width={40}
                height={40}
              />
              <div>
                <div className="font-semibold">{testimonial.author.name}</div>
                {testimonial.author.handle ? (
                  <div className="text-gray-600">
                    {testimonial.author.handle}
                  </div>
                ) : undefined}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Desktop */}
      <div className="mx-auto mt-16 hidden max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
        <figure className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 sm:col-span-2 xl:col-start-2 xl:row-end-1">
          <blockquote className="p-6 text-lg font-semibold leading-7 tracking-tight text-gray-900 sm:p-12 sm:text-xl sm:leading-8">
            <p>{`"${featuredTestimonial.body}"`}</p>
          </blockquote>
          <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-4 border-t border-gray-900/10 px-6 py-4 sm:flex-nowrap">
            <Image
              className="h-10 w-10 flex-none rounded-full bg-gray-50"
              src={featuredTestimonial.author.imageUrl}
              alt={featuredTestimonial.author.name}
              width={40}
              height={40}
            />
            <div className="flex-auto">
              <div className="font-semibold">
                {featuredTestimonial.author.name}
              </div>
              <div className="text-gray-600">
                {featuredTestimonial.author.handle}
              </div>
            </div>
            <Image
              className="h-8 w-auto flex-none"
              src={featuredTestimonial.author.logoUrl}
              alt=""
              height={32}
              width={98}
              unoptimized
            />
          </figcaption>
        </figure>

        {desktopTestimonials.map((columnGroup, columnGroupIdx) => (
          <div
            key={columnGroupIdx}
            className="space-y-8 xl:contents xl:space-y-0"
          >
            {columnGroup.map((column, columnIdx) => (
              <div
                key={columnIdx}
                className={clsx(
                  (columnGroupIdx === 0 && columnIdx === 0) ||
                    (columnGroupIdx === desktopTestimonials.length - 1 &&
                      columnIdx === columnGroup.length - 1)
                    ? "xl:row-span-2"
                    : "xl:row-start-1",
                  "space-y-8",
                )}
              >
                {column.map((testimonial) => (
                  <figure
                    key={testimonial.author.handle}
                    className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5"
                  >
                    <blockquote className="text-gray-900">
                      <p>{`"${testimonial.body}"`}</p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-x-4">
                      <Image
                        className="h-10 w-10 rounded-full bg-gray-50"
                        src={testimonial.author.imageUrl}
                        alt=""
                        width={40}
                        height={40}
                      />
                      <div>
                        <div className="font-semibold">
                          {testimonial.author.name}
                        </div>
                        {testimonial.author.handle ? (
                          <div className="text-gray-600">
                            {testimonial.author.handle}
                          </div>
                        ) : undefined}
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function SenjaWidgetContent() {
  return (
    <div className="mt-16">
      <Script
        src="https://widget.senja.io/widget/321e14fc-aa08-41f8-8dfd-ed3cd75d1308/platform.js"
        strategy="lazyOnload"
      />
      <div
        className="senja-embed"
        data-id="321e14fc-aa08-41f8-8dfd-ed3cd75d1308"
        data-mode="shadow"
        data-lazyload="false"
        style={{ display: "block", width: "100%" }}
      />
    </div>
  );
}
