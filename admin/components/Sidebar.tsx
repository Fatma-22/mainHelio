// src/components/Sidebar.tsx
import React, { memo } from 'react';
import type { Page, AdminUser } from '../types';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  currentUser: AdminUser;
  permissions: Page[];
}

const Sidebar = memo(({ activePage, setActivePage, currentUser, permissions }: SidebarProps) => {
  const menuItems = [
    { id: 'لوحة التحكم', label: 'لوحة التحكم', icon: 'dashboard' },
    { id: 'إدارة العقارات', label: 'إدارة العقارات', icon: 'home' },
    { id: 'إدارة الاستفسارات', label: 'إدارة الاستفسارات', icon: 'question_answer' },
    { id: 'إدارة العملاء', label: 'إدارة العملاء', icon: 'people' },
    { id: 'طلبات إضافة العقارات', label: 'طلبات إضافة العقارات', icon: 'add_home' },
    { id: 'إدارة التشطيبات', label: 'إدارة التشطيبات', icon: 'construction' },
    { id: 'إدارة الديكورات', label: 'إدارة الديكورات', icon: 'brush' },
    { id: 'إدارة معرض الأعمال', label: 'إدارة معرض الأعمال', icon: 'collections' },
    { id: 'إدارة المستخدمين', label: 'إدارة المستخدمين', icon: 'manage_accounts' },
    { id: 'إدارة المحتوى', label: 'إدارة المحتوى', icon: 'article' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">نظام الإدارة</h1>
        <p className="text-sm text-gray-400">مرحباً، {currentUser.name}</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          {menuItems.map((item) => (
            permissions.includes(item.id as Page) && (
              <li key={item.id}>
                <button
                  className={`w-full text-right px-4 py-2 flex items-center ${
                    activePage === item.id ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => setActivePage(item.id as Page)}
                >
                  <span className="ml-2">{item.label}</span>
                </button>
              </li>
            )
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
        <p>الدور: {currentUser.role}</p>
      </div>
    </div>
  );
});

export default Sidebar;