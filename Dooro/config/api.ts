export const APP_CONFIG = {
  APP_NAME: "Dooro",
};

export const STRIPE_CONFIG = {
  publishableKey: "pk_test_ZVoLCnJf4GnFSFgcj3Yj8gOD",
};

const API_BASE_URL = "http://10.0.2.2:8000/api";

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,

  LOGIN: `${API_BASE_URL}/auth/login`,

  REGISTER: `${API_BASE_URL}/auth/register`,

  SOCIAL_LOGIN: `${API_BASE_URL}/auth/social-login`,
  
  
  FORGOT_PASSWORD: `${API_BASE_URL}/forgot-password`, 
  RESET_PASSWORD: `${API_BASE_URL}/reset-password`, 
  PLANS: `${API_BASE_URL}/plans`, 
  ADD_SHOP: `${API_BASE_URL}/add-shop`,
  CREATE_POLICY: `${API_BASE_URL}/create-policy`,
  CREATE_PAYMENT:
    `${API_BASE_URL}/create-payment`,
  PAYMENT_SUCCESS:
    `${API_BASE_URL}/payment-success`,
  PAYMENT_FAILED:
    `${API_BASE_URL}/payment-failed`,
  MY_POLICIES:
    `${API_BASE_URL}/my-policies`,
  
  GET_CLAIMS:
    `${API_BASE_URL}/get-claims`,
  CREATE_CLAIM:
    `${API_BASE_URL}/create-claim`,
  
  
};


