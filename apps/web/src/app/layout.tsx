import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserAuthProvider } from '@/context/UserAuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/AuthModal';
import { CustomerChatWidget } from '@/components/CustomerChatWidget';
import { PageStatusGuard } from '@/components/PageStatusGuard';
import { SmoothScroll } from '@/components/SmoothScroll';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF9F5' },
    { media: '(prefers-color-scheme: dark)', color: '#09090C' },
  ],
};

export const metadata: Metadata = {
  title: 'The Bling Haven | Luxury Fashion Jewelry & Haute Joaillerie Canada',
  description:
    'Handcrafted AAA+ CZ solitaires, 22K micro gold plated bridal heirlooms, and Austrian crystal statement jewelry in Toronto, Canada.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'The Bling Haven',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Cinzel:wght@400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:wght@400;500;600;700&family=Italiana&family=Marcellus&family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Tenor+Sans&display=swap"
          rel="stylesheet"
        />
        <script src="https://accounts.google.com/gsi/client" async defer />
      </head>
      <body className="bg-[#FAF8F5] text-stone-900 dark:bg-[#09090C] dark:text-stone-100 font-sans flex flex-col min-h-[100dvh] antialiased selection:bg-gold-500 selection:text-obsidian-950">
        <SmoothScroll>
          <ThemeProvider>
            <CurrencyProvider>
              <UserAuthProvider>
                <CartProvider>
                  <Header />
                  <CartDrawer />
                  <AuthModal />
                  <main className="flex-grow w-full max-w-[100vw] overflow-x-hidden">
                    <PageStatusGuard>{children}</PageStatusGuard>
                  </main>
                  <Footer />
                  <CustomerChatWidget />
                </CartProvider>
              </UserAuthProvider>
            </CurrencyProvider>
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
