export interface UploadOptions {
  folder?: string;
  publicId?: string;
  overwrite?: boolean;
}

export interface UploadResult {
  url: string;
  publicId: string;
}
