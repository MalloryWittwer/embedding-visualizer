import io
import base64

def serve_image(pil_img):
    img_io = io.BytesIO()
    pil_img.save(img_io, 'jpeg', quality=100)
    img_io.seek(0)
    img = base64.b64encode(img_io.getvalue()).decode('ascii')
    img_tag = f"data:image/jpg;base64,{img}"
    return img_tag