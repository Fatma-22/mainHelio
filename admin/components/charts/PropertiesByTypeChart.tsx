import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Property, PropertyType } from '../../types';

interface PropertiesByTypeChartProps {
  propertiesByType: { type: string; count: number }[];
}

const COLORS: Record<PropertyType, string> = {
    'شقة': '#3b82f6',
    'فيلا': '#10b981',
    'أرض': '#f59e0b',
    'تجاري': '#ef4444'
};


const PropertiesByTypeChart: React.FC<PropertiesByTypeChartProps> = ({ propertiesByType }) => {
    const processData = () => {
  return propertiesByType.map(item => ({
    name: item.type as PropertyType,
    value: item.count
  }));
};
    const data = processData();
    
    if (data.length === 0) {
        return (
             <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-96 flex items-center justify-center">
                <p className="text-gray-500">لا توجد بيانات عقارات لعرضها.</p>
            </div>
        )
    }

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-96">
            <h3 className="text-lg font-bold text-white mb-4">العقارات حسب النوع</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#a0a0a0'} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #444444', borderRadius: '0.5rem' }}
                        labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                    />
                    <Legend wrapperStyle={{ color: '#a0a0a0', paddingTop: '20px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PropertiesByTypeChart;
