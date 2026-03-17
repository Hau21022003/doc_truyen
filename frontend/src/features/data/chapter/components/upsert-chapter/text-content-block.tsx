"use client";

import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, UnderlineIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function TextContentBlock({
  value,
  onChange,
  className = "",
}: {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
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
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
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
  ];

  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();

    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div className={cn("py-2", className)}>
      {editor && (
        <BubbleMenu editor={editor}>
          <div className="flex gap-1 bg-card shadow rounded p-1">
            {toolbarItems.map((item) => {
              const Icon = item.icon;
              const isActive = editor.isActive(item.name);

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    if (!editor) return;
                    item.action(editor);
                  }}
                  className={`p-2 rounded hover:bg-muted ${
                    isActive ? "bg-blue-200 text-blue-600" : ""
                  }`}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </BubbleMenu>
      )}

      <EditorContent
        className="focus:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:outline-none"
        editor={editor}
      />
    </div>
  );
}
