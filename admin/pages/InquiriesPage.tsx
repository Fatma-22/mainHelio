// src/pages/InquiriesPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import type { Inquiry, InquiryStatus, AdminUser } from '../types';
import { exportToCSV } from '../utils/export';
import { ICONS } from '../constants';
import { getInquiries, updateInquiry } from '../services/inquiryService';

export interface InquiriesPageProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const InquiryStatusBadge: React.FC<{ status: Inquiry['status'] }> = ({ status }) => {
  const baseClasses = 'px-2 py-0.5 text-xs font-semibold rounded-full';
  switch (status) {
    case 'جديد':
      return <span className={`${baseClasses} bg-blue-500/20 text-blue-400`}>{status}</span>;
    case 'تم التواصل':
      return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>{status}</span>;
    case 'قيد المتابعة':
      return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>{status}</span>;
    case 'مغلق':
      return <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>{status}</span>;
    default:
      return null;
  }
};

const InquiriesPage: React.FC<InquiriesPageProps> = ({ showToast }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filters, setFilters] = useState({ status: 'الكل', type: 'الكل' });
  const [noteInput, setNoteInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus>('جديد');
  
  // تحميل البيانات عند تحميل الصفحة
  useEffect(() => {
    const loadInquiries = async () => {
      setDataLoading(true);
      try {
        const data = await getInquiries();
        setInquiries(data);
        if (data.length > 0) {
          setSelectedInquiry(data[0]);
          setSelectedStatus(data[0].status);
        }
      } catch (error) {
        console.error('Error loading inquiries:', error);
        showToast('حدث خطأ أثناء تحميل الاستفسارات', 'error');
      } finally {
        setDataLoading(false);
      }
    };

    loadInquiries();
  }, []);
  
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inquiry => {
      const statusMatch = filters.status === 'الكل' || inquiry.status === filters.status;
      const typeMatch = filters.type === 'الكل' || inquiry.type === filters.type;
      return statusMatch && typeMatch;
    });
  }, [inquiries, filters]);
  
  const handleSelectInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setSelectedStatus(inquiry.status);
    if (!inquiry.read) {
      setInquiries(prev => prev.map(i => i.id === inquiry.id ? { ...i, read: true } : i));
    }
    setNoteInput('');
  };
  
  const handleAddNoteWithStatus = async () => {
    if (!selectedInquiry || !noteInput.trim()) {
      showToast('يجب إضافة ملاحظة قبل تحديث الحالة', 'error');
      return;
    }
    
    setLoading(true);
    const newNote = `${new Date().toLocaleString('ar-EG')}:\n${noteInput}`;
    const updatedNotes = selectedInquiry.notes
      ? `${selectedInquiry.notes}\n\n---\n\n${newNote}`
      : newNote;
    
    try {
      await updateInquiry(selectedInquiry.id, { 
        status: selectedStatus, 
        notes: updatedNotes 
      });
      
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === selectedInquiry.id ? { ...inq, status: selectedStatus, notes: updatedNotes } : inq
        )
      );
      
      setSelectedInquiry((prev) => prev ? { ...prev, status: selectedStatus, notes: updatedNotes } : prev);
      setNoteInput('');
      
      showToast('تم تحديث الحالة وإضافة الملاحظة بنجاح', 'success');
    } catch (err) {
      showToast('حدث خطأ أثناء تحديث الحالة والملاحظة', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleExport = () => {
    exportToCSV(filteredInquiries, 'inquiries.csv');
  };
  
  const getNotesCount = (notes: string | undefined): number => {
    if (!notes || notes.trim() === '') return 0;
    const notesArray = notes.split('---').filter(note => note.trim() !== '');
    return notesArray.length;
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-white">جاري تحميل البيانات...</div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-60px)] bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Inquiry List */}
      <div className="w-1/3 border-l border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700 bg-gray-750">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">صندوق الوارد ({filteredInquiries.length})</h2>
            <button 
              onClick={handleExport} 
              title="تصدير القائمة الحالية إلى CSV" 
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors flex items-center gap-1"
            >
              {ICONS.export}
              <span className="text-sm hidden sm:inline">تصدير</span>
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <select 
              className="bg-gray-700 text-white text-sm rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none w-1/2"
              value={filters.status}
              onChange={e => setFilters({...filters, status: e.target.value})}
            >
              <option value="الكل">كل الحالات</option>
              <option>جديد</option>
              <option>تم التواصل</option>
              <option>قيد المتابعة</option>
              <option>مغلق</option>
            </select>
            <select 
              className="bg-gray-700 text-white text-sm rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none w-1/2"
              value={filters.type}
              onChange={e => setFilters({...filters, type: e.target.value})}
            >
              <option value="الكل">كل الأنواع</option>
              <option>استفسار</option>
              <option>شكوى</option>
              <option>اقتراح</option>
            </select>
          </div>
        </div>
        <ul className="overflow-y-auto flex-1">
          {filteredInquiries.map((inquiry) => (
            <li
              key={inquiry.id}
              onClick={() => handleSelectInquiry(inquiry)}
              className={`p-4 cursor-pointer border-r-4 transition-colors ${
                selectedInquiry?.id === inquiry.id
                  ? 'bg-gray-700/50 border-blue-500'
                  : 'border-transparent hover:bg-gray-700/30'
              }`}
            >
              <div className="flex justify-between items-start">
                <p className="font-bold text-white truncate">{inquiry.sender}</p>
                {!inquiry.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-2 animate-pulse"></span>}
              </div>
              <p className="text-sm font-medium text-gray-300 mt-1 truncate">{inquiry.type}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">{inquiry.date}</p>
                <InquiryStatusBadge status={inquiry.status} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Inquiry Viewer */}
      <div className="w-2/3 flex flex-col">
        {selectedInquiry ? (
          <>
            <div className="p-4 border-b border-gray-700 bg-gray-750">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">تفاصيل الاستفسار</h3>
                  <p className="text-sm text-gray-400">
                    من: <span className="font-medium text-blue-400">{selectedInquiry.sender}</span> ({selectedInquiry.phone})
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{selectedInquiry.date}</p>
                </div>
                <InquiryStatusBadge status={selectedInquiry.status} />
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col">
              <div className="mb-6">
                <h4 className="text-md font-bold text-white mb-2">الرسالة</h4>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-md font-bold text-white">الملاحظات السابقة</h4>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                    {getNotesCount(selectedInquiry.notes)} ملاحظة
                  </span>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex-1 overflow-y-auto">
                  {selectedInquiry.notes ? (
                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedInquiry.notes}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">لا توجد ملاحظات سابقة</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-700 bg-gray-800/50">
              <h4 className="text-md font-bold text-white mb-2">إضافة ملاحظة جديدة وتحديث الحالة</h4>
              <div className="relative">
                <textarea 
                  className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={4}
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  placeholder="أضف ملاحظة لتسهيل المتابعة..."
                ></textarea>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <button 
                  onClick={handleAddNoteWithStatus} 
                  disabled={loading || !noteInput.trim()}
                  className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 ${
                    (loading || !noteInput.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      جاري التحديث...
                    </>
                  ) : (
                    <>
                      <span>تحديث الحالة وإضافة ملاحظة</span>
                    </>
                  )}
                </button>
                
                <div className="flex items-center gap-2">
                  <label htmlFor="status" className="text-sm text-gray-400">الحالة الجديدة:</label>
                  <select
                    id="status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as InquiryStatus)}
                    className="bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>جديد</option>
                    <option>تم التواصل</option>
                    <option>قيد المتابعة</option>
                    <option>مغلق</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">اختر استفسارًا لعرض التفاصيل</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiriesPage;