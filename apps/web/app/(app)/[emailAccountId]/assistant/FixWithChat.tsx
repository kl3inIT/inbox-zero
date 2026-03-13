import { MessageCircleIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ParsedMessage } from "@/utils/types";
import type { RunRulesResult } from "@/utils/ai/choose-rule/run-rules";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingContent } from "@/components/LoadingContent";
import { useRules } from "@/hooks/useRules";
import { useModal } from "@/hooks/useModal";
import { NEW_RULE_ID } from "@/app/(app)/[emailAccountId]/assistant/consts";
import { Label } from "@/components/Input";
import { ButtonList } from "@/components/ButtonList";
import type { RulesResponse } from "@/app/api/user/rules/route";
import { ResultsDisplay } from "@/app/(app)/[emailAccountId]/assistant/ResultDisplay";
import { NONE_RULE_ID } from "@/app/(app)/[emailAccountId]/assistant/consts";
import { useSidebar } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useChat } from "@/providers/ChatProvider";
import {
  NEW_RULE_ID as CONST_NEW_RULE_ID,
  NONE_RULE_ID as CONST_NONE_RULE_ID,
} from "@/app/(app)/[emailAccountId]/assistant/consts";
import type { MessageContext } from "@/app/api/chat/validation";

export function FixWithChat({
  setInput,
  message,
  results,
}: {
  setInput: (input: string) => void;
  message: ParsedMessage;
  results: RunRulesResult[];
}) {
  const { data, isLoading, error } = useRules();
  const { isModalOpen, setIsModalOpen } = useModal();
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [explanation, setExplanation] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);

  const { setOpen } = useSidebar();
  const { setContext } = useChat();

  const selectedRuleName = useMemo(() => {
    if (!data) return null;
    if (selectedRuleId === NEW_RULE_ID) return "Quy tắc mới";
    if (selectedRuleId === NONE_RULE_ID) return "Không có";
    return data.find((r) => r.id === selectedRuleId)?.name ?? null;
  }, [data, selectedRuleId]);

  const handleRuleSelect = (ruleId: string | null) => {
    setSelectedRuleId(ruleId);
    setShowExplanation(true);
  };

  const handleSubmit = () => {
    if (!selectedRuleId) return;

    let input: string;

    if (selectedRuleId === CONST_NEW_RULE_ID) {
      input = explanation?.trim()
        ? `Tạo một quy tắc mới cho những email như thế này: ${explanation.trim()}`
        : "Tạo một quy tắc mới cho những email như thế này: ";
    } else if (selectedRuleId === CONST_NONE_RULE_ID) {
      input = explanation?.trim()
        ? `Email này lẽ ra không nên khớp với bất kỳ quy tắc nào vì ${explanation.trim()}`
        : "Email này lẽ ra không nên khớp với bất kỳ quy tắc nào vì ";
    } else {
      const rulePart = selectedRuleName
        ? `quy tắc "${selectedRuleName}"`
        : "một quy tắc khác";
      input = explanation?.trim()
        ? `Email này lẽ ra nên khớp với ${rulePart} vì ${explanation.trim()}`
        : `Email này lẽ ra nên khớp với ${rulePart} vì `;
    }

    const context: MessageContext = {
      type: "fix-rule",
      message: {
        id: message.id,
        threadId: message.threadId,
        snippet: message.snippet,
        textPlain: message.textPlain,
        textHtml: message.textHtml,
        headers: {
          from: message.headers.from,
          to: message.headers.to,
          subject: message.headers.subject,
          cc: message.headers.cc,
          date: message.headers.date,
          "reply-to": message.headers["reply-to"],
        },
        internalDate: message.internalDate,
      },
      results: results.map((r) => ({
        ruleName: r.rule?.name ?? null,
        systemType: r.rule?.systemType ?? null,
        reason: r.reason ?? "",
      })),
      expected:
        selectedRuleId === CONST_NEW_RULE_ID
          ? "new"
          : selectedRuleId === CONST_NONE_RULE_ID
            ? "none"
            : {
                id: selectedRuleId,
                name: selectedRuleName || "Unknown",
              },
    };
    setContext(context);

    setInput(input);
    setOpen((arr) => [...arr, "chat-sidebar"]);
    setIsModalOpen(false);

    // Reset state
    setSelectedRuleId(null);
    setExplanation("");
    setShowExplanation(false);
  };

  const handleClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      // Reset state when closing
      setSelectedRuleId(null);
      setExplanation("");
      setShowExplanation(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageCircleIcon className="mr-2 size-4" />
          Sửa
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cải thiện quy tắc</DialogTitle>
        </DialogHeader>

        <LoadingContent loading={isLoading} error={error}>
          {data && !showExplanation ? (
            <RuleMismatch
              results={results}
              rules={data}
              onSelectExpectedRuleId={handleRuleSelect}
            />
          ) : data && showExplanation ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Quy tắc đã chọn:</span>
                <Badge variant="secondary">
                  {selectedRuleId === NEW_RULE_ID
                    ? "✨ Quy tắc mới"
                    : selectedRuleId === NONE_RULE_ID
                      ? "❌ Không có"
                      : data.find((r) => r.id === selectedRuleId)?.name ||
                        "Không rõ"}
                </Badge>
              </div>

              <div>
                <Label
                  name="explanation"
                  label="Vì sao quy tắc này nên được áp dụng? (tuỳ chọn)"
                />
                <Textarea
                  id="explanation"
                  name="explanation"
                  className="mt-1"
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  aria-describedby="explanation-help"
                  autoFocus
                />
                <p id="explanation-help" className="mt-1 text-xs text-gray-500">
                  Việc giải thích giúp AI hiểu rõ hơn ý định của bạn
                </p>
              </div>

              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowExplanation(false);
                    setSelectedRuleId(null);
                    setExplanation("");
                  }}
                >
                  Quay lại
                </Button>
                <Button onClick={handleSubmit}>Tiếp tục</Button>
              </div>
            </div>
          ) : null}
        </LoadingContent>
      </DialogContent>
    </Dialog>
  );
}

function RuleMismatch({
  results,
  rules,
  onSelectExpectedRuleId,
}: {
  results: RunRulesResult[];
  rules: RulesResponse;
  onSelectExpectedRuleId: (ruleId: string | null) => void;
}) {
  return (
    <div>
      <Label name="matchedRule" label="Đã khớp:" />
      <div className="mt-1">
        {results.length > 0 ? (
          <ResultsDisplay results={results} />
        ) : (
          <p>Không có quy tắc nào khớp</p>
        )}
      </div>
      <div className="mt-4">
        <ButtonList
          title="Bạn mong đợi email này sẽ khớp với quy tắc nào?"
          emptyMessage="Bạn chưa tạo quy tắc nào!"
          items={[
            { id: NONE_RULE_ID, name: "❌ Không có" },
            { id: NEW_RULE_ID, name: "✨ Quy tắc mới" },
            ...rules,
          ]}
          onSelect={onSelectExpectedRuleId}
        />
      </div>
    </div>
  );
}
