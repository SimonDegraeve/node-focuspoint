# node-focuspoint

[![Build Status](https://travis-ci.org/SimonDegraeve/node-focuspoint.svg?branch=master)](https://travis-ci.org/SimonDegraeve/node-focuspoint) [![Coverage Status](https://img.shields.io/coveralls/SimonDegraeve/node-focuspoint.svg)](https://coveralls.io/r/SimonDegraeve/node-focuspoint) [![Dependencies Status](https://david-dm.org/SimonDegraeve/node-focuspoint.png)](https://david-dm.org/SimonDegraeve/node-focuspoint) [![npm version](https://badge.fury.io/js/node-focuspoint.svg)](http://badge.fury.io/js/node-focuspoint)

> Resize and crop images without cutting out the image's subject.

This package is based on [`node-canvas`](https://github.com/Automattic/node-canvas) for drawing and [`pica`](https://github.com/nodeca/pica) for resizing. Unless previously installed you'll need [Cairo](http://cairographics.org/). For system-specific installation check the [node-canvas Wiki](https://github.com/LearnBoost/node-canvas/wiki/_pages).

## Usage
Install the module with: `npm install node-focuspoint`

### Using CLI
```sh
Usage: focuspoint [options] [file]

Examples:
  focuspoint -x 90 -y 30 -s 1024x768 -s 512x512 image.jpg    Create two images (1024x768 and 512x512) with focus at 90%x30%


Options:
  -s, --size           Set the output sizes, default use file size
  -x, --focus-x        Set horizontal coordinate of focus point (percentage)    [default: "50"]
  -y, --focus-y        Set vertical coordinate of focus point (percentage)    [default: "50"]
  -o, --directory      Set the output directory, default use file directory
  --prefix             Add prefix to output file name                         [default: ""]
  --suffix             Add suffix to output file name                         [default: "-[size]-focused"]
  -q, --quality        Set the quality [0..3]                                 [default: 3]
  -a, --alpha          Use alpha channel                                      [default: false]
  --unsharp-amount     Set the unsharp amount [0..500]                        [default: 0]
  --unsharp-threshold  Set the unsharp threshold [0..100]                     [default: 0]
  --quiet              Do not output to console                               [default: false]
  --help               Show help
  --version            Show version number

```

### Using API
```javascript
var focuspoint = require('node-focuspoint');

var imagePath = '/path/to/image.jpg'; // File to process
var sizes = ['1024x768', '512x512'];  // Set the output sizes, default use file size
var options = {
  directory: '/path/to/output',       // Set the output directory, default use file directory
  prefix: '',                         // Add prefix to output file name
  suffix: '-[size]-focused',          // Add suffix to output file name, [size] will be replaced by the output size (e.g. '1024x768' )
  focusX: 50,                         // Set horizontal coordinate of focus point (percentage)
  focusY: 50,                         // Set vertical coordinate of focus point (percentage)
  quality: 3,                         // Set the quality [0..3]
  alpha: false,                       // Use alpha channel
  unsharpAmount: 0,                   // Set the unsharp amount [0..500]
  unsharpThreshold: 0,                // Set the unsharp threshold [0..100]
  quiet: false                        //  Do not output to console
};

focuspoint(imagePath, sizes, options, function(error) {
  if (error) {
    throw error;
  }
  console.log('Success!');
});

```
## Examples
Using an [image](https://unsplash.com/photos/4mta-DkJUAg/) by Jonathan Velasquez from [Unsplash](https://unsplash.com/)

`focuspoint -x 64.583 -y 46.296 -s 1024x256 -s 512x512  -s 256x512 test.jpg `

Original

![Original](https://raw.github.com/SimonDegraeve/node-focuspoint/master/examples/test.jpg 'Original')

1024x256

![1024x256](https://raw.github.com/SimonDegraeve/node-focuspoint/master/examples/test-1024x256-focused.jpg '1024x256')

512x512

![512x512](https://raw.github.com/SimonDegraeve/node-focuspoint/master/examples/test-512x512-focused.jpg '512x512')

256x512

![256x512](https://raw.github.com/SimonDegraeve/node-focuspoint/master/examples/test-256x512-focused.jpg '256x512')

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/SimonDegraeve/node-focuspoint/issues).

## License MIT

The MIT License

Copyright 2014, Simon Degraeve

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
