"use strict";

const imageType = { image:0, html:1, video: 2, };
const presentationFrameIterator = selector => {
    const videoAutostart = -1;
    const fileNameSeparator = ":";
    const validOptionSeparator = ", ";
    const imageType = { image:0, html:1, video: 2, };
    const imageTypeNames = ["image", "html", "video"];
    const autoStartClass = "autostart";
    let permittedTypeNames = imageTypeNames.join(validOptionSeparator);
    permittedTypeNames += `${validOptionSeparator}${imageTypeNames[2]} ${autoStartClass}`;
    const wrongClassMessage = text => `Unknown image type: "${text}". Supported types: ${permittedTypeNames}.`;
    const invalidClassAttributeMessage = text => `Unknown class value: "${text}". Supported types: ${permittedTypeNames}.`;
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
                || (classes[1].toLowerCase() == imageTypeNames[imageType.video] && classes[0].toLowerCase() == autoStartClass))
                return videoAutostart; // autostart video
            else
                return invalidClassAttributeMessage(classAttributeValue);
        } else
            return invalidClassAttributeMessage(classAttributeValue);
    } //getImageType
    //
    const frames = [];
    const images = document.querySelectorAll(selector);
    for (let element of images) {
        if (element.innerHTML.trim().length < 1)
            return `Invalid empty text content of the element "${element.tagName.toLowerCase()}"`;
        const typeInfo = getImageType(element);
        if (typeInfo.constructor == String) // error
            return typeInfo;
        if (typeInfo == imageType.html) {
            frames.push({ type: typeInfo, html: element.innerHTML });
            continue;
        } //if html
        const files = element.textContent.split(fileNameSeparator);
        if (files.length < 1 || files[0].length < 1)
            return `Invalid list of file names in the text content "${element.textContent}" of the element "${element.tagName.toLowerCase()}": at least one file name should be provided`;
        if (typeInfo == videoAutostart || typeInfo == imageType.video) { // video, autostart or not
            if (files.length != 1 && files.length != 2)
                return `Invalid list of file names in the text content "${element.textContent}" of the element "${element.tagName.toLowerCase()}": exactly one video file should be specified, an optional second file is the image file uses as a poster`;
            const videoFrameInfo = { type: imageType.video, file: files[0].trim() };
            if (files.length == 2) videoFrameInfo.poster = files[1].trim();
            if (typeInfo == true)  videoFrameInfo.autostart = typeInfo == videoAutostart;
            frames.push(videoFrameInfo);
            continue;          
        } //if
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

const optionParser = selector => {
    const validOptionNames = ["hideHelpOnStart", "background", "rtl"];
    const messageValidOptionNames = validOptionNames.join(", ");
    const options = {};
    const select = document.querySelectorAll(selector);
    if (select.length > 1) return `Only one "body > select" element should be specified; it is used for the specification of the presentation options`;
    for (let option of select[0]) {
        let valid = false;
        for (let validOptionName of validOptionNames)
            if (validOptionName.toLowerCase() == option.textContent.toLowerCase()) {
                valid = true; break;
            } //lf
        if (!valid)
            return `Invalid option name: "${option.textContent}". Valid options: ${messageValidOptionNames}.`;
        options[option.textContent] = option.value;
    } //loop
    return options;
} //optionParser

window.onload = () => {

    const iterator = presentationFrameIterator("body > *:not(select)");
    const options = optionParser("body > select");
    if (iterator.constructor == String)
        return alert(iterator);
    if (options.constructor == String)
        return alert(options);
    for (let frame of iterator) {
        const frame1 = frame;
    } //loop

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