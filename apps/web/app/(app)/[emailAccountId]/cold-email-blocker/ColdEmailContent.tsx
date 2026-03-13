"use client";

import { ColdEmailList } from "@/app/(app)/[emailAccountId]/cold-email-blocker/ColdEmailList";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ColdEmailRejected } from "@/app/(app)/[emailAccountId]/cold-email-blocker/ColdEmailRejected";
import { ColdEmailTest } from "@/app/(app)/[emailAccountId]/cold-email-blocker/ColdEmailTest";
import { Button } from "@/components/ui/button";
import { prefixPath } from "@/utils/path";
import { useAccount } from "@/providers/EmailAccountProvider";
import Link from "next/link";
import { MessageText } from "@/components/Typography";

export function ColdEmailContent({ searchParam }: { searchParam?: string }) {
  const { emailAccountId } = useAccount();

  return (
    <Tabs defaultValue="cold-emails" searchParam={searchParam}>
      <TabsList>
        <TabsTrigger value="cold-emails">Email tiếp thị</TabsTrigger>
        <TabsTrigger value="rejected">
          Đã đánh dấu không phải tiếp thị
        </TabsTrigger>
        <TabsTrigger value="test">Kiểm tra</TabsTrigger>
        <TabsTrigger value="settings">Cài đặt</TabsTrigger>
      </TabsList>

      <TabsContent value="test" className="mb-10">
        <ColdEmailTest />
      </TabsContent>

      <TabsContent value="cold-emails" className="mb-10">
        <Card>
          <ColdEmailList />
        </Card>
      </TabsContent>
      <TabsContent value="rejected" className="mb-10">
        <Card>
          <ColdEmailRejected />
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="mb-10">
        <MessageText className="my-4">
          Để quản lý cài đặt email tiếp thị, hãy vào tab Quy tắc trợ lý
          (Assistant Rules) và bấm Chỉnh sửa ở quy tắc Email tiếp thị (Cold
          Email).
        </MessageText>
        <Button asChild variant="outline">
          <Link href={prefixPath(emailAccountId, "/automation?tab=rules")}>
            Đi tới tab Quy tắc trợ lý
          </Link>
        </Button>
      </TabsContent>
    </Tabs>
  );
}
