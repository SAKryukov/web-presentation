@numbering {
    enable: false
}

{title}Web Presentation, the Other Way Around

[*Sergey A Kryukov*](https://www.SAKryukov.org){.author}

Another variant of the cross-platform replacement for all those office presentation applications in a single file, and now this file is JavaScript

*???*

<!-- copy to CodeProject from here ------------------------------------------->

<ul class="download">
	<li><a href="Web-presentation.zip">Download source code file and demo &mdash; 11.7 MB</a></li>
	<li><a href="http://www.sakryukov.org/software/GitHub.live/web-presentation/demo">Live demo</a></li>
</ul>

(This demo uses one AV1 video, which is compatible with almost all browsers, but not Microsoft Edge)

![presentation.h](main2.jpg)

## Contents{no-toc}

@toc

## Why Another Variant?

This is a second article on the topic of Web Presentation in a single file:
- [Web Presentation, the Other Way Around](https://www.codeproject.com/Articles/5286790/Web-Presentation-an-Application-in-a-Single-File)
- This article

Initially, a CodeProject member [Helena Munzarova](https://www.codeproject.com/script/Membership/View.aspx?mid=11286055) suggested another a different approach to SA???, 

## Motivation

## Usage

### Simplest Presentation

Let's take a look at the presentaion sample "demo-the-other-way-around/minimal.html":

```{lang=HTML}
&lt;html&gt;
    &lt;head&gt;
        &lt;script src="../presentation.js"&gt;&lt;/script&gt;
        &lt;title&gt;Minimal Presentation Demo&lt;/title&gt;
    &lt;/head&gt;
&lt;body&gt;
    "../demo-resources/2007-06-23.panorama.webp"
    "../demo-resources/2019-05-18.088.webp"
    "../demo-resources/2020-09-17.video.32.webp"
&lt;/body&gt;
&lt;/html&gt;
```
SA???

### File Name Separators

The sample of the presentation shown above suggests that the image files should be entered enclosed in qouble quotation marks. They are also separated with blank space and text line separator, but these characters are simply ignored (it they are not the part of a file name) and are not required. Another allowed separator is colon `:`. Both separators can be used in the same file. The use of the separator is dictated by the following rules:

1. The text content is trimmed; if the trimmed string is empty, it is considered as an empty array of files.

1. If first character in the trimmed non-empty string is the primary separator `"`, this character is used as an effective separator, otherwise the effective separator is the secondary separator `:`.

1. The entire text string it splitted using the effective separator. Every fragment of the split is trimmed and ignored if empty, otherwise it is added to the list of the file names.

Naturally, both forms allow the file names with space characters inside. If a file name contains one of the separator characters, another one should can be used as a separator.

Recommendation: the best idea is avoiding the use of any separator characters in file names. I would even not recommend blank space characters in file names. Everything will work with this particular application, but with many pther applications, this is a source of invonveniences.

Perhaps I have to explain why the rules use two separators. First of all, in Windows, double quotation mark is not a valid character for file names, but colon is used in the special cases we all know. Using colon as a part of a file names makes little practical sense, but still, a user can enter such names using double quotation marks. These marks are also usually used to enter file names with some blank characters inside.

For [*NIX](https://en.wikipedia.org/wiki/Unix-like), including Linux, only null character and `/` are special; all other characters can be used. Nevertheless, different application may make it difficult to enter the names with colon or double quotation marks, as these characters are used for different special purposes, pretty much in the same way as in Windows. At the same time, colon is a usual "path separator" in *NIX configuration, shell, and other files.

The set of more than one file are used in two cases: to prescribe a list of image files in a single HTML node, or to specify a video file name with corresponding poster file name. The use of video will be explained below, a

### Presentation with Frames of Different types

The...
SA???

### Video Options

SA???

### Presentation Options

SA???

## Implementation Detail

Major part of the implementation is built in a way, very similar to that of "presentation.html". The move between the presentation frames is a bit different, because of the user-defined HTML framt option and the need to [preserve styles](##heading-preserving-styles).

And, naturally, the method of collection of the user-defined presentation data is different. Let's see.

### Collecting Presentation Data

### Presentation Data Validation

### Preserving Styles

As I expected, the most serious problem in this approach is rooted in the fact that the user, a presentation creator, can use HTML frames and can introduce any stylesheet. Before I introduce this option???

Hiding elements needed for the application frames requires the use of the style property `display` with the value `none`. When the element has to be shown, what value of the `display` property should be assigned. Before I introduced the HTML frame feature, it always was `block`, quite suitable for both `<img>` and `<video>` elements. For arbitrary HTML content, it makes no sense, because the user can use any other `display` value for the top HTML element used for the presentation frame. For example, for the layouts specific for presentations, `flex` is particularly useful. Of course, the initial style of this element can be detected on the `load` of the `window` content, but this is not a reasonable complication. Instead, now the frame element is inserted into the list of `body` children and removed when it is no longer needed.

SA???

It is inserted and not appended by the following reason: another `body` child is the element showing help items. This element has `position: absolute`, and it can clash with any other `absolute`-positioned element introduced by the user.

In principle, the user can devise some stylesheet that can break styling required for the presentation of other types of presentation frames. To prevent it, the critically important styles for `document.body` and the help element are preserved. For `document.body`, they are restored every time new presentation frame is displayed.

### Releases

#### 4.0.0

December 16, 2020

This is the first version following v.&thinsp;3.0.0 and the first version with "presentation.js", "the other way around".

## License Note

All photo, video, and graphics materials used in the demo are created by the [author of this article](https://www.codeproject.com/Members/SAKryukov) and protected by the license referenced below.
