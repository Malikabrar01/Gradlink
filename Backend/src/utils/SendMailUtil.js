import fs from "fs";
import path from "path";
import { ApiError } from "./ApiError.js";

const toBrevoAttachments = (attachments = []) =>
  attachments
    .map((a) => {
      let buffer;
      if (a.content) {
        buffer = Buffer.isBuffer(a.content) ? a.content : Buffer.from(a.content);
      } else if (a.path) {
        buffer = fs.readFileSync(a.path);
      } else {
        return null;
      }
      return {
        name: a.filename || (a.path ? path.basename(a.path) : "attachment"),
        content: buffer.toString("base64"),
      };
    })
    .filter(Boolean);

const sendMail = async (to, subject, text, html, attachments) => {
  try {
    const body = {
      sender: { name: "GradLink", email: process.env.SENDER_EMAIL },
      to: (Array.isArray(to) ? to : [to]).map((email) => ({ email })),
      subject,
      htmlContent: html || `<p>${text || ""}</p>`,
      ...(text ? { textContent: text } : {}),
    };

    if (attachments && attachments.length) {
      body.attachment = toBrevoAttachments(attachments);
    }

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("Brevo error:", res.status, await res.text());
      throw new Error("Brevo request failed");
    }

    return await res.json();
  } catch (error) {
    console.error("sendMail failed:", error.message);
    throw new ApiError(500, "Failed to send email");
  }
};

export { sendMail };