// src/services/favoriteService.ts
import api from './api';
import type { Property } from '../types';
import { mapApiPropertyToProperty } from './mappers';

export const getFavorites = async (): Promise<Property[]> => {
  const response = await api.get('/favorites');
  const favorites = response.data.data || response.data; // لو API بيرجع {data: []} أو مجرد []
  return favorites.map(mapApiPropertyToProperty);
};

export const addToFavorites = async (propertyId: number): Promise<void> => {
  await api.post('/favorites', { property_id: propertyId });
};

export const removeFromFavorites = async (id: number): Promise<void> => {
  await api.delete(`/favorites/${id}`);
};
