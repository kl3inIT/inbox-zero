"use client";

import { useCallback, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/Input";
import { toastError } from "@/components/Toast";
import { testAiCustomContentAction } from "@/utils/actions/ai-rule";
import type { RunRulesResult } from "@/utils/ai/choose-rule/run-rules";
import { ResultsDisplay } from "@/app/(app)/[emailAccountId]/assistant/ResultDisplay";
import {
  testAiCustomContentBody,
  type TestAiCustomContentBody,
} from "@/utils/actions/ai-rule.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "@/providers/EmailAccountProvider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const TestCustomEmailForm = () => {
  const [testResults, setTestResult] = useState<RunRulesResult[]>();
  const { emailAccountId } = useAccount();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TestAiCustomContentBody>({
    resolver: zodResolver(testAiCustomContentBody),
  });

  const onSubmit: SubmitHandler<TestAiCustomContentBody> = useCallback(
    async (data) => {
      const result = await testAiCustomContentAction(emailAccountId, data);
      if (result?.serverError) {
        toastError({
          title: "Lỗi khi kiểm thử email",
          description: result.serverError,
        });
      } else {
        setTestResult(result?.data);
      }
    },
    [emailAccountId],
  );

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <Input
          type="text"
          autosizeTextarea
          rows={3}
          name="content"
          placeholder="Dán nội dung email hoặc tự viết. Ví dụ: Biên lai từ Stripe cho $49"
          registerProps={register("content", { required: true })}
          error={errors.content}
        />
        <Button type="submit" loading={isSubmitting} size="sm">
          <SparklesIcon className="mr-2 size-4" />
          Kiểm thử
        </Button>
      </form>
      {testResults && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Kết quả kiểm thử</CardTitle>
          </CardHeader>
          <CardContent>
            <ResultsDisplay results={testResults} showFullContent={true} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
