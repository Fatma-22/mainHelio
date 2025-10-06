import React, { useRef, useEffect, useState } from "react";
import type { Language } from "../App";
import { translations } from "../data/translations";
import { inputClasses } from "./shared/FormField";
import ImageUploader from "./ImageUploader"; // استيراد ImageUploader
import { ImageItem, PortfolioItem } from "../types";
import { useAlert } from "../hooks/userAlert";
import { createDecorRequest } from "@/services/decorationRequestsService";

interface DecorationRequestModalProps {
  onClose: () => void;
  serviceTitle: string;
  serviceType: string;
  requestType: "custom" | "similar";
  language: Language;
  item: PortfolioItem;
}

const DecorationRequestModal: React.FC<DecorationRequestModalProps> = ({
  onClose,
  serviceTitle,
  serviceType,
  requestType,
  item,
  language,
}) => {
  const imageUrl = item?.cover_url ?? item?.imageUrl;
  const t = translations[language].decorationRequestModal;
  const modalRef = useRef<HTMLDivElement>(null);
  const { showSuccessAlert, showErrorAlert } = useAlert();

  // state لحفظ بيانات الفورم
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    dimensions: "",
    description: "",
    form: "", // خطأ عام في النموذج
    images: "", // خطأ في رفع الصور
  });

  // تعريف المتغيرات المستخدمة في التحقق من الصحة
  const isWallDecor = serviceType === "wall-decor";
  const isSimilarRequest = requestType === "similar";

  // دالة للتحقق من صحة رقم الهاتف
  // This is a reasonable basic check for phone numbers allowing +, digits, spaces, and dashes, with a length between 10 and 15 (after removing spaces).
  // It is "correct" for a generic phone validation, but may not catch all edge cases for all countries.
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[+]?[\d\s\-]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  // دالة للتحقق من صحة النموذج - جميع الحقول مطلوبة مع تحقق مناسب لكل حقل
  /**
   * Validation logic for the decoration request form.
   * All fields are required:
   * - fullName: required, at least 2 characters
   * - phone: required, must be a valid phone number (digits, +, -, spaces, 10-15 chars)
   * - dimensions: required, at least 2 characters (could be more strict if needed)
   * - description: required, at least 10 characters
   * - images: required (at least 1 image) for custom requests, always required
   */
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      fullName: "",
      phone: "",
      dimensions: "",
      description: "",
      form: "",
      images: "",
    };

    // fullName: required, min 2 chars
    if (!fullName.trim()) {
      newErrors.fullName =
        language === "ar" ? "الاسم الكامل مطلوب" : "Full name is required";
      isValid = false;
    } else if (fullName.trim().length < 2) {
      newErrors.fullName =
        language === "ar"
          ? "الاسم يجب أن يحتوي على حرفين على الأقل"
          : "Name must be at least 2 characters";
      isValid = false;
    }

    // phone: required, valid format
    if (!phone.trim()) {
      newErrors.phone =
        language === "ar" ? "رقم الهاتف مطلوب" : "Phone number is required";
      isValid = false;
    } else if (!validatePhoneNumber(phone)) {
      newErrors.phone =
        language === "ar" ? "رقم هاتف غير صالح" : "Invalid phone number";
      isValid = false;
    }

    // dimensions: required, min 2 chars (you can make this stricter if needed)
    if (isWallDecor) {
      if (!dimensions.trim()) {
        newErrors.dimensions =
          language === "ar" ? "الأبعاد مطلوبة" : "Dimensions are required";
        isValid = false;
      } else if (dimensions.trim().length < 2) {
        newErrors.dimensions =
          language === "ar"
            ? "الأبعاد يجب أن تحتوي على حرفين على الأقل"
            : "Dimensions must be at least 2 characters";
        isValid = false;
      }
    }

    // description: required, min 10 chars
    if (!description.trim()) {
      newErrors.description =
        language === "ar" ? "الوصف مطلوب" : "Description is required";
      isValid = false;
    } else if (description.trim().length < 10) {
      newErrors.description =
        language === "ar"
          ? "الوصف يجب أن يحتوي على 10 أحرف على الأقل"
          : "Description must be at least 10 characters";
      isValid = false;
    }

    // Only require images for custom requests
    if (!isSimilarRequest && images.length === 0) {
      newErrors.images =
        language === "ar"
          ? "يجب رفع صورة واحدة على الأقل"
          : "At least one image is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // دالة لمسح رسائل الخطأ عند تغيير الحقول
  const handleInputChange =
    (
      setter: React.Dispatch<React.SetStateAction<string>>,
      fieldName: keyof typeof errors
    ) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);

      if (errors[fieldName]) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "",
        }));
      }
    };

  // دالة لمعالجة تغييرات الصور
  const handleImagesChange = (newImages: ImageItem[]) => {
    setImages(newImages);

    // مسح رسالة خطأ الصور عند إضافة صور جديدة
    if (errors.images && newImages.length > 0) {
      setErrors((prev) => ({
        ...prev,
        images: "",
      }));
    }
  };

  // باقي الكود كما هو بدون تغيير
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements && focusableElements.length > 0) {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      firstElement.focus();

      const handleTabKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              event.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              event.preventDefault();
            }
          }
        }
      };

      const currentModalRef = modalRef.current;
      currentModalRef?.addEventListener("keydown", handleTabKeyPress);

      return () => {
        document.removeEventListener("keydown", handleTabKeyPress);
        currentModalRef?.removeEventListener("keydown", handleTabKeyPress);
      };
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // mapping بين الأكواد الداخلية والقيم العربية
  const typeMapping: Record<string, string> = {
    "wall-decor": "منحوتات جدارية",
    painting: "لوحات كانفس",
    antique: "تحف ديكورية",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors((prev) => ({ ...prev, form: "" }));
    if (!validateForm()) return;

    setLoading(true);
    try {
      // الحصول على الصورة المميزة إذا وجدت
      const featuredImage = images?.[0];

      // تجهيز بيانات الطلب
      const requestData = {
        clientName: fullName,
        clientPhone: phone,
        type: typeMapping[serviceType] || serviceType,
        details: description + (dimensions ? ` | الأبعاد: ${dimensions}` : ""),
        reference_item_id: requestType === "similar" ? item?.id : null,

        image: featuredImage?.file ?? null,
        altText: featuredImage?.altText ?? null,
        caption: featuredImage?.caption ?? null,
      };
      await createDecorRequest(requestData);

      setFullName("");
      setPhone("");
      setDimensions("");
      setDescription("");
      setImages([]);
      showSuccessAlert(
        translations[language].success.requestSent ||
          (language === "ar"
            ? "تم إرسال طلبك بنجاح!"
            : "Your request has been sent successfully!")
      );

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      // عرض تنبيه الخطأ بدلاً من عرض الخطأ في النموذج
      showErrorAlert(
        (translations[language].errors as any)?.operations
          ?.decorationRequestFailed ||
          (language === "ar"
            ? "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى."
            : "An error occurred while submitting the request. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const subtitle = isSimilarRequest
    ? t.similarRequestSubtitle
    : t.customRequestSubtitle;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <button
            onClick={onClose}
            className={`absolute top-4 ${
              language === "ar" ? "left-4" : "right-4"
            } text-gray-400 hover:text-white transition-colors`}
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

          <h2 className="text-3xl font-bold text-amber-500 mb-2 text-center">
            {serviceTitle}
          </h2>
          <p className="text-gray-400 text-center mb-6">{subtitle}</p>

          {isSimilarRequest && imageUrl && (
            <div className="mb-6 p-4 bg-gray-700/50 rounded-lg flex items-center gap-4 border border-gray-600">
              <img
                src={imageUrl}
                alt="Reference design"
                className="w-20 h-20 object-cover rounded-md"
              />
              <p className="text-sm text-gray-300">
                {t.similarRequestReference}
              </p>
            </div>
          )}

          {errors.form && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-red-400 text-center">{errors.form}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-gray-300 mb-2">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  id="fullName"
                  className={`${inputClasses} ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                  required
                  value={fullName}
                  onChange={handleInputChange(setFullName, "fullName")}
                />
                {errors.fullName && (
                  <p className="mt-1 text-red-500 text-sm">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-300 mb-2">
                  {t.phone}
                </label>
                <input
                  type="tel"
                  id="phone"
                  className={`${inputClasses} ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                  required
                  dir="ltr"
                  value={phone}
                  onChange={handleInputChange(setPhone, "phone")}
                />
                {errors.phone && (
                  <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
            </div>

            {isWallDecor && (
              <div>
                <label
                  htmlFor="dimensions"
                  className="block text-gray-300 mb-2"
                >
                  {t.dimensions}
                </label>
                <input
                  type="text"
                  id="dimensions"
                  placeholder={t.dimensionsPlaceholder}
                  className={`${inputClasses} ${
                    errors.dimensions ? "border-red-500" : ""
                  }`}
                  value={dimensions}
                  onChange={handleInputChange(setDimensions, "dimensions")}
                />
                {errors.dimensions && (
                  <p className="mt-1 text-red-500 text-sm">
                    {errors.dimensions}
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="description" className="block text-gray-300 mb-2">
                {t.description}
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder={t.descriptionPlaceholder}
                className={`${inputClasses} ${
                  errors.description ? "border-red-500" : ""
                }`}
                required
                value={description}
                onChange={handleInputChange(setDescription, "description")}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.description}
                </p>
              )}
            </div>

            {/* حقل رفع الصورة للطلبات المخصصة فقط */}
            {!isSimilarRequest && (
              <div>
                <label className="block text-gray-300 mb-2">
                  {t.attachImage}
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  {t.attachImageHint}
                </p>

                <ImageUploader
                  images={images}
                  onImagesChange={handleImagesChange}
                  minImages={1}
                  maxImages={1}
                  language={language}
                  hideUploadActions={true} // إخفاء أزرار الرفع المباشرة
                />

                {errors.images && (
                  <p className="mt-1 text-red-500 text-sm">{errors.images}</p>
                )}
              </div>
            )}

            {/* معلومات إضافية للطلبات المشابهة */}
            {isSimilarRequest && (
              <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-blue-400 font-medium">
                    {language === "ar" ? "طلب مشابه" : "Similar Request"}
                  </span>
                </div>
                <p className="text-sm text-gray-300">
                  {language === "ar"
                    ? "سيتم استخدام صورة العنصر المرجعي كمرجع للطلب. يمكنك إضافة تفاصيل إضافية في الوصف."
                    : "The reference item's image will be used as a reference for the request. You can add additional details in the description."}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-500 text-gray-900 font-bold px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors duration-200 disabled:opacity-50"
              >
                {loading
                  ? language === "ar"
                    ? "جارٍ الإرسال..."
                    : "Sending..."
                  : t.submitButton}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DecorationRequestModal;
