import { Typography } from '@mui/material';
import StaticPageShell from '@/src/components/layout/StaticPageShell';

export default function FaqPage() {
  return (
    <StaticPageShell title="FAQ">
      <Typography sx={{ color: '#555', lineHeight: 1.7, mb: 2 }}>
        <strong>How do I place an order?</strong>
        <br />
        Browse the shop, add items to your cart, and complete checkout with cash on delivery.
      </Typography>
      <Typography sx={{ color: '#555', lineHeight: 1.7, mb: 2 }}>
        <strong>What payment methods do you accept?</strong>
        <br />
        We currently offer cash on delivery (COD) across Pakistan.
      </Typography>
      <Typography sx={{ color: '#555', lineHeight: 1.7 }}>
        <strong>How can I contact support?</strong>
        <br />
        Visit our contact page or email us with your order number for faster help.
      </Typography>
    </StaticPageShell>
  );
}
