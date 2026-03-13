import prisma from "@/utils/prisma";
import { MutedText, PageHeading } from "@/components/Typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { auth } from "@/utils/auth";
import { getEmailTerminology } from "@/utils/terminology";

export default async function RuleHistoryPage(props: {
  params: Promise<{ emailAccountId: string; ruleId: string }>;
}) {
  const { emailAccountId, ruleId } = await props.params;
  const session = await auth();
  if (!session?.user.id) notFound();

  const rule = await prisma.rule.findFirst({
    where: {
      id: ruleId,
      // Verify the user has access to this email account
      emailAccount: {
        id: emailAccountId,
        userId: session.user.id,
      },
    },
    select: {
      id: true,
      name: true,
      emailAccount: {
        select: {
          account: { select: { provider: true } },
        },
      },
    },
  });
  if (!rule) notFound();

  const ruleHistory = await prisma.ruleHistory.findMany({
    where: {
      ruleId: rule.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const triggerTypeLabels: Record<string, string> = {
    ai_update: "Cập nhật bởi AI",
    manual_update: "Cập nhật thủ công",
    ai_creation: "Tạo bởi AI",
    manual_creation: "Tạo thủ công",
    system_creation: "Tạo bởi hệ thống",
    system_update: "Cập nhật bởi hệ thống",
  };

  return (
    <div className="container mx-auto p-4">
      <PageHeading>Lịch sử quy tắc: {rule.name}</PageHeading>
      {ruleHistory.length === 0 ? (
        <p className="mt-4 text-muted-foreground">
          Không có lịch sử cho quy tắc này.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {ruleHistory.map((history) => (
            <Card key={history.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Phiên bản {history.version}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {triggerTypeLabels[history.triggerType] ||
                        history.triggerType}
                    </Badge>
                    <MutedText>
                      {formatDistanceToNow(history.createdAt, {
                        addSuffix: true,
                      })}
                    </MutedText>
                  </div>
                </div>
                {history.promptText && (
                  <CardDescription className="mt-2">
                    <strong>Prompt:</strong> {history.promptText}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="mb-1 font-semibold">Chi tiết quy tắc</h4>
                    <dl className="grid grid-cols-1 gap-1 text-sm">
                      <div className="flex gap-2">
                        <dt className="font-medium">Tên:</dt>
                        <dd>{history.name}</dd>
                      </div>
                      {history.instructions && (
                        <div className="flex gap-2">
                          <dt className="font-medium">Hướng dẫn:</dt>
                          <dd>{history.instructions}</dd>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <dt className="font-medium">Trạng thái:</dt>
                        <dd>
                          {history.enabled ? "Đang bật" : "Đang tắt"}
                          {history.automate && " • Tự động hóa"}
                          {history.runOnThreads && " • Chạy trên luồng"}
                        </dd>
                      </div>
                      {history.conditionalOperator && (
                        <div className="flex gap-2">
                          <dt className="font-medium">Toán tử điều kiện:</dt>
                          <dd>{history.conditionalOperator}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {(history.from ||
                    history.to ||
                    history.subject ||
                    history.body) && (
                    <div>
                      <h4 className="mb-1 font-semibold">Điều kiện tĩnh</h4>
                      <dl className="grid grid-cols-1 gap-1 text-sm">
                        {history.from && (
                          <div className="flex gap-2">
                            <dt className="font-medium">Từ:</dt>
                            <dd className="font-mono">{history.from}</dd>
                          </div>
                        )}
                        {history.to && (
                          <div className="flex gap-2">
                            <dt className="font-medium">Đến:</dt>
                            <dd className="font-mono">{history.to}</dd>
                          </div>
                        )}
                        {history.subject && (
                          <div className="flex gap-2">
                            <dt className="font-medium">Tiêu đề:</dt>
                            <dd className="font-mono">{history.subject}</dd>
                          </div>
                        )}
                        {history.body && (
                          <div className="flex gap-2">
                            <dt className="font-medium">Nội dung:</dt>
                            <dd className="font-mono">{history.body}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  )}

                  {history.systemType && (
                    <div>
                      <h4 className="mb-1 font-semibold">Loại hệ thống</h4>
                      <p className="text-sm">{history.systemType}</p>
                    </div>
                  )}

                  {history.actions && (
                    <div>
                      <h4 className="mb-1 font-semibold">Hành động</h4>
                      <div className="space-y-1">
                        {(
                          history.actions as Array<
                            Record<string, string | undefined>
                          >
                        ).map((action, index) => (
                          <div key={index} className="text-sm">
                            <Badge variant="secondary" className="mr-2">
                              {action.type}
                            </Badge>
                            {action.label && (
                              <span>
                                {
                                  getEmailTerminology(
                                    rule.emailAccount.account.provider,
                                  ).label.action
                                }
                                : {action.label}
                              </span>
                            )}
                            {action.subject && (
                              <span>Tiêu đề: {action.subject}</span>
                            )}
                            {action.content && (
                              <span>
                                Nội dung: {action.content.substring(0, 50)}...
                              </span>
                            )}
                            {action.to && <span>Đến: {action.to}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
