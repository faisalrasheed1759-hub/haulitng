import { getPayments, getPaymentStats } from "@/lib/db";

export async function GET() {
  const payments = getPayments();
  const stats = getPaymentStats();
  return Response.json({ payments, stats });
}
