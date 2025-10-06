import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { ICONS } from '../constants';
import PropertiesByTypeChart from '../components/charts/PropertiesByTypeChart';
import RecentActivity from '../components/RecentActivity';
import type { Page, StatCardData } from '../types';
import { getDashboardStats, DashboardStats } from '../services/dashboardService';
import type {
  Inquiry,
  Property,
  PropertyRequest,
  FinishingRequest,
  DecorationRequest,
} from '../types';

interface DashboardPageProps {
  setActivePage: (page: Page) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ setActivePage }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 🟡 تحميل إحصائيات الداشبورد من الباك إند
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('خطأ أثناء جلب إحصائيات الداشبورد:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">حدث خطأ أثناء تحميل البيانات</p>
      </div>
    );
  }

  // 🟢 كروت الإحصائيات
  const statCards: StatCardData[] = [
    {
      title: 'إجمالي العقارات المنشورة',
      value: stats.totalProperties.toString(),
      icon: ICONS.totalProperties,
      pageLink: 'إدارة العقارات',
    },
    {
      title: 'طلبات الخدمات الجديدة',
      value: stats.newServiceRequests.toString(),
      icon: ICONS.newServiceRequests,
      pageLink: 'إدارة التشطيبات',
    },
    {
      title: 'رسائل التواصل الجديدة',
      value: stats.newInquiries.toString(),
      icon: ICONS.newInquiries,
      pageLink: 'إدارة الاستفسارات',
    },
    {
      title: 'عقارات قيد المراجعة',
      value: stats.pendingPropertyRequests.toString(),
      icon: ICONS.pendingRequests,
      pageLink: 'طلبات إضافة العقارات',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 🟦 كروت الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} onClick={setActivePage} />
        ))}
      </div>

      {/* 🟨 محتوى الصفحة الرئيسي */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* الرسم البياني للعقارات حسب النوع */}
          <PropertiesByTypeChart propertiesByType={stats.propertiesByType} />
        </div>
        <div className="lg:col-span-1">
          {/* نشاط حديث (ممكن تعدلي لاحقًا تجيبي بيانات منفصلة له) */}
       <RecentActivity
          inquiries={stats.latestActivities?.inquiries || []}
          properties={stats.latestActivities?.properties || []}
          propertyRequests={
            (stats.latestActivities?.requests || []).filter(
              (r): r is PropertyRequest => 'requesterName' in r
            )
          }
          finishingRequests={
            (stats.latestActivities?.requests || []).filter(
              (r): r is FinishingRequest => 'clientName' in r && !('image' in r)
            )
          }
          decorationRequests={
            (stats.latestActivities?.requests || []).filter(
              (r): r is DecorationRequest => 'clientName' in r && 'image' in r
            )
          }
        />



        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
