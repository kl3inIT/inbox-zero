"use client";

import { ArchiveIcon, Layers3Icon, BarChartBigIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOnboarding } from "@/components/OnboardingModal";
import { CardBasic } from "@/components/ui/card";

export function StatsOnboarding() {
  const { isOpen, setIsOpen, onClose } = useOnboarding("Stats");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chào mừng đến với thống kê email</DialogTitle>
          <DialogDescription>
            Khai thác insight từ hộp thư của bạn và dọn dẹp chúng trong thời
            gian ngắn.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 sm:gap-4">
          <CardBasic className="flex items-center">
            <BarChartBigIcon className="mr-3 h-5 w-5" />
            Trực quan hoá dữ liệu
          </CardBasic>
          <CardBasic className="flex items-center">
            <Layers3Icon className="mr-3 h-5 w-5" />
            Hiểu điều gì đang làm đầy inbox của bạn
          </CardBasic>
          <CardBasic className="flex items-center">
            <ArchiveIcon className="mr-3 h-5 w-5" />
            Hủy đăng ký và lưu trữ hàng loạt
          </CardBasic>
        </div>
        <div>
          <Button className="w-full" onClick={onClose}>
            Bắt đầu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
