import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET) {
    console.error('Cloudinary env vars missing');
    return;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const cfg = cloudinary.config();
  console.log('Cloudinary configured:', { cloud_name: cfg.cloud_name, api_key_set: !!cfg.api_key });
};

export { cloudinary }; // export the configured instance
export default connectCloudinary;