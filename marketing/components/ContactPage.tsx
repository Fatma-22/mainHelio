import React, { useState } from 'react';
import type { Language } from '../App';
import { translations } from '../data/translations';
import { createInquiry } from '../services/inquiryService';
import type { SiteContent, InquiryType } from '../types';
import { useAlert } from '../hooks/userAlert';
const inputClasses = "w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-white placeholder-gray-400";
const errorInputClasses = "w-full p-3 bg-gray-800 border border-red-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-white placeholder-gray-400";

interface ContactPageProps {
  language: Language;
  siteContentAr: SiteContent;
  siteContentEn: SiteContent;
}

const ContactPage: React.FC<ContactPageProps> = ({ language, siteContentAr, siteContentEn }) => {
    const t = translations[language].contactPage;
    const [isLoading, setIsLoading] = useState(false);
    const { showSuccessAlert, showErrorAlert } = useAlert();
    const [errors, setErrors] = useState({
        name: '',
        phone: '',
        message: '',
        contactTime: ''
    });
    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        contactTime: '',
        message: ''
    });
    
    // اختيار المحتوى بناءً على اللغة
    const siteContent = language === 'ar' ? siteContentAr : siteContentEn;
    
    // استخراج معلومات الاتصال من siteContent
    const { contactPhone, contactEmail, contactAddress, workingHours } = siteContent;

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
            name: '',
            phone: '',
            message: '',
            contactTime: ''
        };

        // التحقق من الاسم
        if (!formData.name.trim()) {
            newErrors.name = language === 'ar' ? 'الاسم مطلوب' : 'Name is required';
            isValid = false;
        } else if (formData.name.trim().length < 2) {
            newErrors.name = language === 'ar' ? 'الاسم يجب أن يحتوي على حرفين على الأقل' : 'Name must be at least 2 characters';
            isValid = false;
        }

        // التحقق من رقم الهاتف
        if (!formData.phone.trim()) {
            newErrors.phone = language === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required';
            isValid = false;
        } else if (!validatePhoneNumber(formData.phone)) {
            newErrors.phone = language === 'ar' ? 'رقم هاتف غير صالح' : 'Invalid phone number';
            isValid = false;
        }

        // التحقق من الرسالة
        if (!formData.message.trim()) {
            newErrors.message = language === 'ar' ? 'الرسالة مطلوبة' : 'Message is required';
            isValid = false;
        } else if (formData.message.trim().length < 10) {
            newErrors.message = language === 'ar' ? 'الرسالة يجب أن تحتوي على 10 أحرف على الأقل' : 'Message must be at least 10 characters';
            isValid = false;
        }

        // التحقق من وقت الاتصال (اختياري)
        if (!formData.contactTime) {
            newErrors.contactTime = language === 'ar' ? 'يرجى اختيار وقت الاتصال' : 'Please select contact time';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        
        // مسح رسالة الخطأ عند بدء الكتابة
        if (errors[id as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [id]: ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من صحة النموذج قبل الإرسال
    if (!validateForm()) {
        return;
    }
    
    setIsLoading(true);
    try {
        // استخدام نوع InquiryType المحدد
        const inquiryType: InquiryType = 'تواصل عام';
        
        // إنشاء الاستعلام باستخدام الخدمة
        await createInquiry({
            name: formData.name,
            phone: formData.phone,
            message: `${formData.message}\n\n${language === 'ar' ? 'وقت الاتصال المفضل' : 'Preferred contact time'}: ${formData.contactTime || (language === 'ar' ? 'غير محدد' : 'Not specified')}`,
            type: inquiryType,
            contact_time: formData.contactTime
        });
        
        // عرض تنبيه النجاح
        showSuccessAlert(
            translations[language].success.contactFormSent || 
            (language === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent successfully!')
        );
        
        // إعادة تعيين النموذج
        setFormData({
            name: '',
            phone: '',
            contactTime: '',
            message: ''
        });
        
        // مسح جميع الأخطاء
        setErrors({
            name: '',
            phone: '',
            message: '',
            contactTime: ''
        });
    } catch (error) {
        console.error('Error sending inquiry:', error);
        // عرض تنبيه الخطأ بدلاً من alert
        showErrorAlert(
            translations[language].errors.errorSubmit || 
            (language === 'ar' ? 'حدث خطأ أثناء إرسال الاستفسار. يرجى المحاولة مرة أخرى.' : 'An error occurred while sending your inquiry. Please try again.')
        );
    } finally {
        setIsLoading(false);
    }
};
    return (
        <div className="py-20 bg-gray-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">{t.title}</h1>
                    <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">{t.subtitle}</p>
                </div>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-gray-800 p-8 rounded-lg border border-gray-700">
                    <div>
                        <h2 className="text-2xl font-bold text-amber-500 mb-6">{t.formTitle}</h2>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="sr-only">{t.namePlaceholder}</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    placeholder={t.namePlaceholder} 
                                    className={errors.name ? errorInputClasses : inputClasses} 
                                    required 
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="phone" className="sr-only">{t.phonePlaceholder}</label>
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    placeholder={t.phonePlaceholder} 
                                    className={errors.phone ? errorInputClasses : inputClasses} 
                                    required 
                                    dir="ltr" 
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                                {errors.phone && <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>}
                            </div>
                            <div>
                                <label htmlFor="contactTime" className="sr-only">{t.contactTimeLabel}</label>
                                <select 
                                    id="contactTime" 
                                    className={errors.contactTime ? errorInputClasses : `${inputClasses} text-gray-400`} 
                                    value={formData.contactTime}
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled>{t.contactTimeDefault}</option>
                                    <option value="morning" className="text-white">{t.contactTimeMorning}</option>
                                    <option value="afternoon" className="text-white">{t.contactTimeAfternoon}</option>
                                    <option value="evening" className="text-white">{t.contactTimeEvening}</option>
                                </select>
                                {errors.contactTime && <p className="mt-1 text-red-500 text-sm">{errors.contactTime}</p>}
                            </div>
                            <div>
                                <label htmlFor="message" className="sr-only">{t.messagePlaceholder}</label>
                                <textarea 
                                    id="message" 
                                    rows={5} 
                                    placeholder={t.messagePlaceholder} 
                                    className={errors.message ? errorInputClasses : inputClasses} 
                                    required
                                    value={formData.message}
                                    onChange={handleInputChange}
                                ></textarea>
                                {errors.message && <p className="mt-1 text-red-500 text-sm">{errors.message}</p>}
                            </div>
                            <div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors duration-200 disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (language === 'ar' ? 'جاري الإرسال...' : 'Sending...') : t.sendButton}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-amber-500 mb-6">{t.contactInfoTitle}</h2>
                         <div className="flex items-start gap-4">
                            <span className="text-amber-500 mt-1">📍</span>
                            <div>
                                <h3 className="font-semibold text-white">{t.addressTitle}</h3>
                                <p className="text-gray-400">{contactAddress || t.addressText}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <span className="text-amber-500 mt-1">📞</span>
                            <div>
                                <h3 className="font-semibold text-white">{t.phoneTitle}</h3>
                                <p className="text-gray-400" dir="ltr">{contactPhone || '+20 123 456 7890'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="text-amber-500 mt-1">✉️</span>
                            <div>
                                <h3 className="font-semibold text-white">{t.emailTitle}</h3>
                                <p className="text-gray-400">{contactEmail || 'info@onlyhelio.com'}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <span className="text-amber-500 mt-1">⏰</span>
                            <div>
                                <h3 className="font-semibold text-white">{t.hoursTitle}</h3>
                                <p className="text-gray-400">{workingHours || t.hoursText}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;