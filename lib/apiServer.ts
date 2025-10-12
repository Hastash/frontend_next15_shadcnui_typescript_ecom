import  axiosBase  from "./axiosBase";
import { verifySession } from "@/lib/server/dal";

export const apiServer = async () => {
  const { isAuth, session } = await verifySession();

  if (!isAuth || !session?.jwt) {
    throw new Error("Unauthorized");
  }

  const instance = axiosBase.create();
  instance.interceptors.request.use((config) => {
    if (session?.jwt) {
      config.headers.Authorization = `Bearer ${session.jwt}`;
    }
    return config;
  });

  return instance;
};
