import { supabase } from "../lib/supabase";

// =========================
// CLOUDINARY UPLOAD
// =========================
const uploadToCloudinary = async (
  file: File,
  folder?: string
): Promise<string | null> => {

  const cloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const uploadPreset =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {

    console.error(
      "Cloudinary environment variables are missing"
    );

    return null;

  }

  const formData = new FormData();

  formData.append("file", file);

  formData.append(
    "upload_preset",
    uploadPreset
  );

  if (folder) {

    formData.append("folder", folder);

  }

  try {

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {

      throw new Error(
        data.error?.message ||
          "Cloudinary upload failed"
      );

    }

    return data.secure_url.replace(
      "/upload/",
      "/upload/f_auto,q_auto/"
    );

  } catch (error) {

    console.error(
      "Cloudinary upload error:",
      error
    );

    return null;

  }
};

// =========================
// GENERATE SLUG
// =========================
export const generateSlug = (
  text: string
) => {

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

};

// =========================
// CONTENT TYPE
// =========================
export interface Content {

  id: string;

  title: string;

  slug?: string;

  description?: string;

  content?: string;

  thumbnail?: string;

  category?: string;

  year?: string;

  region?: string;

  origin?: string;

  is_published?: boolean;

  created_at?: string;

  updated_at?: string;

}

const CATEGORY_ALIASES: Record<string, string[]> = {
  budaya: ["budaya", "collections", "relics"],
  collections: ["budaya", "collections", "relics"],
  relics: ["budaya", "collections", "relics"],
  tokoh: ["tokoh", "figures"],
  figures: ["tokoh", "figures"],
  kerajaan: ["kerajaan", "kingdom", "kingdoms"],
  kingdom: ["kerajaan", "kingdom", "kingdoms"],
  kingdoms: ["kerajaan", "kingdom", "kingdoms"],
  syair: ["syair", "manuscripts"],
  manuscripts: ["syair", "manuscripts"],
  pameran: ["pameran", "exhibitions"],
  exhibitions: ["pameran", "exhibitions"],
  timeline: ["timeline"],
  gallery: ["gallery"],
};

const getCategoryAliases = (table: string) =>
  CATEGORY_ALIASES[table] || null;

const RESERVED_SECTION_CATEGORIES = [
  "tokoh",
  "figures",
  "kerajaan",
  "kingdom",
  "kingdoms",
  "syair",
  "manuscripts",
  "timeline",
  "pameran",
  "exhibitions",
  "gallery",
];

const matchesRequestedCategory = (
  item: any,
  table: string
) => {
  if (table === "contents") return true;

  const category = String(
    item?.category || ""
  ).toLowerCase();

  const aliases = getCategoryAliases(table);

  if (!aliases) return true;

  const normalizedAliases = aliases.map((alias) =>
    alias.toLowerCase()
  );

  if (
    ["budaya", "collections", "relics"].includes(
      table
    )
  ) {
    return (
      normalizedAliases.includes(category) ||
      !RESERVED_SECTION_CATEGORIES.includes(category)
    );
  }

  return normalizedAliases.includes(category);
};

export const getImageUrl = (
  item: any,
  fallback = "/placeholder.jpg"
) =>
  item?.thumbnail ||
  item?.image_url ||
  item?.imageUrl ||
  item?.image ||
  item?.src ||
  fallback;

export const getVideoUrl = (item: any) =>
  item?.video_url ||
  item?.videoUrl ||
  item?.video ||
  "";

// =========================
// GET ALL CONTENTS
// =========================
export const getAllDocuments = async <
  T
>(
  table: string = "contents"
): Promise<T[]> => {

  try {

    const query = supabase
      .from("contents")
      .select("*")
      .eq("is_published", true);

    const { data, error } =
      await query.order("created_at", {
        ascending: false,
      });

    if (error) {

      console.error(
        "Error fetching documents:",
        error
      );

      return [];

    }

    return (data || []).filter((item) =>
      matchesRequestedCategory(item, table)
    );

  } catch (error) {

    console.error(
      "Error in getAllDocuments:",
      error
    );

    return [];

  }
};

// =========================
// GET DOCUMENT
// =========================
export const getDocument = async <
  T
>(
  table: string = "contents",
  id: string
): Promise<T | null> => {

  try {

    const query = supabase
      .from("contents")
      .select("*")
      .eq("id", id)
      .eq("is_published", true);

    const { data, error } =
      await query.single();

    if (error) {

      console.error(
        "Error fetching document:",
        error
      );

      return null;

    }

    if (!matchesRequestedCategory(data, table)) {
      return null;
    }

    return data;

  } catch (error) {

    console.error(
      "Error in getDocument:",
      error
    );

    return null;

  }
};

// =========================
// GET BY CATEGORY
// =========================
export const getDocumentsByCategory =
  async <T>(
    category: string
  ): Promise<T[]> => {

    try {

      const { data, error } =
        await supabase
          .from("contents")
          .select("*")
          .eq("is_published", true)
          .eq("category", category)
          .order("created_at", {
            ascending: false,
          });

      if (error) {

        console.error(error);

        return [];

      }

      return data || [];

    } catch (error) {

      console.error(error);

      return [];

    }
  };

// =========================
// CREATE DOCUMENT
// =========================
export const createDocument = async <
  T
>(
  table: string = "contents",
  data: any
): Promise<T | null> => {

  try {

    const now =
      new Date().toISOString();

    const documentData = {

      ...data,

      slug: generateSlug(
        data.title || ""
      ),

      is_published:
        data.is_published ?? true,

      created_at: now,

      updated_at: now,
    };

    const {
      data: result,
      error,
    } = await supabase
      .from(table)
      .insert([documentData])
      .select()
      .single();

    if (error) {

      console.error(
        "Error creating document:",
        error
      );

      return null;

    }

    return result;

  } catch (error) {

    console.error(
      "Error in createDocument:",
      error
    );

    return null;

  }
};

// =========================
// UPDATE DOCUMENT
// =========================
export const updateDocumentById =
  async <T>(
    table: string = "contents",
    id: string,
    updates: Partial<T>
  ): Promise<T | null> => {

    try {

      const updateData = {

        ...updates,

        updated_at:
          new Date().toISOString(),
      };

      const {
        data,
        error,
      } = await supabase
        .from(table)
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {

        console.error(
          "Error updating document:",
          error
        );

        return null;

      }

      return data;

    } catch (error) {

      console.error(
        "Error in updateDocumentById:",
        error
      );

      return null;

    }
  };

// =========================
// DELETE DOCUMENT
// =========================
export const deleteDocumentById =
  async (
    table: string = "contents",
    id: string
  ): Promise<boolean> => {

    try {

      const { error } =
        await supabase
          .from(table)
          .delete()
          .eq("id", id);

      if (error) {

        console.error(
          "Error deleting document:",
          error
        );

        return false;

      }

      return true;

    } catch (error) {

      console.error(
        "Error in deleteDocumentById:",
        error
      );

      return false;

    }
  };

// =========================
// HANDLE UPLOAD SUBMIT
// =========================
export const handleUploadSubmit =
  async (
    file: File | null,
    contentType: string,
    title: string,
    category: string,
    description?: string,
    region?: string,
    origin?: string,
    year?: string
  ) => {

    try {

      let thumbnail = "";

      if (file) {

        const uploaded =
          await uploadToCloudinary(
            file,
            contentType
          );

        thumbnail = uploaded || "";

      }

      const insertData = {

        title: title || "",

        slug: generateSlug(title),

        description:
          description || "",

        content:
          description || "",

        category:
          category ||
          contentType ||
          "umum",

        thumbnail,

        year: year || "",

        region: region || "",

        origin: origin || "",

        is_published: true,

        created_at:
          new Date().toISOString(),

        updated_at:
          new Date().toISOString(),
      };

      console.log(
        "Uploading to contents:",
        insertData
      );

      const { data, error } =
        await supabase
          .from("contents")
          .insert([insertData])
          .select()
          .single();

      if (error) {

        console.error(
          "Supabase insert error:",
          error
        );

        throw new Error(
          error.message
        );

      }

      return data;

    } catch (error) {

      console.error(
        "Upload submit error:",
        error
      );

      throw error;

    }
  };

// =========================
// FILE UPLOAD
// =========================
export const uploadFile = async (
  file: File,
  path: string
): Promise<string | null> => {

  try {

    return await uploadToCloudinary(
      file,
      path
    );

  } catch (error) {

    console.error(
      "Error uploading file:",
      error
    );

    return null;

  }
};
