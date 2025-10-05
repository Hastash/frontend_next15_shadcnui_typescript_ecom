"use client"
import { DataTable } from "./features/data-table"
import { columns } from "./features/columns"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
]
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}
export default function Page () {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("/api/categories")
    .then((res) => res.json())
    .then((data) => setCategories(data.data))
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
}, []);
// useEffect(() => {
//   fetch("/api/categories")
//     .then((res) => {
//       console.log("📦 Response object:", res); // Kiểm tra Response gốc (status, headers, v.v.)
//       return res.json();
//     })
//     .then((data) => {
//       console.log("🧩 Full JSON data:", data); // Toàn bộ JSON server trả về
      
//       // Nếu là Strapi, dữ liệu chính thường nằm trong `data.data`
//       if (Array.isArray(data.data)) {
//         console.log("📁 Strapi data array:", data.data);

//         // In ra từng phần tử trong mảng
//         data.data.forEach((item: any, index: number) => {
//           console.log(`➡️ Category ${index + 1}:`, item);
//         });
//       } else {
//         console.warn("⚠️ Unexpected data structure:", data);
//       }

//       // Lưu vào state
//       setCategories(data.data || []);
//     })
//     .catch((err) => console.error("❌ Failed to fetch categories:", err))
//     .finally(() => setLoading(false));
// }, []);


  return (
    <div className="py-4 md:py-6 px-4 lg:px-6">
      <Card className="@container/card">
      <CardHeader>
        <CardTitle>Danh mục Phân loại</CardTitle>
        <CardDescription>Danh sách các Phân loại</CardDescription>

        <CardAction>
          <Button>Thêm mới</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {loading ? <div className="text-muted-foreground">Loading...</div>  :
        <DataTable data={categories} columns={columns} />}
      </CardContent>
    </Card>
  </div>
)
}