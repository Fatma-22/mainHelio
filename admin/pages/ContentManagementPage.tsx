import React, { useState, useEffect } from 'react';
import type { SiteContent, Testimonial, ServiceItem, AboutPoint } from '../types';
import { getSiteContent, updateSiteContent } from '../services/siteContentService';

interface ContentManagementPageProps {
  showToast: (message: string, type?: 'success' | 'error') => void;
    content: SiteContent | null; 
    refreshData: () => void;
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
      {isOpen && <div className="p-6 pt-0 space-y-6">{children}</div>}
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
    if (testimonial) setFormData(testimonial);
    else setFormData({ name: '', quote: '', designation: '', imageUrl: '' });
  }, [testimonial]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: testimonial?.id });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
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

const ContentManagementPage: React.FC<ContentManagementPageProps> = ({ showToast }) => {
  const [formData, setFormData] = useState<SiteContent | null>(null);
  const [openSection, setOpenSection] = useState<string | null>('contact');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getSiteContent();
        const normalizedData: SiteContent = {
          heroTitle: data.heroTitle || '',
          heroSubtitle: data.heroSubtitle || '',
          aboutTitle: data.aboutTitle || '',
          aboutSubtitle: data.aboutSubtitle || '',
          aboutPoints: (data.aboutPoints || []).map((p: any) => ({ id: p.id || Date.now(), description: p.description || '' })),
          servicesTitle: data.servicesTitle || '',
          services: (data.services || []).map((s: any) => ({
            id: s.id || Date.now(),
            title: s.title || '',
            description: s.description || '',
            iconUrl: s.iconUrl || '',
            link: s.link || ''  // <- لازم هنا
          })),
          testimonialsTitle: data.testimonialsTitle || '',
          testimonials: (data.testimonials || []).map((t: any) => ({
            id: t.id || Date.now(),
            name: t.name || '',
            designation: t.designation || '',
            quote: t.quote || '',
            imageUrl: t.imageUrl || ''
          })),
          contactTitle: data.contactTitle || '',
          contactSubtitle: data.contactSubtitle || '',
          contactPhone: data.contactPhone || '',
          contactEmail: data.contactEmail || '',
          contactAddress: data.contactAddress || '',
          workingHours: data.workingHours || '',
          socialLinks: data.socialLinks || {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: '',
            youtube: ''
          }
        };
        setFormData(normalizedData);
      } catch (err) {
        showToast('حدث خطأ أثناء جلب المحتوى', 'error');
      }
    };
    fetchContent();
  }, []);

  if (!formData) return <div>جارٍ التحميل...</div>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev!, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev!,
      socialLinks: { ...prev!.socialLinks, [name]: value }
    }));
  };

  const handleListItemChange = (section: 'aboutPoints' | 'services', index: number, field: keyof ServiceItem | 'description', value: string) => {
    setFormData(prev => {
      const newList = [...prev![section]];
      if (section === 'aboutPoints') {
        (newList as AboutPoint[])[index] = { ...newList[index] as AboutPoint, description: value };
      } else if (section === 'services') {
        (newList as ServiceItem[])[index] = { ...newList[index] as ServiceItem, [field]: value };
      }
      return { ...prev!, [section]: newList };
    });
  };

  const handleAddItem = (section: 'aboutPoints' | 'services' | 'testimonials') => {
    if (section === 'testimonials') { setEditingTestimonial(null); setIsModalOpen(true); return; }
    setFormData(prev => {
      let newItem;
      if(section === 'aboutPoints') newItem = { id: Date.now(), description: '' };
      else if(section === 'services') newItem = { id: Date.now(), title: '', description: '', iconUrl: '' };
      return { ...prev!, [section]: [...prev![section], newItem] };
    });
  };

  const handleRemoveItem = (section: 'aboutPoints' | 'services', index: number) => {
    setFormData(prev => {
      const newList = [...prev![section]];
      newList.splice(index, 1);
      return { ...prev!, [section]: newList };
    });
    showToast('تم الحذف بنجاح');
  };

  const handleDeleteTestimonial = async (index: number) => {
    try {
      const newTestimonials = [...formData!.testimonials];
      newTestimonials.splice(index, 1);
      const updatedContent = await updateSiteContent({ 
        ...formData!, 
        testimonials: newTestimonials 
      });
      setFormData(updatedContent);
      showToast('تم حذف الشهادة بنجاح', 'success');
    } catch (err) {
      showToast('حدث خطأ أثناء الحذف', 'error');
    }
  };

  const handleSaveTestimonial = async (testimonial: Omit<Testimonial, 'id'> & { id?: number }) => {
    try {
      let updatedContent;
      if (testimonial.id) {
        updatedContent = await updateSiteContent({ 
          ...formData!,
          testimonials: formData!.testimonials.map(t => t.id === testimonial.id ? { ...t, ...testimonial } : t)
        });
      } else {
        updatedContent = await updateSiteContent({
          ...formData!,
          testimonials: [...formData!.testimonials, { ...testimonial, id: Date.now() }]
        });
      }
      setFormData(updatedContent);
      setIsModalOpen(false);
      showToast('تم حفظ شهادة العميل بنجاح', 'success');
    } catch (err) {
      showToast('حدث خطأ أثناء الحفظ', 'error');
    }
  };

  const handleSave = async () => {
    try {
      const updated = await updateSiteContent(formData!);
      setFormData(updated);
      showToast('تم حفظ التغييرات بنجاح', 'success');
    } catch (err) {
      showToast('حدث خطأ أثناء الحفظ', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <TestimonialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTestimonial} testimonial={editingTestimonial} />

      <AccordionSection title="الصفحة الرئيسية" sectionId="hero" openSection={openSection} setOpenSection={setOpenSection}>
        <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleInputChange} placeholder="عنوان الصفحة الرئيسية" className="w-full p-3 rounded-lg bg-gray-700 text-white" />
        <textarea name="heroSubtitle" value={formData.heroSubtitle} onChange={handleInputChange} placeholder="نص الصفحة الرئيسية" className="w-full p-3 rounded-lg bg-gray-700 text-white mt-3" />
      </AccordionSection>

      <AccordionSection title="عن الشركة" sectionId="about" openSection={openSection} setOpenSection={setOpenSection}>
        <input type="text" name="aboutTitle" value={formData.aboutTitle} onChange={handleInputChange} placeholder="عنوان عن الشركة" className="w-full p-3 rounded-lg bg-gray-700 text-white" />
        <textarea name="aboutSubtitle" value={formData.aboutSubtitle} onChange={handleInputChange} placeholder="نص عن الشركة" className="w-full p-3 rounded-lg bg-gray-700 text-white mt-3" />
        {formData.aboutPoints.map((point, idx) => (
          <div key={point.id} className="flex gap-3 mt-3">
            <input value={point.description} onChange={e => handleListItemChange('aboutPoints', idx, 'description', e.target.value)} placeholder={`نقطة ${idx+1}`} className="flex-1 p-3 rounded-lg bg-gray-700 text-white" />
            <button type="button" onClick={() => handleRemoveItem('aboutPoints', idx)} className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-lg">حذف</button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddItem('aboutPoints')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-3">إضافة نقطة</button>
      </AccordionSection>

      <AccordionSection title="الخدمات" sectionId="services" openSection={openSection} setOpenSection={setOpenSection}>
        <input type="text" name="servicesTitle" value={formData.servicesTitle} onChange={handleInputChange} placeholder="عنوان الخدمات" className="w-full p-3 rounded-lg bg-gray-700 text-white" />
        {formData.services.map((service, idx) => (
          <div key={service.id} className="space-y-2 mt-3 p-3 bg-gray-700 rounded-lg">
            <input value={service.title} onChange={e => handleListItemChange('services', idx, 'title', e.target.value)} placeholder="عنوان الخدمة" className="w-full p-2 rounded-lg bg-gray-800 text-white" />
            <textarea value={service.description} onChange={e => handleListItemChange('services', idx, 'description', e.target.value)} placeholder="وصف الخدمة" className="w-full p-2 rounded-lg bg-gray-800 text-white" />
            <input value={service.iconUrl} onChange={e => handleListItemChange('services', idx, 'iconUrl', e.target.value)} placeholder="رابط أيقونة" className="w-full p-2 rounded-lg bg-gray-800 text-white" />
            <button type="button" onClick={() => handleRemoveItem('services', idx)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg mt-2">حذف</button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddItem('services')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-3">إضافة خدمة</button>
      </AccordionSection>

      <AccordionSection title="شهادات العملاء" sectionId="testimonials" openSection={openSection} setOpenSection={setOpenSection}>
        <input type="text" name="testimonialsTitle" value={formData.testimonialsTitle} onChange={handleInputChange} placeholder="عنوان الشهادات" className="w-full p-3 rounded-lg bg-gray-700 text-white" />
        {formData.testimonials.map((t, idx) => (
          <div key={t.id} className="flex items-center justify-between mt-3 p-3 bg-gray-700 rounded-lg">
            <span>{t.name} - {t.designation}</span>
            <div className="flex gap-2">
              <button onClick={() => { setEditingTestimonial(t); setIsModalOpen(true); }} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg">تعديل</button>
              <button onClick={() => handleDeleteTestimonial(idx)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg">حذف</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => handleAddItem('testimonials')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-3">إضافة شهادة</button>
      </AccordionSection>

      <AccordionSection title="تواصل معنا" sectionId="contact" openSection={openSection} setOpenSection={setOpenSection}>
        <input type="text" name="contactTitle" value={formData.contactTitle} onChange={handleInputChange} placeholder="عنوان تواصل معنا" className="w-full p-3 rounded-lg bg-gray-700 text-white" />
        <textarea name="contactSubtitle" value={formData.contactSubtitle} onChange={handleInputChange} placeholder="نص تواصل معنا" className="w-full p-3 rounded-lg bg-gray-700 text-white mt-3" />
        <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} placeholder="رقم الهاتف" className="w-full p-3 rounded-lg bg-gray-700 text-white mt-3" />
        <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} placeholder="البريد الإلكتروني" className="w-full p-3 rounded-lg bg-gray-700 text-white mt-3" />
        <input type="text" name="contactAddress" value={formData.contactAddress} onChange={handleInputChange} placeholder="العنوان" className="w-full p-3 rounded-lg bg-gray-700 text-white mt-3" />
        <input type="text" name="workingHours" value={formData.workingHours} onChange={handleInputChange} placeholder="ساعات العمل" className="w-full p-3 rounded-lg bg-gray-700 text-white mt-3" />
        <div className="mt-3 space-y-2">
          {Object.keys(formData.socialLinks).map((key: string) => (
            <input key={key} type="text" name={key} value={formData.socialLinks[key as keyof typeof formData.socialLinks]} onChange={handleSocialChange} placeholder={`رابط ${key}`} className="w-full p-3 rounded-lg bg-gray-700 text-white" />
          ))}
        </div>
      </AccordionSection>

      <div className="flex justify-end">
        <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg mt-6">حفظ التغييرات</button>
      </div>
    </div>
  );
};

export default ContentManagementPage;
