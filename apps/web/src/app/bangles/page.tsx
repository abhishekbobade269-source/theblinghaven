import { CategoryShowcase } from '@/components/CategoryShowcase';

export const metadata = {
  title: 'Bangles & Bracelets | The Bling Haven Canada',
  description: 'Antique matte gold openable kadas, Kundan inset bangles, and tennis bracelets with safety clasps in Toronto, Canada.',
};

export default function BanglesPage() {
  return (
    <CategoryShowcase
      categorySlug="bangles"
      categoryTitle="Bangles & Bracelets"
      subtitle="Heavyweight luxury openable kadas, hand-enameled peacock bangles, and sparkling tennis bracelets with concealed side safety latches."
      heroBannerUrl="/uploads/bangles_0deb44c0_1s6a9953.jpg"
      badgeText="The Royal Bangle & Kada Vault"
      artisanDescription="Heavyweight Jewelers Brass & Hidden Precision Safety Locks"
      highlights={[
        '22K Antique Matte & High-Polish Gold',
        'Concealed Safety Latch & Screw Closures',
        'Available in Sizes 2.4, 2.6 & 2.8',
        'Waterproof Anti-Tarnish Finish',
      ]}
    />
  );
}
