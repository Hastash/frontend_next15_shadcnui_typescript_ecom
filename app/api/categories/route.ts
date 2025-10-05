import { verifySession } from "@/lib/dal";
import axiosInstance from "@/lib/axios";

export async function GET() {
  const { isAuth, session } = await verifySession();

  if (!isAuth || !session?.jwt) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const res = await axiosInstance.get(`/api/categories`);
    return new Response(JSON.stringify(res.data), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return new Response(JSON.stringify({ error: "Fetch failed" }), { status: 500 });
  }
}
