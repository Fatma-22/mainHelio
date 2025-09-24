import api from './api';
import type { PropertyRequest } from '../types';
import { mapApiPropertyRequestToPropertyRequest } from './mappers';

// جلب كل العقارات اللي لسه Requests (مش منشورة)
export const getPropertyRequests = async (): Promise<PropertyRequest[]> => {
  const response = await api.get('/properties/requests');
  const requests = response.data.data || response.data;
  return requests.map(mapApiPropertyRequestToPropertyRequest);
};

// تعديل + نشر
export const editAndPublishProperty = async (
  id: number,
  requestData: Partial<PropertyRequest>
): Promise<PropertyRequest> => {
  const response = await api.put(`/properties/requests/${id}/edit-publish`, requestData);
  return mapApiPropertyRequestToPropertyRequest(response.data.property);
};

// موافقة
export const approvePropertyRequest = async (id: number): Promise<PropertyRequest> => {
  const response = await api.put(`/properties/requests/${id}/approve`);
  return mapApiPropertyRequestToPropertyRequest(response.data.property);
};

// رفض (وهيتم مسحه)
export const rejectPropertyRequest = async (id: number): Promise<void> => {
  await api.put(`/properties/requests/${id}/reject`);
};

// إنشاء طلب عقار جديد
export const createPropertyRequest = async (requestData: any): Promise<any> => {
  const formData = new FormData();
  
  // إضافة البيانات النصية
  Object.keys(requestData).forEach(key => {
    if (key !== 'images' && key !== 'imagesData') {
      formData.append(key, requestData[key]);
    }
  });
  
  // إضافة الصور وبياناتها الإضافية
  if (requestData.images && requestData.images.length > 0) {
    requestData.images.forEach((image: File, index: number) => {
      formData.append(`images[${index}]`, image);
    });
    
    // إضافة بيانات الصور الإضافية
    const imagesData = requestData.imagesData || [];
    formData.append('imagesData', JSON.stringify(imagesData));
  }
  
  const response = await api.post('/properties/requests', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// رفع الصور لطلب عقار
export const uploadPropertyRequestImages = async (id: number, images: File[], imagesData: any[]): Promise<any> => {
  const formData = new FormData();
  
  // إضافة الصور
  images.forEach((image, index) => {
    formData.append(`images[${index}]`, image);
  });
  
  // إضافة بيانات الصور الإضافية
  formData.append('imagesData', JSON.stringify(imagesData));
  
  const response = await api.post(`/properties/requests/${id}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// تحديث بيانات صور موجودة لطلب عقار
export const updatePropertyRequestImageMetadata = async (id: number, imageId: number, metadata: any): Promise<any> => {
  const response = await api.put(`/properties/requests/${id}/images/${imageId}`, metadata);
  return response.data;
};

// حذف صورة من طلب عقار
export const deletePropertyRequestImage = async (id: number, imageId: number): Promise<void> => {
  await api.delete(`/properties/requests/${id}/images/${imageId}`);
};