import React, { useEffect } from 'react';
import StatCard from '../components/StatCard';
import { ICONS } from '../constants';
import type { Page, StatCardData, Inquiry, Property, FinishingRequest, DecorationRequest, PropertyRequest, PortfolioItem } from '../types';
import PropertiesByTypeChart from '../components/charts/PropertiesByTypeChart';
import RecentActivity from '../components/RecentActivity';

interface DashboardPageProps {
    setActivePage: (page: Page) => void;
    properties: Property[];
    inquiries: Inquiry[];
    propertyRequests: PropertyRequest[];
    finishingRequests: FinishingRequest[];
    decorationRequests: DecorationRequest[];
    portfolioItems: PortfolioItem[];
    refreshData: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ setActivePage, properties, inquiries, propertyRequests, finishingRequests, decorationRequests, refreshData }) => {
  const listedPropertiesCount = properties.filter(p => p.status === 'للبيع' || p.status === 'للإيجار').length;
  const newServiceRequestsCount = finishingRequests.filter(f => f.status === 'جديد').length + decorationRequests.filter(d => d.status === 'جديد').length;
  const newInquiriesCount = inquiries.filter(i => i.status === 'جديد').length;

  const statCards: StatCardData[] = [
      { title: "إجمالي العقارات المعروضة", value: listedPropertiesCount.toString(), icon: ICONS.totalProperties, pageLink: 'إدارة العقارات' },
      { title: "طلبات الخدمات الجديدة", value: newServiceRequestsCount.toString(), icon: ICONS.newServiceRequests, pageLink: 'إدارة التشطيبات' },
      { title: "رسائل التواصل الجديدة", value: newInquiriesCount.toString(), icon: ICONS.newInquiries, pageLink: 'إدارة الاستفسارات' },
      { title: "عقارات قيد المراجعة", value: propertyRequests.length.toString(), icon: ICONS.pendingRequests, pageLink: 'طلبات إضافة العقارات' },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(card => (
          <StatCard key={card.title} {...card} onClick={setActivePage} />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
             <PropertiesByTypeChart properties={properties} />
        </div>
        <div className="lg:col-span-1">
            <RecentActivity 
                inquiries={inquiries}
                properties={properties}
                propertyRequests={propertyRequests}
                finishingRequests={finishingRequests}
                decorationRequests={decorationRequests}
            />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;