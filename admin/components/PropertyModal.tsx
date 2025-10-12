import React, { useState, useEffect } from "react";
import type {
  PropertyRequest,
  PropertyStatus,
  PropertyType,
  PropertyFinish,
  Property,
} from "../types";
import ImageUploader from "./ImageUploader";
import PropertyVideoManager from "./PropertyVideoManager";
import { ImageItem } from "../types";

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    PropertyRequest: Omit<PropertyRequest, "id" | "imageUrl" | "gallery"> & {
      id?: number;
      images?: File[];
      gallery?: any[];
    }
  ) => void;
  property: Property | PropertyRequest | null;
}

const PropertyModal: React.FC<PropertyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  property,
}) => {
  const formDataInitialize = {
    title: "",
    ownertype: "",
    address: "",
    price: "",
    status: "للبيع" as PropertyStatus,
    type: "شقة" as PropertyType,
    description: "",
    latitude: "",
    longitude: "",
    googleMapsUrl: "",
    isListed: true,
    listingEndDate: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    finish: "" as PropertyFinish | "",
    keywords: "",
    listing_plan: "paid",
    videos: [],
 
  };

  const [formData, setFormData] = useState(formDataInitialize);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (property) {
      // لو فيه جاليري في الـ property أو الـ request
      const imagesArray = Array.isArray((property as any)?.gallery)
        ? (property as any).gallery
        : [];

      setFormData({
        title: property.title || "",
        ownertype: (property as any).ownertype || "",
        address: property.address || "",
        price: property.price || "",
        status: property.status || "للبيع",
        type: property.type || "شقة",
        description: property.description || "",
        latitude: property.latitude?.toString() || "",
        longitude: property.longitude?.toString() || "",
        googleMapsUrl: property.googleMapsUrl || "",
        isListed: property.isListed ? true : false,
        listingEndDate: property.listingEndDate || "",
        area: property.area?.toString() || "",
        bedrooms: property.bedrooms?.toString() || "",
        bathrooms: property.bathrooms?.toString() || "",
        finish: property.finish || "",
        keywords: property.keywords || "",
        listing_plan: (property as any).listing_plan || "paid",
        videos: property?.videos ?? [],
      });

      // تحويل الصور الموجودة لـ ImageItem - هذا الجزء المهم
      if (imagesArray.length > 0) {
        const existingImages: ImageItem[] = imagesArray.map(
          (img: any, index: number) => {
            const filename = img.url?.split("/").pop() || `image-${index}.jpg`;
            return {
              id: `existing-${index}`,
              file: null,
              altText: img.altText || img.alt_text || "",
              previewUrl: img.url || img.previewUrl || "",
              width: 0,
              height: 0,
              valid: true,
              isExisting: true,
              originalId: img.id || index,
              filename: filename,
              sort: img.sort ?? null,
              isFeatured: Boolean(img.isFeatured ?? img.isfeatured ?? false),
            };
          }
        );

        setImages(existingImages);
      } else {
        setImages([]);
      }
    } else {
      // إعادة تعيين النموذج عند فتح النموذج لإضافة عقار جديد
      setFormData(formDataInitialize);
      setImages([]);
      setErrors({});
    }
  }, [property]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // تعريف المتغيرات هنا داخل الدالة
    const showRoomFields = formData.type === "شقة" || formData.type === "فيلا";
    const showFinishField = showRoomFields && formData.status === "للبيع";

    // فاليدشن على عنوان العقار
    if (!formData.title.trim()) {
      newErrors.title = "عنوان العقار مطلوب";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "عنوان العقار يجب أن يكون 5 أحرف على الأقل";
    }

    // فاليدشن على معروض بواسطة
    if (!formData.ownertype.trim()) {
      newErrors.ownertype = "حقل معروض بواسطة مطلوب";
    } else if (formData.ownertype.trim().length < 5) {
      newErrors.ownertype = "معروض بواسطة يجب أن يكون 5 أحرف على الأقل";
    }

    // فاليدشن على العنوان
    if (!formData.address.trim()) {
      newErrors.address = "عنوان العقار مطلوب";
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "العنوان يجب أن يكون 5 أحرف على الأقل";
    }

    // فاليدشن على السعر
    if (!formData.price.trim()) {
      newErrors.price = "سعر العقار مطلوب";
    } else if (isNaN(Number(formData.price))) {
      newErrors.price = "السعر يجب أن يكون رقمًا";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "السعر يجب أن يكون أكبر من صفر";
    } else {
      // التحقق من الحد الأقصى للسعر حسب نوع الإعلان
      const priceValue = Number(formData.price);
      
      if (formData.status === "للإيجار" && priceValue > 300000) {
        newErrors.price = "السعر المسموح به للإيجار لا يجب أن يتجاوز 300,000";
      } else if ((formData.status === "للبيع" || formData.status === "شراكة") && priceValue > 100000000) {
        newErrors.price = "السعر المسموح به للبيع أو الشراكة لا يجب أن يتجاوز 100,000,000";
      }
    }

    // فاليدشن على الوصف
    if (!formData.description.trim()) {
      newErrors.description = "وصف العقار مطلوب";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "الوصف يجب أن يكون 10 أحرف على الأقل";
    }

    // فاليدشن على الصور
    console.log("عدد الصور:", images.length);
    if (images.length < 1) {
      newErrors.images = "يجب رفع على الأقل صورة واحدة";
    }

    // فاليدشن على وجود صورة مميزة
    const featuredImages = images.filter((img) => img.isFeatured);
    console.log("عدد الصور المميزة:", featuredImages.length);
    if (featuredImages.length === 0 && images.length > 1) {
      newErrors.featuredImage = "يجب تحديد صورة مميزة واحدة على الأقل";
    }

    // فاليدشن على نوع التشطيب (إذا كان مطلوبًا)
    if (showFinishField && !formData.finish) {
      newErrors.finish = "نوع التشطيب مطلوب";
    }

    console.log("أخطاء التحقق:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsSaving(true);

    const processedData: any = {
      id: property?.id,
      title: formData.title,
      ownertype: formData.ownertype,
      address: formData.address,
      price: formData.price,
      status: formData.status,
      type: formData.type,
      description: formData.description,
      latitude:
        formData.latitude !== "" ? parseFloat(formData.latitude) : undefined,
      longitude:
        formData.longitude !== "" ? parseFloat(formData.longitude) : undefined,
      googleMapsUrl: formData.googleMapsUrl,
      isListed: formData.isListed ? 1 : 0,
      listingEndDate: formData.listingEndDate,
      area: formData.area !== "" ? parseFloat(formData.area) : undefined,
      bedrooms:
        formData.bedrooms !== "" ? parseInt(formData.bedrooms) : undefined,
      bathrooms:
        formData.bathrooms !== "" ? parseInt(formData.bathrooms) : undefined,
      finish: formData.finish || undefined,
      keywords: formData.keywords,
      listing_plan: formData.listing_plan,
      videos: formData?.videos ?? [],
    };

    // معالجة الصور
    if (images.length > 0) {
      // استخراج الصور الجديدة فقط (التي تحتوي على ملف)
      const newImages = images
        .filter((img) => !img.isExisting && img.file)
        .map((img) => img.file);

      if (newImages.length > 0) {
        processedData.images = newImages;
      }

      // تجهيز بيانات جميع الصور (الموجودة والجديدة)
      const imagesData = images.map((img, index) => {
        const imageData: any = {
          sort: img.sort ?? index,
          isFeatured: img.isFeatured === true,
          altText: img.altText || "",
          caption: img.caption || "",
        };

        // أضف الـ id فقط إذا كانت الصورة موجودة مسبقاً
        if (img.isExisting && img.originalId) {
          imageData.id = img.originalId;
        }

        // أضف _destroy فقط إذا كانت الصورة محذوفة
        if (img.isDeleted) {
          imageData._destroy = true;
        }

        return imageData;
      });

      processedData.imagesData = imagesData;
    }

    console.log("Processed data:", processedData);
    try {
      const maybePromise = onSave(processedData) as any;
      Promise.resolve(maybePromise).finally(() => {
        setIsSaving(false);
        onClose();
        setFormData(formDataInitialize);
        setImages([]);
        setErrors({});
      });
    } catch (err) {
      setIsSaving(false);
    }
  };
  const showRoomFields = formData.type === "شقة" || formData.type === "فيلا";
  const showFinishField = showRoomFields && formData.status === "للبيع";

  // معالجة تغييرات الصور
  const handleImagesChange = (newImages: ImageItem[]) => {
    setImages(newImages);

    // مسح خطأ الصور عند إضافة صور جديدة
    if (newImages.length >= 1 && errors.images) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }

    // مسح خطأ الصورة المميزة عند تحديد صورة مميزة
    const featuredImages = newImages.filter((img) => img.isFeatured);
    if (featuredImages.length > 0 && errors.featuredImage) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.featuredImage;
        return newErrors;
      });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto text-white my-8 relative"
        aria-busy={isSaving}
      >
        {/* زر الإغلاق في الزاوية العلوية اليمنى */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="إغلاق"
          disabled={isSaving}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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

        <h2 className="text-2xl font-bold mb-6 pr-8">
          {property ? "تعديل الطلب" : "إضافة طلب جديد"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              عنوان العقار
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className={`w-full bg-gray-700 border ${
                errors.title ? "border-red-500" : "border-gray-600"
              } rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60`}
              disabled={isSaving}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              معروض بواسطة
            </label>
            <input
              type="text"
              value={formData.ownertype}
              onChange={(e) =>
                setFormData({ ...formData, ownertype: e.target.value })
              }
              required
              className={`w-full bg-gray-700 border ${
                errors.ownertype ? "border-red-500" : "border-gray-600"
              } rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60`}
              disabled={isSaving}
            />
            {errors.ownertype && (
              <p className="mt-1 text-sm text-red-500">{errors.ownertype}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              الوصف
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              disabled={isSaving}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              الكلمات المفتاحية
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) =>
                setFormData({ ...formData, keywords: e.target.value })
              }
              placeholder="مثال: شقة, حي النخبة, قريب من الخدمات"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              disabled={isSaving}
            />
            <p className="text-xs text-gray-400 mt-1">
              اكتب الكلمات المفتاحية مفصولة بفاصلة
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              خطة العرض
            </label>
            <select
              value={formData.listing_plan}
              onChange={(e) =>
                setFormData({ ...formData, listing_plan: e.target.value })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              disabled={isSaving}
            >
              <option value="paid">مدفوع (Paid)</option>
              <option value="commission">عمولة (Commission)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              العنوان
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
              className={`w-full bg-gray-700 border ${
                errors.address ? "border-red-500" : "border-gray-600"
              } rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60`}
              disabled={isSaving}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              السعر
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
              className={`w-full bg-gray-700 border ${
                errors.price ? "border-red-500" : "border-gray-600"
              } rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60`}
              disabled={isSaving}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">{errors.price}</p>
            )}
            {/* نص توضيحي لحدود السعر */}
            <p className="text-xs text-gray-400 mt-1">
              {formData.status === "للإيجار" 
                ? "السعر المسموح به للإيجار لا يجب أن يتجاوز 300,000" 
                : (formData.status === "للبيع" || formData.status === "شراكة") 
                  ? "السعر المسموح به للبيع أو الشراكة لا يجب أن يتجاوز 100,000,000" 
                  : ""}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                الحالة
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as PropertyStatus,
                  })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                disabled={isSaving}
              >
                <option>للبيع</option>
                {formData.type !== "ارض" && (
                  <>
                    <option>للإيجار</option>
                    <option>مؤجر</option>
                  </>
                )}
                <option>مباع</option>
                {formData.type === "ارض" && (
                  <option>شراكة</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                النوع
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as PropertyType,
                  })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                disabled={isSaving}
              >
                <option>شقة</option>
                <option>فيلا</option>
                <option>ارض</option>
                <option>تجاري</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                المساحة (م²)
              </label>
              <input
                type="number"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
                className={`w-full bg-gray-700 border ${
                  errors.area ? "border-red-500" : "border-gray-600"
                } rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60`}
                disabled={isSaving}
              />
              {errors.area && (
                <p className="mt-1 text-sm text-red-500">{errors.area}</p>
              )}
            </div>
            {showRoomFields && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    عدد الغرف
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bedrooms: e.target.value })
                    }
                    className={`w-full bg-gray-700 border ${
                      errors.bedrooms ? "border-red-500" : "border-gray-600"
                    } rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60`}
                    disabled={isSaving}
                  />
                  {errors.bedrooms && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.bedrooms}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    عدد الحمامات
                  </label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bathrooms: e.target.value })
                    }
                    className={`w-full bg-gray-700 border ${
                      errors.bathrooms ? "border-red-500" : "border-gray-600"
                    } rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60`}
                    disabled={isSaving}
                  />
                  {errors.bathrooms && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.bathrooms}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
          {showFinishField && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                نوع التشطيب
              </label>
              <select
                value={formData.finish}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    finish: e.target.value as PropertyFinish,
                  })
                }
                className={`w-full bg-gray-700 border ${
                  errors.finish ? "border-red-500" : "border-gray-600"
                } rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60`}
                disabled={isSaving}
              >
                <option value="">اختار التشطيب</option>
                <option value="تشطيب كامل">تشطيب كامل</option>
                <option value="نص تشطيب">نص تشطيب</option>
                <option value="على الطوب">على الطوب</option>
              </select>
              {errors.finish && (
                <p className="mt-1 text-sm text-red-500">{errors.finish}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              صور العقار
            </label>
            <div className="relative">
              {isSaving && (
                <div className="absolute inset-0 z-10 bg-transparent cursor-wait" />
              )}
              <ImageUploader
                images={images}
                onImagesChange={handleImagesChange}
                minImages={1}
                maxImages={20}
              />
            </div>
            {errors.images && (
              <p className="mt-1 text-sm text-red-500">{errors.images}</p>
            )}
            {errors.featuredImage && (
              <p className="mt-1 text-sm text-red-500">
                {errors.featuredImage}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                خط العرض (Latitude)
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({ ...formData, latitude: e.target.value })
                }
                className={`w-full bg-gray-700 border ${
                  errors.latitude ? "border-red-500" : "border-gray-600"
                } rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60`}
                disabled={isSaving}
              />
              {errors.latitude && (
                <p className="mt-1 text-sm text-red-500">{errors.latitude}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                خط الطول (Longitude)
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({ ...formData, longitude: e.target.value })
                }
                className={`w-full bg-gray-700 border ${
                  errors.longitude ? "border-red-500" : "border-gray-600"
                } rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60`}
                disabled={isSaving}
              />
              {errors.longitude && (
                <p className="mt-1 text-sm text-red-500">{errors.longitude}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              رابط خرائط جوجل
            </label>
            <input
              type="url"
              value={formData.googleMapsUrl}
              onChange={(e) =>
                setFormData({ ...formData, googleMapsUrl: e.target.value })
              }
              placeholder="https://maps.app.goo.gl/..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              disabled={isSaving}
            />
            {errors.googleMapsUrl && (
              <p className="mt-1 text-sm text-red-500">
                {errors.googleMapsUrl}
              </p>
            )}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isListed"
              checked={formData.isListed}
              onChange={(e) =>
                setFormData({ ...formData, isListed: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 bg-gray-700 border border-gray-600 rounded focus:ring-blue-600 focus:ring-2 disabled:opacity-60"
              disabled={isSaving}
            />
            <label
              htmlFor="isListed"
              className="ms-2 text-sm font-medium text-gray-300"
            >
              معروض على الموقع
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              تاريخ انتهاء العرض
            </label>
            <input
              type="date"
              value={formData.listingEndDate}
              onChange={(e) =>
                setFormData({ ...formData, listingEndDate: e.target.value })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              disabled={isSaving}
            />
            {errors.listingEndDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.listingEndDate}
              </p>
            )}
          </div>

          <div className="mt-6">
            <PropertyVideoManager
              loading={isSaving}
              initialVideos={formData?.videos ?? []}
              onVideosChange={(videos) => {
                setFormData({ ...formData, videos });
              }}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              {isSaving ? "جارٍ الحفظ..." : "حفظ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyModal;