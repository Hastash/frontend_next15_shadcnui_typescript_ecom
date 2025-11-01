import { z } from "zod";

export const productSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  quantity: z.coerce.number().min(1),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
});

export const saleSchema = z.object({
  documentId: z.string().optional(),
  id: z.number().optional(),
customer_name: z.string().min(1, "Customer name is required"),
  invoice_number: z.string().min(1, "Invoice number is required"),
  customer_phone: z.string().min(1, "Invoice phone is required"),
  customer_email: z.string().min(1, "Invoice email is required"),
  date: z.coerce.date(),
  notes: z.string().optional(),
  products: z.array(
    z.object({
      productId: z.string().min(1),
      name: z.string().min(1),
      quantity: z.coerce.number().min(1),
      price: z.coerce.number().min(1),
      stock: z.coerce.number(),
    })
  ),
});

