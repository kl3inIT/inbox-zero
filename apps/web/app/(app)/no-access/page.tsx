import Link from "next/link";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NoAccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Không có quyền truy cập
          </CardTitle>
          <CardDescription>
            Không tìm thấy tài khoản email hoặc bạn không có quyền truy cập.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/accounts">Xem các tài khoản</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
