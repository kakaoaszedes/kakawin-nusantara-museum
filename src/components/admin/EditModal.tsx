
import {
  useState,
  useEffect,
} from "react";

import {
  X,
  Save,
  Bold,
  Italic,
  Heading1,
  List,
} from "lucide-react";

import { Button } from "../ui/Button";

import {
  updateDocumentById,
  uploadFile,
} from "../../services/db";

import {
  useEditor,
  EditorContent,
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

interface EditModalProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditModal({
  item,
  isOpen,
  onClose,
  onSuccess,
}: EditModalProps) {

  // =========================
  // STATE
  // =========================
  const [formData, setFormData] =
    useState({

      title: "",

      description: "",

      content: "",

      category: "",

      year: "",

      region: "",

      origin: "",

      thumbnail: "",

      is_published: false,
    });

  const [saving, setSaving] =
    useState(false);

  const [newImage, setNewImage] =
    useState<File | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData((current) => ({
        ...current,
        content: editor.getHTML(),
      }));
    },
  });

  // =========================
  // LOAD ITEM
  // =========================
  useEffect(() => {

    if (item) {

      setFormData({

        title:
          item.title || "",

        description:
          item.description || "",

        content:
          item.content || "",

        category:
          item.category || "",

        year:
          item.year || "",

        region:
          item.region || "",

        origin:
          item.origin ||
          item.capital ||
          item.capitals?.[0] ||
          "",

        thumbnail:
          item.thumbnail || "",

        is_published:
          item.is_published || false,
      });

    }

  }, [item]);

  // =========================
  // TIPTAP EDITOR
  // =========================
  useEffect(() => {
  if (editor && formData.content !== editor.getHTML()) {
    editor.commands.setContent(formData.content);
  }
}, [editor, formData.content]);

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setSaving(true);

      try {

        let thumbnailUrl =
          formData.thumbnail;

        // =========================
        // UPLOAD IMAGE
        // =========================
        if (newImage) {

          const uploadedImage =
            await uploadFile(
              newImage,
              "kakawin-library"
            );

          if (uploadedImage) {

            thumbnailUrl =
              uploadedImage;

          }

        }

        // =========================
        // UPDATE
        // =========================
        const updates = {

          title:
            formData.title,

          description:
            formData.description,

          content:
            formData.content,

          category:
            formData.category,

          year:
            formData.year,

          region:
            formData.region,

          origin:
            formData.origin,

          thumbnail:
            thumbnailUrl,

          is_published:
            formData.is_published,

          updated_at:
            new Date().toISOString(),
        };

        const result =
          await updateDocumentById(
            "contents",
            item.id,
            updates
          );

        if (result) {

          onSuccess();

        } else {

          alert(
            "Gagal update konten"
          );

        }

      } catch (error) {

        console.error(
          "Update error:",
          error
        );

        alert(
          "Terjadi error saat update"
        );

      } finally {

        setSaving(false);

      }
    };

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-700 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* CLOSE */}
        <button
          className="absolute top-6 right-6 text-zinc-400 hover:text-white transition"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-white mb-8">
          Edit Content
        </h2>

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-6"
        >

          {/* TITLE */}
          <div>

            <label className="block text-sm text-zinc-400 mb-2">
              Judul
            </label>

            <input
              type="text"
              value={
                formData.title
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title:
                    e.target.value,
                })
              }
              className="admin-select w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white outline-none focus:border-yellow-500"
              required
            />

          </div>

          {/* CATEGORY */}
          <div>

            <label className="block text-sm text-zinc-400 mb-2">
              Kategori
            </label>

            <select
              value={
                formData.category
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category:
                    e.target.value,
                })
              }
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white outline-none focus:border-yellow-500"
            >

              <option value="timeline">
                Timeline
              </option>

              <option value="budaya">
                Budaya
              </option>

              <option value="syair">
                Sastra
              </option>

              <option value="tokoh">
                Tokoh
              </option>

              <option value="kerajaan">
                Kingdom
              </option>

              <option value="pameran">
                Pameran
              </option>

              <option value="gallery">
                Gallery
              </option>

            </select>

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="block text-sm text-zinc-400 mb-2">
              Deskripsi
            </label>

            <textarea
              value={
                formData.description
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description:
                    e.target.value,
                })
              }
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white h-28 resize-none outline-none focus:border-yellow-500"
            />

          </div>

          {/* CONTENT */}
          <div>

            <label className="block text-sm text-zinc-400 mb-4">
              Isi Konten
            </label>

            {/* TOOLBAR */}
            <div className="flex flex-wrap gap-2 mb-4">

              <button
                type="button"
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .toggleBold()
                    .run()
                }
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                <Bold size={18} />
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
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                <Italic size={18} />
              </button>

              <button
                type="button"
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .toggleHeading({
                      level: 1,
                    })
                    .run()
                }
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                <Heading1 size={18} />
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
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                <List size={18} />
              </button>

            </div>

            {/* EDITOR */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 min-h-[300px] text-white">

              <EditorContent
                editor={editor}
              />

            </div>

          </div>

          {/* YEAR */}
          <div>

            <label className="block text-sm text-zinc-400 mb-2">
              Tahun / Periode
            </label>

            <input
              type="text"
              value={
                formData.year
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  year:
                    e.target.value,
                })
              }
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white outline-none focus:border-yellow-500"
            />

          </div>

          {["kerajaan", "kingdom", "kingdoms"].includes(
            formData.category
          ) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Ibu Kota
                </label>

                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      origin:
                        e.target.value,
                    })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Wilayah
                </label>

                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      region:
                        e.target.value,
                    })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white outline-none focus:border-yellow-500"
                />
              </div>
            </div>
          )}

          {/* THUMBNAIL */}
          <div>

            <label className="block text-sm text-zinc-400 mb-2">
              Thumbnail
            </label>

            {formData.thumbnail && (

              <img
                src={
                  formData.thumbnail
                }
                alt="Thumbnail"
                className="w-full h-52 object-cover rounded-2xl mb-4 border border-zinc-700"
              />

            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewImage(
                  e.target
                    .files?.[0] ||
                    null
                )
              }
              className="w-full text-white"
            />

          </div>

          {/* PUBLISH */}
          <div className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={
                formData.is_published
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_published:
                    e.target.checked,
                })
              }
            />

            <label className="text-sm text-zinc-300">
              Publish Content
            </label>

          </div>

          {/* BUTTON */}
          <div className="flex gap-4 pt-6">

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
              className="flex-1 gap-2"
            >

              <Save size={16} />

              {saving
                ? "Saving..."
                : "Save Changes"}

            </Button>

          </div>

        </form>

      </div>

      {/* TIPTAP STYLE */}
      <style>
        {`
          .ProseMirror {
            outline: none;
            min-height: 250px;
            color: white;
          }

          .ProseMirror h1 {
            font-size: 2rem;
            font-weight: bold;
            margin: 1rem 0;
          }

          .ProseMirror p {
            margin: 0.5rem 0;
          }

          .ProseMirror ul {
            padding-left: 1.5rem;
            list-style: disc;
          }
        `}
      </style>

    </div>
  );
}

