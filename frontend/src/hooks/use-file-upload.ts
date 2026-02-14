import { useCallback, useRef } from "react";

type UseFileUploadOptions = {
  maxSizeMB?: number;
  /**
   * Accepted file types as MIME types
   * Example: ["image/png", "image/jpeg"]
   */
  accept?: string[];
  onFileSelected?: (file: File) => void;
  onError?: (message: string) => void;
};

/**
 * A custom hook for handling file uploads with validation.
 *
 * @example
 * Component usage:
 * ```tsx
 * export function FileUploadExample() {
 *   const [file, setFile] = useState<File>();
 *
 *   const { inputRef, openFileDialog, onFileChange } = useFileUpload({
 *     maxSizeMB: 2, //MAX_AVATAR_SIZE_MB
 *     accept: ['image/jpeg', 'image/png'], //ALLOWED_IMAGE_TYPES
 *     onFileSelected: setFile,
 *     onError: (msg) => alert(msg),
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={openFileDialog}>Select Image</button>
 *       <input
 *         ref={inputRef}
 *         type="file"
 *         onChange={onFileChange}
 *         accept={ALLOWED_IMAGE_TYPES_STRING}
 *         hidden
 *       />
 *       {file && <p>Selected: {file.name}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useFileUpload(options?: UseFileUploadOptions) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const validateFile = useCallback(
    (file: File) => {
      if (!file) return false;

      if (options?.maxSizeMB) {
        const maxBytes = options.maxSizeMB * 1024 * 1024;
        if (file.size > maxBytes) {
          options?.onError?.(`File vượt quá ${options.maxSizeMB}MB`);
          return false;
        }
      }

      if (options?.accept && options.accept.length > 0) {
        if (!options.accept.includes(file.type)) {
          options?.onError?.(`File type không hợp lệ`);
          return false;
        }
      }

      return true;
    },
    [options],
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) return;

      if (!validateFile(file)) {
        // reset để có thể chọn lại cùng file
        e.target.value = "";
        return;
      }

      options?.onFileSelected?.(file);

      // reset để re-upload cùng file vẫn trigger change
      e.target.value = "";
    },
    [validateFile, options],
  );

  return {
    inputRef,
    openFileDialog,
    onFileChange,
  };
}
