import { getEquipment } from "@/lib/equipment";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const all = getEquipment();
    const result = category
      ? all.filter((e) => e.category === category)
      : all;
    return Response.json({ equipment: result, total: result.length });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
