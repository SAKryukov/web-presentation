@numbering {
    enable: false
}

{title}Web Presentation, an Application in a Single File

[*Sergey A Kryukov*](https://www.SAKryukov.org){.author}

A cross-platform replacement for all those office presentation applications in a single file

*Who needs presentations created with boring bulky office presentation packages not always available for all systems? All you need is a Web browser and a set of vector/pixel images. With a solution in just one HTML/CSS/JavaScript file, you have all the features people use in presentations.*

[Live demo](http://www.sakryukov.org/software/GitHub.live/web-presentation/demo)

<!-- copy to CodeProject from here ------------------------------------------->

![presentation.h](main.jpeg)

## Contents{no-toc}

@toc

## Motivation

For the last presentation, I delivered I already had a collection of SVG images mostly representing some architectural solutions. When you develop architectural and design solutions, you always have some, as SVG is the most universal vector format. While photos can be easily shown in a presentation manner using a suitable image viewer, SVG typically takes some extra effort, and probably the worst option would be messing with those office presentation applications. Why not showing the images themselves? After all, they are scalable and compatible with all non-nonsense Web browsers.

So I quickly put together the images in a JavaScript file and added the simplest script used to move from one image to another. What a relief! Who would ever need anything else?

For this article, I decided to share this joy and also added some more advanced settings and a demo, to re-work it into a comprehensive solution. Even after this development, it remains a minimalistic single-file product, even easier to use.

In the demo, I added some animated SVG, static WebP photographs, and a WebP video converted from an out-of-camera video in the form of WebP animation. These files and the features have nothing to do with the presentation product itself, they just demonstrate that all we need is already available, can be created using open-source products only. At the same time, we can have all the features expected from those bloated office software applications, in a much easier way.

## Usage

The basic usage is probably as simple as it can be. The [live demo](http://www.sakryukov.org/software/GitHub.live/web-presentation/demo) also provides an introduction to the presentation system and shows its features.

Basically, the presenter creates a set of files each representing a presentation frame, lists their paths in required order in a presentation data file, and loads "presentation.h" in a browser, passing the presentation data file in the URL query string. Presentation starts.

There is also some minimal set of advanced properties; each of them is optional.

### Presentation Data

In addition to image files, the presentation needs to be described. First of all, it needs a list of relative paths to image file, to define both image data and the order of images in the presentation. All other properties can be omitted, then the default values are used. For example, let's assume we put it in a file "demo/presentation.js", path is relative to "presentation.html":

```{lang=JavaScript}{#presentation-sample}
const presentation = {
    images: [ // relative to presentation.html
        "demo/1.webp",
        "demo/1.svg",
        "demo/2.webp",
    ],
    title: "Presentation Demo",
    hideHelpOnStart: false,
    colors: {
        background: "white",
        text: {
            background: "azure",
            foreground: "black",
            border: "lightBlue",
        },
    },
    rtl: false,
};
```

This presentation can be loaded in a Web page by using the path to the presentation file in a query string of the URL. The easiest way to do it is havin a separate presentation-specific HTML file. Let's assume this is the file "demo/index.html", then its content could be:

```{lang=HTML}{#presentation-index-sample}
&lt;!doctype HTML&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta http-equiv="refresh" content="0; url=
        ../presentation.html?demo/presentation.js" /&gt;
    &lt;/head&gt;
&lt;/html&gt;
```

### Presentation Properties

All paths are relative to the location of "presentation.html".

`presentation.images`: an array of image file names, paths are relative to "presentation.html". This property is the only mandatory one. If it is missing, or this is an empty list, the application will report an error.

Optional Properties:

`title`: presentation title

`hideHelpOnStart`: boolean (true/false), default: `false`, that is, by default help text is shown on started

`colors`: colors for the presentation background and rendering of text data

`colors.background`: presentation background. It is also applied as a background for all images supporting transparency or alpha channel.

`colors.text`: colors for the rendering of text data, an object with three self-explained properties.

`rtl`: the option for [right-to-left cultures](https://en.wikipedia.org/wiki/Right-to-left), explained in detail [below](#heading-rtl-support), default: `false`.

### Image File Types

For the presentation frames, all MIME types standardized for Web are acceptable. For vector graphics this is [SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics), image/svg+xml. For raster graphics and acceptable types are: image/apng, image/avif, image/gif, image/jpeg, image/png and image/webp.

Image file types accepted by specific browser but not standardized for Web, such as .bmp, .ico, or .tif, should be best avoided.

For raster images, the most practical and recommended format is [WebP](https://en.wikipedia.org/wiki/WebP). It provides much better compression than older image types, supports progressive rendering, separate presets optimized for Picture, Icon, Photo, Drawing, and Text, and animation. Other animation-supporting types for raster graphics are [APNG](https://en.wikipedia.org/wiki/APNG), [AVIF](https://en.wikipedia.org/wiki/AV1#AV1_Image_File_Format_(AVIF)), and [GIF](https://en.wikipedia.org/wiki/GIF).

However, for presentation purposes, the most important type of animation is vector animation, SVG, because people widely use various transition effects. Even though such effects more distract from the presentation than help to understand the material, they are considered as a must.

## Animation

Even though the creation of the image files is the sole responsibility of the user, I just want to comment on the creation of animation, using only the image file types standardized for Web and only open-source products and standards. There are many tools for the creation of the animation.

For example, SVG can be created using [Inkscape](https://en.wikipedia.org/wiki/Inkscape). There is a lot of documentation on SVG animation, first of all, [SMIL](https://en.wikipedia.org/wiki/SVG_animation#SVG_animation_using_SMIL), which is probably the most suitable approach for presentation purposes: each transition effect takes just one short line of XML code, and the effects can be combined on the same element. Also, some add-ons for animation are available.

For raster graphics, the best approach is probably WebP. I used two tools for the creation of animation. First of all, the animation can be composed of a set of separate frames in [GIMP](https://en.wikipedia.org/wiki/GIMP). To do so, one needs to put each frame in a separate layer, perform animation optimization ([Main menu] => Filters => Animation => Optimize (Difference)), and save the result in a WebP image. At the moment of saving, GIMP will offer an option to create an animation.

Also, [FFMpeg](https://en.wikipedia.org/wiki/FFmpeg) can convert available video file to a WebP animation. The example of a command line:
```
ffmpeg -i input_file -vcodec libwebp -filter:v fps=fps=20 -lossless 0 -compression_level 6 -an -vsync 0 output_file.webp
```
See FFMpeg documentation for more detail.

All the software tools I mentioned are not only open-source but also available on most platforms.

## Implementation Detail

The implementation is trivial enough to get into detail too much. The purpose of this article is to provide a comprehensive working tool for presentations, not so much to teach anything. If this work can teach something, it's the taste for minimalism and sober practical look at all those commercial bloated products.

So, I'll touch only a few not-so-obvious aspects.

### Preserved Animation

Animation is preserved by not loading all images during the initialization phase. Instead, there is only one `img` element which is loaded from source by assignment to its `src` property only for the very first image of the presentation. All other images are loaded as the are shown:

```{lang=JavaScript}{#code-move}
const move = backward => {
    if (backward)
        if (current > 0) --current; else current = presentation.images.length - 1;
    else
        if (current < presentation.images.length - 1) ++current; else current = 0;
    image.src = presentation.images[current];
    resize(image);
};
```
This way, each `image.src` property assignment starts the animation. Accordingly, the animation is started again every time the same image is shown.

### Touchscreen Support

```{lang=JavaScript}{#code-touch}
let touchStart = undefined;
addEventListener("touchstart", event => {
    touchStart = { x: event.changedTouches[0].clientX,
                   y: event.changedTouches[0].clientY };
}, false);
addEventListener("touchend", event => { touchStart = undefined; }, false);
addEventListener("touchmove", event => {
    if (touchStart == undefined) return;
    const vector = { x: event.changedTouches[0].clientX - touchStart.x,
                    y: event.changedTouches[0].clientY - touchStart.y };
    const horizontal = Math.abs(vector.x) > Math.abs(vector.y);
    let back = horizontal ? vector.x > 0 : vector.y > 0;
    if (horizontal && presentation.rtl) back = !back;
    move(back);
    touchStart = undefined;
}, false);
```
This behavior also depends on the `presentation.rtl` property explained below.

### RTL Support

Written writing cultures based on the [right-to-left](https://en.wikipedia.org/wiki/Right-to-left) system also slightly modify the views of people. This cultural element can affect the way some people look at the [arrow of time](https://en.wikipedia.org/wiki/Arrow_of_time): while in Western cultures people imagine time as something floating from left to right, other people may think otherwise. In this case, it can be more natural to view the flow of the presentation as something moving from right to left. For such people, the `rtl` property is provided. It only changes the use of left/right arrows and left/right swipe with a touchscreen: the direction changed to is opposite. It has nothing to do with [CSS direction](https://developer.mozilla.org/en-US/docs/Web/CSS/direction) but is based on similar considerations.

Effectively, it only affects how people treat arrow keys "&larr;" and "&rarr;" and the direction of the touchscreen swipe. In Western cultures it is implied that "&larr;" means "previous" and "&rarr;" means "next", a person performing these operations imagines a current frame as a window, showing a strip of frames, representing the timeline. For touch screen swipe, a person "moves" not a window, but a strip of frames itself, so "&larr;" means "next" and "&rarr;" means "previous". In RTL cultures, all four operations come in opposite directions. At the same time, the meaning of up and down directions doesn't depend on the culture.

Therefore, as the function `move` accepts a boolean parameter with the meaning of "go to previous frame", the handling of arrow keys depends on the `presentation.rtl`, but only for horizontal directions:

```{lang=JavaScript}{#code-keyboard}
switch (event.code) {
    case "Space":
    case "ArrowDown": move(false); break;
    case "Backspace":
    case "ArrowUp": move(true); break;
    case "ArrowRight": move(presentation.rtl); break;
    case "ArrowLeft": move(!presentation.rtl); break;
    //...
}
```

Similarly, the direction in reverse is used for horizontal directions only in the implementation of the [touchscreen swipe](##heading-touchscreen-support) gestures.

## License Note

All photo, video, and graphics materials used in the demo are created by the [author of this article](https://www.codeproject.com/Members/SAKryukov) and protected by the license referenced below.
