import React, { useState, useEffect, useRef } from 'react';
import type { Language } from '../App';
import { translations } from '../data/translations';
import { GoogleGenAI, Type } from "@google/genai";
import FormField, { inputClasses, selectClasses } from './shared/FormField';
import { createProperty } from '../services/propertyService';
import ImageUploader from './ImageUploader';
import { ImageItem } from '../types';
import { useAlert } from '../hooks/userAlert';

// Initialize the AI client once
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
});
interface AddPropertyModalProps {
  onClose: () => void;
  language: Language;
}
const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ onClose, language }) => {
  const t = translations[language].addPropertyModal;
  const modalRef = useRef<HTMLDivElement>(null);
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [formData, setFormData] = useState({
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    contactTime: '',
    type: '',
    area: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    address: '',
    mapLocation: '',
    description: '',
    keywords: '',
    listingPlan: '', 
    status: '',  
    finish: '', 
  });
  
  const [images, setImages] = useState<ImageItem[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ImageItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    
    // منع التمرير في الصفحة الرئيسية
    document.body.style.overflow = 'hidden';
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // استعادة التمرير عند إغلاق المودال
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  
  const handleClose = () => {
    setImages([]);
    setUploadedImages([]);
    onClose();
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const errorMessages = translations[language].errors;
    
    // التحقق من الاسم
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = errorMessages.ownerNameRequired;
    } else if (formData.ownerName.length < 3) {
      newErrors.ownerName = errorMessages.ownerNameMinLength;
    }
    
    // التحقق من رقم الهاتف
    const phoneRegex = /^[+]?[\d\s\-]{10,15}$/;
    if (!formData.ownerPhone.trim()) {
      newErrors.ownerPhone = errorMessages.ownerPhoneRequired;
    } else if (!phoneRegex.test(formData.ownerPhone)) {
      newErrors.ownerPhone = errorMessages.ownerPhoneInvalid;
    }
    
    // التحقق من البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.ownerEmail.trim()) {
      newErrors.ownerEmail = errorMessages.ownerEmailRequired;
    } else if (!emailRegex.test(formData.ownerEmail)) {
      newErrors.ownerEmail = errorMessages.ownerEmailInvalid;
    }
    
    // التحقق من وقت التواصل
    if (!formData.contactTime) {
      newErrors.contactTime = errorMessages.contactTimeRequired;
    }
    
    // التحقق من نوع العقار
    if (!formData.type) {
      newErrors.type = errorMessages.propertyTypeRequired;
    }
    
    // التحقق من المساحة
    if (!formData.area) {
      newErrors.area = errorMessages.areaRequired;
    } else if (isNaN(Number(formData.area)) || Number(formData.area) <= 0) {
      newErrors.area = errorMessages.areaInvalid;
    }
    
    // التحقق من السعر
    if (!formData.price) {
      newErrors.price = errorMessages.priceRequired;
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = errorMessages.priceInvalid;
    }
    
    // التحقق من غرف النوم والحمامات (للشقق والفلل فقط)
    if (formData.type === 'شقة' || formData.type === 'فيلا') {
      if (!formData.bedrooms) {
        newErrors.bedrooms = errorMessages.bedroomsRequired;
      } else if (isNaN(Number(formData.bedrooms)) || Number(formData.bedrooms) < 0) {
        newErrors.bedrooms = errorMessages.bedroomsInvalid;
      }
      
      if (!formData.bathrooms) {
        newErrors.bathrooms = errorMessages.bathroomsRequired;
      } else if (isNaN(Number(formData.bathrooms)) || Number(formData.bathrooms) < 0) {
        newErrors.bathrooms = errorMessages.bathroomsInvalid;
      }
    }
    
    // التحقق من العنوان
    if (!formData.address.trim()) {
      newErrors.address = errorMessages.addressRequired;
    } else if (formData.address.length < 5) {
      newErrors.address = errorMessages.addressMinLength;
    }
    
    // التحقق من الحالة
    if (!formData.status) {
      newErrors.status = errorMessages.statusRequired;
    }
    
    // التحقق من خطة الإدراج
    if (!formData.listingPlan) {
      newErrors.listingPlan = errorMessages.listingPlanRequired;
    }
    
    // التحقق من الموقع على الخريطة
    if (!formData.mapLocation.trim()) {
      newErrors.mapLocation = errorMessages.mapLocationRequired;
    }
    
    // التحقق من الكلمات المفتاحية
    if (!formData.keywords.trim()) {
      newErrors.keywords = errorMessages.keywordsRequired;
    }
    
    // التحقق من الوصف
    if (!formData.description.trim()) {
      newErrors.description = errorMessages.descriptionRequired;
    }
    
    // التحقق من الصور - يجب أن يكون هناك 3 صور على الأقل
    if (images.length < 3) {
      newErrors.images = errorMessages.imagesMinCount;
    }
    
    // التحقق من التشطيب (للعقارات المباعة فقط)
    if (formData.status === 'للبيع' && (formData.type === 'شقة' || formData.type === 'فيلا')) {
      if (!formData.finish) {
        newErrors.finish = errorMessages.finishRequired;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    // التحقق من الحقول الرقمية
    if (['area', 'price', 'bedrooms', 'bathrooms'].includes(id)) {
      // السماح بالأرقام فقط
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [id]: numericValue }));
      
      // مسح رسالة الخطأ عند التعديل
      if (errors[id]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[id];
          return newErrors;
        });
      }
      return;
    }
    
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // مسح رسالة الخطأ عند التعديل
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };
  
  const handleGenerateDescription = async () => {
    if (!formData.type || !formData.area || !formData.keywords) {
          showErrorAlert(t.errorFillFields);

      return;
    }
    
    setIsGenerating(true);
    try {
      let promptDetails = `
        - Property Type: ${formData.type}
        - Area: ${formData.area} square meters
        - Key features & keywords: ${formData.keywords}
      `;
      if (formData.bedrooms && (formData.type === 'apartment' || formData.type === 'villa')) {
        promptDetails += `\n- Bedrooms: ${formData.bedrooms}`;
      }
      const prompt = `
        Act as a professional real estate marketer. Based on the following details, write a compelling and attractive property description in both Arabic and English.
        ${promptDetails}
        The description should highlight the key features and create a sense of luxury and desirability.
      `;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ar: { type: Type.STRING },
              en: { type: Type.STRING },
            },
            propertyOrdering: ["ar", "en"],
          }
        }
      });
      const jsonResponse = JSON.parse(response.text);
      setFormData(prev => ({ ...prev, description: jsonResponse[language] }));
    } catch (error) {
      console.error("Error generating description:", error);
      showErrorAlert(t.errorGeneration);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleUploadComplete = (uploadedImages: ImageItem[]) => {
    setUploadedImages(uploadedImages);
    console.log('Images uploaded successfully:', uploadedImages);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      if (errors.images) {
        const imagesSection = document.getElementById('propertyImages');
        if (imagesSection) {
          imagesSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }
    
    setIsSubmitting(true);
    try {
      const propertyDataToSend = {
        ...formData,
        listing_plan: formData.listingPlan,
        alt_texts: images.map(img => img.altText),
        featured_images: images.map(img => img.isFeatured ? 1 : 0)
      };
      
      // استخدام الصور المرفوعة إذا كانت متاحة، وإلا استخدام الصور الأصلية
      const imageFiles = uploadedImages.length > 0 
        ? uploadedImages.map(img => img.file) 
        : images.map(img => img.file);
      
      await createProperty(propertyDataToSend, imageFiles);
      showSuccessAlert(translations[language].success.propertyAdded);
      handleClose();
    } catch (error) {
      console.error("Error submitting property:", error);
      showErrorAlert(translations[language].errors.errorSubmit);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const showBedroomAndBathFields = formData.type === 'شقة' || formData.type === 'فيلا';
  const showFinishField = showBedroomAndBathFields && formData.status === 'للبيع';
  
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        ref={modalRef}
        className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
            <button onClick={handleClose} className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} text-gray-400 hover:text-white transition-colors`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
            <h2 className="text-3xl font-bold text-amber-500 mb-6 text-center">{t.title}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="border-b border-gray-700 pb-6">
                    <h3 className="text-lg font-semibold text-gray-100 mb-4">{t.ownerInfo}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label={t.fullName} id="ownerName">
                            <input 
                              type="text" 
                              id="ownerName" 
                              className={`${inputClasses} ${errors.ownerName ? 'border-red-500' : ''}`} 
                              required 
                              value={formData.ownerName} 
                              onChange={handleChange} 
                            />
                            {errors.ownerName && <div className="text-red-500 text-sm mt-1">{errors.ownerName}</div>}
                        </FormField>
                         <FormField label={t.phone} id="ownerPhone">
                            <input 
                              type="tel" 
                              id="ownerPhone" 
                              className={`${inputClasses} ${errors.ownerPhone ? 'border-red-500' : ''}`} 
                              required 
                              dir="ltr" 
                              value={formData.ownerPhone} 
                              onChange={handleChange} 
                            />
                            {errors.ownerPhone && <div className="text-red-500 text-sm mt-1">{errors.ownerPhone}</div>}
                        </FormField>
                        <FormField label={t.emailOptional} id="ownerEmail">
                            <input 
                              type="email" 
                              id="ownerEmail" 
                              required
                              className={`${inputClasses} ${errors.ownerEmail ? 'border-red-500' : ''}`} 
                              value={formData.ownerEmail} 
                              onChange={handleChange} 
                            />
                            {errors.ownerEmail && <div className="text-red-500 text-sm mt-1">{errors.ownerEmail}</div>}
                        </FormField>
                        <FormField label={t.contactTime} id="contactTime">
                            <select 
                              id="contactTime" 
                              className={`${selectClasses} ${errors.contactTime ? 'border-red-500' : ''}`} 
                              required 
                              value={formData.contactTime} 
                              onChange={handleChange}
                            >
                                <option value="">{t.selectTime}</option>
                                <option value="morning">{t.morning}</option>
                                <option value="afternoon">{t.afternoon}</option>
                                <option value="evening">{t.evening}</option>
                            </select>
                            {errors.contactTime && <div className="text-red-500 text-sm mt-1">{errors.contactTime}</div>}
                        </FormField>
                    </div>
                </div>
                <div className="border-b border-gray-700 pb-6">
                     <h3 className="text-lg font-semibold text-gray-100 mb-4">{t.propertyDetails}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label={t.propertyType} id="type">
                            <select 
                              id="type" 
                              className={`${selectClasses} ${errors.type ? 'border-red-500' : ''}`} 
                              required 
                              value={formData.type} 
                              onChange={handleChange}
                            >
                                <option value="">{t.selectType}</option>
                                <option value="شقة">{t.apartment}</option>
                                <option value="فيلا">{t.villa}</option>
                                <option value="تجاري">{t.commercial}</option>
                                <option value="ارض">{t.land}</option>
                            </select>
                            {errors.type && <div className="text-red-500 text-sm mt-1">{errors.type}</div>}
                        </FormField>
                        <FormField label={t.area} id="area">
                            <input 
                              type="text" 
                              id="area" 
                              className={`${inputClasses} ${errors.area ? 'border-red-500' : ''}`} 
                              required 
                              min="1" 
                              value={formData.area} 
                              onChange={handleChange} 
                            />
                            {errors.area && <div className="text-red-500 text-sm mt-1">{errors.area}</div>}
                        </FormField>
                        {showBedroomAndBathFields && (
                            <>
                                <FormField label={t.bedrooms} id="bedrooms">
                                    <input 
                                      type="text" 
                                      id="bedrooms" 
                                      className={`${inputClasses} ${errors.bedrooms ? 'border-red-500' : ''}`} 
                                      required 
                                      min="0" 
                                      value={formData.bedrooms} 
                                      onChange={handleChange} 
                                    />
                                    {errors.bedrooms && <div className="text-red-500 text-sm mt-1">{errors.bedrooms}</div>}
                                </FormField>
                                <FormField label={t.bathrooms} id="bathrooms">
                                    <input 
                                      type="text" 
                                      id="bathrooms" 
                                      className={`${inputClasses} ${errors.bathrooms ? 'border-red-500' : ''}`} 
                                      required 
                                      min="0" 
                                      value={formData.bathrooms} 
                                      onChange={handleChange} 
                                    />
                                    {errors.bathrooms && <div className="text-red-500 text-sm mt-1">{errors.bathrooms}</div>}
                                </FormField>
                            </>
                        )}
                        {showFinishField && (
                            <FormField label={t.finishing} id="finish">
                                <select 
                                  id="finish" 
                                  className={`${selectClasses} ${errors.finish ? 'border-red-500' : ''}`} 
                                  required
                                  value={formData.finish || ''} 
                                  onChange={handleChange}
                                >
                                    <option value="">{t.selectFinish}</option>
                                    <option value="على الطوب">{t.basic}</option>
                                    <option value="نص تشطيب">{t.semi}</option>
                                    <option value="تشطيب كامل">{t.full}</option>
                                </select>
                                {errors.finish && <div className="text-red-500 text-sm mt-1">{errors.finish}</div>}
                            </FormField>
                        )}
                        <FormField label={t.status} id="status">
                            <select 
                              id="status" 
                              className={`${selectClasses} ${errors.status ? 'border-red-500' : ''}`} 
                              required 
                              value={formData.status} 
                              onChange={handleChange}
                            >
                                <option value="">{t.selectStatus}</option>
                                <option value="للبيع">{t.forSale}</option>
                                <option value="للإيجار">{t.forRent}</option>
                            </select>
                            {errors.status && <div className="text-red-500 text-sm mt-1">{errors.status}</div>}
                        </FormField>
                        <div className="md:col-span-2">
                           <FormField label={t.price} id="price">
                                <input 
                                  type="text" 
                                  id="price" 
                                  className={`${inputClasses} ${errors.price ? 'border-red-500' : ''}`} 
                                  required 
                                  min="0" 
                                  value={formData.price} 
                                  onChange={handleChange} 
                                />
                                {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
                            </FormField>
                        </div>
                         <div className="md:col-span-2">
                           <FormField label={t.address} id="address">
                                <input 
                                  type="text" 
                                  id="address" 
                                  className={`${inputClasses} ${errors.address ? 'border-red-500' : ''}`} 
                                  required 
                                  value={formData.address} 
                                  onChange={handleChange} 
                                />
                                {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
                            </FormField>
                        </div>
                        <div className="md:col-span-2">
                           <FormField label={t.mapLocation} id="mapLocation">
                                <input 
                                  type="text" 
                                  id="mapLocation" 
                                  placeholder={t.mapLocationPlaceholder} 
                                  className={`${inputClasses} ${errors.mapLocation ? 'border-red-500' : ''}`} 
                                  required
                                  value={formData.mapLocation} 
                                  onChange={handleChange} 
                                />
                                {errors.mapLocation && <div className="text-red-500 text-sm mt-1">{errors.mapLocation}</div>}
                            </FormField>
                        </div>
                        <div className="md:col-span-2">
                           <FormField label={t.keywords} id="keywords">
                                <textarea 
                                  id="keywords" 
                                  rows={2} 
                                  className={`${inputClasses} ${errors.keywords ? 'border-red-500' : ''}`} 
                                  placeholder={t.keywordsPlaceholder} 
                                  required
                                  value={formData.keywords} 
                                  onChange={handleChange}
                                ></textarea>
                                {errors.keywords && <div className="text-red-500 text-sm mt-1">{errors.keywords}</div>}
                            </FormField>
                        </div>
                        <div className="md:col-span-2">
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300">{t.description}</label>
                                <button 
                                  type="button" 
                                  onClick={handleGenerateDescription} 
                                  disabled={isGenerating} 
                                  className="text-sm text-amber-500 font-semibold hover:text-amber-400 disabled:text-gray-500 disabled:cursor-wait flex items-center gap-1"
                                >
                                    {isGenerating ? t.generating : t.generateWithAI} ✨
                                </button>
                           </div>
                           <textarea 
                             id="description" 
                             rows={5} 
                             className={`${inputClasses} ${errors.description ? 'border-red-500' : ''}`} 
                             required
                             value={formData.description} 
                             onChange={handleChange}
                           ></textarea>
                           {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                        </div>
                     </div>
                </div>
                
                <div id="propertyImages">
                     <h3 className="text-lg font-semibold text-gray-100 mb-4">{t.imagesAndPlan}</h3>
                     <div className="space-y-4">
                        <FormField label={t.uploadImages} id="propertyImages">
                            <ImageUploader 
                              images={images}
                              onImagesChange={setImages}
                              minImages={3}
                              maxImages={20}
                              language={language}
                              onUploadComplete={handleUploadComplete}
                            />
                            {errors.images && <div className="text-red-500 text-sm mt-1">{errors.images}</div>}
                        </FormField>
                        <FormField label={t.listingPlan} id="listingPlan">
                             <select 
                                id="listingPlan" 
                                className={`${selectClasses} ${errors.listingPlan ? 'border-red-500' : ''}`} 
                                required
                                value={formData.listingPlan} 
                                onChange={handleChange}
                             >
                                <option value="">{t.selectPlan}</option>
                                <option value="paid">{t.paidListing}</option>
                                <option value="commission">{t.commissionListing}</option>
                            </select>
                            {errors.listingPlan && <div className="text-red-500 text-sm mt-1">{errors.listingPlan}</div>}
                        </FormField>
                    </div>
                </div>
                <div className="pt-6 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-amber-500 text-gray-900 font-bold px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors duration-200 disabled:opacity-50"
                    >
                      {isSubmitting ? t.submitting : t.submit}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};
export default AddPropertyModal;