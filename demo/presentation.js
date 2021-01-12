"use strict";
const presentation = {
    images: [ // relative to presentation.html
        image("demo-resources/introduction.svg"),
        "demo-resources/insights.svg",
        "demo-resources/images.svg",
        "demo-resources/look-at-photo.svg",
        "demo-resources/2007-06-23.panorama.webp",
        "demo-resources/2010-03-20-118.webp",
        "demo-resources/2012-05-19.70.webp",
        "demo-resources/2019-05-18.088.webp",
        "demo-resources/look-at-animation.svg",
        image("demo-resources/2020-09-17.video.32.webp"),
        image("demo-resources/look-at-video.svg"),
        video("demo-resources/CapeCode.20151108.143402.webm", {
            title: "Cape Code, Provincetown, Blackwater Pond",
            poster: "demo-resources/2015-11-08-ProvinceTown-Blackwater-Pond-11.webp",
            start: false
        }),
     ],
     title: "Presentation Demo",
     hideHelpOnStart: false,
     colors: {
         background: "white",
         text: {
             background: "azure",
             foreground: "black",
             border: "cornflowerBlue",
         },
     },
     rtl: false,
};