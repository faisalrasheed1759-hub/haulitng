import { getPayments, getPaymentStats } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  try {
    const authorized = await requireAdmin();
    if (!authorized) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const payments = getPayments();
    const stats = getPaymentStats();
    return Response.json({ payments, stats });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
