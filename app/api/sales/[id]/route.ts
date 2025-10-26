import { api } from "@/lib/api";

// ✅ PUT — cập nhật Đơn hàng
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const body = await req.json();
    const { id: saleId, documentId, ...updateData } = body;
    const payload = { data: updateData }; // Strapi yêu cầu format này

    const res = await api.put(
      `/api/sales/${id}`, payload
    );

    return Response.json(res.data, { status: 200 });
  } catch (error) {
    console.error("Server: Cập nhật Đơn hàng thất bại:", error);
    return Response.json({ error: "Cập nhật Đơn hàng thất bại" }, { status: 500 });
  }
}


// ✅ DELETE — xóa Đơn hàng
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const res = await api.delete(`/api/sales/${id}`);
    return Response.json(res.data, { status: 200 });
  } catch (error) {
    console.error("Server: Xóa Đơn hàng thất bại:", error);
    return Response.json({ error: "Xóa Đơn hàng thất bại" }, { status: 500 });
  }
}