import api from './api';
import type {
  Inquiry,
  Property,
  PropertyRequest,
  FinishingRequest,
  DecorationRequest,
} from "../types";
import {
  mapApiInquiryToInquiry,
  mapApiPropertyToProperty,
  mapApiPropertyRequestToPropertyRequest,
  mapApiFinishingRequestToFinishingRequest,
  mapApiDecorationRequestToDecorationRequest,
} from "../services/mappers"; // مكان المابّرات عندك

export interface PropertyTypeStat {
  type: string;
  count: number;
}

export interface LatestActivities {
  properties: Property[];
  inquiries: Inquiry[];
  requests: (PropertyRequest | FinishingRequest | DecorationRequest)[];
}

export interface DashboardStats {
  totalProperties: number;
  newServiceRequests: number;
  newInquiries: number;
  pendingPropertyRequests: number;
  propertiesByType: PropertyTypeStat[];
  latestActivities: LatestActivities;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/dashboard/stats');
  const data = response.data;

  // 🟢 تطبيق المابّرات على الأنشطة
  const properties: Property[] = (data.latestActivities?.properties || []).map(mapApiPropertyToProperty);
  const inquiries: Inquiry[] = (data.latestActivities?.inquiries || []).map(mapApiInquiryToInquiry);
  const requests: (PropertyRequest | FinishingRequest | DecorationRequest)[] =
    (data.latestActivities?.requests || []).map(req => {
      if ("customer_name" in req || "clientName" in req) {
        // طلب تشطيب أو ديكور
        return "type" in req && req.type === "decor" 
          ? mapApiDecorationRequestToDecorationRequest(req)
          : mapApiFinishingRequestToFinishingRequest(req);
      } else {
        // طلب عقار
        return mapApiPropertyRequestToPropertyRequest(req);
      }
    });

  return {
    totalProperties: data.totalProperties,
    newServiceRequests: data.newServiceRequests,
    newInquiries: data.newInquiries,
    pendingPropertyRequests: data.pendingPropertyRequests,
    propertiesByType: data.propertiesByType,
    latestActivities: { properties, inquiries, requests },
  };
};
