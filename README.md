## Web Presentation

Web browser-based application, analogous to those office presentation applications, in a single file.

There are two independent solutions: 1) the single file is `presentation.html`, then the user lists the presentation items in a JavaScript file, 2) the single file is `presentation.js`, then the user's list is in an HTML file. Both solutions have their benefits and drawbacks. The second solution is a bit more complicated, but it offers extra flexibility, embedded HTML presentation frames, and detailed diagnostic of possible user errors.
### Live Demo

See the live demo presentation in &ldquo;./demo&rdquo; and &ldquo;./demo-the-other-way-around&rdquo;, run the live demo in the browser:
1. [based on presentation.html](https://SAKryukov.github.io/web-presentation/demo/),
1. [based on presentation.js](https://SAKryukov.github.io/web-presentation/demo-the-other-way-around/), the other way around.

### Usage

Simply add a presentation description file with a list of vector, raster image files, or video files. The files should be compatible with the user's Web browser. The containers and formats standardized for Web are highly recommended, such as SVG, WebP, WebM (VP8, VP9, AV1 video codecs).

For detailed usage, see original publications:
1. [Web Presentation, an Application in a Single File](https://www.codeproject.com/Articles/5286790/Web-Presentation)
1. [Web Presentation, the Other Way Around](https://www.codeproject.com/Articles/5290221/Web-Presentation-the-Other-Way-Around)

