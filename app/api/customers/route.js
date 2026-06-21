export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, address } = body;
    if (!name || !phone) {
      return Response.json({ error: "Missing name or phone" }, { status: 400 });
    }
    const { addCustomer } = await import("@/lib/store");
    addCustomer(name, phone, address);
    return Response.json({ message: "Customer added" }, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
