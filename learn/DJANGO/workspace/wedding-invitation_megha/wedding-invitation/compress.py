from PIL import Image, ImageOps
import os, shutil

backup = os.path.join("..", "originals_backup")
os.makedirs(backup, exist_ok=True)

for f in os.listdir("images"):
    if f.lower().endswith((".jpg", ".jpeg")):
        path = os.path.join("images", f)
        shutil.copy2(path, os.path.join(backup, f))
        im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        im.thumbnail((1200, 1600))
        im.save(path, "JPEG", quality=78, optimize=True, progressive=True)
        print(f, os.path.getsize(path) // 1024, "KB")
