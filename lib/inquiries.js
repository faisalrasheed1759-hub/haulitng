import { saveInquiries, loadInquiries } from "@/lib/db";

export function addInquiry(data) {
  const inquiries = loadInquiries();
  const inquiry = { id: `INQ-${Date.now()}`, ...data, createdAt: new Date().toISOString() };
  inquiries.push(inquiry);
  saveInquiries(inquiries);
  return inquiry;
}

export function getInquiries() {
  return loadInquiries();
}
