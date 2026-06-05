import type { Metadata } from 'next';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Admin — Bustaniya',
  description: 'Manage customer orders',
};

const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f4f4f5',
        fontFamily: FONT,
        color: '#1a1a1a',
      }}
    >
      {children}
      <Toaster position="top-center" richColors />
    </div>
  );
}
