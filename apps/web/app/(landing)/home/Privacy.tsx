import Image from "next/image";

export function Privacy() {
  return (
    <div className="bg-white py-24" id="features">
      <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <div className="flex items-center gap-8">
          <Image
            src="/images/home/soc2.svg"
            alt="Tuân thủ SOC2 Type II"
            className="h-[120px] w-auto"
            width="200"
            height="120"
          />

          <Image
            src="/images/home/soc2.png"
            alt="Tuân thủ SOC2 Type II"
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
            Mã nguồn mở. Xem chính xác code của chúng tôi làm gì. Hoặc tự host.
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Dữ liệu của bạn không bao giờ được dùng để huấn luyện các mô hình AI
            đại trà, và chúng tôi duy trì các tiêu chuẩn bảo mật/quyền riêng tư
            ở mức cao nhất.
          </p>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Inbox Zero tuân thủ SOC2 và được phê duyệt CASA Tier 2. Sản phẩm đã
            trải qua quy trình kiểm tra bảo mật kỹ lưỡng với Google để đảm bảo
            an toàn cho email của bạn. Bạn thậm chí có thể tự host Inbox Zero
            trên hạ tầng của mình.
          </p>
        </div>
      </div>
    </div>
  );
}
