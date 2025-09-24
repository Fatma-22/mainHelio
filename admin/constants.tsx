import React from 'react';
import type { StatCardData, Property, Inquiry, AdminUser, PropertyRequest, FinishingRequest, DecorationRequest, PortfolioItem, SiteContent, Client } from './types';

// Icons
export const ICONS = {
  dashboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  properties: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  inquiries: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  clients: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  users: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  content: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  requests: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  services: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  finishing: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  decorations: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>,
  portfolio: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  totalProperties: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  newInquiries: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  pendingRequests: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  newFinishingRequests: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  newServiceRequests: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  newDecorations: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>,
  totalPortfolio: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  export: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
};

// Mock Data
export const MOCK_PROPERTIES: Property[] = [
  { id: 1, title: "فيلا فاخرة في التجمع الخامس", address: "القاهرة، التجمع الخامس", price: "15,200,000 جنيه", status: "للبيع", type: "فيلا", imageUrl: "https://picsum.photos/seed/prop1/200/150", addedDate: "2024-07-20", isListed: true, listingEndDate: "2024-10-20", description: "فيلا فاخرة بتصميم مودرن، 5 غرف نوم، حديقة خاصة وحمام سباحة. تقع في قلب التجمع الخامس بالقرب من جميع الخدمات.", latitude: 30.02, longitude: 31.49, googleMapsUrl: "https://maps.app.goo.gl/1" },
  { id: 2, title: "شقة حديثة بالشيخ زايد", address: "الجيزة، الشيخ زايد", price: "25,000 جنيه/شهري", status: "للإيجار", type: "شقة", imageUrl: "https://picsum.photos/seed/prop2/200/150", addedDate: "2024-07-18", isListed: true, listingEndDate: "2024-08-18", description: "شقة 3 غرف نوم تشطيب سوبر لوكس في كمبوند راقي بالشيخ زايد.", latitude: 30.00, longitude: 30.97, googleMapsUrl: "https://maps.app.goo.gl/2" },
  { id: 3, title: "أرض تجارية على طريق رئيسي", address: "الإسكندرية، طريق الكورنيش", price: "22,500,000 جنيه", status: "للبيع", type: "أرض", imageUrl: "https://picsum.photos/seed/prop3/200/150", addedDate: "2024-07-15", isListed: false, listingEndDate: "2024-07-15", description: "أرض تجارية بموقع استراتيجي على طريق الكورنيش مباشرة، تصلح لبناء مول تجاري أو فندق.", latitude: 31.20, longitude: 29.91, googleMapsUrl: "https://maps.app.goo.gl/3" },
  { id: 4, title: "شقة عائلية مباعة بالمهندسين", address: "الجيزة، المهندسين", price: "4,100,000 جنيه", status: "مباع", type: "شقة", imageUrl: "https://picsum.photos/seed/prop4/200/150", addedDate: "2024-06-30", isListed: false, listingEndDate: "2024-06-30", description: "شقة واسعة في موقع حيوي بالمهندسين، تم بيعها مؤخراً.", latitude: 30.06, longitude: 31.20, googleMapsUrl: "https://maps.app.goo.gl/4" },
];

export const MOCK_INQUIRIES: Inquiry[] = [
  { id: 1, sender: "محمد عبدالله", phone: "01012345678", message: "أرغب في الاستفسار عن الفيلا المعروضة في التجمع الخامس، هل لا زالت متاحة؟", date: "2024-07-21", status: "جديد", type: "تواصل عام", read: false, notes: "العميل مهتم جداً، يجب المتابعة بشكل عاجل." },
  { id: 2, sender: "سارة خالد", phone: "01176543210", message: "لدي عقار وأرغب في عرضه على موقعكم، ما هي الإجراءات المطلوبة؟", date: "2024-07-20", status: "تم التواصل", type: "إضافة عقار", read: false },
  { id: 3, sender: "أحمد الغامدي", phone: "01234455667", message: "هل تقدمون خدمات تصميم داخلي للشقق؟", date: "2024-07-19", status: "قيد المتابعة", type: "طلب ديكور", read: true },
  { id: 4, sender: "فاطمة الزهراني", phone: "01587654321", message: "شكراً على خدمتكم المميزة، تم التواصل معي من قبل المندوب.", date: "2024-07-18", status: "مغلق", type: "تواصل عام", read: true, notes: "العميل راضٍ عن الخدمة." },
];

export const MOCK_USERS: AdminUser[] = [
    { id: 1, name: "أحمد المصري", email: "aziz@example.com", role: "مدير عام", lastLogin: "2024-07-21 10:30 صباحًا", password: "password123" },
    { id: 2, name: "فاطمة علي", email: "noura@example.com", role: "مندوب مبيعات", lastLogin: "2024-07-21 09:15 صباحًا", password: "password456" },
    { id: 3, name: "محمد صلاح", email: "khaled@example.com", role: "محرر محتوى", lastLogin: "2024-07-20 03:00 مساءً", password: "password789" },
    { id: 10, name: 'سارة عبد الرحمن', email: 'coordinator@example.com', role: 'منسق', lastLogin: '2024-07-25 11:00 صباحًا', password: 'password_coord' },
    { id: 11, name: 'كريم محمود', email: 'sales.re@example.com', role: 'مسؤل مبيعات العقارات', lastLogin: '2024-07-25 11:05 صباحًا', password: 'password_re' },
    { id: 12, name: 'هند رضا', email: 'sales.finishing@example.com', role: 'مسؤل مبيعات التشطيبات', lastLogin: '2024-07-25 11:10 صباحًا', password: 'password_finishing' },
    { id: 13, name: 'عمر شريف', email: 'sales.decor@example.com', role: 'مسؤل مبيعات الديكورات والتحف', lastLogin: '2024-07-25 11:15 صباحًا', password: 'password_decor' },
];

export const MOCK_PROPERTY_REQUESTS: PropertyRequest[] = [
    { id: 101, requesterName: "علي حسن", requesterPhone: "01098765432", requestDate: "2024-07-22", title: "شقة للبيع في مدينة نصر", address: "القاهرة، مدينة نصر", price: "2,300,000 جنيه", status: "للبيع", type: "شقة", description: "شقة بمساحة 150 متر مربع، 3 غرف نوم، 2 حمام، تشطيب سوبر لوكس.", images: ["https://picsum.photos/seed/req1-1/400/300", "https://picsum.photos/seed/req1-2/400/300"], listingDuration: 3, latitude: 30.05, longitude: 31.34, googleMapsUrl: "https://maps.app.goo.gl/nasrcity" },
    { id: 102, requesterName: "مريم أحمد", requesterPhone: "01234567890", requestDate: "2024-07-21", title: "فيلا للإيجار في 6 أكتوبر", address: "الجيزة، 6 أكتوبر", price: "35,000 جنيه/شهري", status: "للإيجار", type: "فيلا", description: "فيلا مستقلة بحديقة خاصة وحمام سباحة، 400 متر مربع.", images: ["https://picsum.photos/seed/req2-1/400/300", "https://picsum.photos/seed/req2-2/400/300", "https://picsum.photos/seed/req2-3/400/300"], listingDuration: 6, latitude: 29.97, longitude: 30.93, googleMapsUrl: "https://maps.app.goo.gl/6october" },
];

export const MOCK_FINISHING_REQUESTS: FinishingRequest[] = [
    { id: 201, clientName: "يوسف محمود", clientPhone: "01123456789", requestDate: "2024-07-23", type: "استشارة وتصور", status: "جديد", details: "أحتاج جلسة استشارية لفهم أفضل الخيارات لتشطيب شقتي الجديدة بمساحة 180 متر." },
    { id: 202, clientName: "هناء كامل", clientPhone: "01567891234", requestDate: "2024-07-22", type: "تصميم ثلاثي الأبعاد", status: "تم التواصل", details: "أرغب في تصميم 3D مودرن لغرفة المعيشة والريسبشن مع قائمة بالخامات المقترحة." },
    { id: 203, clientName: "طارق شوقي", clientPhone: "01011223344", requestDate: "2024-07-20", type: "تنفيذ وإشراف", status: "قيد التنفيذ", details: "تم الاتفاق على التصميم، ونرغب في بدء التنفيذ والإشراف الكامل على تشطيب دوبلكس في الشيخ زايد.", notes: "تم إرسال فريق المعاينة الأولية بتاريخ 2024-07-21." },
    { id: 204, clientName: "سمر علي", clientPhone: "01299887766", requestDate: "2024-07-19", type: "تصميم ثلاثي الأبعاد", status: "مكتمل", details: "طلب تصميم لعيادة طبية صغيرة.", notes: "تم تسليم التصميم النهائي وجدول الكميات للعميل بتاريخ 2024-07-22." },
];

export const MOCK_PORTFOLIO_ITEMS: PortfolioItem[] = [
    { id: 501, title: "نحت جداري مودرن", type: "منحوتات جدارية", description: "نحت بارز بتصميم هندسي حديث، مناسب للمداخل وغرف المعيشة.", imageUrl: "https://picsum.photos/seed/decor1/400/300" },
    { id: 502, title: "لوحة كانفس تجريدية", type: "لوحات كانفس", description: "مجموعة من ثلاث لوحات كانفس بألوان زاهية وتصميم تجريدي يضفي حيوية للمكان.", imageUrl: "https://picsum.photos/seed/decor2/400/300" },
    { id: 503, title: "تحفة فنية ذهبية", type: "تحف ديكورية", description: "قطعة ديكورية من المعدن المصقول باللون الذهبي، مثالية للطاولات الجانبية والأرفف.", imageUrl: "https://picsum.photos/seed/decor3/400/300" },
    { id: 504, title: "منحوتة فرعونية", type: "منحوتات جدارية", description: "نحت جداري مستوحى من الفن المصري القديم، يضيف لمسة من الأصالة والفخامة.", imageUrl: "https://picsum.photos/seed/decor4/400/300" },
];

export const MOCK_DECORATION_REQUESTS: DecorationRequest[] = [
    { id: 301, clientName: "أمل محمد", clientPhone: "01011223344", requestDate: "2024-07-24", type: "منحوتات جدارية", status: "جديد", details: "أرغب في تنفيذ عمل مشابه للمنحوتة الفرعونية المعروضة لديكم، لكن مع بعض التعديلات البسيطة.", referenceItemId: 504 },
    { id: 302, clientName: "خالد إبراهيم", clientPhone: "01122334455", requestDate: "2024-07-23", type: "لوحات كانفس", status: "تم التواصل", details: "أريد طباعة مجموعة من 3 لوحات كانفس بمقاس 50x70 سم لكل لوحة، بصور طبيعية من اختياري. (طلب خاص)" },
    { id: 303, clientName: "شيماء علي", clientPhone: "01233445566", requestDate: "2024-07-22", type: "تحف ديكورية", status: "قيد التنفيذ", details: "هل يمكن توفير التحفة الفنية الذهبية المعروضة في معرضكم؟ أحتاجها بشكل عاجل.", referenceItemId: 503, notes: "تم عرض كتالوج Propsoals على العميل، وفي انتظار الاختيار النهائي." },
    { id: 304, clientName: "عمر الشريف", clientPhone: "01544556677", requestDate: "2024-07-21", type: "منحوتات جدارية", status: "مكتمل", details: "طلب تنفيذ نحت بارز لشعار الشركة في مكتب الإدارة. (طلب خاص)", notes: "تم التسليم بنجاح والعميل راضٍ تماماً." },
];

// Combine all sources of clients and deduplicate by phone number
const allClientSources = [
    ...MOCK_INQUIRIES.map(i => ({ name: i.sender, phone: i.phone, date: i.date })),
    ...MOCK_PROPERTY_REQUESTS.map(r => ({ name: r.requesterName, phone: r.requesterPhone, date: r.requestDate })),
    ...MOCK_FINISHING_REQUESTS.map(r => ({ name: r.clientName, phone: r.clientPhone, date: r.requestDate })),
    ...MOCK_DECORATION_REQUESTS.map(r => ({ name: r.clientName, phone: r.clientPhone, date: r.requestDate })),
];

const clientsMap = new Map<string, { name: string; firstContact: string }>();
allClientSources.forEach(client => {
    const existing = clientsMap.get(client.phone);
    if (!existing || new Date(client.date) < new Date(existing.firstContact)) {
        clientsMap.set(client.phone, { name: client.name, firstContact: client.date });
    }
});

let clientIdCounter = 1;
export const MOCK_CLIENTS: Client[] = Array.from(clientsMap.entries()).map(([phone, data]) => ({
    id: clientIdCounter++,
    name: data.name,
    phone: phone,
    firstContact: data.firstContact,
    email: `${data.name.split(' ')[0].toLowerCase()}${clientIdCounter}@example.com`,
}));


export const MOCK_SITE_CONTENT: SiteContent = {
    heroTitle: "ابحث عن عقارك المثالي في قلب مصر الجديدة",
    aboutTitle: "خبرتنا بين يديك",
    aboutSubtitle: "في هيليو، نؤمن بأن العقار ليس مجرد بناء، بل هو استثمار في المستقبل ومساحة لتحقيق الأحلام. منذ تأسيسنا، ونحن نسعى لتقديم خدمات عقارية متكاملة تتجاوز توقعات عملائنا.",
    aboutPoints: [
        "+15 عامًا من الخبرة",
        "فريق عمل محترف",
        "استشارات عقارية مجانية",
        "آلاف العملاء الراضين"
    ],
    servicesTitle: "ماذا نقدم؟",
    services: [
        { id: 1, title: "تسويق وبيع العقارات", description: "نقدم خطط تسويقية مبتكرة لضمان وصول عقارك لأكبر شريحة من العملاء المحتملين وتحقيق أفضل سعر بيع." },
        { id: 2, title: "إدارة الأملاك", description: "نتولى إدارة الممتلكات العقارية نيابة عنك، بما في ذلك تحصيل الإيجارات، الصيانة، والتعامل مع المستأجرين." },
        { id: 3, title: "تطوير المشاريع", description: "نقدم دراسات جدوى واستشارات للمشاريع العقارية الجديدة، من الفكرة وحتى التسليم." },
        { id: 4, title: "استشارات عقارية", description: "فريق من الخبراء جاهز لتقديم النصح والمشورة لكافة استفساراتك العقارية والاستثمارية." }
    ],
    testimonialsTitle: "ماذا يقول عملاؤنا عنا",
    testimonials: [
        {
            id: 1,
            quote: "خدمة عملاء ممتازة وفريق عمل محترف ساعدني في العثور على شقة أحلامي بسرعة وسهولة.",
            name: "سارة أحمد",
            designation: "مديرة تسويق",
            imageUrl: "https://i.pravatar.cc/150?img=1"
        },
        {
            id: 2,
            quote: "شفافية مطلقة في التعامل ومصداقية عالية. أنصح بالتعامل مع شركة هيليو لأي شخص يبحث عن عقار.",
            name: "محمد خالد",
            designation: "مهندس برمجيات",
            imageUrl: "https://i.pravatar.cc/150?img=2"
        },
        {
            id: 3,
            quote: "كانت تجربة إدارة أملاكي معهم مريحة جداً. فريق منظم ودقيق في كل التفاصيل.",
            name: "علي حسن",
            designation: "رجل أعمال",
            imageUrl: "https://i.pravatar.cc/150?img=3"
        }
    ],
    contactTitle: "تواصل معنا",
    contactSubtitle: "نحن هنا لمساعدتك. إذا كان لديك استفسار حول خدماتنا وعقاراتنا داخل هليوبوليس الجديدة أو ترغب في بدء مشروع، لا تتردد في التواصل معنا.",
    contactPhone: "+20 123 456 7890",
    contactEmail: "info@onlyhelio.com",
    contactAddress: "هليوبوليس الجديدة، القاهرة، مصر",
    workingHours: "الأحد - الخميس: 9 صباحًا - 6 مساءً",
    socialLinks: {
        facebook: "https://facebook.com/onlyhelio",
        twitter: "https://twitter.com/onlyhelio",
        instagram: "https://instagram.com/onlyhelio",
        linkedin: "https://linkedin.com/company/onlyhelio",
        youtube: "https://youtube.com/onlyhelio"
    }
};