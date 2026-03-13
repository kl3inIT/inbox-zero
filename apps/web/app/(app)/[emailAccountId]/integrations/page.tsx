"use client";

import Link from "next/link";
import { ZapIcon } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import { PageHeader } from "@/components/PageHeader";
import { Integrations } from "@/app/(app)/[emailAccountId]/integrations/Integrations";
import { Button } from "@/components/ui/button";
import { ActionCard } from "@/components/ui/card";
import { RequestAccessDialog } from "./RequestAccessDialog";
import { usePremium } from "@/components/PremiumAlert";
import { hasTierAccess } from "@/utils/premium";
import { IntegrationsPremiumAlert } from "./IntegrationsPremiumAlert";
import { useIntegrationsEnabled } from "@/hooks/useFeatureFlags";

export default function IntegrationsPage() {
  const integrationsEnabled = useIntegrationsEnabled();
  const { tier } = usePremium();

  const hasAccess = hasTierAccess({
    tier: tier || null,
    minimumTier: "PLUS_MONTHLY",
  });

  if (!integrationsEnabled) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-between gap-2">
          <PageHeader
            title="Tích hợp"
            description="Kết nối với các dịch vụ bên ngoài để trợ lý AI soạn thư tốt hơn bằng cách truy cập dữ liệu liên quan từ các công cụ của bạn."
          />
        </div>

        <div className="mt-8">
          <ActionCard
            variant="blue"
            icon={<ZapIcon className="h-5 w-5" />}
            title="Tính năng tích hợp chưa được bật"
            description="Tính năng này đang được phát hành giới hạn. Tham gia chương trình dùng thử sớm để bật tích hợp cho tài khoản của bạn."
            action={
              <Button asChild variant="outline">
                <Link href="/early-access">Tham gia dùng thử sớm</Link>
              </Button>
            }
          />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex items-center justify-between gap-2">
        <PageHeader
          title="Tích hợp"
          description="Kết nối với các dịch vụ bên ngoài để trợ lý AI soạn thư tốt hơn bằng cách truy cập dữ liệu liên quan từ các công cụ của bạn."
        />
        {hasAccess && (
          <div className="shrink-0">
            <RequestAccessDialog
              trigger={<Button variant="outline">Yêu cầu tích hợp</Button>}
            />
          </div>
        )}
      </div>

      <div className="mt-8 space-y-4">
        {!hasAccess && <IntegrationsPremiumAlert />}
        <Integrations />
      </div>
    </PageWrapper>
  );
}
