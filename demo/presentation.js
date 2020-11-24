"use strict";
const presentation = {
    images: [ // relative to presentation.html
        image("demo/introduction.svg"),
        "demo/insights.svg",
        "demo/images.svg",
        "demo/look-at-photo.svg",
        "demo/2007-06-23.panorama.webp",
        "demo/2010-03-20-118.webp",
        "demo/2012-05-19.70.webp",
        "demo/2019-05-18.088.webp",
        "demo/look-at-animation.svg",
        "demo/2020-09-17.video.32.webp",
        image("demo/look-at-video.svg"),
        video("demo/CapeCode.20151108.143402.webm", {
            title: "Cape Code, Provincetown, Blackwater Pond",
            poster: "demo/2015-11-08-ProvinceTown-Blackwater-Pond-11.webp" 
        }),
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