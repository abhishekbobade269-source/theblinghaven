import { CategoryShowcase } from '@/components/CategoryShowcase';

export const metadata = {
  title: 'Royal Heritage Kundan & Polki Bridal Sets | The Bling Haven Canada',
  description: 'Discover handcrafted Meenakari Jadau bridal chokers, faux Basra pearl long haar necklaces, and hydro emerald parures in Toronto, Canada.',
};

export default function BridalSetsPage() {
  return (
    <CategoryShowcase
      categorySlug="bridal-sets"
      categoryTitle="Royal Heritage Kundan & Polki Bridal Sets"
      subtitle="Centuries-old royal goldsmithing look in 22K micro gold plating, adorned with hand-cut Polki Kundan, hydro emeralds, and matching chandelier earrings."
      heroBannerUrl="/uploads/sets_00c2f42a_1s6a9390.jpg"
      badgeText="Imperial Bridal Atelier • Toronto"
      artisanDescription="Traditional Meenakari Enameling & Heavy 22K Micro Gold Plating"
      highlights={[
        'Handcrafted Meenakari Backing',
        'Includes Earrings & Maang Tikka',
        'Adjustable Silk Dori Tie',
        'Bridal Saree & Lehenga Matching',
      ]}
    />
  );
}
