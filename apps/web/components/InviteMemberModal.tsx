"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipExplanation } from "@/components/TooltipExplanation";
import { toastSuccess, toastError } from "@/components/Toast";
import { TagInput } from "@/components/TagInput";
import { Label } from "@/components/ui/label";
import {
  inviteMemberAction,
  createOrganizationAndInviteAction,
} from "@/utils/actions/organization";
import {
  inviteMemberBody,
  type InviteMemberBody,
} from "@/utils/actions/organization.validation";
import { useDialogState } from "@/hooks/useDialogState";
import { useAccount } from "@/providers/EmailAccountProvider";
import { isValidEmail } from "@/utils/email";

export function InviteMemberModal({
  organizationId,
  onSuccess,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
}: {
  organizationId?: string;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}) {
  const internalState = useDialogState();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalState.isOpen;
  const onOpenChange = isControlled
    ? controlledOnOpenChange
    : internalState.onToggle;
  const onClose = isControlled
    ? () => controlledOnOpenChange?.(false)
    : internalState.onClose;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger !== null &&
        (trigger ?? (
          <DialogTrigger asChild>
            <Button size="sm">Mời thành viên</Button>
          </DialogTrigger>
        ))}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {organizationId ? "Mời thành viên" : "Mời các thành viên"}
          </DialogTitle>
          <DialogDescription>
            {organizationId
              ? "Gửi lời mời tham gia tổ chức của bạn."
              : "Nhập các email để mời thành viên trong team."}
          </DialogDescription>
        </DialogHeader>

        {organizationId ? (
          <InviteForm
            organizationId={organizationId}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        ) : (
          <CreateOrgAndInviteForm onClose={onClose} onSuccess={onSuccess} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function InviteForm({
  organizationId,
  onClose,
  onSuccess,
}: {
  organizationId: string;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<InviteMemberBody>({
    resolver: zodResolver(inviteMemberBody),
    defaultValues: {
      organizationId,
      role: "member",
    },
  });

  const selectedRole = watch("role");

  const onSubmit: SubmitHandler<InviteMemberBody> = useCallback(
    async (data) => {
      const result = await inviteMemberAction(data);

      if (result?.serverError) {
        toastError({
          title: "Lỗi khi gửi lời mời",
          description: result.serverError,
        });
      } else {
        toastSuccess({
          description: "Đã gửi lời mời thành công!",
        });
        reset();
        onClose();
        onSuccess?.();
      }
    },
    [reset, onClose, onSuccess],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="email"
        name="email"
        label="Địa chỉ email"
        placeholder="john.doe@example.com"
        registerProps={register("email")}
        error={errors.email}
      />

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor="role">Vai trò</Label>
          <TooltipExplanation
            side="right"
            text="Thành viên có thể xem và cộng tác.\nAdmin có thể quản lý tổ chức và mời người khác."
          />
        </div>
        <Select
          value={selectedRole}
          onValueChange={(value) =>
            setValue("role", value as "admin" | "member")
          }
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Chọn vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="member">Thành viên</SelectItem>
            <SelectItem value="admin">Quản trị</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Huỷ</Button>
        </DialogClose>
        <Button type="submit" loading={isSubmitting}>
          Gửi lời mời
        </Button>
      </DialogFooter>
    </form>
  );
}

function CreateOrgAndInviteForm({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { emailAccountId } = useAccount();
  const [emails, setEmails] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailsChange = useCallback((newEmails: string[]) => {
    setEmails(newEmails.map((e) => e.toLowerCase()));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (emails.length === 0) {
      toastError({ description: "Vui lòng nhập ít nhất một địa chỉ email" });
      return;
    }

    setIsSubmitting(true);

    const result = await createOrganizationAndInviteAction(emailAccountId, {
      emails,
    });

    setIsSubmitting(false);

    if (result?.serverError) {
      toastError({
        description: "Không thể tạo tổ chức và gửi lời mời",
      });
    } else if (result?.data) {
      const successCount = result.data.results.filter((r) => r.success).length;
      const errorCount = result.data.results.filter((r) => !r.success).length;

      if (successCount > 0) {
        toastSuccess({
          description: `Đã gửi thành công ${successCount} lời mời!`,
        });
      }
      if (errorCount > 0) {
        toastError({
          description: `Không thể gửi ${errorCount} lời mời`,
        });
      }

      setEmails([]);
      onClose();
      onSuccess?.();
    }
  }, [emails, emailAccountId, onClose, onSuccess]);

  return (
    <div className="space-y-4">
      <TagInput
        value={emails}
        onChange={handleEmailsChange}
        validate={(email) =>
          isValidEmail(email) ? null : "Vui lòng nhập email hợp lệ"
        }
        label="Các địa chỉ email"
        id="email-input"
        placeholder="Nhập các email, phân tách bằng dấu phẩy"
      />

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button
          type="button"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={emails.length === 0}
        >
          Send Invitation{emails.length > 1 ? "s" : ""}
        </Button>
      </DialogFooter>
    </div>
  );
}
