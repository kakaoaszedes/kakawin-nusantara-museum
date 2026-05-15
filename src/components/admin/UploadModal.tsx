import { useState, useRef } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/Button";
import {
  handleUploadSubmit,
  testDatabaseConnection,
} from "../../services/uploadService";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BUDAYA_CATEGORIES = [
  "Tari & Seni",
  "Budaya & Tradisi",
  "Rumah Adat",
  "Senjata & Pusaka",
];

export default function UploadModal({
  isOpen,
  onClose,
  onSuccess,
}: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Kingdom uses region for territory and capital is stored as origin.
  const [formData, setFormData] = useState({
    contentType: "budaya",
    title: "",
    description: "",
    category: BUDAYA_CATEGORIES[0],
    year: "",
    region: "",
    capital: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // =========================
  // FILE SELECT
  // =========================
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const dbTest = await testDatabaseConnection();

      if (!dbTest.success) {
        alert(`Database error: ${dbTest.error}`);
        return;
      }

      await handleUploadSubmit(
        selectedFile,
        formData.contentType,
        formData.title,
        formData.category,
        formData.description,
        formData.year,
        formData.region,
        formData.capital
      );

      alert("Content uploaded successfully!");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Upload error:", error);

      alert(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // CLOSE
  // =========================
  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);

    setFormData({
      contentType: "budaya",
      title: "",
      description: "",
      category: BUDAYA_CATEGORIES[0],
      year: "",
      region: "",
      capital: "",
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-3xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-cinzel text-white">
              Upload Content
            </h2>

            <button
              onClick={handleClose}
              className="text-cream/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* FILE */}
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                Image / Video
              </label>

              <div
                className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center cursor-pointer hover:border-gold-elegant/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? (
                  <div className="space-y-4">
                    {selectedFile?.type.startsWith("video/") ? (
                      <video
                        src={preview}
                        controls
                        className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
                      />
                    ) : (
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
                      />
                    )}

                    <p className="text-cream/60 text-sm">
                      Click to change file
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gold-elegant/10 rounded-full flex items-center justify-center mx-auto">
                      <ImageIcon
                        className="text-gold-elegant"
                        size={32}
                      />
                    </div>

                    <div>
                      <p className="text-white font-medium">
                        Click to upload image or video
                      </p>
                      <p className="text-cream/60 text-sm">
                        PNG, JPG, MP4, MOV
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* CONTENT TYPE */}
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                Content Type
              </label>

              <select
                value={formData.contentType}
                onChange={(e) => {
                  const contentType = e.target.value;

                  setFormData({
                    ...formData,
                    contentType,
                    category:
                      contentType === "budaya"
                        ? BUDAYA_CATEGORIES[0]
                        : "",
                    region: contentType === "kerajaan" ? formData.region : "",
                    capital:
                      contentType === "kerajaan" ? formData.capital : "",
                  });
                }}
                className="admin-select w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
              >
                <option value="budaya">Budaya</option>
                <option value="timeline">Timeline</option>
                <option value="syair">Sastra</option>
                <option value="tokoh">Tokoh</option>
                <option value="kerajaan">Kingdom</option>
                <option value="pameran">Exhibition</option>
                <option value="gallery">Gallery</option>
              </select>
            </div>

            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                Title
              </label>

              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                placeholder="Input title..."
                required
              />
            </div>

            {/* YEAR */}
            {["timeline", "tokoh", "kerajaan"].includes(
              formData.contentType
            ) && (
              <div>
                <label className="block text-sm font-medium text-cream/80 mb-2">
                  Year / Period
                </label>

                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      year: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>
            )}

            {formData.contentType === "kerajaan" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cream/80 mb-2">
                    Ibu Kota
                  </label>

                  <input
                    type="text"
                    value={formData.capital}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capital: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                    placeholder="Contoh: Trowulan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cream/80 mb-2">
                    Wilayah
                  </label>

                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        region: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                    placeholder="Contoh: Jawa Timur"
                  />
                </div>
              </div>
            )}

            {/* CATEGORY */}
            {formData.contentType === "budaya" && (
              <div>
                <label className="block text-sm font-medium text-cream/80 mb-2">
                  Category
                </label>

                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                  className="admin-select w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                >
                  {BUDAYA_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                Description
              </label>

              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                rows={5}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white resize-none"
                placeholder="Write description..."
              />
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={uploading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={uploading || !formData.title}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload Content
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
