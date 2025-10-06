// src/App.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import PropertiesPage from './pages/PropertiesPage';
import InquiriesPage from './pages/InquiriesPage';
import UsersPage from './pages/UsersPage';
import ContentManagementPage from './pages/ContentManagementPage';
import PropertyRequestsPage from './pages/PropertyRequestsPage';
import FinishingRequestsPage from './pages/FinishingRequestsPage';
import DecorationsPage from './pages/DecorationsPage';
import PortfolioPage from './pages/PortfolioPage';
import LoginPage from './pages/LoginPage';
import ClientsPage from './pages/ClientsPage';
import Toast from './components/Toast';
import { 
  login, 
  getCurrentUser, 
  logout
} from './services/authService';
import { approvePropertyRequest, rejectPropertyRequest, editAndPublishProperty } from './services/propertyRequestService';
import type { 
  Page, 
  AdminUser, 
  PropertyRequest, 
  UserRole, 
  ToastState
} from './types';
import { mapApiUserToAdminUser } from './services/mappers';

const PERMISSIONS: Record<UserRole, Page[]> = {
  'مدير عام': ['لوحة التحكم', 'إدارة العقارات', 'إدارة الاستفسارات', 'إدارة العملاء', 'طلبات إضافة العقارات', 'إدارة التشطيبات', 'إدارة الديكورات', 'إدارة معرض الأعمال', 'إدارة المستخدمين', 'إدارة المحتوى'],
  'مندوب مبيعات': ['لوحة التحكم', 'إدارة العقارات', 'إدارة الاستفسارات', 'إدارة العملاء', 'طلبات إضافة العقارات', 'إدارة التشطيبات', 'إدارة الديكورات', 'إدارة معرض الأعمال'],
  'محرر محتوى': ['لوحة التحكم', 'إدارة معرض الأعمال', 'إدارة المحتوى'],
  'مسؤل مبيعات العقارات': ['لوحة التحكم', 'إدارة العقارات', 'طلبات إضافة العقارات', 'إدارة الاستفسارات', 'إدارة العملاء'],
  'مسؤل مبيعات التشطيبات': ['لوحة التحكم', 'إدارة التشطيبات', 'إدارة معرض الأعمال', 'إدارة الاستفسارات', 'إدارة العملاء'],
  'مسؤل مبيعات الديكورات والتحف': ['لوحة التحكم', 'إدارة الديكورات', 'إدارة معرض الأعمال', 'إدارة الاستفسارات', 'إدارة العملاء'],
  'منسق': ['لوحة التحكم', 'إدارة الاستفسارات', 'إدارة العملاء', 'طلبات إضافة العقارات', 'إدارة التشطيبات', 'إدارة الديكورات'],
};
const ROLE_MAP: Record<number, UserRole> = {
  1: 'مدير عام',
  2: 'مندوب مبيعات',
  3: 'محرر محتوى',
  4: 'مسؤل مبيعات العقارات',
  5: 'مسؤل مبيعات التشطيبات',
  6: 'مسؤل مبيعات الديكورات والتحف',
  7: 'منسق',
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activePage, setActivePage] = useState<Page>('لوحة التحكم');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [loading, setLoading] = useState(true);
  
  // التحقق من المستخدم عند تحميل التطبيق
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser()
        .then(apiUser => {
          const user = mapApiUserToAdminUser(apiUser);
          setCurrentUser(user);
          const defaultPage = PERMISSIONS[user.role]?.[0] || 'لوحة التحكم';
          setActivePage(defaultPage);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setCurrentUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };
  
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await login(email, password);
      const user = mapApiUserToAdminUser(response.user);
      const token = response.token;
      
      localStorage.setItem('token', token);
      setCurrentUser(user);
      const defaultPage: Page = PERMISSIONS[user.role]?.[0] ?? 'لوحة التحكم';
      setActivePage(defaultPage);
      showToast('تم تسجيل الدخول بنجاح', 'success');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'فشل تسجيل الدخول';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      showToast(errorMessage, 'error');
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setCurrentUser(null);
    }
  };

  const handleApproveRequest = async (request: PropertyRequest) => {
    try {
      await approvePropertyRequest(request.id);
      showToast('تمت الموافقة على الطلب ونشره بنجاح.');
      setActivePage('إدارة العقارات');
    } catch (error) {
      showToast('حدث خطأ أثناء الموافقة على الطلب', 'error');
    }
  };

  const handleEditAndApprove = async (editedPropertyData: any, originalRequestId: number) => {
    try {
      await editAndPublishProperty(originalRequestId, editedPropertyData);
      showToast('تم تعديل العقار ونشره بنجاح.');
      setActivePage('إدارة العقارات');
    } catch (error) {
      showToast('حدث خطأ أثناء تعديل الطلب', 'error');
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      await rejectPropertyRequest(requestId);
      showToast('تم رفض الطلب بنجاح.', 'success');
    } catch (error) {
      showToast('حدث خطأ أثناء رفض الطلب', 'error');
    }
  };

  const hasPermission = (page: Page): boolean => {
    if (!currentUser) return false;
    const allowedPages = PERMISSIONS[currentUser.role] || [];
    return allowedPages.includes(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-xl text-white">جاري التحميل...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    if (!hasPermission(activePage)) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-xl text-white">غير مصرح لك بالوصول إلى هذه الصفحة</div>
        </div>
      );
    }

    switch (activePage) {
      case 'لوحة التحكم':
        return (
          <DashboardPage 
            setActivePage={setActivePage} 
          />
        );
      case 'إدارة العقارات':
        return (
          <PropertiesPage 
            showToast={showToast}
          />
        );
      case 'إدارة الاستفسارات':
        return (
          <InquiriesPage 
            showToast={showToast}
          />
        );
      case 'إدارة العملاء':
        return (
          <ClientsPage 
            showToast={showToast}
          />
        );
      case 'طلبات إضافة العقارات':
        return (
          <PropertyRequestsPage 
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
            onEditAndApprove={handleEditAndApprove}
            showToast={showToast}
          />
        );
      case 'إدارة التشطيبات':
        return (
          <FinishingRequestsPage 
            showToast={showToast}
          />
        );
      case 'إدارة الديكورات':
        return (
          <DecorationsPage 
            showToast={showToast}
          />
        );
      case 'إدارة معرض الأعمال':
        return (
          <PortfolioPage 
            showToast={showToast}
          />
        );
      case 'إدارة المستخدمين':
        return (
          <UsersPage 
            showToast={showToast}
          />
        );
      case 'إدارة المحتوى':
        return (
          <ContentManagementPage 
            showToast={showToast}
          />
        );
      default:
        return <DashboardPage setActivePage={setActivePage}  />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        currentUser={currentUser} 
        permissions={PERMISSIONS[currentUser?.role] || []}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          pageTitle={activePage} 
          currentUser={currentUser} 
          onLogout={handleLogout} 
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
