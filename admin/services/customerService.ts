// services/customerService.ts
import api from './api';
import type { Client } from '../types';
import { mapApiClientToClient } from './mappers';

export const updateCustomer = async (id: number, data: Partial<Client>): Promise<Client> => {
  const { data: apiResponse } = await api.put(`/customers/${id}`, data);
  if (!apiResponse.customer) throw new Error('No customer returned from API');
  return mapApiClientToClient(apiResponse.customer);
};

export const addCustomer = async (data: Partial<Client>): Promise<Client> => {
  const { data: apiResponse } = await api.post(`/customers`, data);
  return mapApiClientToClient(apiResponse.customer);
};

export const getCustomers = async (): Promise<Client[]> => {
  const { data: apiResponse } = await api.get(`/customers`);
  const customersArray = apiResponse || [];
  return customersArray.map((c: any) => mapApiClientToClient(c));
};


export const deleteCustomer = async (id: number): Promise<void> => {
  await api.delete(`/customers/${id}`);
};
