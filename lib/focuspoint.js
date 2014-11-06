/*
 * node-focuspoint
 * https://github.com/SimonDegraeve/node-focuspoint
 *
 * Copyright 2014, Simon Degraeve
 * Licensed under the MIT license.
 */

'use strict';

// Dependencies
var fs = require('fs-extra');
var path =  require('path');
var async = require('async');
var mime = require('mime');
var Canvas = require('canvas');
var pica = require('pica');
var chalk = require('chalk');
var extend = require('util')._extend;
// jshint -W079:start
var Image = Canvas.Image;
// jshint -W079:end

module.exports = focuspoint;

function focuspoint(imagePath, sizes, options, callback) {
  // Start time counter
  var startTotalDate = new Date();

  // Set third argument as callback if function
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  callback = callback || function() {};

  // Handle file not Found
  if (!imagePath || !fs.existsSync(imagePath)) {
    callback('File not found (' + imagePath + ')');
    return;
  }

  // Handle invalid mimetype
  var mimetype = mime.lookup(imagePath);
  if (['image/jpeg', 'image/png'].indexOf(mimetype) === -1) {
    callback('File not supported (' + mimetype + ')');
    return;
  }

  // Set default options
  var defaults = {
    directory: path.dirname(imagePath),
    prefix: '',
    suffix: '-[size]-focused',
    focusX: 50,
    focusY: 50,
    quality: 3, // 0..3
    alpha: false,
    unsharpAmount: 0, // 0..500
    unsharpThreshold: 0, // 0..100,
    quiet: false
  };
  options = extend(defaults, options || {});

  // Create image
  var image = new Image();
  image.src = fs.readFileSync(imagePath);

  // Create canvas
  var canvas = new Canvas();
  var buffer = new Canvas();

  // Create output directory if not exists
  fs.ensureDirSync(options.directory);

  // Loop for each size
  sizes = sizes || [image.width + 'x' + image.height];
  async.eachSeries(sizes, function(size, done) {
    // Start time counter
    var startDate = new Date();

    // Create output file name
    var prefix = options.prefix.replace('[size]', size);
    var suffix = options.suffix.replace('[size]', size);
    var targetImagePath = renameFile(imagePath, options.directory, prefix, suffix);

    // Parse size
    var targetWidth = parseInt(size.split('x')[0], 10);
    var targetHeight = parseInt(size.split('x')[1], 10);

    // Upscale image if needed
    var scaledSize = getScaledSize(image.width, image.height, targetWidth, targetHeight);
    var width = scaledSize[0];
    var height = scaledSize[1];

    // Set ratio
    var widthRatio = width / targetWidth;
    var heightRatio = height / targetHeight;
    var ratio = 1;
    if (width > targetWidth && height > targetHeight) {
      ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
    }

    // Resize from canvas to buffer
    canvas.width = width;
    canvas.height = height;
    buffer.width = canvas.width / ratio;
    buffer.height = canvas.height / ratio;
    canvas.getContext('2d').drawImage(image, 0, 0, width, height);

    pica.resizeCanvas(canvas, buffer, {
      quality: options.quality,
      alpha: options.alpha,
      unsharpAmount: options.unsharpAmount,
      unsharpThreshold: options.unsharpThreshold
    }, function(error) {
      if (error) {
        done(error);
        return;
      }

      // Translate % focus to px
      var focusPxX = (buffer.width / 100) * boundPercentage(options.focusX);
      var focusPxY = (buffer.height / 100) * boundPercentage(options.focusY);

      // Default shift to max left
      var shiftX = 0;
      var shiftY = 0;

      // If cropped horizontal and focus is bigger than first half
      if (buffer.width - targetWidth !== 0 && focusPxX > targetWidth / 2) {
        // If focus is bigger than last half
        if (focusPxX > buffer.width - (targetWidth / 2)) {
          shiftX = -(buffer.width - targetWidth); // Shift to max right
        } else {
          shiftX = -(focusPxX - (targetWidth / 2)); // Shift to middle
        }
      }

      // If cropped vertical and focus is bigger than first half
      if (buffer.Height - targetHeight !== 0 && focusPxY > targetHeight / 2) {
        // If focus is bigger than last half
        if (focusPxY > buffer.height - (targetHeight / 2)) {
          shiftY = -(buffer.height - targetHeight); // Shift to max bottom
        } else {
          shiftY = -(focusPxY - (targetHeight / 2)); // Shift to middle
        }
      }

      // Crop
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      canvas.getContext('2d').drawImage(buffer, shiftX, shiftY, buffer.width, buffer.height);

      // Save to file
      var output = fs.createWriteStream(targetImagePath);
      var stream;
      if (mimetype === 'image/jpeg') {
        stream = canvas.createJPEGStream({
          bufsize: 4096,
          quality: 100,
          progressive: true
        });
      } else if (mimetype === 'image/png') {
        stream = canvas.createPNGStream();
      }

      stream.pipe(output)
        .on('error', function(error) {
          done(error);
          return;
        })
        .on('finish', function() {
          if (!options.quiet) {
            console.log('- %s in ' + chalk.magenta('%d ms'), size, new Date() - startDate);
          }
          done();
          return;
        });
    });
  }, function(error) {
    if (!options.quiet) {
      console.log(new Array(20).join('-'));
      console.log('Done in ' + chalk.magenta('%d ms'), new Date() - startTotalDate);
    }
    callback(error);
    return;
  });
}

function boundPercentage(percentage) {
  return Math.max(Math.min(percentage, 100), 0);
}

function renameFile(filePath, directory, prefix, suffix) {
  var extname = path.extname(filePath);
  var basename = path.basename(filePath, extname);
  basename = prefix + basename + suffix;
  return path.join(directory, basename + extname);
}

function getScaledSize(width, height, targetWidth, targetHeight) {
  var ratio = (width / height);
  if (width > height) {
    return [
      width > targetWidth ? width : width + (targetHeight - height) * ratio,
      height > targetHeight ? height : targetHeight
    ];
  } else {
    return [
      width > targetWidth ? width : targetWidth,
      height > targetHeight ? height : height + (targetWidth - width) / ratio
    ];
  }
}
