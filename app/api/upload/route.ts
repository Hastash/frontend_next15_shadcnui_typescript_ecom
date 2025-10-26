// /app/api/upload/route.ts
import { api } from "@/lib/api";

// ✅ POST — Upload file
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const res = await api.post(
      `/api/upload`,formData
    );
    return Response.json(res.data, { status: 201 });
  } catch (error) {
    console.error("Server: Upload file thất bại", error);
    return Response.json({ error: "Upload file thất bại" }, { status: 500 });
  }
}
