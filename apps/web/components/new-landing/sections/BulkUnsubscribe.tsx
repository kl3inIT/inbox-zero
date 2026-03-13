import Image from "next/image";
import {
  Section,
  SectionContent,
} from "@/components/new-landing/common/Section";
import { CardWrapper } from "@/components/new-landing/common/CardWrapper";
import {
  SectionHeading,
  SectionSubtitle,
} from "@/components/new-landing/common/Typography";

export function BulkUnsubscribe() {
  return (
    <Section>
      <SectionHeading>
        Nhanh chóng đạt Inbox Zero.
        <br />
        Hủy đăng ký hàng loạt những email bạn không bao giờ đọc.
      </SectionHeading>
      <SectionSubtitle>
        Xem những email bạn không đọc và chỉ với một cú nhấp để hủy đăng ký và
        lưu trữ chúng.
      </SectionSubtitle>
      <SectionContent className="flex justify-center items-center">
        <CardWrapper
          padding="xs"
          rounded="md"
          className="hidden md:block md:mx-20 lg:mx-40 xl:mx-52"
        >
          <Image
            src="/images/new-landing/bulk-unsubscribe.png"
            alt="bulk unsubscribe"
            width={1000}
            height={1000}
          />
        </CardWrapper>
        <div className="flex flex-col gap-2">
          <CardWrapper padding="xs" rounded="md" className="block md:hidden">
            <Image
              src="/images/new-landing/bulk-unsubscribe-mobile.png"
              alt="bulk unsubscribe"
              width={1000}
              height={1000}
            />
          </CardWrapper>
        </div>
      </SectionContent>
    </Section>
  );
}
