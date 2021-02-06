/**
 * Stringify JSON, like JSON.stringify, but v8 optimized, with the
 * ability to escape characters that can trigger HTML sniffing.
 *
 * @param {*} value
 * @param {boolean} escape
 * @return {string}
 */
function stringify(value, escape) {
  let json = JSON.stringify(value);

  if (escape) {
    json = json.replace(/[<>&]/g, function(c) {
      switch (c.charCodeAt(0)) {
        case 0x3c:
          return '\\u003c';
        case 0x3e:
          return '\\u003e';
        case 0x26:
          return '\\u0026';
        default:
          return c;
      }
    });
  }
  return json;
}

module.exports = { stringify };
