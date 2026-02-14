"use client";

import { IconCamera, IconLoading } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFileUpload } from "@/hooks/use-file-upload";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_IMAGE_TYPES_STRING,
  MAX_AVATAR_SIZE_MB,
  TIMEZONE_LABELS,
  TIMEZONE_VALUES,
} from "@/shared/constants";
import { useAuthStore } from "@/shared/stores";
import { generateAvatarUrl } from "@/shared/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUpdateProfileMutation } from "../mutations";
import {
  UpdateProfileInput,
  updateProfileSchema,
} from "../schemas/update-profile.schema";
import { useEditProfileModalStore } from "../stores/edit-profile-modal.store";

export default function EditProfileModal() {
  const t = useTranslations("EditProfileModal");
  const { isOpen, closeModal } = useEditProfileModalStore();
  const [avatarFile, setAvatarFile] = useState<File>();
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const { user } = useAuthStore();
  const {
    mutate: updateProfile,
    isPending,
    isSuccess,
    isError,
    error,
  } = useUpdateProfileMutation();

  const { inputRef, openFileDialog, onFileChange } = useFileUpload({
    maxSizeMB: MAX_AVATAR_SIZE_MB,
    accept: ALLOWED_IMAGE_TYPES,
    onFileSelected: (file) => {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    },
    onError: (msg) => {
      alert(msg);
    },
  });

  // Cleanup memory preview
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name,
      timezone: user?.timezone,
    },
  });

  const onSubmit = (data: UpdateProfileInput) => {
    updateProfile({ updateData: data, avatarFile: avatarFile });
  };

  // Theo dõi sự thay đổi của isSuccess để gọi onSuccess
  useEffect(() => {
    if (isSuccess) {
      toast.success(t("Update profile successful!"));
      setAvatarFile(undefined);
      closeModal();
    }
  }, [isSuccess]);

  // Theo dõi lỗi để hiển thị thông báo
  useEffect(() => {
    if (isError && error) {
      handleErrorApi({ error });
    }
  }, [isError, error]);

  // Cập nhật form khi user thay đổi
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        timezone: user.timezone,
      });
    }
  }, [user, form.reset]);

  if (!user) return null;

  const isChanged = form.formState.isDirty || !!avatarFile;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="items-center">
          <DialogTitle>{t("Edit Profile")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={avatarPreview || generateAvatarUrl(user.id, user.avatar)}
                alt={user.name}
                className="w-20 h-20 rounded-md"
                width={24}
                height={24}
              />
              <input
                ref={inputRef}
                type="file"
                hidden
                onChange={onFileChange}
                accept={ALLOWED_IMAGE_TYPES_STRING}
              />
              <div
                onClick={openFileDialog}
                className={cn(
                  "cursor-pointer",
                  "absolute right-0 bottom-0 flex items-center justify-center",
                  "rounded-full h-6 w-6 bg-gray-200 dark:bg-[#262626] ring-4 ring-white dark:ring-[#0a0a0a] ",
                )}
              >
                <IconCamera size={"xs"} />
              </div>
            </div>
          </div>

          <form
            id="form-rhf-update-profile"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-name">{t("Name")}</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-name"
                      aria-invalid={fieldState.invalid}
                      placeholder={t("Enter your name")}
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="timezone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-select-timezone">
                      {t("Timezone")}
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="form-rhf-select-timezone"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select your timezone" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {TIMEZONE_VALUES.map((timezone) => (
                          <SelectItem key={timezone} value={timezone}>
                            {TIMEZONE_LABELS[timezone]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      {t("Select your timezone for accurate time display")}
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t("Close")}
            </Button>
          </DialogClose>
          <Button
            disabled={!isChanged || isPending}
            type="submit"
            form="form-rhf-update-profile"
          >
            {isPending && (
              <IconLoading className="animate-spin" color="custom" />
            )}
            {isPending ? `${t("Updating")}...` : t("Update")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
