import { api } from "@/lib/api";

// ✅ PUT — cập nhật category
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const body = await req.json();
    const { id: catId, documentId, ...updateData } = body;
    const payload = { data: updateData }; // Strapi yêu cầu format này

    const res = await api.put(
      `/api/products/${id}`, payload
    );

    return Response.json(res.data, { status: 200 });
  } catch (error) {
    console.error("Server: Cập nhật sản phẩm thất bại:", error);
    return Response.json({ error: "Cập nhật sản phẩm thất bại" }, { status: 500 });
  }
}


// ✅ DELETE — xóa category
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const res = await api.delete(`/api/products/${id}`);
    return Response.json(res.data, { status: 200 });
  } catch (error) {
    console.error("Server: Xóa sản phẩm thất bại:", error);
    return Response.json({ error: "Xóa sản phẩm thất bại" }, { status: 500 });
  }
}