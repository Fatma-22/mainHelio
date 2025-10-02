import api from './api';
import type { PortfolioItem } from '../types';
import { mapApiPortfolioItemToPortfolioItem } from './mappers';

// جلب كل العناصر
export const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
  const response = await api.get('/portfolio-items');
  const items = response.data.data || response.data;
  return items.map(mapApiPortfolioItemToPortfolioItem);
};

// جلب عنصر واحد
export const getPortfolioItem = async (id: number): Promise<PortfolioItem> => {
  const response = await api.get(`/portfolio-items/${id}`);
  return mapApiPortfolioItemToPortfolioItem(response.data);
};

// إضافة عنصر جديد
export const createPortfolioItem = async (data: Partial<PortfolioItem>, imageFile: File, imageData?: any): Promise<PortfolioItem> => {
  const formData = new FormData();
  
  // Append text fields
  formData.append('title_ar', data.title || '');
  formData.append('description_ar', data.description || '');
  formData.append('type', data.type || '');
  
  // Append image metadata
  if (imageData) {
    formData.append('altText', imageData.altText || '');
    formData.append('caption', imageData.caption || '');
  }
  
  // Append image file
  formData.append('image', imageFile);
  
  const response = await api.post('/portfolio-items', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return mapApiPortfolioItemToPortfolioItem(response.data);
};

// تعديل عنصر موجود
export const updatePortfolioItem = async (id: number, data: Partial<PortfolioItem>, imageFile?: File, imageData?: any): Promise<PortfolioItem> => {
  const formData = new FormData();
  
  // Append text fields
  formData.append('title_ar', data.title || '');
  formData.append('description_ar', data.description || '');
  formData.append('type', data.type || '');
  
  // Append image metadata
  if (imageData) {
    formData.append('altText', imageData.altText || '');
    formData.append('caption', imageData.caption || '');
  }
  
  // Append image file if provided
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  // Use POST with _method override for Laravel
  formData.append('_method', 'PUT');
  
  const response = await api.post(`/portfolio-items/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return mapApiPortfolioItemToPortfolioItem(response.data);
};

// حذف عنصر
export const deletePortfolioItem = async (id: number): Promise<{ message: string; id: number }> => {
  const response = await api.delete(`/portfolio-items/${id}`);
  return {
    message: response.data.message,
    id: response.data.id
  };
};