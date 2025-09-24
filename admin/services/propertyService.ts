import api from './api';
import type { Property } from '../types';
import { mapApiPropertyToProperty } from "./mappers";

export const getProperties = async (): Promise<Property[]> => {
  const response = await api.get('/properties');
  const properties = response.data.data || response.data;
  return properties.map(mapApiPropertyToProperty);
};

export const getProperty = async (id: number): Promise<Property> => {
  const response = await api.get(`/properties/${id}`);
  return mapApiPropertyToProperty(response.data);
};

export const createProperty = async (propertyData: any): Promise<Property> => {
  const formData = new FormData();
  
  // إضافة البيانات النصية
  Object.keys(propertyData).forEach(key => {
    if (key !== 'images' && key !== 'imagesData') {
      formData.append(key, propertyData[key]);
    }
  });
  
  // إضافة الصور
  if (propertyData.images && propertyData.images.length > 0) {
    propertyData.images.forEach((image: File, index: number) => {
      formData.append(`images[${index}]`, image);
    });
  }
  
  // إضافة بيانات الصور كعناصر منفصلة
  if (propertyData.imagesData && propertyData.imagesData.length > 0) {
    propertyData.imagesData.forEach((imageData: any, index: number) => {
      Object.keys(imageData).forEach(key => {
        formData.append(`imagesData[${index}][${key}]`, imageData[key]);
      });
    });
  }
  
  const response = await api.post('/properties', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return mapApiPropertyToProperty(response.data);
};

export const updateProperty = async (id: number, propertyData: any): Promise<Property> => {
  const formData = new FormData();
  
  // إضافة البيانات النصية
  Object.keys(propertyData).forEach(key => {
    if (key !== 'images' && key !== 'imagesData') {
      formData.append(key, propertyData[key]);
    }
  });
  
  // إضافة الصور الجديدة فقط
  if (propertyData.images && propertyData.images.length > 0) {
    propertyData.images.forEach((image: File, index: number) => {
      formData.append(`images[${index}]`, image);
    });
  }
  
  // إضافة بيانات الصور كعناصر منفصلة
  if (propertyData.imagesData && propertyData.imagesData.length > 0) {
    propertyData.imagesData.forEach((imageData: any, index: number) => {
      Object.keys(imageData).forEach(key => {
        formData.append(`imagesData[${index}][${key}]`, imageData[key]);
      });
    });
  }
  
  const response = await api.post(`/properties/${id}?_method=PUT`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return mapApiPropertyToProperty(response.data);
};

export const deleteProperty = async (id: number): Promise<void> => {
  await api.delete(`/properties/${id}`);
};

export const syncPropertyAmenities = async (id: number, amenityIds: number[]): Promise<void> => {
  await api.post(`/properties/${id}/amenities`, { amenities: amenityIds });
};

// دالة لرفع الصور مع بياناتها الإضافية
export const uploadPropertyImages = async (id: number, images: File[], imagesData: any[]): Promise<any> => {
  const formData = new FormData();
  
  // إضافة الصور
  images.forEach((image, index) => {
    formData.append(`images[${index}]`, image);
  });
  
  // إضافة بيانات الصور الإضافية
  formData.append('imagesData', JSON.stringify(imagesData));
  
  const response = await api.post(`/properties/${id}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// دالة لتحديث بيانات صورة موجودة
export const updateImageMetadata = async (propertyId: number, imageId: number, metadata: any): Promise<any> => {
  const response = await api.put(`/properties/${propertyId}/images/${imageId}`, metadata);
  return response.data;
};

// دالة لحذف صورة
export const deletePropertyImage = async (propertyId: number, imageId: number): Promise<void> => {
  await api.delete(`/properties/${propertyId}/images/${imageId}`);
};