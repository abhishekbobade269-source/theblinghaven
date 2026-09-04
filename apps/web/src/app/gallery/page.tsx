import type { Metadata } from 'next';
import { ToonHubGallery } from '@/components/gallery/ToonHubGallery';

export const metadata: Metadata = {
  title: 'Interactive 3D Gallery & Masterpiece Showcase | The Bling Haven',
  description:
    'Experience our interactive 3D character figurine carousel and Haute Joaillerie vault showcase. Fluid momentum navigation, crystalline reflections, and artisanal craft.',
};

export default function GalleryPage() {
  return (
    <div className="w-full min-h-screen bg-obsidian-950 overflow-hidden">
      <ToonHubGallery allowModeSwitch={true} />
    </div>
  );
}
