// src/services/authService.ts
import api from './api';
import type { AdminUser } from '../types';

// Helper لتعيين التوكن في headers
const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const login = async (
  email: string,
  password: string
): Promise<{ user: AdminUser; token: string }> => {
  try {

    const response = await api.post('/auth/login', { email, password });

    const { access_token, user, token_type } = response.data;

    if (!access_token || !user) {
      throw new Error('بيانات المستخدم أو التوكن غير موجودة في الاستجابة');
    }

    const fullToken = `Bearer ${access_token}`;

    // تخزين التوكن واليوزر في localStorage
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));

    // تعيين التوكن تلقائيًا لكل request
    setAuthToken(access_token);

    return { user, token: access_token };
  } catch (error: any) {
    console.error('Login service error:', error);

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error('فشل تسجيل الدخول');
  }
};

export const getCurrentUser = async (): Promise<AdminUser> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('لم يتم تسجيل الدخول بعد');

    setAuthToken(token);

    const response = await api.get('/auth/profile');
    return response.data.user;
  } catch (error: any) {
    console.error('Get current user error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
  }
};
