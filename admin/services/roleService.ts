import api from './api';

export const getRoles = async (): Promise<any[]> => {
  const response = await api.get('/roles');
  return response.data.data || response.data; // نتأكد من التعامل مع أي شكل للـ API
};

export const createRole = async (roleData: any): Promise<any> => {
  const response = await api.post('/roles', roleData);
  return response.data.data || response.data;
};

export const updateRole = async (id: number, roleData: any): Promise<any> => {
  const response = await api.put(`/roles/${id}`, roleData);
  return response.data.data || response.data;
};

export const deleteRole = async (id: number): Promise<void> => {
  await api.delete(`/roles/${id}`);
};
