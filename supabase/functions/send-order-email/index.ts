import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { getEmailLogoUrlFromEnv } from "../../../shared/email/emailBrand.ts";
import { renderOrderConfirmationEmail } from "../../../shared/email/orderEmailTemplate.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type OrderLineItem = {
  name: string;
  quantity: number;
  size?: string;
  color?: string;
  lineTotal: number;
};

type OrderEmailPayload = {
  orderNumber: string;
  customer_email?: string;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    country: string;
    address: string;
    city: string;
    postalCode?: string;
    phone: string;
  };
  items: OrderLineItem[];
  subtotal: number;
  discountAmount?: number;
  shippingFee?: number;
  total: number;
  paymentMethod?: string;
};

function buildOrderEmailHtml(order: OrderEmailPayload): string {
  const logoUrl = getEmailLogoUrlFromEnv({
    EMAIL_LOGO_URL: Deno.env.get("EMAIL_LOGO_URL"),
    NEXT_PUBLIC_SITE_URL: Deno.env.get("NEXT_PUBLIC_SITE_URL"),
    SITE_URL: Deno.env.get("SITE_URL"),
    VERCEL_URL: Deno.env.get("VERCEL_URL"),
  });

  return renderOrderConfirmationEmail(
    {
      orderNumber: order.orderNumber,
      customer: order.customer,
      items: order.items,
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      shippingFee: order.shippingFee,
      total: order.total,
      paymentMethod: order.paymentMethod,
    },
    logoUrl,
  );
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sendViaGmailSmtp(
  order: OrderEmailPayload,
  to: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = Deno.env.get("SMTP_USER")?.trim();
  const pass = Deno.env.get("SMTP_PASS")?.trim();
  if (!user || !pass) {
    return { ok: false, error: "SMTP credentials are not configured" };
  }

  const host = Deno.env.get("SMTP_HOST")?.trim() ?? "smtp.gmail.com";
  const port = Number(Deno.env.get("SMTP_PORT") ?? "587");
  const from =
    Deno.env.get("EMAIL_FROM")?.trim() ?? `Bustaniya <${user}>`;
  // Gmail: 465 = SSL; 587 = STARTTLS (denomailer uses tls: true for both)
  const useTls = port === 465 || port === 587;

  const client = new SMTPClient({
    connection: {
      hostname: host,
      port,
      tls: useTls,
      auth: { username: user, password: pass },
    },
  });

  try {
    await client.send({
      from,
      to,
      subject: `Bustaniya — Your order is confirmed — ${order.orderNumber}`,
      html: buildOrderEmailHtml(order),
    });
    await client.close();
    return { ok: true };
  } catch (err) {
    try {
      await client.close();
    } catch {
      /* ignore close errors */
    }
    const message = err instanceof Error ? err.message : String(err);
    console.error("Gmail SMTP error:", message);
    return { ok: false, error: message };
  }
}

async function sendViaResend(
  order: OrderEmailPayload,
  to: string,
): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
  const apiKey = Deno.env.get("RESEND_API_KEY")?.trim();
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not set" };
  }

  const from =
    Deno.env.get("EMAIL_FROM") ?? "Bustaniya <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Bustaniya — Your order is confirmed — ${order.orderNumber}`,
      html: buildOrderEmailHtml(order),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Resend API error:", res.status, detail);
    return { ok: false, error: detail };
  }

  const data = await res.json();
  return { ok: true, id: data.id };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let order: OrderEmailPayload;
  try {
    order = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const email =
    order.customer_email?.trim() || order.customer?.email?.trim();
  if (!email || !order.orderNumber || !order.items?.length) {
    return jsonResponse(
      {
        error:
          "orderNumber, customer_email (or customer.email), and items are required",
      },
      400,
    );
  }

  const smtpResult = await sendViaGmailSmtp(order, email);
  if (smtpResult.ok) {
    return jsonResponse({ ok: true, provider: "smtp" });
  }

  const resendResult = await sendViaResend(order, email);
  if (resendResult.ok) {
    return jsonResponse({ ok: true, provider: "resend", id: resendResult.id });
  }

  console.error("Email send failed:", smtpResult.error, resendResult.error);
  return jsonResponse(
    {
      error: "Failed to send order confirmation email",
      smtp: smtpResult.error,
      resend: resendResult.error,
    },
    502,
  );
});
