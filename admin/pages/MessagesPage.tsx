import React, { useState, useMemo } from 'react';
import type { Inquiry, InquiryStatus } from '../types';

interface InquiriesPageProps {
    inquiries: Inquiry[];
    setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>;
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

const InquiriesPage: React.FC<InquiriesPageProps> = ({ inquiries, setInquiries }) => {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(inquiries[0] || null);
  const [filters, setFilters] = useState({ status: 'الكل', type: 'الكل' });
  const [noteInput, setNoteInput] = useState('');

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inquiry => {
      const statusMatch = filters.status === 'الكل' || inquiry.status === filters.status;
      const typeMatch = filters.type === 'الكل' || inquiry.type === filters.type;
      return statusMatch && typeMatch;
    });
  }, [inquiries, filters]);

  const handleSelectInquiry = (inquiry: Inquiry) => {
      setSelectedInquiry(inquiry);
      if(!inquiry.read) {
          setInquiries(prev => prev.map(i => i.id === inquiry.id ? {...i, read: true} : i));
      }
      setNoteInput('');
  }

  const handleStatusChange = (newStatus: InquiryStatus) => {
    if (!selectedInquiry) return;
    const updatedInquiries = inquiries.map(i => 
      i.id === selectedInquiry.id ? { ...i, status: newStatus } : i
    );
    setInquiries(updatedInquiries);
    setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const handleAddNote = () => {
    if (!selectedInquiry || !noteInput.trim()) return;
    const newNote = `${new Date().toLocaleString('ar-EG')}:\n${noteInput}`;
    const updatedNotes = selectedInquiry.notes ? `${selectedInquiry.notes}\n\n---\n\n${newNote}` : newNote;

    const updatedInquiries = inquiries.map(i => 
      i.id === selectedInquiry.id ? { ...i, notes: updatedNotes } : i
    );
    setInquiries(updatedInquiries);
    setSelectedInquiry(prev => prev ? { ...prev, notes: updatedNotes } : null);
    setNoteInput('');
  };

  return (
    <div className="flex h-[calc(100vh-150px)] bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Inquiry List */}
      <div className="w-1/3 border-l border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">صندوق الوارد ({filteredInquiries.length})</h2>
          <div className="flex gap-2 mt-3">
              <select 
                className="bg-gray-700 text-white text-sm rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none w-1/2"
                value={filters.status}
                onChange={e => setFilters({...filters, status: e.target.value})}
              >
                <option value="الكل">كل الحالات</option>
                <option>جديد</option><option>تم التواصل</option><option>قيد المتابعة</option><option>مغلق</option>
              </select>
              <select 
                className="bg-gray-700 text-white text-sm rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none w-1/2"
                value={filters.type}
                onChange={e => setFilters({...filters, type: e.target.value})}
              >
                <option value="الكل">كل الأنواع</option>
                <option>تواصل عام</option><option>طلب ديكور</option><option>إضافة عقار</option>
              </select>
          </div>
        </div>
        <ul className="overflow-y-auto">
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
                  <p className="font-bold text-white">{inquiry.sender}</p>
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
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white">تفاصيل الاستفسار</h3>
              <p className="text-sm text-gray-400">
                من: <span className="font-medium text-blue-400">{selectedInquiry.sender}</span> ({selectedInquiry.phone})
              </p>
              <p className="text-xs text-gray-500 mt-1">{selectedInquiry.date}</p>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <h4 className="text-md font-bold text-white mb-2">الرسالة</h4>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap bg-gray-900/50 p-4 rounded-lg">{selectedInquiry.message}</p>
              
              {selectedInquiry.notes && (
                <div className="mt-6">
                    <h4 className="text-md font-bold text-white mb-2">الملاحظات السابقة</h4>
                    <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap bg-gray-900/50 p-4 rounded-lg max-h-40 overflow-y-auto">
                        {selectedInquiry.notes}
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
                            value={selectedInquiry.status}
                            onChange={(e) => handleStatusChange(e.target.value as InquiryStatus)}
                            className="bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option>جديد</option><option>تم التواصل</option><option>قيد المتابعة</option><option>مغلق</option>
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