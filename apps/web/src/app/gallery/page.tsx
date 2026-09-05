import type { Metadata } from 'next';
import { ToonHubGallery } from '@/components/gallery/ToonHubGallery';

export const metadata: Metadata = {
  title: 'Interactive Jewellery Gallery & Masterpiece Showcase | The Bling Haven',
  description:
    'Experience our interactive Shahi Haute Joaillerie gallery showcase. Fluid momentum navigation, crystalline reflections, and authentic handcrafted Indian bridal jewellery.',
};

export default function GalleryPage() {
  return (
    <div className="w-full min-h-screen bg-[#07130E] overflow-x-hidden -mt-20">
      <ToonHubGallery allowModeSwitch={false} />
    </div>
  );
}
