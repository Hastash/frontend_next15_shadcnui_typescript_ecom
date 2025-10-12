import { apiClient } from "./apiClient";
import { apiServer } from "./apiServer";

export const api = {
  async instance() {
    if (typeof window === "undefined") {
      // Server
      console.log("Using server API instance");
      return await apiServer();
    } else {
      // Client
      console.log("Using client API instance");
      return apiClient;
    }
  },

  async get(url: string, config?: any) {
    const inst = await this.instance();
    return inst.get(url, config);
  },

  async post(url: string, data?: any, config?: any) {
    const inst = await this.instance();
    return inst.post(url, data, config);
  },

  async put(url: string, data?: any, config?: any) {
    const inst = await this.instance();
    return inst.put(url, data, config);
  },

  async delete(url: string, config?: any) {
    const inst = await this.instance();
    return inst.delete(url, config);
  },
};
