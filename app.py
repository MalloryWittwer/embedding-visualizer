import numpy as np
from flask import Flask
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin
from PIL import Image
# from tensorflow.keras import models
import io
import base64


def serve_image(pil_img):
    img_io = io.BytesIO()
    pil_img.save(img_io, 'jpeg', quality=100)
    img_io.seek(0)
    img = base64.b64encode(img_io.getvalue()).decode('ascii')
    img_tag = f"data:image/jpg;base64,{img}"
    return img_tag


# MNIST_DECODER = models.load_model('./models/mnist_decoder')
# FASHION_DECODER = models.load_model('./models/fashion-mnist_decoder')

app = Flask(__name__, static_folder='build', static_url_path='') # embedding-visualizer/build
CORS(app)


@app.route('/predict/<dataset>/<x>/<y>/<z>', methods=['GET'])
@cross_origin()
def predict(dataset=None, x=None, y=None, z=None):  
    
    image_tag = ''
      
    # xyz = np.array([float(x), float(y), float(z)])[np.newaxis]
    
    # if dataset == 'mnist':
    #     pred = MNIST_DECODER.predict(xyz)
    # elif dataset == 'fashion-mnist':
    #     pred = FASHION_DECODER.predict(xyz)
    # else:
    #     pred = np.zeros((32, 32))
    
    # im = (np.squeeze(pred) * 255).astype(np.uint8)
    # im_pil = Image.fromarray(im).convert('RGB')   
    # image_tag = serve_image(im_pil)
    return image_tag


@app.route('/', methods=['GET'])
@cross_origin
def serve():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run()