const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_BASE_URL = BASE_URL.replace(/\/+$/, '');
export const PRODUCTS_API_URL = `${API_BASE_URL}/api/products`;
export const CATEGORIES_API_URL = `${API_BASE_URL}/api/categories`;
export const INVENTORY_API_URL = `${API_BASE_URL}/api/inventory`;
export const PAYMENT_METHODS_API_URL = `${API_BASE_URL}/api/metodopagos`;
export const SALES_API_URL = `${API_BASE_URL}/api/sales`;
