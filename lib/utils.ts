import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleApiError(error: any, defaultMessage = "Đã xảy ra lỗi, vui lòng thử lại.") {
  if (!error) return defaultMessage;

  // Strapi formatted error
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  // Strapi new error format
  if (error?.error?.message)
    return error.error.message

  // Axios network error  
  if (error?.message) {
    return error.message;
  }
  return defaultMessage;
}