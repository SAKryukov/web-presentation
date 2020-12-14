"use strict";

const imageType = { image:0, html:1, video: 2, };
const presentationFrameIterator = selector => {
    const imageType = { image:0, html:1, video: 2, };
    const imageTypeNames = ["image", "html", "video"];
    const autoStartClass = "autostart";
    const permittedTypeNames = `"${imageTypeNames[0]}" (default), "${imageTypeNames[1]}", "${imageTypeNames[2]}", "${imageTypeNames[2]} ${autoStartClass}"`;
    const wrongClassMessage = text => `Unknown image type: "${text}". Supported types: ${permittedTypeNames}"`;
    const invalidClassAttributeMessage = text => `Unknown class value: "${text}". Supported types: ${permittedTypeNames}"`;
    const getImageType = element => {
        const classAttributeValue = element.getAttribute("class");
        if (!classAttributeValue)
            return imageType.image;
        const classes = element.classList;
        if (classes.length == 1) {
            let index = 0;
            for (let name of imageTypeNames) {
                if (name.toLowerCase() == classes[0].toLowerCase())
                    return index;
                ++index;
            } //loop
            return wrongClassMessage(classes[0]);
        } else if (classes.length == 2) {
            if ((classes[0].toLowerCase() == imageTypeNames[imageType.video] && classes[1].toLowerCase() == autoStartClass)
                || (classes[1].toLowerCase() == imageTypeNames[imageType.video] && classes[2].toLowerCase() == autoStartClass))
                return true; // autostart video
            else
                return invalidClassAttributeMessage(classAttributeValue);
        } else {
            return invalidClassAttributeMessage(classAttributeValue);
        }
    } //getImageType
    const getVideoFrame = (element, autostart) => {
        //get
    } //getVideoFrame
    //
    const frames = [];
    const images = document.querySelectorAll(selector);
    for (let element of images) {
        const typeInfo = getImageType(element);
        if (typeInfo.constructor == String) // error
            return alert(typeInfo);
        const files = element.textContent.split(":");
        if (typeInfo == true) { // video, autostart
            frames.push(getVideoFrame(element, true));
            break;
        }
        for (let file of files)
            frames.push({ type: typeInfo, file: file.trim()});
    } //loop
    let current = -1;
    const next = function() {
        ++current;
        return { done: current > frames.length - 1, value: frames[current] };
    }; //next
    return { next: next, [Symbol.iterator]: function() { return this; } };
}; //presentationFrameIterator

window.onload = () => {

    // const myIterator = (() => {
    //     const set = ["First", "Second", "Third", "Last"];
    //     let current = -1;
    //     const next = function() {
    //         ++current;
    //         return { done: current > set.length - 1, value: set[current] };
    //     };
    //     return { next: next, [Symbol.iterator]: function() { return this; } };
    // })();
    // for (let value of myIterator)
    //     alert(value);

    // const frameList = (() => {
    //     const result = [];
    //     const images = document.querySelectorAll("body > *:not(select)");
    //     for (let element of images) {
    //         const typeInfo = getImageType(element);
    //         if (typeInfo.constructor == String) // error
    //             return alert(typeInfo);
    //         const files = element.textContent.split(":");
    //         if (typeInfo == true) { // video, autostart
    //             result.push(getVideoFrame(element, true));
    //             break;
    //         }
    //         for (let file of files)
    //             result.push({ type: typeInfo, file: file.trim()});
    //     }
    //     return result;
    // })(); //parse 
    // if (frameList.constructor == String)
    //     return alert(frameList);

    const iterator = presentationFrameIterator("body > *:not(select)");
    if (iterator.constructor == String)
        return alert(iterator);
    for (let frame of iterator) {
        const frame1 = frame;
    }

    const savedStyle = {
        html: document.body.parentElement.style,
        body: document.body.style,
    };

    const toSaved = () => {
        document.body.parentElement.style = savedStyle.html;
        document.body.style = savedStyle.body;
    };
    const toPresentation = () => {
        document.body.parentElement.style.padding = "3em";
        document.body.parentElement.style.backgroundColor = "red";
        document.body.style.backgroundColor = "yellow";
        document.body.style.fontWeight = "normal";
    };

    window.onkeydown = event => {
        switch (event.code) {
            case "KeyA": toPresentation(); break;
            case "KeyS": toSaved();
        }
    }

}; //window.onload