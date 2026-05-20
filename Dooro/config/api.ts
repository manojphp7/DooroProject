export const APP_CONFIG = {
  APP_NAME: "Dooro",
};

const API_BASE_URL = "http://10.0.2.2:8000/api";

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,

  LOGIN: `${API_BASE_URL}/auth/login`,

  REGISTER: `${API_BASE_URL}/auth/register`,

  SOCIAL_LOGIN: `${API_BASE_URL}/auth/social-login`,
  
  
  FORGOT_PASSWORD: `${API_BASE_URL}/forgot-password`, 
  RESET_PASSWORD: `${API_BASE_URL}/reset-password`, 
  ADD_SHOP: `${API_BASE_URL}/add-shop`, 
  UPLOAD_SHOP_IMAGES: `${API_BASE_URL}/add-shop`, 
  
};


