"use client";

import { PageWrapper } from "@/components/PageWrapper";
import { PageHeader } from "@/components/PageHeader";
import { SettingCard } from "@/components/SettingCard";
import { Toggle } from "@/components/Toggle";
import { toastSuccess, toastError } from "@/components/Toast";
import { LoadingContent } from "@/components/LoadingContent";
import { PremiumAlertWithData } from "@/components/PremiumAlert";
import { useCalendars } from "@/hooks/useCalendars";
import { useAccount } from "@/providers/EmailAccountProvider";
import { useAction } from "next-safe-action/hooks";
import { updateMeetingBriefsEnabledAction } from "@/utils/actions/meeting-briefs";
import { useMeetingBriefSettings } from "@/hooks/useMeetingBriefs";
import { TimeDurationSetting } from "@/app/(app)/[emailAccountId]/briefs/TimeDurationSetting";
import { UpcomingMeetings } from "@/app/(app)/[emailAccountId]/briefs/UpcomingMeetings";
import { BriefsOnboarding } from "@/app/(app)/[emailAccountId]/briefs/Onboarding";
import { IntegrationsSetting } from "@/app/(app)/[emailAccountId]/briefs/IntegrationsSetting";
import { DeliveryChannelsSetting } from "@/app/(app)/[emailAccountId]/briefs/DeliveryChannelsSetting";

export default function MeetingBriefsPage() {
  const { emailAccountId } = useAccount();
  const { data: calendarsData, isLoading: isLoadingCalendars } = useCalendars();
  const { data, isLoading, error, mutate } = useMeetingBriefSettings();

  const hasCalendarConnected =
    calendarsData?.connections && calendarsData.connections.length > 0;

  const { execute, status } = useAction(
    updateMeetingBriefsEnabledAction.bind(null, emailAccountId),
    {
      onSuccess: () => {
        toastSuccess({ description: "Đã lưu cài đặt!" });
        mutate();
      },
      onError: () => {
        toastError({ description: "Lưu cài đặt không thành công" });
      },
    },
  );

  if (isLoadingCalendars || isLoading || error) {
    return (
      <PageWrapper>
        <LoadingContent loading={isLoadingCalendars || isLoading} error={error}>
          <div />
        </LoadingContent>
      </PageWrapper>
    );
  }

  if (!hasCalendarConnected || !data?.enabled) {
    return (
      <BriefsOnboarding
        emailAccountId={emailAccountId}
        hasCalendarConnected={hasCalendarConnected}
        onEnable={() => execute({ enabled: true })}
        isEnabling={status === "executing"}
      />
    );
  }

  return (
    <PageWrapper>
      <PageHeader title="Bản tóm tắt cuộc họp" />

      <div className="mt-4 space-y-4 max-w-3xl">
        <PremiumAlertWithData />

        <LoadingContent loading={isLoading} error={error}>
          <div className="space-y-2">
            <SettingCard
              title="Bật bản tóm tắt cuộc họp"
              description="Nhận email tóm tắt trước các cuộc họp với khách mời bên ngoài"
              right={
                <Toggle
                  name="enabled"
                  enabled={!!data?.enabled}
                  onChange={(enabled) => execute({ enabled })}
                  disabled={!hasCalendarConnected}
                />
              }
            />

            {!!data?.enabled && (
              <>
                <SettingCard
                  title="Gửi bản tóm tắt trước cuộc họp"
                  description="Thời gian gửi bản tóm tắt trước khi cuộc họp bắt đầu"
                  collapseOnMobile
                  right={
                    <TimeDurationSetting
                      initialMinutes={data?.minutesBefore ?? 240}
                      onSaved={mutate}
                    />
                  }
                />

                <DeliveryChannelsSetting />

                <IntegrationsSetting />
              </>
            )}
          </div>
        </LoadingContent>

        {!!data?.enabled && hasCalendarConnected && (
          <div className="mt-8">
            <UpcomingMeetings emailAccountId={emailAccountId} />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
