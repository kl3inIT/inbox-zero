// this is a copy/paste of the assistant/TestRules.tsx file
// can probably extract some common components from it

"use client";

import { useCallback, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import { SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/Input";
import { toastError } from "@/components/Toast";
import { LoadingContent } from "@/components/LoadingContent";
import type { MessagesResponse } from "@/app/api/messages/route";
import { Separator } from "@/components/ui/separator";
import { AlertBasic } from "@/components/Alert";
import { EmailMessageCell } from "@/components/EmailMessageCell";
import { SearchForm } from "@/components/SearchForm";
import { TableCell, TableRow, Table, TableBody } from "@/components/ui/table";
import { CardContent } from "@/components/ui/card";
import { testColdEmailAction } from "@/utils/actions/cold-email";
import type { ColdEmailBlockerBody } from "@/utils/actions/cold-email.validation";
import { useAccount } from "@/providers/EmailAccountProvider";

type ColdEmailBlockerResponse = {
  isColdEmail: boolean;
  aiReason?: string | null;
  reason?: string | null;
};

export function TestRulesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, error } = useSWR<MessagesResponse>(
    `/api/messages?q=${searchQuery}`,
    {
      keepPreviousData: true,
      dedupingInterval: 1000,
    },
  );

  const { userEmail } = useAccount();

  return (
    <div>
      <CardContent>
        <TestRulesForm />

        <div className="mt-4 max-w-sm">
          <SearchForm
            defaultQuery={searchQuery || undefined}
            onSearch={setSearchQuery}
          />
        </div>
      </CardContent>

      <Separator />

      <LoadingContent loading={isLoading} error={error}>
        {data && (
          <Table>
            <TableBody>
              {data.messages.map((message) => (
                <TestRulesContentRow
                  key={message.id}
                  message={message}
                  userEmail={userEmail}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </LoadingContent>
    </div>
  );
}

type TestRulesInputs = { message: string };

const TestRulesForm = () => {
  const { response, testEmail } = useColdEmailTest();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TestRulesInputs>({
    defaultValues: {
      message:
        "Chào bạn, mình đang điều hành một agency phát triển phần mềm. Không biết bạn có cần thêm người hỗ trợ cho đội của mình không?",
    },
  });

  const onSubmit: SubmitHandler<TestRulesInputs> = useCallback(
    async (data) => {
      await testEmail({
        from: "",
        subject: "",
        textHtml: null,
        textPlain: data.message,
        snippet: null,
        threadId: null,
        messageId: null,
        date: undefined,
      });
    },
    [testEmail],
  );

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="text"
          autosizeTextarea
          rows={3}
          name="message"
          label="Nội dung email để kiểm tra"
          placeholder="Chào bạn, mình đang điều hành một agency marketing và rất muốn trao đổi thêm với bạn."
          registerProps={register("message", { required: true })}
          error={errors.message}
        />
        <Button type="submit" loading={isSubmitting}>
          <SparklesIcon className="mr-2 h-4 w-4" />
          Kiểm tra
        </Button>
      </form>
      {response && (
        <div className="mt-4">
          <Result coldEmailResponse={response} />
        </div>
      )}
    </div>
  );
};

function TestRulesContentRow({
  message,
  userEmail,
}: {
  message: MessagesResponse["messages"][number];
  userEmail: string;
}) {
  const { testing, response, testEmail } = useColdEmailTest();

  return (
    <TableRow
      className={
        testing ? "animate-pulse bg-blue-50 dark:bg-blue-950/20" : undefined
      }
    >
      <TableCell>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <EmailMessageCell
              sender={message.headers.from}
              subject={message.headers.subject}
              snippet={message.snippet}
              userEmail={userEmail}
              threadId={message.threadId}
              messageId={message.id}
              labelIds={message.labelIds}
            />
          </div>
          <div className="ml-4 shrink-0">
            <Button
              color="white"
              loading={testing}
              onClick={async () => {
                await testEmail({
                  from: message.headers.from,
                  subject: message.headers.subject,
                  textHtml: message.textHtml || null,
                  textPlain: message.textPlain || null,
                  snippet: message.snippet || null,
                  threadId: message.threadId,
                  messageId: message.id,
                  date: message.internalDate || undefined,
                });
              }}
            >
              <SparklesIcon className="mr-2 h-4 w-4" />
              Kiểm tra
            </Button>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Result coldEmailResponse={response} />
      </TableCell>
    </TableRow>
  );
}

function Result(props: { coldEmailResponse: ColdEmailBlockerResponse | null }) {
  const { coldEmailResponse } = props;

  if (!coldEmailResponse) return null;

  if (coldEmailResponse.isColdEmail) {
    return (
      <AlertBasic
        variant="destructive"
        title="Email này là email tiếp thị (cold email)!"
        description={coldEmailResponse.aiReason}
      />
    );
  }
  return (
    <AlertBasic
      variant="success"
      title={
        coldEmailResponse.reason === "hasPreviousEmail"
          ? "Người này đã từng gửi email cho bạn trước đây. Đây không phải là email tiếp thị!"
          : "AI của chúng tôi xác định đây không phải là email tiếp thị!"
      }
      description={coldEmailResponse.aiReason}
    />
  );
}

function useColdEmailTest() {
  const [testing, setTesting] = useState(false);
  const [response, setResponse] = useState<ColdEmailBlockerResponse | null>(
    null,
  );
  const { emailAccountId } = useAccount();

  const testEmail = async (data: ColdEmailBlockerBody) => {
    setTesting(true);
    try {
      const result = await testColdEmailAction(emailAccountId, data);
      if (result?.serverError) {
        toastError({
          title: "Lỗi khi kiểm tra email có phải email tiếp thị hay không.",
          description: result.serverError,
        });
      } else if (result?.data) {
        setResponse(result.data);
      }
    } finally {
      setTesting(false);
    }
  };

  return { testing, response, testEmail };
}
