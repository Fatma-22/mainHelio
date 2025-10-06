import React, { useState, useMemo, useEffect } from 'react';
import type { FinishingRequest, FinishingRequestStatus, AdminUser } from '../types';
import { exportToCSV } from '../utils/export';
import { ICONS } from '../constants';
import {
  getFinishingRequests,
  updateFinishingRequest,
} from '../services/finishingRequestService';

// تعديل الـ Props لاستقبال currentUser فقط
interface FinishingRequestsPageProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const StatusBadge: React.FC<{ status: FinishingRequestStatus }> = ({ status }) => {
  const baseClasses = 'px-2 py-0.5 text-xs font-semibold rounded-full';
  switch (status) {
    case 'جديد':
      return <span className={`${baseClasses} bg-blue-500/20 text-blue-400`}>{status}</span>;
    case 'تم التواصل':
      return <span className={`${baseClasses} bg-teal-500/20 text-teal-400`}>{status}</span>;
    case 'قيد التنفيذ':
      return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>{status}</span>;
    case 'مكتمل':
      return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>{status}</span>;
    case 'ملغي':
      return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>{status}</span>;
    default:
      return null;
  }
};

const FinishingRequestsPage: React.FC<FinishingRequestsPageProps> = ({ showToast }) => {
  const [requests, setRequests] = useState<FinishingRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<FinishingRequest | null>(null);
  const [filters, setFilters] = useState({ status: 'الكل', type: 'الكل' });
  const [noteInput, setNoteInput] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<FinishingRequestStatus>('جديد');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  
  // 🔹 جلب البيانات من الـ API
  const fetchData = async () => {
    setDataLoading(true);
    try {
      const data = await getFinishingRequests();
      setRequests(data);
      if (data.length > 0) {
        setSelectedRequest(data[0]);
        setSelectedStatus(data[0].status);
      } else {
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('فشل في جلب الطلبات:', error);
      showToast('فشل في جلب البيانات', 'error');
    } finally {
      setDataLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const statusMatch = filters.status === 'الكل' || request.status === filters.status;
      const typeMatch = filters.type === 'الكل' || request.type === filters.type;
      return statusMatch && typeMatch;
    });
  }, [requests, filters]);
  
  const handleSelectRequest = (request: FinishingRequest) => {
    setSelectedRequest(request);
    setSelectedStatus(request.status);
    setNoteInput('');
  };
  
  // دمج تغيير الحالة مع إضافة الملاحظة
  const handleAddNoteWithStatus = async () => {
    if (!selectedRequest || !noteInput.trim()) {
      showToast('يجب إضافة ملاحظة قبل تحديث الحالة', 'error');
      return;
    }
    
    setLoading(true);
    const newNote = `${new Date().toLocaleString('ar-EG')}:\n${noteInput}`;
    const updatedNotes = selectedRequest.notes
      ? `${selectedRequest.notes}\n\n---\n\n${newNote}`
      : newNote;
    
    try {
      // تحديث الحالة والملاحظات معاً
      await updateFinishingRequest(selectedRequest.id, { 
        status: selectedStatus, 
        notes: updatedNotes 
      });
      
      // تحديث الحالة محلياً
      const updated: FinishingRequest = {
        ...selectedRequest,
        status: selectedStatus,
        notes: updatedNotes,
      };
      
      // تحديث الطلب في القائمة الرئيسية - هذا سيظهر التحديث فوراً في القائمة الجانبية
      setRequests((prev) =>
        prev.map((r) => (r.id === selectedRequest.id ? updated : r))
      );
      
      // تحديث الطلب المحدد
      setSelectedRequest(updated);
      setNoteInput('');
      
      showToast('تم تحديث الحالة وإضافة الملاحظة بنجاح', 'success');
    } catch (error) {
      console.error('فشل تحديث الحالة والملاحظة:', error);
      showToast('حدث خطأ أثناء تحديث الحالة والملاحظة', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleExport = () => {
    exportToCSV(filteredRequests, 'finishing-requests.csv');
    showToast('تم تصدير البيانات بنجاح', 'success');
  };
  
  // دالة لحساب عدد الملاحظات
  const getNotesCount = (notes: string | undefined): number => {
    if (!notes || notes.trim() === '') return 0;
    // تقسيم الملاحظات على الفاصل "---" الذي يفصل بين الملاحظات
    const notesArray = notes.split('---').filter(note => note.trim() !== '');
    return notesArray.length;
  };

  // عرض حالة التحميل
  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-white">جاري تحميل طلبات التشطيبات...</div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-60px)] bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Request List */}
      <div className="w-1/3 border-l border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700 bg-gray-750">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold text-white">طلبات التشطيب ({filteredRequests.length})</h2>
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
                <option>قيد التنفيذ</option>
                <option>مكتمل</option>
                <option>ملغي</option>
              </select>
              <select 
                className="bg-gray-700 text-white text-sm rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none w-1/2"
                value={filters.type}
                onChange={e => setFilters({...filters, type: e.target.value})}
              >
                <option value="الكل">كل الأنواع</option>
                <option>استشارة وتصور</option>
                <option>تصميم ثلاثي الأبعاد</option>
                <option>تنفيذ وإشراف</option>
              </select>
          </div>
        </div>
        <ul className="overflow-y-auto flex-1">
          {filteredRequests.map((request) => (
            <li
              key={request.id}
              onClick={() => handleSelectRequest(request)}
              className={`p-4 cursor-pointer border-r-4 transition-colors ${
                selectedRequest?.id === request.id
                  ? 'bg-gray-700/50 border-blue-500'
                  : 'border-transparent hover:bg-gray-700/30'
              }`}
            >
              <p className="font-bold text-white truncate">{request.clientName}</p>
              <p className="text-sm font-medium text-gray-300 mt-1 truncate">{request.type}</p>
              <div className="flex justify-between items-center mt-2">
                 <p className="text-xs text-gray-500">{request.requestDate}</p>
                 <StatusBadge status={request.status} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Request Viewer */}
      <div className="w-2/3 flex flex-col">
        {selectedRequest ? (
          <>
            <div className="p-4 border-b border-gray-700 bg-gray-750">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">تفاصيل الطلب</h3>
                  <p className="text-sm text-gray-400">
                    العميل: <span className="font-medium text-blue-400">{selectedRequest.clientName}</span> ({selectedRequest.clientPhone})
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{selectedRequest.requestDate}</p>
                </div>
                <StatusBadge status={selectedRequest.status} />
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col">
              <div className="mb-6">
                <h4 className="text-md font-bold text-white mb-2">نوع الخدمة</h4>
                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                  <p className="text-gray-300 font-semibold">{selectedRequest.type}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-md font-bold text-white mb-2">تفاصيل الطلب</h4>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedRequest.details}
                  </p>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-md font-bold text-white">الملاحظات السابقة</h4>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                    {getNotesCount(selectedRequest.notes)} ملاحظة
                  </span>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex-1 overflow-y-auto">
                  {selectedRequest.notes ? (
                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedRequest.notes}
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
                    onChange={(e) => setSelectedStatus(e.target.value as FinishingRequestStatus)}
                    className="bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>جديد</option>
                    <option>تم التواصل</option>
                    <option>قيد التنفيذ</option>
                    <option>مكتمل</option>
                    <option>ملغي</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">اختر طلبًا لعرض التفاصيل</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinishingRequestsPage;