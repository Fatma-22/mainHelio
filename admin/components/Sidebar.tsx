import React, { useState, useEffect } from 'react';
import type { Page, AdminUser } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  currentUser: AdminUser;
  permissions: Page[];
}

const NavItem: React.FC<{
  page: Page;
  icon: React.ReactNode;
  activePage: Page;
  onClick: (page: Page) => void;
  isSubItem?: boolean;
}> = ({ page, icon, activePage, onClick, isSubItem = false }) => {
  const isActive = activePage === page;
  return (
    <li>
      <button
        onClick={() => onClick(page)}
        className={`flex items-center w-full my-1 rounded-lg transition-colors duration-200 ${
          isSubItem
            ? 'p-2 text-sm'
            : 'p-3'
        } ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {isSubItem ? React.cloneElement(icon as React.ReactElement<any>, { className: "h-5 w-5" }) : icon}
        <span className={isSubItem ? "mr-3 font-medium" : "mr-4 font-medium"}>{page}</span>
      </button>
    </li>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, currentUser, permissions }) => {
    const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);

    useEffect(() => {
        if (activePage === 'إدارة التشطيبات' || activePage === 'إدارة الديكورات') {
            setIsServicesMenuOpen(true);
        }
    }, [activePage]);
    
    const canView = (page: Page) => {
      if (!currentUser || !permissions) return false;
      return permissions.includes(page);
    };

    const canViewServices = canView('إدارة التشطيبات') || canView('إدارة الديكورات');

    const isServicesActive = activePage === 'إدارة التشطيبات' || activePage === 'إدارة الديكورات';

  return (
    <aside className="w-64 bg-gray-800 flex-shrink-0 p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <div className="bg-blue-600 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mr-3 text-white">ONLY HELIO</h1>
      </div>
      <nav>
        <ul className="space-y-1">
          {canView('لوحة التحكم') && <NavItem page='لوحة التحكم' icon={ICONS.dashboard} activePage={activePage} onClick={setActivePage} />}
          {canView('إدارة العقارات') && <NavItem page='إدارة العقارات' icon={ICONS.properties} activePage={activePage} onClick={setActivePage} />}
          {canView('إدارة الاستفسارات') && <NavItem page='إدارة الاستفسارات' icon={ICONS.inquiries} activePage={activePage} onClick={setActivePage} />}
          {canView('إدارة العملاء') && <NavItem page='إدارة العملاء' icon={ICONS.clients} activePage={activePage} onClick={setActivePage} />}
          {canView('طلبات إضافة العقارات') && <NavItem page='طلبات إضافة العقارات' icon={ICONS.requests} activePage={activePage} onClick={setActivePage} />}

          {/* Services Collapsible Menu */}
          {canViewServices && (
            <li>
                <button
                onClick={() => setIsServicesMenuOpen(!isServicesMenuOpen)}
                className={`flex items-center justify-between w-full p-3 my-1 rounded-lg transition-colors duration-200 ${
                    isServicesActive && !isServicesMenuOpen
                    ? 'text-white bg-gray-700/50'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
                aria-expanded={isServicesMenuOpen}
                >
                <div className="flex items-center">
                    {ICONS.services}
                    <span className="mr-4 font-medium">إدارة الخدمات</span>
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${isServicesMenuOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
                {isServicesMenuOpen && (
                <ul className="pr-5 mt-1 space-y-1">
                    {canView('إدارة التشطيبات') && <NavItem page='إدارة التشطيبات' icon={ICONS.finishing} activePage={activePage} onClick={setActivePage} isSubItem={true} />}
                    {canView('إدارة الديكورات') && <NavItem page='إدارة الديكورات' icon={ICONS.decorations} activePage={activePage} onClick={setActivePage} isSubItem={true} />}
                </ul>
                )}
            </li>
          )}

          {canView('إدارة معرض الأعمال') && <NavItem page='إدارة معرض الأعمال' icon={ICONS.portfolio} activePage={activePage} onClick={setActivePage} />}
          {canView('إدارة المستخدمين') && <NavItem page='إدارة المستخدمين' icon={ICONS.users} activePage={activePage} onClick={setActivePage} />}
          {canView('إدارة المحتوى') && <NavItem page='إدارة المحتوى' icon={ICONS.content} activePage={activePage} onClick={setActivePage} />}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;