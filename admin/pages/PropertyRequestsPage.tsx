import React, { useState, useEffect } from 'react';
import type { PropertyRequest, Property, ImageItem, ApiImage, AdminUser } from '../types';
import PropertyModal from '../components/PropertyModal';
import { exportToCSV } from '../utils/export';
import { ICONS } from '../constants';
import { mapApiImageToImageItem, mapImageItemToApiImage } from "../services/mappers";
import { getPropertyRequests } from '../services/propertyRequestService';

// تعديل الـ Props لاستقبال currentUser فقط
export interface PropertyRequestsPageProps {
  onApprove: (request: PropertyRequest) => Promise<void>;
  onReject: (requestId: number) => Promise<void>;
  onEditAndApprove: (editedPropertyData: Omit<PropertyRequest, 'id' | 'imageUrl' | 'addedDate'>, originalRequestId: number) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const PropertyRequestsPage: React.FC<PropertyRequestsPageProps> = ({
  onApprove,
  onReject,
  onEditAndApprove,
  showToast
}) => {
  // إضافة حالة للطلبات داخل الصفحة
  const [requests, setRequests] = useState<PropertyRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PropertyRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  // إضافة حالة للتحميل
  const [loading, setLoading] = useState(true);
  
  // دالة مساعدة لتحويل الصور بشكل آمن
  const convertGalleryToImageItems = (gallery: ApiImage[] | ImageItem[] | undefined): ImageItem[] => {
    if (!gallery) return [];
    
    return gallery.map(img => {
      // تحقق إذا كان الكائن لديه خاصية previewUrl (يعني أنه ImageItem)
      if ('previewUrl' in img) {
        return img as ImageItem;
      } else {
        // تحويل من ApiImage إلى ImageItem
        return mapApiImageToImageItem(img as ApiImage);
      }
    });
  };
  
  // دالة للحصول على رابط الصورة بشكل آمن - تعمل مع كلا النوعين
  const getImageUrl = (image: ApiImage | ImageItem): string => {
    if ('previewUrl' in image) {
      // ImageItem
      return image.previewUrl || image.serverUrl || '';
    } else {
      // ApiImage
      return image.url || '';
    }
  };
  
  // دالة للحصول على النص البديل للصورة بشكل آمن - تعمل مع كلا النوعين
  const getImageAlt = (image: ApiImage | ImageItem): string => {
    if ('previewUrl' in image) {
      // ImageItem
      return image.altText || `صورة العقار`;
    } else {
      // ApiImage
      return image.alt_text || `صورة العقار`;
    }
  };

  // دالة للحصول على حالة الصورة المميزة بشكل آمن - تعمل مع كلا النوعين
  const getImageFeatured = (image: ApiImage | ImageItem): boolean => {
    if ("previewUrl" in image) {
      // ImageItem
      return image.isFeatured || false;
    } else {
      // ApiImage
      return image.isfeatured === 1;
    }
  };
  
  // دالة لتحميل بيانات الطلبات
  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getPropertyRequests();
      setRequests(data);
      if (data.length > 0) {
        const first = {
          ...data[0],
          gallery: convertGalleryToImageItems(data[0].gallery)
        };
        setSelectedRequest(first);
      } else {
        setSelectedRequest(null);
      }
    } catch (err) {
      console.error(err);
      showToast?.('حدث خطأ أثناء جلب طلبات العقارات', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // تحميل البيانات عند تحميل الصفحة
  useEffect(() => {
    loadRequests();
  }, []);
  
  // Open modal for editing
  const handleEditClick = () => {
    if (selectedRequest) setIsModalOpen(true);
  };

  // Save edited property and publish
  const handleModalSave = (
    editedData: Omit<PropertyRequest, "id" | "imageUrl" | "gallery"> & {
      id?: number;
      gallery?: ImageItem[];
    }
  ) => {
    if (selectedRequest) {
      // تحويل البيانات إلى النوع المطلوب لـ onEditAndApprove
      const propertyData: Omit<
        PropertyRequest,
        "id" | "imageUrl" | "addedDate"
      > = {
        title: editedData.title,
        videos: editedData.videos,
        address: editedData.address,
        price: editedData.price,
        status: editedData.status,
        type: editedData.type,
        description: editedData.description,
        latitude: editedData.latitude,
        longitude: editedData.longitude,
        googleMapsUrl: editedData.googleMapsUrl,
        isListed: editedData.isListed,
        listingEndDate: editedData.listingEndDate,
        area: editedData.area,
        bedrooms: editedData.bedrooms,
        bathrooms: editedData.bathrooms,
        finish: editedData.finish,
        // إضافة الحقول الجديدة
        keywords: editedData.keywords,
        listingPlane: editedData.listingPlane,
        requesterName: editedData.requesterName,
        requesterPhone: editedData.requesterPhone,
        requestDate: editedData.requestDate,
        gallery: editedData.gallery?.map(mapImageItemToApiImage),
      };

      onEditAndApprove(propertyData, selectedRequest.id);
    }
    setIsModalOpen(false);
  };

  // Export requests to CSV
  const handleExport = () => {
    if (requests.length === 0) {
      showToast("لا توجد طلبات لتصديرها", "error");
      return;
    }
    exportToCSV(requests, "property-requests.csv");
    showToast("تم تصدير الطلبات بنجاح", "success");
  };

  // 🔹 دالة لفتح الصورة المكبرة
  const openEnlargedImage = (previewUrl: string, index: number) => {
    setEnlargedImage(previewUrl);
    setCurrentImageIndex(index);
  };

  // 🔹 دالة لإغلاق الصورة المكبرة
  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  // 🔹 دالة للتنقل بين الصور في العرض المكبر
  const navigateImage = (direction: "next" | "prev") => {
    if (
      !selectedRequest ||
      !selectedRequest.gallery ||
      selectedRequest.gallery.length === 0
    )
      return;

    if (direction === "next") {
      const newIndex = (currentImageIndex + 1) % selectedRequest.gallery.length;
      setCurrentImageIndex(newIndex);
      setEnlargedImage(getImageUrl(selectedRequest.gallery[newIndex]));
    } else {
      const newIndex =
        (currentImageIndex - 1 + selectedRequest.gallery.length) %
        selectedRequest.gallery.length;
      setCurrentImageIndex(newIndex);
      setEnlargedImage(getImageUrl(selectedRequest.gallery[newIndex]));
    }
  };

  // 🔹 دالة لعرض الكلمات المفتاحية كعلامات
  const renderKeywords = () => {
    if (
      !selectedRequest ||
      !selectedRequest.keywords ||
      selectedRequest.keywords.length === 0
    ) {
      return (
        <p className="text-gray-500 italic">لا توجد كلمات مفتاحية محددة</p>
      );
    }

    // تحويل الكلمات المفتاحية إلى مصفوفة إذا كانت نصاً
    const keywords = Array.isArray(selectedRequest.keywords)
      ? selectedRequest.keywords
      : selectedRequest.keywords.split(",").map((k) => k.trim());

    return (
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm"
          >
            {keyword}
          </span>
        ))}
      </div>
    );
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-white">جاري تحميل طلبات العقارات...</div>
      </div>
    );
  }

  return (
    <>
      {selectedRequest && (
        <PropertyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleModalSave}
          property={selectedRequest}
        />
      )}
      <div className="flex h-[calc(100vh-150px)] bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Request List */}
        <div className="w-1/3 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">
                طلبات معلقة ({requests.length})
              </h2>
              <p className="text-sm text-gray-400">اختر طلبًا لمراجعته</p>
            </div>
            <button
              onClick={handleExport}
              title="تصدير كل الطلبات إلى CSV"
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
            >
              {ICONS.export}
            </button>
          </div>
          <ul className="overflow-y-auto flex-1">
            {requests.map((request) => (
              <li
                key={request.id}
                onClick={() => {
                  // استخدام الدالة المساعدة لتحويل الصور
                  setSelectedRequest({
                    ...request,
                    gallery: convertGalleryToImageItems(request.gallery),
                  });
                }}
                className={`p-4 cursor-pointer border-r-4 transition-colors ${
                  selectedRequest?.id === request.id
                    ? "bg-gray-700/50 border-blue-500"
                    : "border-transparent hover:bg-gray-700/30"
                }`}
              >
                <p className="font-bold text-white truncate">{request.title}</p>
                <p className="text-sm text-gray-300 mt-1">
                  مقدم الطلب:{" "}
                  <span className="font-medium">{request.requesterName}</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {request.requestDate}
                </p>
              </li>
            ))}
          </ul>
        </div>
        {/* Request Viewer */}
        <div className="w-2/3 flex flex-col">
          {selectedRequest ? (
            <>
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    مراجعة طلب إضافة عقار
                  </h3>
                  <p className="text-sm text-gray-400">
                    مقدم من:{" "}
                    <span className="font-medium text-blue-400">
                      {selectedRequest.requesterName}
                    </span>{" "}
                    ({selectedRequest.requesterPhone})
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => onReject(selectedRequest.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    رفض
                  </button>
                  <button
                    onClick={handleEditClick}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    تعديل قبل النشر
                  </button>
                  <button
                    onClick={() => onApprove(selectedRequest)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    موافقة ونشر
                  </button>
                </div>
              </div>

              {/* عرض تفاصيل الطلب */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="mb-6">
                  <h4 className="text-md font-bold text-white mb-2">
                    عنوان العقار
                  </h4>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                    <p className="text-gray-300">{selectedRequest.title}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-md font-bold text-white mb-2">
                    وصف العقار
                  </h4>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                    <p className="text-gray-300">
                      {selectedRequest.description}
                    </p>
                  </div>
                </div>

                {/* 🔹 قسم عرض الصور - التعديل الرئيسي هنا */}
                <div className="mb-6">
                  <h4 className="text-md font-bold text-white mb-2">
                    صور العقار
                  </h4>
                  {selectedRequest.gallery &&
                  selectedRequest.gallery.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                      {selectedRequest.gallery.map((image, index) => {
                        // استخدام الدوال المساعدة للحصول على بيانات الصورة
                        const imageUrl = getImageUrl(image);
                        const imageAlt = getImageAlt(image);
                        const isFeatured = getImageFeatured(image);

                        return (
                          <div
                            key={index}
                            className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-900/50 border border-gray-700 aspect-square"
                            onClick={() => openEnlargedImage(imageUrl, index)}
                          >
                            <img
                              src={imageUrl}
                              alt={imageAlt}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {isFeatured && (
                              <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                                مميزة
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-700 flex justify-center items-center">
                      <p className="text-gray-500 italic">
                        لا توجد صور مرفقة مع هذا الطلب
                      </p>
                    </div>
                  )}
                </div>
                {!!selectedRequest?.videos?.length && (
                  <div className="grid grid-cols-3 gap-4">
                    {selectedRequest?.videos.map((video, index) => {
                      return (
                        <div key={video.id || index}>
                          <a
                            href={video?.thumbnail_url}
                            target="_blank"
                            className="flex-shrink-0"
                          >
                            <img
                              src={video?.thumbnail_url}
                              alt="Video thumbnail"
                              className=" size-full object-cover rounded"
                              onError={(e) => {
                                // Fallback to default thumbnail if maxres doesn't exist
                                e.currentTarget.src = video?.thumbnail_url;
                              }}
                            />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-md font-bold text-white mb-2">السعر</h4>
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                      <p className="text-gray-300">{selectedRequest.price}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-bold text-white mb-2">
                      المساحة
                    </h4>
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                      <p className="text-gray-300">{selectedRequest.area} م²</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col h-full">
                    <h4 className="text-md font-bold text-white mb-2">النوع</h4>
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex-1">
                      <p className="text-gray-300">{selectedRequest.type}</p>
                    </div>
                  </div>
                  <div className="flex flex-col h-full">
                    <h4 className="text-md font-bold text-white mb-2">
                      الحالة
                    </h4>
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex-1">
                      <p className="text-gray-300">{selectedRequest.status}</p>
                    </div>
                  </div>
                  <div className="flex flex-col h-full">
                    <h4 className="text-md font-bold text-white mb-2">
                      التشطيب
                    </h4>
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex-1">
                      <p className="text-gray-300">{selectedRequest.finish}</p>
                    </div>
                  </div>
                </div>

                {(selectedRequest.bedrooms || selectedRequest.bathrooms) && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {selectedRequest.bedrooms && (
                      <div>
                        <h4 className="text-md font-bold text-white mb-2">
                          عدد الغرف
                        </h4>
                        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                          <p className="text-gray-300">
                            {selectedRequest.bedrooms}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedRequest.bathrooms && (
                      <div>
                        <h4 className="text-md font-bold text-white mb-2">
                          عدد الحمامات
                        </h4>
                        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                          <p className="text-gray-300">
                            {selectedRequest.bathrooms}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 🔹 قسم عرض الكلمات المفتاحية */}
                <div className="mb-6">
                  <h4 className="text-md font-bold text-white mb-2">
                    الكلمات المفتاحية
                  </h4>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                    {renderKeywords()}
                  </div>
                </div>

                {/* 🔹 قسم عرض خطة العرض */}
                <div className="mb-6">
                  <h4 className="text-md font-bold text-white mb-2">
                    خطة العرض
                  </h4>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                    {selectedRequest.listingPlane ? (
                      <p className="text-gray-300">
                        {selectedRequest.listingPlane}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">
                        لا توجد خطة عرض محددة
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-md font-bold text-white mb-2">العنوان</h4>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                    <p className="text-gray-300">{selectedRequest.address}</p>
                  </div>
                </div>

                {selectedRequest.googleMapsUrl && (
                  <div className="mb-6">
                    <h4 className="text-md font-bold text-white mb-2">
                      رابط خرائط جوجل
                    </h4>
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                      <a
                        href={selectedRequest.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        عرض على الخرائط
                      </a>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-md font-bold text-white mb-2">
                      تاريخ الطلب
                    </h4>
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                      <p className="text-gray-300">
                        {selectedRequest.requestDate}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-bold text-white mb-2">
                      تاريخ انتهاء العرض
                    </h4>
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                      <p className="text-gray-300">
                        {selectedRequest.listingEndDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <p>لا توجد طلبات معلقة</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🔹 نافذة الصورة المكبرة */}
      {enlargedImage && selectedRequest && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeEnlargedImage}
        >
          <div className="relative max-w-4xl max-h-full w-full">
            <button
              className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 z-10 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                closeEnlargedImage();
              }}
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

            {/* أزرار التنقل بين الصور */}
            {selectedRequest.gallery && selectedRequest.gallery.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 z-10 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("prev");
                  }}
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 z-10 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("next");
                  }}
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            <img
              src={enlargedImage}
              alt="صورة مكبرة"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />

            {/* معلومات الصورة الحالية */}
            {selectedRequest.gallery && selectedRequest.gallery.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">
                صورة {currentImageIndex + 1} من {selectedRequest.gallery.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyRequestsPage;
