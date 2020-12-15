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
            if (typeInfo == videoAutostart)  videoFrameInfo.autostart = typeInfo == videoAutostart;
            if (element.title) videoFrameInfo.title = element.title;
            frames.push(videoFrameInfo);
            continue;          
        } //if
        for (let file of files)
            frames.push({ type: typeInfo, file: file.trim()});
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
} //optionParser

window.onload = () => {

    const frames = presentationFrameParser("body > *:not(select)");
    const options = optionParser("body > select");
    document.body.innerHTML = "";

    const savedStyle = {
        html: document.body.parentElement.style,
        body: document.body.style,
    }; //savedStyle
    
    const frameElements = (() => {
        const elements = {};
        for (let type in frameType) {
            elements[type] = document.createElement(frameTypeElement[type]);
            elements[type].style.display = "none";
            document.body.appendChild(elements[type]); 
        } //loop
        (() => { // help
            elements.help = document.createElement("section");
            elements.help.style.display = "none";
            elements.help.style.position = "absolute";
            elements.help.style.backgroundColor = "white";
            elements.help.style.padding = "1em";
            elements.help.style.border = "solid black thin";
            elements.help.style.left = "1em";
            elements.help.style.top = "0.4em";
            document.body.appendChild(elements.help); 
        })(); //help
        elements.videoSource = document.createElement("source");
        elements.video.appendChild(elements.videoSource);
        return elements;
    })();

    const show = (element, doShow) => element.style.display = doShow ? "block" : "none";
    const setVisibility = type => {
        for (let typeName in frameType)
            show(frameElements[typeName], type == frameType[typeName] ? true : false);
    } //setVisibility

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
                show(frameElements.help, helpActive);
            };
        })(); //toggleHelp
        const setupHelp = isRtl => {
            frameElements.help.innerHTML = "This is help (SA???)";
        }; //setupHelp
        return { showError: showError, toggleHelp: toggleHelp, setupHelp: setupHelp};
    })(); //textUtility

    if (frames.constructor == String)
        return textUtility.showError(frames);
    if (options.constructor == String)
        return textUtility.showError(options);
    textUtility.setupHelp(options.rtl);
    if (!options.hideHelpOnStart)
        textUtility.toggleHelp();
    document.body.style.backgroundColor = options.background;
    document.body.parentElement.style.backgroundColor = options.background;

    ////////////////////////////////////////////////////////////////////////////////////

    const toPixels = (size) => { return (size).toString() + "px"; };    

    function initializeViewer(image, video, videoSource, frames) {
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
        const move = backward => { //backward true <= backward, backward false => forward, else initialization
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
            let isVideo = item.type == frameType.video;
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
                frameElements.html.innerHTML = item.html;
            setVisibility(item.type);
        }; //move
        move();
        frameElements.image.onload = event => { resize(event.target); };
        window.onresize = () => resize(image);
        document.body.onclick = event =>  move(event.ctrlKey);
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
        addEventListener("touchstart", event => {
            touchStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
        }, false);
        addEventListener("touchend", event => { touchStart = undefined; }, false);
        addEventListener("touchmove", event => {
            if (touchStart == undefined) return;
            const vector = { x: event.changedTouches[0].clientX - touchStart.x, y: event.changedTouches[0].clientY - touchStart.y };
            const horizontal = Math.abs(vector.x) > Math.abs(vector.y);
            let back = horizontal ? vector.x > 0 : vector.y > 0;
            if (horizontal && options.rtl) back = !back;
            move(back);
            touchStart = undefined;
        }, false);
    }; //initializeViewer
    initializeViewer(frameElements.image, frameElements.video, frameElements.videoSource, frames);

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

}; //window.onload