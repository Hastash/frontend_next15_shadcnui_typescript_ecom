import { Credentials } from "./types";
import axios from "axios";

export const signUpRequest = async (credentials: Credentials) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`,
      {
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
      }
    );

    return response;
  } catch (error: any) {
    return error?.response?.data?.error?.message || "Error signing up";
  }
};