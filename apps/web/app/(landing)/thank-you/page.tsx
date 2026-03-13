import { Button } from "@/components/Button";
import { PageHeading, TypographyP } from "@/components/Typography";
import { BasicLayout } from "@/components/layouts/BasicLayout";
import { CardBasic } from "@/components/ui/card";

// same component as not-found
export default function ThankYouPage() {
  return (
    <BasicLayout>
      <div className="pb-40 pt-60">
        <CardBasic className="mx-auto max-w-xl text-center">
          <PageHeading>Cảm ơn bạn!</PageHeading>
          <div className="mt-2">
            <TypographyP>
              Gói Premium của bạn đã được thanh toán thành công. Cảm ơn bạn đã
              ủng hộ chúng tôi!
            </TypographyP>
          </div>
          <Button className="mt-4" size="xl" link={{ href: "/setup" }}>
            Tiếp tục
          </Button>
        </CardBasic>
      </div>
    </BasicLayout>
  );
}
