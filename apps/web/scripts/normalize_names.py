import os
import shutil

src = r"c:\Users\monsx\OneDrive\Documents\theblinghaven\Gallery_Photos"
dest = r"c:\Users\monsx\OneDrive\Documents\theblinghaven\apps\web\public\gallery\raw"
os.makedirs(dest, exist_ok=True)

for root, dirs, files in os.walk(src):
    cat = os.path.basename(root)
    for i, f in enumerate(files):
        if f.lower().endswith(('.jpeg', '.jpg', '.png')):
            full_path = os.path.join(root, f)
            clean_name = f"{cat}_{i+1}.jpeg"
            out_path = os.path.join(dest, clean_name)
            shutil.copy2(full_path, out_path)
            print(f"{clean_name} <- {f}")
