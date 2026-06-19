import '@/src/styles/globals.css';
import ThemeRegistry from '@/src/theme/ThemRegistery';
import AuthProvider from '../context/authContext';
import { Providers } from './providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bustaniya.com'),
  title: {
    default: "Bustaniya — Premium Women's Clothing & Custom Eastern Wear",
    template: "%s | Bustaniya"
  },
  description: "Discover Bustaniya — your premier destination for luxury ready-to-wear and customized women's clothing. Explore our collection of premium Kurtis, elegant Shalwar Kameez, designer Full Dresses, and customized wear crafted with premium fabrics and modern cuts.",
  keywords: [
    "Bustaniya",
    "Bustaniya Clothing",
    "women's clothing",
    "kurtis online",
    "shalwar kameez",
    "freshi shalwar",
    "full dress designs",
    "customized dress",
    "custom clothing",
    "luxury ready-to-wear",
    "Eastern wear for women",
    "traditional Pakistani clothing",
    "designer ladies suits",
    "premium women boutique"
  ],
  authors: [{ name: "Bustaniya" }],
  creator: "Bustaniya Team",
  publisher: "Bustaniya",
  icons: {
    icon: '/bustaniya-logo.png',
    shortcut: '/bustaniya-logo.png',
    apple: '/bustaniya-logo.png',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bustaniya.com",
    title: "Bustaniya — Premium Women's Clothing & Custom Eastern Wear",
    description: "Discover Bustaniya — your premier destination for luxury ready-to-wear and customized women's clothing. Explore our collection of premium Kurtis, elegant Shalwar Kameez, designer Full Dresses, and customized wear.",
    siteName: "Bustaniya",
    images: [
      {
        url: "/file-cover.png",
        width: 1200,
        height: 630,
        alt: "Bustaniya - Premium Women's Clothing Collection",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bustaniya — Premium Women's Clothing & Custom Eastern Wear",
    description: "Discover Bustaniya — your premier destination for luxury ready-to-wear and customized women's clothing. Explore our collection of premium Kurtis, elegant Shalwar Kameez, designer Full Dresses, and customized wear.",
    images: ["/file-cover.png"],
    creator: "@bustaniya",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "fashion",
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
