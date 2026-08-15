import os
import sqlite3
from PIL import Image

DB_PATH = 'apps/api/prisma/dev.db'
API_UPLOADS = 'apps/api/uploads'
ADMIN_UPLOADS = 'apps/admin/public/uploads'

API_THUMBS = os.path.join(API_UPLOADS, 'thumbnails')
ADMIN_THUMBS = os.path.join(ADMIN_UPLOADS, 'thumbnails')

os.makedirs(API_THUMBS, exist_ok=True)
os.makedirs(ADMIN_THUMBS, exist_ok=True)

def generate_thumbnails():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute('SELECT id, filename FROM media_assets')
    rows = cursor.fetchall()

    print(f'Generating ultra-light thumbnails for {len(rows)} media assets...')
    count = 0

    for asset_id, filename in rows:
        src_path = os.path.join(API_UPLOADS, filename)
        if not os.path.exists(src_path):
            src_path = os.path.join(ADMIN_UPLOADS, filename)

        if not os.path.exists(src_path):
            continue

        thumb_name = f'thumb_{filename}'
        if not thumb_name.lower().endswith('.jpg') and not thumb_name.lower().endswith('.png'):
            thumb_name += '.jpg'

        dst_api = os.path.join(API_THUMBS, thumb_name)
        dst_admin = os.path.join(ADMIN_THUMBS, thumb_name)

        try:
            with Image.open(src_path) as img:
                img = img.convert('RGB')
                # Resize keeping aspect ratio, max 300px
                img.thumbnail((300, 300), Image.Resampling.LANCZOS)
                img.save(dst_api, 'JPEG', quality=75, optimize=True)
                img.save(dst_admin, 'JPEG', quality=75, optimize=True)

            thumb_url = f'/uploads/thumbnails/{thumb_name}'
            cursor.execute('UPDATE media_assets SET thumbnailUrl = ? WHERE id = ?', (thumb_url, asset_id))
            count += 1
        except Exception as e:
            print(f'Error processing {filename}: {e}')

    conn.commit()
    conn.close()
    print(f'Successfully generated and linked {count} optimized lightweight thumbnails!')

if __name__ == '__main__':
    generate_thumbnails()
