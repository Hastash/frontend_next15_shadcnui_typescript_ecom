import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  description: z.string().optional(),
  price: z.coerce.number().gt(0, "Đơn giá phải lớn hơn 0"),
  stock: z.coerce.number().min(0, "Số lượng tồn kho không được âm"),
  barcode: z.string().optional(),
  category: z.object({
    id: z.string().min(1, "Danh mục không được để trống"),
    name: z.string().optional(),
  }),
  image: z
    .object({
      id: z.string(),
      url: z.string().url("Đường dẫn hình ảnh không hợp lệ"),
    })
    .optional(),
});

export type ProductForm = z.infer<typeof productSchema>;
