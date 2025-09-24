
import React from 'react';
import type { AdminUser } from '../types';

interface HeaderProps {
  pageTitle: string;
  currentUser: AdminUser | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ pageTitle, currentUser, onLogout }) => {
  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
      <h2 className="text-2xl font-bold text-white">{pageTitle}</h2>
      <div className="flex items-center space-x-3">
          <div className="text-right">
              <p className="text-white font-semibold">{currentUser?.name}</p>
              <p className="text-xs text-gray-400">{currentUser?.role}</p>
          </div>
           <button onClick={onLogout} className="text-gray-400 hover:text-white transition-colors" title="تسجيل الخروج">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
          </button>
      </div>
    </header>
  );
};

export default Header;