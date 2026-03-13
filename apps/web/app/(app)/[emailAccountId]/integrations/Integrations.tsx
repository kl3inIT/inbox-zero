"use client";

import { LoadingContent } from "@/components/LoadingContent";
import { TypographyP } from "@/components/Typography";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import { useIntegrations } from "@/hooks/useIntegrations";
import { IntegrationRow } from "@/app/(app)/[emailAccountId]/integrations/IntegrationRow";
import { Card } from "@/components/ui/card";

export function Integrations() {
  const { data, isLoading, error, mutate } = useIntegrations();

  const integrations = data?.integrations || [];

  return (
    <Card>
      <LoadingContent loading={isLoading} error={error}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Kết nối</TableHead>
              <TableHead className="hidden sm:table-cell">Công cụ</TableHead>
              <TableHead>Bật</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {integrations.length ? (
              integrations.map((integration) => (
                <IntegrationRow
                  key={integration.name}
                  integration={integration}
                  onConnectionChange={mutate}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <TypographyP>Không tìm thấy tích hợp nào</TypographyP>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </LoadingContent>
    </Card>
  );
}
