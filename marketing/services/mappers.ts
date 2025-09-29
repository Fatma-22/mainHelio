import type {
  AdminUser,
  Property,
  Inquiry,
  PropertyRequest,
  FinishingRequest,
  DecorationRequest,
  PortfolioItem,
  Client,
  UserRole,
  PropertyStatus,
  PropertyType,
  PropertyFinish,
  InquiryStatus,
  InquiryType,
  FinishingRequestStatus,
  FinishingRequestType,
  DecorationRequestStatus,
  DecorationRequestType,
  SiteContent,
  ServiceItem,
  Testimonial,
  ImageItem,
  ApiImage,
} from "../types";

// ===== AdminUser =====
const ROLE_MAP: Record<number, UserRole> = {
  1: "مدير عام",
  2: "مندوب مبيعات",
  3: "محرر محتوى",
  4: "مسؤل مبيعات العقارات",
  5: "مسؤل مبيعات التشطيبات",
  6: "مسؤل مبيعات الديكورات والتحف",
  7: "منسق",
};

export function mapApiUserToAdminUser(apiUser: any): AdminUser {
  const roleId = apiUser.role_id ?? 7; // 7 = "منسق" افتراضي
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    roleId,
    role: ROLE_MAP[roleId] || "منسق",
    lastLogin: apiUser.last_login_at
      ? new Date(apiUser.last_login_at).toLocaleString()
      : "",
  };
}

// ===== Property =====
export function mapApiPropertyToProperty(apiProp: any): Property {
  // دالة مساعدة للتعامل مع القيم الرقمية
  const parseNumber = (value: any, defaultValue: number = 0): number => {
    if (value === null || value === undefined || value === "")
      return defaultValue;
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  // دالة مساعدة للتعامل مع القيم المنطقية
  const parseBoolean = (value: any): boolean => {
    return value === 1 || value === "1" || value === true || value === "true";
  };

  return {
    id: apiProp.id || 0,
    title: apiProp.title_ar || apiProp.title_en || apiProp.title || "",
    price: apiProp.price || "",
    status: (apiProp.status as PropertyStatus) || "للبيع",
    type: (apiProp.type as PropertyType) || "شقة",
    finish: (apiProp.finish as PropertyFinish) || undefined,
    area: parseNumber(apiProp.area),
    bedrooms: parseNumber(apiProp.bedrooms),
    bathrooms: parseNumber(apiProp.bathrooms),
    imageUrl: apiProp.images?.find((img: any) => img.isfeatured)
      ? apiProp.images.find((img: any) => img.isfeatured).url
      : apiProp.images?.[0]?.url || "",
    thumbnailUrl: apiProp.images?.[0]?.thumbnail_url || "",
    mediumUrl: apiProp.images?.[0]?.medium_url || "",
    // كل الصور بالخصائص المطلوبة
    gallery: apiProp.images?.map(mapApiImageToImageItem) || [],
    address: apiProp.address || "",
    isListed: parseBoolean(apiProp.is_listed),
    listingEndDate: apiProp.listing_end_date || null,
    description: apiProp.desc_ar || apiProp.desc_en || apiProp.description,
    latitude: parseNumber(apiProp.lat),
    longitude: parseNumber(apiProp.lng),
    googleMapsUrl: apiProp.google_maps_url || "",
    addeddate: apiProp.created_at || "",
    listingPlane: apiProp.listing_plan || "",
    keywords: apiProp.keywords || "",
  };
}

// ===== Inquiry =====
export function mapApiInquiryToInquiry(apiInq: any): Inquiry {
  return {
    id: apiInq.id,
    sender: apiInq.name || apiInq.sender || "",
    phone: apiInq.phone || "",
    message: apiInq.message || "",
    date: apiInq.created_at || "",
    status: (apiInq.status as InquiryStatus) || "جديد",
    type: (apiInq.type as InquiryType) || "تواصل عام",
    read: Boolean(apiInq.read),
    notes: apiInq.notes || "",
  };
}

// ===== PropertyRequest =====
export function mapApiPropertyRequestToPropertyRequest(
  apiReq: any
): PropertyRequest {
  return {
    id: apiReq.id,
    requesterName: apiReq.name || apiReq.requesterName,
    requesterPhone: apiReq.phone || apiReq.requesterPhone || "",
    requestDate: apiReq.requested_at || "",
    title: apiReq.title_ar || apiReq.title_en || apiReq.title || "",
    address: apiReq.address || "",
    area: apiReq.area ? parseFloat(apiReq.area) : 0,
    bedrooms: apiReq.bedrooms ? parseInt(apiReq.bedrooms) : 0,
    bathrooms: apiReq.bathrooms ? parseInt(apiReq.bathrooms) : 0,
    price: apiReq.price || "",
    status: (apiReq.status as PropertyStatus) || "للبيع",
    type: (apiReq.type as PropertyType) || "شقة",
    finish: (apiReq.finish as PropertyFinish) || undefined,
    description: apiReq.desc_ar || apiReq.desc_en || apiReq.description || "",
    keywords: apiReq.keywords || "",
    imageUrl: apiReq.images?.[0]?.url || "",
    thumbnailUrl: apiReq.images?.[0]?.thumbnail_url || "",
    mediumUrl: apiReq.images?.[0]?.medium_url || "",
    // كل الصور بالخصائص المطلوبة
    gallery: apiReq.images?.map(mapApiImageToImageItem) || [],
    listingEndDate: apiReq.listing_end_date,
    latitude: apiReq.lat ? parseFloat(apiReq.lat) : undefined,
    longitude: apiReq.lng ? parseFloat(apiReq.lng) : undefined,
    googleMapsUrl: apiReq.google_maps_url || "",
    listingPlane: apiReq.listing_plan || "",
    isListed: apiReq.is_listed,
  };
}

// ===== FinishingRequest =====
export function mapApiFinishingRequestToFinishingRequest(
  apiReq: any
): FinishingRequest {
  return {
    id: apiReq.id,
    clientName: apiReq.name || apiReq.customer_name || "",
    clientPhone: apiReq.phone || apiReq.client_phone || "",
    requestDate: apiReq.created_at || "",
    type: (apiReq.type as FinishingRequestType) || "استشارة وتصور",
    status: (apiReq.status as FinishingRequestStatus) || "جديد",
    details: apiReq.details || "",
    notes: apiReq.notes || "",
  };
}

// ===== DecorationRequest =====

export const mapApiDecorationRequestToDecorationRequest = (
  apiRequest: any
): DecorationRequest => {
  return {
    id: apiRequest.id,
    clientName: apiRequest.name, // من حقل name في العميل
    clientPhone: apiRequest.phone, // من حقل phone في العميل
    type: apiRequest.type,
    details: apiRequest.details,
    status: apiRequest.status,
    notes: apiRequest.notes,
    image: apiRequest.full_image_url, // استخدام full_image_url من الباك إند
    thumbnailUrl: apiRequest.full_thumbnail_url,
    mediumUrl: apiRequest.full_medium_url,
    altText: apiRequest.alt_text,
    caption: apiRequest.caption,
    requestDate: apiRequest.created_at, // استخدام created_at من الباك إند
    reference_item_id: apiRequest.reference_item_id,
    coverUrl: apiRequest.cover_url, // استخدام cover_url من الباك إند
  };
};

// ===== PortfolioItem =====
export function mapApiPortfolioItemToPortfolioItem(
  apiItem: any
): PortfolioItem {
  return {
    id: apiItem.id,
    title:
      apiItem.title_ar?.trim() ||
      apiItem.title_en?.trim() ||
      apiItem.title?.trim() ||
      "",
    type: (apiItem.type as DecorationRequestType) || "لوحات كانفس",
    description:
      apiItem.description_ar?.trim() || apiItem.description_en?.trim() || "",
    imageUrl: apiItem.cover_url
      ? apiItem.cover_url.replace(/\\/g, "")
      : apiItem.images_json?.[0] || "",
    thumbnailUrl: apiItem.thumbnail_url.replace(/\\/g, "") ?? "",
    mediumUrl: apiItem.medium_url.replace(/\\/g, "") ?? "",
    altText: apiItem.alt_text || "",
    caption: apiItem.caption || "",
  };
}

// ===== Client =====
export function mapApiClientToClient(apiClient: any): Client {
  return {
    id: apiClient.id,
    name: apiClient.name,
    phone: apiClient.phone,
    email: apiClient.email,
    firstContact: apiClient.first_contact || apiClient.created_at || "",
    notes: apiClient.notes || "",
  };
}
export function mapApiSiteContentToSiteContent(apiData: any): SiteContent {
  return {
    heroTitle: apiData.heroTitle || "",
    heroSubtitle: apiData.heroSubtitle || "",
    aboutTitle: apiData.aboutTitle || "",
    aboutSubtitle: apiData.aboutSubtitle || "",
    aboutPoints: (apiData.aboutPoints || []).map((p: any) => ({
      id: p.id || Date.now() + Math.random(), // id افتراضي
      description: p.description || "",
    })),
    servicesTitle: apiData.servicesTitle || "",
    services: (apiData.services || []).map((s: any) => ({
      id: s.id || Date.now(),
      title: s.title || "",
      description: s.description || "",
      iconUrl: s.iconUrl || "",
    })),
    testimonialsTitle: apiData.testimonialsTitle || "",
    testimonials: (apiData.testimonials || []).map((t: any) => ({
      id: t.id || Date.now(),
      name: t.name || "",
      designation: t.designation || "",
      quote: t.quote || "",
      imageUrl: t.imageUrl || "",
    })),
    contactTitle: apiData.contactTitle || "",
    contactSubtitle: apiData.contactSubtitle || "",
    contactPhone: apiData.contactPhone || "",
    contactEmail: apiData.contactEmail || "",
    contactAddress: apiData.contactAddress || "",
    workingHours: apiData.workingHours || "",
    socialLinks: {
      facebook: apiData.socialLinks?.facebook || "",
      twitter: apiData.socialLinks?.twitter || "",
      instagram: apiData.socialLinks?.instagram || "",
      linkedin: apiData.socialLinks?.linkedin || "",
      youtube: apiData.socialLinks?.youtube || "",
    },
  };
}

// Backend -> UI
export const mapApiImageToImageItem = (img: ApiImage): ImageItem => ({
  id: String(img.id || Math.random()),
  file: null,
  altText: img.alt_text || "",
  caption: img.caption || "",
  isFeatured: img.isfeatured === 1,
  sort: img.sort || 0,
  previewUrl: img.url || "",
  thumbnailUrl: img.thumbnail_url || "",
  mediumUrl: img.medium_url || "",
  width: img.dimensions?.width || 0,
  height: img.dimensions?.height || 0,
  valid: true,
  serverUrl: img.url || "",
  fileSize: img.file_size || 0,
  dimensions: img.dimensions || { width: 0, height: 0 },
  originalFilename: img.original_filename || "",
  mimeType: img.mime_type || "",
  seoKeywords: img.seo_keywords || "",
  isExisting: true,
  originalId: img.id,
  filename: img.url?.split("/").pop() || `image-${img.id}.jpg`,
});

// UI -> Backend
export const mapImageItemToApiImage = (img: ImageItem): ApiImage => ({
  id: img.originalId || 0,
  url: img.serverUrl || img.previewUrl || "",
  thumbnail_url: img.thumbnailUrl || "",
  medium_url: img.mediumUrl || "",
  alt_text: img.altText || "",
  caption: img.caption || "",
  isfeatured: img.isFeatured ? 1 : 0,
  sort: img.sort || 0,
  file_size: img.fileSize || 0,
  dimensions: img.dimensions || { width: 0, height: 0 },
  original_filename: img.originalFilename || "",
  mime_type: img.mimeType || "",
  seo_keywords: img.seoKeywords || "",
});
