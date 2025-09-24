import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Inquiry, Property, FinishingRequest, DecorationRequest, PropertyRequest } from '../../types';

interface WeeklyActivityChartProps {
    inquiries: Inquiry[];
    properties: Property[];
    propertyRequests: PropertyRequest[];
    finishingRequests: FinishingRequest[];
    decorationRequests: DecorationRequest[];
}

const isWithinLast7Days = (date: Date) => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    return date >= sevenDaysAgo && date <= today;
};

const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({ inquiries, properties, propertyRequests, finishingRequests, decorationRequests }) => {
    const processData = () => {
        const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        const today = new Date();
        const data = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dayName = days[date.getDay()];

            const dailyData = {
                name: dayName,
                'استفسارات': 0,
                'عقارات جديدة': 0,
                'طلبات': 0,
            };

            inquiries.forEach(item => {
                if (new Date(item.date).toDateString() === date.toDateString()) {
                    dailyData['استفسارات']++;
                }
            });
            properties.forEach(item => {
                if (new Date(item.addedDate).toDateString() === date.toDateString()) {
                    dailyData['عقارات جديدة']++;
                }
            });
            [...propertyRequests, ...finishingRequests, ...decorationRequests].forEach(item => {
                if (new Date(item.requestDate).toDateString() === date.toDateString()) {
                    dailyData['طلبات']++;
                }
            });
            data.push(dailyData);
        }
        return data;
    };

    const chartData = processData();

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-96">
            <h3 className="text-lg font-bold text-white mb-4">ملخص النشاط الأسبوعي</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                    <XAxis dataKey="name" stroke="#a0a0a0" angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="#a0a0a0" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #444444', borderRadius: '0.5rem' }}
                        labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                    />
                    <Legend wrapperStyle={{ color: '#a0a0a0' }} />
                    <Bar dataKey="استفسارات" fill="#3b82f6" name="استفسارات جديدة" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="عقارات جديدة" fill="#10b981" name="عقارات مضافة" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="طلبات" fill="#f59e0b" name="طلبات متنوعة" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeeklyActivityChart;
