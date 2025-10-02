import React, { useState, useEffect } from "react";
import type { PortfolioItem, DecorationRequestType, AdminUser } from "../types";
import {
  getPortfolioItems,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from "../services/portfolioService";
import ImageUploader from "../components/ImageUploader";

// تعديل الـ Props لاستقبال currentUser فقط
export interface PortfolioPageProps {
  showToast: (message: string, type?: "success" | "error") => void;
}

// Tab configuration
const tabs = [
  { id: "منحوتات جدارية" as DecorationRequestType, label: "منحوتات" },
  { id: "لوحات كانفس" as DecorationRequestType, label: "كانفس" },
  { id: "تحف ديكورية" as DecorationRequestType, label: "ديكورات" },
  { id: "تشطيبات" as DecorationRequestType, label: "تشطيبات" },
];

const PortfolioItemModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    item: Omit<PortfolioItem, "id"> & { id?: number },
    imageFile?: File | null,
    imageData?: { altText?: string; caption?: string }
  ) => void;
  item: PortfolioItem | null;
}> = ({ isOpen, onClose, onSave, item }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "منحوتات جدارية" as DecorationRequestType,
    description: "",
  });
  const [images, setImages] = useState<any[]>([]); // State for uploaded images
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        type: item.type,
        description: item.description || "",
      });
      // If editing an existing item, set the current image
      if (item.imageUrl) {
        setImages([
          {
            id: `existing-${item.id}`,
            previewUrl: item.imageUrl,
            altText: item.altText,
            caption: item.caption,
          },
        ]);
      } else {
        setImages([]);
      }
    } else {
      setFormData({
        title: "",
        type: "منحوتات جدارية",
        description: "",
      });
      setImages([]);
    }
    // Clear errors when modal opens/closes or item changes
    setErrors({});
  }, [item, isOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = "عنوان العمل مطلوب";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "عنوان العمل يجب أن يكون 5 أحرف على الأقل";
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = "وصف العمل مطلوب";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "وصف العمل يجب أن يكون 10 أحرف على الأقل";
    }

    // Validate image
    if (images.length === 0) {
      newErrors.image = "يجب رفع صورة للعمل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let imageFile = null;
      let imageData = null;

      if (images.length > 0) {
        const image = images[0];

        // If it's a new image (has file property), use it
        if (image.file) {
          imageFile = image.file;
          imageData = {
            altText: image.altText || "",
            caption: image.caption || "",
          };
        } else {
          // For existing images, we still need to pass the metadata
          imageData = {
            altText: image.altText || "",
            caption: image.caption || "",
          };
        }
      }

      // Prepare data for saving
      const data = {
        ...formData,
        id: item?.id,
      };

      // Pass both the file and the metadata and wait for completion
      await onSave(data, imageFile, imageData);
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-2xl text-white max-h-[90vh] overflow-y-auto relative">
        {isSubmitting && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-200">
              <svg
                className="animate-spin h-5 w-5 text-blue-400"
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
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>جارٍ الحفظ...</span>
            </div>
          </div>
        )}
        <h2 className="text-2xl font-bold mb-6">
          {item ? "تعديل العمل" : "إضافة عمل جديد"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              عنوان العمل <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`w-full bg-gray-700 rounded-lg p-3 border ${
                errors.title ? "border-red-500" : "border-gray-600"
              } focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-60`}
              required
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              صورة العمل <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {isSubmitting && (
                <div className="absolute inset-0 z-10 bg-transparent cursor-wait" />
              )}
              <ImageUploader
                images={images}
                onImagesChange={(newImages) => {
                  if (isSubmitting) return;
                  setImages(newImages);
                  // Clear error when images are added
                  if (newImages.length > 0 && errors.image) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.image;
                      return newErrors;
                    });
                  }
                }}
                minImages={1}
                maxImages={1}
              />
            </div>
            {errors.image && (
              <p className="mt-1 text-sm text-red-500">{errors.image}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              النوع
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as DecorationRequestType,
                })
              }
              className="w-full bg-gray-700 rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-60"
              disabled={isSubmitting}
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              الوصف <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className={`w-full bg-gray-700 rounded-lg p-3 border ${
                errors.description ? "border-red-500" : "border-gray-600"
              } focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-60`}
              required
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="pt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  جاري الحفظ...
                </>
              ) : (
                "حفظ"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PortfolioPage: React.FC<PortfolioPageProps> = ({ showToast }) => {
  // إضافة حالة للعناصر داخل الصفحة
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [activeTab, setActiveTab] =
    useState<DecorationRequestType>("منحوتات جدارية");
  const [loading, setLoading] = useState(true);

  // جلب البيانات عند التحميل
  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getPortfolioItems();
      setItems(data);
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ أثناء جلب البيانات", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = (item: PortfolioItem | null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = async (
    data: Omit<PortfolioItem, "id"> & { id?: number },
    imageFile?: File | null,
    imageData?: { altText?: string; caption?: string }
  ) => {
    try {
      if (data.id) {
        // Update existing item
        const updated = await updatePortfolioItem(
          data.id,
          data,
          imageFile || undefined,
          imageData
        );
        setItems(items.map((i) => (i.id === updated.id ? updated : i)));
        showToast("تم تعديل العمل بنجاح", "success");
      } else {
        // Create new item - imageFile is required for new items
        if (!imageFile) {
          showToast("يجب رفع صورة للعمل", "error");
          return;
        }
        const created = await createPortfolioItem(data, imageFile, imageData);
        setItems([created, ...items]);
        showToast("تم إضافة العمل بنجاح", "success");
      }
      await fetchItems();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ أثناء الحفظ", "error");
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await deletePortfolioItem(id);
      setItems(items.filter((item) => item.id !== id));
      await fetchItems();
      showToast("تم حذف العمل بنجاح", "success");
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ أثناء الحذف", "error");
    }
  };

  // Filter items based on active tab
  const filteredItems = items.filter((item) => item.type === activeTab);

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-white">جاري تحميل معرض الأعمال...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PortfolioItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        item={editingItem}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">إدارة معرض الأعمال</h2>
        <button
          onClick={() => handleOpenModal(null)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          إضافة عمل جديد
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col group transition-transform duration-300 hover:-translate-y-1"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-sm font-semibold text-blue-400 my-1">
                {item.type}
              </p>
              <p className="text-gray-400 text-sm flex-grow mb-4">
                {item.description}
              </p>
              <div className="mt-auto pt-4 border-t border-gray-700 flex justify-end gap-4">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-red-400 hover:text-red-300 font-semibold transition-colors"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد أعمال في هذا القسم</p>
            <button
              onClick={() => handleOpenModal(null)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              إضافة عمل جديد
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;