import { api } from "@/lib/api";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  try {
    const query = searchParams.toString();
    const res = await api.get(`/api/sales?${query}`);
    return new Response(JSON.stringify(res.data), { status: 200 });
  } catch (error) {
    console.error("Server: Lỗi lấy Đơn hàng:", error);
    return new Response(JSON.stringify({ error: "Lấy Đơn hàng thất bại" }), { status: 500 });
  }
}

// ✅ POST — thêm mới Đơn hàng
export async function POST(req: Request) {
  try {
    const body = await req.json(); // { name, description }
    const res = await api.post(
      `/api/sales`,
      { data: body },
    );
    return Response.json(res.data, { status: 201 });
  } catch (error) {
    console.error("Server: Tạo Đơn hàng thất bại:", error);
    return Response.json({ error: "Tạo Đơn hàng thất bại" }, { status: 500 });
  }
}