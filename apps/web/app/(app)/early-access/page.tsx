"use client";

import Link from "next/link";
import { EarlyAccessFeatures } from "@/app/(app)/early-access/EarlyAccessFeatures";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isGoogleProvider } from "@/utils/email/provider-types";
import { useAccount } from "@/providers/EmailAccountProvider";

export default function RequestAccessPage() {
  const { provider } = useAccount();

  return (
    <div className="container px-2 pt-2 sm:px-4 sm:pt-8">
      <div className="mx-auto max-w-2xl space-y-4 sm:space-y-8">
        <EarlyAccessFeatures />
        {isGoogleProvider(provider) && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Phân loại người gửi</CardTitle>
                <CardDescription>
                  Sender Categories là tính năng cho phép bạn phân loại email
                  theo người gửi và thực hiện các hành động hàng loạt hoặc áp
                  dụng quy tắc cho chúng.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/smart-categories">Phân loại người gửi</Link>
                </Button>
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader>
                <CardTitle>Bulk archive</CardTitle>
                <CardDescription>
                  Archive emails from multiple senders at once, organized by
                  category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/bulk-archive">Bulk Archive</Link>
                </Button>
              </CardContent>
            </Card> */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Quick bulk archive</CardTitle>
                <CardDescription>
                  Quickly archive emails from multiple senders at once, grouped
                  by AI confidence level.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/quick-bulk-archive">Quick Bulk Archive</Link>
                </Button>
              </CardContent>
            </Card> */}
          </>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Quyền truy cập sớm</CardTitle>
            <CardDescription>
              Hãy cho chúng tôi biết bạn muốn thấy những tính năng nào.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/waitlist" target="_blank">
                Biểu mẫu góp ý
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
