// src/services/finishingRequestService.ts
import api from './api';
import type { FinishingRequest } from '../types';
import { mapApiFinishingRequestToFinishingRequest } from './mappers';

// ✅ Create new finishing request
export const createFinishingRequest = async (
  data: Partial<FinishingRequest>
): Promise<FinishingRequest> => {
  const response = await api.post('/finishing-requests', data);
  return mapApiFinishingRequestToFinishingRequest(response.data.data || response.data);
};

