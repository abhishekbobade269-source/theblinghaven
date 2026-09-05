import os
try:
    from PIL import Image
    has_pil = True
except ImportError:
    has_pil = False

folder = r"c:\Users\monsx\OneDrive\Documents\theblinghaven\Gallery_Photos"
print(f"Checking folder: {folder}")
print(f"PIL available: {has_pil}")

if has_pil:
    for root, dirs, files in os.walk(folder):
        for f in files:
            if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                p = os.path.join(root, f)
                try:
                    img = Image.open(p)
                    tl = img.getpixel((5, 5))
                    tr = img.getpixel((img.width - 5, 5))
                    print(f"{os.path.basename(root)} / {f[:35]} | size={img.size} | mode={img.mode} | TL={tl} | TR={tr}")
                except Exception as e:
                    print(f"Err {f}: {e}")
