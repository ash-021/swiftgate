"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const propertyName = formData.get("propertyName") as string;
  const portfolioSize = formData.get("portfolioSize") as string;
  const primaryInterest = formData.get("primaryInterest") as string;
  const enquiry = formData.get("enquiry") as string;

  try {
    const data = await resend.emails.send({
      from: "SwiftGate Sales <sales@swiftgate.in>", // Using your newly connected domain
      to: [process.env.CONTACT_EMAIL || "delivered@resend.dev"], // Replace with your receiving email address
      subject: `New Sales Inquiry: ${propertyName}`,
      html: `
        <h2>New Sales Inquiry</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Property/Group Name:</strong> ${propertyName}</p>
        <p><strong>Portfolio Size:</strong> ${portfolioSize}</p>
        <p><strong>Primary Interest:</strong> ${primaryInterest}</p>
        ${enquiry ? `<p><strong>Enquiry:</strong> ${enquiry}</p>` : ''}
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: "Failed to send email" };
  }
}
