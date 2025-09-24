import React, { useState, useEffect } from 'react';
import type { SiteContent, Testimonial, ServiceItem } from '../types';

interface ContentManagementPageProps {
    content: SiteContent;
    setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}

const AccordionSection: React.FC<{
    title: string;
    sectionId: string;
    openSection: string | null;
    setOpenSection: (id: string | null) => void;
    children: React.ReactNode;
}> = ({ title, sectionId, openSection, setOpenSection, children }) => {
    const isOpen = openSection === sectionId;
    return (
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <button
                onClick={() => setOpenSection(isOpen ? null : sectionId)}
                className="w-full flex justify-between items-center p-6 text-xl font-bold text-white text-right"
            >
                <span>{title}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-6 pt-0 space-y-6">
                    {children}
                </div>
            )}
        </div>
    );
};

const TestimonialModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (testimonial: Omit<Testimonial, 'id'> & { id?: number }) => void;
    testimonial: Testimonial | null;
}> = ({ isOpen, onClose, onSave, testimonial }) => {
    const [formData, setFormData] = useState({ name: '', quote: '', designation: '', imageUrl: '' });

    useEffect(() => {
        if (testimonial) {
            setFormData(testimonial);
        } else {
            setFormData({ name: '', quote: '', designation: '', imageUrl: '' });
        }
    }, [testimonial]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: testimonial?.id });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-lg text-white">
                <h2 className="text-2xl font-bold mb-6">{testimonial ? 'تعديل شهادة العميل' : 'إضافة شهادة جديدة'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="اسم العميل" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-700 rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" required />
                    <input type="text" placeholder="الوظيفة/الصفة" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} className="w-full bg-gray-700 rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" required />
                    <input type="url" placeholder="رابط صورة العميل" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full bg-gray-700 rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" required />
                    <textarea placeholder="نص الشهادة" value={formData.quote} onChange={e => setFormData({ ...formData, quote: e.target.value })} rows={4} className="w-full bg-gray-700 rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" required />
                    <div className="pt-6 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">إلغاء</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ContentManagementPage: React.FC<ContentManagementPageProps> = ({ content, setContent }) => {
    const [formData, setFormData] = useState<SiteContent>(content);
    const [openSection, setOpenSection] = useState<string | null>('contact');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

    useEffect(() => {
        setFormData(content);
    }, [content]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value
            }
        }));
    };

    const handleListItemChange = (section: 'aboutPoints' | 'services', index: number, field: keyof ServiceItem | null, value: string) => {
        setFormData(prev => {
            const newList = [...prev[section]];
            if (section === 'aboutPoints') {
                (newList as string[])[index] = value;
            } else if (section === 'services' && field) {
                (newList as ServiceItem[])[index] = { ...newList[index] as ServiceItem, [field]: value };
            }
            return { ...prev, [section]: newList };
        });
    };
    
    const handleAddItem = (section: 'aboutPoints' | 'services' | 'testimonials') => {
        if (section === 'testimonials') {
            setEditingTestimonial(null);
            setIsModalOpen(true);
            return;
        }
        setFormData(prev => {
            const newItem = section === 'aboutPoints' ? '' : { id: Date.now(), title: '', description: '' };
            return { ...prev, [section]: [...prev[section], newItem] };
        });
    };

    const handleRemoveItem = (section: 'aboutPoints' | 'services' | 'testimonials', index: number) => {
        if (!window.confirm('هل أنت متأكد من الحذف؟')) return;
        setFormData(prev => {
            const newList = [...prev[section]];
            newList.splice(index, 1);
            return { ...prev, [section]: newList };
        });
    };
    
    const handleSaveTestimonial = (testimonial: Omit<Testimonial, 'id'> & { id?: number }) => {
        setFormData(prev => {
            const testimonials = [...prev.testimonials];
            if (testimonial.id) { // Edit
                const index = testimonials.findIndex(t => t.id === testimonial.id);
                if (index > -1) testimonials[index] = { ...testimonials[index], ...testimonial };
            } else { // Add
                testimonials.push({ ...testimonial, id: Date.now() });
            }
            return { ...prev, testimonials };
        });
        setIsModalOpen(false);
    };

    const handleSave = () => {
        setContent(formData);
        alert('تم حفظ التغييرات بنجاح!');
    };

    return (
        <div className="space-y-8">
            <TestimonialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTestimonial} testimonial={editingTestimonial} />
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">إدارة المحتوى</h2>
                <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    حفظ التغييرات
                </button>
            </div>
            
            <div className="space-y-4">
                 <AccordionSection title="معلومات التواصل والروابط" sectionId="contact" openSection={openSection} setOpenSection={setOpenSection}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} placeholder="رقم الهاتف" className="bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                        <input name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} placeholder="البريد الإلكتروني" className="bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <input name="contactAddress" value={formData.contactAddress} onChange={handleInputChange} placeholder="العنوان" className="w-full bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-700">
                        <input name="facebook" value={formData.socialLinks.facebook} onChange={handleSocialChange} placeholder="رابط فيسبوك" className="bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                        <input name="twitter" value={formData.socialLinks.twitter} onChange={handleSocialChange} placeholder="رابط تويتر (X)" className="bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                        <input name="instagram" value={formData.socialLinks.instagram} onChange={handleSocialChange} placeholder="رابط انستغرام" className="bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                        <input name="linkedin" value={formData.socialLinks.linkedin} onChange={handleSocialChange} placeholder="رابط لينكدإن" className="bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                        <input name="youtube" value={formData.socialLinks.youtube} onChange={handleSocialChange} placeholder="رابط يوتيوب" className="bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2" />
                    </div>
                </AccordionSection>

                 <AccordionSection title="محتوى الصفحة الرئيسية (Hero)" sectionId="hero" openSection={openSection} setOpenSection={setOpenSection}>
                     <label className="text-gray-400">العنوان الرئيسي</label>
                     <input name="heroTitle" value={formData.heroTitle} onChange={handleInputChange} className="w-full bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                 </AccordionSection>

                 <AccordionSection title='قسم "من نحن"' sectionId="about" openSection={openSection} setOpenSection={setOpenSection}>
                     <label className="text-gray-400">العنوان</label>
                     <input name="aboutTitle" value={formData.aboutTitle} onChange={handleInputChange} className="w-full bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                     <label className="text-gray-400 mt-4 block">النص الفرعي</label>
                     <textarea name="aboutSubtitle" value={formData.aboutSubtitle} onChange={handleInputChange} rows={3} className="w-full bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                     <h4 className="text-lg font-semibold mt-4 pt-4 border-t border-gray-700">النقاط والمميزات</h4>
                     {formData.aboutPoints.map((point, index) => (
                         <div key={index} className="flex gap-4 items-center">
                             <input value={point} onChange={e => handleListItemChange('aboutPoints', index, null, e.target.value)} className="flex-grow bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                             <button onClick={() => handleRemoveItem('aboutPoints', index)} className="text-red-400 hover:text-red-300 p-2">حذف</button>
                         </div>
                     ))}
                     <button onClick={() => handleAddItem('aboutPoints')} className="mt-2 text-blue-400 hover:text-blue-300 font-semibold">إضافة نقطة جديدة</button>
                 </AccordionSection>
                
                 <AccordionSection title="قسم الخدمات" sectionId="services" openSection={openSection} setOpenSection={setOpenSection}>
                     <label className="text-gray-400">العنوان</label>
                     <input name="servicesTitle" value={formData.servicesTitle} onChange={handleInputChange} className="w-full bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                     <h4 className="text-lg font-semibold mt-4 pt-4 border-t border-gray-700">قائمة الخدمات</h4>
                     {formData.services.map((service, index) => (
                         <div key={service.id} className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                             <div className="flex justify-end">
                                 <button onClick={() => handleRemoveItem('services', index)} className="text-red-400 hover:text-red-300 text-sm">حذف الخدمة</button>
                             </div>
                             <input value={service.title} onChange={e => handleListItemChange('services', index, 'title', e.target.value)} placeholder="عنوان الخدمة" className="w-full bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                             <textarea value={service.description} onChange={e => handleListItemChange('services', index, 'description', e.target.value)} placeholder="وصف الخدمة" rows={2} className="w-full bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                         </div>
                     ))}
                     <button onClick={() => handleAddItem('services')} className="mt-2 text-blue-400 hover:text-blue-300 font-semibold">إضافة خدمة جديدة</button>
                 </AccordionSection>

                 <AccordionSection title="قسم آراء العملاء" sectionId="testimonials" openSection={openSection} setOpenSection={setOpenSection}>
                    <label className="text-gray-400">العنوان</label>
                    <input name="testimonialsTitle" value={formData.testimonialsTitle} onChange={handleInputChange} className="w-full bg-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                        <h4 className="text-lg font-semibold">الشهادات</h4>
                        <button onClick={() => handleAddItem('testimonials')} className="bg-blue-600/50 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">إضافة شهادة</button>
                    </div>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                         {formData.testimonials.map((testimonial, index) => (
                             <div key={testimonial.id} className="bg-gray-900/50 p-4 rounded-lg flex gap-4">
                                <img src={testimonial.imageUrl} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0 mt-1" />
                                <div className="flex-grow">
                                    <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                                    <p className="font-bold text-white mt-2">{testimonial.name}</p>
                                    <p className="text-sm text-gray-400">{testimonial.designation}</p>
                                    <div className="flex gap-4 mt-3">
                                        <button onClick={() => { setEditingTestimonial(testimonial); setIsModalOpen(true); }} className="text-blue-400 hover:text-blue-300 text-sm font-semibold">تعديل</button>
                                        <button onClick={() => handleRemoveItem('testimonials', index)} className="text-red-400 hover:text-red-300 text-sm font-semibold">حذف</button>
                                    </div>
                                </div>
                             </div>
                         ))}
                     </div>
                 </AccordionSection>
            </div>
        </div>
    );
};

export default ContentManagementPage;