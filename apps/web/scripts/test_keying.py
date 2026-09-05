import os
from PIL import Image

def remove_solid_bg(img_path, out_path, bg_color='black', threshold=18):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    
    for item in data:
        r, g, b, a = item
        if bg_color == 'black':
            # Check distance from black
            if r < threshold and g < threshold and b < threshold:
                new_data.append((r, g, b, 0))
            else:
                # Smooth alpha ramp for near-black edges
                max_val = max(r, g, b)
                if max_val < threshold + 15:
                    alpha = int(255 * (max_val - threshold) / 15)
                    new_data.append((r, g, b, alpha))
                else:
                    new_data.append((r, g, b, 255))
        elif bg_color == 'white':
            if r > 255 - threshold and g > 255 - threshold and b > 255 - threshold:
                new_data.append((r, g, b, 0))
            else:
                min_val = min(r, g, b)
                if min_val > 255 - (threshold + 15):
                    alpha = int(255 * (255 - min_val) / 15)
                    new_data.append((r, g, b, alpha))
                else:
                    new_data.append((r, g, b, 255))
                    
    img.putdata(new_data)
    img.save(out_path, "PNG")
    print(f"Saved: {out_path}")

out_dir = r"c:\Users\monsx\OneDrive\Documents\theblinghaven\apps\web\public\gallery\processed"
os.makedirs(out_dir, exist_ok=True)

# Test Ring (black background)
ring_src = r"c:\Users\monsx\OneDrive\Documents\theblinghaven\apps\web\public\gallery\raw\Rings_2.jpeg"
ring_out = os.path.join(out_dir, "01_ring_transparent.png")
remove_solid_bg(ring_src, ring_out, 'black', 12)

# Test Necklace (black background)
neck_src = r"c:\Users\monsx\OneDrive\Documents\theblinghaven\apps\web\public\gallery\raw\Neklace_2.jpeg"
neck_out = os.path.join(out_dir, "02_necklace_transparent.png")
remove_solid_bg(neck_src, neck_out, 'black', 12)

# Test Earrings (white background)
ear_src = r"c:\Users\monsx\OneDrive\Documents\theblinghaven\apps\web\public\gallery\raw\Earings_2.jpeg"
ear_out = os.path.join(out_dir, "03_earrings_transparent.png")
remove_solid_bg(ear_src, ear_out, 'white', 15)
