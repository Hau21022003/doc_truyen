import { IconUpload } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useState } from "react";

type ImagePickerPopoverProps = {
  index: number;
  onUploadClick: (index: number) => void;
  onLinkSubmit: (index: number, url: string) => void;
  trigger: React.ReactNode;
};

export function ImagePickerPopover({
  index,
  onUploadClick,
  onLinkSubmit,
  trigger,
}: ImagePickerPopoverProps) {
  const t = useTranslations("common");
  const [url, setUrl] = useState("");

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>

      <PopoverContent className="p-3 w-80">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList variant="line">
            <TabsTrigger value="upload">{t("actions.upload")}</TabsTrigger>
            <TabsTrigger value="link">{t("content.link")}</TabsTrigger>
          </TabsList>

          {/* Upload */}
          <TabsContent value="upload">
            <Button
              className="w-full [&_svg:not([class*='size-'])]:size-5"
              variant="outline"
              onClick={() => onUploadClick(index)}
            >
              <IconUpload />
              <p>{t("actions.uploadFile")}</p>
            </Button>
          </TabsContent>

          {/* Link */}
          <TabsContent value="link">
            <div className="flex gap-2">
              <Input
                placeholder={t("actions.pasteImageUrl")}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />

              <Button
                size="icon"
                onClick={() => {
                  if (!url) return;
                  onLinkSubmit(index, url);
                  setUrl("");
                }}
              >
                OK
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
