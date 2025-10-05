import { verifySession } from "@/lib/dal";
import axiosInstance from "@/lib/axios";

export async function GET(req: Request) {
  const { isAuth, session } = await verifySession();
  const { searchParams } = new URL(req.url);

  if (!isAuth || !session?.jwt) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const query = searchParams.toString();
    const res = await axiosInstance.get(`/api/categories?${query}`, {
      headers: { Authorization: `Bearer ${session.jwt}` },
    });
    return new Response(JSON.stringify(res.data), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return new Response(JSON.stringify({ error: "Fetch failed" }), { status: 500 });
  }
}

// ✅ POST — thêm mới category
export async function POST(req: Request) {
  const { isAuth, session } = await verifySession();
  if (!isAuth || !session?.jwt)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json(); // { name, description }
    const res = await axiosInstance.post(
      `/api/categories`,
      { data: body },
      {
        headers: { Authorization: `Bearer ${session.jwt}` },
      }
    );
    return Response.json(res.data, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to create category:", error);
    return Response.json({ error: "Create failed" }, { status: 500 });
  }
}

// ✅ PUT — cập nhật category
export async function PUT(req: Request) {
  const { isAuth, session } = await verifySession();
  if (!isAuth || !session?.jwt)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json(); // { id, name, description }
    const { id, ...updateData } = body;
    if (!id)
      return Response.json({ error: "Missing category ID" }, { status: 400 });

    const res = await axiosInstance.put(
      `/api/categories/${id}`,
      { data: updateData },
      {
        headers: { Authorization: `Bearer ${session.jwt}` },
      }
    );
    return Response.json(res.data, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to update category:", error);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}

// ✅ DELETE — xóa category
export async function DELETE(req: Request) {
  const { isAuth, session } = await verifySession();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!isAuth || !session?.jwt)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!id)
    return Response.json({ error: "Missing category ID" }, { status: 400 });

  try {
    const res = await axiosInstance.delete(`/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${session.jwt}` },
    });
    return Response.json(res.data, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to delete category:", error);
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}