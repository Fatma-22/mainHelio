import React from 'react';
import type { Page, StatCardData } from '../types';

interface StatCardProps extends StatCardData {
    onClick?: (page: Page) => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon, pageLink, onClick }) => {
  const isIncrease = changeType === 'increase';
  const changeColor = isIncrease ? 'text-green-400' : 'text-red-400';

  const handleClick = () => {
    if (pageLink && onClick) {
      onClick(pageLink);
    }
  };

  const cardContent = (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex items-start justify-between h-full">
      <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
        {change && (
          <div className="flex items-center mt-2">
            <span className={`text-sm font-semibold ${changeColor}`}>{change}</span>
            {changeType && <span className="text-xs text-gray-500 mr-2">مقارنة بالشهر الماضي</span>}
          </div>
        )}
      </div>
      <div className="bg-gray-700 p-3 rounded-full">
        {icon}
      </div>
    </div>
  );

  if (pageLink && onClick) {
      return (
        <button onClick={handleClick} className="w-full text-right transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl">
            {cardContent}
        </button>
      )
  }

  return cardContent;
};

export default StatCard;
