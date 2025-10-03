// src/App.tsx
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardPage from "./pages/DashboardPage";
import PropertiesPage from "./pages/PropertiesPage";
import InquiriesPage from "./pages/InquiriesPage";
import UsersPage from "./pages/UsersPage";
import ContentManagementPage from "./pages/ContentManagementPage";
import PropertyRequestsPage from "./pages/PropertyRequestsPage";
import FinishingRequestsPage from "./pages/FinishingRequestsPage";
import DecorationsPage from "./pages/DecorationsPage";
import PortfolioPage from "./pages/PortfolioPage";
import LoginPage from "./pages/LoginPage";
import ClientsPage from "./pages/ClientsPage";
import Toast from "./components/Toast";
import { login, getCurrentUser, logout } from "./services/authService";
import { getProperties } from "./services/propertyService";
import { getInquiries } from "./services/inquiryService";
import {
  getPropertyRequests,
  approvePropertyRequest,
  rejectPropertyRequest,
  editAndPublishProperty,
} from "./services/propertyRequestService";
import { getFinishingRequests } from "./services/finishingRequestService";
import { getDecorRequests } from "./services/decorRequestService";
import { getPortfolioItems } from "./services/portfolioService";
import { getStaff } from "./services/staffService";
import { getCustomers } from "./services/customerService";
import { getSiteContent } from "./services/siteContentService";
import type {
  Page,
  Property,
  Inquiry,
  AdminUser,
  PropertyRequest,
  FinishingRequest,
  DecorationRequest,
  PortfolioItem,
  UserRole,
  Client,
  ToastState,
  SiteContent,
} from "./types";
import { mapApiUserToAdminUser } from "./services/mappers";

const PERMISSIONS: Record<UserRole, Page[]> = {
  "مدير عام": [
    "لوحة التحكم",
    "إدارة العقارات",
    "إدارة الاستفسارات",
    "إدارة العملاء",
    "طلبات إضافة العقارات",
    "إدارة التشطيبات",
    "إدارة الديكورات",
    "إدارة معرض الأعمال",
    "إدارة المستخدمين",
    "إدارة المحتوى",
  ],
  "مندوب مبيعات": [
    "لوحة التحكم",
    "إدارة العقارات",
    "إدارة الاستفسارات",
    "إدارة العملاء",
    "طلبات إضافة العقارات",
    "إدارة التشطيبات",
    "إدارة الديكورات",
    "إدارة معرض الأعمال",
  ],
  "محرر محتوى": ["لوحة التحكم", "إدارة معرض الأعمال", "إدارة المحتوى"],
  "مسؤل مبيعات العقارات": [
    "لوحة التحكم",
    "إدارة العقارات",
    "طلبات إضافة العقارات",
    "إدارة الاستفسارات",
    "إدارة العملاء",
  ],
  "مسؤل مبيعات التشطيبات": [
    "لوحة التحكم",
    "إدارة التشطيبات",
    "إدارة معرض الأعمال",
    "إدارة الاستفسارات",
    "إدارة العملاء",
  ],
  "مسؤل مبيعات الديكورات والتحف": [
    "لوحة التحكم",
    "إدارة الديكورات",
    "إدارة معرض الأعمال",
    "إدارة الاستفسارات",
    "إدارة العملاء",
  ],
  منسق: [
    "لوحة التحكم",
    "إدارة الاستفسارات",
    "إدارة العملاء",
    "طلبات إضافة العقارات",
    "إدارة التشطيبات",
    "إدارة الديكورات",
  ],
};
const ROLE_MAP: Record<number, UserRole> = {
  1: "مدير عام",
  2: "مندوب مبيعات",
  3: "محرر محتوى",
  4: "مسؤل مبيعات العقارات",
  5: "مسؤل مبيعات التشطيبات",
  6: "مسؤل مبيعات الديكورات والتحف",
  7: "منسق",
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activePage, setActivePage] = useState<Page>("لوحة التحكم");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  // Centralized State
  const [staff, setStaff] = useState<AdminUser[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [propertyRequests, setPropertyRequests] = useState<PropertyRequest[]>(
    []
  );
  const [finishingRequests, setFinishingRequests] = useState<
    FinishingRequest[]
  >([]);
  const [decorationRequests, setDecorationRequests] = useState<
    DecorationRequest[]
  >([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  const [clients, setClients] = useState<Client[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);

  const loadData = useCallback(async () => {
    if (!currentUser) return;

    setDataLoading(true);
    try {
      // تحميل البيانات الأساسية للجميع
      const basePromises = [
        getProperties(),
        getInquiries(),
        getPropertyRequests(),
      ];

      // تحميل البيانات حسب الصلاحيات
      const roleBasedPromises: Promise<any>[] = [];

      if (PERMISSIONS[currentUser.role].includes("إدارة التشطيبات")) {
        roleBasedPromises.push(getFinishingRequests());
      }

      if (PERMISSIONS[currentUser.role].includes("إدارة الديكورات")) {
        roleBasedPromises.push(getDecorRequests());
      }

      if (PERMISSIONS[currentUser.role].includes("إدارة معرض الأعمال")) {
        roleBasedPromises.push(getPortfolioItems());
      }

      if (PERMISSIONS[currentUser.role].includes("إدارة المستخدمين")) {
        roleBasedPromises.push(getStaff());
      }

      if (PERMISSIONS[currentUser.role].includes("إدارة العملاء")) {
        roleBasedPromises.push(getCustomers());
      }

      if (PERMISSIONS[currentUser.role].includes("إدارة المحتوى")) {
        roleBasedPromises.push(getSiteContent());
      }

      const [propertiesData, inquiriesData, requestsData, ...roleBasedResults] =
        await Promise.all([...basePromises, ...roleBasedPromises]);

      setProperties(propertiesData);
      setInquiries(inquiriesData);
      setPropertyRequests(requestsData);

      // تعيين البيانات حسب الصلاحيات
      let resultIndex = 0;
      if (PERMISSIONS[currentUser.role].includes("إدارة التشطيبات")) {
        setFinishingRequests(roleBasedResults[resultIndex++]);
      }

      if (PERMISSIONS[currentUser.role].includes("إدارة الديكورات")) {
        setDecorationRequests(roleBasedResults[resultIndex++]);
      }

      if (PERMISSIONS[currentUser.role].includes("إدارة معرض الأعمال")) {
        setPortfolioItems(roleBasedResults[resultIndex++]);
      }

      if (PERMISSIONS[currentUser.role].includes("إدارة المستخدمين")) {
        setStaff(roleBasedResults[resultIndex++]);
      }

      if (PERMISSIONS[currentUser.role].includes("إدارة العملاء")) {
        setClients(roleBasedResults[resultIndex++]);
      }

      if (PERMISSIONS[currentUser.role].includes("إدارة المحتوى")) {
        setSiteContent(roleBasedResults[resultIndex]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("حدث خطأ أثناء تحميل البيانات", "error");
    } finally {
      setDataLoading(false);
    }
  }, [currentUser]); // 👈 هي دي الإضافة المهمة

  // التحقق من المستخدم عند تحميل التطبيق
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser() // هذه دالة API تجيب بيانات المستخدم الحالي
        .then((apiUser) => {
          const user = mapApiUserToAdminUser(apiUser);
          setCurrentUser(user);

          const defaultPage = PERMISSIONS[user.role]?.[0] || "لوحة التحكم";
          setActivePage(defaultPage);

          loadData(); // تحميل باقي البيانات
        })
        .catch(() => {
          localStorage.removeItem("token"); // لو التوكن مش صالح
          setCurrentUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // تحميل البيانات عند تغيير المستخدم
  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);
  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [activePage, currentUser, loadData]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleLogin = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await login(email, password); // response = { user, token }

      const user = mapApiUserToAdminUser(response.user); // حول الـ user API لـ AdminUser
      const token = response.token; // أو response.token حسب تعريفك

      localStorage.setItem("token", token);

      // تحديث حالة المستخدم
      setCurrentUser(user);

      // تحديد الصفحة الافتراضية حسب دور المستخدم
      const defaultPage: Page = PERMISSIONS[user.role]?.[0] ?? "لوحة التحكم";
      setActivePage(defaultPage);

      showToast("تم تسجيل الدخول بنجاح", "success");

      return true;
    } catch (error: any) {
      console.error("Login error:", error);

      let errorMessage = "فشل تسجيل الدخول";

      // استخراج رسالة الخطأ من الاستجابة إذا وجدت
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, "error");
      return false;
    }
  };
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setCurrentUser(null);
      // إعادة تعيين جميع الحالات
      setProperties([]);
      setInquiries([]);
      setPropertyRequests([]);
      setFinishingRequests([]);
      setDecorationRequests([]);
      setPortfolioItems([]);
      setStaff([]);
      setClients([]);
      setSiteContent(null);
    }
  };

  const handleApproveRequest = async (request: PropertyRequest) => {
    try {
      const { approvePropertyRequest } = await import(
        "./services/propertyRequestService"
      );
      await approvePropertyRequest(request.id);
      setPropertyRequests((prev) => prev.filter((r) => r.id !== request.id));
      showToast("تمت الموافقة على الطلب ونشره بنجاح.");
      setActivePage("إدارة العقارات");
      loadData(); // تحديث البيانات
    } catch (error) {
      showToast("حدث خطأ أثناء الموافقة على الطلب", "error");
    }
  };

  const handleEditAndApprove = async (
    editedPropertyData: any,
    originalRequestId: number
  ) => {
    try {
      const { editAndPublishProperty } = await import(
        "./services/propertyRequestService"
      );
      await editAndPublishProperty(originalRequestId, editedPropertyData);
      setPropertyRequests((prev) =>
        prev.filter((r) => r.id !== originalRequestId)
      );
      showToast("تم تعديل العقار ونشره بنجاح.");
      setActivePage("إدارة العقارات");
      loadData(); // تحديث البيانات
    } catch (error) {
      showToast("حدث خطأ أثناء تعديل الطلب", "error");
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      const { rejectPropertyRequest } = await import(
        "./services/propertyRequestService"
      );
      await rejectPropertyRequest(requestId);
      setPropertyRequests((prev) => prev.filter((r) => r.id !== requestId));
      showToast("تم رفض الطلب بنجاح.", "success");
    } catch (error) {
      showToast("حدث خطأ أثناء رفض الطلب", "error");
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
          <div className="text-xl text-white">
            غير مصرح لك بالوصول إلى هذه الصفحة
          </div>
        </div>
      );
    }

    // عرض صفحة التحميل أثناء جلب البيانات
    if (dataLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-xl text-white">جاري تحميل البيانات...</div>
        </div>
      );
    }

    switch (activePage) {
      case "لوحة التحكم":
        return (
          <DashboardPage
            setActivePage={setActivePage}
            properties={properties}
            inquiries={inquiries}
            propertyRequests={propertyRequests}
            finishingRequests={finishingRequests}
            decorationRequests={decorationRequests}
            portfolioItems={portfolioItems}
            refreshData={loadData}
          />
        );
      case "إدارة العقارات":
        return (
          <PropertiesPage
            properties={properties}
            setProperties={setProperties}
            showToast={showToast}
            refreshData={loadData}
          />
        );
      case "إدارة الاستفسارات":
        return (
          <InquiriesPage
            inquiries={inquiries}
            setInquiries={setInquiries}
            showToast={showToast}
            refreshData={loadData}
          />
        );
      case "إدارة العملاء":
        return (
          <ClientsPage
            clients={clients}
            setClients={setClients}
            showToast={showToast}
            refreshData={loadData}
          />
        );
      case "طلبات إضافة العقارات":
        return (
          <PropertyRequestsPage
            requests={propertyRequests}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
            onEditAndApprove={handleEditAndApprove}
            showToast={showToast}
          />
        );
      case "إدارة التشطيبات":
        return (
          <FinishingRequestsPage
            requests={finishingRequests}
            setRequests={setFinishingRequests}
            showToast={showToast}
            refreshData={loadData}
          />
        );
      case "إدارة الديكورات":
        return (
          <DecorationsPage
            requests={decorationRequests}
            setRequests={setDecorationRequests}
            portfolioItems={portfolioItems}
            showToast={showToast}
            refreshData={loadData}
          />
        );
      case "إدارة معرض الأعمال":
        return (
          <PortfolioPage
            items={portfolioItems}
            setItems={setPortfolioItems}
            showToast={showToast}
            refreshData={loadData}
          />
        );
      case "إدارة المستخدمين":
        return (
          <UsersPage
            users={staff}
            setUsers={setStaff}
            showToast={showToast}
            refreshData={loadData}
          />
        );
      case "إدارة المحتوى":
        return (
          <ContentManagementPage
            content={siteContent}
            setContent={setSiteContent}
            showToast={showToast}
            refreshData={loadData}
          />
        );
      default:
        return (
          <DashboardPage
            setActivePage={setActivePage}
            properties={[]}
            inquiries={[]}
            propertyRequests={[]}
            finishingRequests={[]}
            decorationRequests={[]}
            portfolioItems={[]}
            refreshData={loadData}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
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
