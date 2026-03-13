"use client";

import { MailIcon, LightbulbIcon, UserSearchIcon } from "lucide-react";
import { SetupCard } from "@/components/SetupCard";
import { MessageText } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { ConnectCalendar } from "@/app/(app)/[emailAccountId]/calendars/ConnectCalendar";

const features = [
  {
    icon: <UserSearchIcon className="size-4 text-blue-500" />,
    title: "Tìm hiểu người tham dự",
    description: "Họ là ai, công ty và vai trò của họ",
  },
  {
    icon: <MailIcon className="size-4 text-blue-500" />,
    title: "Lịch sử email",
    description: "Các cuộc trao đổi gần đây với người này",
  },
  {
    icon: <LightbulbIcon className="size-4 text-blue-500" />,
    title: "Bối cảnh quan trọng",
    description: "Những chi tiết quan trọng từ các cuộc trao đổi trước đó",
  },
];

export function BriefsOnboarding({
  emailAccountId,
  hasCalendarConnected = false,
  onEnable,
  isEnabling = false,
}: {
  emailAccountId: string;
  hasCalendarConnected?: boolean;
  onEnable?: () => void;
  isEnabling?: boolean;
}) {
  return (
    <SetupCard
      imageSrc="/images/illustrations/communication.svg"
      imageAlt="Bản tóm tắt cuộc họp"
      title="Bản tóm tắt cuộc họp"
      description="Nhận bản tóm tắt qua email hoặc Slack trước các cuộc họp với khách mời bên ngoài."
      features={features}
    >
      {hasCalendarConnected ? (
        <>
          <MessageText>
            Mọi thứ đã sẵn sàng! Hãy bật bản tóm tắt cuộc họp để bắt đầu:
          </MessageText>
          <Button onClick={onEnable} loading={isEnabling}>
            Bật bản tóm tắt cuộc họp
          </Button>
        </>
      ) : (
        <>
          <MessageText>Kết nối lịch của bạn để bắt đầu:</MessageText>
          <ConnectCalendar onboardingReturnPath={`/${emailAccountId}/briefs`} />
        </>
      )}
    </SetupCard>
  );
}
