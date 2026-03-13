import type { Metadata } from "next";
import Link from "next/link";
import { SectionDescription, TypographyH3 } from "@/components/Typography";
import { Footer } from "@/app/(landing)/home/Footer";
import { FinalCTA } from "@/app/(landing)/home/FinalCTA";
import { CardBasic } from "@/components/ui/card";
import {
  PageHeading,
  Paragraph,
} from "@/components/new-landing/common/Typography";
import { Button } from "@/components/new-landing/common/Button";
import { BlogHeader } from "@/components/layouts/BlogLayout";
import { getBrandTitle } from "@/utils/branding";

export const metadata: Metadata = {
  title: getBrandTitle("Bạn bè mã nguồn mở"),
  description: "Một số dự án mã nguồn mở tuyệt vời khác để bạn theo dõi",
  alternates: { canonical: "/oss-friends" },
};

type OSSFriend = {
  href: string;
  name: string;
  description: string;
};

export default async function OSSFriendsPage() {
  try {
    const res = await fetch("https://formbricks.com/api/oss-friends");
    const data: { data: OSSFriend[] } = await res.json();

    return (
      <>
        <BlogHeader />

        <div className="mx-auto mt-20 max-w-6xl pb-10">
          <div className="text-center">
            <PageHeading>Bạn bè mã nguồn mở</PageHeading>
            <Paragraph className="mt-4">
              Một số dự án mã nguồn mở tuyệt vời khác để bạn theo dõi
            </Paragraph>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.data?.map((friend) => {
              return (
                <CardBasic key={friend.name}>
                  <TypographyH3>
                    <Link href={friend.href}>{friend.name}</Link>
                  </TypographyH3>
                  <SectionDescription className="mt-4">
                    {friend.description}
                  </SectionDescription>
                  <div className="mt-4">
                    <Button asChild>
                      <Link href={friend.href} target="_blank">
                        Tìm hiểu thêm
                      </Link>
                    </Button>
                  </div>
                </CardBasic>
              );
            })}
          </div>
        </div>

        <FinalCTA />
        <Footer />
      </>
    );
  } catch (error) {
    console.error(error);
    return <div>Lỗi khi tải danh sách dự án mã nguồn mở</div>;
  }
}
