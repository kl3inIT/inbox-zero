import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TestRulesContent } from "@/app/(app)/[emailAccountId]/cold-email-blocker/TestRules";

export function ColdEmailTest() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kiểm tra trình chặn email tiếp thị</CardTitle>

        <CardDescription>
          Kiểm tra cách trình chặn email tiếp thị hoạt động với các email trước
          đây.
        </CardDescription>
      </CardHeader>
      <TestRulesContent />
    </Card>
  );
}
