import {
  IconEye,
  IconEyeOff,
  IconKey,
  IconMail,
  IconUser,
} from "@/components/icons";
import IconCheck from "@/components/icons/icon-check";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { handleErrorApi } from "@/lib/error";
import { SHARED_ENDPOINTS } from "@/shared/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRegisterMutation } from "../mutations";
import { RegisterInput, registerSchema } from "../schemas/auth.schema";

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}
export default function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) {
  const router = useRouter();
  const t = useTranslations("AuthModal.Register");
  const {
    mutate: register,
    isPending,
    isSuccess,
    isError,
    error,
  } = useRegisterMutation();

  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  // Theo dõi sự thay đổi của isSuccess để gọi onSuccess
  useEffect(() => {
    if (isSuccess) {
      toast.success("Login successful!");
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  // Theo dõi lỗi để hiển thị thông báo
  useEffect(() => {
    if (isError && error) {
      console.log("error", error);
      handleErrorApi({ error });
    }
  }, [isError, error]);

  // Xử lý submit form
  const onSubmit = (data: RegisterInput) => {
    register(data);
  };

  const handleGoogleLogin = () => {
    router.push(SHARED_ENDPOINTS.AUTH.GOOGLE_LOGIN);
  };

  const handleFacebookLogin = () => {
    router.push(SHARED_ENDPOINTS.AUTH.FACEBOOK_LOGIN);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col items-center">
        <h1 className="font-semibold text-2xl">{t("Create New Account")}</h1>
        <p className="text-gray-700 mt-1">
          {t("Introduce your information to register")}
        </p>
      </div>

      {/* Social buttons */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant={"outline"}
          className="flex-1 cursor-pointer"
          size={"lg"}
          onClick={handleGoogleLogin}
        >
          <Image
            alt=""
            src={"/socials/google.png"}
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <p>Google</p>
        </Button>
        <Button
          type="button"
          variant={"outline"}
          className="flex-1 cursor-pointer"
          size={"lg"}
          onClick={handleFacebookLogin}
        >
          <Image
            alt=""
            src={"/socials/facebook.png"}
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <p>Facebook</p>
        </Button>
      </div>

      {/* Separator */}
      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <span className="text-sm text-muted-foreground">{t("Or")}</span>
        <Separator className="flex-1" />
      </div>

      {/* Login Form */}
      <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-5">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputGroup>
                  <InputGroupAddon align="inline-start" className="pl-2">
                    <IconUser className="cursor-pointer text-gray-500" />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="form-rhf-name"
                    aria-invalid={fieldState.invalid}
                    placeholder={t("Enter your name")}
                    autoComplete="off"
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputGroup>
                  <InputGroupAddon align="inline-start" className="pl-2">
                    <IconMail className="cursor-pointer text-gray-500" />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="form-rhf-email"
                    aria-invalid={fieldState.invalid}
                    placeholder={t("Enter your email")}
                    autoComplete="email"
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputGroup>
                  <InputGroupAddon align="inline-start" className="pl-2">
                    <IconKey className="cursor-pointer text-gray-500" />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="form-rhf-password"
                    aria-invalid={fieldState.invalid}
                    placeholder={t("Enter your password")}
                    autoComplete="off"
                    type={showPassword ? "text" : "password"}
                  />
                  <InputGroupAddon align="inline-end">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:opacity-70 bg-transparent"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <IconEyeOff className="cursor-pointer" />
                      ) : (
                        <IconEye className="cursor-pointer" />
                      )}
                    </button>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputGroup>
                  <InputGroupAddon align="inline-start" className="pl-2">
                    <IconCheck className="cursor-pointer text-gray-500" />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="form-rhf-confirm-password"
                    aria-invalid={fieldState.invalid}
                    placeholder={t("Confirm your password")}
                    autoComplete="off"
                    type={showPassword ? "text" : "password"}
                  />
                  <InputGroupAddon align="inline-end">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:opacity-70 bg-transparent"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <IconEyeOff className="cursor-pointer" />
                      ) : (
                        <IconEye className="cursor-pointer" />
                      )}
                    </button>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button
            type="submit"
            className="mt-1 bg-primary-orange text-primary-orange-foreground hover:bg-primary-orange/80 cursor-pointer"
          >
            {t("Register")}
          </Button>
        </FieldGroup>
      </form>
      <div className="mt-4 text-center text-sm">
        {t(`Already have an account?`)}
        <Button
          type="button"
          onClick={onSwitchToLogin}
          variant={"link"}
          className="text-primary-orange underline cursor-pointer px-2"
        >
          {t("Login")}
        </Button>
      </div>
    </div>
  );
}
