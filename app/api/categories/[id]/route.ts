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
        `/api/categories/${id}`, payload
      );
      
      return Response.json(res.data, { status: 200 });
    } catch (error) {
      console.error("Failed to update category:", error);
      return Response.json({ error: "Update failed" }, { status: 500 });
    }
  }


// ✅ DELETE — xóa category
export async function DELETE(
  req: Request, 
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const res = await api.delete(`/api/categories/${id}`);
    return Response.json(res.data, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to delete category:", error);
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}