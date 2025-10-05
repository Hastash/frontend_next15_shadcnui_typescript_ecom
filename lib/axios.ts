import axios from "axios";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";
import { verifySession } from "./dal";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL,
});

// Request interceptor — attach Authorization token
axiosInstance.interceptors.request.use(async (config) => {
  const session = await verifySession();
  console.log("Axios Interceptor - Session:", session);
  if (session?.session?.jwt) {
    config.headers.Authorization = `Bearer ${session.session.jwt}`;
  }
  return config;
});

// Response interceptor — global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = handleApiError(error);
    toast.error(errorMessage); // 🛎 show toast automatically
    return Promise.reject(error); // still reject so you can catch if needed
  }
);

export default axiosInstance;