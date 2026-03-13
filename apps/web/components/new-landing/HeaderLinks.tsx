"use client";

import Link from "next/link";
import {
  HomeIcon,
  UserIcon,
  RocketIcon,
  BuildingIcon,
  HeadphonesIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { cn } from "@/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const navigation = [
  { name: "Doanh nghiệp", href: "/enterprise" },
  { name: "Bảng giá", href: "/pricing" },
];

const useCases = [
  {
    title: "Nhà sáng lập",
    href: "/founders",
    description: "Mở rộng startup khi AI lo phần hộp thư của bạn",
    icon: RocketIcon,
    iconColor: "text-new-purple-600",
    borderColor: "from-new-purple-200 to-new-purple-300",
    gradient: "from-new-purple-50 to-new-purple-100",
    hoverBg: "hover:bg-new-purple-50/[0.44]",
  },
  {
    title: "Doanh nghiệp nhỏ",
    href: "/small-business",
    description: "Phát triển kinh doanh với quản lý email tự động",
    icon: BuildingIcon,
    iconColor: "text-new-green-500",
    borderColor: "from-new-green-150 to-new-green-200",
    gradient: "from-new-green-50 to-new-green-100",
    hoverBg: "hover:bg-new-green-50",
  },
  {
    title: "Nhà sáng tạo nội dung",
    href: "/creator",
    description: "Tối ưu hợp tác và làm việc với các nhãn hàng",
    icon: UserIcon,
    iconColor: "text-new-blue-600",
    borderColor: "from-new-blue-150 to-new-blue-200",
    gradient: "from-new-blue-50 to-new-blue-100",
    hoverBg: "hover:bg-new-blue-50/50",
  },
  {
    title: "Bất động sản",
    href: "/real-estate",
    description: "Quản lý email bằng AI cho môi giới/chuyên gia bất động sản",
    icon: HomeIcon,
    iconColor: "text-new-pink-500",
    borderColor: "from-new-pink-150 to-new-pink-200",
    gradient: "from-new-pink-50 to-new-pink-100",
    hoverBg: "hover:bg-new-pink-50/[0.44]",
  },
  {
    title: "Chăm sóc khách hàng",
    href: "/support",
    description: "Hỗ trợ nhanh hơn nhờ phản hồi được AI hỗ trợ",
    icon: HeadphonesIcon,
    iconColor: "text-new-orange-600",
    borderColor: "from-new-orange-150 to-new-orange-200",
    gradient: "from-new-orange-50 to-new-orange-100",
    hoverBg: "hover:bg-new-orange-50/50",
  },
  {
    title: "Thương mại điện tử",
    href: "/ecommerce",
    description: "Tự động cập nhật đơn hàng và giao tiếp với khách hàng",
    icon: ShoppingCartIcon,
    iconColor: "text-new-indigo-600",
    borderColor: "from-new-indigo-150 to-new-indigo-200",
    gradient: "from-new-indigo-50 to-new-indigo-100",
    hoverBg: "hover:bg-new-indigo-50/50",
  },
];

export function HeaderLinks() {
  return (
    <div className="hidden lg:flex lg:items-center lg:gap-x-8">
      <NavigationMenu>
        <NavigationMenuList>
          {/* Solutions Dropdown */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-semibold font-geist leading-6 text-gray-900">
              Giải pháp
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[640px] grid-cols-2 gap-2 p-4">
                {useCases.map((useCase) => (
                  <EnhancedListItem
                    key={useCase.title}
                    title={useCase.title}
                    href={useCase.href}
                    icon={useCase.icon}
                    iconColor={useCase.iconColor}
                    gradient={useCase.gradient}
                    borderColor={useCase.borderColor}
                    hoverBg={useCase.hoverBg}
                  >
                    {useCase.description}
                  </EnhancedListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Regular Navigation Items */}
          {navigation.map((item) => (
            <NavigationMenuItem key={item.name}>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link
                  href={item.href}
                  className="text-sm font-semibold font-geist leading-6 text-gray-900"
                >
                  {item.name}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

function EnhancedListItem({
  title,
  children,
  href,
  icon: Icon,
  iconColor,
  gradient,
  borderColor,
  hoverBg,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  gradient: string;
  borderColor: string;
  hoverBg: string;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "group block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-200 focus:bg-accent focus:text-accent-foreground",
            hoverBg,
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "p-px rounded-lg shadow-sm bg-gradient-to-b",
                borderColor,
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[7px] bg-gradient-to-b shadow-sm transition-transform",
                  gradient,
                )}
              >
                <Icon className={cn("h-4 w-4", iconColor)} />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold leading-none text-gray-900 group-hover:text-gray-800">
                {title}
              </div>
              <p className="mt-1 text-sm leading-snug text-gray-600 group-hover:text-gray-700">
                {children}
              </p>
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
