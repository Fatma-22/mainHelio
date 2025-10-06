import React, { useState, useEffect, useMemo } from 'react';
import type { Client, AdminUser } from '../types';
import { exportToCSV } from '../utils/export';
import { ICONS } from '../constants';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '../services/customerService';

// تعديل الـ Props لاستقبال currentUser فقط
export interface ClientsPageProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const ClientModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Omit<Client, 'id' | 'firstContact'> & { id?: number }) => void;
  client: Client | null;
}> = ({ isOpen, onClose, onSave, client }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  useEffect(() => {
    if (client) {
      setFormData({ 
        name: client.name, 
        phone: client.phone, 
        email: client.email || '', 
        notes: client.notes || '' 
      });
    } else {
      setFormData({ name: '', phone: '', email: '', notes: '' });
    }
  }, [client]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: client?.id });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold mb-6">{client ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">الاسم الكامل</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-700 rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">رقم الهاتف</label>
              <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-700 rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">البريد الإلكتروني (اختياري)</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-700 rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">ملاحظات</label>
            <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} className="w-full bg-gray-700 rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="pt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">إلغاء</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">حفظ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ClientsPage: React.FC<ClientsPageProps> = ({ showToast }) => {
  // إضافة حالة للعملاء داخل الصفحة
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  // إضافة حالة للتحميل
  const [loading, setLoading] = useState(true);

  // تعديل دالة تحديث البيانات
  const refreshData = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setClients(data);
    } catch (err) {
      console.error(err);
      showToast?.('حدث خطأ أثناء جلب العملاء', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [clients, searchTerm]);

  const handleOpenModal = (client: Client | null) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSaveClient = async (data: Omit<Client, 'id' | 'firstContact'> & { id?: number }) => {
    try {
      // إضافة نوع العميل لو مش محدد
      const payload = {
        ...data,
        type: (data as any).type || 'buyer', // default 'buyer'
      };

      if (payload.id) {
        const updatedClient = await updateCustomer(payload.id, payload);
        setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
        showToast?.('تم تعديل العميل بنجاح', 'success');
      } else {
        const newClient = await addCustomer(payload);
        setClients([newClient, ...clients]);
        showToast?.('تم إضافة العميل بنجاح', 'success');
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
      showToast?.('حدث خطأ أثناء حفظ العميل', 'error');
    }
  };

  const handleDeleteClient = async (id: number) => {
    try {
      await deleteCustomer(id);
      setClients(clients.filter(c => c.id !== id));
      showToast?.('تم حذف العميل بنجاح', 'success');
    } catch (error) {
      console.error(error);
      showToast?.('حدث خطأ أثناء حذف العميل', 'error');
    }
  };

  const handleExport = () => exportToCSV(filteredClients, 'clients.csv');

  // إضافة عرض حالة التحميل
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-white">جاري تحميل العملاء...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ClientModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveClient} client={editingClient} />
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">إدارة العملاء</h2>
        <div className="flex gap-4">
          <button onClick={handleExport} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">{ICONS.export}<span>تصدير CSV</span></button>
          <button onClick={() => handleOpenModal(null)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">إضافة عميل جديد</button>
        </div>
      </div>
      <div className="bg-gray-800 p-4 rounded-xl">
        <input type="text" placeholder="ابحث..." className="bg-gray-700 text-white rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="p-4 font-semibold">الاسم</th>
                <th className="p-4 font-semibold">رقم الهاتف</th>
                <th className="p-4 font-semibold">البريد الإلكتروني</th>
                <th className="p-4 font-semibold">أول تواصل</th>
                <th className="p-4 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                  <td className="p-4 font-medium text-white">{client.name}</td>
                  <td className="p-4 text-gray-400">{client.phone}</td>
                  <td className="p-4 text-gray-400">{client.email || '-'}</td>
                  <td className="p-4 text-gray-400">{client.firstContact}</td>
                  <td className="p-4 flex gap-4">
                    <button onClick={() => handleOpenModal(client)} className="text-blue-400 hover:text-blue-300">تعديل</button>
                    <button onClick={() => handleDeleteClient(client.id)} className="text-red-400 hover:text-red-300">حذف</button>
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

export default ClientsPage;
