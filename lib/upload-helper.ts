import { fetchApi } from '@/lib/api-config'

export const uploadImageToGallery = async (file: File, title = 'Dashboard Upload') => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('title', title);
  formData.append('description', 'Image uploaded from dashboard');
  
  try {
    const result = await fetchApi('/gallery', {
      method: 'POST',
      body: formData
    });
    // La galería usa 'imageUrl' según tu schema
    return result.imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};