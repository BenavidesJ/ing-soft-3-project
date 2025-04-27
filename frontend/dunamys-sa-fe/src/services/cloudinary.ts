import axios from 'axios';

const cloudinaryApi = axios.create({
  baseURL: 'https://api.cloudinary.com/v1_1/dh7qptl2n/',
  headers: {},
});

export default cloudinaryApi;

export const uploadImage = async (file: any) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'dunamys');

    formData.append('cloud_name', 'dh7qptl2n');

    return await cloudinaryApi.post('image/upload', formData);
  } catch (error) {
    console.log('Error uploading image to Cloudinary:', error);
  }
};
