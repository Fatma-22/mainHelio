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
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  
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
    setCurrentNoteIndex(0); // إعادة تعيين مؤشر الملاحظة عند اختيار طلب جديد
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
      // الانتقال إلى الملاحظة الجديدة بعد إضافتها
      const notes = parseNotes(updatedNotes);
      setCurrentNoteIndex(notes.length - 1);
      
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
  
  // دالة لتحليل الملاحظات وعرضها بشكل منفصل
  const parseNotes = (notes: string | undefined): Array<{ date: string; content: string }> => {
    if (!notes || notes.trim() === '') return [];
    
    const notesArray = notes.split('---').filter(note => note.trim() !== '');
    
    return notesArray.map(note => {
      const trimmedNote = note.trim();
      const dateMatch = trimmedNote.match(/^(\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{1,2}:\d{1,2} (ص|م)):/);
      
      if (dateMatch) {
        const date = dateMatch[1];
        const content = trimmedNote.substring(dateMatch[0].length).trim();
        return { date, content };
      } else {
        return { date: '', content: trimmedNote };
      }
    });
  };

  // دالة للتنقل بين الملاحظات
  const navigateNotes = (direction: 'prev' | 'next') => {
    if (!selectedRequest) return;
    
    const notes = parseNotes(selectedRequest.notes);
    if (notes.length === 0) return;
    
    if (direction === 'next') {
      setCurrentNoteIndex(prev => (prev + 1) % notes.length);
    } else {
      setCurrentNoteIndex(prev => (prev - 1 + notes.length) % notes.length);
    }
  };

  // دالة للقفز إلى ملاحظة محددة
  const jumpToNote = (index: number) => {
    setCurrentNoteIndex(index);
  };

  // عرض حالة التحميل
  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-white">جاري تحميل طلبات التشطيبات...</div>
      </div>
    );
  }

  const notes = selectedRequest ? parseNotes(selectedRequest.notes) : [];
  const currentNote = notes[currentNoteIndex];

  return (
    <div className="flex h-[calc(100vh-60px)] bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Request List */}
      <div className="w-1/4 border-l border-gray-700 flex flex-col">
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
      <div className="w-3/4 flex flex-col">
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
            
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* قسم الرسالة والملاحظات */}
              <div className="flex-1 flex overflow-hidden p-6 gap-6">
                {/* قسم الطلب */}
                <div className="w-2/5 flex flex-col">
                  <h4 className="text-md font-bold text-white mb-2">تفاصيل الطلب</h4>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex-1 overflow-y-auto space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">نوع الخدمة</p>
                      <p className="text-gray-300 font-semibold">{selectedRequest.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">تفاصيل الطلب</p>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {selectedRequest.details}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* قسم الملاحظات - مع نظام تنقل متقدم */}
                <div className="w-3/5 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-md font-bold text-white">الملاحظات</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                        {notes.length} ملاحظة
                      </span>
                      {notes.length > 1 && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigateNotes('prev')}
                            className="p-1 rounded hover:bg-gray-700 transition-colors"
                            title="الملاحظة السابقة"
                          >
                           
                          </button>
                          <span className="text-xs text-gray-400">
                            {currentNoteIndex + 1} / {notes.length}
                          </span>
                          <button
                            onClick={() => navigateNotes('next')}
                            className="p-1 rounded hover:bg-gray-700 transition-colors"
                            title="الملاحظة التالية"
                          >
                            
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-1 overflow-hidden gap-4">
                    {/* فهرس الملاحظات */}
                    <div className="w-1/4 bg-gray-900/50 rounded-lg border border-gray-700 overflow-y-auto">
                      <div className="p-2 space-y-1">
                        {notes.map((note, index) => (
                          <button
                            key={index}
                            onClick={() => jumpToNote(index)}
                            className={`w-full text-right p-2 rounded text-sm transition-colors ${
                              index === currentNoteIndex
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'hover:bg-gray-700/50 text-gray-400'
                            }`}
                          >
                            <div className="truncate">{note.date || 'ملاحظة'}</div>
                            <div className="text-xs text-gray-500 truncate">
                              {note.content.substring(0, 30)}...
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* عرض الملاحظة الحالية */}
                    <div className="flex-1 bg-gray-900/50 p-4 rounded-lg border border-gray-700 overflow-y-auto">
                      {currentNote ? (
                        <div className="space-y-3">
                          {currentNote.date && (
                            <div className="flex items-center">
                              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                                
                                <span className="mr-1">{currentNote.date}</span>
                              </span>
                            </div>
                          )}
                          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {currentNote.content}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-500 italic">لا توجد ملاحظات سابقة</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* قسم إضافة ملاحظة جديدة وتحديث الحالة */}
              <div className="p-4 border-t border-gray-700 bg-gray-800/50">
                <h4 className="text-md font-bold text-white mb-2">إضافة ملاحظة جديدة وتحديث الحالة</h4>
                <div className="relative mb-4">
                  <textarea 
                    className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    value={noteInput}
                    onChange={e => setNoteInput(e.target.value)}
                    placeholder="أضف ملاحظة لتسهيل المتابعة..."
                  ></textarea>
                </div>
                
                <div className="flex justify-between items-center">
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