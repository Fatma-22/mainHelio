import api from './api';
import type { DecorationRequest } from '../types';
import { mapApiDecorationRequestToDecorationRequest } from './mappers';

// 🟢 Get all decoration requests
export const getDecorRequests = async (): Promise<DecorationRequest[]> => {
  const response = await api.get('/decor-requests');
  // الباك إند يعيد مصفوفة مباشرة وليست داخل كائن data
  const requests = response.data;
  return requests.map(mapApiDecorationRequestToDecorationRequest);
};

// 🟢 Get single decoration request by ID
export const getDecorRequestById = async (
  id: number
): Promise<DecorationRequest> => {
  const response = await api.get(`/decor-requests/${id}`);
  // الباك إند يعيد الكائن مباشرة وليس داخل كائن data
  return mapApiDecorationRequestToDecorationRequest(response.data);
};

// 🟢 Create new decoration request
export const createDecorRequest = async (
  data: Partial<DecorationRequest>,
  imageFile?: File,
  imageData?: any
): Promise<DecorationRequest> => {
  const formData = new FormData();
  
  // Append text fields - متوافقة مع أسماء الحقول في الباك إند
  formData.append('clientName', data.clientName || '');
  formData.append('clientPhone', data.clientPhone || '');
  formData.append('type', data.type || '');
  formData.append('details', data.details || '');
  formData.append('reference_item_id', data.reference_item_id?.toString() || '');
  
  // Append image metadata
  if (imageData) {
    formData.append('altText', imageData.altText || '');
    formData.append('caption', imageData.caption || '');
  }
  
  // Append image file if provided
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  const response = await api.post('/decor-requests', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return mapApiDecorationRequestToDecorationRequest(response.data);
};

// 🟢 Update decoration request
export const updateDecorRequest = async (
  id: number,
  data: Partial<DecorationRequest>
): Promise<DecorationRequest> => {
  const response = await api.put(`/decor-requests/${id}`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return mapApiDecorationRequestToDecorationRequest(response.data);
};
// 🟢 Delete decoration request
export const deleteDecorRequest = async (id: number): Promise<void> => {
  await api.delete(`/decor-requests/${id}`);
};

// 🟢 Upload image for decoration request
export const uploadDecorRequestImage = async (id: number, imageFile: File, imageData?: any): Promise<any> => {
  const formData = new FormData();
  
  formData.append('image', imageFile);
  
  if (imageData) {
    formData.append('altText', imageData.altText || '');
    formData.append('caption', imageData.caption || '');
  }
  
  const response = await api.post(`/decor-requests/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// 🟢 Update image metadata for decoration request
export const updateDecorRequestImageMetadata = async (id: number, imageId: number, metadata: any): Promise<any> => {
  const response = await api.put(`/decor-requests/${id}/images/${imageId}`, metadata);
  return response.data;
};

// 🟢 Delete image from decoration request
export const deleteDecorRequestImage = async (id: number, imageId: number): Promise<void> => {
  await api.delete(`/decor-requests/${id}/images/${imageId}`);
};