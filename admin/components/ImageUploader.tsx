import React, { useState, useRef, useEffect } from "react";
import { ImageItem } from "../types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Only allow jpeg, jpg, png, gif, bmp, webp
const allowedTypes: string[] = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
];

interface ImageUploaderProps {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  minImages?: number;
  maxImages?: number;
  onUploadComplete?: (uploadedImages: ImageItem[]) => void;
}

const SortableImageItem = ({
  image,
  onRemove,
  isUploading,
  onSetFeatured,
  isFeatured,
  onEditMetadata,
  showFeaturedButton,
}: {
  image: ImageItem;
  onRemove: (id: string) => void;
  isUploading: boolean;
  onSetFeatured: (id: string) => void;
  isFeatured: boolean;
  onEditMetadata: (
    id: string,
    metadata: { altText: string; caption: string }
  ) => void;
  showFeaturedButton: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image.id,
    data: {
      type: "sortable-image",
      id: image.id,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getImageName = () => {
    if (image.file) {
      return image.file.name;
    }
    return image.filename || image.altText || `image-${image.id}`;
  };

  const getImageSize = () => {
    if (image.fileSize) {
      return `${(image.fileSize / 1024 / 1024).toFixed(2)} MB`;
    }
    return "موجود مسبقاً";
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    altText: image.altText || "",
    caption: image.caption || "",
  });

  const handleSaveMetadata = () => {
    onEditMetadata(image.id, editData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      altText: image.altText || "",
      caption: image.caption || "",
    });
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg overflow-hidden bg-gray-800 transition-all ${
        image.isDeleted
          ? "opacity-50 border-red-500"
          : isFeatured
          ? "border-amber-500 ring-2 ring-amber-500/50"
          : "border-gray-700"
      }`}
    >
      <div className="relative">
        <img
          src={image.previewUrl}
          alt={image.altText || "Preview"}
          className="w-full h-48 object-cover"
        />

        {isFeatured && !isUploading && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            مميزة
          </div>
        )}

        {isUploading && image.uploadProgress !== undefined && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto relative">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeDasharray={`${image.uploadProgress}, 100`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">
                  {image.uploadProgress}%
                </span>
              </div>
              <p className="text-white text-xs mt-2">جاري الرفع</p>
            </div>
          </div>
        )}

        {image.isDeleted && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
            <span className="text-red-500 font-bold text-lg">
              سيتم حذف هذه الصورة
            </span>
          </div>
        )}

        <div className="absolute top-2 right-2 flex space-x-1">
          {!isUploading && (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-1.5 bg-blue-500/80 hover:bg-blue-500 text-white rounded-full transition-colors"
                title="تعديل البيانات الوصفية"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-3.172l-1.414-1.414z"
                  />
                </svg>
              </button>

              {showFeaturedButton && (
                <button
                  type="button"
                  onClick={() => onSetFeatured(image.id)}
                  className={`p-1.5 rounded-full transition-colors ${
                    isFeatured
                      ? "bg-amber-500 text-white"
                      : "bg-gray-700/80 text-gray-300 hover:bg-gray-700 hover:text-amber-500"
                  }`}
                  title={isFeatured ? "إلغاء التمييز" : "تعيين كمميزة"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              )}

              <button
                type="button"
                onClick={() => onRemove(image.id)}
                className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
                title="إزالة"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {!isUploading && (
          <div
            className="absolute bottom-2 left-2 cursor-move p-1.5 bg-black/60 backdrop-blur-sm rounded-md hover:bg-black/80 transition-colors"
            {...attributes}
            {...listeners}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-gray-300 truncate">
            {getImageName()}
          </span>
          <span className="text-xs text-gray-500">{getImageSize()}</span>
        </div>

        {image.width && image.height && (
          <div className="text-xs text-gray-500 mb-2">
            {image.width} × {image.height} pixels
          </div>
        )}

        {!isEditing && (
          <div className="mt-2 space-y-1">
            {image.altText && (
              <div className="text-xs text-gray-400">
                <span className="font-medium">النص البديل:</span>{" "}
                {image.altText}
              </div>
            )}
            {image.caption && (
              <div className="text-xs text-gray-400">
                <span className="font-medium">العنوان:</span> {image.caption}
              </div>
            )}
          </div>
        )}

        {isEditing && (
          <div className="mt-2 space-y-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                النص البديل (Alt Text)
              </label>
              <input
                type="text"
                value={editData.altText}
                onChange={(e) =>
                  setEditData({ ...editData, altText: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white"
                placeholder="وصف الصورة للـ SEO"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                العنوان (Caption)
              </label>
              <input
                type="text"
                value={editData.caption}
                onChange={(e) =>
                  setEditData({ ...editData, caption: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white"
                placeholder="عنوان الصورة"
              />
            </div>
            <div className="flex space-x-2 mt-2">
              <button
                type="button"
                onClick={handleSaveMetadata}
                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
              >
                حفظ
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  minImages = 3,
  maxImages = 20,
  onUploadComplete,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.previewUrl && image.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(image.previewUrl);
        }
      });
    };
  }, [images]);

  useEffect(() => {
    if (images.length === 0) {
      resetFileInput();
    }
  }, [images]);

  const validateImage = (
    file: File
  ): Promise<{
    valid: boolean;
    error?: string;
    width?: number;
    height?: number;
  }> => {
    return new Promise((resolve) => {
      console.log("Validating image:", file.name, file.type, file.size);

      if (!allowedTypes.includes(file.type)) {
        resolve({
          valid: false,
          error:
            "نوع الملف غير مدعوم. يرجى استخدام JPEG, JPG, PNG, GIF, BMP أو WebP.",
        });
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        resolve({
          valid: false,
          error: "حجم الملف كبير جدًا. الحد الأقصى هو 5 ميجابايت.",
        });
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        console.log("Image dimensions:", width, height);

        // Removed the aspect ratio check - any dimensions are now accepted
        resolve({ valid: true, width, height });
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        resolve({ valid: false, error: "حدث خطأ أثناء تحميل الصورة." });
      };
    });
  };

  const sanitizeFilename = (filename: string): string => {
    return filename
      .replace(/[^\w\s.-]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (
      e.dataTransfer.types.includes("text/plain") &&
      e.dataTransfer.getData("text/plain").startsWith("sortable-image-")
    ) {
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      console.log("Files dropped:", e.dataTransfer.files);
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("Files selected:", e.target.files);
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setProcessing(true);
    const newImages: ImageItem[] = [];
    const newErrors: Record<string, string> = {};
    let hasValidImage = false;

    if (images.length + files.length > maxImages) {
      setErrors({ general: `الحد الأقصى لعدد الصور هو ${maxImages}.` });
      setProcessing(false);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const id = `image-${Date.now()}-${i}`;

      try {
        const validation = await validateImage(file);

        if (validation.valid && validation.width && validation.height) {
          const sanitizedFilename = sanitizeFilename(file.name);
          const sanitizedFile = new File([file], sanitizedFilename, {
            type: file.type,
            lastModified: file.lastModified,
          });

          const previewUrl = URL.createObjectURL(sanitizedFile);
          const validatedImage: ImageItem = {
            id,
            file: sanitizedFile,
            altText: "",
            caption: "",
            seoKeywords: "",
            previewUrl,
            thumbnailUrl: previewUrl,
            mediumUrl: previewUrl,
            width: validation.width,
            height: validation.height,
            valid: true,
            originalDimensions: {
              width: validation.width,
              height: validation.height,
            },
            filename: sanitizedFilename,
            isFeatured: false,
            isExisting: false,
            isDeleted: false,
            sort: images.length + i,
          };
          newImages.push(validatedImage);
          hasValidImage = true;
        } else {
          newErrors[id] = validation.error || "حدث خطأ أثناء معالجة الصورة.";
        }
      } catch (error) {
        console.error("Error processing image:", error);
        newErrors[id] = "حدث خطأ أثناء معالجة الصورة.";
      }
    }

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages];
      onImagesChange(updatedImages);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    }

    if (hasValidImage && Object.keys(errors).length > 0) {
      setErrors({});
    }

    setProcessing(false);
  };

  const removeImage = (id: string) => {
    const imageToRemove = images.find((image) => image.id === id);

    if (imageToRemove && imageToRemove.isExisting) {
      const updatedImages = images.map((image) => {
        if (image.id === id) {
          return { ...image, isDeleted: true };
        }
        return image;
      });
      onImagesChange(updatedImages);
    } else {
      const updatedImages = images.filter((image) => image.id !== id);
      onImagesChange(updatedImages);
    }

    resetFileInput();

    if (errors[id]) {
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);
    }

    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter((imgId) => imgId !== id));
    }
  };

  const setFeaturedImage = (id: string) => {
    const isCurrentlyFeatured = images.some(
      (img) => img.id === id && img.isFeatured
    );

    const updatedImages = images.map((image) => ({
      ...image,
      // تأكد من أن isFeatured دائمًا boolean
      isFeatured: isCurrentlyFeatured ? false : image.id === id,
    }));

    onImagesChange(updatedImages);
  };

  const editImageMetadata = (
    id: string,
    metadata: { altText: string; caption: string }
  ) => {
    const updatedImages = images.map((image) => {
      if (image.id === id) {
        return {
          ...image,
          altText: metadata.altText,
          caption: metadata.caption,
        };
      }
      return image;
    });

    onImagesChange(updatedImages);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((image) => image.id === active.id);
      const newIndex = images.findIndex((image) => image.id === over.id);

      const updatedImages = arrayMove(images, oldIndex, newIndex);

      const imagesWithUpdatedSort = updatedImages.map((img, index) => ({
        ...img,
        sort: index,
      }));

      onImagesChange(imagesWithUpdatedSort);
    }
  };

  const toggleImageSelection = (id: string) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter((imgId) => imgId !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  const selectAllImages = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map((img) => img.id));
    }
  };

  const deleteSelectedImages = () => {
    let updatedImages = [...images];

    updatedImages = updatedImages.map((image) => {
      if (selectedImages.includes(image.id) && image.isExisting) {
        return { ...image, isDeleted: true };
      }
      return image;
    });

    updatedImages = updatedImages.filter(
      (image) => !(selectedImages.includes(image.id) && !image.isExisting)
    );

    onImagesChange(updatedImages);
    setSelectedImages([]);

    resetFileInput();
  };

  const uploadImages = async () => {
    if (images.length === 0) return;

    if (images.length < minImages) {
      setErrors({ general: `الحد الأدنى لعدد الصور هو ${minImages}.` });
      return;
    }

    setIsUploading(true);

    const imagesWithProgress = images.map((img) => ({
      ...img,
      uploadProgress: 0,
    }));

    onImagesChange(imagesWithProgress);

    const updatedImages = [...imagesWithProgress];

    for (let i = 0; i < updatedImages.length; i++) {
      const image = updatedImages[i];

      if (image.isExisting) {
        image.uploadProgress = 100;
        onImagesChange([...updatedImages]);
        continue;
      }

      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        image.uploadProgress = progress;

        onImagesChange([...updatedImages]);
      }

      image.serverUrl = `https://example.com/uploads/${
        image.filename || image.id
      }`;
      image.thumbnailUrl = `https://example.com/uploads/thumbnails/${
        image.filename || image.id
      }`;
      image.mediumUrl = `https://example.com/uploads/medium/${
        image.filename || image.id
      }`;
      delete image.uploadProgress;
    }

    onImagesChange(updatedImages);
    setIsUploading(false);

    if (onUploadComplete) {
      onUploadComplete(updatedImages);
    }
  };

  const showFeaturedButton = images.length > 1;

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-amber-500 bg-amber-500/10"
            : "border-gray-600 hover:border-amber-500"
        } ${processing || isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept={allowedTypes?.join(",")}
          onChange={handleFileSelect}
          disabled={processing || isUploading}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          {processing || isUploading ? (
            <>
              <svg
                className="animate-spin h-12 w-12 text-amber-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-lg font-medium text-gray-300">
                {isUploading ? "جاري رفع الصور..." : "جاري معالجة الصور..."}
              </p>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <p className="text-lg font-medium text-gray-300">
                اسحب وأفلت الصور هنا
              </p>
              <p className="text-sm text-gray-500">أو انقر لاختيار الصور</p>
              <p className="text-xs text-gray-500 mt-2">
                JPEG, PNG, WebP (بحد أقصى 5 ميجابايت)
              </p>
            </>
          )}
        </div>
      </div>

      {errors.general && (
        <div className="text-red-500 text-sm">{errors.general}</div>
      )}

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-lg font-medium text-gray-300">
                الصور ({images.length})
              </h3>
              {images.length < minImages && (
                <div className="text-red-500 text-sm">
                  الحد الأدنى لعدد الصور هو {minImages}.
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedImages.length > 0 && (
                <button
                  type="button"
                  onClick={deleteSelectedImages}
                  className="px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                  حذف {selectedImages.length} محدد
                </button>
              )}

              <button
                type="button"
                onClick={selectAllImages}
                className="px-3 py-1.5 bg-gray-700 text-gray-300 text-sm rounded hover:bg-gray-600 transition-colors"
              >
                {selectedImages.length === images.length
                  ? "إلغاء تحديد الكل"
                  : "تحديد الكل"}
              </button>

              <button
                type="button"
                onClick={uploadImages}
                disabled={isUploading || images.length === 0}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  isUploading || images.length === 0
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-amber-500 text-gray-900 hover:bg-amber-600"
                }`}
              >
                {isUploading ? "جاري الرفع..." : "رفع الصور"}
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-400 bg-gray-800/50 p-3 rounded-lg">
            {showFeaturedButton && (
              <div className="flex items-center mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2 text-amber-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  انقر على أيقونة النجمة لتحديد صورة مميزة (صورة واحدة فقط)
                </span>
              </div>
            )}
            <div className="flex items-center mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
              <span>اسحب الصور من أيقونة السحب السوداء لإعادة ترتيبها</span>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-3.172l-1.414-1.414z"
                />
              </svg>
              <span>انقر على أيقونة التعديل لتغيير النص البديل والعنوان</span>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((img) => img.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div key={image.id}>
                    <SortableImageItem
                      image={image}
                      onRemove={removeImage}
                      isUploading={isUploading}
                      onSetFeatured={setFeaturedImage}
                      isFeatured={image.isFeatured || false}
                      onEditMetadata={editImageMetadata}
                      showFeaturedButton={showFeaturedButton}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg animate-fadeIn">
          <h4 className="text-red-500 font-medium mb-2">أخطاء</h4>
          <ul className="text-red-500 text-sm space-y-1">
            {Object.entries(errors).map(([id, error]) => (
              <li key={id}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;