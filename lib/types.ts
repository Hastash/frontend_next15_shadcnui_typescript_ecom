import { z } from "zod";
import { saleSchema } from "./schemas";

// Auto-generate TS type from schema
export type Sale = z.infer<typeof saleSchema>;
export type ProductInSale = z.infer<typeof saleSchema.shape.products.element>;
export type StrapiError = {
  status: number,
  name: string,
  message: string,
  details?: object
};
export type ImageFile = {
  id: string;
  url: string;
};
export type Category = {
  id: string;
  name: string;
  description: string;
  documentId: string;
  // Add other fields if needed
};

export type Product = {
  documentId: string;
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  barcode: string;
  category: Category;
  image?: ImageFile;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number
};


// Credentials for authentication
export type Credentials = {
  username?: string;
  email?: string;
  identifier?: string;
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
  newPassword?: string;
  code?: string;
};

// Form state for form handling and server actions
export type FormState = {
  errors: Credentials;
  values: Credentials;
  message?: string;
  success?: boolean;
};

export type SessionPayload = {
  user?: Credentials;
  expiresAt?: Date;
  jwt?: string;
};
