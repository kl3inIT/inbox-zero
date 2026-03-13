"use client";

import { useEffect } from "react";
import { logOut } from "@/utils/user";
import { Loading } from "@/components/Loading";
import { BasicLayout } from "@/components/layouts/BasicLayout";

export default function LogoutPage() {
  useEffect(() => {
    logOut("/login");
  }, []);

  return (
    <BasicLayout>
      <div className="flex flex-col items-center justify-center py-20">
        <Loading />
        <p className="mt-4 text-gray-600">Đang đăng xuất...</p>
      </div>
    </BasicLayout>
  );
}
