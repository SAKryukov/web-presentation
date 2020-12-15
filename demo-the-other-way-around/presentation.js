"use strict";

const frameType = { image: 0, html: 1, video: 2, };
const frameTypeElement = { image: "img", html: "main", video: "video", };
const presentationFrameParser = selector => {
    const autoStartClass = "autostart";
    const videoAutostart = -1;
    const fileNameSeparator = ":";
    const validOptionSeparator = ", ";
    let frameTypeNames = [];
    for (let frameTypeName in frameType) frameTypeNames.push(frameTypeName);
    let permittedTypeNames = frameTypeNames.join(validOptionSeparator);
    permittedTypeNames += `${validOptionSeparator}${frameTypeNames[2]} ${autoStartClass}`;
    const wrongClassMessage = text => `Unknown frame type: "${text}". Supported types: ${permittedTypeNames}.`;
    const invalidClassAttributeMessage = text => `Unknown class value: "${text}". Supported types: ${permittedTypeNames}.`;
    const getFrameType = element => {
        const classAttributeValue = element.getAttribute("class");
        if (!classAttributeValue)
            return frameType.image;
        const classes = element.classList;
        if (classes.length == 1) {
            let index = 0;
            for (let name of frameTypeNames) {
                if (name.toLowerCase() == classes[0].toLowerCase())
                    return index;
                ++index;
            } //loop
            return wrongClassMessage(classes[0]);
        } else if (classes.length == 2) {
            if ((classes[0].toLowerCase() == frameTypeNames[frameType.video] && classes[1].toLowerCase() == autoStartClass)
                || (classes[1].toLowerCase() == frameTypeNames[frameType.video] && classes[0].toLowerCase() == autoStartClass))
                return videoAutostart; // autostart video
            else
                return invalidClassAttributeMessage(classAttributeValue);
        } else
            return invalidClassAttributeMessage(classAttributeValue);
    } //getFrameType
    // creating and returning frames:
    const frames = [];
    const frameElements = document.querySelectorAll(selector);
    for (let element of frameElements) {
        if (element.innerHTML.trim().length < 1)
            return `Invalid empty text content of the element "${element.tagName.toLowerCase()}"`;
        const typeInfo = getFrameType(element);
        if (typeInfo.constructor == String) // error
            return typeInfo;
        if (typeInfo == frameType.html) {
            frames.push({ type: typeInfo, html: element.innerHTML });
            continue;
        } //if html
        const files = element.textContent.split(fileNameSeparator);
        if (files.length < 1 || files[0].length < 1)
            return `Invalid list of file names in the text content "${element.textContent}" of the element "${element.tagName.toLowerCase()}": at least one file name should be provided`;
        if (typeInfo == videoAutostart || typeInfo == frameType.video) { // video, autostart or not
            if (files.length != 1 && files.length != 2)
                return `Invalid list of file names in the text content "${element.textContent}" of the element "${element.tagName.toLowerCase()}": exactly one video file should be specified, an optional second file is the image file uses as a poster`;
            const videoFrameInfo = { type: frameType.video, file: files[0].trim() };
            if (files.length == 2) videoFrameInfo.poster = files[1].trim();
            if (typeInfo == true)  videoFrameInfo.autostart = typeInfo == videoAutostart;
            frames.push(videoFrameInfo);
            continue;          
        } //if
        for (let file of files)
            frames.push({ type: typeInfo, file: file.trim()});
    } //loop
    return frames;
}; //presentationFrameParser

const optionParser = selector => {
    const optionDefaults = { hideHelpOnStart: false, rtl: false, background: "white" };
    let validOptionNames = [];
    for (let optionName in optionDefaults) validOptionNames.push(optionName);
    const messageValidOptionNames = validOptionNames.join(", ");
    const options = optionDefaults;
    const select = document.querySelectorAll(selector);
    if (select.length < 1) return options;
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

    const frames = presentationFrameParser("body > *:not(select)");
    const options = optionParser("body > select");
    document.body.innerHTML = "";
    if (frames.constructor == String)
        return alert(iterator);
    if (options.constructor == String)
        return alert(options);
    
    const frameElements = (() => {
        const elements = {};
        for (let type in frameType) {
            elements[type] = document.createElement(frameTypeElement[type]);
            elements[type].style.display = "none";
            document.body.appendChild(elements[type]); 
        } //loop
        return elements;
    })();

    const setVisibility = type => {
        let numericIndex = 0;
        for (let index in frameElements)
            frameElements[index].style.display = numericIndex++ == type ? "block" : "none";
    } //setVisibility

    for (let frame of frames) {
        const frame1 = frame;
        if (frame.type == frameType.html) {
            setVisibility(frameType.html);
            frameElements.html.innerHTML = frame.html;
        }
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