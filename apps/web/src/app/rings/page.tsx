import { CategoryShowcase } from '@/components/CategoryShowcase';

export const metadata = {
  title: 'AAA+ CZ Solitaires & Fashion Rings | The Bling Haven Canada',
  description: 'Explore luxury solitaire rings, engagement bands, and emerald halo rings in anti-tarnish 18K white gold rhodium and gold plating in Toronto, Canada.',
};

export default function RingsPage() {
  return (
    <CategoryShowcase
      categorySlug="rings"
      categoryTitle="AAA+ CZ Solitaires & Fashion Rings"
      subtitle="Handcrafted simulated diamond solitaires, cushion engagement rings, and stackable eternity bands engineered for everyday brilliance."
      heroBannerUrl="/uploads/rings_03526cf9_1s6a0179.jpg"
      badgeText="The Solitaire & Engagement Salon"
      artisanDescription="Engineered with 18K White Gold Rhodium & Anti-Tarnish E-Coating"
      highlights={[
        'AAA+ Hearts & Arrows Cut',
        'Anti-Tarnish Waterproof Coating',
        '100% Nickel-Free & Hypoallergenic',
        'Comfort-Fit Sizing (US 5 - 10)',
      ]}
    />
  );
}
