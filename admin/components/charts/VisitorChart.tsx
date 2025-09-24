import React, { useState, useMemo } from 'react';
import type { DecorationRequest, DecorationRequestStatus, DecorationRequestType, PortfolioItem } from '../../types';

interface DecorationsPageProps {
    requests: DecorationRequest[];
    setRequests: React.Dispatch<React.SetStateAction<DecorationRequest[]>>;
    portfolioItems: PortfolioItem[];
}

const StatusBadge: React.FC<{ status: DecorationRequestStatus }> = ({ status }) => {
    const baseClasses = 'px-2 py-0.5 text-xs font-semibold rounded-full';
    switch (status) {
      case 'جديد': return <span className={`${baseClasses} bg-blue-500/20 text-blue-400`}>{status}</span>;
      case 'تم التواصل': return <span className={`${baseClasses} bg-teal-500/20 text-teal-400`}>{status}</span>;
      case 'قيد التنفيذ': return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>{status}</span>;
      case 'مكتمل': return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>{status}</span>;
      case 'ملغي': return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>{status}</span>;
      default: return null;
    }
};

const DecorationsPage: React.FC<DecorationsPageProps> = ({ requests, setRequests, portfolioItems }) => {
  const [selectedRequest, setSelectedRequest] = useState<DecorationRequest | null>(requests[0] || null);
  const [filters, setFilters] = useState({ status: 'الكل', type: 'الكل' });
  const [noteInput, setNoteInput] = useState('');

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const statusMatch = filters.status === 'الكل' || request.status === filters.status;
      const typeMatch = filters.type === 'الكل' || request.type === filters.type;
      return statusMatch && typeMatch;
    });
  }, [requests, filters]);

  const referencedItem = useMemo(() => {
    if (!selectedRequest?.referenceItemId) return null;
    return portfolioItems.find(item => item.id === selectedRequest.referenceItemId) || null;
  }, [selectedRequest, portfolioItems]);

  const handleStatusChange = (newStatus: DecorationRequestStatus) => {
    if (!selectedRequest) return;
    const updatedRequests = requests.map(r => 
      r.id === selectedRequest.id ? { ...r, status: newStatus } : r
    );
    setRequests(updatedRequests);
    setSelectedRequest(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const handleAddNote = () => {
    if (!selectedRequest || !noteInput.trim()) return;
    const newNote = `${new Date().toLocaleString('ar-EG')}:\n${noteInput}`;
    const updatedNotes = selectedRequest.notes ? `${selectedRequest.notes}\n\n---\n\n${newNote}` : newNote;

    const updatedRequests = requests.map(r => 
      r.id === selectedRequest.id ? { ...r, notes: updatedNotes } : r
    );
    setRequests(updatedRequests);
    setSelectedRequest(prev => prev ? { ...prev, notes: updatedNotes } : null);
    setNoteInput('');
  };

  return (
    <div className="flex h-[calc(100vh-150px)] bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Request List */}
      <div className="w-1/3 border-l border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">طلبات الديكور ({filteredRequests.length})</h2>
          <div className="flex gap-2 mt-3">
              <select 
                className="bg-gray-700 text-white text-sm rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none w-1/2"
                value={filters.status}
                onChange={e => setFilters({...filters, status: e.target.value})}
              >
                <option value="الكل">كل الحالات</option>
                <option>جديد</option><option>تم التواصل</option><option>قيد التنفيذ</option><option>مكتمل</option><option>ملغي</option>
              </select>
              <select 
                className="bg-gray-700 text-white text-sm rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none w-1/2"
                value={filters.type}
                onChange={e => setFilters({...filters, type: e.target.value})}
              >
                <option value="الكل">كل الأنواع</option>
                <option>منحوتات جدارية</option><option>لوحات كانفس</option><option>تحف ديكورية</option>
              </select>
          </div>
        </div>
        <ul className="overflow-y-auto">
          {filteredRequests.map((request) => (
            <li
              key={request.id}
              onClick={() => {setSelectedRequest(request); setNoteInput('')}}
              className={`p-4 cursor-pointer border-r-4 transition-colors ${
                selectedRequest?.id === request.id
                  ? 'bg-gray-700/50 border-blue-500'
                  : 'border-transparent hover:bg-gray-700/30'
              }`}
            >
              <p className="font-bold text-white">{request.clientName}</p>
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
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white">تفاصيل الطلب</h3>
              <p className="text-sm text-gray-400">
                العميل: <span className="font-medium text-blue-400">{selectedRequest.clientName}</span> ({selectedRequest.clientPhone})
              </p>
              <p className="text-xs text-gray-500 mt-1">{selectedRequest.requestDate}</p>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {referencedItem && (
                  <div className="mb-6 p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                      <h4 className="text-md font-bold text-white mb-3">الطلب مبني على القطعة التالية:</h4>
                      <div className="flex items-center gap-4">
                          <img src={referencedItem.imageUrl} alt={referencedItem.title} className="w-20 h-20 rounded-md object-cover flex-shrink-0" />
                          <div>
                              <p className="font-semibold text-blue-400">{referencedItem.title}</p>
                              <p className="text-sm text-gray-400">{referencedItem.type}</p>
                          </div>
                      </div>
                  </div>
              )}
              
              <h4 className="text-md font-bold text-white mb-2">نوع القطعة الفنية المطلوبة</h4>
              <p className="text-gray-300 bg-gray-900/50 p-3 rounded-lg font-semibold">{selectedRequest.type}</p>

              <h4 className="text-md font-bold text-white mb-2 mt-6">تفاصيل الطلب</h4>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap bg-gray-900/50 p-4 rounded-lg">{selectedRequest.details}</p>
              
              {selectedRequest.notes && (
                <div className="mt-6">
                    <h4 className="text-md font-bold text-white mb-2">الملاحظات السابقة</h4>
                    <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap bg-gray-900/50 p-4 rounded-lg max-h-40 overflow-y-auto">
                        {selectedRequest.notes}
                    </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-700 bg-gray-800/50">
                <h4 className="text-md font-bold text-white mb-2">إضافة ملاحظة جديدة</h4>
                <textarea 
                    className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={2}
                    value={noteInput}
                    onChange={e => setNoteInput(e.target.value)}
                    placeholder="أضف ملاحظة لتسهيل المتابعة..."
                ></textarea>
                 <div className="flex justify-between items-center mt-4">
                    <button onClick={handleAddNote} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        إضافة ملاحظة
                    </button>
                     <div>
                        <label htmlFor="status" className="text-sm text-gray-400 ml-2">تغيير الحالة:</label>
                        <select
                            id="status"
                            value={selectedRequest.status}
                            onChange={(e) => handleStatusChange(e.target.value as DecorationRequestStatus)}
                            className="bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option>جديد</option><option>تم التواصل</option><option>قيد التنفيذ</option><option>مكتمل</option><option>ملغي</option>
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

export default DecorationsPage;