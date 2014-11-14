var through = require('through');
var jade = require('jade');

module.exports = function prejadeify(file, options) {
  if (!/\.jade$/i.test(file)) {
    return through();
  }

  var data = '';

  function write(buf) {
    data += buf;
  }

  function end() {
    var _this = this;

    jade.render(data, {filename:file, staticUrl: _staticUrl(file, options.prefix)}, function(err, html) {
      if (err) {
        _this.emit('error', err);
        return;
      }

      html = 'module.exports = ' + JSON.stringify(html) + ';\n';

      _this.queue(html);
      _this.queue(null);
    });
  }

  return through(write, end);
};



/**
 * staticUrl function passed to jade templates
 *
 * @param {Object} file
 * @param {String} prefix   Prefix to prepend to urls
 * @return {String}
 * @api private
 */
function _staticUrl (file, prefix){
  return function (uri) {
    var path = require('path');
    var resolve = require('url').resolve;

    if (typeof prefix === "undefined") {
      throw new Error("staticUrl used but options.urlPrefix not defined");
    }

    // rewrite URLs
    if (_isData(uri)) return uri;
    if (_isAbsolute(uri)) return uri;
    if (_isTemplate(uri)) return uri;
    uri = resolve(path.relative(__dirname, file), uri); // uri = client/projects/images/default.png
    uri = resolve(prefix, uri); // uri = /assets/client/projects/images/default.png or cdn prefixed
    return uri;
  }
}

/**
 * Check if a URL is a data url.
 *
 * @param {String} url
 * @return {Boolean}
 * @api private
 */

 function _isData(url) {
  return 0 === url.indexOf('data:');
}

/**
 * Check if a URL is an absolute url.
 *
 * @param {String} url
 * @return {Boolean}
 * @api private
 */

function _isAbsolute(url) {
  return ~url.indexOf('://')
    || '/' === url[0];
}

/**
 * Check if a URL contains template symbols
 *
 * @param {String} url
 * @return {Boolean}
 * @api private
 */
function _isTemplate(url) {
  return ~url.indexOf('<%') && ~url.indexOf('%>');
}
