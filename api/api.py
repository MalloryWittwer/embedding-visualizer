import numpy as np
from flask import Flask
from PIL import Image
from .scripts import serve_image
from tensorflow.keras import models

MNIST_DECODER = models.load_model('./models/mnist_decoder')
FASHION_DECODER = models.load_model('./models/fashion-mnist_decoder')

app = Flask(__name__, static_folder='client/build', static_url_path='')

@app.route('/api')
def index():
    return 'Welcome to the API.'

@app.route('/predict/<dataset>/<x>/<y>/<z>')
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

if __name__ == '__main__':
    app.run(host='0.0.0.0')