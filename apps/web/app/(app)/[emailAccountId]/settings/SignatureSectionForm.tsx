"use client";

import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@/components/Button";
import { saveSignatureAction } from "@/utils/actions/user";
import type { SaveSignatureBody } from "@/utils/actions/user.validation";
import { fetchSignaturesFromProviderAction } from "@/utils/actions/email-account";
import {
  FormSection,
  FormSectionLeft,
  FormSectionRight,
  SubmitButtonWrapper,
} from "@/components/Form";
import { Tiptap, type TiptapHandle } from "@/components/editor/Tiptap";
import { toastError, toastInfo, toastSuccess } from "@/components/Toast";
import { ClientOnly } from "@/components/ClientOnly";
import { useAccount } from "@/providers/EmailAccountProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { getActionErrorMessage } from "@/utils/error";
import { saveSignatureBody } from "@/utils/actions/user.validation";
import { isGoogleProvider } from "@/utils/email/provider-types";

export const SignatureSectionForm = ({
  signature,
}: {
  signature: string | null;
}) => {
  const defaultSignature = signature ?? "";

  const { handleSubmit, setValue } = useForm<SaveSignatureBody>({
    defaultValues: { signature: defaultSignature },
    resolver: zodResolver(saveSignatureBody),
  });

  const editorRef = useRef<TiptapHandle>(null);

  const { emailAccountId, provider } = useAccount();
  const isGmail = isGoogleProvider(provider);

  const { execute, isExecuting } = useAction(
    saveSignatureAction.bind(null, emailAccountId),
    {
      onSuccess: () => {
        toastSuccess({ description: "Đã lưu chữ ký" });
      },
      onError: (error) => {
        toastError({
          description: getActionErrorMessage(error.error),
        });
      },
    },
  );
  const { executeAsync: executeFetchSignatures } = useAction(
    fetchSignaturesFromProviderAction.bind(null, emailAccountId),
  );

  const handleEditorChange = useCallback(
    (html: string) => {
      setValue("signature", html);
    },
    [setValue],
  );

  return (
    <form onSubmit={handleSubmit(execute)}>
      <FormSection>
        <FormSectionLeft
          title="Chữ ký"
          description="Được thêm vào cuối tất cả email gửi đi."
        />
        <div className="md:col-span-2">
          <FormSectionRight>
            <div className="sm:col-span-full">
              <ClientOnly>
                <Tiptap
                  ref={editorRef}
                  initialContent={defaultSignature}
                  onChange={handleEditorChange}
                  className="min-h-[100px]"
                />
              </ClientOnly>
            </div>
          </FormSectionRight>
          <SubmitButtonWrapper>
            <div className="flex gap-2">
              <Button type="submit" size="lg" loading={isExecuting}>
                Lưu
              </Button>
              <Button
                type="button"
                size="lg"
                color="white"
                onClick={async () => {
                  const result = await executeFetchSignatures();

                  if (result?.serverError) {
                    toastError({
                      title: `Lỗi khi tải chữ ký từ ${isGmail ? "Gmail" : "Outlook"}`,
                      description: result.serverError,
                    });
                    return;
                  }

                  const signatures = result?.data?.signatures || [];
                  const defaultSig =
                    signatures.find((sig) => sig.isDefault) || signatures[0];

                  if (defaultSig?.signature) {
                    editorRef.current?.appendContent(defaultSig.signature);
                    toastSuccess({
                      title: "Đã tải chữ ký",
                      description: isGmail
                        ? "Đã tải từ Gmail"
                        : "Được trích xuất từ các email đã gửi gần đây",
                    });
                  } else {
                    toastInfo({
                      title: "Không tìm thấy chữ ký",
                      description: isGmail
                        ? "Không tìm thấy chữ ký trong tài khoản Gmail của bạn"
                        : "Không tìm thấy chữ ký trong các email đã gửi gần đây",
                    });
                  }
                }}
              >
                Tải từ {isGmail ? "Gmail" : "Outlook"}
              </Button>
            </div>
          </SubmitButtonWrapper>
        </div>
      </FormSection>
    </form>
  );
};
