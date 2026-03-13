"use client";

import { LoadingContent } from "@/components/LoadingContent";
import { useDriveConnections } from "@/hooks/useDriveConnections";
import { DriveConnectionCard } from "./DriveConnectionCard";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export function DriveConnections() {
  const { data, isLoading, error } = useDriveConnections();
  const connections = data?.connections || [];

  return (
    <LoadingContent loading={isLoading} error={error}>
      {connections.length > 0 ? (
        <div>
          {connections.map((connection) => (
            <DriveConnectionCard key={connection.id} connection={connection} />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Không tìm thấy kết nối Drive nào</EmptyTitle>
            <EmptyDescription>
              Kết nối Drive của bạn để bắt đầu sắp xếp tài liệu.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </LoadingContent>
  );
}
