# Embedding visualizer

![screenshot](https://github.com/MalloryWittwer/embedding-visualizer/blob/master/screenshots/screenshot.png?raw=true)

Try the app at [https://embedding-visualizer.herokuapp.com/](https://embedding-visualizer.herokuapp.com/) (it takes about 20 seconds to load). The tool provides an intuitive interface to explore the latent space of a variational autoencoder (VAE). You can "navigate" through the latent space by grabbing it and moving it around, and generate new data at locations of your choice. Different sphere projections are available to choose from to project the 3D latent space onto the screen.

#### Training a VAE with a spherical latent space

[Variational autoencoders](https://en.wikipedia.org/wiki/Variational_autoencoder) or VAE are neural networks that attempt to compress the input data into a low-dimensional latent space (encoding) and then reconstruct it as accurately as possible (decoding). Once the model is trained, new data can be generated from the latent space by the decoder model. Here, we have constrained the latent space to lie on the surface of a (three-dimensional) unit sphere. Therefore, the latent space is [closed](https://en.wikipedia.org/wiki/Surface_(topology)#Closed_surfaces); it is compact, without any boundaries. Introducing this constraint facilitates viewing and navigating the latent space in the app.

⏬ Below are the loss decrease, some examples of input-reconstruction pairs, and the evolution of the latent space over 60 epochs (colors = MNIST labels):

![animation](https://github.com/MalloryWittwer/embedding-visualizer/blob/master/screenshots/anim_autoencoder.gif?raw=true)

#### Exploring the latent space in a web app

The app is built with a [React](https://fr.reactjs.org/) frontend and a [Flask](https://flask.palletsprojects.com/en/2.0.x/) backend (to serve newly generated data).

Quick tips:
- Generate new data by holding **Left Ctrl** and right-clicking on the embedding.
- Use the **mouse wheel** to zoom in and out. 
- Try different sphere projections (orthographic, stereo, and cylindrical) and let us know your favourite :)
- **Mobile version**: try the app on a phone screen for a different user experience! 

#### Contact

Any questions about this project?

=> Send me a 📧 at **mallory.wittwer@gmail.com**.
