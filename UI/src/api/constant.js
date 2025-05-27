import { getToken } from "../utils/jwt-helper";

export const API_URLS = {
    GET_PRODUCTS:'/api/products',
    GET_PRODUCT: (id) => `/api/product/${id}`,
    GET_CATEGORIES:'/api/category',
    GET_CATEGORY: (id) => `/api/category/${id}`,
}

export const API_BASE_URL = 'http://localhost:8080';

export const getHeaders = () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};
