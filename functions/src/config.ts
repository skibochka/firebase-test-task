import 'dotenv/config';

export const appConfig = {
  storageBucketName: process.env.STORAGE_BUCKET_NAME,
  urlConfigExpires: Date.now() + 1000 * 60 * 60 * 3, // 3h
};
