# A Browserify Transform for Compile-time Jade

**Prejadeify** lets you use Jade templates with Browserify without the Jade runtime.

## Features

- No Jade runtime
- Returns plain html
- Prefix urls with CDN or other path (must use `staticUrl()` in code)

## Install

    npm install prejadeify

## Usage

    var template = require('./template.jade');
    document.getElementById('something').innerHTML = template;

## Setup

For Browserify bundle:

    bundler.transform(prejadeify);

With url prefix option:

    bundler.transform(prejadeify, {prefix: config.cdnUrl});

For command line Browserify (untested):

    browserify -t prejadeify app.js -o bundle.js
