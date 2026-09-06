import { CategoryShowcase } from '@/components/CategoryShowcase';

export const metadata = {
  title: 'Silver Jewellery | The Bling Haven Canada',
  description: 'Handcrafted solid wire filigree heritage cuffs, tribal oxidized bangles, and woven mesh chokers with anti-tarnish coating in Toronto, Canada.',
};

export default function ArtisanSilverPage() {
  return (
    <CategoryShowcase
      categorySlug="artisan-silver"
      categoryTitle="Silver Jewellery"
      subtitle="Generational silversmithing wire-work, sculptural woven collars, and oxidized floral cuffs finished with anti-tarnish protective sealant."
      heroBannerUrl="/uploads/handmade_2ffa5211_1s6a0379.jpg"
      badgeText="Artisan Silversmithing Atelier"
      artisanDescription="Generational Wire Filigree & High-Mirror 925 Silver Micro-Plating"
      highlights={[
        'Handcrafted Wire Filigree Technique',
        '925 Sterling Silver Plating with E-Coat',
        'Bohemian Tribal & Modern Sculptural Cuffs',
        'Adjustable Open Comfort Sizing',
      ]}
    />
  );
}
