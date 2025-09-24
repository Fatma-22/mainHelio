import React from 'react';
import type { Inquiry, Property, FinishingRequest, DecorationRequest, PropertyRequest } from '../types';
import { ICONS } from '../constants';

interface RecentActivityProps {
    inquiries: Inquiry[];
    properties: Property[];
    propertyRequests: PropertyRequest[];
    finishingRequests: FinishingRequest[];
    decorationRequests: DecorationRequest[];
}

type ActivityItem = {
    id: string | number;
    type: 'inquiry' | 'property' | 'propertyRequest' | 'finishingRequest' | 'decorationRequest';
    date: Date;
    text: string;
    subtext: string;
    icon: React.ReactNode;
};

const ActivityIconWrapper: React.FC<{children: React.ReactElement}> = ({ children }) => (
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
        {React.cloneElement(children as React.ReactElement<any>, { className: "h-5 w-5 text-gray-300"})}
    </div>
);

const RecentActivity: React.FC<RecentActivityProps> = ({
    inquiries,
    properties,
    propertyRequests,
    finishingRequests,
    decorationRequests
}) => {

    const combinedActivities: ActivityItem[] = [
        ...inquiries.map(i => ({
            id: `inq-${i.id}`,
            type: 'inquiry' as const,
            date: new Date(i.date),
            text: `استفسار جديد من ${i.sender}`,
            subtext: i.message,
            icon: <ActivityIconWrapper>{ICONS.inquiries}</ActivityIconWrapper>
        })),
        ...properties.map(p => ({
            id: `prop-${p.id}`,
            type: 'property' as const,
            date: new Date(p.addeddate),
            text: `تم إضافة عقار جديد: ${p.title}`,
            subtext: p.address,
            icon: <ActivityIconWrapper>{ICONS.properties}</ActivityIconWrapper>
        })),
        ...propertyRequests.map(pr => ({
            id: `pr-${pr.id}`,
            type: 'propertyRequest' as const,
            date: new Date(pr.requestDate),
            text: `طلب إضافة عقار من ${pr.requesterName}`,
            subtext: pr.title,
            icon: <ActivityIconWrapper>{ICONS.requests}</ActivityIconWrapper>
        })),
        ...finishingRequests.map(fr => ({
            id: `fr-${fr.id}`,
            type: 'finishingRequest' as const,
            date: new Date(fr.requestDate),
            text: `طلب تشطيب جديد من ${fr.clientName}`,
            subtext: fr.type,
            icon: <ActivityIconWrapper>{ICONS.finishing}</ActivityIconWrapper>
        })),
        ...decorationRequests.map(dr => ({
            id: `dr-${dr.id}`,
            type: 'decorationRequest' as const,
            date: new Date(dr.requestDate),
            text: `طلب ديكور جديد من ${dr.clientName}`,
            subtext: dr.type,
            icon: <ActivityIconWrapper>{ICONS.decorations}</ActivityIconWrapper>
        })),
    ];

    const sortedActivities = combinedActivities
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 10);

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full max-h-[500px] flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex-shrink-0">أحدث الأنشطة</h3>
            {sortedActivities.length > 0 ? (
                <ul className="space-y-4 overflow-y-auto">
                    {sortedActivities.map(activity => (
                        <li key={activity.id} className="flex items-start space-x-4 pr-1">
                            {activity.icon}
                            <div className="flex-1">
                                <p className="font-semibold text-white">{activity.text}</p>
                                <p className="text-sm text-gray-400 truncate">{activity.subtext}</p>
                                <p className="text-xs text-gray-500 mt-1">{activity.date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                 <p className="text-gray-500 text-center pt-8">لا توجد أنشطة حديثة.</p>
            )}
        </div>
    );
};

export default RecentActivity;