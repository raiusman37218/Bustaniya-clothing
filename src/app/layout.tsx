import '@/src/styles/globals.css';
import ThemeRegistry from '@/src/theme/ThemRegistery';
import AuthProvider from '../context/authContext';
import { Providers } from './providers';

export const metadata = {
  title: "Bustaniya — Women's clothing",
  description: "Bustaniya — curated women's clothing and essentials.",
  icons: {
    icon: '/bustaniya-logo.png',
    apple: '/bustaniya-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>
            <ThemeRegistry>{children}</ThemeRegistry>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
