import { memoryStorage } from 'multer';

export const FILE_SIZES_MB = {
  AVATAR: 5,
  IMAGE: 10,
  DOCUMENT: 20,
};

export const ALLOWED_MIMES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENT: ['application/pdf', 'application/msword', 'text/plain'],
};

export const createMulterOptions = (maxSizeMB = FILE_SIZES_MB.AVATAR, allowedMimes = ALLOWED_MIMES.IMAGE) => ({
  storage: memoryStorage(),
  limits: {
    fileSize: maxSizeMB * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error(`File type not allowed. Allowed: ${allowedMimes.join(', ')}`), false);
    }
    cb(null, true);
  },
});
