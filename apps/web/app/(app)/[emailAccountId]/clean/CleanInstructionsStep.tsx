"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryState, parseAsString } from "nuqs";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/Typography";
import { Input } from "@/components/Input";
import { useStep } from "@/app/(app)/[emailAccountId]/clean/useStep";
import { Toggle } from "@/components/Toggle";
import { useSkipSettings } from "@/app/(app)/[emailAccountId]/clean/useSkipSettings";

const schema = z.object({ instructions: z.string().optional() });

type Inputs = z.infer<typeof schema>;

export function CleanInstructionsStep() {
  const { onNext } = useStep();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const [_, setInstructions] = useQueryState("instructions", parseAsString);
  const [showCustom, setShowCustom] = useState(false);
  const [skipStates, setSkipStates] = useSkipSettings();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (showCustom) {
      setInstructions(data.instructions || "");
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-center">
      <TypographyH3>
        Những email nào nên được giữ lại trong hộp thư đến?
      </TypographyH3>

      <div className="mt-4 grid gap-4">
        <Toggle
          name="reply"
          enabled={skipStates.skipReply}
          onChange={(value) => setSkipStates({ skipReply: value })}
          labelRight="Email cần trả lời"
        />
        <Toggle
          name="starred"
          enabled={skipStates.skipStarred}
          onChange={(value) => setSkipStates({ skipStarred: value })}
          labelRight="Email được gắn sao"
        />
        <Toggle
          name="calendar"
          enabled={skipStates.skipCalendar}
          onChange={(value) => setSkipStates({ skipCalendar: value })}
          labelRight="Sự kiện trong tương lai"
        />
        <Toggle
          name="receipt"
          enabled={skipStates.skipReceipt}
          onChange={(value) => setSkipStates({ skipReceipt: value })}
          labelRight="Hóa đơn/thanh toán"
        />
        {/* <Toggle
          name="attachment"
          enabled={skipStates.skipAttachment}
          onChange={(value) => setSkipStates({ skipAttachment: value })}
          labelRight="Emails with attachments"
        /> */}
        <Toggle
          name="conversation"
          enabled={skipStates.skipConversation}
          onChange={(value) => setSkipStates({ skipConversation: value })}
          labelRight="Cuộc hội thoại"
          tooltipText="Chuỗi email mà bạn đã từng trả lời"
        />
        <Toggle
          name="custom"
          enabled={showCustom}
          onChange={(value) => setShowCustom(value)}
          labelRight="Tùy chỉnh"
        />
      </div>

      {showCustom && (
        <div className="mt-4">
          <Input
            type="text"
            autosizeTextarea
            rows={3}
            name="instructions"
            registerProps={register("instructions")}
            placeholder={`Ví dụ:

Tôi làm việc như một freelancer thiết kế. Đừng lưu trữ email từ khách hàng.
Tôi đang trong một dự án xây dựng, hãy giữ lại các email liên quan.`}
            error={errors.instructions}
          />
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Button type="submit">Tiếp tục</Button>
      </div>
    </form>
  );
}
