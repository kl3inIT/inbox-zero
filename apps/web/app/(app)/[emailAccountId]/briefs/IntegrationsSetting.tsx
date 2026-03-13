"use client";

import Link from "next/link";
import { SettingCard } from "@/components/SettingCard";
import { Button } from "@/components/ui/button";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useAccount } from "@/providers/EmailAccountProvider";
import { useIntegrationsEnabled } from "@/hooks/useFeatureFlags";

export function IntegrationsSetting() {
  const { emailAccountId } = useAccount();
  const { data } = useIntegrations();
  const integrationsEnabled = useIntegrationsEnabled();

  if (!integrationsEnabled) {
    return null;
  }

  const connectedIntegrations =
    data?.integrations.filter((i) => i.connection?.isActive && !i.comingSoon) ||
    [];

  const enabledToolsCount = connectedIntegrations.reduce(
    (count, i) =>
      count + (i.connection?.tools?.filter((t) => t.isEnabled).length || 0),
    0,
  );

  const hasConnectedIntegrations = connectedIntegrations.length > 0;

  return (
    <SettingCard
      title="Tích hợp"
      description={
        hasConnectedIntegrations
          ? `Đã kết nối với ${connectedIntegrations.map((i) => i.shortName || i.displayName).join(", ")} với ${enabledToolsCount} công cụ đang được bật`
          : "Kết nối với CRM, cơ sở dữ liệu và các công cụ khác để bổ sung thêm ngữ cảnh cho bản tóm tắt"
      }
      right={
        <Button variant="outline" asChild>
          <Link href={`/${emailAccountId}/integrations`}>
            {hasConnectedIntegrations ? "Quản lý" : "Kết nối"}
          </Link>
        </Button>
      }
    />
  );
}
