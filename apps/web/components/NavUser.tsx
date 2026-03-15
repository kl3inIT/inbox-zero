"use client";

import Link from "next/link";
import {
  Building2Icon,
  ChevronsUpDownIcon,
  ChromeIcon,
  CrownIcon,
  LogOutIcon,
  MessageCircleReplyIcon,
  PaletteIcon,
  RibbonIcon,
  ShieldCheckIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccount } from "@/providers/EmailAccountProvider";
import { prefixPath } from "@/utils/path";
import { logOut } from "@/utils/user";
import { isGoogleProvider } from "@/utils/email/provider-types";
import { useTheme } from "next-themes";
import { ProfileImage } from "@/components/ProfileImage";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EXTENSION_URL } from "@/utils/config";
import { useUser } from "@/hooks/useUser";
import { env } from "@/env";

export function NavUser() {
  const { emailAccountId, emailAccount, provider } = useAccount();
  const { theme, setTheme } = useTheme();
  const { data: user } = useUser();

  const currentEmailAccountId = emailAccount?.id || emailAccountId;
  const currentEmailAccountMembers =
    user?.members?.filter(
      (member) => member.emailAccountId === currentEmailAccountId,
    ) || [];
  const hasOrganization = currentEmailAccountMembers.length > 0;
  const organizationName = currentEmailAccountMembers[0]?.organization?.name;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={emailAccount?.image || ""}
              alt={emailAccount?.name || emailAccount?.email}
            />
            <AvatarFallback className="rounded-lg">
              {emailAccount?.name?.charAt(0) || emailAccount?.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {emailAccount ? (
            <>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {emailAccount.name || emailAccount.email}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {organizationName || emailAccount.email}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </>
          ) : null}
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-52 origin-top-right rounded-md"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <ProfileImage
              image={emailAccount?.image || null}
              label={emailAccount?.name || emailAccount?.email || ""}
              size={32}
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {emailAccount?.name || emailAccount?.email || "Tài khoản"}
              </span>
              {(organizationName || emailAccount?.email) && (
                <span className="truncate text-xs text-muted-foreground">
                  {organizationName || emailAccount?.email}
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {!hasOrganization && (
            <DropdownMenuItem asChild>
              <Link
                href={prefixPath(currentEmailAccountId, "/organization/create")}
              >
                <Building2Icon className="mr-2 size-4" />
                Tạo tổ chức
              </Link>
            </DropdownMenuItem>
          )}
          {hasOrganization && (
            <DropdownMenuItem asChild>
              <Link href={prefixPath(currentEmailAccountId, "/organization")}>
                <Building2Icon className="mr-2 size-4" />
                Tổ chức của tôi
              </Link>
            </DropdownMenuItem>
          )}
          {isGoogleProvider(provider) && (
            <DropdownMenuItem asChild>
              <Link
                href={EXTENSION_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ChromeIcon className="mr-2 size-4" />
                Cài tiện ích
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {isGoogleProvider(provider) && (
            <>
              <DropdownMenuItem asChild>
                <Link href={prefixPath(currentEmailAccountId, "/reply-zero")}>
                  <MessageCircleReplyIcon className="mr-2 size-4" />
                  Reply Zero
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={prefixPath(
                    currentEmailAccountId,
                    "/cold-email-blocker",
                  )}
                >
                  <ShieldCheckIcon className="mr-2 size-4" />
                  Chặn email tiếp thị lạnh
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/early-access">
                  <RibbonIcon className="mr-2 size-4" />
                  Truy cập sớm
                </Link>
              </DropdownMenuItem>
            </>
          )}
          {!env.NEXT_PUBLIC_BYPASS_PREMIUM_CHECKS && (
            <DropdownMenuItem asChild>
              <Link href="/premium">
                <CrownIcon className="mr-2 size-4" />
                Nâng cấp
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setTheme(theme === "dark" ? "light" : "dark");
          }}
        >
          <PaletteIcon className="mr-2 size-4" />
          {theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => logOut(window.location.origin)}>
          <LogOutIcon className="mr-2 size-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
