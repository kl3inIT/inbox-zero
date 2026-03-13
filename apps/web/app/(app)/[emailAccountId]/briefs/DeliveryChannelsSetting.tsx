"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MailIcon,
  HashIcon,
  LockIcon,
  MessageCircleIcon,
  type MessageSquareIcon,
  SendIcon,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/Toggle";
import { toastSuccess, toastError } from "@/components/Toast";
import { LoadingContent } from "@/components/LoadingContent";
import { MutedText } from "@/components/Typography";
import { useAccount } from "@/providers/EmailAccountProvider";
import { useMeetingBriefSettings } from "@/hooks/useMeetingBriefs";
import {
  useMessagingChannels,
  useChannelTargets,
} from "@/hooks/useMessagingChannels";
import {
  updateSlackChannelAction,
  updateChannelFeaturesAction,
  updateEmailDeliveryAction,
} from "@/utils/actions/messaging-channels";
import { getActionErrorMessage } from "@/utils/error";
import { prefixPath } from "@/utils/path";
import type { MessagingProvider } from "@/generated/prisma/enums";

const PROVIDER_CONFIG: Record<
  MessagingProvider,
  {
    name: string;
    icon: typeof MessageSquareIcon;
    targetPrefix?: string;
    supportsBriefTargetSelection: boolean;
  }
> = {
  SLACK: {
    name: "Slack",
    icon: HashIcon,
    targetPrefix: "#",
    supportsBriefTargetSelection: true,
  },
  TEAMS: {
    name: "Teams",
    icon: MessageCircleIcon,
    supportsBriefTargetSelection: false,
  },
  TELEGRAM: {
    name: "Telegram",
    icon: SendIcon,
    supportsBriefTargetSelection: false,
  },
};

export function DeliveryChannelsSetting() {
  const { emailAccountId } = useAccount();
  const {
    data: briefSettings,
    isLoading: isLoadingBriefSettings,
    mutate: mutateBriefSettings,
  } = useMeetingBriefSettings();
  const {
    data: channelsData,
    isLoading: isLoadingChannels,
    error: channelsError,
    mutate: mutateChannels,
  } = useMessagingChannels();

  const { execute: executeEmailDelivery } = useAction(
    updateEmailDeliveryAction.bind(null, emailAccountId),
    {
      onSuccess: () => {
        toastSuccess({ description: "Đã lưu cài đặt" });
        mutateBriefSettings();
      },
      onError: (error) => {
        toastError({
          description:
            getActionErrorMessage(error.error) ?? "Cập nhật không thành công",
        });
      },
    },
  );

  const connectedChannels =
    channelsData?.channels.filter((c) => c.isConnected) ?? [];

  const hasSlack = connectedChannels.some((c) => c.provider === "SLACK");
  const slackAvailable =
    channelsData?.availableProviders?.includes("SLACK") ?? false;

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-medium">Kênh nhận bản tóm tắt</h3>
          <MutedText>Chọn nơi bạn muốn nhận bản tóm tắt cuộc họp</MutedText>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <MailIcon className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 font-medium text-sm">Email</div>
            <Toggle
              name="emailDelivery"
              enabled={briefSettings?.meetingBriefsSendEmail ?? true}
              disabled={isLoadingBriefSettings}
              onChange={(sendEmail) => executeEmailDelivery({ sendEmail })}
            />
          </div>

          <LoadingContent loading={isLoadingChannels} error={channelsError}>
            {connectedChannels.map((channel) => (
              <ChannelRow
                key={channel.id}
                channel={channel}
                emailAccountId={emailAccountId}
                onUpdate={mutateChannels}
              />
            ))}
          </LoadingContent>

          {!isLoadingChannels && !hasSlack && slackAvailable && (
            <MutedText className="text-xs">
              Bạn muốn nhận bản tóm tắt qua Slack?{" "}
              <Link
                href={prefixPath(emailAccountId, "/settings")}
                className="underline text-foreground"
              >
                Kết nối Slack trong phần Cài đặt
              </Link>
            </MutedText>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ChannelRow({
  channel,
  emailAccountId,
  onUpdate,
}: {
  channel: {
    id: string;
    provider: MessagingProvider;
    channelId: string | null;
    channelName: string | null;
    sendMeetingBriefs: boolean;
  };
  emailAccountId: string;
  onUpdate: () => void;
}) {
  const config = PROVIDER_CONFIG[channel.provider];
  const Icon = config.icon;
  const [selectingTarget, setSelectingTarget] = useState(!channel.channelId);
  const supportsBriefTargetSelection = config.supportsBriefTargetSelection;

  const {
    data: targetsData,
    isLoading: isLoadingTargets,
    error: targetsError,
  } = useChannelTargets(
    supportsBriefTargetSelection && selectingTarget ? channel.id : null,
    emailAccountId,
  );

  const privateTargets = targetsData?.targets.filter((t) => t.isPrivate);

  const { execute: executeTarget } = useAction(
    updateSlackChannelAction.bind(null, emailAccountId),
    {
      onSuccess: () => {
        toastSuccess({ description: "Đã cập nhật kênh Slack" });
        setSelectingTarget(false);
        onUpdate();
      },
      onError: (error) => {
        toastError({
          description:
            getActionErrorMessage(error.error) ?? "Cập nhật không thành công",
        });
      },
    },
  );

  const { execute: executeFeatures } = useAction(
    updateChannelFeaturesAction.bind(null, emailAccountId),
    {
      onSuccess: () => {
        toastSuccess({ description: "Đã lưu cài đặt" });
        onUpdate();
      },
      onError: (error) => {
        toastError({
          description:
            getActionErrorMessage(error.error) ?? "Cập nhật không thành công",
        });
      },
    },
  );

  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div className="flex-1">
        {supportsBriefTargetSelection ? (
          !channel.channelId || selectingTarget ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{config.name}</span>
                <Select
                  onValueChange={(value) => {
                    const target = privateTargets?.find((t) => t.id === value);
                    if (target) {
                      executeTarget({
                        channelId: channel.id,
                        targetId: target.id,
                      });
                    }
                  }}
                  disabled={isLoadingTargets || !!targetsError}
                >
                  <SelectTrigger className="h-8 w-48 text-xs">
                    <SelectValue
                      placeholder={
                        targetsError
                          ? "Không tải được danh sách kênh"
                          : isLoadingTargets
                            ? "Đang tải danh sách kênh..."
                            : "Chọn kênh riêng tư"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {privateTargets?.map((target) => (
                      <SelectItem key={target.id} value={target.id}>
                        <LockIcon className="inline h-3 w-3 mr-1" />
                        {target.name}
                      </SelectItem>
                    ))}
                    {!isLoadingTargets &&
                      privateTargets &&
                      privateTargets.length === 0 && (
                        <div className="px-2 py-1.5 text-xs text-muted-foreground">
                          Không tìm thấy kênh riêng tư. Hãy tạo một kênh riêng
                          tư và mời bot vào trước.
                        </div>
                      )}
                  </SelectContent>
                </Select>
              </div>
              {!isLoadingTargets && (
                <MutedText className="text-xs">
                  Chọn một kênh để nhận bản tóm tắt cuộc họp. Tạo một kênh Slack
                  riêng tư, sau đó gõ{" "}
                  <code className="bg-muted px-1 rounded">
                    /invite @InboxZero
                  </code>{" "}
                  trong kênh. Kênh sẽ xuất hiện ở trên sau khi bot được mời.
                </MutedText>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="font-medium text-sm text-left hover:underline"
              onClick={() => setSelectingTarget(true)}
              title="Đổi kênh"
            >
              {config.name}{" "}
              <span className="text-muted-foreground font-normal">
                &middot; {config.targetPrefix}
                {channel.channelName}
              </span>
            </button>
          )
        ) : (
          <div className="space-y-1">
            <span className="font-medium text-sm">{config.name}</span>
            <MutedText className="text-xs">
              Hiện tại chỉ hỗ trợ chọn nơi nhận bản tóm tắt cho Slack.
            </MutedText>
          </div>
        )}
      </div>

      {supportsBriefTargetSelection &&
        channel.channelId &&
        !selectingTarget && (
          <Toggle
            name={`briefs-${channel.id}`}
            enabled={channel.sendMeetingBriefs}
            onChange={(sendMeetingBriefs) =>
              executeFeatures({
                channelId: channel.id,
                sendMeetingBriefs,
              })
            }
          />
        )}
    </div>
  );
}
