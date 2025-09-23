import React, { useRef, useEffect, useState } from 'react';
import type { Language } from '../App';
import { translations } from '../data/translations';
import FormField, { inputClasses } from './shared/FormField';
import { createFinishingRequest } from '../services/finishingRequestsService';
import { getPortfolioItems } from '../services/portfolioService';
import type { PortfolioItem, FinishingRequestType } from '../types';
import { useAlert } from '../hooks/userAlert';
interface FinishingRequestModalProps {
    onClose: () => void;
    serviceTitle: string;
    language: Language;
}

const FinishingRequestModal: React.FC<FinishingRequestModalProps> = ({ onClose, serviceTitle, language }) => {
    const t = translations[language].finishingRequestModal;
    const modalRef = useRef<HTMLDivElement>(null);
    const { showSuccessAlert, showErrorAlert } = useAlert();
    // States for form fields
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [preferredContactTime, setPreferredContactTime] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
    const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<number | null>(null);
    
    // إضافة حالة لتخزين رسائل الخطأ
    const [errors, setErrors] = useState({
        fullName: '',
        phone: '',
        preferredContactTime: '',
        notes: ''
    });
    
    // Fetch portfolio items
    useEffect(() => {
        const fetchPortfolioItems = async () => {
            try {
                const items = await getPortfolioItems();
                setPortfolioItems(items);
            } catch (error) {
                console.error('Failed to fetch portfolio items:', error);
            }
        };
        
        fetchPortfolioItems();
    }, []);
    
    // Handle keyboard events
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            firstElement.focus();
            
            const handleTabKeyPress = (event: KeyboardEvent) => {
                if (event.key === 'Tab') {
                    if (event.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            event.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            event.preventDefault();
                        }
                    }
                }
            };
            
            const currentModalRef = modalRef.current;
            currentModalRef?.addEventListener('keydown', handleTabKeyPress);
            
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                currentModalRef?.removeEventListener('keydown', handleTabKeyPress);
            };
        }
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);
    
    // دالة للتحقق من صحة رقم الهاتف
    const validatePhoneNumber = (phone: string): boolean => {
        // نمط بسيط للتحقق من رقم هاتف دولي (يبدأ بـ + ويتبعه 8-15 رقمًا)
        const phoneRegex = /^[+]?[\d\s\-]{10,15}$/;

        return phoneRegex.test(phone.replace(/\s/g, ''));
    };
    
    // دالة للتحقق من صحة النموذج
    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = {
            fullName: '',
            phone: '',
            preferredContactTime: '',
            notes: ''
        };

        // التحقق من الاسم الكامل
        if (!fullName.trim()) {
            newErrors.fullName = language === 'ar' ? 'الاسم الكامل مطلوب' : 'Full name is required';
            isValid = false;
        } else if (fullName.trim().length < 2) {
            newErrors.fullName = language === 'ar' ? 'الاسم يجب أن يحتوي على حرفين على الأقل' : 'Name must be at least 2 characters';
            isValid = false;
        }

        // التحقق من رقم الهاتف
        if (!phone.trim()) {
            newErrors.phone = language === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required';
            isValid = false;
        } else if (!validatePhoneNumber(phone)) {
            newErrors.phone = language === 'ar' ? 'رقم هاتف غير صالح' : 'Invalid phone number';
            isValid = false;
        }

        // التحقق من وقت الاتصال المفضل
        if (!preferredContactTime) {
            newErrors.preferredContactTime = language === 'ar' ? 'وقت الاتصال المفضل مطلوب' : 'Preferred contact time is required';
            isValid = false;
        }

        // التحقق من الملاحظات (اختياري لكن إذا تم إدخالها يجب أن تكون كافية)
        if (notes.trim() && notes.trim().length < 10) {
            newErrors.notes = language === 'ar' ? 'الملاحظات يجب أن تحتوي على 10 أحرف على الأقل' : 'Notes must be at least 10 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };
    
    // تحديث دالة معالجة تغيير الحقول لمسح رسائل الخطأ
    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: keyof typeof errors) => 
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            setter(e.target.value);
            
            // مسح رسالة الخطأ عند بدء الكتابة
            if (errors[fieldName]) {
                setErrors(prev => ({
                    ...prev,
                    [fieldName]: ''
                }));
            }
        };
    
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من صحة النموذج قبل الإرسال
    if (!validateForm()) {
        return;
    }
    
    setLoading(true);
    
    try {
        // Map service title to type
        let requestType: FinishingRequestType = 'استشارة وتصور';
        if (serviceTitle.includes('ثلاثي الأبعاد')) {
            requestType = 'تصميم ثلاثي الأبعاد';
        } else if (serviceTitle.includes('تنفيذ') || serviceTitle.includes('إشراف')) {
            requestType = 'تنفيذ وإشراف';
        }
        
        await createFinishingRequest({
            clientName: fullName,
            clientPhone: phone,
            type: requestType,
            details: serviceTitle,
            notes: notes,
        });
        
        // عرض تنبيه النجاح بدلاً من الإغلاق المباشر
        showSuccessAlert(
            translations[language].success.finishingRequestSent || 
            (language === 'ar' ? 'تم إرسال طلب التشطيب بنجاح!' : 'Finishing request sent successfully!')
        );
        
        // إعادة تعيين النموذج
        setFullName('');
        setPhone('');
        setPreferredContactTime('');
        setNotes('');
        
        // إغلاق النموذج بعد عرض التنبيه
        setTimeout(() => {
            onClose();
        }, 1500);
    } catch (error) {
        console.error('Error submitting finishing request:', error);
        // عرض تنبيه الخطأ بدلاً من alert
        showErrorAlert(
            translations[language].errors.operations.finishingRequestFailed || 
            (language === 'ar' ? 'حدث خطأ أثناء إرسال طلب التشطيب. يرجى المحاولة مرة أخرى.' : 'An error occurred while submitting the finishing request. Please try again.')
        );
    } finally {
        setLoading(false);
    }
};
    
    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fadeIn"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                ref={modalRef}
                className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8">
                    <button onClick={onClose} className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} text-gray-400 hover:text-white transition-colors`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-3xl font-bold text-amber-500 mb-2 text-center">{t.title}</h2>
                    <p className="text-gray-400 text-center mb-6">({serviceTitle})</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fullName" className="block text-gray-300 mb-2">{t.fullName}</label>
                                <input 
                                    type="text" 
                                    id="fullName" 
                                    className={`${inputClasses} ${errors.fullName ? 'border-red-500' : ''}`} 
                                    required 
                                    value={fullName}
                                    onChange={handleInputChange(setFullName, 'fullName')}
                                />
                                {errors.fullName && <p className="mt-1 text-red-500 text-sm">{errors.fullName}</p>}
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-gray-300 mb-2">{t.phone}</label>
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    className={`${inputClasses} ${errors.phone ? 'border-red-500' : ''}`} 
                                    required 
                                    dir="ltr"
                                    value={phone}
                                    onChange={handleInputChange(setPhone, 'phone')}
                                />
                                {errors.phone && <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>}
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="contactTime" className="block text-gray-300 mb-2">{t.preferredContactTime}</label>
                            <select 
                                id="contactTime" 
                                className={`${inputClasses} text-gray-400 ${errors.preferredContactTime ? 'border-red-500' : ''}`} 
                                required 
                                value={preferredContactTime}
                                onChange={handleInputChange(setPreferredContactTime, 'preferredContactTime')}
                            >
                                <option value="" disabled>{t.preferredContactTimeDefault}</option>
                                <option value="morning" className="text-white">{t.preferredContactTimeMorning}</option>
                                <option value="afternoon" className="text-white">{t.preferredContactTimeAfternoon}</option>
                                <option value="evening" className="text-white">{t.preferredContactTimeEvening}</option>
                            </select>
                            {errors.preferredContactTime && <p className="mt-1 text-red-500 text-sm">{errors.preferredContactTime}</p>}
                        </div>
                        
                        <div>
                            <label htmlFor="notes" className="block text-gray-300 mb-2">{t.notes}</label>
                            <textarea 
                                id="notes" 
                                rows={4} 
                                placeholder={t.notesPlaceholder} 
                                className={`${inputClasses} ${errors.notes ? 'border-red-500' : ''}`}
                                value={notes}
                                onChange={handleInputChange(setNotes, 'notes')}
                            ></textarea>
                            {errors.notes && <p className="mt-1 text-red-500 text-sm">{errors.notes}</p>}
                        </div>
                        
                        <div className="pt-2 flex justify-end">
                            <button 
                                type="submit" 
                                className="bg-amber-500 text-gray-900 font-bold px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors duration-200 disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? (language === 'ar' ? 'جاري الإرسال...' : 'Sending...') : t.submitButton}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FinishingRequestModal;