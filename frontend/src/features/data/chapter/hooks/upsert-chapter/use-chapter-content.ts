import { useConfirm } from "@/providers/confirm-provider";
import { useTranslations } from "next-intl";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ChapterContentInput, UpsertChapterInput } from "../../chapter.schema";

export function useChapterContent(form: UseFormReturn<UpsertChapterInput>) {
  const { fields, prepend, append, insert, update, remove, move } =
    useFieldArray({
      control: form.control,
      name: "contents",
    });

  const tCommon = useTranslations("common");
  const { confirm } = useConfirm();

  const addContent = (
    type: "image" | "text",
    position: "start" | "end" | number = "end",
  ) => {
    const newContent = {
      contentType: type,
      textContent: null,
      imageUrl: null,
      imageTempId: null,
    };

    if (position === "start") prepend(newContent);
    else if (position === "end") append(newContent);
    else insert(position, newContent);
  };

  const removeContent = async (index: number) => {
    const confirmed = await confirm({
      title: tCommon("actions.delete"),
      description: tCommon("delete.singleConfirm", {
        itemName: tCommon("content.image"),
      }),
      variant: "destructive",
    });
    if (!confirmed) return;

    remove(index);
  };

  const updateContent = (index: number, data: Partial<ChapterContentInput>) => {
    const current = form.getValues(`contents.${index}`);
    update(index, { ...current!, ...data });
  };

  const moveContent = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex);
  };

  return {
    fields,
    addContent,
    removeContent,
    updateContent,
    moveContent,
  };
}
