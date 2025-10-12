import axios from "axios";
import { handleApiError } from "./utils";
import { toast } from "sonner";

const axiosBase  = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL,
  timeout: 10000, // 10 seconds timeout
});


// Response interceptor — global error handling
axiosBase.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = handleApiError(error);
    toast.error(errorMessage); // 🛎 show toast automatically
    return Promise.reject(error); // still reject so you can catch if needed
  }
);

export default axiosBase;