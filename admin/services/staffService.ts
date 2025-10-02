import api from './api';
import type { AdminUser } from '../types';
import { mapApiUserToAdminUser } from './mappers';

export const getStaff = async (): Promise<AdminUser[]> => {
  const response = await api.get('/staff');
  const staff = response.data.staff || response.data.data || response.data; // لو API بيرجع {data: []} أو مجرد []
  return staff.map(mapApiUserToAdminUser);
};

export const createStaff = async (staffData: any): Promise<AdminUser> => {
  const response = await api.post('/staff', staffData);
  return mapApiUserToAdminUser(response.data.data || response.data);
};

export const updateStaff = async (id: number, staffData: any): Promise<AdminUser> => {
  const response = await api.put(`/staff/${id}`, staffData);
  const staff = response.data.staff || response.data.data || response.data;
  return mapApiUserToAdminUser(staff);
};

export const deleteStaff = async (id: number): Promise<void> => {
  await api.delete(`/staff/${id}`);
};

export const assignRolesToStaff = async (id: number, roleIds: number[]): Promise<void> => {
  await api.post(`/staff/${id}/roles`, { roles: roleIds });
};
