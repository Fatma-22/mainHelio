// src/services/finishingRequestService.ts
import api from './api';
import type { FinishingRequest } from '../types';
import { mapApiFinishingRequestToFinishingRequest } from './mappers';

// ✅ Get all finishing requests
export const getFinishingRequests = async (): Promise<FinishingRequest[]> => {
  const response = await api.get('/finishing-requests');
  const requests = response.data.data || response.data; // بعض الـ APIs بترجع { data: [] }
  return requests.map(mapApiFinishingRequestToFinishingRequest);
};

// ✅ Get single finishing request by ID
export const getFinishingRequest = async (id: number): Promise<FinishingRequest> => {
  const response = await api.get(`/finishing-requests/${id}`);
  return mapApiFinishingRequestToFinishingRequest(response.data.data || response.data);
};

// ✅ Create new finishing request
export const createFinishingRequest = async (
  data: Partial<FinishingRequest>
): Promise<FinishingRequest> => {
  const response = await api.post('/finishing-requests', data);
  return mapApiFinishingRequestToFinishingRequest(response.data.data || response.data);
};

// ✅ Update existing finishing request
export const updateFinishingRequest = async (
  id: number,
  data: Partial<FinishingRequest>
): Promise<FinishingRequest> => {
  const response = await api.put(`/finishing-requests/${id}`, data);
  return mapApiFinishingRequestToFinishingRequest(response.data.data || response.data);
};

// ✅ Delete finishing request
export const deleteFinishingRequest = async (id: number): Promise<void> => {
  await api.delete(`/finishing-requests/${id}`);
};
