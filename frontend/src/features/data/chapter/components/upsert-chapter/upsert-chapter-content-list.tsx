import {
  IconCopy,
  IconDeleteOutline,
  IconDrag,
  IconImage,
  IconPlus,
  IconRoundArrow,
  IconTextOutline,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PopoverClose } from "@radix-ui/react-popover";
import { useTranslations } from "next-intl";
import { Control, Controller, UseFieldArrayReturn } from "react-hook-form";
import { UpsertChapterInput } from "../../chapter.schema";
import { useChapterDrag } from "../../hooks/upsert-chapter/use-chapter-drag";
import { ImagePickerPopover } from "./image-picker-popover";
import { SortableItem } from "./sortable-item";
import TextContentBlock from "./text-content-block";

interface UpsertChapterContentListProps {
  control: Control<UpsertChapterInput>;
  fields: UseFieldArrayReturn<UpsertChapterInput, "contents">["fields"];
  addContent: (
    type: "image" | "text",
    position?: "start" | "end" | number,
  ) => void;
  removeContent: (index: number) => Promise<void>;
  updateContent: (index: number, data: any) => void;
  dragProps: ReturnType<typeof useChapterDrag>;
  fileUpload: {
    openFileDialog: () => void;
    currentImageIndex: React.RefObject<number | null>;
  };
}

export function UpsertChapterContentList({
  control,
  fields,
  addContent,
  removeContent,
  updateContent,
  dragProps,
  fileUpload,
}: UpsertChapterContentListProps) {
  const { activeId, activeContent, sensors, handleDragStart, handleDragEnd } =
    dragProps;
  const tCommon = useTranslations("common");
  const tChapter = useTranslations("chapter");

  return (
    <>
      {/* Header label + Add content popover */}
      <div className="flex gap-2 items-center">
        <FieldLabel>{tChapter("upsert.fields.contents.label")}</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size={"icon-xs"}
              variant="ghost"
              className="[&_svg:not([class*='size-'])]:size-5"
            >
              <IconPlus color="custom" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-1 w-48" align="start">
            <div className="flex flex-col">
              <PopoverClose asChild>
                <Button
                  type="button"
                  size={"sm"}
                  variant={"ghost"}
                  className="w-full justify-start [&_svg:not([class*='size-'])]:size-5"
                  onClick={() => addContent("image", "start")}
                >
                  <IconImage color="custom" />
                  <p>{tCommon("content.image")}</p>
                </Button>
              </PopoverClose>
              <PopoverClose asChild>
                <Button
                  type="button"
                  size={"sm"}
                  variant={"ghost"}
                  className="w-full justify-start [&_svg:not([class*='size-'])]:size-5"
                  onClick={() => addContent("text", "start")}
                >
                  <IconTextOutline color="custom" />
                  <p>{tCommon("content.text")}</p>
                </Button>
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <DragOverlay>
            {activeContent ? (
              <div className="w-[520px] bg-background border rounded-md shadow-xl p-3 opacity-90">
                {activeContent.contentType === "text" && (
                  <div
                    className="text-sm line-clamp-3 text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html:
                        activeContent.textContent ||
                        `<p>${tCommon("actions.contentPlaceholder")}</p>`,
                    }}
                  />
                )}

                {activeContent.contentType === "image" &&
                  (activeContent.imageUrl ? (
                    <img
                      src={activeContent.imageUrl}
                      className="h-32 w-full object-cover rounded"
                      draggable={false}
                    />
                  ) : (
                    <Button
                      type="button"
                      size="lg"
                      variant="secondary"
                      className="cursor-pointer w-full justify-start text-muted-foreground"
                    >
                      <IconImage size="default" color="custom" />
                      <p className="text-sm">{tCommon("actions.addAnImage")}</p>
                    </Button>
                  ))}
              </div>
            ) : null}
          </DragOverlay>

          <div className="flex flex-col gap-2">
            {fields.map((content, idx) => (
              <SortableItem key={content.id} id={content.id}>
                {({ attributes, listeners }) => (
                  <div
                    key={`content_${idx}`}
                    className="flex items-start gap-2 group relative"
                  >
                    <div
                      className={cn(
                        "absolute left-0 top-2 -translate-x-16 z-30",
                        "shrink-0 opacity-0 hover:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 transition",
                        "flex items-center gap-2",
                      )}
                    >
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            size={"icon-xs"}
                            variant="ghost"
                            className="[&_svg:not([class*='size-'])]:size-5"
                          >
                            <IconPlus color="muted" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-1 w-48" align="start">
                          <div className="flex flex-col">
                            <PopoverClose asChild>
                              <Button
                                type="button"
                                size={"sm"}
                                variant={"ghost"}
                                className="w-full justify-start [&_svg:not([class*='size-'])]:size-5"
                                onClick={(e) => {
                                  addContent("image", idx + 1);
                                  e.currentTarget.blur();
                                }}
                              >
                                <IconImage color="default" />
                                <p>{tCommon("content.image")}</p>
                              </Button>
                            </PopoverClose>
                            <PopoverClose asChild>
                              <Button
                                type="button"
                                size={"sm"}
                                variant={"ghost"}
                                className="w-full justify-start [&_svg:not([class*='size-'])]:size-5"
                                onClick={() => addContent("text", idx + 1)}
                              >
                                <IconTextOutline color="default" />
                                <p>{tCommon("content.text")}</p>
                              </Button>
                            </PopoverClose>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button
                        type="button"
                        size={"icon-xs"}
                        variant="ghost"
                        className="[&_svg:not([class*='size-'])]:size-5"
                        {...attributes}
                        {...listeners}
                      >
                        <IconDrag color="custom" />
                      </Button>
                    </div>

                    <div className="flex-1">
                      {content.contentType === "text" && (
                        <Controller
                          control={control}
                          name={`contents.${idx}.textContent`}
                          render={({ field }) => (
                            <TextContentBlock
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      )}

                      {content.contentType === "image" &&
                        (content.imageUrl ? (
                          <div className="group relative">
                            <img
                              draggable={false}
                              className="w-full rounded-md"
                              src={content.imageUrl}
                              alt={`image_${idx}`}
                            />

                            <div
                              className={cn(
                                // "sticky top-2 ml-auto",
                                "group-hover:opacity-100 group-focus-within:opacity-100 opacity-0 ",
                                "absolute right-2 top-2 w-fit flex items-center gap-1 p-1",
                                "w-fit flex items-center gap-1 p-1",
                                "rounded-md bg-background border border-border",
                              )}
                            >
                              <ImagePickerPopover
                                index={idx}
                                onUploadClick={(i) => {
                                  fileUpload.currentImageIndex.current = i;
                                  fileUpload.openFileDialog();
                                }}
                                onLinkSubmit={(i, url) => {
                                  updateContent(i, {
                                    imageUrl: url,
                                  });
                                }}
                                trigger={
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon-sm"
                                    className="[&_svg:not([class*='size-'])]:size-5"
                                  >
                                    <IconRoundArrow color="custom" />
                                  </Button>
                                }
                              />

                              <Button
                                type="button"
                                variant={"outline"}
                                size={"icon-sm"}
                                className="[&_svg:not([class*='size-'])]:size-5"
                              >
                                <IconCopy color="custom" />
                              </Button>

                              <Button
                                type="button"
                                variant={"outline"}
                                size={"icon-sm"}
                                className="[&_svg:not([class*='size-'])]:size-5"
                                onClick={() => removeContent(idx)}
                              >
                                <IconDeleteOutline color="custom" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <ImagePickerPopover
                            index={idx}
                            onUploadClick={(i) => {
                              fileUpload.currentImageIndex.current = i;
                              fileUpload.openFileDialog();
                            }}
                            onLinkSubmit={(i, url) => {
                              updateContent(i, { imageUrl: url });
                            }}
                            trigger={
                              <Button
                                type="button"
                                size="lg"
                                variant="secondary"
                                className="cursor-pointer w-full justify-start text-muted-foreground"
                              >
                                <IconImage size="default" color="custom" />
                                <p className="text-sm">
                                  {tCommon("actions.addAnImage")}
                                </p>
                              </Button>
                            }
                          />
                        ))}
                    </div>
                  </div>
                )}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
