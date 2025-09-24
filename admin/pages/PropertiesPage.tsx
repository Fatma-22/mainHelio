import React, { useState, useMemo, useEffect } from 'react';
import type { Property, ImageItem, ApiImage } from '../types';
import PropertyModal from '../components/PropertyModal';
import { exportToCSV } from '../utils/export';
import { ICONS } from '../constants';
import { getProperties, createProperty, updateProperty, deleteProperty } from '../services/propertyService';
import { mapApiImageToImageItem } from '../services/mappers';

export interface PropertiesPageProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

// نوع خاص بالـ UI لتفادي مشاكل TypeScript
type UiProperty = Omit<Property, "gallery"> & { gallery: ImageItem[] };

const PropertyStatusBadge: React.FC<{ status: Property['status'] }> = ({ status }) => {
  const base = 'px-3 py-1 text-xs font-semibold rounded-full';
  switch (status) {
    case 'للبيع': return <span className={`${base} bg-green-500/20 text-green-400`}>{status}</span>;
    case 'للإيجار': return <span className={`${base} bg-yellow-500/20 text-yellow-400`}>{status}</span>;
    case 'مباع': return <span className={`${base} bg-red-500/20 text-red-400`}>{status}</span>;
    case 'مؤجر': return <span className={`${base} bg-purple-500/20 text-purple-400`}>{status}</span>;
    default: return <span className={`${base} bg-gray-500/20 text-gray-400`}>{status}</span>;
  }
};

const ListingStatusBadge: React.FC<{ isListed: boolean; listingEndDate?: string }> = ({ isListed, listingEndDate }) => {
  const expired = listingEndDate ? new Date(listingEndDate) < new Date() : false;
  if (!isListed) return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-500/20 text-gray-400">متوقف</span>;
  if (expired) return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-500/20 text-orange-400">منتهي</span>;
  return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-teal-500/20 text-teal-400">معروض</span>;
};

const PropertiesPage: React.FC<PropertiesPageProps> = ({ showToast }) => {
  const [properties, setProperties] = useState<UiProperty[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<UiProperty | null>(null);
  const [filters, setFilters] = useState({ search: '', status: 'الكل', type: 'الكل' });

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

  // جلب البيانات من السيرفر وتحويل gallery لكل عنصر
  const refreshData = async () => {
    try {
      const data = await getProperties();
      console.log("Raw data from API:", data);
      
      const mapped: UiProperty[] = data.map((prop: Property) => {
        console.log("Property before conversion:", prop);
        const convertedGallery = convertGalleryToImageItems(prop.gallery);
        console.log("Converted gallery:", convertedGallery);
        
        return {
          ...prop,
          gallery: convertedGallery
        };
      });
      
      console.log("Final mapped properties:", mapped);
      setProperties(mapped);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء جلب البيانات', 'error');
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      const searchMatch = prop.title.toLowerCase().includes(filters.search.toLowerCase()) || prop.address.toLowerCase().includes(filters.search.toLowerCase());
      const statusMatch = filters.status === 'الكل' || prop.status === filters.status;
      const typeMatch = filters.type === 'الكل' || prop.type === filters.type;
      return searchMatch && statusMatch && typeMatch;
    });
  }, [properties, filters]);

  const handleOpenModal = (property: UiProperty | null) => {
    if (property) {
      console.log("Opening property for edit:", property);
      console.log("Gallery in property:", property.gallery);
      
      // تأكد من أن الصور محولة بشكل صحيح قبل فتح النموذج
      const convertedProperty = {
        ...property,
        gallery: convertGalleryToImageItems(property.gallery)
      };
      
      console.log("Converted property for modal:", convertedProperty);
      setEditingProperty(convertedProperty);
    } else {
      setEditingProperty(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProperty(null);
    setIsModalOpen(false);
  };

  const handleSaveProperty = async (data: any) => {
  try {
    console.log("handleSaveProperty called with data:", data);
    
    if (data.id) {
      console.log("Updating property with ID:", data.id);
      await updateProperty(data.id, data);
    } else {
      console.log("Creating new property");
      await createProperty(data);
    }
    
    console.log("Property saved successfully, refreshing data");
    await refreshData();
    handleCloseModal();
    showToast('تم حفظ بيانات العقار بنجاح', 'success');
  } catch (err) {
    console.error("Error saving property:", err);
    showToast('حدث خطأ أثناء حفظ العقار', 'error');
  }
};
  const handleDeleteProperty = async (id: number) => {
    try {
      await deleteProperty(id);
      await refreshData();
      showToast('تم حذف العقار بنجاح', 'success');
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حذف العقار', 'error');
    }
  };

  const handleExport = () => exportToCSV(filteredProperties, 'properties.csv');

  return (
    <div className="space-y-6">
      <PropertyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProperty}
        property={editingProperty}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">إدارة العقارات</h2>
        <div className="flex gap-4">
          <button
            onClick={handleExport}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
          >
            {ICONS.export}
            <span>تصدير CSV</span>
          </button>
          <button
            onClick={() => handleOpenModal(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            إضافة عقار جديد
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-xl flex items-center gap-4">
        <input
          type="text"
          placeholder="ابحث بالاسم أو العنوان..."
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
          className="bg-gray-700 text-white rounded-lg py-2 px-4 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
          className="bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option>الكل</option>
          <option>للبيع</option>
          <option>للإيجار</option>
          <option>مباع</option>
          <option>مؤجر</option>
        </select>
        <select
          value={filters.type}
          onChange={e => setFilters({ ...filters, type: e.target.value })}
          className="bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option>الكل</option>
          <option>شقة</option>
          <option>فيلا</option>
          <option>أرض</option>
          <option>تجاري</option>
        </select>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="p-4 font-semibold">العقار</th>
                <th className="p-4 font-semibold">السعر</th>
                <th className="p-4 font-semibold">النوع</th>
                <th className="p-4 font-semibold">الحالة</th>
                <th className="p-4 font-semibold">حالة العرض</th>
                {(filters.type === 'الكل' || filters.type === 'شقة' || filters.type === 'فيلا') && (
                  <>
                    <th className="p-4 font-semibold">الغرف/الحمامات</th>
                    <th className="p-4 font-semibold">التشطيب</th>
                  </>
                )}
                <th className="p-4 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map(prop => (
                <tr key={prop.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                  <td className="p-4 font-medium text-white">
                    <div className="flex items-center gap-4">
                      {prop.gallery && prop.gallery.length > 0 ? (
                        <>
                          {getImageUrl(prop.gallery[0]) ? (
                            <img
                              src={getImageUrl(prop.gallery[0])}
                              alt={getImageAlt(prop.gallery[0])}
                              className="w-14 h-14 rounded-md object-cover"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-md bg-gray-700 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">لا توجد صورة</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-14 h-14 rounded-md bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">لا توجد صورة</span>
                        </div>
                      )}
                      <div>
                        <p className="font-bold">{prop.title}</p>
                        <p className="text-sm text-gray-400">{prop.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{prop.price}</td>
                  <td className="p-4 text-gray-400">{prop.type}</td>
                  <td className="p-4">
                    <PropertyStatusBadge status={prop.status} />
                  </td>
                  <td className="p-4">
                    <ListingStatusBadge
                      isListed={prop.isListed}
                      listingEndDate={prop.listingEndDate}
                    />
                    {prop.listingEndDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        ينتهي في: {prop.listingEndDate}
                      </p>
                    )}
                  </td>
                  {(filters.type === 'الكل' || filters.type === 'شقة' || filters.type === 'فيلا') && (
                    <>
                      <td className="p-4 text-gray-400">
                        {prop.bedrooms || prop.bathrooms ? `${prop.bedrooms || 0}/${prop.bathrooms || 0}` : '-'}
                      </td>
                      <td className="p-4 text-gray-400">
                        {prop.status === 'للبيع' ? (prop.finish || '-') : '-'}
                      </td>
                    </>
                  )}
                  <td className="p-4 flex gap-4">
                    <button
                      onClick={() => handleOpenModal(prop)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(prop.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;