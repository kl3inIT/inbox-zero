import fs from "node:fs";
import path from "node:path";
import { env } from "@/env";
import { auth } from "@/utils/auth";
import { isAdmin } from "@/utils/admin";
import {
  hasGoogleOauthConfig,
  hasMicrosoftOauthConfig,
} from "@/utils/oauth/provider-config";
import { PageWrapper } from "@/components/PageWrapper";
import { PageHeader } from "@/components/PageHeader";

export default async function AdminConfigPage() {
  const session = await auth();

  const isUserAdmin = await isAdmin({ email: session?.user.email });

  const version = getVersion();

  const info = {
    version,
    environment: process.env.NODE_ENV,
    baseUrl: env.NEXT_PUBLIC_BASE_URL,
    features: {
      emailSendEnabled: env.NEXT_PUBLIC_EMAIL_SEND_ENABLED,
      contactsEnabled: env.NEXT_PUBLIC_CONTACTS_ENABLED,
      bypassPremiumChecks: env.NEXT_PUBLIC_BYPASS_PREMIUM_CHECKS ?? false,
    },
    providers: {
      google: hasGoogleOauthConfig(),
      microsoft: hasMicrosoftOauthConfig(),
      microsoftTenantConfigured:
        hasMicrosoftOauthConfig() &&
        !!env.MICROSOFT_TENANT_ID &&
        env.MICROSOFT_TENANT_ID !== "common",
    },
    llm: {
      defaultProvider: env.DEFAULT_LLM_PROVIDER,
      defaultModel: env.DEFAULT_LLM_MODEL ?? "default",
      economyProvider: env.ECONOMY_LLM_PROVIDER ?? "not configured",
      economyModel: env.ECONOMY_LLM_MODEL ?? "not configured",
    },
    integrations: {
      redis: !!env.UPSTASH_REDIS_URL || !!env.REDIS_URL,
      qstash: !!env.QSTASH_TOKEN,
      tinybird: !!env.TINYBIRD_TOKEN,
      sentry: !!env.NEXT_PUBLIC_SENTRY_DSN,
      posthog: !!env.NEXT_PUBLIC_POSTHOG_KEY,
      stripe: !!env.STRIPE_SECRET_KEY,
      lemonSqueezy: !!env.LEMON_SQUEEZY_API_KEY,
    },
  };

  return (
    <PageWrapper className="max-w-2xl mx-auto">
      <PageHeader title="Cấu hình ứng dụng" />

      <div className="space-y-4 mt-4">
        <Section title="Ứng dụng">
          <Row label="Phiên bản" value={info.version} />
          <Row label="Môi trường" value={info.environment} />
          <Row label="Địa chỉ gốc (Base URL)" value={info.baseUrl} />
        </Section>

        <Section title="Tính năng">
          <Row
            label="Gửi email"
            value={info.features.emailSendEnabled ? "Bật" : "Tắt"}
          />
          <Row
            label="Danh bạ"
            value={info.features.contactsEnabled ? "Bật" : "Tắt"}
          />
          <Row
            label="Bỏ qua kiểm tra Premium"
            value={info.features.bypassPremiumChecks ? "Có" : "Không"}
          />
        </Section>

        <Section title="Nhà cung cấp xác thực">
          <Row
            label="Google"
            value={info.providers.google ? "Đã cấu hình" : "Chưa được cấu hình"}
          />
          <Row
            label="Microsoft"
            value={
              info.providers.microsoft ? "Đã cấu hình" : "Chưa được cấu hình"
            }
          />
          <Row
            label="Tenant Microsoft"
            value={
              info.providers.microsoftTenantConfigured
                ? "Một tenant"
                : "Nhiều tenant (common)"
            }
          />
        </Section>

        {isUserAdmin && (
          <>
            <Section title="Cấu hình LLM">
              <Row
                label="Nhà cung cấp mặc định"
                value={info.llm.defaultProvider}
              />
              <Row label="Mô hình mặc định" value={info.llm.defaultModel} />
              <Row
                label="Nhà cung cấp tiết kiệm"
                value={info.llm.economyProvider}
              />
              <Row label="Mô hình tiết kiệm" value={info.llm.economyModel} />
            </Section>

            <Section title="Tích hợp">
              <Row
                label="Redis"
                value={
                  info.integrations.redis ? "Đã cấu hình" : "Chưa được cấu hình"
                }
              />
              <Row
                label="QStash"
                value={
                  info.integrations.qstash
                    ? "Đã cấu hình"
                    : "Chưa được cấu hình"
                }
              />
              <Row
                label="Tinybird"
                value={
                  info.integrations.tinybird
                    ? "Đã cấu hình"
                    : "Chưa được cấu hình"
                }
              />
              <Row
                label="Sentry"
                value={
                  info.integrations.sentry
                    ? "Đã cấu hình"
                    : "Chưa được cấu hình"
                }
              />
              <Row
                label="PostHog"
                value={
                  info.integrations.posthog
                    ? "Đã cấu hình"
                    : "Chưa được cấu hình"
                }
              />
              <Row
                label="Stripe"
                value={
                  info.integrations.stripe
                    ? "Đã cấu hình"
                    : "Chưa được cấu hình"
                }
              />
              <Row
                label="Lemon Squeezy"
                value={
                  info.integrations.lemonSqueezy
                    ? "Đã cấu hình"
                    : "Chưa được cấu hình"
                }
              />
            </Section>
          </>
        )}
      </div>
    </PageWrapper>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <h2 className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-900">
        {title}
      </h2>
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | boolean }) {
  const displayValue =
    typeof value === "boolean" ? (value ? "Có" : "Không") : value;

  return (
    <div className="flex justify-between px-4 py-2">
      <span className="text-slate-600">{label}</span>
      <span className="font-mono text-sm text-slate-900">{displayValue}</span>
    </div>
  );
}

// Read version at build time
function getVersion(): string {
  try {
    const versionPath = path.join(process.cwd(), "../../version.txt");
    return fs.readFileSync(versionPath, "utf-8").trim();
  } catch {
    return "unknown";
  }
}
