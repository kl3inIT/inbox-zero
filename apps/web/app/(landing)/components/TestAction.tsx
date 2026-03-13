"use client";

import { Button } from "@/components/ui/button";
import { testAction } from "./test-action";

export function TestActionButton() {
  return (
    <Button
      variant="destructive"
      onClick={async () => {
        try {
          const res = await testAction();
          alert(`Thao tác hoàn tất: ${res}`);
        } catch (error) {
          alert(`Thao tác thất bại: ${error}`);
        }
      }}
    >
      Thử hành động
    </Button>
  );
}
