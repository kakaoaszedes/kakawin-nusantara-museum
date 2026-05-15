import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import Image from "@tiptap/extension-image";

import Link from "@tiptap/extension-link";

import TextAlign from "@tiptap/extension-text-align";

interface Props {
  content: string;
  onChange: (value: string) => void;
}

export default function TiptapEditor({
  content,
  onChange,
}: Props) {

  const editor = useEditor({
    extensions: [
      StarterKit,

      Image,

      Link,

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content,

    editorProps: {
      attributes: {
        class:
          "min-h-[300px] rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white outline-none",
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="space-y-4">

      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-2">

        <button
          type="button"
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .toggleBold()
              .run()
          }
          className="px-3 py-1 rounded bg-zinc-800 text-white"
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className="px-3 py-1 rounded bg-zinc-800 text-white"
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
          className="px-3 py-1 rounded bg-zinc-800 text-white"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          className="px-3 py-1 rounded bg-zinc-800 text-white"
        >
          List
        </button>

      </div>

      {/* EDITOR */}
      <EditorContent editor={editor} />

    </div>
  );
}