import * as path from 'path';
import * as fs from 'fs/promises';

/**
 * Các utility functions làm việc với file
 */

/**
 * Kiểm tra file có tồn tại không
 */
export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

/**
 * Tạo thư mục nếu chưa tồn tại
 */
export const ensureDir = async (dirPath: string): Promise<void> => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if ((error as any).code !== 'EEXIST') throw error;
  }
};

/**
 * Xóa file hoặc thư mục
 */
export const remove = async (filePath: string): Promise<void> => {
  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      await fs.rmdir(filePath, { recursive: true });
    } else {
      await fs.unlink(filePath);
    }
  } catch (error) {
    // File không tồn tại, không cần làm gì
    if ((error as any).code !== 'ENOENT') throw error;
  }
};

/**
 * Lấy extension của file
 */
export const getFileExtension = (fileName: string): string => {
  return path.extname(fileName).toLowerCase();
};

/**
 * Lấy tên file không bao gồm extension
 */
export const getFileName = (filePath: string): string => {
  return path.basename(filePath, path.extname(filePath));
};

/**
 * Kiểm tra file là ảnh
 */
export const isImageFile = (fileName: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'];
  const ext = getFileExtension(fileName);
  return imageExtensions.includes(ext);
};

/**
 * Kiểm tra file là tài liệu
 */
export const isDocumentFile = (fileName: string): boolean => {
  const docExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.xls', '.xlsx', '.ppt', '.pptx'];
  const ext = getFileExtension(fileName);
  return docExtensions.includes(ext);
};

/**
 * Ghi base64 xuống file
 */
export const base64ToFile = async (base64: string, filePath: string): Promise<void> => {
  const buffer = Buffer.from(base64, 'base64');
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, buffer);
};

/**
 * Tạo tên file duy nhất
 */
export const generateUniqueFileName = (originalName: string): string => {
  const ext = getFileExtension(originalName);
  const name = getFileName(originalName);
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${name}_${timestamp}_${random}${ext}`;
};