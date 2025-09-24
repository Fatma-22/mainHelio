import React, { useState, useMemo } from 'react';
import type { Property } from '../types';
import PropertyModal from '../components/PropertyModal';

interface PropertiesPageProps {
    properties: Property[];
    setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
}

// Badge for property status
const PropertyStatusBadge: React.FC<{ status: Property['status'] }> = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full';
  switch (status) {
    case 'للبيع':
      return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>{status}</span>;
    case 'للإيجار':
      return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>{status}</span>;
    case 'مباع':
      return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>{status}</span>;
    case 'مؤجر':
      return <span className={`${baseClasses} bg-purple-500/20 text-purple-400`}>{status}</span>;
    default:
      return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>{status}</span>;
  }
};

// Badge for listing status
const ListingStatusBadge: React.FC<{ isListed: boolean; endDate: string }> = ({ isListed, endDate }) => {
    const isExpired = new Date(endDate) < new Date();
    if (!isListed) {
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-500/20 text-gray-400">متوقف</span>;
    }
    if (isExpired) {
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-500/20 text-orange-400">منتهي</span>;
    }
    return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-teal-500/20 text-teal-400">معروض</span>;
};


// Main page component
const PropertiesPage: React.FC<PropertiesPageProps> = ({ properties, setProperties }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [filters, setFilters] = useState({ search: '', status: 'الكل', type: 'الكل' });

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      const searchMatch = prop.title.toLowerCase().includes(filters.search.toLowerCase()) || prop.address.toLowerCase().includes(filters.search.toLowerCase());
      const statusMatch = filters.status === 'الكل' || prop.status === filters.status;
      const typeMatch = filters.type === 'الكل' || prop.type === filters.type;
      return searchMatch && statusMatch && typeMatch;
    });
  }, [properties, filters]);

  const handleOpenModal = (property: Property | null) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
  };

  const handleSaveProperty = (data: Omit<Property, 'id' | 'imageUrl' | 'addedDate'> & { id?: number }) => {
    if (data.id) { // Editing existing property
      setProperties(properties.map(p => p.id === data.id ? { ...p, ...data } : p));
    } else { // Adding new property
      const newProperty: Property = {
        id: Date.now(),
        ...data,
        imageUrl: `https://picsum.photos/seed/prop${Date.now()}/200/150`,
        addedDate: new Date().toISOString().split('T')[0],
      };
      setProperties([newProperty, ...properties]);
    }
    handleCloseModal();
  };

  const handleDeleteProperty = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العقار؟')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <PropertyModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveProperty} property={editingProperty} />
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">إدارة العقارات</h2>
        <button onClick={() => handleOpenModal(null)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          إضافة عقار جديد
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-xl flex items-center gap-4">
        <input 
          type="text" 
          placeholder="ابحث بالاسم أو العنوان..." 
          className="bg-gray-700 text-white rounded-lg py-2 px-4 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.search}
          onChange={e => setFilters({...filters, search: e.target.value})}
        />
        <select 
          className="bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
          value={filters.status}
          onChange={e => setFilters({...filters, status: e.target.value})}
        >
          <option>الكل</option>
          <option>للبيع</option>
          <option>للإيجار</option>
          <option>مباع</option>
          <option>مؤجر</option>
        </select>
        <select 
          className="bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
          value={filters.type}
          onChange={e => setFilters({...filters, type: e.target.value})}
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
                <th className="p-4 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((prop: Property) => (
                <tr key={prop.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                  <td className="p-4 font-medium text-white">
                    <div className="flex items-center gap-4">
                        <img src={prop.imageUrl} alt={prop.title} className="w-14 h-14 rounded-md object-cover" />
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
                    <ListingStatusBadge isListed={prop.isListed} endDate={prop.listingEndDate} />
                    <p className="text-xs text-gray-500 mt-1">
                        ينتهي في: {prop.listingEndDate}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-4">
                      <button onClick={() => handleOpenModal(prop)} className="text-blue-400 hover:text-blue-300 transition-colors">تعديل</button>
                      <button onClick={() => handleDeleteProperty(prop.id)} className="text-red-400 hover:text-red-300 transition-colors">حذف</button>
                    </div>
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
