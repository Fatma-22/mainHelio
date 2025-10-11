import React, { useState, useEffect } from 'react';
import type { AdminUser, UserRole } from '../types';
import { getStaff, createStaff, updateStaff, deleteStaff } from '../services/staffService';
import { getRoles } from "../services/roleService";

// تعديل الـ Props لاستقبال currentUser فقط
export interface UsersPageProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const UserRoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full';
  const roles: Record<UserRole, string> = {
    'مدير عام': 'bg-red-500/20 text-red-400',
    'مندوب مبيعات': 'bg-blue-500/20 text-blue-400',
    'محرر محتوى': 'bg-green-500/20 text-green-400',
    'مسؤل مبيعات العقارات': 'bg-sky-500/20 text-sky-400',
    'مسؤل مبيعات التشطيبات': 'bg-indigo-500/20 text-indigo-400',
    'مسؤل مبيعات الديكورات والتحف': 'bg-purple-500/20 text-purple-400',
    'منسق': 'bg-yellow-500/20 text-yellow-400',
  };
  return <span className={`${baseClasses} ${roles[role] || 'bg-gray-500/20 text-gray-400'}`}>{role}</span>;
};
const roleMap: Record<number, UserRole> = {
  1: 'مدير عام',
  2: 'مندوب مبيعات',
  3: 'محرر محتوى',
  4: 'مسؤل مبيعات العقارات',
  5: 'مسؤل مبيعات التشطيبات',
  6: 'مسؤل مبيعات الديكورات والتحف',
  7: 'منسق',
};

const UserModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<AdminUser, 'id' | 'lastLogin'> & { id?: number; password?: string }) => void;
  user: AdminUser | null;
}> = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    roleId: user?.roleId || 1, // خزن id
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        roleId: user.roleId,   // الرقم
        password: '',
      });
    } else {
      setFormData({ name: '', email: '', roleId: 1, password: '' });
    }
    setErrors({ name: '', email: '', password: '', roleId: '' });
  }, [user]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', password: '', roleId: '' };

    // فالديشن الاسم
    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
      isValid = false;
    }

    // فالديشن الإيميل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
      isValid = false;
    }

    // فالديشن كلمة المرور
    if (!user && !formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
      isValid = false;
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
      isValid = false;
    } else if (formData.password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم';
      isValid = false;
    }

    // فالديشن الصلاحية
    if (!formData.roleId) {
      newErrors.roleId = 'الصلاحية مطلوبة';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: Omit<AdminUser, "id" | "lastLogin"> & {
      id?: number;
      password?: string;
    } = {
      id: user?.id,
      name: formData.name,
      email: formData.email,
      password: formData.password || undefined,
      roleId: formData.roleId,
      role: roleMap[formData.roleId] || 'مندوب مبيعات', 
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" role="dialog" aria-modal="true">
      <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold mb-6">{user ? 'تعديل مستخدم' : 'إضافة مدير جديد'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">الاسم الكامل</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              className={`w-full bg-gray-700 rounded-lg p-3 border ${errors.name ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 outline-none`} 
              required 
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">البريد الإلكتروني</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({ ...formData, email: e.target.value })} 
              className={`w-full bg-gray-700 rounded-lg p-3 border ${errors.email ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 outline-none`} 
              required 
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">كلمة المرور</label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className={`w-full bg-gray-700 rounded-lg p-3 border ${errors.password ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 outline-none`}
              placeholder={user ? 'اتركه فارغًا لعدم التغيير' : 'كلمة مرور قوية'}
              required={!user}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            {!user && !errors.password && (
              <p className="text-gray-400 text-xs mt-1">يجب أن تحتوي على 8 أحرف على الأقل مع حرف كبير وحرف صغير ورقم</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">الصلاحية</label>
            <select 
              value={formData.roleId}  
              onChange={e => setFormData({ ...formData, roleId: Number(e.target.value) })}
              className={`w-full bg-gray-700 rounded-lg p-3 border ${errors.roleId ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 outline-none`}
            >
              <option value={1}>مدير عام</option>
              <option value={2}>مندوب مبيعات</option>
              <option value={3}>محرر محتوى</option>
              <option value={4}>مسؤل مبيعات العقارات</option>
              <option value={5}>مسؤل مبيعات التشطيبات</option>
              <option value={6}>مسؤل مبيعات الديكورات والتحف</option>
              <option value={7}>منسق</option>
            </select>
            {errors.roleId && <p className="text-red-500 text-sm mt-1">{errors.roleId}</p>}
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

const UsersPage: React.FC<UsersPageProps> = ({ showToast }) => {
  // إضافة حالة للمستخدمين داخل الصفحة
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getStaff();
        setUsers(data);
      } catch (err) {
        console.error(err);
        showToast('فشل في جلب بيانات المستخدمين', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleOpenModal = (user: AdminUser | null) => { 
    setEditingUser(user); 
    setIsModalOpen(true); 
  };
  
  const handleCloseModal = () => { 
    setIsModalOpen(false); 
    setEditingUser(null); 
  };

  const handleSaveUser = async (
    data: Omit<AdminUser, "id" | "lastLogin"> & { id?: number; password?: string }
  ) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password || undefined,
        role_id: data.roleId,
      };

      if (data.id) {
        // تعديل مستخدم
        const updated = await updateStaff(data.id, payload);
        setUsers(prev =>
          prev.map(u =>
            u.id === updated.id
              ? { ...updated, role: roleMap[updated.roleId] }
              : u
          )
        );
      } else {
        // إنشاء مستخدم جديد
        await createStaff(payload);

        // إعادة جلب كل المستخدمين بعد الإضافة
        const freshUsers = await getStaff();
        setUsers(freshUsers.map(u => ({ ...u, role: roleMap[u.roleId] })));
      }

      setIsModalOpen(false);
      showToast("تم حفظ المستخدم بنجاح", "success");
    } catch (err) {
      console.error("Error saving user:", err);
      showToast("حدث خطأ أثناء حفظ المستخدم", "error");
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteStaff(id);

      // تحديث فوري
      setUsers(prev => prev.filter(user => user.id !== id));

      // جلب بيانات جديدة للتأكد
      const fresh = await getStaff();
      setUsers(fresh);

      showToast("تم حذف المستخدم بنجاح", "success");
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ أثناء حذف المستخدم", "error");
    }
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-white">جاري تحميل المستخدمين...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveUser} user={editingUser} />
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">إدارة المستخدمين والصلاحيات</h2>
        <button onClick={() => handleOpenModal(null)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">إضافة مدير جديد</button>
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
                  <td className="p-4"><UserRoleBadge role={user.role} /></td>
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