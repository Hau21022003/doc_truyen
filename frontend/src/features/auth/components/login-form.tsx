import { IconEye, IconEyeOff } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
import { useLoginMutation } from "../mutations";
import { LoginInput, loginSchema } from "../schemas/auth.schema";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}
export default function LoginForm({
  onSuccess,
  onSwitchToRegister,
}: LoginFormProps) {
  const router = useRouter();
  const t = useTranslations("AuthModal.Login");
  const {
    mutate: login,
    isPending,
    isSuccess,
    isError,
    error,
  } = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
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
      handleErrorApi({ error });
    }
  }, [isError, error]);

  // Xử lý submit form
  const onSubmit = (data: LoginInput) => {
    login(data);
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
        <h1 className="font-semibold text-2xl">{t("Welcome Back")}</h1>
        <p className="text-gray-700 mt-1">
          {t("Please enter your credentials to continue")}
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
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-email"
                  aria-invalid={fieldState.invalid}
                  placeholder={t("Enter your email")}
                  autoComplete="email"
                />
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
                <FieldLabel htmlFor="form-rhf-password">
                  {t("Password")}
                </FieldLabel>
                <InputGroup>
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
          <Button
            type="submit"
            className="mt-1 bg-primary-orange text-primary-orange-foreground  hover:bg-primary-orange/80 cursor-pointer"
          >
            {t("Login")}
          </Button>
        </FieldGroup>
      </form>
      <div className="mt-4 text-center text-sm">
        {t(`Don't have an account?`)}
        <Button
          type="button"
          onClick={onSwitchToRegister}
          variant={"link"}
          className="text-primary-orange underline cursor-pointer px-2"
        >
          {t("Register")}
        </Button>
      </div>
    </div>
  );
}
