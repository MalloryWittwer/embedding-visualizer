# Embedding visualizer

![screenshot](https://github.com/MalloryWittwer/embedding-visualizer/blob/master/screenshots/screenshot.png?raw=true)

Try the app at [https://embedding-visualizer.herokuapp.com/](https://embedding-visualizer.herokuapp.com/) (it will take about 20 seconds to load). This application is a tool to explore and interact with the latent space of a variational autoencoder (VAE) in an intuitive and user-friendly way. Users can "navigate" through the latent space by grabbing and panning the canvas, and generate new points at desired locations. This is made possible by constraining the latent space of the VAE to a unit sphere, which is projected onto the canvas using the orthographic, stereographic, or cylindrical sphere projection. The MNIST and Fashion-MNIST datasets are shown as examples, however, the technique could be applied or adapted to any other dataset.

#### Training a VAE with a spherical latent space

[Variational autoencoders](https://en.wikipedia.org/wiki/Variational_autoencoder) or VAE are neural networks that attempt to compress the input data into a low-dimensional latent space (encoding) and then reconstruct it as accurately as possible (decoding). Once the model is trained, new data can be generated from the latent space by the decoder model. Here, we have constrained the latent space to lie on the surface of a (three-dimensional) unit sphere. Therefore, the latent space is [closed](https://en.wikipedia.org/wiki/Surface_(topology)#Closed_surfaces); it is compact, without any boundaries. Introducing this constraint facilitates viewing and navigating the latent space in the web app.

⏬ Below are the loss decrease, some examples of input-reconstruction pairs in MNIST, and the evolution of the spherical latent space of the VAE over 60 epochs (colors = MNIST labels):

![animation](https://github.com/MalloryWittwer/embedding-visualizer/blob/master/screenshots/anim_autoencoder.gif?raw=true)

#### Exploring the latent space in a web app

The web app is built with a [React](https://fr.reactjs.org/) frontend and a [Flask](https://flask.palletsprojects.com/en/2.0.x/) backend (to serve newly generated data).

Quick tips:
- You can generate new data by holding **Left Ctrl** and right-clicking on the canvas.
- Use the **mouse wheel** to rapidly zoom in and out. 
- Don't forget to try the different sphere projections (orthographic, stereo, and cylindrical) and let us know which one you prefer :)
- **Mobile version**: We recommend trying the web app on a phone screen for a slightly different user experience! 

#### Contact

Any questions about this project?

=> Send me a 📧 at **mallory.wittwer@gmail.com**.
