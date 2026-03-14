import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/Loading";
import type { CreateRuleResult } from "@/utils/rule/types";
import { CreatedRulesContent } from "@/app/(app)/[emailAccountId]/assistant/CreatedRulesModal";

type StepProps = {
  back?: () => void;
  next?: () => void;
};

type StepContentProps = StepProps & {
  title: string;
  children: React.ReactNode;
};

const STEPS = 5;

export function ProcessingPromptFileDialog({
  open,
  onOpenChange,
  result,
  setViewedProcessingPromptFileDialog,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: CreateRuleResult[] | null;
  setViewedProcessingPromptFileDialog: (viewed: boolean) => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const back = useCallback(() => {
    setCurrentStep((current) => Math.max(0, current - 1));
  }, []);

  const next = useCallback(() => {
    setCurrentStep((current) => Math.min(STEPS, current + 1));
  }, []);

  useEffect(() => {
    if (currentStep > 0) {
      setViewedProcessingPromptFileDialog(true);
    }
  }, [currentStep, setViewedProcessingPromptFileDialog]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        {currentStep === 0 && <IntroStep next={next} />}
        {currentStep === 1 && <Step1 back={back} next={next} />}
        {currentStep === 2 && <Step2 back={back} next={next} />}
        {currentStep === 3 && <Step3 back={back} next={next} />}
        {currentStep === 4 && <Step4 back={back} next={next} />}
        {currentStep >= STEPS &&
          (result ? (
            <CreatedRulesContent rules={result} onOpenChange={onOpenChange} />
          ) : (
            <FinalStepWaiting back={back} />
          ))}
      </DialogContent>
    </Dialog>
  );
}

function StepNavigation({ back, next }: StepProps) {
  return (
    <div className="flex gap-2">
      {back && (
        <Button variant="outline" onClick={back}>
          Quay lại
        </Button>
      )}
      {next && <Button onClick={next}>Tiếp tục</Button>}
    </div>
  );
}

function Step({ back, next, title, children }: StepContentProps) {
  return (
    <>
      <DialogHeader className="mx-auto flex flex-col justify-center">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription className="max-w-lg space-y-1.5 text-left">
          {children}
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-center">
        <StepNavigation back={back} next={next} />
      </div>
    </>
  );
}

function IntroStep({ next }: StepProps) {
  return (
    <>
      <DialogHeader className="flex flex-col items-center justify-center">
        <Loading />
        <DialogTitle>Đang tạo quy tắc...</DialogTitle>
        <DialogDescription className="text-center">
          Trong lúc chờ, bạn có thể làm quen thêm với trợ lý AI của mình.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-center">
        <Button onClick={next}>Xem nhanh cách hoạt động</Button>
      </div>
    </>
  );
}

function Step1({ back, next }: StepProps) {
  return (
    <Step back={back} next={next} title="Hệ thống đang làm gì?">
      <p>
        Hệ thống đang chuyển hướng dẫn của bạn thành các quy tắc rõ ràng.
        <br />
        Việc này giúp trợ lý hoạt động ổn định hơn và cho bạn kiểm soát tốt hơn
        cách từng quy tắc được áp dụng.
      </p>

      <Image
        src="/images/assistant/rules.png"
        alt="Phân tích hướng dẫn"
        width={800}
        height={600}
        className="rounded-lg shadow"
      />
    </Step>
  );
}

function Step2({ back, next }: StepProps) {
  return (
    <Step back={back} next={next} title="Tùy chỉnh quy tắc">
      <p>Sau khi tạo xong, bạn có thể tinh chỉnh từng quy tắc theo nhu cầu.</p>
      <Image
        src="/images/assistant/rule-edit.png"
        alt="Chỉnh sửa quy tắc"
        width={500}
        height={300}
        className="rounded-lg shadow"
      />
    </Step>
  );
}

function Step3({ back, next }: StepProps) {
  return (
    <Step back={back} next={next} title="Kiểm tra quy tắc">
      <p>
        Ngay sau đây bạn sẽ được đưa tới tab "Kiểm tra". Tại đó bạn có thể xem
        trợ lý có hoạt động đúng như mong muốn hay không.
      </p>

      <Image
        src="/images/assistant/process.png"
        alt="Kiểm tra quy tắc"
        width={500}
        height={300}
        className="rounded-lg shadow"
      />
    </Step>
  );
}

function Step4({ back, next }: StepProps) {
  return (
    <Step back={back} next={next} title="Cải thiện quy tắc">
      <p>
        Bấm "Sửa" để điều chỉnh những chỗ chưa đúng. Mỗi lần sửa sẽ giúp AI học
        và bám sát nhu cầu của bạn hơn.
      </p>

      <Image
        src="/images/assistant/fix.png"
        alt="Sửa quy tắc"
        width={500}
        height={300}
        className="rounded-lg shadow"
      />
    </Step>
  );
}

function FinalStepWaiting({ back }: StepProps) {
  return (
    <>
      <DialogHeader className="flex flex-col items-center justify-center">
        <Loading />
        <DialogTitle>Sắp xong rồi</DialogTitle>
        <DialogDescription className="text-center">
          Hệ thống gần hoàn tất.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-center">
        <StepNavigation back={back} />
      </div>
    </>
  );
}
