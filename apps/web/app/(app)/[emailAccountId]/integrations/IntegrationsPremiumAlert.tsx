"use client";

import { CrownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionCard } from "@/components/ui/card";
import { usePremiumModal } from "@/app/(app)/refer/premium/PremiumModal";

export function IntegrationsPremiumAlert() {
  const { PremiumModal, openModal } = usePremiumModal();

  return (
    <>
      <ActionCard
        icon={<CrownIcon className="h-5 w-5" />}
        title="Cần gói Plus"
        description="Kết nối CRM và các công cụ của bạn để trợ lý AI soạn thư tốt hơn và tạo báo cáo cuộc họp chi tiết hơn."
        action={
          <Button variant="primaryBlack" onClick={openModal}>
            Nâng cấp
          </Button>
        }
      />
      <PremiumModal />
    </>
  );
}
