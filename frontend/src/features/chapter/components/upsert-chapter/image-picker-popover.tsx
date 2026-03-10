import { IconUpload } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [url, setUrl] = useState("");

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>

      <PopoverContent className="p-3 w-64">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList variant="line">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="link">Link</TabsTrigger>
          </TabsList>

          {/* Upload */}
          <TabsContent value="upload">
            <Button
              className="w-full [&_svg:not([class*='size-'])]:size-5"
              variant="outline"
              onClick={() => onUploadClick(index)}
            >
              <IconUpload />
              <p>Upload file</p>
            </Button>
          </TabsContent>

          {/* Link */}
          <TabsContent value="link">
            <div className="flex gap-2">
              <Input
                placeholder="Paste image url..."
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
