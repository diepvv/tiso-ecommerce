export const APP_NAME = process.env.NEXT_PULIC_APP_NAME || "TISO_ECOMMERCE";
export const APP_DESCRIPTION =
  process.env.NEXT_PULIC_APP_DESCRIPTION ||
  "A modern ecommerce store built with Next.js";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 6;

  export const signInDefaultValues = {
    email: '',
    password: ''
  }

  export const signUpDefaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
