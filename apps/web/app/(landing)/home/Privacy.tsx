import Image from "next/image";

export function Privacy() {
  return (
    <div className="bg-white py-24" id="features">
      <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <div className="flex items-center gap-8">
          <Image
            src="/images/home/soc2.svg"
            alt="Tuân thủ SOC 2 Type II"
            className="h-[120px] w-auto"
            width="200"
            height="120"
          />

          <Image
            src="/images/home/soc2.png"
            alt="Tuân thủ SOC 2 Type II"
            className="h-[160px] w-auto"
            width="300"
            height="160"
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="font-title text-base leading-7 text-blue-600">
            Ưu tiên quyền riêng tư
          </h2>
          <p className="mt-2 font-title text-3xl text-gray-900 sm:text-4xl">
            Email của bạn vẫn do bạn kiểm soát.
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Dữ liệu của bạn không được dùng để huấn luyện các mô hình AI đại
            trà, và FocusMail luôn duy trì tiêu chuẩn cao về bảo mật, quyền
            riêng tư và kiểm soát truy cập.
          </p>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            FocusMail tuân thủ SOC 2 và được phê duyệt CASA Tier 2. Chúng tôi
            thiết kế sản phẩm theo triết lý human-in-the-loop, nghĩa là AI hỗ
            trợ bạn xử lý email nhanh hơn nhưng người dùng vẫn là người kiểm
            duyệt và quyết định cuối cùng.
          </p>
        </div>
      </div>
    </div>
  );
}
