export type OrderEmailLineItem = {
  name: string;
  quantity: number;
  size?: string;
  color?: string;
  lineTotal: number;
};

export type OrderEmailData = {
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode?: string;
    country: string;
    phone: string;
  };
  items: OrderEmailLineItem[];
  subtotal: number;
  discountAmount?: number;
  shippingFee?: number;
  total: number;
  paymentMethod?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatPkr(amount: number): string {
  return `Rs ${amount.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
}

function renderLogoHeader(logoUrl: string): string {
  if (logoUrl) {
    return `
      <img
        src="${escapeHtml(logoUrl)}"
        alt="Bustaniya"
        width="168"
        height="auto"
        style="display:block;margin:0 auto;max-width:168px;height:auto;border:0;"
      />`;
  }

  return `
    <p style="margin:0;font-size:26px;font-weight:700;letter-spacing:0.18em;color:#121212;font-family:Georgia,'Times New Roman',serif;">
      BUSTANIYA
    </p>`;
}

export function renderOrderConfirmationEmail(
  order: OrderEmailData,
  logoUrl: string,
): string {
  const { customer } = order;

  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #ececec;vertical-align:top;">
          <strong style="font-size:14px;color:#121212;">${escapeHtml(item.name)}</strong><br/>
          <span style="color:#6b6b6b;font-size:13px;line-height:1.5;">
            Qty ${item.quantity}${item.size ? ` · ${escapeHtml(item.size)}` : ''}${item.color ? ` · ${escapeHtml(item.color)}` : ''}
          </span>
        </td>
        <td style="padding:14px 0;border-bottom:1px solid #ececec;text-align:right;vertical-align:top;white-space:nowrap;font-size:14px;color:#121212;">
          ${formatPkr(item.lineTotal)}
        </td>
      </tr>`,
    )
    .join('');

  const discountAmount = order.discountAmount ?? 0;
  const discountRow =
    discountAmount > 0
      ? `<tr>
          <td style="padding:6px 0;color:#444;font-size:14px;">Discount</td>
          <td style="padding:6px 0;text-align:right;color:#121212;font-size:14px;">−${formatPkr(discountAmount)}</td>
        </tr>`
      : '';

  const shippingFee = order.shippingFee ?? 0;
  const shippingLabel = shippingFee > 0 ? formatPkr(shippingFee) : 'FREE';
  const paymentLabel = escapeHtml(
    order.paymentMethod ?? 'Cash on delivery (COD)',
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Order confirmed — ${escapeHtml(order.orderNumber)}</title>
</head>
<body style="margin:0;padding:0;background:#efefef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#efefef;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5;">
          <tr>
            <td style="padding:32px 32px 24px;text-align:center;background:#ffffff;border-bottom:1px solid #f0f0f0;">
              ${renderLogoHeader(logoUrl)}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;background:#121212;border-radius:12px;">
                <tr>
                  <td style="padding:24px 28px;color:#ffffff;">
                    <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;opacity:0.75;">
                      Order confirmed
                    </p>
                    <h1 style="margin:0;font-size:24px;font-weight:600;line-height:1.3;">
                      Thank you, ${escapeHtml(customer.firstName)}!
                    </h1>
                    <p style="margin:10px 0 0;font-size:14px;line-height:1.5;opacity:0.88;">
                      Order <strong style="font-weight:600;">${escapeHtml(order.orderNumber)}</strong>
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;color:#444;font-size:15px;line-height:1.6;">
                We have received your order and our team will prepare it for delivery. You will be contacted if we need any additional details.
              </p>
              <p style="margin:12px 0 0;color:#666;font-size:14px;line-height:1.6;">
                Payment method: <strong style="color:#121212;">${paymentLabel}</strong>
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
                <tr>
                  <td style="padding-bottom:10px;font-size:13px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#888;">
                    Your items
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                ${rows}
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;font-size:14px;">
                <tr>
                  <td style="padding:8px 0;color:#555;">Subtotal</td>
                  <td style="padding:8px 0;text-align:right;color:#121212;">${formatPkr(order.subtotal)}</td>
                </tr>
                ${discountRow}
                <tr>
                  <td style="padding:8px 0;color:#555;">Shipping</td>
                  <td style="padding:8px 0;text-align:right;color:#121212;">${shippingLabel}</td>
                </tr>
                <tr>
                  <td style="padding:14px 0 0;font-size:16px;font-weight:700;color:#121212;border-top:2px solid #121212;">Total</td>
                  <td style="padding:14px 0 0;font-size:16px;font-weight:700;text-align:right;color:#121212;border-top:2px solid #121212;">
                    ${formatPkr(order.total)}
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;background:#fafafa;border-radius:10px;border:1px solid #eee;">
                <tr>
                  <td style="padding:20px 22px;">
                    <p style="margin:0 0 10px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#888;">
                      Shipping address
                    </p>
                    <p style="margin:0;font-size:14px;line-height:1.65;color:#333;">
                      ${escapeHtml(customer.firstName)} ${escapeHtml(customer.lastName)}<br/>
                      ${escapeHtml(customer.address)}<br/>
                      ${escapeHtml(customer.city)}${customer.postalCode ? `, ${escapeHtml(customer.postalCode)}` : ''}<br/>
                      ${escapeHtml(customer.country)}<br/>
                      ${escapeHtml(customer.phone)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 32px;text-align:center;background:#fafafa;border-top:1px solid #eee;">
              <p style="margin:0 0 6px;font-size:13px;color:#666;line-height:1.5;">
                Thank you for shopping with <strong style="color:#121212;">Bustaniya</strong>.
              </p>
              <p style="margin:0;font-size:12px;color:#999;line-height:1.5;">
                Questions about your order? Reply to this email and we will be happy to help.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0;font-size:11px;color:#aaa;line-height:1.5;">
          © Bustaniya. This is an automated message regarding your purchase.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
