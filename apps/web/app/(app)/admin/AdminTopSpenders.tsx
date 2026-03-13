"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingContent } from "@/components/LoadingContent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAdminTopSpenders } from "@/hooks/useAdminTopSpenders";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function AdminTopSpenders() {
  const { data, isLoading, error } = useAdminTopSpenders();
  const topSpenders = data?.topSpenders ?? [];

  return (
    <Card className="max-w-5xl">
      <CardHeader>
        <CardTitle>Người dùng tốn chi phí nhiều nhất</CardTitle>
        <CardDescription>
          7 ngày gần nhất (cùng cửa sổ với giới hạn chi tiêu). Nano-Limited cho
          biết ai hiện đang bị buộc dùng nano bởi cơ chế giới hạn chi tiêu
          Redis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoadingContent loading={isLoading} error={error}>
          {topSpenders.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Hạng</TableHead>
                  <TableHead>ID tài khoản email</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Nano-Limited</TableHead>
                  <TableHead className="text-right">Chi phí</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSpenders.map((spender, index) => (
                  <TableRow key={spender.email}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {spender.emailAccountId ?? "-"}
                    </TableCell>
                    <TableCell className="font-mono text-xs sm:text-sm">
                      {spender.email}
                    </TableCell>
                    <TableCell>
                      {spender.nanoLimitedBySpendGuard ? (
                        <Badge variant="red">Có</Badge>
                      ) : (
                        <Badge variant="green">Không</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {currencyFormatter.format(spender.cost)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              Không có chi phí sử dụng nào được ghi nhận trong 7 ngày qua.
            </p>
          )}
        </LoadingContent>
      </CardContent>
    </Card>
  );
}
