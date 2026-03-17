import { IconXCircleFill } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks";
import { getErrorMessage } from "@/lib/error";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface ErrorTableProps {
  error: any;
  onRetry?: () => void;
  className?: string;
}

export function ErrorTable({ error, onRetry, className }: ErrorTableProps) {
  const t = useTranslations("table");
  const isMobile = useIsMobile();
  const errorMessage = getErrorMessage(error);

  return !isMobile ? (
    <div
      className={cn(
        "px-4 h-24 w-full rounded-md border border-destructive flex items-center justify-between gap-2",
        className,
      )}
    >
      <div className="flex items-center justify-start gap-3">
        {/* <Image
          src={"/sad-but-relieved-face.svg"}
          alt=""
          width={30}
          height={30}
          className="w-10 h-10"
        /> */}
        <IconXCircleFill size={"xl"} color="destructive" />
        <div className="flex flex-col">
          <p className="font-medium text-destructive/80">{t("errorTitle")}</p>
          <p>{errorMessage}</p>
        </div>
      </div>
      {onRetry && <Button onClick={onRetry}>{t("retry")}</Button>}
    </div>
  ) : (
    <div
      className={cn(
        "p-4 w-full rounded-md border border-destructive flex flex-col items-center gap-1",
        className,
      )}
    >
      <Image
        src={"/sad-but-relieved-face.svg"}
        alt=""
        width={30}
        height={30}
        className="w-20 h-20"
      />
      <p className="font-medium text-center text-lg text-destructive/80">
        {t("errorTitle")}
      </p>
      <p>{errorMessage}</p>
      {onRetry && (
        <Button
          className="text-center w-full max-w-60 mt-2"
          variant={"destructive"}
          onClick={onRetry}
        >
          {t("retry")}
        </Button>
      )}
    </div>
  );
}
