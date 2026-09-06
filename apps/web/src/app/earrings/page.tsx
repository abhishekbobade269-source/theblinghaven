import { CategoryShowcase } from '@/components/CategoryShowcase';

export const metadata = {
  title: 'Earrings | The Bling Haven Canada',
  description: 'Dazzling chandelier drops, Mughal Chandbali earrings, and lightweight hypoallergenic studs in 18K gold and rhodium finish in Toronto, Canada.',
};

export default function EarringsPage() {
  return (
    <CategoryShowcase
      categorySlug="earrings"
      categoryTitle="Earrings"
      subtitle="High-fashion statement chandeliers, royal Mughal Chandbalis, and lightweight everyday studs crafted for maximum glamour and sensitive skin comfort."
      heroBannerUrl="/uploads/earrings_01462b03_1s6a0431.jpg"
      badgeText="The Haute Earring & Jhumka Salon"
      artisanDescription="Lightweight Ergonomic Weight Distribution & 100% Skin-Safe Posts"
      highlights={[
        'Austrian Crystal & Hydro Gem Stones',
        'Lightweight Comfort Fit (< 20g)',
        'Mughal Chandbali & Dome Jhumkis',
        'Hypoallergenic Push-Back Closures',
      ]}
    />
  );
}
