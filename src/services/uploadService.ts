import { supabase } from '../lib/supabase';

// =========================
// TEST DATABASE CONNECTION
// =========================
export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('contents')
      .select('*')
      .limit(1);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error',
    };
  }
};

// =========================
// CLOUDINARY UPLOAD
// =========================
export async function uploadToCloudinary(file: File) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary env is missing');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error('Cloudinary ERROR:', data);
    throw new Error(data.error?.message || 'Upload failed');
  }

  return {
    url: data.secure_url,
    resourceType: data.resource_type,
  };
}

// =========================
// HANDLE SUBMIT (FIXED)
// =========================
export const handleUploadSubmit = async (
  file: File | null,
  contentType: string,
  title: string,
  category: string,
  description?: string,
  year?: string,
  region?: string,
  capital?: string
) => {
  try {
    let thumbnail = '';
    let video_url = '';

    // =========================
    // UPLOAD IMAGE
    // =========================
    if (file) {
      const uploaded = await uploadToCloudinary(file);

      if (uploaded.resourceType === "video") {
        video_url = uploaded.url;
      } else {
        thumbnail = uploaded.url;
      }
    }

    // =========================
    // INSERT DATA
    // =========================
    const insertData = {
      title: title || '',
      description: description || '',
      content: description || '',
      category: category || contentType || 'budaya',
      thumbnail,
      video_url,
      year: year || '',
      region: region || '',
      origin: capital || '',
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('UPLOAD DATA:', insertData);

    // =========================
    // INSERT TO SUPABASE
    // =========================
    const { data, error } = await supabase
      .from('contents')
      .insert([insertData])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(error.message);
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Upload submit error:', error);
    throw error;
  }
};
