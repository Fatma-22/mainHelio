import React, { useState, useEffect } from 'react';
import type { AdminUser, UserRole } from '../types';

interface UsersPageProps {
    users: AdminUser[];
    setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
}

const UserRoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full';
    switch (role) {
      case 'مدير عام':
        return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>{role}</span>;
      case 'مندوب مبيعات':
        return <span className={`${baseClasses} bg-blue-500/20 text-blue-400`}>{role}</span>;
      case 'محرر محتوى':
        return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>{role}</span>;
      default:
        return null;
    }
};

const UserModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<AdminUser, 'id' | 'lastLogin'> & { id?: number }) => void;
  user: AdminUser | null;
}> = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'مندوب مبيعات' as UserRole,
  });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, role: user.role });
    } else {
      setFormData({ name: '', email: '', role: 'مندوب مبيعات' });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: user?.id });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold mb-6">{user ? 'تعديل مستخدم' : 'إضافة مدير جديد'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">الاسم الكامل</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-700 rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">البريد الإلكتروني</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-700 rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">الصلاحية</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})} className="w-full bg-gray-700 rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none">
                <option>مندوب مبيعات</option>
                <option>محرر محتوى</option>
                <option>مدير عام</option>
              </select>
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

const UsersPage: React.FC<UsersPageProps> = ({ users, setUsers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const handleOpenModal = (user: AdminUser | null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = (data: Omit<AdminUser, 'id' | 'lastLogin'> & { id?: number }) => {
    if (data.id) { // Editing
      setUsers(users.map(u => u.id === data.id ? { ...u, ...data } : u));
    } else { // Adding
      const newUser: AdminUser = {
        id: Date.now(),
        ...data,
        lastLogin: 'لم يسجل الدخول بعد',
      };
      setUsers([newUser, ...users]);
    }
    handleCloseModal();
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
        setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <UserModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveUser} user={editingUser} />
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">إدارة المستخدمين والصلاحيات</h2>
        <button onClick={() => handleOpenModal(null)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          إضافة مدير جديد
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="p-4 font-semibold">الاسم</th>
                <th className="p-4 font-semibold">البريد الإلكتروني</th>
                <th className="p-4 font-semibold">الصلاحية</th>
                <th className="p-4 font-semibold">آخر تسجيل دخول</th>
                <th className="p-4 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: AdminUser) => (
                <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                  <td className="p-4 font-medium text-white">{user.name}</td>
                  <td className="p-4 text-gray-400">{user.email}</td>
                  <td className="p-4">
                    <UserRoleBadge role={user.role} />
                  </td>
                  <td className="p-4 text-gray-400">{user.lastLogin}</td>
                  <td className="p-4">
                    <div className="flex gap-4">
                      <button onClick={() => handleOpenModal(user)} className="text-blue-400 hover:text-blue-300 transition-colors">تعديل</button>
                      <button onClick={() => handleDeleteUser(user.id)} className="text-red-400 hover:text-red-300 transition-colors">حذف</button>
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

export default UsersPage;