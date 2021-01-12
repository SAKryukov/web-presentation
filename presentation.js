/*
    Web Presentation: a cross-platform replacement for all those office application packages in a single file :-)
    Original publication:
    https://www.codeproject.com/Articles/5290221/Web-Presentation-the-Other-Way-Around
    
    Copyright (c) Sergey A Kryukov, 2017, 2020-2021
    http://www.SAKryukov.org
    http://www.codeproject.com/Members/SAKryukov
    https://github.com/SAKryukov
*/

"use strict";

const definitionSet = {
    version: "4.2.0",
    productName: "Web Presentation",
    repository: "https://github.com/SAKryukov/web-presentation"
}; //definitionSet

const frameType = { image: 0, html: 1, video: 2, };
const frameTypeElement = { image: "img", html: "main", video: "video", help: "header", fakeContent: "i" };

const presentationFrameParser = selector => {
    const autoStartClass = "autostart";
    const videoAutostart = -1;
    const primaryFileNameSeparator = `"`;
    const secondaryFileNameSeparator = ":";
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
    const fileNameSplit = text => {
        text = text.trim();
        if (!text) return [];
        const result = [];
        const effectiveSeparator = text[0] == primaryFileNameSeparator ? primaryFileNameSeparator : secondaryFileNameSeparator;
        const aSplit = text.split(effectiveSeparator);
        for (let element of aSplit) {
            const aTrim = element.trim();
            if (aTrim) result.push(aTrim);
        } //loop
        return result;
    }; //fileNameSplit
    const frames = [];
    let frameElements = document.querySelectorAll(selector);
    if (frameElements.length < 1) { //the fake content
        const fakeElement = document.createElement(frameTypeElement.fakeContent);
        fakeElement.textContent = document.body.textContent;
        frameElements = [fakeElement];
    } //fake content
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
        let files = fileNameSplit(element.textContent);
        if (files.length < 1 || files[0].length < 1)
            return `Invalid list of file names in the text content "${element.textContent}" of the element "${element.tagName.toLowerCase()}": at least one file name should be provided`;
        if (typeInfo == videoAutostart || typeInfo == frameType.video) { // video, autostart or not
            if (files.length != 1 && files.length != 2)
                return `Invalid list of file names in the text content "${element.textContent}" of the element "${element.tagName.toLowerCase()}": exactly one video file should be specified, an optional second file is the image file uses as a poster`;
            const videoFrameInfo = { type: frameType.video, file: files[0] };
            if (files.length == 2) videoFrameInfo.poster = files[1];
            if (typeInfo == videoAutostart)  videoFrameInfo.autostart = typeInfo == videoAutostart;
            if (element.title) videoFrameInfo.title = element.title;
            frames.push(videoFrameInfo);
            continue;          
        } //if
        for (let file of files)
            frames.push({ type: typeInfo, file: file });
    } //loop
    return frames;
}; //presentationFrameParser

const optionParser = selector => {
    const getValue = stringValue => {
        if (stringValue.toLowerCase() == true.toString()) return true;
        else if (stringValue.toLowerCase() == false.toString()) return false;
        else return stringValue;
    }; //getValue
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
        options[option.textContent] = getValue(option.value);
    } //loop
    return options;
}; //optionParser

const getStyle = () => {
    return {
        html: document.body.parentElement.style,
        body: document.body.style
    }
}; // getStyle
const setStyle = style => {
    document.body.parentElement.style = style.html;
    document.body.style = style.body;    
}; //setStyle
const toPixels = (size) => { return (size).toString() + "px"; };
const findIndirectParent = (element, elementToFind) => {
    let current = element;
    while (current && current != document.body) {
        if (current == elementToFind) return elementToFind;
        current = current.parentElement;
    } //loop
    return null;
}; // findIndirectParent

const setPresentationStyle = (options) => {
    document.body.style.backgroundColor = options.background;
    document.body.style.touchAction = "none";
    document.body.style.userSelect = "none";
    document.body.style.padding = 0;
    document.body.style.margin = 0;
    document.body.style.height = "100%";
    document.body.parentElement.style.backgroundColor = options.background;
    document.body.parentElement.style.touchAction = "none";
    document.body.parentElement.style.userSelect = "none";
    document.body.parentElement.style.padding = 0;
    document.body.parentElement.style.margin = 0;
    document.body.parentElement.style.height = "100%";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.overflow = "hidden";    
}; //setPresentationStyle

function initializeViewer(image, video, videoSource, html, textUtility, userStyle, options, frames) {
    let current = 0;
    const resize = image => {
        const imageAspect = image.naturalWidth / image.naturalHeight;
        const windowAspect = window.innerWidth / window.innerHeight;
        if (imageAspect > windowAspect) {
            image.width = window.innerWidth;
            image.height = image.width / imageAspect;
            image.style.marginLeft = 0;
            image.style.marginTop = toPixels((window.innerHeight - image.height) / 2);
        } else {
            image.height = window.innerHeight;
            image.width = image.height * imageAspect;
            image.style.marginTop = 0;
            image.style.marginLeft = toPixels((window.innerWidth - image.width) / 2);
        } //if
    }; //resize
    let currentFrameElement = undefined;
    const move = backward => { //backward true <= previous frame, backward false => next frame, else initialization
        video.pause();
        document.exitFullscreen();
        videoSource.src = undefined;
        image.src = undefined;
        if (backward != undefined) {
            if (backward)
                if (current > 0) --current; else current = frames.length - 1;
            else
                if (current < frames.length - 1) ++current; else current = 0;
        } //if
        const item = frames[current];
        const isVideo = item.type == frameType.video;
        if (item.type == frameType.html)
            setStyle(userStyle)
        else
            setPresentationStyle(options);
        document.body.style.display = isVideo ? "flex" : "block";
        if (isVideo) {
            video.poster = item.poster;
            video.title = item.title;
            videoSource.src = item.file;
            video.onplay = event => event.target.requestFullscreen();
            video.onended = () => document.exitFullscreen();
            video.load();
            if (item.autostart)
                video.play();
        } else if (item.type == frameType.image) {
            image.src = item.file;
            resize(image);
        } else //html
            html.innerHTML = item.html;
        if (currentFrameElement) document.body.removeChild(currentFrameElement);
        currentFrameElement = isVideo ? video : (item.type == frameType.image ? image : html);
        document.body.insertBefore(currentFrameElement, document.body.firstElementChild);
    }; //move
    move();
    image.onload = event => { resize(event.target); };
    window.onresize = () => resize(image);
    window.onclick = event => {
        if (event.target.constructor != HTMLAnchorElement) {
            if (findIndirectParent(event.target, textUtility.helpElement) == textUtility.helpElement) {
                textUtility.toggleHelp();
                event.preventDefault();
            } else
                move(event.ctrlKey);
        } //if
    }; //window.onclick
    document.body.onkeydown = event => {
        switch (event.code) {
            case "Space":
            case "ArrowDown": move(false); break;
            case "Backspace":
            case "ArrowUp": move(true); break;
            case "ArrowRight": move(options.rtl); break;
            case "ArrowLeft": move(!options.rtl); break;
            case "F11": document.requestFullscreen(); event.preventDefault(); break;
            case "F1": textUtility.toggleHelp(); event.preventDefault(); break;
            case "KeyS": window.location = definitionSet.repository;
            case "KeyP": 
                if (videoSource.src)
                    if (video.paused) video.play(); else video.pause();
        }
    }; //document.body.onkeydown
    let touchStart = undefined;
    window.addEventListener("touchstart", event => {
        touchStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
    }, false);
    window.addEventListener("touchend", _ => { touchStart = undefined; }, false);
    window.addEventListener("touchmove", event => {
        if (touchStart == undefined) return;
        const vector = { x: event.changedTouches[0].clientX - touchStart.x, y: event.changedTouches[0].clientY - touchStart.y };
        const horizontal = Math.abs(vector.x) > Math.abs(vector.y);
        let back = horizontal ? vector.x > 0 : vector.y > 0;
        if (horizontal && options.rtl) back = !back;
        move(back);
        touchStart = undefined;
    }, false);
}; //initializeViewer

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

window.onload = () => {
  
    const userStyle = getStyle();

    const frames = presentationFrameParser("body > *:not(select)");
    const options = optionParser("body > select");
    document.body.innerHTML = "";

    const presentationElements = (() => {
        const elements = {};        
        for (let type in frameType) {
            elements[type] = document.createElement(frameTypeElement[type]);
            elements[type].style.touchAction = "none";
            elements[type].style.userSelect = "none";    
        } //loop
        (() => { // help
            elements.help = document.createElement(frameTypeElement.help);
            elements.help.style.display = "none";
            elements.help.style.position = "absolute";
            document.body.appendChild(elements.help); 
        })(); //help
        (() => { // video
            elements.video.style.height = "60%";
            elements.video.style.maxWidth = "90%";
            elements.video.style.padding = "0";
            elements.video.style.marginLeft = "auto";
            elements.video.style.marginRight = "auto";
            elements.video.disablePictureInPicture = true;
            elements.video.controls = true;
            elements.videoSource = document.createElement("source");
            elements.video.appendChild(elements.videoSource);
        })(); //video
        return elements;
    })(); //presentationElements

    const textUtility = (() => {
        const setErrorStyle = () => {
            const css = "color: black; background-color: white; padding: 1em; padding-top: 0.4em;"
                + "font-family: sans-serif; font-weight: normal; font-size: 120%";
            document.body.style.cssText = css;
            document.body.parentElement.style.cssText = css;
        }; //setErrorStyle
        const showError = text => {
            setErrorStyle();
            document.body.textContent = text;
        }; //showError
        const toggleHelp = (() => {
            let helpActive = false;
            return () => {
                helpActive = !helpActive;
                presentationElements.help.style.display = helpActive ? "block" : "none";
            };
        })(); //toggleHelp
        const borderColor = "CornflowerBlue";
        const setupHelp = isRtl => {
            presentationElements.help.style.border = `solid 1px ${borderColor}`;
            presentationElements.help.style.backgroundColor = "azure";
            presentationElements.help.style.padding = "0.6em 1.2em 0.6em 1.2em";
            presentationElements.help.style.left = "1.2em";
            presentationElements.help.style.top = "0.6em";
            const keyNext = isRtl ? "&rarr;" : "&larr;";
            const keyPrevious = isRtl ? "&larr;" : "&rarr;";
            presentationElements.help.innerHTML = 
                `<h3>${definitionSet.productName} v.&thinsp;${definitionSet.version}</h3>`
                + "<p>F1: Toggle help (click to hide)</p>"
                + "<p>F11: Toggle fullscreen (default for most browsers)</p>"
                + `<p>${keyNext} &darr; space, click: Next</p>`
                + `<p>${keyPrevious} &uarr; backspace, Ctrl+click: Previous</p>`
                + "<p>Touchscren swipe:</p>"
                + `<p>&emsp;&emsp;${keyPrevious} &uarr;: Next</p>`
                + `<p>&emsp;&emsp;${keyNext} &darr;: Previous</p>`
                + "<p>P: Toggle Play/Pause in video mode</p>"
                + `<p>S: <a href="${definitionSet.repository}">Source code repository at GitHub</a></p>`;
            }; //setupHelp
        const normalizeStyles = element => {
            element.style.cursor = "default";
            const isAnchor = element.constructor == HTMLAnchorElement;
            element.style.marginTop = 0;
            element.style.marginBottom = element.constructor == HTMLHeadingElement ? "0.4em" : 0;
            element.style.textAlign = "left";
            element.style.color = isAnchor ? "navy" : "black";
            element.style.fontFamily = "sans-serif";
            element.style.fontWeight = element.constructor == HTMLHeadingElement ? "bold" : "normal";
            element.style.fontStyle = "normal";
            element.style.fontVariant = "normal";
            element.style.fontSize = element.constructor == HTMLHeadingElement ? "120%" : "100%";
            element.style.textDecoration = isAnchor ? "underline" : "none";
        };
        const createCloseBox = (size, background, border, stroke) => {
            const ns = "http://www.w3.org/2000/svg";
            const createNS = (name) => document.createElementNS(ns, name);
            const svg = createNS("svg");
            svg.style.cssText = `background-color: ${background}; stroke: ${stroke}; stroke-width: 0.1;
                border-left: ${border} thin solid; border-bottom: ${border} thin solid; width: ${size}; position: absolute; top: 0; right: 0`;
            svg.setAttribute("viewBox", "0 0 1 1");
            svg.innerHTML = `<g><line x1="0.2" y1="0.2" x2="0.8" y2="0.8"/><line x1="0.2" y1="0.8" x2="0.8" y2="0.2"/></g>`;
            return svg;
        };
        setTimeout(() => {
            presentationElements.help.appendChild(createCloseBox(16, "yellow", borderColor, "red"));
            for (let element of presentationElements.help.children) {
                normalizeStyles(element);
                for (let child of element.children)
                    normalizeStyles(child);
            }                
        }); //child styles
        return { showError: showError, toggleHelp: toggleHelp, setupHelp: setupHelp, helpElement: presentationElements.help };
    })(); //textUtility

    if (frames.constructor == String)
        return textUtility.showError(frames);
    if (options.constructor == String)
        return textUtility.showError(options);
    textUtility.setupHelp(options.rtl);
    if (!options.hideHelpOnStart)
        textUtility.toggleHelp();

    initializeViewer(
        presentationElements.image, presentationElements.video, presentationElements.videoSource, presentationElements.html,
        textUtility, userStyle, options, frames);

}; //window.onload