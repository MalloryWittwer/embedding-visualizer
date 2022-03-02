from audioop import cross
import numpy as np
from flask import Flask
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin

from PIL import Image
from .scripts import serve_image
from tensorflow.keras import models

MNIST_DECODER = models.load_model('./models/mnist_decoder')
FASHION_DECODER = models.load_model('./models/fashion-mnist_decoder')

app = Flask(__name__, static_folder='embedding-visualizer/build', static_url_path='')
CORS(app)


@app.route('/predict/<dataset>/<x>/<y>/<z>')
@cross_origin()
def predict(dataset=None, x=None, y=None, z=None):    
    xyz = np.array([float(x), float(y), float(z)])[np.newaxis]
    
    if dataset == 'mnist':
        pred = MNIST_DECODER.predict(xyz)
    elif dataset == 'fashion-mnist':
        pred = FASHION_DECODER.predict(xyz)
    else:
        pred = np.zeros((32, 32))
    
    im = (np.squeeze(pred) * 255).astype(np.uint8)
    im_pil = Image.fromarray(im).convert('RGB')   
    image_tag = serve_image(im_pil)
    return image_tag


@app.route('/')
@cross_origin
def serve():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run()