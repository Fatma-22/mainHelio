import React from "react";

export type Page =
  | "لوحة التحكم"
  | "إدارة العقارات"
  | "إدارة الاستفسارات"
  | "إدارة العملاء"
  | "إدارة المستخدمين"
  | "إدارة المحتوى"
  | "طلبات إضافة العقارات"
  | "إدارة التشطيبات"
  | "إدارة الديكورات"
  | "إدارة معرض الأعمال";
export type PropertyFinish = "full" | "partial" | "bare"; // تشطيب كامل / نص تشطيب / على الطوب
export type PropertyVideo = {
  id: number;
  property_id: number;
  video_url: string;
  thumbnail_url?: string;
};

export interface StatCardData {
  title: string;
  value: string;
  change?: string;
  changeType?: "increase" | "decrease";
  icon: React.ReactNode;
  pageLink?: Page;
}

export interface AnalyticsDataPoint {
  name: string;
  visitors: number;
  pageViews: number;
}
export interface ApiImage {
  id: number;
  url: string;
  thumbnail_url?: string;
  medium_url?: string;
  alt_text: string;
  caption?: string;
  isfeatured: number;
  sort: number;
  file_size?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  original_filename?: string;
  mime_type?: string;
  seo_keywords?: string;
}

export type PropertyStatus = "للبيع" | "للإيجار" | "مباع" | "مؤجر";
export type PropertyType = "شقة" | "فيلا" | "أرض" | "تجاري";

export interface Property {
  id: number;
  title: string;
  price: string;
  status: PropertyStatus;
  type: PropertyType;
  finish?: PropertyFinish;
  area: number;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  gallery: ApiImage[] | ImageItem[];
  videos?: PropertyVideo[];
  address: string;
  isListed: boolean;
  listingEndDate: string;
  description?: string;
  keywords?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  addeddate: string;
  listingPlane: string;
  isfeatured?: boolean;
  altText?: string;
}

export type InquiryStatus = "جديد" | "تم التواصل" | "قيد المتابعة" | "مغلق";
export type InquiryType = "تواصل عام" | "طلب ديكور" | "إضافة عقار";

export interface Inquiry {
  id: number;
  sender: string;
  phone: string;
  message: string;
  date: string;
  status: InquiryStatus;
  type: InquiryType;
  read: boolean;
  notes?: string;
}

export type UserRole =
  | "مدير عام"
  | "مندوب مبيعات"
  | "محرر محتوى"
  | "مسؤل مبيعات العقارات"
  | "مسؤل مبيعات التشطيبات"
  | "مسؤل مبيعات الديكورات والتحف"
  | "منسق";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  roleId: number;
  role: UserRole;
  lastLogin: string;
  password?: string;
}

export interface PropertyRequest {
  id: number;
  requesterName: string;
  requesterPhone: string;
  requestDate: string;
  title: string;
  address: string;
  price: string;
  status: PropertyStatus;
  type: PropertyType;
  finish?: PropertyFinish;
  description: string;
  keywords: string;
  imageUrl: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  gallery: ApiImage[] | ImageItem[];
  videos?: PropertyVideo[];
  listingEndDate: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  listingPlane: string;
  isListed?: boolean;
  isfeatured?: boolean;
  altText?: string;
}

export type FinishingRequestStatus =
  | "جديد"
  | "تم التواصل"
  | "قيد التنفيذ"
  | "مكتمل"
  | "ملغي";
export type FinishingRequestType =
  | "استشارة وتصور"
  | "تصميم ثلاثي الأبعاد"
  | "تنفيذ وإشراف";

export interface FinishingRequest {
  id: number;
  clientName: string;
  clientPhone: string;
  requestDate: string;
  type: FinishingRequestType;
  status: FinishingRequestStatus;
  details: string;
  notes?: string;
}

export type DecorationRequestStatus =
  | "جديد"
  | "تم التواصل"
  | "قيد التنفيذ"
  | "مكتمل"
  | "ملغي";
export type DecorationRequestType =
  | "لوحات كانفس"
  | "تحف ديكورية"
  | "منحوتات جدارية"
  | "تشطيبات";

export interface PortfolioItem {
  id: number;
  title: string;
  type: DecorationRequestType;
  description: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  altText?: string;
  caption?: string;
}

export interface DecorationRequest {
  id: number;
  clientName: string;
  clientPhone: string;
  requestDate: string;
  type: DecorationRequestType;
  status: DecorationRequestStatus;
  details: string;
  notes?: string;
  reference_item_id?: number;
  image: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  coverUrl: string;
  altText?: string;
  caption?: string;
}

// Types for Content Management
export interface Testimonial {
  id: number;
  name: string;
  quote: string;
  designation: string;
  imageUrl: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  iconUrl: string;
  link: string;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string;
  firstContact: string; // ISO date string
  notes?: string;
}
export interface AboutPoint {
  id: string;
  description: string;
}
export interface SiteContent {
  heroTitle: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutPoints: AboutPoint[];
  servicesTitle: string;
  services: ServiceItem[];
  testimonialsTitle: string;
  testimonials: Testimonial[];
  contactTitle: string;
  contactSubtitle: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  workingHours: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  heroSubtitle: string;
}

export type ToastType = "success" | "error";
export interface ToastState {
  message: string;
  type: ToastType;
}
export interface ImageItem {
  id: string;
  file: File | null;
  altText: string;
  caption?: string;
  isFeatured?: boolean;
  sort?: number | null;
  previewUrl: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  width: number;
  height: number;
  valid: boolean;
  uploadProgress?: number;
  serverUrl?: string;
  fileSize?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  originalFilename?: string;
  mimeType?: string;
  seoKeywords?: string;
  editedFile?: File;
  editData?: {
    rotation: number;
    scale: number;
    crop?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
  isEdited?: boolean;
  originalDimensions?: {
    width: number;
    height: number;
  };
  isExisting?: boolean;
  originalId?: number;
  filename?: string;
  isDeleted?: boolean;
}
