// src/services/inquiryService.ts
import api from './api';
import type { Inquiry } from '../types';
import { mapApiInquiryToInquiry } from './mappers';
export const createInquiry = async (inquiryData: any): Promise<Inquiry> => {
  const response = await api.post('/inquiries', inquiryData);
  return mapApiInquiryToInquiry(response.data); // object واحد
};