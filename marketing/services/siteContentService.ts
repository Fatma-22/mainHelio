// src/services/siteContentService.ts
import api from './api';
import type { SiteContent } from '../types';
import { mapApiSiteContentToSiteContent } from './mappers';

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

export const getSiteContentEn = async (): Promise<SiteContent> => {
  try {
    const response = await api.get('/site-content?lang=en'); 
    
    const siteContentData = response.data?.site_content ?? {};
    return mapApiSiteContentToSiteContent(siteContentData);
  } catch (error) {
    console.error('Error fetching site content (EN):', error);
    throw new Error('Failed to fetch site content (EN)');
  }
};
