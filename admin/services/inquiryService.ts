// src/services/inquiryService.ts
import api from './api';
import type { Inquiry } from '../types';
import { mapApiInquiryToInquiry } from './mappers';

export const getInquiries = async (): Promise<Inquiry[]> => {
  const response = await api.get('/inquiries');
  const inquiries = response.data.data || response.data; // لو API بيرجع {data: []} أو مجرد []
  return inquiries.map(mapApiInquiryToInquiry);
};

export const getInquiry = async (id: number): Promise<Inquiry> => {
  const response = await api.get(`/inquiries/${id}`);
  return mapApiInquiryToInquiry(response.data.data || response.data); // object واحد
};

// src/services/inquiryService.ts
export const updateInquiry = async (id: number, inquiryData: Partial<Inquiry>): Promise<Inquiry> => {
  const response = await api.put(`/inquiries/${id}`, inquiryData);
  return mapApiInquiryToInquiry(response.data.inquiry); // رجّعي الاستعلام المحدث من الـ response
};
