import os
from PIL import Image

def clean_and_center_all():
    base_dir = r"c:\Users\monsx\OneDrive\Documents\theblinghaven\apps\web\public\gallery\processed"
    ref_dir = r"c:\Users\monsx\OneDrive\Documents\theblinghaven\WebsiteImages\3D_Gallery_Selected_References"
    
    files = [
        "01_ring_transparent.png",
        "02_necklace_transparent.png",
        "03_earrings_transparent.png",
        "04_bangles_transparent.png"
    ]
    
    for fname in files:
        fpath = os.path.join(base_dir, fname)
        if not os.path.exists(fpath):
            continue
            
        img = Image.open(fpath).convert("RGBA")
        w, h = img.size
        pixels = img.load()
        
        # Erase bottom-right corner watermark (bottom 160x160 px)
        for x in range(max(0, w - 160), w):
            for y in range(max(0, h - 160), h):
                pixels[x, y] = (0, 0, 0, 0)
                
        # Get bounding box of the actual object
        bbox = img.getbbox()
        if bbox:
            cropped = img.crop(bbox)
            cw, ch = cropped.size
            # Create square canvas with 12% padding
            side = int(max(cw, ch) * 1.25)
            square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
            offset_x = (side - cw) // 2
            offset_y = (side - ch) // 2
            square.paste(cropped, (offset_x, offset_y))
            
            # Resize cleanly to standard 1200x1200 for crystal-clear retina display
            final_img = square.resize((1200, 1200), Image.Resampling.LANCZOS)
            
            # Save to public web folder
            final_img.save(fpath, "PNG")
            # Save to references folder
            final_img.save(os.path.join(ref_dir, fname), "PNG")
            print(f"Optimized & Cleaned: {fname} -> 1200x1200 square PNG (No watermark, centered)")

if __name__ == "__main__":
    clean_and_center_all()
