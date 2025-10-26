import { api } from "@/lib/api";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  try {
    const query = searchParams.toString();
    const res = await api.get(`/api/products?${query}`);
    return new Response(JSON.stringify(res.data), { status: 200 });
  } catch (error) {
    console.error("Server: Lấy dữ liệu sản phẩm thất bại", error);
    return new Response(JSON.stringify({ error: "Lấy dữ liệu sản phẩm thất bại" }), { status: 500 });
  }
}

// ✅ POST — thêm mới Sản phẩm
export async function POST(req: Request) {
  try {
    const body = await req.json(); // { name, description }
    const res = await api.post(
      `/api/products`,
      { data: body }
    );
    return Response.json(res.data, { status: 201 });
  } catch (error) {
    console.error("Server: Tạo mới sản phẩm thất bại", error);
    return Response.json({ error: "Tạo mới sản phẩm thất bại" }, { status: 500 });
  }
}
