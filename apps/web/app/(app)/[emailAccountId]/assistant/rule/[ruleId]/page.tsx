import { Rule } from "@/app/(app)/[emailAccountId]/assistant/RuleForm";
import { TopSection } from "@/components/TopSection";

export default async function RulePage(props: {
  params: Promise<{ ruleId: string; account: string }>;
  searchParams: Promise<{ new: string }>;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  return (
    <div>
      {searchParams.new === "true" && (
        <TopSection
          title="Đây là cài đặt quy tắc của bạn!"
          descriptionComponent={
            <p>
              Các quy tắc này được AI tạo tự động, bạn có thể thoải mái điều
              chỉnh cho phù hợp nhu cầu của mình.
            </p>
          }
        />
      )}
      <div className="content-container mx-auto w-full max-w-3xl">
        <Rule ruleId={params.ruleId} />
      </div>
    </div>
  );
}
