"use client";

import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, UnderlineIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { FieldError } from "react-hook-form";
import { Separator } from "./ui/separator";

export default function TextEditor({
  setValue,
  value,
  className = "",
  error,
}: {
  value?: string;
  setValue: (value: string) => void;
  className?: string;
  error?: FieldError;
}) {
  const t = useTranslations("common.actions");
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: t("contentPlaceholder"),
        emptyNodeClass:
          "first:before:text-gray-400 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html !== value) {
        setValue(html);
      }
    },
    immediatelyRender: false,
  });

  const toolbarItems = [
    {
      name: "bold",
      icon: Bold,
      action: (editor: Editor) => editor.chain().focus().toggleBold().run(),
    },
    {
      name: "italic",
      icon: Italic,
      action: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
    },
    {
      name: "underline",
      icon: UnderlineIcon,
      action: (editor: Editor) =>
        editor.chain().focus().toggleUnderline().run(),
    },
    {
      name: "bulletList",
      icon: List,
      action: (editor: Editor) =>
        editor.chain().focus().toggleBulletList().run(),
    },
    {
      name: "orderedList",
      icon: ListOrdered,
      action: (editor: Editor) =>
        editor.chain().focus().toggleOrderedList().run(),
    },
  ];

  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();

    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div
      aria-invalid={!!error}
      className={cn(
        className,
        "relative border border-border rounded-md",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      )}
    >
      <div className="sticky top-0 z-10">
        <div className=" rounded-t-md bg-background">
          <div className="flex items-center gap-2 p-1">
            {toolbarItems.map((item) => {
              const Icon = item.icon;
              const isActive = editor?.isActive(item.name);

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    if (!editor) return;
                    item.action(editor);
                  }}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    isActive ? "bg-blue-200" : ""
                  }`}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </div>
        <Separator />
      </div>

      <div className={`relative`}>
        <EditorContent
          editor={editor}
          onClick={() => editor?.commands.focus()}
          className={cn(
            // layout
            "h-full max-h-full px-4 py-2",

            // typography
            "prose prose-sm max-w-none [&_.ProseMirror]:text-sm",

            // focus / reset
            "focus:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:outline-none",

            // element styles
            "[&_p]:my-2",
            "[&_strong]:font-bold",
            "[&_em]:italic",
            "[&_ul]:list-disc [&_ul]:pl-6",
            "[&_ol]:list-decimal [&_ol]:pl-6",
            "[&_li]:my-1",
          )}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive mt-1">{error.message}</p>
      )}
    </div>
  );
}
