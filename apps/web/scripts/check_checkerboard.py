from PIL import Image
import numpy as np

img = Image.open(r"c:\Users\monsx\OneDrive\Documents\theblinghaven\apps\web\public\gallery\raw\Bangles_3.jpeg")
arr = np.array(img)

# Sample top-left 100x100 corner (which is pure background)
corner = arr[:100, :100]
print("Corner min:", corner.min(axis=(0,1)), "max:", corner.max(axis=(0,1)))
# Check unique colors in the corner
unique_colors = np.unique(corner.reshape(-1, 3), axis=0)
print(f"Unique colors in background corner: {len(unique_colors)}")
print("Sample background colors:", unique_colors[:10])
