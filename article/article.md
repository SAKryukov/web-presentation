@numbering {
    enable: false
}

{title}A a cross-platform replacement for all those office presentation applications in a single file

[*Sergey A Kryukov*](https://www.SAKryukov.org){.author}

*Who needs presentations created with boring bulky office presentation packages not always available for all systems? All you need is a Web browser and a set of vector/pixel images. With a solution in just one HTML/CSS/JavaScript file you have all all the features people use in presentations.*

<!-- copy to CodeProject from here ------------------------------------------->

## Contents{no-toc}

@toc

## Introduction

## Usage

### Presentation Data

In addition to image files, the presentation needs to be described. First of all, it needs a list of relative paths to image file, to define both image data and the order of images in the presentation. All other options can be omitted, then the default settings are used. For example, let's assume we put it in a file "demo/presentation.js", path is relative to "presentation.html":

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

This presentation can be loaded in a Web page by using the path to the presentation file in a query string of the URL. The easiest way to do it is havin a separate presentation-specific HTML file. Let's assume this is the file "demo/index.html", then it content could be:

```{lang=HTML}{#presentation-index-sample}
&lt;!doctype HTML&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta http-equiv="refresh" content="0; url=
        ../presentation.html?demo/presentation.js" /&gt;
    &lt;/head&gt;
&lt;/html&gt;
```

### Presentation Options

All paths are relative to "presentation.html".

`presentation.images`: an array of image file names, paths are relative to "presentation.html".

Optional Options:

`title`: presentation title

`hideHelpOnStart`: boolean (true/false), default: `false`, that is, by default help text is shown on started

`colors`: colors for the presentation backround and rendering of text data

`colors.background`: presentation background. It is also applied as a background for all images supporting transparency of alpha channel.

`colors.text`: colors for the rendering of text data, an object with three self-explained properties.

`rtl`: the option for [right-to-left cultures](https://en.wikipedia.org/wiki/Right-to-left), explained in detail [below](#heading-rtl-support), default: `false`.

### Image File Types

For the presentation frames, all MIME types standardized for Web are acceptable. For vector graphics this is [SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics), image/svg+xml. For raster graphics and acceptable types are: image/apng, image/avif, image/gif, image/jpeg, image/png and image/webp.

Image file types accepted by specific browser but not standardized for Web, such as .bmp, .ico or .tif, should be best avoided.

For raster images, most practical and recommended format is [WebP](https://en.wikipedia.org/wiki/WebP). It provides much better compression than older image types, supports progressive rendering, separate presets optimized for Picture, Icon, Photo, Drawing and Text, and animation. Other types supporting animation for raster graphics are [APNG](https://en.wikipedia.org/wiki/APNG), [AVIF](https://en.wikipedia.org/wiki/AV1#AV1_Image_File_Format_(AVIF)), and [GIF](https://en.wikipedia.org/wiki/GIF).

However, for presentation purposes the most important type of animation is vector, SVG, because people widely use various transition effects. Even though such effects more distract from the presentation than help to understand the material, they are considered as a must.

## Animation

???

## Implementation Detail

The implementation is trivial enough to get into detail too much. The purpose of this article is to provide a comprehensive working tool for presentations, not so much to teach anything. If this work can teach something, it's the taste for minimalism and sober practical look at all those commercial bloated products.

So, I'll touch only few not so obvious aspects.

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
This behavior also depends on the `presentation.rtl` option explained below.

### RTL Support

Written writing cultures based on [right-to-left](https://en.wikipedia.org/wiki/Right-to-left) system also slightly modify the views of people. This cultural element can affect the way some people look at the [arrow of time](https://en.wikipedia.org/wiki/Arrow_of_time): while in Western cultures people imagine time as something floating from left to right, other people may think otherwise. In this case it can be more natural to view the flow of the presentation as somethin moving from right to left. For such people, `rtl` option is provided. It only changes the use of left/right arrows and left/right swipe with a touchscreen: the direction changed to is opposite. It has nothing to do with [CSS direction](https://developer.mozilla.org/en-US/docs/Web/CSS/direction), but is based on similar considerations.

Effectively, it only affects how people treat arrow keys "&larr;" and "&rarr;" and the direction of the touchscreen swipe. In Western cultures it is implied that "&larr;" means "previous" and "&rarr;" means "next", a person performing these operation imagines a current frame as a window, showing a strip of frames, representing the timeline. For touch screen swipe, a person "moves" not a window, but a strip of frames itself, so "&larr;" means "next" and "&rarr;" means "previous". In RTL cultures, all four operations come in opposite directions. At the same time, the meaning of up and down directions don't depend on the culture.

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
In a similar way, the direction in reverse is used for horizontal directions only in the implementation of the [touchscreen swipe](##heading-touchscreen-support) gestures.

### Error Handling

## Lisence Note

All photo, video and graphics materials used in the demo are created by the author of this article and protected by the license referenced below.
