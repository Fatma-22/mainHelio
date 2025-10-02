import api from './api';
import type { SiteContent } from '../types';
import { mapApiSiteContentToSiteContent } from './mappers';

// جلب المحتوى
export const getSiteContent = async (): Promise<SiteContent> => {
  try {
    const response = await api.get('/site-content'); 
    const siteContentData = response.data?.site_content ?? {}; 
    return mapApiSiteContentToSiteContent(siteContentData);
  } catch (error) {
    console.error('Error fetching site content:', error);
    throw new Error('Failed to fetch site content');
  }
};

export const updateSiteContent = async (payload: Partial<SiteContent>): Promise<SiteContent> => {
  try {
    const response = await api.put('/site-content', payload); 
    const data = response.data?.site_content || response.data?.site_contents?.[0] || {};
    // نفس normalize اللي عملتيه في getSiteContent
    return {
      heroTitle: data.heroTitle || '',
      heroSubtitle: data.heroSubtitle || '',
      aboutTitle: data.aboutTitle || '',
      aboutSubtitle: data.aboutSubtitle || '',
      aboutPoints: data.aboutPoints || [],
      servicesTitle: data.servicesTitle || '',
      services: (data.services || []).map((s: any) => ({
        id: s.id || Date.now(),
        title: s.title || '',
        description: s.description || '',
        iconUrl: s.iconUrl || ''
      })),
      testimonialsTitle: data.testimonialsTitle || '',
      testimonials: (data.testimonials || []).map((t: any) => ({
        id: t.id || Date.now(),
        name: t.name || '',
        designation: t.designation || '',
        quote: t.quote || '',
        imageUrl: t.imageUrl || ''
      })),
      contactTitle: data.contactTitle || '',
      contactSubtitle: data.contactSubtitle || '',
      contactPhone: data.contactPhone || '',
      contactEmail: data.contactEmail || '',
      contactAddress: data.contactAddress || '',
      workingHours: data.workingHours || '',
      socialLinks: data.socialLinks || {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: ''
      }
    };
  } catch (err) {
    console.error(err);
    throw new Error('Failed to update site content');
  }
};



// حذف المحتوى (لو محتاج)
// عادة مع جدول صف واحد مش هيستخدم، لكن لو عايز تعمل reset ممكن تستخدمه
export const deleteSiteContent = async (): Promise<void> => {
  try {
    await api.delete('/site-content'); // بدون id
  } catch (error) {
    console.error('Error deleting site content:', error);
    throw new Error('Failed to delete site content');
  }
};
