import { getPayments, getPaymentStats } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const authorized = await requireAdmin();
  if (!authorized) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const payments = getPayments();
  const stats = getPaymentStats();
  return Response.json({ payments, stats });
}
