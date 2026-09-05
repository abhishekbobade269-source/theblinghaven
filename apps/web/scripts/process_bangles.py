import os
from PIL import Image

def process_bangles():
    src_path = r"c:\Users\monsx\OneDrive\Documents\theblinghaven\WebsiteImages\3D_Gallery_Selected_References\Diamond_bangles_displayed_on_black_202609050238.jpeg"
    img = Image.open(src_path).convert("RGBA")
    w, h = img.size
    
    # Clean the tiny watermark in bottom right corner (last 60x60 px)
    pixels = img.load()
    for x in range(w - 70, w):
        for y in range(h - 70, h):
            pixels[x, y] = (0, 0, 0, 255)
            
    # Key out black background
    threshold = 12
    for x in range(w):
        for y in range(h):
            r, g, b, a = pixels[x, y]
            if r < threshold and g < threshold and b < threshold:
                pixels[x, y] = (0, 0, 0, 0)
            else:
                max_val = max(r, g, b)
                if max_val < threshold + 15:
                    alpha = int(255 * (max_val - threshold) / 15)
                    pixels[x, y] = (r, g, b, alpha)
                else:
                    pixels[x, y] = (r, g, b, 255)
                    
    # Also clean the tiny star on bottom right of the necklace and ring if any existed
    dest1 = r"c:\Users\monsx\OneDrive\Documents\theblinghaven\WebsiteImages\3D_Gallery_Selected_References\04_bangles_transparent.png"
    dest2 = r"c:\Users\monsx\OneDrive\Documents\theblinghaven\apps\web\public\gallery\processed\04_bangles_transparent.png"
    img.save(dest1, "PNG")
    img.save(dest2, "PNG")
    print(f"Saved: {dest1}")
    print(f"Saved: {dest2}")

if __name__ == "__main__":
    process_bangles()
