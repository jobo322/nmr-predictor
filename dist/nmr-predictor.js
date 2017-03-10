(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["nmrPredictor"] = factory();
	else
		root["nmrPredictor"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 70);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(29);
var abstractMatrix = __webpack_require__(9);
var util = __webpack_require__(2);

class Matrix extends abstractMatrix(Array) {
    constructor(nRows, nColumns) {
        var i;
        if (arguments.length === 1 && typeof nRows === 'number') {
            return new Array(nRows);
        }
        if (Matrix.isMatrix(nRows)) {
            return nRows.clone();
        } else if (Number.isInteger(nRows) && nRows > 0) { // Create an empty matrix
            super(nRows);
            if (Number.isInteger(nColumns) && nColumns > 0) {
                for (i = 0; i < nRows; i++) {
                    this[i] = new Array(nColumns);
                }
            } else {
                throw new TypeError('nColumns must be a positive integer');
            }
        } else if (Array.isArray(nRows)) { // Copy the values from the 2D array
            const matrix = nRows;
            nRows = matrix.length;
            nColumns = matrix[0].length;
            if (typeof nColumns !== 'number' || nColumns === 0) {
                throw new TypeError('Data must be a 2D array with at least one element');
            }
            super(nRows);
            for (i = 0; i < nRows; i++) {
                if (matrix[i].length !== nColumns) {
                    throw new RangeError('Inconsistent array dimensions');
                }
                this[i] = [].concat(matrix[i]);
            }
        } else {
            throw new TypeError('First argument must be a positive number or an array');
        }
        this.rows = nRows;
        this.columns = nColumns;
        return this;
    }

    set(rowIndex, columnIndex, value) {
        this[rowIndex][columnIndex] = value;
        return this;
    }

    get(rowIndex, columnIndex) {
        return this[rowIndex][columnIndex];
    }

    /**
     * Creates an exact and independent copy of the matrix
     * @return {Matrix}
     */
    clone() {
        var newMatrix = new this.constructor[Symbol.species](this.rows, this.columns);
        for (var row = 0; row < this.rows; row++) {
            for (var column = 0; column < this.columns; column++) {
                newMatrix.set(row, column, this.get(row, column));
            }
        }
        return newMatrix;
    }

    /**
     * Removes a row from the given index
     * @param {number} index - Row index
     * @return {Matrix} this
     */
    removeRow(index) {
        util.checkRowIndex(this, index);
        if (this.rows === 1) {
            throw new RangeError('A matrix cannot have less than one row');
        }
        this.splice(index, 1);
        this.rows -= 1;
        return this;
    }

    /**
     * Adds a row at the given index
     * @param {number} [index = this.rows] - Row index
     * @param {Array|Matrix} array - Array or vector
     * @return {Matrix} this
     */
    addRow(index, array) {
        if (array === undefined) {
            array = index;
            index = this.rows;
        }
        util.checkRowIndex(this, index, true);
        array = util.checkRowVector(this, array, true);
        this.splice(index, 0, array);
        this.rows += 1;
        return this;
    }

    /**
     * Removes a column from the given index
     * @param {number} index - Column index
     * @return {Matrix} this
     */
    removeColumn(index) {
        util.checkColumnIndex(this, index);
        if (this.columns === 1) {
            throw new RangeError('A matrix cannot have less than one column');
        }
        for (var i = 0; i < this.rows; i++) {
            this[i].splice(index, 1);
        }
        this.columns -= 1;
        return this;
    }

    /**
     * Adds a column at the given index
     * @param {number} [index = this.columns] - Column index
     * @param {Array|Matrix} array - Array or vector
     * @return {Matrix} this
     */
    addColumn(index, array) {
        if (typeof array === 'undefined') {
            array = index;
            index = this.columns;
        }
        util.checkColumnIndex(this, index, true);
        array = util.checkColumnVector(this, array);
        for (var i = 0; i < this.rows; i++) {
            this[i].splice(index, 0, array[i]);
        }
        this.columns += 1;
        return this;
    }
}

exports.Matrix = Matrix;
Matrix.abstractMatrix = abstractMatrix;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var abstractMatrix = __webpack_require__(9);
var Matrix = __webpack_require__(0);

class BaseView extends abstractMatrix() {
    constructor(matrix, rows, columns) {
        super();
        this.matrix = matrix;
        this.rows = rows;
        this.columns = columns;
    }

    static get [Symbol.species]() {
        return Matrix.Matrix;
    }
}

module.exports = BaseView;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0);

/**
 * @private
 * Check that a row index is not out of bounds
 * @param {Matrix} matrix
 * @param {number} index
 * @param {boolean} [outer]
 */
exports.checkRowIndex = function checkRowIndex(matrix, index, outer) {
    var max = outer ? matrix.rows : matrix.rows - 1;
    if (index < 0 || index > max) {
        throw new RangeError('Row index out of range');
    }
};

/**
 * @private
 * Check that a column index is not out of bounds
 * @param {Matrix} matrix
 * @param {number} index
 * @param {boolean} [outer]
 */
exports.checkColumnIndex = function checkColumnIndex(matrix, index, outer) {
    var max = outer ? matrix.columns : matrix.columns - 1;
    if (index < 0 || index > max) {
        throw new RangeError('Column index out of range');
    }
};

/**
 * @private
 * Check that the provided vector is an array with the right length
 * @param {Matrix} matrix
 * @param {Array|Matrix} vector
 * @return {Array}
 * @throws {RangeError}
 */
exports.checkRowVector = function checkRowVector(matrix, vector) {
    if (vector.to1DArray) {
        vector = vector.to1DArray();
    }
    if (vector.length !== matrix.columns) {
        throw new RangeError('vector size must be the same as the number of columns');
    }
    return vector;
};

/**
 * @private
 * Check that the provided vector is an array with the right length
 * @param {Matrix} matrix
 * @param {Array|Matrix} vector
 * @return {Array}
 * @throws {RangeError}
 */
exports.checkColumnVector = function checkColumnVector(matrix, vector) {
    if (vector.to1DArray) {
        vector = vector.to1DArray();
    }
    if (vector.length !== matrix.rows) {
        throw new RangeError('vector size must be the same as the number of rows');
    }
    return vector;
};

exports.checkIndices = function checkIndices(matrix, rowIndices, columnIndices) {
    var rowOut = rowIndices.some(r => {
        return r < 0 || r >= matrix.rows;

    });

    var columnOut = columnIndices.some(c => {
        return c < 0 || c >= matrix.columns;
    });

    if (rowOut || columnOut) {
        throw new RangeError('Indices are out of range');
    }

    if (typeof rowIndices !== 'object' || typeof columnIndices !== 'object') {
        throw new TypeError('Unexpected type for row/column indices');
    }
    if (!Array.isArray(rowIndices)) rowIndices = Array.from(rowIndices);
    if (!Array.isArray(columnIndices)) rowIndices = Array.from(columnIndices);

    return {
        row: rowIndices,
        column: columnIndices
    };
};

exports.checkRange = function checkRange(matrix, startRow, endRow, startColumn, endColumn) {
    if (arguments.length !== 5) throw new TypeError('Invalid argument type');
    var notAllNumbers = Array.from(arguments).slice(1).some(function (arg) {
        return typeof arg !== 'number';
    });
    if (notAllNumbers) throw new TypeError('Invalid argument type');
    if (startRow > endRow || startColumn > endColumn || startRow < 0 || startRow >= matrix.rows || endRow < 0 || endRow >= matrix.rows || startColumn < 0 || startColumn >= matrix.columns || endColumn < 0 || endColumn >= matrix.columns) {
        throw new RangeError('Submatrix indices are out of range');
    }
};

exports.getRange = function getRange(from, to) {
    var arr = new Array(to - from + 1);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = from + i;
    }
    return arr;
};

exports.sumByRow = function sumByRow(matrix) {
    var sum = Matrix.Matrix.zeros(matrix.rows, 1);
    for (var i = 0; i < matrix.rows; ++i) {
        for (var j = 0; j < matrix.columns; ++j) {
            sum.set(i, 0, sum.get(i, 0) + matrix.get(i, j));
        }
    }
    return sum;
};

exports.sumByColumn = function sumByColumn(matrix) {
    var sum = Matrix.Matrix.zeros(1, matrix.columns);
    for (var i = 0; i < matrix.rows; ++i) {
        for (var j = 0; j < matrix.columns; ++j) {
            sum.set(0, j, sum.get(0, j) + matrix.get(i, j));
        }
    }
    return sum;
};

exports.sumAll = function sumAll(matrix) {
    var v = 0;
    for (var i = 0; i < matrix.rows; i++) {
        for (var j = 0; j < matrix.columns; j++) {
            v += matrix.get(i, j);
        }
    }
    return v;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(14),
    Molecule = _require.Molecule;

var defaultOptions = {
    atomLabel: 'H',
    ignoreLabile: true,
    use: 'median'
};

module.exports = function options(molecule, options) {
    if (typeof molecule === 'string') {
        molecule = Molecule.fromMolfile(molecule);
    } else if (!(molecule instanceof Molecule)) {
        throw new Error('molecule must be a molfile string or Molecule instance');
    }
    molecule.addImplicitHydrogens();
    options = Object.assign({}, defaultOptions, options);
    return [molecule, options];
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.hypotenuse = function hypotenuse(a, b) {
    var r;
    if (Math.abs(a) > Math.abs(b)) {
        r = b / a;
        return Math.abs(a) * Math.sqrt(1 + r * r);
    }
    if (b !== 0) {
        r = a / b;
        return Math.abs(b) * Math.sqrt(1 + r * r);
    }
    return 0;
};

// For use in the decomposition algorithms. With big matrices, access time is
// too long on elements from array subclass
// todo check when it is fixed in v8
// http://jsperf.com/access-and-write-array-subclass
exports.getEmpty2DArray = function (rows, columns) {
    var array = new Array(rows);
    for (var i = 0; i < rows; i++) {
        array[i] = new Array(columns);
    }
    return array;
};

exports.getFilled2DArray = function (rows, columns, value) {
    var array = new Array(rows);
    for (var i = 0; i < rows; i++) {
        array[i] = new Array(columns);
        for (var j = 0; j < columns; j++) {
            array[i][j] = value;
        }
    }
    return array;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(0).Matrix;
module.exports.Decompositions = module.exports.DC = __webpack_require__(28);


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null !== obj && 'object' === typeof obj;
}

module.exports = isObject;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  console.warn("Using browser-only version of superagent in non-browser environment");
  root = this;
}

var Emitter = __webpack_require__(19);
var RequestBase = __webpack_require__(65);
var isObject = __webpack_require__(6);
var isFunction = __webpack_require__(64);
var ResponseBase = __webpack_require__(66);
var shouldRetry = __webpack_require__(67);

/**
 * Noop.
 */

function noop(){};

/**
 * Expose `request`.
 */

var request = exports = module.exports = function(method, url) {
  // callback
  if ('function' == typeof url) {
    return new exports.Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new exports.Request('GET', method);
  }

  return new exports.Request(method, url);
}

exports.Request = Request;

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  throw Error("Browser-only verison of superagent could not find XHR");
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pushEncodedKeyValuePair(pairs, key, obj[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (val != null) {
    if (Array.isArray(val)) {
      val.forEach(function(v) {
        pushEncodedKeyValuePair(pairs, key, v);
      });
    } else if (isObject(val)) {
      for(var subkey in val) {
        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
      }
    } else {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(val));
    }
  } else if (val === null) {
    pairs.push(encodeURIComponent(key));
  }
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos == -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] =
        decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  return /[\/+]json\b/.test(mime);
}

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req) {
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  var status = this.xhr.status;
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
      status = 204;
  }
  this._setStatusProperties(status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);

  if (null === this.text && req._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method != 'HEAD'
      ? this._parseBody(this.text ? this.text : this.xhr.response)
      : null;
  }
}

ResponseBase(Response.prototype);

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function(str){
  var parse = request.parse[this.type];
  if(this.req._parser) {
    return this.req._parser(this, str);
  }
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      if (self.xhr) {
        // ie9 doesn't have 'response' property
        err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
        // issue #876: return the http status code if the response parsing fails
        err.status = self.xhr.status ? self.xhr.status : null;
        err.statusCode = err.status; // backwards-compat only
      } else {
        err.rawResponse = null;
        err.status = null;
      }

      return self.callback(err);
    }

    self.emit('response', res);

    var new_err;
    try {
      if (!self._isResponseOK(res)) {
        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
        new_err.original = err;
        new_err.response = res;
        new_err.status = res.status;
      }
    } catch(e) {
      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_err) {
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `RequestBase`.
 */

Emitter(Request.prototype);
RequestBase(Request.prototype);

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} [pass] optional in case of using 'bearer' as type
 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass, options){
  if (typeof pass === 'object' && pass !== null) { // pass is optional and can substitute for options
    options = pass;
  }
  if (!options) {
    options = {
      type: 'function' === typeof btoa ? 'basic' : 'auto',
    }
  }

  switch (options.type) {
    case 'basic':
      this.set('Authorization', 'Basic ' + btoa(user + ':' + pass));
    break;

    case 'auto':
      this.username = user;
      this.password = pass;
    break;
      
    case 'bearer': // usage would be .auth(accessToken, { type: 'bearer' })
      this.set('Authorization', 'Bearer ' + user);
    break;  
  }
  return this;
};

/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, options){
  if (file) {
    if (this._data) {
      throw Error("superagent can't mix .send() and .attach()");
    }

    this._getFormData().append(field, file, options || file.name);
  }
  return this;
};

Request.prototype._getFormData = function(){
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  // console.log(this._retries, this._maxRetries)
  if (this._maxRetries && this._retries++ < this._maxRetries && shouldRetry(err, res)) {
    return this._retry();
  }

  var fn = this._callback;
  this.clearTimeout();

  if (err) {
    if (this._maxRetries) err.retries = this._retries - 1;
    this.emit('error', err);
  }

  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

// This only warns, because the request is still likely to work
Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function(){
  console.warn("This is not supported in browser version of superagent");
  return this;
};

// This throws, because it can't send/receive data as expected
Request.prototype.pipe = Request.prototype.write = function(){
  throw Error("Streaming is not supported in browser version of superagent");
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */

Request.prototype._appendQueryString = function(){
  var query = this._query.join('&');
  if (query) {
    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
  }

  if (this._sort) {
    var index = this.url.indexOf('?');
    if (index >= 0) {
      var queryArr = this.url.substring(index + 1).split('&');
      if (isFunction(this._sort)) {
        queryArr.sort(this._sort);
      } else {
        queryArr.sort();
      }
      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
    }
  }
};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
Request.prototype._isHost = function _isHost(obj) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
}

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  if (this._endCalled) {
    console.warn("Warning: .end() was called twice. This is not supported in superagent");
  }
  this._endCalled = true;

  // store callback
  this._callback = fn || noop;

  // querystring
  this._appendQueryString();

  return this._end();
};

Request.prototype._end = function() {
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var data = this._formData || this._data;

  this._setTimeouts();

  // state change
  xhr.onreadystatechange = function(){
    var readyState = xhr.readyState;
    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }
    if (4 != readyState) {
      return;
    }

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = direction;
    self.emit('progress', e);
  }
  if (this.hasListeners('progress')) {
    try {
      xhr.onprogress = handleProgress.bind(null, 'download');
      if (xhr.upload) {
        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
      }
    } catch(e) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  // initiate request
  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) {
      serialize = request.serialize['application/json'];
    }
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = function(url, data, fn){
  var req = request('OPTIONS', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, data, fn){
  var req = request('DELETE', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function group(prediction, options) {
    if (options.group) {
        prediction.sort((a, b) => {
            if (a.diaIDs[0] < b.diaIDs[0]) return -1;
            if (a.diaIDs[0] > b.diaIDs[0]) return 1;
            return 0;
        });
        for (var i = prediction.length - 2; i >= 0; i--) {
            if (prediction[i].diaIDs[0] === prediction[i + 1].diaIDs[0]) {
                prediction[i].integral += prediction[i + 1].integral;
                prediction[i].atomIDs = prediction[i].atomIDs.concat(prediction[i + 1].atomIDs);
                prediction.splice(i + 1, 1);
            }
        }
    }
    return prediction;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = abstractMatrix;

var LuDecomposition = __webpack_require__(10);
var SvDecomposition = __webpack_require__(11);
var arrayUtils = __webpack_require__(22);
var util = __webpack_require__(2);
var MatrixTransposeView = __webpack_require__(36);
var MatrixRowView = __webpack_require__(33);
var MatrixSubView = __webpack_require__(35);
var MatrixSelectionView = __webpack_require__(34);
var MatrixColumnView = __webpack_require__(30);
var MatrixFlipRowView = __webpack_require__(32);
var MatrixFlipColumnView = __webpack_require__(31);

function abstractMatrix(superCtor) {
    if (superCtor === undefined) superCtor = Object;

    /**
     * Real matrix
     * @class Matrix
     * @param {number|Array|Matrix} nRows - Number of rows of the new matrix,
     * 2D array containing the data or Matrix instance to clone
     * @param {number} [nColumns] - Number of columns of the new matrix
     */
    class Matrix extends superCtor {
        static get [Symbol.species]() {
            return this;
        }

        /**
         * Constructs a Matrix with the chosen dimensions from a 1D array
         * @param {number} newRows - Number of rows
         * @param {number} newColumns - Number of columns
         * @param {Array} newData - A 1D array containing data for the matrix
         * @return {Matrix} - The new matrix
         */
        static from1DArray(newRows, newColumns, newData) {
            var length = newRows * newColumns;
            if (length !== newData.length) {
                throw new RangeError('Data length does not match given dimensions');
            }
            var newMatrix = new this(newRows, newColumns);
            for (var row = 0; row < newRows; row++) {
                for (var column = 0; column < newColumns; column++) {
                    newMatrix.set(row, column, newData[row * newColumns + column]);
                }
            }
            return newMatrix;
        }

        /**
         * Creates a row vector, a matrix with only one row.
         * @param {Array} newData - A 1D array containing data for the vector
         * @return {Matrix} - The new matrix
         */
        static rowVector(newData) {
            var vector = new this(1, newData.length);
            for (var i = 0; i < newData.length; i++) {
                vector.set(0, i, newData[i]);
            }
            return vector;
        }

        /**
         * Creates a column vector, a matrix with only one column.
         * @param {Array} newData - A 1D array containing data for the vector
         * @return {Matrix} - The new matrix
         */
        static columnVector(newData) {
            var vector = new this(newData.length, 1);
            for (var i = 0; i < newData.length; i++) {
                vector.set(i, 0, newData[i]);
            }
            return vector;
        }

        /**
         * Creates an empty matrix with the given dimensions. Values will be undefined. Same as using new Matrix(rows, columns).
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @return {Matrix} - The new matrix
         */
        static empty(rows, columns) {
            return new this(rows, columns);
        }

        /**
         * Creates a matrix with the given dimensions. Values will be set to zero.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @return {Matrix} - The new matrix
         */
        static zeros(rows, columns) {
            return this.empty(rows, columns).fill(0);
        }

        /**
         * Creates a matrix with the given dimensions. Values will be set to one.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @return {Matrix} - The new matrix
         */
        static ones(rows, columns) {
            return this.empty(rows, columns).fill(1);
        }

        /**
         * Creates a matrix with the given dimensions. Values will be randomly set.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @param {function} [rng=Math.random] - Random number generator
         * @return {Matrix} The new matrix
         */
        static rand(rows, columns, rng) {
            if (rng === undefined) rng = Math.random;
            var matrix = this.empty(rows, columns);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    matrix.set(i, j, rng());
                }
            }
            return matrix;
        }

        /**
         * Creates a matrix with the given dimensions. Values will be random integers.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @param {number} [maxValue=1000] - Maximum value
         * @param {function} [rng=Math.random] - Random number generator
         * @return {Matrix} The new matrix
         */
        static randInt(rows, columns, maxValue, rng) {
            if (maxValue === undefined) maxValue = 1000;
            if (rng === undefined) rng = Math.random;
            var matrix = this.empty(rows, columns);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    var value = Math.floor(rng() * maxValue);
                    matrix.set(i, j, value);
                }
            }
            return matrix;
        }

        /**
         * Creates an identity matrix with the given dimension. Values of the diagonal will be 1 and others will be 0.
         * @param {number} rows - Number of rows
         * @param {number} [columns=rows] - Number of columns
         * @param {number} [value=1] - Value to fill the diagonal with
         * @return {Matrix} - The new identity matrix
         */
        static eye(rows, columns, value) {
            if (columns === undefined) columns = rows;
            if (value === undefined) value = 1;
            var min = Math.min(rows, columns);
            var matrix = this.zeros(rows, columns);
            for (var i = 0; i < min; i++) {
                matrix.set(i, i, value);
            }
            return matrix;
        }

        /**
         * Creates a diagonal matrix based on the given array.
         * @param {Array} data - Array containing the data for the diagonal
         * @param {number} [rows] - Number of rows (Default: data.length)
         * @param {number} [columns] - Number of columns (Default: rows)
         * @return {Matrix} - The new diagonal matrix
         */
        static diag(data, rows, columns) {
            var l = data.length;
            if (rows === undefined) rows = l;
            if (columns === undefined) columns = rows;
            var min = Math.min(l, rows, columns);
            var matrix = this.zeros(rows, columns);
            for (var i = 0; i < min; i++) {
                matrix.set(i, i, data[i]);
            }
            return matrix;
        }

        /**
         * Returns a matrix whose elements are the minimum between matrix1 and matrix2
         * @param {Matrix} matrix1
         * @param {Matrix} matrix2
         * @return {Matrix}
         */
        static min(matrix1, matrix2) {
            matrix1 = this.checkMatrix(matrix1);
            matrix2 = this.checkMatrix(matrix2);
            var rows = matrix1.rows;
            var columns = matrix1.columns;
            var result = new this(rows, columns);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    result.set(i, j, Math.min(matrix1.get(i, j), matrix2.get(i, j)));
                }
            }
            return result;
        }

        /**
         * Returns a matrix whose elements are the maximum between matrix1 and matrix2
         * @param {Matrix} matrix1
         * @param {Matrix} matrix2
         * @return {Matrix}
         */
        static max(matrix1, matrix2) {
            matrix1 = this.checkMatrix(matrix1);
            matrix2 = this.checkMatrix(matrix2);
            var rows = matrix1.rows;
            var columns = matrix1.columns;
            var result = new this(rows, columns);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    result.set(i, j, Math.max(matrix1.get(i, j), matrix2.get(i, j)));
                }
            }
            return result;
        }

        /**
         * Check that the provided value is a Matrix and tries to instantiate one if not
         * @param {*} value - The value to check
         * @return {Matrix}
         */
        static checkMatrix(value) {
            return Matrix.isMatrix(value) ? value : new this(value);
        }

        /**
         * Returns true if the argument is a Matrix, false otherwise
         * @param {*} value - The value to check
         * @return {boolean}
         */
        static isMatrix(value) {
            return (value != null) && (value.klass === 'Matrix');
        }

        /**
         * @prop {number} size - The number of elements in the matrix.
         */
        get size() {
            return this.rows * this.columns;
        }

        /**
         * Applies a callback for each element of the matrix. The function is called in the matrix (this) context.
         * @param {function} callback - Function that will be called with two parameters : i (row) and j (column)
         * @return {Matrix} this
         */
        apply(callback) {
            if (typeof callback !== 'function') {
                throw new TypeError('callback must be a function');
            }
            var ii = this.rows;
            var jj = this.columns;
            for (var i = 0; i < ii; i++) {
                for (var j = 0; j < jj; j++) {
                    callback.call(this, i, j);
                }
            }
            return this;
        }

        /**
         * Returns a new 1D array filled row by row with the matrix values
         * @return {Array}
         */
        to1DArray() {
            var array = new Array(this.size);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    array[i * this.columns + j] = this.get(i, j);
                }
            }
            return array;
        }

        /**
         * Returns a 2D array containing a copy of the data
         * @return {Array}
         */
        to2DArray() {
            var copy = new Array(this.rows);
            for (var i = 0; i < this.rows; i++) {
                copy[i] = new Array(this.columns);
                for (var j = 0; j < this.columns; j++) {
                    copy[i][j] = this.get(i, j);
                }
            }
            return copy;
        }

        /**
         * @return {boolean} true if the matrix has one row
         */
        isRowVector() {
            return this.rows === 1;
        }

        /**
         * @return {boolean} true if the matrix has one column
         */
        isColumnVector() {
            return this.columns === 1;
        }

        /**
         * @return {boolean} true if the matrix has one row or one column
         */
        isVector() {
            return (this.rows === 1) || (this.columns === 1);
        }

        /**
         * @return {boolean} true if the matrix has the same number of rows and columns
         */
        isSquare() {
            return this.rows === this.columns;
        }

        /**
         * @return {boolean} true if the matrix is square and has the same values on both sides of the diagonal
         */
        isSymmetric() {
            if (this.isSquare()) {
                for (var i = 0; i < this.rows; i++) {
                    for (var j = 0; j <= i; j++) {
                        if (this.get(i, j) !== this.get(j, i)) {
                            return false;
                        }
                    }
                }
                return true;
            }
            return false;
        }

        /**
         * Sets a given element of the matrix. mat.set(3,4,1) is equivalent to mat[3][4]=1
         * @abstract
         * @param {number} rowIndex - Index of the row
         * @param {number} columnIndex - Index of the column
         * @param {number} value - The new value for the element
         * @return {Matrix} this
         */
        set(rowIndex, columnIndex, value) { // eslint-disable-line no-unused-vars
            throw new Error('set method is unimplemented');
        }

        /**
         * Returns the given element of the matrix. mat.get(3,4) is equivalent to matrix[3][4]
         * @abstract
         * @param {number} rowIndex - Index of the row
         * @param {number} columnIndex - Index of the column
         * @return {number}
         */
        get(rowIndex, columnIndex) { // eslint-disable-line no-unused-vars
            throw new Error('get method is unimplemented');
        }

        /**
         * Creates a new matrix that is a repetition of the current matrix. New matrix has rowRep times the number of
         * rows of the matrix, and colRep times the number of columns of the matrix
         * @param {number} rowRep - Number of times the rows should be repeated
         * @param {number} colRep - Number of times the columns should be re
         * @return {Matrix}
         * @example
         * var matrix = new Matrix([[1,2]]);
         * matrix.repeat(2); // [[1,2],[1,2]]
         */
        repeat(rowRep, colRep) {
            rowRep = rowRep || 1;
            colRep = colRep || 1;
            var matrix = new this.constructor[Symbol.species](this.rows * rowRep, this.columns * colRep);
            for (var i = 0; i < rowRep; i++) {
                for (var j = 0; j < colRep; j++) {
                    matrix.setSubMatrix(this, this.rows * i, this.columns * j);
                }
            }
            return matrix;
        }

        /**
         * Fills the matrix with a given value. All elements will be set to this value.
         * @param {number} value - New value
         * @return {Matrix} this
         */
        fill(value) {
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, value);
                }
            }
            return this;
        }

        /**
         * Negates the matrix. All elements will be multiplied by (-1)
         * @return {Matrix} this
         */
        neg() {
            return this.mulS(-1);
        }

        /**
         * Returns a new array from the given row index
         * @param {number} index - Row index
         * @return {Array}
         */
        getRow(index) {
            util.checkRowIndex(this, index);
            var row = new Array(this.columns);
            for (var i = 0; i < this.columns; i++) {
                row[i] = this.get(index, i);
            }
            return row;
        }

        /**
         * Returns a new row vector from the given row index
         * @param {number} index - Row index
         * @return {Matrix}
         */
        getRowVector(index) {
            return this.constructor.rowVector(this.getRow(index));
        }

        /**
         * Sets a row at the given index
         * @param {number} index - Row index
         * @param {Array|Matrix} array - Array or vector
         * @return {Matrix} this
         */
        setRow(index, array) {
            util.checkRowIndex(this, index);
            array = util.checkRowVector(this, array);
            for (var i = 0; i < this.columns; i++) {
                this.set(index, i, array[i]);
            }
            return this;
        }

        /**
         * Swaps two rows
         * @param {number} row1 - First row index
         * @param {number} row2 - Second row index
         * @return {Matrix} this
         */
        swapRows(row1, row2) {
            util.checkRowIndex(this, row1);
            util.checkRowIndex(this, row2);
            for (var i = 0; i < this.columns; i++) {
                var temp = this.get(row1, i);
                this.set(row1, i, this.get(row2, i));
                this.set(row2, i, temp);
            }
            return this;
        }

        /**
         * Returns a new array from the given column index
         * @param {number} index - Column index
         * @return {Array}
         */
        getColumn(index) {
            util.checkColumnIndex(this, index);
            var column = new Array(this.rows);
            for (var i = 0; i < this.rows; i++) {
                column[i] = this.get(i, index);
            }
            return column;
        }

        /**
         * Returns a new column vector from the given column index
         * @param {number} index - Column index
         * @return {Matrix}
         */
        getColumnVector(index) {
            return this.constructor.columnVector(this.getColumn(index));
        }

        /**
         * Sets a column at the given index
         * @param {number} index - Column index
         * @param {Array|Matrix} array - Array or vector
         * @return {Matrix} this
         */
        setColumn(index, array) {
            util.checkColumnIndex(this, index);
            array = util.checkColumnVector(this, array);
            for (var i = 0; i < this.rows; i++) {
                this.set(i, index, array[i]);
            }
            return this;
        }

        /**
         * Swaps two columns
         * @param {number} column1 - First column index
         * @param {number} column2 - Second column index
         * @return {Matrix} this
         */
        swapColumns(column1, column2) {
            util.checkColumnIndex(this, column1);
            util.checkColumnIndex(this, column2);
            for (var i = 0; i < this.rows; i++) {
                var temp = this.get(i, column1);
                this.set(i, column1, this.get(i, column2));
                this.set(i, column2, temp);
            }
            return this;
        }

        /**
         * Adds the values of a vector to each row
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        addRowVector(vector) {
            vector = util.checkRowVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) + vector[j]);
                }
            }
            return this;
        }

        /**
         * Subtracts the values of a vector from each row
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        subRowVector(vector) {
            vector = util.checkRowVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) - vector[j]);
                }
            }
            return this;
        }

        /**
         * Multiplies the values of a vector with each row
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        mulRowVector(vector) {
            vector = util.checkRowVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) * vector[j]);
                }
            }
            return this;
        }

        /**
         * Divides the values of each row by those of a vector
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        divRowVector(vector) {
            vector = util.checkRowVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) / vector[j]);
                }
            }
            return this;
        }

        /**
         * Adds the values of a vector to each column
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        addColumnVector(vector) {
            vector = util.checkColumnVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) + vector[i]);
                }
            }
            return this;
        }

        /**
         * Subtracts the values of a vector from each column
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        subColumnVector(vector) {
            vector = util.checkColumnVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) - vector[i]);
                }
            }
            return this;
        }

        /**
         * Multiplies the values of a vector with each column
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        mulColumnVector(vector) {
            vector = util.checkColumnVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) * vector[i]);
                }
            }
            return this;
        }

        /**
         * Divides the values of each column by those of a vector
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        divColumnVector(vector) {
            vector = util.checkColumnVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) / vector[i]);
                }
            }
            return this;
        }

        /**
         * Multiplies the values of a row with a scalar
         * @param {number} index - Row index
         * @param {number} value
         * @return {Matrix} this
         */
        mulRow(index, value) {
            util.checkRowIndex(this, index);
            for (var i = 0; i < this.columns; i++) {
                this.set(index, i, this.get(index, i) * value);
            }
            return this;
        }

        /**
         * Multiplies the values of a column with a scalar
         * @param {number} index - Column index
         * @param {number} value
         * @return {Matrix} this
         */
        mulColumn(index, value) {
            util.checkColumnIndex(this, index);
            for (var i = 0; i < this.rows; i++) {
                this.set(i, index, this.get(i, index) * value);
            }
            return this;
        }

        /**
         * Returns the maximum value of the matrix
         * @return {number}
         */
        max() {
            var v = this.get(0, 0);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    if (this.get(i, j) > v) {
                        v = this.get(i, j);
                    }
                }
            }
            return v;
        }

        /**
         * Returns the index of the maximum value
         * @return {Array}
         */
        maxIndex() {
            var v = this.get(0, 0);
            var idx = [0, 0];
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    if (this.get(i, j) > v) {
                        v = this.get(i, j);
                        idx[0] = i;
                        idx[1] = j;
                    }
                }
            }
            return idx;
        }

        /**
         * Returns the minimum value of the matrix
         * @return {number}
         */
        min() {
            var v = this.get(0, 0);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    if (this.get(i, j) < v) {
                        v = this.get(i, j);
                    }
                }
            }
            return v;
        }

        /**
         * Returns the index of the minimum value
         * @return {Array}
         */
        minIndex() {
            var v = this.get(0, 0);
            var idx = [0, 0];
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    if (this.get(i, j) < v) {
                        v = this.get(i, j);
                        idx[0] = i;
                        idx[1] = j;
                    }
                }
            }
            return idx;
        }

        /**
         * Returns the maximum value of one row
         * @param {number} row - Row index
         * @return {number}
         */
        maxRow(row) {
            util.checkRowIndex(this, row);
            var v = this.get(row, 0);
            for (var i = 1; i < this.columns; i++) {
                if (this.get(row, i) > v) {
                    v = this.get(row, i);
                }
            }
            return v;
        }

        /**
         * Returns the index of the maximum value of one row
         * @param {number} row - Row index
         * @return {Array}
         */
        maxRowIndex(row) {
            util.checkRowIndex(this, row);
            var v = this.get(row, 0);
            var idx = [row, 0];
            for (var i = 1; i < this.columns; i++) {
                if (this.get(row, i) > v) {
                    v = this.get(row, i);
                    idx[1] = i;
                }
            }
            return idx;
        }

        /**
         * Returns the minimum value of one row
         * @param {number} row - Row index
         * @return {number}
         */
        minRow(row) {
            util.checkRowIndex(this, row);
            var v = this.get(row, 0);
            for (var i = 1; i < this.columns; i++) {
                if (this.get(row, i) < v) {
                    v = this.get(row, i);
                }
            }
            return v;
        }

        /**
         * Returns the index of the maximum value of one row
         * @param {number} row - Row index
         * @return {Array}
         */
        minRowIndex(row) {
            util.checkRowIndex(this, row);
            var v = this.get(row, 0);
            var idx = [row, 0];
            for (var i = 1; i < this.columns; i++) {
                if (this.get(row, i) < v) {
                    v = this.get(row, i);
                    idx[1] = i;
                }
            }
            return idx;
        }

        /**
         * Returns the maximum value of one column
         * @param {number} column - Column index
         * @return {number}
         */
        maxColumn(column) {
            util.checkColumnIndex(this, column);
            var v = this.get(0, column);
            for (var i = 1; i < this.rows; i++) {
                if (this.get(i, column) > v) {
                    v = this.get(i, column);
                }
            }
            return v;
        }

        /**
         * Returns the index of the maximum value of one column
         * @param {number} column - Column index
         * @return {Array}
         */
        maxColumnIndex(column) {
            util.checkColumnIndex(this, column);
            var v = this.get(0, column);
            var idx = [0, column];
            for (var i = 1; i < this.rows; i++) {
                if (this.get(i, column) > v) {
                    v = this.get(i, column);
                    idx[0] = i;
                }
            }
            return idx;
        }

        /**
         * Returns the minimum value of one column
         * @param {number} column - Column index
         * @return {number}
         */
        minColumn(column) {
            util.checkColumnIndex(this, column);
            var v = this.get(0, column);
            for (var i = 1; i < this.rows; i++) {
                if (this.get(i, column) < v) {
                    v = this.get(i, column);
                }
            }
            return v;
        }

        /**
         * Returns the index of the minimum value of one column
         * @param {number} column - Column index
         * @return {Array}
         */
        minColumnIndex(column) {
            util.checkColumnIndex(this, column);
            var v = this.get(0, column);
            var idx = [0, column];
            for (var i = 1; i < this.rows; i++) {
                if (this.get(i, column) < v) {
                    v = this.get(i, column);
                    idx[0] = i;
                }
            }
            return idx;
        }

        /**
         * Returns an array containing the diagonal values of the matrix
         * @return {Array}
         */
        diag() {
            var min = Math.min(this.rows, this.columns);
            var diag = new Array(min);
            for (var i = 0; i < min; i++) {
                diag[i] = this.get(i, i);
            }
            return diag;
        }

        /**
         * Returns the sum by the argument given, if no argument given,
         * it returns the sum of all elements of the matrix.
         * @param {string} by - sum by 'row' or 'column'.
         * @return {Matrix|number}
         */
        sum(by) {
            switch (by) {
                case 'row':
                    return util.sumByRow(this);
                case 'column':
                    return util.sumByColumn(this);
                default:
                    return util.sumAll(this);
            }
        }

        /**
         * Returns the mean of all elements of the matrix
         * @return {number}
         */
        mean() {
            return this.sum() / this.size;
        }

        /**
         * Returns the product of all elements of the matrix
         * @return {number}
         */
        prod() {
            var prod = 1;
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    prod *= this.get(i, j);
                }
            }
            return prod;
        }

        /**
         * Computes the cumulative sum of the matrix elements (in place, row by row)
         * @return {Matrix} this
         */
        cumulativeSum() {
            var sum = 0;
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    sum += this.get(i, j);
                    this.set(i, j, sum);
                }
            }
            return this;
        }

        /**
         * Computes the dot (scalar) product between the matrix and another
         * @param {Matrix} vector2 vector
         * @return {number}
         */
        dot(vector2) {
            if (Matrix.isMatrix(vector2)) vector2 = vector2.to1DArray();
            var vector1 = this.to1DArray();
            if (vector1.length !== vector2.length) {
                throw new RangeError('vectors do not have the same size');
            }
            var dot = 0;
            for (var i = 0; i < vector1.length; i++) {
                dot += vector1[i] * vector2[i];
            }
            return dot;
        }

        /**
         * Returns the matrix product between this and other
         * @param {Matrix} other
         * @return {Matrix}
         */
        mmul(other) {
            other = this.constructor.checkMatrix(other);
            if (this.columns !== other.rows) {
                // eslint-disable-next-line no-console
                console.warn('Number of columns of left matrix are not equal to number of rows of right matrix.');
            }

            var m = this.rows;
            var n = this.columns;
            var p = other.columns;

            var result = new this.constructor[Symbol.species](m, p);

            var Bcolj = new Array(n);
            for (var j = 0; j < p; j++) {
                for (var k = 0; k < n; k++) {
                    Bcolj[k] = other.get(k, j);
                }

                for (var i = 0; i < m; i++) {
                    var s = 0;
                    for (k = 0; k < n; k++) {
                        s += this.get(i, k) * Bcolj[k];
                    }

                    result.set(i, j, s);
                }
            }
            return result;
        }

        strassen2x2(other) {
            var result = new this.constructor[Symbol.species](2, 2);
            const a11 = this.get(0, 0);
            const b11 = other.get(0, 0);
            const a12 = this.get(0, 1);
            const b12 = other.get(0, 1);
            const a21 = this.get(1, 0);
            const b21 = other.get(1, 0);
            const a22 = this.get(1, 1);
            const b22 = other.get(1, 1);

            // Compute intermediate values.
            const m1 = (a11 + a22) * (b11 + b22);
            const m2 = (a21 + a22) * b11;
            const m3 = a11 * (b12 - b22);
            const m4 = a22 * (b21 - b11);
            const m5 = (a11 + a12) * b22;
            const m6 = (a21 - a11) * (b11 + b12);
            const m7 = (a12 - a22) * (b21 + b22);

            // Combine intermediate values into the output.
            const c00 = m1 + m4 - m5 + m7;
            const c01 = m3 + m5;
            const c10 = m2 + m4;
            const c11 = m1 - m2 + m3 + m6;

            result.set(0, 0, c00);
            result.set(0, 1, c01);
            result.set(1, 0, c10);
            result.set(1, 1, c11);
            return result;
        }

        strassen3x3(other) {
            var result = new this.constructor[Symbol.species](3, 3);

            const a00 = this.get(0, 0);
            const a01 = this.get(0, 1);
            const a02 = this.get(0, 2);
            const a10 = this.get(1, 0);
            const a11 = this.get(1, 1);
            const a12 = this.get(1, 2);
            const a20 = this.get(2, 0);
            const a21 = this.get(2, 1);
            const a22 = this.get(2, 2);

            const b00 = other.get(0, 0);
            const b01 = other.get(0, 1);
            const b02 = other.get(0, 2);
            const b10 = other.get(1, 0);
            const b11 = other.get(1, 1);
            const b12 = other.get(1, 2);
            const b20 = other.get(2, 0);
            const b21 = other.get(2, 1);
            const b22 = other.get(2, 2);

            const m1 = (a00 + a01 + a02 - a10 - a11 - a21 - a22) * b11;
            const m2 = (a00 - a10) * (-b01 + b11);
            const m3 = a11 * (-b00 + b01 + b10 - b11 - b12 - b20 + b22);
            const m4 = (-a00 + a10 + a11) * (b00 - b01 + b11);
            const m5 = (a10 + a11) * (-b00 + b01);
            const m6 = a00 * b00;
            const m7 = (-a00 + a20 + a21) * (b00 - b02 + b12);
            const m8 = (-a00 + a20) * (b02 - b12);
            const m9 = (a20 + a21) * (-b00 + b02);
            const m10 = (a00 + a01 + a02 - a11 - a12 - a20 - a21) * b12;
            const m11 = a21 * (-b00 + b02 + b10 - b11 - b12 - b20 + b21);
            const m12 = (-a02 + a21 + a22) * (b11 + b20 - b21);
            const m13 = (a02 - a22) * (b11 - b21);
            const m14 = a02 * b20;
            const m15 = (a21 + a22) * (-b20 + b21);
            const m16 = (-a02 + a11 + a12) * (b12 + b20 - b22);
            const m17 = (a02 - a12) * (b12 - b22);
            const m18 = (a11 + a12) * (-b20 + b22);
            const m19 = a01 * b10;
            const m20 = a12 * b21;
            const m21 = a10 * b02;
            const m22 = a20 * b01;
            const m23 = a22 * b22;

            const c00 = m6 + m14 + m19;
            const c01 = m1 + m4 + m5 + m6 + m12 + m14 + m15;
            const c02 = m6 + m7 + m9 + m10 + m14 + m16 + m18;
            const c10 = m2 + m3 + m4 + m6 + m14 + m16 + m17;
            const c11 = m2 + m4 + m5 + m6 + m20;
            const c12 = m14 + m16 + m17 + m18 + m21;
            const c20 = m6 + m7 + m8 + m11 + m12 + m13 + m14;
            const c21 = m12 + m13 + m14 + m15 + m22;
            const c22 = m6 + m7 + m8 + m9 + m23;

            result.set(0, 0, c00);
            result.set(0, 1, c01);
            result.set(0, 2, c02);
            result.set(1, 0, c10);
            result.set(1, 1, c11);
            result.set(1, 2, c12);
            result.set(2, 0, c20);
            result.set(2, 1, c21);
            result.set(2, 2, c22);
            return result;
        }

        /**
         * Returns the matrix product between x and y. More efficient than mmul(other) only when we multiply squared matrix and when the size of the matrix is > 1000.
         * @param {Matrix} y
         * @return {Matrix}
         */
        mmulStrassen(y) {
            var x = this.clone();
            var r1 = x.rows;
            var c1 = x.columns;
            var r2 = y.rows;
            var c2 = y.columns;
            if (c1 !== r2) {
                // eslint-disable-next-line no-console
                console.warn(`Multiplying ${r1} x ${c1} and ${r2} x ${c2} matrix: dimensions do not match.`);
            }

            // Put a matrix into the top left of a matrix of zeros.
            // `rows` and `cols` are the dimensions of the output matrix.
            function embed(mat, rows, cols) {
                var r = mat.rows;
                var c = mat.columns;
                if ((r === rows) && (c === cols)) {
                    return mat;
                } else {
                    var resultat = Matrix.zeros(rows, cols);
                    resultat = resultat.setSubMatrix(mat, 0, 0);
                    return resultat;
                }
            }


            // Make sure both matrices are the same size.
            // This is exclusively for simplicity:
            // this algorithm can be implemented with matrices of different sizes.

            var r = Math.max(r1, r2);
            var c = Math.max(c1, c2);
            x = embed(x, r, c);
            y = embed(y, r, c);

            // Our recursive multiplication function.
            function blockMult(a, b, rows, cols) {
                // For small matrices, resort to naive multiplication.
                if (rows <= 512 || cols <= 512) {
                    return a.mmul(b); // a is equivalent to this
                }

                // Apply dynamic padding.
                if ((rows % 2 === 1) && (cols % 2 === 1)) {
                    a = embed(a, rows + 1, cols + 1);
                    b = embed(b, rows + 1, cols + 1);
                } else if (rows % 2 === 1) {
                    a = embed(a, rows + 1, cols);
                    b = embed(b, rows + 1, cols);
                } else if (cols % 2 === 1) {
                    a = embed(a, rows, cols + 1);
                    b = embed(b, rows, cols + 1);
                }

                var halfRows = parseInt(a.rows / 2);
                var halfCols = parseInt(a.columns / 2);
                // Subdivide input matrices.
                var a11 = a.subMatrix(0, halfRows - 1, 0, halfCols - 1);
                var b11 = b.subMatrix(0, halfRows - 1, 0, halfCols - 1);

                var a12 = a.subMatrix(0, halfRows - 1, halfCols, a.columns - 1);
                var b12 = b.subMatrix(0, halfRows - 1, halfCols, b.columns - 1);

                var a21 = a.subMatrix(halfRows, a.rows - 1, 0, halfCols - 1);
                var b21 = b.subMatrix(halfRows, b.rows - 1, 0, halfCols - 1);

                var a22 = a.subMatrix(halfRows, a.rows - 1, halfCols, a.columns - 1);
                var b22 = b.subMatrix(halfRows, b.rows - 1, halfCols, b.columns - 1);

                // Compute intermediate values.
                var m1 = blockMult(Matrix.add(a11, a22), Matrix.add(b11, b22), halfRows, halfCols);
                var m2 = blockMult(Matrix.add(a21, a22), b11, halfRows, halfCols);
                var m3 = blockMult(a11, Matrix.sub(b12, b22), halfRows, halfCols);
                var m4 = blockMult(a22, Matrix.sub(b21, b11), halfRows, halfCols);
                var m5 = blockMult(Matrix.add(a11, a12), b22, halfRows, halfCols);
                var m6 = blockMult(Matrix.sub(a21, a11), Matrix.add(b11, b12), halfRows, halfCols);
                var m7 = blockMult(Matrix.sub(a12, a22), Matrix.add(b21, b22), halfRows, halfCols);

                // Combine intermediate values into the output.
                var c11 = Matrix.add(m1, m4);
                c11.sub(m5);
                c11.add(m7);
                var c12 = Matrix.add(m3, m5);
                var c21 = Matrix.add(m2, m4);
                var c22 = Matrix.sub(m1, m2);
                c22.add(m3);
                c22.add(m6);

                //Crop output to the desired size (undo dynamic padding).
                var resultat = Matrix.zeros(2 * c11.rows, 2 * c11.columns);
                resultat = resultat.setSubMatrix(c11, 0, 0);
                resultat = resultat.setSubMatrix(c12, c11.rows, 0);
                resultat = resultat.setSubMatrix(c21, 0, c11.columns);
                resultat = resultat.setSubMatrix(c22, c11.rows, c11.columns);
                return resultat.subMatrix(0, rows - 1, 0, cols - 1);
            }
            return blockMult(x, y, r, c);
        }

        /**
         * Returns a row-by-row scaled matrix
         * @param {number} [min=0] - Minimum scaled value
         * @param {number} [max=1] - Maximum scaled value
         * @return {Matrix} - The scaled matrix
         */
        scaleRows(min, max) {
            min = min === undefined ? 0 : min;
            max = max === undefined ? 1 : max;
            if (min >= max) {
                throw new RangeError('min should be strictly smaller than max');
            }
            var newMatrix = this.constructor.empty(this.rows, this.columns);
            for (var i = 0; i < this.rows; i++) {
                var scaled = arrayUtils.scale(this.getRow(i), {min, max});
                newMatrix.setRow(i, scaled);
            }
            return newMatrix;
        }

        /**
         * Returns a new column-by-column scaled matrix
         * @param {number} [min=0] - Minimum scaled value
         * @param {number} [max=1] - Maximum scaled value
         * @return {Matrix} - The new scaled matrix
         * @example
         * var matrix = new Matrix([[1,2],[-1,0]]);
         * var scaledMatrix = matrix.scaleColumns(); // [[1,1],[0,0]]
         */
        scaleColumns(min, max) {
            min = min === undefined ? 0 : min;
            max = max === undefined ? 1 : max;
            if (min >= max) {
                throw new RangeError('min should be strictly smaller than max');
            }
            var newMatrix = this.constructor.empty(this.rows, this.columns);
            for (var i = 0; i < this.columns; i++) {
                var scaled = arrayUtils.scale(this.getColumn(i), {
                    min: min,
                    max: max
                });
                newMatrix.setColumn(i, scaled);
            }
            return newMatrix;
        }


        /**
         * Returns the Kronecker product (also known as tensor product) between this and other
         * See https://en.wikipedia.org/wiki/Kronecker_product
         * @param {Matrix} other
         * @return {Matrix}
         */
        kroneckerProduct(other) {
            other = this.constructor.checkMatrix(other);

            var m = this.rows;
            var n = this.columns;
            var p = other.rows;
            var q = other.columns;

            var result = new this.constructor[Symbol.species](m * p, n * q);
            for (var i = 0; i < m; i++) {
                for (var j = 0; j < n; j++) {
                    for (var k = 0; k < p; k++) {
                        for (var l = 0; l < q; l++) {
                            result[p * i + k][q * j + l] = this.get(i, j) * other.get(k, l);
                        }
                    }
                }
            }
            return result;
        }

        /**
         * Transposes the matrix and returns a new one containing the result
         * @return {Matrix}
         */
        transpose() {
            var result = new this.constructor[Symbol.species](this.columns, this.rows);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    result.set(j, i, this.get(i, j));
                }
            }
            return result;
        }

        /**
         * Sorts the rows (in place)
         * @param {function} compareFunction - usual Array.prototype.sort comparison function
         * @return {Matrix} this
         */
        sortRows(compareFunction) {
            if (compareFunction === undefined) compareFunction = compareNumbers;
            for (var i = 0; i < this.rows; i++) {
                this.setRow(i, this.getRow(i).sort(compareFunction));
            }
            return this;
        }

        /**
         * Sorts the columns (in place)
         * @param {function} compareFunction - usual Array.prototype.sort comparison function
         * @return {Matrix} this
         */
        sortColumns(compareFunction) {
            if (compareFunction === undefined) compareFunction = compareNumbers;
            for (var i = 0; i < this.columns; i++) {
                this.setColumn(i, this.getColumn(i).sort(compareFunction));
            }
            return this;
        }

        /**
         * Returns a subset of the matrix
         * @param {number} startRow - First row index
         * @param {number} endRow - Last row index
         * @param {number} startColumn - First column index
         * @param {number} endColumn - Last column index
         * @return {Matrix}
         */
        subMatrix(startRow, endRow, startColumn, endColumn) {
            util.checkRange(this, startRow, endRow, startColumn, endColumn);
            var newMatrix = new this.constructor[Symbol.species](endRow - startRow + 1, endColumn - startColumn + 1);
            for (var i = startRow; i <= endRow; i++) {
                for (var j = startColumn; j <= endColumn; j++) {
                    newMatrix[i - startRow][j - startColumn] = this.get(i, j);
                }
            }
            return newMatrix;
        }

        /**
         * Returns a subset of the matrix based on an array of row indices
         * @param {Array} indices - Array containing the row indices
         * @param {number} [startColumn = 0] - First column index
         * @param {number} [endColumn = this.columns-1] - Last column index
         * @return {Matrix}
         */
        subMatrixRow(indices, startColumn, endColumn) {
            if (startColumn === undefined) startColumn = 0;
            if (endColumn === undefined) endColumn = this.columns - 1;
            if ((startColumn > endColumn) || (startColumn < 0) || (startColumn >= this.columns) || (endColumn < 0) || (endColumn >= this.columns)) {
                throw new RangeError('Argument out of range');
            }

            var newMatrix = new this.constructor[Symbol.species](indices.length, endColumn - startColumn + 1);
            for (var i = 0; i < indices.length; i++) {
                for (var j = startColumn; j <= endColumn; j++) {
                    if (indices[i] < 0 || indices[i] >= this.rows) {
                        throw new RangeError('Row index out of range: ' + indices[i]);
                    }
                    newMatrix.set(i, j - startColumn, this.get(indices[i], j));
                }
            }
            return newMatrix;
        }

        /**
         * Returns a subset of the matrix based on an array of column indices
         * @param {Array} indices - Array containing the column indices
         * @param {number} [startRow = 0] - First row index
         * @param {number} [endRow = this.rows-1] - Last row index
         * @return {Matrix}
         */
        subMatrixColumn(indices, startRow, endRow) {
            if (startRow === undefined) startRow = 0;
            if (endRow === undefined) endRow = this.rows - 1;
            if ((startRow > endRow) || (startRow < 0) || (startRow >= this.rows) || (endRow < 0) || (endRow >= this.rows)) {
                throw new RangeError('Argument out of range');
            }

            var newMatrix = new this.constructor[Symbol.species](endRow - startRow + 1, indices.length);
            for (var i = 0; i < indices.length; i++) {
                for (var j = startRow; j <= endRow; j++) {
                    if (indices[i] < 0 || indices[i] >= this.columns) {
                        throw new RangeError('Column index out of range: ' + indices[i]);
                    }
                    newMatrix.set(j - startRow, i, this.get(j, indices[i]));
                }
            }
            return newMatrix;
        }

        /**
         * Set a part of the matrix to the given sub-matrix
         * @param {Matrix|Array< Array >} matrix - The source matrix from which to extract values.
         * @param {number} startRow - The index of the first row to set
         * @param {number} startColumn - The index of the first column to set
         * @return {Matrix}
         */
        setSubMatrix(matrix, startRow, startColumn) {
            matrix = this.constructor.checkMatrix(matrix);
            var endRow = startRow + matrix.rows - 1;
            var endColumn = startColumn + matrix.columns - 1;
            util.checkRange(this, startRow, endRow, startColumn, endColumn);
            for (var i = 0; i < matrix.rows; i++) {
                for (var j = 0; j < matrix.columns; j++) {
                    this[startRow + i][startColumn + j] = matrix.get(i, j);
                }
            }
            return this;
        }

        /**
         * Return a new matrix based on a selection of rows and columns
         * @param {Array<number>} rowIndices - The row indices to select. Order matters and an index can be more than once.
         * @param {Array<number>} columnIndices - The column indices to select. Order matters and an index can be use more than once.
         * @return {Matrix} The new matrix
         */
        selection(rowIndices, columnIndices) {
            var indices = util.checkIndices(this, rowIndices, columnIndices);
            var newMatrix = new this.constructor[Symbol.species](rowIndices.length, columnIndices.length);
            for (var i = 0; i < indices.row.length; i++) {
                var rowIndex = indices.row[i];
                for (var j = 0; j < indices.column.length; j++) {
                    var columnIndex = indices.column[j];
                    newMatrix[i][j] = this.get(rowIndex, columnIndex);
                }
            }
            return newMatrix;
        }

        /**
         * Returns the trace of the matrix (sum of the diagonal elements)
         * @return {number}
         */
        trace() {
            var min = Math.min(this.rows, this.columns);
            var trace = 0;
            for (var i = 0; i < min; i++) {
                trace += this.get(i, i);
            }
            return trace;
        }

        /*
         Matrix views
         */

        /**
         * Returns a view of the transposition of the matrix
         * @return {MatrixTransposeView}
         */
        transposeView() {
            return new MatrixTransposeView(this);
        }

        /**
         * Returns a view of the row vector with the given index
         * @param {number} row - row index of the vector
         * @return {MatrixRowView}
         */
        rowView(row) {
            util.checkRowIndex(this, row);
            return new MatrixRowView(this, row);
        }

        /**
         * Returns a view of the column vector with the given index
         * @param {number} column - column index of the vector
         * @return {MatrixColumnView}
         */
        columnView(column) {
            util.checkColumnIndex(this, column);
            return new MatrixColumnView(this, column);
        }

        /**
         * Returns a view of the matrix flipped in the row axis
         * @return {MatrixFlipRowView}
         */
        flipRowView() {
            return new MatrixFlipRowView(this);
        }

        /**
         * Returns a view of the matrix flipped in the column axis
         * @return {MatrixFlipColumnView}
         */
        flipColumnView() {
            return new MatrixFlipColumnView(this);
        }

        /**
         * Returns a view of a submatrix giving the index boundaries
         * @param {number} startRow - first row index of the submatrix
         * @param {number} endRow - last row index of the submatrix
         * @param {number} startColumn - first column index of the submatrix
         * @param {number} endColumn - last column index of the submatrix
         * @return {MatrixSubView}
         */
        subMatrixView(startRow, endRow, startColumn, endColumn) {
            return new MatrixSubView(this, startRow, endRow, startColumn, endColumn);
        }

        /**
         * Returns a view of the cross of the row indices and the column indices
         * @example
         * // resulting vector is [[2], [2]]
         * var matrix = new Matrix([[1,2,3], [4,5,6]]).selectionView([0, 0], [1])
         * @param {Array<number>} rowIndices
         * @param {Array<number>} columnIndices
         * @return {MatrixSelectionView}
         */
        selectionView(rowIndices, columnIndices) {
            return new MatrixSelectionView(this, rowIndices, columnIndices);
        }


        /**
        * Calculates and returns the determinant of a matrix as a Number
        * @example
        *   new Matrix([[1,2,3], [4,5,6]]).det()
        * @return {number}
        */
        det() {
            if (this.isSquare()) {
                var a, b, c, d;
                if (this.columns === 2) {
                    // 2 x 2 matrix
                    a = this.get(0, 0);
                    b = this.get(0, 1);
                    c = this.get(1, 0);
                    d = this.get(1, 1);

                    return a * d - (b * c);
                } else if (this.columns === 3) {
                    // 3 x 3 matrix
                    var subMatrix0, subMatrix1, subMatrix2;
                    subMatrix0 = this.selectionView([1, 2], [1, 2]);
                    subMatrix1 = this.selectionView([1, 2], [0, 2]);
                    subMatrix2 = this.selectionView([1, 2], [0, 1]);
                    a = this.get(0, 0);
                    b = this.get(0, 1);
                    c = this.get(0, 2);

                    return a * subMatrix0.det() - b * subMatrix1.det() + c * subMatrix2.det();
                } else {
                    // general purpose determinant using the LU decomposition
                    return new LuDecomposition(this).determinant;
                }

            } else {
                throw Error('Determinant can only be calculated for a square matrix.');
            }
        }

        /**
         * Returns inverse of a matrix if it exists or the pseudoinverse
         * @param {number} threshold - threshold for taking inverse of singular values (default = 1e-15)
         * @return {Matrix} the (pseudo)inverted matrix.
         */
        pseudoInverse(threshold) {
            if (threshold === undefined) threshold = Number.EPSILON;
            var svdSolution = new SvDecomposition(this, {autoTranspose: true});

            var U = svdSolution.leftSingularVectors;
            var V = svdSolution.rightSingularVectors;
            var s = svdSolution.diagonal;

            for (var i = 0; i < s.length; i++) {
                if (Math.abs(s[i]) > threshold) {
                    s[i] = 1.0 / s[i];
                } else {
                    s[i] = 0.0;
                }
            }

            // convert list to diagonal
            s = this.constructor[Symbol.species].diag(s);
            return V.mmul(s.mmul(U.transposeView()));
        }
    }

    Matrix.prototype.klass = 'Matrix';

    /**
     * @private
     * Check that two matrices have the same dimensions
     * @param {Matrix} matrix
     * @param {Matrix} otherMatrix
     */
    function checkDimensions(matrix, otherMatrix) { // eslint-disable-line no-unused-vars
        if (matrix.rows !== otherMatrix.rows ||
            matrix.columns !== otherMatrix.columns) {
            throw new RangeError('Matrices dimensions must be equal');
        }
    }

    function compareNumbers(a, b) {
        return a - b;
    }

    /*
     Synonyms
     */

    Matrix.random = Matrix.rand;
    Matrix.diagonal = Matrix.diag;
    Matrix.prototype.diagonal = Matrix.prototype.diag;
    Matrix.identity = Matrix.eye;
    Matrix.prototype.negate = Matrix.prototype.neg;
    Matrix.prototype.tensorProduct = Matrix.prototype.kroneckerProduct;
    Matrix.prototype.determinant = Matrix.prototype.det;

    /*
     Add dynamically instance and static methods for mathematical operations
     */

    var inplaceOperator = `
(function %name%(value) {
    if (typeof value === 'number') return this.%name%S(value);
    return this.%name%M(value);
})
`;

    var inplaceOperatorScalar = `
(function %name%S(value) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) %op% value);
        }
    }
    return this;
})
`;

    var inplaceOperatorMatrix = `
(function %name%M(matrix) {
    matrix = this.constructor.checkMatrix(matrix);
    checkDimensions(this, matrix);
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) %op% matrix.get(i, j));
        }
    }
    return this;
})
`;

    var staticOperator = `
(function %name%(matrix, value) {
    var newMatrix = new this[Symbol.species](matrix);
    return newMatrix.%name%(value);
})
`;

    var inplaceMethod = `
(function %name%() {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j)));
        }
    }
    return this;
})
`;

    var staticMethod = `
(function %name%(matrix) {
    var newMatrix = new this[Symbol.species](matrix);
    return newMatrix.%name%();
})
`;

    var inplaceMethodWithArgs = `
(function %name%(%args%) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j), %args%));
        }
    }
    return this;
})
`;

    var staticMethodWithArgs = `
(function %name%(matrix, %args%) {
    var newMatrix = new this[Symbol.species](matrix);
    return newMatrix.%name%(%args%);
})
`;


    var inplaceMethodWithOneArgScalar = `
(function %name%S(value) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j), value));
        }
    }
    return this;
})
`;
    var inplaceMethodWithOneArgMatrix = `
(function %name%M(matrix) {
    matrix = this.constructor.checkMatrix(matrix);
    checkDimensions(this, matrix);
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j), matrix.get(i, j)));
        }
    }
    return this;
})
`;

    var inplaceMethodWithOneArg = `
(function %name%(value) {
    if (typeof value === 'number') return this.%name%S(value);
    return this.%name%M(value);
})
`;

    var staticMethodWithOneArg = staticMethodWithArgs;

    var operators = [
        // Arithmetic operators
        ['+', 'add'],
        ['-', 'sub', 'subtract'],
        ['*', 'mul', 'multiply'],
        ['/', 'div', 'divide'],
        ['%', 'mod', 'modulus'],
        // Bitwise operators
        ['&', 'and'],
        ['|', 'or'],
        ['^', 'xor'],
        ['<<', 'leftShift'],
        ['>>', 'signPropagatingRightShift'],
        ['>>>', 'rightShift', 'zeroFillRightShift']
    ];

    var i;

    for (var operator of operators) {
        var inplaceOp = eval(fillTemplateFunction(inplaceOperator, {name: operator[1], op: operator[0]}));
        var inplaceOpS = eval(fillTemplateFunction(inplaceOperatorScalar, {name: operator[1] + 'S', op: operator[0]}));
        var inplaceOpM = eval(fillTemplateFunction(inplaceOperatorMatrix, {name: operator[1] + 'M', op: operator[0]}));
        var staticOp = eval(fillTemplateFunction(staticOperator, {name: operator[1]}));
        for (i = 1; i < operator.length; i++) {
            Matrix.prototype[operator[i]] = inplaceOp;
            Matrix.prototype[operator[i] + 'S'] = inplaceOpS;
            Matrix.prototype[operator[i] + 'M'] = inplaceOpM;
            Matrix[operator[i]] = staticOp;
        }
    }

    var methods = [
        ['~', 'not']
    ];

    [
        'abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh', 'cbrt', 'ceil',
        'clz32', 'cos', 'cosh', 'exp', 'expm1', 'floor', 'fround', 'log', 'log1p',
        'log10', 'log2', 'round', 'sign', 'sin', 'sinh', 'sqrt', 'tan', 'tanh', 'trunc'
    ].forEach(function (mathMethod) {
        methods.push(['Math.' + mathMethod, mathMethod]);
    });

    for (var method of methods) {
        var inplaceMeth = eval(fillTemplateFunction(inplaceMethod, {name: method[1], method: method[0]}));
        var staticMeth = eval(fillTemplateFunction(staticMethod, {name: method[1]}));
        for (i = 1; i < method.length; i++) {
            Matrix.prototype[method[i]] = inplaceMeth;
            Matrix[method[i]] = staticMeth;
        }
    }

    var methodsWithArgs = [
        ['Math.pow', 1, 'pow']
    ];

    for (var methodWithArg of methodsWithArgs) {
        var args = 'arg0';
        for (i = 1; i < methodWithArg[1]; i++) {
            args += `, arg${i}`;
        }
        if (methodWithArg[1] !== 1) {
            var inplaceMethWithArgs = eval(fillTemplateFunction(inplaceMethodWithArgs, {
                name: methodWithArg[2],
                method: methodWithArg[0],
                args: args
            }));
            var staticMethWithArgs = eval(fillTemplateFunction(staticMethodWithArgs, {name: methodWithArg[2], args: args}));
            for (i = 2; i < methodWithArg.length; i++) {
                Matrix.prototype[methodWithArg[i]] = inplaceMethWithArgs;
                Matrix[methodWithArg[i]] = staticMethWithArgs;
            }
        } else {
            var tmplVar = {
                name: methodWithArg[2],
                args: args,
                method: methodWithArg[0]
            };
            var inplaceMethod2 = eval(fillTemplateFunction(inplaceMethodWithOneArg, tmplVar));
            var inplaceMethodS = eval(fillTemplateFunction(inplaceMethodWithOneArgScalar, tmplVar));
            var inplaceMethodM = eval(fillTemplateFunction(inplaceMethodWithOneArgMatrix, tmplVar));
            var staticMethod2 = eval(fillTemplateFunction(staticMethodWithOneArg, tmplVar));
            for (i = 2; i < methodWithArg.length; i++) {
                Matrix.prototype[methodWithArg[i]] = inplaceMethod2;
                Matrix.prototype[methodWithArg[i] + 'M'] = inplaceMethodM;
                Matrix.prototype[methodWithArg[i] + 'S'] = inplaceMethodS;
                Matrix[methodWithArg[i]] = staticMethod2;
            }
        }
    }

    function fillTemplateFunction(template, values) {
        for (var value in values) {
            template = template.replace(new RegExp('%' + value + '%', 'g'), values[value]);
        }
        return template;
    }

    return Matrix;
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0);

// https://github.com/lutzroeder/Mapack/blob/master/Source/LuDecomposition.cs
function LuDecomposition(matrix) {
    if (!(this instanceof LuDecomposition)) {
        return new LuDecomposition(matrix);
    }

    matrix = Matrix.Matrix.checkMatrix(matrix);

    var lu = matrix.clone(),
        rows = lu.rows,
        columns = lu.columns,
        pivotVector = new Array(rows),
        pivotSign = 1,
        i, j, k, p, s, t, v,
        LUrowi, LUcolj, kmax;

    for (i = 0; i < rows; i++) {
        pivotVector[i] = i;
    }

    LUcolj = new Array(rows);

    for (j = 0; j < columns; j++) {

        for (i = 0; i < rows; i++) {
            LUcolj[i] = lu[i][j];
        }

        for (i = 0; i < rows; i++) {
            LUrowi = lu[i];
            kmax = Math.min(i, j);
            s = 0;
            for (k = 0; k < kmax; k++) {
                s += LUrowi[k] * LUcolj[k];
            }
            LUrowi[j] = LUcolj[i] -= s;
        }

        p = j;
        for (i = j + 1; i < rows; i++) {
            if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])) {
                p = i;
            }
        }

        if (p !== j) {
            for (k = 0; k < columns; k++) {
                t = lu[p][k];
                lu[p][k] = lu[j][k];
                lu[j][k] = t;
            }

            v = pivotVector[p];
            pivotVector[p] = pivotVector[j];
            pivotVector[j] = v;

            pivotSign = -pivotSign;
        }

        if (j < rows && lu[j][j] !== 0) {
            for (i = j + 1; i < rows; i++) {
                lu[i][j] /= lu[j][j];
            }
        }
    }

    this.LU = lu;
    this.pivotVector = pivotVector;
    this.pivotSign = pivotSign;
}

LuDecomposition.prototype = {
    isSingular: function () {
        var data = this.LU,
            col = data.columns;
        for (var j = 0; j < col; j++) {
            if (data[j][j] === 0) {
                return true;
            }
        }
        return false;
    },
    get determinant() {
        var data = this.LU;
        if (!data.isSquare()) {
            throw new Error('Matrix must be square');
        }
        var determinant = this.pivotSign, col = data.columns;
        for (var j = 0; j < col; j++) {
            determinant *= data[j][j];
        }
        return determinant;
    },
    get lowerTriangularMatrix() {
        var data = this.LU,
            rows = data.rows,
            columns = data.columns,
            X = new Matrix.Matrix(rows, columns);
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (i > j) {
                    X[i][j] = data[i][j];
                } else if (i === j) {
                    X[i][j] = 1;
                } else {
                    X[i][j] = 0;
                }
            }
        }
        return X;
    },
    get upperTriangularMatrix() {
        var data = this.LU,
            rows = data.rows,
            columns = data.columns,
            X = new Matrix.Matrix(rows, columns);
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (i <= j) {
                    X[i][j] = data[i][j];
                } else {
                    X[i][j] = 0;
                }
            }
        }
        return X;
    },
    get pivotPermutationVector() {
        return this.pivotVector.slice();
    },
    solve: function (value) {
        value = Matrix.Matrix.checkMatrix(value);

        var lu = this.LU,
            rows = lu.rows;

        if (rows !== value.rows) {
            throw new Error('Invalid matrix dimensions');
        }
        if (this.isSingular()) {
            throw new Error('LU matrix is singular');
        }

        var count = value.columns;
        var X = value.subMatrixRow(this.pivotVector, 0, count - 1);
        var columns = lu.columns;
        var i, j, k;

        for (k = 0; k < columns; k++) {
            for (i = k + 1; i < columns; i++) {
                for (j = 0; j < count; j++) {
                    X[i][j] -= X[k][j] * lu[i][k];
                }
            }
        }
        for (k = columns - 1; k >= 0; k--) {
            for (j = 0; j < count; j++) {
                X[k][j] /= lu[k][k];
            }
            for (i = 0; i < k; i++) {
                for (j = 0; j < count; j++) {
                    X[i][j] -= X[k][j] * lu[i][k];
                }
            }
        }
        return X;
    }
};

module.exports = LuDecomposition;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0);
var util = __webpack_require__(4);
var hypotenuse = util.hypotenuse;
var getFilled2DArray = util.getFilled2DArray;

// https://github.com/lutzroeder/Mapack/blob/master/Source/SingularValueDecomposition.cs
function SingularValueDecomposition(value, options) {
    if (!(this instanceof SingularValueDecomposition)) {
        return new SingularValueDecomposition(value, options);
    }
    value = Matrix.Matrix.checkMatrix(value);

    options = options || {};

    var m = value.rows,
        n = value.columns,
        nu = Math.min(m, n);

    var wantu = true, wantv = true;
    if (options.computeLeftSingularVectors === false) wantu = false;
    if (options.computeRightSingularVectors === false) wantv = false;
    var autoTranspose = options.autoTranspose === true;

    var swapped = false;
    var a;
    if (m < n) {
        if (!autoTranspose) {
            a = value.clone();
            // eslint-disable-next-line no-console
            console.warn('Computing SVD on a matrix with more columns than rows. Consider enabling autoTranspose');
        } else {
            a = value.transpose();
            m = a.rows;
            n = a.columns;
            swapped = true;
            var aux = wantu;
            wantu = wantv;
            wantv = aux;
        }
    } else {
        a = value.clone();
    }

    var s = new Array(Math.min(m + 1, n)),
        U = getFilled2DArray(m, nu, 0),
        V = getFilled2DArray(n, n, 0),
        e = new Array(n),
        work = new Array(m);

    var nct = Math.min(m - 1, n);
    var nrt = Math.max(0, Math.min(n - 2, m));

    var i, j, k, p, t, ks, f, cs, sn, max, kase,
        scale, sp, spm1, epm1, sk, ek, b, c, shift, g;

    for (k = 0, max = Math.max(nct, nrt); k < max; k++) {
        if (k < nct) {
            s[k] = 0;
            for (i = k; i < m; i++) {
                s[k] = hypotenuse(s[k], a[i][k]);
            }
            if (s[k] !== 0) {
                if (a[k][k] < 0) {
                    s[k] = -s[k];
                }
                for (i = k; i < m; i++) {
                    a[i][k] /= s[k];
                }
                a[k][k] += 1;
            }
            s[k] = -s[k];
        }

        for (j = k + 1; j < n; j++) {
            if ((k < nct) && (s[k] !== 0)) {
                t = 0;
                for (i = k; i < m; i++) {
                    t += a[i][k] * a[i][j];
                }
                t = -t / a[k][k];
                for (i = k; i < m; i++) {
                    a[i][j] += t * a[i][k];
                }
            }
            e[j] = a[k][j];
        }

        if (wantu && (k < nct)) {
            for (i = k; i < m; i++) {
                U[i][k] = a[i][k];
            }
        }

        if (k < nrt) {
            e[k] = 0;
            for (i = k + 1; i < n; i++) {
                e[k] = hypotenuse(e[k], e[i]);
            }
            if (e[k] !== 0) {
                if (e[k + 1] < 0) {
                    e[k] = 0 - e[k];
                }
                for (i = k + 1; i < n; i++) {
                    e[i] /= e[k];
                }
                e[k + 1] += 1;
            }
            e[k] = -e[k];
            if ((k + 1 < m) && (e[k] !== 0)) {
                for (i = k + 1; i < m; i++) {
                    work[i] = 0;
                }
                for (j = k + 1; j < n; j++) {
                    for (i = k + 1; i < m; i++) {
                        work[i] += e[j] * a[i][j];
                    }
                }
                for (j = k + 1; j < n; j++) {
                    t = -e[j] / e[k + 1];
                    for (i = k + 1; i < m; i++) {
                        a[i][j] += t * work[i];
                    }
                }
            }
            if (wantv) {
                for (i = k + 1; i < n; i++) {
                    V[i][k] = e[i];
                }
            }
        }
    }

    p = Math.min(n, m + 1);
    if (nct < n) {
        s[nct] = a[nct][nct];
    }
    if (m < p) {
        s[p - 1] = 0;
    }
    if (nrt + 1 < p) {
        e[nrt] = a[nrt][p - 1];
    }
    e[p - 1] = 0;

    if (wantu) {
        for (j = nct; j < nu; j++) {
            for (i = 0; i < m; i++) {
                U[i][j] = 0;
            }
            U[j][j] = 1;
        }
        for (k = nct - 1; k >= 0; k--) {
            if (s[k] !== 0) {
                for (j = k + 1; j < nu; j++) {
                    t = 0;
                    for (i = k; i < m; i++) {
                        t += U[i][k] * U[i][j];
                    }
                    t = -t / U[k][k];
                    for (i = k; i < m; i++) {
                        U[i][j] += t * U[i][k];
                    }
                }
                for (i = k; i < m; i++) {
                    U[i][k] = -U[i][k];
                }
                U[k][k] = 1 + U[k][k];
                for (i = 0; i < k - 1; i++) {
                    U[i][k] = 0;
                }
            } else {
                for (i = 0; i < m; i++) {
                    U[i][k] = 0;
                }
                U[k][k] = 1;
            }
        }
    }

    if (wantv) {
        for (k = n - 1; k >= 0; k--) {
            if ((k < nrt) && (e[k] !== 0)) {
                for (j = k + 1; j < n; j++) {
                    t = 0;
                    for (i = k + 1; i < n; i++) {
                        t += V[i][k] * V[i][j];
                    }
                    t = -t / V[k + 1][k];
                    for (i = k + 1; i < n; i++) {
                        V[i][j] += t * V[i][k];
                    }
                }
            }
            for (i = 0; i < n; i++) {
                V[i][k] = 0;
            }
            V[k][k] = 1;
        }
    }

    var pp = p - 1,
        iter = 0,
        eps = Math.pow(2, -52);
    while (p > 0) {
        for (k = p - 2; k >= -1; k--) {
            if (k === -1) {
                break;
            }
            if (Math.abs(e[k]) <= eps * (Math.abs(s[k]) + Math.abs(s[k + 1]))) {
                e[k] = 0;
                break;
            }
        }
        if (k === p - 2) {
            kase = 4;
        } else {
            for (ks = p - 1; ks >= k; ks--) {
                if (ks === k) {
                    break;
                }
                t = (ks !== p ? Math.abs(e[ks]) : 0) + (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0);
                if (Math.abs(s[ks]) <= eps * t) {
                    s[ks] = 0;
                    break;
                }
            }
            if (ks === k) {
                kase = 3;
            } else if (ks === p - 1) {
                kase = 1;
            } else {
                kase = 2;
                k = ks;
            }
        }

        k++;

        switch (kase) {
            case 1: {
                f = e[p - 2];
                e[p - 2] = 0;
                for (j = p - 2; j >= k; j--) {
                    t = hypotenuse(s[j], f);
                    cs = s[j] / t;
                    sn = f / t;
                    s[j] = t;
                    if (j !== k) {
                        f = -sn * e[j - 1];
                        e[j - 1] = cs * e[j - 1];
                    }
                    if (wantv) {
                        for (i = 0; i < n; i++) {
                            t = cs * V[i][j] + sn * V[i][p - 1];
                            V[i][p - 1] = -sn * V[i][j] + cs * V[i][p - 1];
                            V[i][j] = t;
                        }
                    }
                }
                break;
            }
            case 2 : {
                f = e[k - 1];
                e[k - 1] = 0;
                for (j = k; j < p; j++) {
                    t = hypotenuse(s[j], f);
                    cs = s[j] / t;
                    sn = f / t;
                    s[j] = t;
                    f = -sn * e[j];
                    e[j] = cs * e[j];
                    if (wantu) {
                        for (i = 0; i < m; i++) {
                            t = cs * U[i][j] + sn * U[i][k - 1];
                            U[i][k - 1] = -sn * U[i][j] + cs * U[i][k - 1];
                            U[i][j] = t;
                        }
                    }
                }
                break;
            }
            case 3 : {
                scale = Math.max(Math.max(Math.max(Math.max(Math.abs(s[p - 1]), Math.abs(s[p - 2])), Math.abs(e[p - 2])), Math.abs(s[k])), Math.abs(e[k]));
                sp = s[p - 1] / scale;
                spm1 = s[p - 2] / scale;
                epm1 = e[p - 2] / scale;
                sk = s[k] / scale;
                ek = e[k] / scale;
                b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2;
                c = (sp * epm1) * (sp * epm1);
                shift = 0;
                if ((b !== 0) || (c !== 0)) {
                    shift = Math.sqrt(b * b + c);
                    if (b < 0) {
                        shift = -shift;
                    }
                    shift = c / (b + shift);
                }
                f = (sk + sp) * (sk - sp) + shift;
                g = sk * ek;
                for (j = k; j < p - 1; j++) {
                    t = hypotenuse(f, g);
                    cs = f / t;
                    sn = g / t;
                    if (j !== k) {
                        e[j - 1] = t;
                    }
                    f = cs * s[j] + sn * e[j];
                    e[j] = cs * e[j] - sn * s[j];
                    g = sn * s[j + 1];
                    s[j + 1] = cs * s[j + 1];
                    if (wantv) {
                        for (i = 0; i < n; i++) {
                            t = cs * V[i][j] + sn * V[i][j + 1];
                            V[i][j + 1] = -sn * V[i][j] + cs * V[i][j + 1];
                            V[i][j] = t;
                        }
                    }
                    t = hypotenuse(f, g);
                    cs = f / t;
                    sn = g / t;
                    s[j] = t;
                    f = cs * e[j] + sn * s[j + 1];
                    s[j + 1] = -sn * e[j] + cs * s[j + 1];
                    g = sn * e[j + 1];
                    e[j + 1] = cs * e[j + 1];
                    if (wantu && (j < m - 1)) {
                        for (i = 0; i < m; i++) {
                            t = cs * U[i][j] + sn * U[i][j + 1];
                            U[i][j + 1] = -sn * U[i][j] + cs * U[i][j + 1];
                            U[i][j] = t;
                        }
                    }
                }
                e[p - 2] = f;
                iter = iter + 1;
                break;
            }
            case 4: {
                if (s[k] <= 0) {
                    s[k] = (s[k] < 0 ? -s[k] : 0);
                    if (wantv) {
                        for (i = 0; i <= pp; i++) {
                            V[i][k] = -V[i][k];
                        }
                    }
                }
                while (k < pp) {
                    if (s[k] >= s[k + 1]) {
                        break;
                    }
                    t = s[k];
                    s[k] = s[k + 1];
                    s[k + 1] = t;
                    if (wantv && (k < n - 1)) {
                        for (i = 0; i < n; i++) {
                            t = V[i][k + 1];
                            V[i][k + 1] = V[i][k];
                            V[i][k] = t;
                        }
                    }
                    if (wantu && (k < m - 1)) {
                        for (i = 0; i < m; i++) {
                            t = U[i][k + 1];
                            U[i][k + 1] = U[i][k];
                            U[i][k] = t;
                        }
                    }
                    k++;
                }
                iter = 0;
                p--;
                break;
            }
            // no default
        }
    }

    if (swapped) {
        var tmp = V;
        V = U;
        U = tmp;
    }

    this.m = m;
    this.n = n;
    this.s = s;
    this.U = U;
    this.V = V;
}

SingularValueDecomposition.prototype = {
    get condition() {
        return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
    },
    get norm2() {
        return this.s[0];
    },
    get rank() {
        var eps = Math.pow(2, -52),
            tol = Math.max(this.m, this.n) * this.s[0] * eps,
            r = 0,
            s = this.s;
        for (var i = 0, ii = s.length; i < ii; i++) {
            if (s[i] > tol) {
                r++;
            }
        }
        return r;
    },
    get diagonal() {
        return this.s;
    },
    // https://github.com/accord-net/framework/blob/development/Sources/Accord.Math/Decompositions/SingularValueDecomposition.cs
    get threshold() {
        return (Math.pow(2, -52) / 2) * Math.max(this.m, this.n) * this.s[0];
    },
    get leftSingularVectors() {
        if (!Matrix.Matrix.isMatrix(this.U)) {
            this.U = new Matrix.Matrix(this.U);
        }
        return this.U;
    },
    get rightSingularVectors() {
        if (!Matrix.Matrix.isMatrix(this.V)) {
            this.V = new Matrix.Matrix(this.V);
        }
        return this.V;
    },
    get diagonalMatrix() {
        return Matrix.Matrix.diag(this.s);
    },
    solve: function (value) {

        var Y = value,
            e = this.threshold,
            scols = this.s.length,
            Ls = Matrix.Matrix.zeros(scols, scols),
            i;

        for (i = 0; i < scols; i++) {
            if (Math.abs(this.s[i]) <= e) {
                Ls[i][i] = 0;
            } else {
                Ls[i][i] = 1 / this.s[i];
            }
        }

        var U = this.U;
        var V = this.rightSingularVectors;

        var VL = V.mmul(Ls),
            vrows = V.rows,
            urows = U.length,
            VLU = Matrix.Matrix.zeros(vrows, urows),
            j, k, sum;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < urows; j++) {
                sum = 0;
                for (k = 0; k < scols; k++) {
                    sum += VL[i][k] * U[j][k];
                }
                VLU[i][j] = sum;
            }
        }

        return VLU.mmul(Y);
    },
    solveForDiagonal: function (value) {
        return this.solve(Matrix.Matrix.diag(value));
    },
    inverse: function () {
        var V = this.V;
        var e = this.threshold,
            vrows = V.length,
            vcols = V[0].length,
            X = new Matrix.Matrix(vrows, this.s.length),
            i, j;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < vcols; j++) {
                if (Math.abs(this.s[j]) > e) {
                    X[i][j] = V[i][j] / this.s[j];
                } else {
                    X[i][j] = 0;
                }
            }
        }

        var U = this.U;

        var urows = U.length,
            ucols = U[0].length,
            Y = new Matrix.Matrix(vrows, urows),
            k, sum;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < urows; j++) {
                sum = 0;
                for (k = 0; k < ucols; k++) {
                    sum += X[i][k] * U[j][k];
                }
                Y[i][j] = sum;
            }
        }

        return Y;
    }
};

module.exports = SingularValueDecomposition;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function compareNumbers(a, b) {
    return a - b;
}

/**
 * Computes the sum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.sum = function sum(values) {
    var sum = 0;
    for (var i = 0; i < values.length; i++) {
        sum += values[i];
    }
    return sum;
};

/**
 * Computes the maximum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.max = function max(values) {
    var max = values[0];
    var l = values.length;
    for (var i = 1; i < l; i++) {
        if (values[i] > max) max = values[i];
    }
    return max;
};

/**
 * Computes the minimum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.min = function min(values) {
    var min = values[0];
    var l = values.length;
    for (var i = 1; i < l; i++) {
        if (values[i] < min) min = values[i];
    }
    return min;
};

/**
 * Computes the min and max of the given values
 * @param {Array} values
 * @returns {{min: number, max: number}}
 */
exports.minMax = function minMax(values) {
    var min = values[0];
    var max = values[0];
    var l = values.length;
    for (var i = 1; i < l; i++) {
        if (values[i] < min) min = values[i];
        if (values[i] > max) max = values[i];
    }
    return {
        min: min,
        max: max
    };
};

/**
 * Computes the arithmetic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.arithmeticMean = function arithmeticMean(values) {
    var sum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        sum += values[i];
    }
    return sum / l;
};

/**
 * {@link arithmeticMean}
 */
exports.mean = exports.arithmeticMean;

/**
 * Computes the geometric mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.geometricMean = function geometricMean(values) {
    var mul = 1;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        mul *= values[i];
    }
    return Math.pow(mul, 1 / l);
};

/**
 * Computes the mean of the log of the given values
 * If the return value is exponentiated, it gives the same result as the
 * geometric mean.
 * @param {Array} values
 * @returns {number}
 */
exports.logMean = function logMean(values) {
    var lnsum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        lnsum += Math.log(values[i]);
    }
    return lnsum / l;
};

/**
 * Computes the weighted grand mean for a list of means and sample sizes
 * @param {Array} means - Mean values for each set of samples
 * @param {Array} samples - Number of original values for each set of samples
 * @returns {number}
 */
exports.grandMean = function grandMean(means, samples) {
    var sum = 0;
    var n = 0;
    var l = means.length;
    for (var i = 0; i < l; i++) {
        sum += samples[i] * means[i];
        n += samples[i];
    }
    return sum / n;
};

/**
 * Computes the truncated mean of the given values using a given percentage
 * @param {Array} values
 * @param {number} percent - The percentage of values to keep (range: [0,1])
 * @param {boolean} [alreadySorted=false]
 * @returns {number}
 */
exports.truncatedMean = function truncatedMean(values, percent, alreadySorted) {
    if (alreadySorted === undefined) alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }
    var l = values.length;
    var k = Math.floor(l * percent);
    var sum = 0;
    for (var i = k; i < (l - k); i++) {
        sum += values[i];
    }
    return sum / (l - 2 * k);
};

/**
 * Computes the harmonic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.harmonicMean = function harmonicMean(values) {
    var sum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        if (values[i] === 0) {
            throw new RangeError('value at index ' + i + 'is zero');
        }
        sum += 1 / values[i];
    }
    return l / sum;
};

/**
 * Computes the contraharmonic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.contraHarmonicMean = function contraHarmonicMean(values) {
    var r1 = 0;
    var r2 = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        r1 += values[i] * values[i];
        r2 += values[i];
    }
    if (r2 < 0) {
        throw new RangeError('sum of values is negative');
    }
    return r1 / r2;
};

/**
 * Computes the median of the given values
 * @param {Array} values
 * @param {boolean} [alreadySorted=false]
 * @returns {number}
 */
exports.median = function median(values, alreadySorted) {
    if (alreadySorted === undefined) alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }
    var l = values.length;
    var half = Math.floor(l / 2);
    if (l % 2 === 0) {
        return (values[half - 1] + values[half]) * 0.5;
    } else {
        return values[half];
    }
};

/**
 * Computes the variance of the given values
 * @param {Array} values
 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
 * @returns {number}
 */
exports.variance = function variance(values, unbiased) {
    if (unbiased === undefined) unbiased = true;
    var theMean = exports.mean(values);
    var theVariance = 0;
    var l = values.length;

    for (var i = 0; i < l; i++) {
        var x = values[i] - theMean;
        theVariance += x * x;
    }

    if (unbiased) {
        return theVariance / (l - 1);
    } else {
        return theVariance / l;
    }
};

/**
 * Computes the standard deviation of the given values
 * @param {Array} values
 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
 * @returns {number}
 */
exports.standardDeviation = function standardDeviation(values, unbiased) {
    return Math.sqrt(exports.variance(values, unbiased));
};

exports.standardError = function standardError(values) {
    return exports.standardDeviation(values) / Math.sqrt(values.length);
};

/**
 * IEEE Transactions on biomedical engineering, vol. 52, no. 1, january 2005, p. 76-
 * Calculate the standard deviation via the Median of the absolute deviation
 *  The formula for the standard deviation only holds for Gaussian random variables.
 * @returns {{mean: number, stdev: number}}
 */
exports.robustMeanAndStdev = function robustMeanAndStdev(y) {
    var mean = 0, stdev = 0;
    var length = y.length, i = 0;
    for (i = 0; i < length; i++) {
        mean += y[i];
    }
    mean /= length;
    var averageDeviations = new Array(length);
    for (i = 0; i < length; i++)
        averageDeviations[i] = Math.abs(y[i] - mean);
    averageDeviations.sort(compareNumbers);
    if (length % 2 === 1) {
        stdev = averageDeviations[(length - 1) / 2] / 0.6745;
    } else {
        stdev = 0.5 * (averageDeviations[length / 2] + averageDeviations[length / 2 - 1]) / 0.6745;
    }

    return {
        mean: mean,
        stdev: stdev
    };
};

exports.quartiles = function quartiles(values, alreadySorted) {
    if (typeof (alreadySorted) === 'undefined') alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }

    var quart = values.length / 4;
    var q1 = values[Math.ceil(quart) - 1];
    var q2 = exports.median(values, true);
    var q3 = values[Math.ceil(quart * 3) - 1];

    return {q1: q1, q2: q2, q3: q3};
};

exports.pooledStandardDeviation = function pooledStandardDeviation(samples, unbiased) {
    return Math.sqrt(exports.pooledVariance(samples, unbiased));
};

exports.pooledVariance = function pooledVariance(samples, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var sum = 0;
    var length = 0, l = samples.length;
    for (var i = 0; i < l; i++) {
        var values = samples[i];
        var vari = exports.variance(values);

        sum += (values.length - 1) * vari;

        if (unbiased)
            length += values.length - 1;
        else
            length += values.length;
    }
    return sum / length;
};

exports.mode = function mode(values) {
    var l = values.length,
        itemCount = new Array(l),
        i;
    for (i = 0; i < l; i++) {
        itemCount[i] = 0;
    }
    var itemArray = new Array(l);
    var count = 0;

    for (i = 0; i < l; i++) {
        var index = itemArray.indexOf(values[i]);
        if (index >= 0)
            itemCount[index]++;
        else {
            itemArray[count] = values[i];
            itemCount[count] = 1;
            count++;
        }
    }

    var maxValue = 0, maxIndex = 0;
    for (i = 0; i < count; i++) {
        if (itemCount[i] > maxValue) {
            maxValue = itemCount[i];
            maxIndex = i;
        }
    }

    return itemArray[maxIndex];
};

exports.covariance = function covariance(vector1, vector2, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var mean1 = exports.mean(vector1);
    var mean2 = exports.mean(vector2);

    if (vector1.length !== vector2.length)
        throw 'Vectors do not have the same dimensions';

    var cov = 0, l = vector1.length;
    for (var i = 0; i < l; i++) {
        var x = vector1[i] - mean1;
        var y = vector2[i] - mean2;
        cov += x * y;
    }

    if (unbiased)
        return cov / (l - 1);
    else
        return cov / l;
};

exports.skewness = function skewness(values, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var theMean = exports.mean(values);

    var s2 = 0, s3 = 0, l = values.length;
    for (var i = 0; i < l; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s3 += dev * dev * dev;
    }
    var m2 = s2 / l;
    var m3 = s3 / l;

    var g = m3 / (Math.pow(m2, 3 / 2.0));
    if (unbiased) {
        var a = Math.sqrt(l * (l - 1));
        var b = l - 2;
        return (a / b) * g;
    } else {
        return g;
    }
};

exports.kurtosis = function kurtosis(values, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var theMean = exports.mean(values);
    var n = values.length, s2 = 0, s4 = 0;

    for (var i = 0; i < n; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s4 += dev * dev * dev * dev;
    }
    var m2 = s2 / n;
    var m4 = s4 / n;

    if (unbiased) {
        var v = s2 / (n - 1);
        var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
        var b = s4 / (v * v);
        var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));

        return a * b - 3 * c;
    } else {
        return m4 / (m2 * m2) - 3;
    }
};

exports.entropy = function entropy(values, eps) {
    if (typeof (eps) === 'undefined') eps = 0;
    var sum = 0, l = values.length;
    for (var i = 0; i < l; i++)
        sum += values[i] * Math.log(values[i] + eps);
    return -sum;
};

exports.weightedMean = function weightedMean(values, weights) {
    var sum = 0, l = values.length;
    for (var i = 0; i < l; i++)
        sum += values[i] * weights[i];
    return sum;
};

exports.weightedStandardDeviation = function weightedStandardDeviation(values, weights) {
    return Math.sqrt(exports.weightedVariance(values, weights));
};

exports.weightedVariance = function weightedVariance(values, weights) {
    var theMean = exports.weightedMean(values, weights);
    var vari = 0, l = values.length;
    var a = 0, b = 0;

    for (var i = 0; i < l; i++) {
        var z = values[i] - theMean;
        var w = weights[i];

        vari += w * (z * z);
        b += w;
        a += w * w;
    }

    return vari * (b / (b * b - a));
};

exports.center = function center(values, inPlace) {
    if (typeof (inPlace) === 'undefined') inPlace = false;

    var result = values;
    if (!inPlace)
        result = [].concat(values);

    var theMean = exports.mean(result), l = result.length;
    for (var i = 0; i < l; i++)
        result[i] -= theMean;
};

exports.standardize = function standardize(values, standardDev, inPlace) {
    if (typeof (standardDev) === 'undefined') standardDev = exports.standardDeviation(values);
    if (typeof (inPlace) === 'undefined') inPlace = false;
    var l = values.length;
    var result = inPlace ? values : new Array(l);
    for (var i = 0; i < l; i++)
        result[i] = values[i] / standardDev;
    return result;
};

exports.cumulativeSum = function cumulativeSum(array) {
    var l = array.length;
    var result = new Array(l);
    result[0] = array[0];
    for (var i = 1; i < l; i++)
        result[i] = result[i - 1] + array[i];
    return result;
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.array = __webpack_require__(12);
exports.matrix = __webpack_require__(37);


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(41)(__webpack_require__(58));


/***/ }),
/* 15 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var OCLE = __webpack_require__(14);

var group = __webpack_require__(8);

module.exports = function queryByHose(molecule, db, options) {
    var atomLabel = options.atomLabel || 'H';
    var use = options.use;
    var algorithm = options.algorithm || 0;
    var levels = options.hoseLevels || [6, 5, 4, 3, 2];
    levels.sort(function (a, b) {
        return b - a;
    });
    var diaIDs = molecule.getGroupedDiastereotopicAtomIDs({ atomLabel });
    var infoCOSY = [];

    var atoms = {};
    var atomNumbers = [];
    var i, k, j, atom, hosesString;
    for (j = diaIDs.length - 1; j >= 0; j--) {
        hosesString = OCLE.Util.getHoseCodesFromDiastereotopicID(diaIDs[j].oclID, {
            maxSphereSize: levels[0],
            type: algorithm
        });
        atom = {
            diaIDs: [diaIDs[j].oclID + '']
        };
        for (k = 0; k < levels.length; k++) {
            atom['hose' + levels[k]] = hosesString[levels[k] - 1] + '';
        }
        for (k = diaIDs[j].atoms.length - 1; k >= 0; k--) {
            atoms[diaIDs[j].atoms[k]] = JSON.parse(JSON.stringify(atom));
            atomNumbers.push(diaIDs[j].atoms[k]);
        }
    }
    //Now, we twoD the chimical shift by using our copy of NMRShiftDB
    //var script2 = 'select chemicalShift FROM assignment where ';//hose5='dgH`EBYReZYiIjjjjj@OzP`NET'';
    var toReturn = new Array(atomNumbers.length);
    for (j = 0; j < atomNumbers.length; j++) {
        atom = atoms[atomNumbers[j]];
        var res;
        k = 0;
        //A really simple query
        while (!res && k < levels.length) {
            if (db[levels[k]]) {
                res = db[levels[k]][atom['hose' + levels[k]]];
            }
            k++;
        }
        if (!res) {
            res = { cs: null, ncs: 0, std: 0, min: 0, max: 0 }; //Default values
        }
        atom.atomLabel = atomLabel;
        atom.level = levels[k - 1];
        atom.delta = res.cs;
        if (use === 'median' && res.median) {
            atom.delta = res.median;
        } else if (use === 'mean' && res.mean) {
            atom.delta = res.mean;
        }
        atom.integral = 1;
        atom.atomIDs = ['' + atomNumbers[j]];
        atom.ncs = res.ncs;
        atom.std = res.std;
        atom.min = res.min;
        atom.max = res.max;
        atom.j = [];

        //Add the predicted couplings
        //console.log(atomNumbers[j]+' '+infoCOSY[0].atom1);
        for (i = infoCOSY.length - 1; i >= 0; i--) {
            if (infoCOSY[i].atom1 - 1 === atomNumbers[j] && infoCOSY[i].coupling > 2) {
                atom.j.push({
                    'assignment': infoCOSY[i].atom2 - 1 + '', //Put the diaID instead
                    'diaID': infoCOSY[i].diaID2,
                    'coupling': infoCOSY[i].coupling,
                    'multiplicity': 'd'
                });
            }
        }
        toReturn[j] = atom;
    }
    //TODO this will not work because getPaths is not implemented yet!!!!
    if (options.ignoreLabile) {
        var linksOH = molecule.getAllPaths({
            fromLabel: 'H',
            toLabel: 'O',
            minLength: 1,
            maxLength: 1
        });
        var linksNH = molecule.getAllPaths({
            fromLabel: 'H',
            toLabel: 'N',
            minLength: 1,
            maxLength: 1
        });
        for (j = toReturn.length - 1; j >= 0; j--) {
            for (k = 0; k < linksOH.length; k++) {
                if (toReturn[j].diaIDs[0] === linksOH[k].fromDiaID) {
                    toReturn.splice(j, 1);
                    break;
                }
            }
        }

        for (j = toReturn.length - 1; j >= 0; j--) {
            for (k = 0; k < linksNH.length; k++) {
                if (toReturn[j].diaIDs[0] === linksNH[k].fromDiaID) {
                    toReturn.splice(j, 1);
                    break;
                }
            }
        }
    }
    return group(toReturn, options);
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var Matrix = __webpack_require__(5);
var newArray = __webpack_require__(38);
var superagent = __webpack_require__(7);

var group = __webpack_require__(8);
var normalizeOptions = __webpack_require__(3);

/**
 * Makes a prediction using spinus
 * @param {string|Molecule} molecule
 * @param {object} [options]
 * @return {Promise<Array>}
 */
module.exports = function spinus(molecule, options) {
    var _normalizeOptions = normalizeOptions(molecule, options);

    var _normalizeOptions2 = _slicedToArray(_normalizeOptions, 2);

    molecule = _normalizeOptions2[0];
    options = _normalizeOptions2[1];

    return fromSpinus(molecule).then(prediction => group(prediction, options));
};

function fromSpinus(molecule) {
    var request = superagent.post('https://www.nmrdb.org/service/predictor');
    request.field('molfile', molecule.toMolfile());

    return request.then(response => {
        //Convert to the ranges format and include the diaID for each atomID
        var data = spinusParser(response.text);
        var ids = data.ids;
        var jc = data.couplingConstants;
        var cs = data.chemicalShifts;
        var multiplicity = data.multiplicity;
        var integrals = data.integrals;

        var nspins = cs.length;

        var diaIDs = molecule.getGroupedDiastereotopicAtomIDs({ atomLabel: 'H' });
        var result = new Array(nspins);
        var atoms = {};
        var atomNumbers = [];
        var i, j, k, oclID, tmpCS;
        var csByOclID = {};
        for (j = diaIDs.length - 1; j >= 0; j--) {
            oclID = diaIDs[j].oclID + '';
            for (k = diaIDs[j].atoms.length - 1; k >= 0; k--) {
                atoms[diaIDs[j].atoms[k]] = oclID;
                atomNumbers.push(diaIDs[j].atoms[k]);
                if (!csByOclID[oclID]) {
                    csByOclID[oclID] = { nc: 1, cs: cs[ids[diaIDs[j].atoms[k]]] };
                } else {
                    csByOclID[oclID].nc++;
                    csByOclID[oclID].cs += cs[ids[diaIDs[j].atoms[k]]];
                }
            }
        }

        //Average the entries for the equivalent protons
        var idsKeys = Object.keys(ids);
        for (i = 0; i < nspins; i++) {
            tmpCS = csByOclID[atoms[idsKeys[i]]].cs / csByOclID[atoms[idsKeys[i]]].nc;
            result[i] = {
                atomIDs: [idsKeys[i]],
                diaIDs: [atoms[idsKeys[i]]],
                integral: integrals[i],
                delta: tmpCS,
                atomLabel: 'H',
                j: []
            };

            for (j = 0; j < nspins; j++) {
                if (jc[i][j] !== 0) {
                    result[i].j.push({
                        assignment: idsKeys[j],
                        diaID: atoms[idsKeys[j]],
                        coupling: jc[i][j],
                        multiplicity: multiplicityToString(multiplicity[j])
                    });
                }
            }
        }

        return result;
    });
}

function spinusParser(result) {
    var lines = result.split('\n');
    var nspins = lines.length - 1;
    var cs = new Array(nspins);
    var integrals = new Array(nspins);
    var ids = {};
    var jc = Matrix.zeros(nspins, nspins);
    var i, j;

    for (i = 0; i < nspins; i++) {
        var tokens = lines[i].split('\t');
        cs[i] = +tokens[2];
        ids[tokens[0] - 1] = i;
        integrals[i] = 1; //+tokens[5];//Is it always 1??
    }

    for (i = 0; i < nspins; i++) {
        tokens = lines[i].split('\t');
        var nCoup = (tokens.length - 4) / 3;
        for (j = 0; j < nCoup; j++) {
            var withID = tokens[4 + 3 * j] - 1;
            var idx = ids[withID];
            jc[i][idx] = +tokens[6 + 3 * j];
        }
    }

    for (j = 0; j < nspins; j++) {
        for (i = j; i < nspins; i++) {
            jc[j][i] = jc[i][j];
        }
    }

    return {
        ids,
        chemicalShifts: cs,
        integrals,
        couplingConstants: jc,
        multiplicity: newArray(nspins, 2)
    };
}

function multiplicityToString(mul) {
    switch (mul) {
        case 2:
            return 'd';
        case 3:
            return 't';
        case 4:
            return 'q';
        default:
            return '';
    }
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var normalizeOptions = __webpack_require__(3);

module.exports = function twoD(dim1, dim2, molecule, options) {
    var _normalizeOptions = normalizeOptions(molecule, options);

    var _normalizeOptions2 = _slicedToArray(_normalizeOptions, 2);

    molecule = _normalizeOptions2[0];
    options = _normalizeOptions2[1];


    var fromAtomLabel = '';
    var toAtomLabel = '';
    if (dim1 && dim1.length > 0) {
        fromAtomLabel = dim1[0].atomLabel;
    }
    if (dim2 && dim2.length > 0) {
        toAtomLabel = dim2[0].atomLabel;
    }

    options = Object.assign({ minLength: 1, maxLength: 3 }, options, { fromLabel: fromAtomLabel, toLabel: toAtomLabel });

    var paths = molecule.getAllPaths(options);

    var idMap1 = {};
    dim1.forEach(prediction => idMap1[prediction.diaIDs[0]] = prediction);

    var idMap2 = {};
    dim2.forEach(prediction => idMap2[prediction.diaIDs[0]] = prediction);

    paths.forEach(element => {
        element.fromChemicalShift = idMap1[element.fromDiaID].delta;
        element.toChemicalShift = idMap2[element.toDiaID].delta;
        element.fromAtomLabel = fromAtomLabel;
        element.toAtomLabel = toAtomLabel;
        //@TODO Add the coupling constants in any case!!!!!!
        element.j = getCouplingConstant(idMap1, element.fromDiaID, element.toDiaID);
    });

    return paths;
};

function getCouplingConstant(idMap, fromDiaID, toDiaID) {
    var j = idMap[fromDiaID].j;
    if (j) {
        var index = j.length - 1;
        while (index-- > 0) {
            if (j[index].diaID === toDiaID) {
                return j[index].coupling;
            }
        }
    }
    return 0;
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Stat = __webpack_require__(13).array;
/**
 * Function that returns an array of points given 1D array as follows:
 *
 * [x1, y1, .. , x2, y2, ..]
 *
 * And receive the number of dimensions of each point.
 * @param array
 * @param dimensions
 * @returns {Array} - Array of points.
 */
function coordArrayToPoints(array, dimensions) {
    if(array.length % dimensions !== 0) {
        throw new RangeError('Dimensions number must be accordance with the size of the array.');
    }

    var length = array.length / dimensions;
    var pointsArr = new Array(length);

    var k = 0;
    for(var i = 0; i < array.length; i += dimensions) {
        var point = new Array(dimensions);
        for(var j = 0; j < dimensions; ++j) {
            point[j] = array[i + j];
        }

        pointsArr[k] = point;
        k++;
    }

    return pointsArr;
}


/**
 * Function that given an array as follows:
 * [x1, y1, .. , x2, y2, ..]
 *
 * Returns an array as follows:
 * [[x1, x2, ..], [y1, y2, ..], [ .. ]]
 *
 * And receives the number of dimensions of each coordinate.
 * @param array
 * @param dimensions
 * @returns {Array} - Matrix of coordinates
 */
function coordArrayToCoordMatrix(array, dimensions) {
    if(array.length % dimensions !== 0) {
        throw new RangeError('Dimensions number must be accordance with the size of the array.');
    }

    var coordinatesArray = new Array(dimensions);
    var points = array.length / dimensions;
    for (var i = 0; i < coordinatesArray.length; i++) {
        coordinatesArray[i] = new Array(points);
    }

    for(i = 0; i < array.length; i += dimensions) {
        for(var j = 0; j < dimensions; ++j) {
            var currentPoint = Math.floor(i / dimensions);
            coordinatesArray[j][currentPoint] = array[i + j];
        }
    }

    return coordinatesArray;
}

/**
 * Function that receives a coordinate matrix as follows:
 * [[x1, x2, ..], [y1, y2, ..], [ .. ]]
 *
 * Returns an array of coordinates as follows:
 * [x1, y1, .. , x2, y2, ..]
 *
 * @param coordMatrix
 * @returns {Array}
 */
function coordMatrixToCoordArray(coordMatrix) {
    var coodinatesArray = new Array(coordMatrix.length * coordMatrix[0].length);
    var k = 0;
    for(var i = 0; i < coordMatrix[0].length; ++i) {
        for(var j = 0; j < coordMatrix.length; ++j) {
            coodinatesArray[k] = coordMatrix[j][i];
            ++k;
        }
    }

    return coodinatesArray;
}

/**
 * Tranpose a matrix, this method is for coordMatrixToPoints and
 * pointsToCoordMatrix, that because only transposing the matrix
 * you can change your representation.
 *
 * @param matrix
 * @returns {Array}
 */
function transpose(matrix) {
    var resultMatrix = new Array(matrix[0].length);
    for(var i = 0; i < resultMatrix.length; ++i) {
        resultMatrix[i] = new Array(matrix.length);
    }

    for (i = 0; i < matrix.length; ++i) {
        for(var j = 0; j < matrix[0].length; ++j) {
            resultMatrix[j][i] = matrix[i][j];
        }
    }

    return resultMatrix;
}

/**
 * Function that transform an array of points into a coordinates array
 * as follows:
 * [x1, y1, .. , x2, y2, ..]
 *
 * @param points
 * @returns {Array}
 */
function pointsToCoordArray(points) {
    var coodinatesArray = new Array(points.length * points[0].length);
    var k = 0;
    for(var i = 0; i < points.length; ++i) {
        for(var j = 0; j < points[0].length; ++j) {
            coodinatesArray[k] = points[i][j];
            ++k;
        }
    }

    return coodinatesArray;
}

/**
 * Apply the dot product between the smaller vector and a subsets of the
 * largest one.
 *
 * @param firstVector
 * @param secondVector
 * @returns {Array} each dot product of size of the difference between the
 *                  larger and the smallest one.
 */
function applyDotProduct(firstVector, secondVector) {
    var largestVector, smallestVector;
    if(firstVector.length <= secondVector.length) {
        smallestVector = firstVector;
        largestVector = secondVector;
    } else {
        smallestVector = secondVector;
        largestVector = firstVector;
    }

    var difference = largestVector.length - smallestVector.length + 1;
    var dotProductApplied = new Array(difference);

    for (var i = 0; i < difference; ++i) {
        var sum = 0;
        for (var j = 0; j < smallestVector.length; ++j) {
            sum += smallestVector[j] * largestVector[i + j];
        }
        dotProductApplied[i] = sum;
    }

    return dotProductApplied;
}
/**
 * To scale the input array between the specified min and max values. The operation is performed inplace
 * if the options.inplace is specified. If only one of the min or max parameters is specified, then the scaling
 * will multiply the input array by min/min(input) or max/max(input)
 * @param input
 * @param options
 * @returns {*}
 */
function scale(input, options){
    var y;
    if(options.inPlace){
        y = input;
    }
    else{
        y = new Array(input.length);
    }
    const max = options.max;
    const min = options.min;
    if(typeof max === "number"){
        if(typeof min === "number"){
            var minMax = Stat.minMax(input);
            var factor = (max - min)/(minMax.max-minMax.min);
            for(var i=0;i< y.length;i++){
                y[i]=(input[i]-minMax.min)*factor+min;
            }
        }
        else{
            var currentMin = Stat.max(input);
            var factor = max/currentMin;
            for(var i=0;i< y.length;i++){
                y[i] = input[i]*factor;
            }
        }
    }
    else{
        if(typeof min === "number"){
            var currentMin = Stat.min(input);
            var factor = min/currentMin;
            for(var i=0;i< y.length;i++){
                y[i] = input[i]*factor;
            }
        }
    }
    return y;
}

module.exports = {
    coordArrayToPoints: coordArrayToPoints,
    coordArrayToCoordMatrix: coordArrayToCoordMatrix,
    coordMatrixToCoordArray: coordMatrixToCoordArray,
    coordMatrixToPoints: transpose,
    pointsToCoordArray: pointsToCoordArray,
    pointsToCoordMatrix: transpose,
    applyDotProduct: applyDotProduct,
    scale:scale
};



/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * Function that returns a Number array of equally spaced numberOfPoints
 * containing a representation of intensities of the spectra arguments x
 * and y.
 *
 * The options parameter contains an object in the following form:
 * from: starting point
 * to: last point
 * numberOfPoints: number of points between from and to
 * variant: "slot" or "smooth" - smooth is the default option
 *
 * The slot variant consist that each point in the new array is calculated
 * averaging the existing points between the slot that belongs to the current
 * value. The smooth variant is the same but takes the integral of the range
 * of the slot and divide by the step size between two points in the new array.
 *
 * @param x - sorted increasing x values
 * @param y
 * @param options
 * @returns {Array} new array with the equally spaced data.
 *
 */
function getEquallySpacedData(x, y, options) {
    if (x.length>1 && x[0]>x[1]) {
        x=x.slice().reverse();
        y=y.slice().reverse();
    }

    var xLength = x.length;
    if(xLength !== y.length)
        throw new RangeError("the x and y vector doesn't have the same size.");

    if (options === undefined) options = {};

    var from = options.from === undefined ? x[0] : options.from
    if (isNaN(from) || !isFinite(from)) {
        throw new RangeError("'From' value must be a number");
    }
    var to = options.to === undefined ? x[x.length - 1] : options.to;
    if (isNaN(to) || !isFinite(to)) {
        throw new RangeError("'To' value must be a number");
    }

    var reverse = from > to;
    if(reverse) {
        var temp = from;
        from = to;
        to = temp;
    }

    var numberOfPoints = options.numberOfPoints === undefined ? 100 : options.numberOfPoints;
    if (isNaN(numberOfPoints) || !isFinite(numberOfPoints)) {
        throw new RangeError("'Number of points' value must be a number");
    }
    if(numberOfPoints < 1)
        throw new RangeError("the number of point must be higher than 1");

    var algorithm = options.variant === "slot" ? "slot" : "smooth"; // default value: smooth

    var output = algorithm === "slot" ? getEquallySpacedSlot(x, y, from, to, numberOfPoints) : getEquallySpacedSmooth(x, y, from, to, numberOfPoints);

    return reverse ? output.reverse() : output;
}

/**
 * function that retrieves the getEquallySpacedData with the variant "smooth"
 *
 * @param x
 * @param y
 * @param from - Initial point
 * @param to - Final point
 * @param numberOfPoints
 * @returns {Array} - Array of y's equally spaced with the variant "smooth"
 */
function getEquallySpacedSmooth(x, y, from, to, numberOfPoints) {
    var xLength = x.length;

    var step = (to - from) / (numberOfPoints - 1);
    var halfStep = step / 2;

    var start = from - halfStep;
    var output = new Array(numberOfPoints);

    var initialOriginalStep = x[1] - x[0];
    var lastOriginalStep = x[x.length - 1] - x[x.length - 2];

    // Init main variables
    var min = start;
    var max = start + step;

    var previousX = Number.MIN_VALUE;
    var previousY = 0;
    var nextX = x[0] - initialOriginalStep;
    var nextY = 0;

    var currentValue = 0;
    var slope = 0;
    var intercept = 0;
    var sumAtMin = 0;
    var sumAtMax = 0;

    var i = 0; // index of input
    var j = 0; // index of output

    function getSlope(x0, y0, x1, y1) {
        return (y1 - y0) / (x1 - x0);
    }

    main: while(true) {
        while (nextX - max >= 0) {
            // no overlap with original point, just consume current value
            var add = integral(0, max - previousX, slope, previousY);
            sumAtMax = currentValue + add;

            output[j] = (sumAtMax - sumAtMin) / step;
            j++;

            if (j === numberOfPoints)
                break main;

            min = max;
            max += step;
            sumAtMin = sumAtMax;
        }

        if(previousX <= min && min <= nextX) {
            add = integral(0, min - previousX, slope, previousY);
            sumAtMin = currentValue + add;
        }

        currentValue += integral(previousX, nextX, slope, intercept);

        previousX = nextX;
        previousY = nextY;

        if (i < xLength) {
            nextX = x[i];
            nextY = y[i];
            i++;
        } else if (i === xLength) {
            nextX += lastOriginalStep;
            nextY = 0;
        }
        // updating parameters
        slope = getSlope(previousX, previousY, nextX, nextY);
        intercept = -slope*previousX + previousY;
    }

    return output;
}

/**
 * function that retrieves the getEquallySpacedData with the variant "slot"
 *
 * @param x
 * @param y
 * @param from - Initial point
 * @param to - Final point
 * @param numberOfPoints
 * @returns {Array} - Array of y's equally spaced with the variant "slot"
 */
function getEquallySpacedSlot(x, y, from, to, numberOfPoints) {
    var xLength = x.length;

    var step = (to - from) / (numberOfPoints - 1);
    var halfStep = step / 2;
    var lastStep = x[x.length - 1] - x[x.length - 2];

    var start = from - halfStep;
    var output = new Array(numberOfPoints);

    // Init main variables
    var min = start;
    var max = start + step;

    var previousX = -Number.MAX_VALUE;
    var previousY = 0;
    var nextX = x[0];
    var nextY = y[0];
    var frontOutsideSpectra = 0;
    var backOutsideSpectra = true;

    var currentValue = 0;

    // for slot algorithm
    var currentPoints = 0;

    var i = 1; // index of input
    var j = 0; // index of output

    main: while(true) {
        if (previousX>=nextX) throw (new Error('x must be an increasing serie'));
        while (previousX - max > 0) {
            // no overlap with original point, just consume current value
            if(backOutsideSpectra) {
                currentPoints++;
                backOutsideSpectra = false;
            }

            output[j] = currentPoints <= 0 ? 0 : currentValue / currentPoints;
            j++;

            if (j === numberOfPoints)
                break main;

            min = max;
            max += step;
            currentValue = 0;
            currentPoints = 0;
        }

        if(previousX > min) {
            currentValue += previousY;
            currentPoints++;
        }

        if(previousX === -Number.MAX_VALUE || frontOutsideSpectra > 1)
            currentPoints--;

        previousX = nextX;
        previousY = nextY;

        if (i < xLength) {
            nextX = x[i];
            nextY = y[i];
            i++;
        } else {
            nextX += lastStep;
            nextY = 0;
            frontOutsideSpectra++;
        }
    }

    return output;
}
/**
 * Function that calculates the integral of the line between two
 * x-coordinates, given the slope and intercept of the line.
 *
 * @param x0
 * @param x1
 * @param slope
 * @param intercept
 * @returns {number} integral value.
 */
function integral(x0, x1, slope, intercept) {
    return (0.5 * slope * x1 * x1 + intercept * x1) - (0.5 * slope * x0 * x0 + intercept * x0);
}

exports.getEquallySpacedData = getEquallySpacedData;
exports.integral = integral;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = exports = __webpack_require__(20);


exports.getEquallySpacedData = __webpack_require__(21).getEquallySpacedData;
exports.SNV = __webpack_require__(23).SNV;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.SNV = SNV;
var Stat = __webpack_require__(13).array;

/**
 * Function that applies the standard normal variate (SNV) to an array of values.
 *
 * @param data - Array of values.
 * @returns {Array} - applied the SNV.
 */
function SNV(data) {
    var mean = Stat.mean(data);
    var std = Stat.standardDeviation(data);
    var result = data.slice();
    for (var i = 0; i < data.length; i++) {
        result[i] = (result[i] - mean) / std;
    }
    return result;
}


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Matrix = __webpack_require__(5);

/**
 * Algorithm that finds the shortest distance from one node to the other
 * @param {Matrix} adjMatrix - A squared adjacency matrix
 * @return {Matrix} - Distance from a node to the other, -1 if the node is unreachable
 */
function floydWarshall(adjMatrix) {
    if (Matrix.isMatrix(adjMatrix) && (adjMatrix.columns !== adjMatrix.rows))
        throw new TypeError('The adjacency matrix should be squared');
    const numVertices = adjMatrix.columns;
    let distMatrix = new Matrix(numVertices, numVertices);
    distMatrix.apply((row, column) => {
        // principal diagonal is 0
        if (row === column)
            distMatrix.set(row, column, 0);
        else {
            let val = adjMatrix.get(row, column);
            // edges values remain the same
            if (val)
                distMatrix.set(row, column, val);
            // 0 values become infinity
            else
                distMatrix.set(row, column, Number.POSITIVE_INFINITY);
        }
    });

    for (let k = 0; k < numVertices; ++k)
        for (let i = 0; i < numVertices; ++i)
            for (let j = 0; j < numVertices; ++j) {
                let dist = distMatrix.get(i, k) + distMatrix.get(k, j);
                if (distMatrix.get(i, j) > dist)
                    distMatrix.set(i, j, dist);
            }

    // When there's no connection the value is -1
    distMatrix.apply((row, column) => {
        if (distMatrix.get(row, column) === Number.POSITIVE_INFINITY)
            distMatrix.set(row, column, -1);
    });
    return distMatrix;
}

module.exports = floydWarshall;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0).Matrix;

// https://github.com/lutzroeder/Mapack/blob/master/Source/CholeskyDecomposition.cs
function CholeskyDecomposition(value) {
    if (!(this instanceof CholeskyDecomposition)) {
        return new CholeskyDecomposition(value);
    }
    value = Matrix.checkMatrix(value);
    if (!value.isSymmetric()) {
        throw new Error('Matrix is not symmetric');
    }

    var a = value,
        dimension = a.rows,
        l = new Matrix(dimension, dimension),
        positiveDefinite = true,
        i, j, k;

    for (j = 0; j < dimension; j++) {
        var Lrowj = l[j];
        var d = 0;
        for (k = 0; k < j; k++) {
            var Lrowk = l[k];
            var s = 0;
            for (i = 0; i < k; i++) {
                s += Lrowk[i] * Lrowj[i];
            }
            Lrowj[k] = s = (a[j][k] - s) / l[k][k];
            d = d + s * s;
        }

        d = a[j][j] - d;

        positiveDefinite &= (d > 0);
        l[j][j] = Math.sqrt(Math.max(d, 0));
        for (k = j + 1; k < dimension; k++) {
            l[j][k] = 0;
        }
    }

    if (!positiveDefinite) {
        throw new Error('Matrix is not positive definite');
    }

    this.L = l;
}

CholeskyDecomposition.prototype = {
    get lowerTriangularMatrix() {
        return this.L;
    },
    solve: function (value) {
        value = Matrix.checkMatrix(value);

        var l = this.L,
            dimension = l.rows;

        if (value.rows !== dimension) {
            throw new Error('Matrix dimensions do not match');
        }

        var count = value.columns,
            B = value.clone(),
            i, j, k;

        for (k = 0; k < dimension; k++) {
            for (j = 0; j < count; j++) {
                for (i = 0; i < k; i++) {
                    B[k][j] -= B[i][j] * l[k][i];
                }
                B[k][j] /= l[k][k];
            }
        }

        for (k = dimension - 1; k >= 0; k--) {
            for (j = 0; j < count; j++) {
                for (i = k + 1; i < dimension; i++) {
                    B[k][j] -= B[i][j] * l[i][k];
                }
                B[k][j] /= l[k][k];
            }
        }

        return B;
    }
};

module.exports = CholeskyDecomposition;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Matrix = __webpack_require__(0).Matrix;
const util = __webpack_require__(4);
const hypotenuse = util.hypotenuse;
const getFilled2DArray = util.getFilled2DArray;

const defaultOptions = {
    assumeSymmetric: false
};

// https://github.com/lutzroeder/Mapack/blob/master/Source/EigenvalueDecomposition.cs
function EigenvalueDecomposition(matrix, options) {
    options = Object.assign({}, defaultOptions, options);
    if (!(this instanceof EigenvalueDecomposition)) {
        return new EigenvalueDecomposition(matrix, options);
    }
    matrix = Matrix.checkMatrix(matrix);
    if (!matrix.isSquare()) {
        throw new Error('Matrix is not a square matrix');
    }

    var n = matrix.columns,
        V = getFilled2DArray(n, n, 0),
        d = new Array(n),
        e = new Array(n),
        value = matrix,
        i, j;

    var isSymmetric = false;
    if (options.assumeSymmetric) {
        isSymmetric = true;
    } else {
        isSymmetric = matrix.isSymmetric();
    }

    if (isSymmetric) {
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                V[i][j] = value.get(i, j);
            }
        }
        tred2(n, e, d, V);
        tql2(n, e, d, V);
    } else {
        var H = getFilled2DArray(n, n, 0),
            ort = new Array(n);
        for (j = 0; j < n; j++) {
            for (i = 0; i < n; i++) {
                H[i][j] = value.get(i, j);
            }
        }
        orthes(n, H, ort, V);
        hqr2(n, e, d, V, H);
    }

    this.n = n;
    this.e = e;
    this.d = d;
    this.V = V;
}

EigenvalueDecomposition.prototype = {
    get realEigenvalues() {
        return this.d;
    },
    get imaginaryEigenvalues() {
        return this.e;
    },
    get eigenvectorMatrix() {
        if (!Matrix.isMatrix(this.V)) {
            this.V = new Matrix(this.V);
        }
        return this.V;
    },
    get diagonalMatrix() {
        var n = this.n,
            e = this.e,
            d = this.d,
            X = new Matrix(n, n),
            i, j;
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                X[i][j] = 0;
            }
            X[i][i] = d[i];
            if (e[i] > 0) {
                X[i][i + 1] = e[i];
            } else if (e[i] < 0) {
                X[i][i - 1] = e[i];
            }
        }
        return X;
    }
};

function tred2(n, e, d, V) {

    var f, g, h, i, j, k,
        hh, scale;

    for (j = 0; j < n; j++) {
        d[j] = V[n - 1][j];
    }

    for (i = n - 1; i > 0; i--) {
        scale = 0;
        h = 0;
        for (k = 0; k < i; k++) {
            scale = scale + Math.abs(d[k]);
        }

        if (scale === 0) {
            e[i] = d[i - 1];
            for (j = 0; j < i; j++) {
                d[j] = V[i - 1][j];
                V[i][j] = 0;
                V[j][i] = 0;
            }
        } else {
            for (k = 0; k < i; k++) {
                d[k] /= scale;
                h += d[k] * d[k];
            }

            f = d[i - 1];
            g = Math.sqrt(h);
            if (f > 0) {
                g = -g;
            }

            e[i] = scale * g;
            h = h - f * g;
            d[i - 1] = f - g;
            for (j = 0; j < i; j++) {
                e[j] = 0;
            }

            for (j = 0; j < i; j++) {
                f = d[j];
                V[j][i] = f;
                g = e[j] + V[j][j] * f;
                for (k = j + 1; k <= i - 1; k++) {
                    g += V[k][j] * d[k];
                    e[k] += V[k][j] * f;
                }
                e[j] = g;
            }

            f = 0;
            for (j = 0; j < i; j++) {
                e[j] /= h;
                f += e[j] * d[j];
            }

            hh = f / (h + h);
            for (j = 0; j < i; j++) {
                e[j] -= hh * d[j];
            }

            for (j = 0; j < i; j++) {
                f = d[j];
                g = e[j];
                for (k = j; k <= i - 1; k++) {
                    V[k][j] -= (f * e[k] + g * d[k]);
                }
                d[j] = V[i - 1][j];
                V[i][j] = 0;
            }
        }
        d[i] = h;
    }

    for (i = 0; i < n - 1; i++) {
        V[n - 1][i] = V[i][i];
        V[i][i] = 1;
        h = d[i + 1];
        if (h !== 0) {
            for (k = 0; k <= i; k++) {
                d[k] = V[k][i + 1] / h;
            }

            for (j = 0; j <= i; j++) {
                g = 0;
                for (k = 0; k <= i; k++) {
                    g += V[k][i + 1] * V[k][j];
                }
                for (k = 0; k <= i; k++) {
                    V[k][j] -= g * d[k];
                }
            }
        }

        for (k = 0; k <= i; k++) {
            V[k][i + 1] = 0;
        }
    }

    for (j = 0; j < n; j++) {
        d[j] = V[n - 1][j];
        V[n - 1][j] = 0;
    }

    V[n - 1][n - 1] = 1;
    e[0] = 0;
}

function tql2(n, e, d, V) {

    var g, h, i, j, k, l, m, p, r,
        dl1, c, c2, c3, el1, s, s2,
        iter;

    for (i = 1; i < n; i++) {
        e[i - 1] = e[i];
    }

    e[n - 1] = 0;

    var f = 0,
        tst1 = 0,
        eps = Math.pow(2, -52);

    for (l = 0; l < n; l++) {
        tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
        m = l;
        while (m < n) {
            if (Math.abs(e[m]) <= eps * tst1) {
                break;
            }
            m++;
        }

        if (m > l) {
            iter = 0;
            do {
                iter = iter + 1;

                g = d[l];
                p = (d[l + 1] - g) / (2 * e[l]);
                r = hypotenuse(p, 1);
                if (p < 0) {
                    r = -r;
                }

                d[l] = e[l] / (p + r);
                d[l + 1] = e[l] * (p + r);
                dl1 = d[l + 1];
                h = g - d[l];
                for (i = l + 2; i < n; i++) {
                    d[i] -= h;
                }

                f = f + h;

                p = d[m];
                c = 1;
                c2 = c;
                c3 = c;
                el1 = e[l + 1];
                s = 0;
                s2 = 0;
                for (i = m - 1; i >= l; i--) {
                    c3 = c2;
                    c2 = c;
                    s2 = s;
                    g = c * e[i];
                    h = c * p;
                    r = hypotenuse(p, e[i]);
                    e[i + 1] = s * r;
                    s = e[i] / r;
                    c = p / r;
                    p = c * d[i] - s * g;
                    d[i + 1] = h + s * (c * g + s * d[i]);

                    for (k = 0; k < n; k++) {
                        h = V[k][i + 1];
                        V[k][i + 1] = s * V[k][i] + c * h;
                        V[k][i] = c * V[k][i] - s * h;
                    }
                }

                p = -s * s2 * c3 * el1 * e[l] / dl1;
                e[l] = s * p;
                d[l] = c * p;

            }
            while (Math.abs(e[l]) > eps * tst1);
        }
        d[l] = d[l] + f;
        e[l] = 0;
    }

    for (i = 0; i < n - 1; i++) {
        k = i;
        p = d[i];
        for (j = i + 1; j < n; j++) {
            if (d[j] < p) {
                k = j;
                p = d[j];
            }
        }

        if (k !== i) {
            d[k] = d[i];
            d[i] = p;
            for (j = 0; j < n; j++) {
                p = V[j][i];
                V[j][i] = V[j][k];
                V[j][k] = p;
            }
        }
    }
}

function orthes(n, H, ort, V) {

    var low = 0,
        high = n - 1,
        f, g, h, i, j, m,
        scale;

    for (m = low + 1; m <= high - 1; m++) {
        scale = 0;
        for (i = m; i <= high; i++) {
            scale = scale + Math.abs(H[i][m - 1]);
        }

        if (scale !== 0) {
            h = 0;
            for (i = high; i >= m; i--) {
                ort[i] = H[i][m - 1] / scale;
                h += ort[i] * ort[i];
            }

            g = Math.sqrt(h);
            if (ort[m] > 0) {
                g = -g;
            }

            h = h - ort[m] * g;
            ort[m] = ort[m] - g;

            for (j = m; j < n; j++) {
                f = 0;
                for (i = high; i >= m; i--) {
                    f += ort[i] * H[i][j];
                }

                f = f / h;
                for (i = m; i <= high; i++) {
                    H[i][j] -= f * ort[i];
                }
            }

            for (i = 0; i <= high; i++) {
                f = 0;
                for (j = high; j >= m; j--) {
                    f += ort[j] * H[i][j];
                }

                f = f / h;
                for (j = m; j <= high; j++) {
                    H[i][j] -= f * ort[j];
                }
            }

            ort[m] = scale * ort[m];
            H[m][m - 1] = scale * g;
        }
    }

    for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
            V[i][j] = (i === j ? 1 : 0);
        }
    }

    for (m = high - 1; m >= low + 1; m--) {
        if (H[m][m - 1] !== 0) {
            for (i = m + 1; i <= high; i++) {
                ort[i] = H[i][m - 1];
            }

            for (j = m; j <= high; j++) {
                g = 0;
                for (i = m; i <= high; i++) {
                    g += ort[i] * V[i][j];
                }

                g = (g / ort[m]) / H[m][m - 1];
                for (i = m; i <= high; i++) {
                    V[i][j] += g * ort[i];
                }
            }
        }
    }
}

function hqr2(nn, e, d, V, H) {
    var n = nn - 1,
        low = 0,
        high = nn - 1,
        eps = Math.pow(2, -52),
        exshift = 0,
        norm = 0,
        p = 0,
        q = 0,
        r = 0,
        s = 0,
        z = 0,
        iter = 0,
        i, j, k, l, m, t, w, x, y,
        ra, sa, vr, vi,
        notlast, cdivres;

    for (i = 0; i < nn; i++) {
        if (i < low || i > high) {
            d[i] = H[i][i];
            e[i] = 0;
        }

        for (j = Math.max(i - 1, 0); j < nn; j++) {
            norm = norm + Math.abs(H[i][j]);
        }
    }

    while (n >= low) {
        l = n;
        while (l > low) {
            s = Math.abs(H[l - 1][l - 1]) + Math.abs(H[l][l]);
            if (s === 0) {
                s = norm;
            }
            if (Math.abs(H[l][l - 1]) < eps * s) {
                break;
            }
            l--;
        }

        if (l === n) {
            H[n][n] = H[n][n] + exshift;
            d[n] = H[n][n];
            e[n] = 0;
            n--;
            iter = 0;
        } else if (l === n - 1) {
            w = H[n][n - 1] * H[n - 1][n];
            p = (H[n - 1][n - 1] - H[n][n]) / 2;
            q = p * p + w;
            z = Math.sqrt(Math.abs(q));
            H[n][n] = H[n][n] + exshift;
            H[n - 1][n - 1] = H[n - 1][n - 1] + exshift;
            x = H[n][n];

            if (q >= 0) {
                z = (p >= 0) ? (p + z) : (p - z);
                d[n - 1] = x + z;
                d[n] = d[n - 1];
                if (z !== 0) {
                    d[n] = x - w / z;
                }
                e[n - 1] = 0;
                e[n] = 0;
                x = H[n][n - 1];
                s = Math.abs(x) + Math.abs(z);
                p = x / s;
                q = z / s;
                r = Math.sqrt(p * p + q * q);
                p = p / r;
                q = q / r;

                for (j = n - 1; j < nn; j++) {
                    z = H[n - 1][j];
                    H[n - 1][j] = q * z + p * H[n][j];
                    H[n][j] = q * H[n][j] - p * z;
                }

                for (i = 0; i <= n; i++) {
                    z = H[i][n - 1];
                    H[i][n - 1] = q * z + p * H[i][n];
                    H[i][n] = q * H[i][n] - p * z;
                }

                for (i = low; i <= high; i++) {
                    z = V[i][n - 1];
                    V[i][n - 1] = q * z + p * V[i][n];
                    V[i][n] = q * V[i][n] - p * z;
                }
            } else {
                d[n - 1] = x + p;
                d[n] = x + p;
                e[n - 1] = z;
                e[n] = -z;
            }

            n = n - 2;
            iter = 0;
        } else {
            x = H[n][n];
            y = 0;
            w = 0;
            if (l < n) {
                y = H[n - 1][n - 1];
                w = H[n][n - 1] * H[n - 1][n];
            }

            if (iter === 10) {
                exshift += x;
                for (i = low; i <= n; i++) {
                    H[i][i] -= x;
                }
                s = Math.abs(H[n][n - 1]) + Math.abs(H[n - 1][n - 2]);
                x = y = 0.75 * s;
                w = -0.4375 * s * s;
            }

            if (iter === 30) {
                s = (y - x) / 2;
                s = s * s + w;
                if (s > 0) {
                    s = Math.sqrt(s);
                    if (y < x) {
                        s = -s;
                    }
                    s = x - w / ((y - x) / 2 + s);
                    for (i = low; i <= n; i++) {
                        H[i][i] -= s;
                    }
                    exshift += s;
                    x = y = w = 0.964;
                }
            }

            iter = iter + 1;

            m = n - 2;
            while (m >= l) {
                z = H[m][m];
                r = x - z;
                s = y - z;
                p = (r * s - w) / H[m + 1][m] + H[m][m + 1];
                q = H[m + 1][m + 1] - z - r - s;
                r = H[m + 2][m + 1];
                s = Math.abs(p) + Math.abs(q) + Math.abs(r);
                p = p / s;
                q = q / s;
                r = r / s;
                if (m === l) {
                    break;
                }
                if (Math.abs(H[m][m - 1]) * (Math.abs(q) + Math.abs(r)) < eps * (Math.abs(p) * (Math.abs(H[m - 1][m - 1]) + Math.abs(z) + Math.abs(H[m + 1][m + 1])))) {
                    break;
                }
                m--;
            }

            for (i = m + 2; i <= n; i++) {
                H[i][i - 2] = 0;
                if (i > m + 2) {
                    H[i][i - 3] = 0;
                }
            }

            for (k = m; k <= n - 1; k++) {
                notlast = (k !== n - 1);
                if (k !== m) {
                    p = H[k][k - 1];
                    q = H[k + 1][k - 1];
                    r = (notlast ? H[k + 2][k - 1] : 0);
                    x = Math.abs(p) + Math.abs(q) + Math.abs(r);
                    if (x !== 0) {
                        p = p / x;
                        q = q / x;
                        r = r / x;
                    }
                }

                if (x === 0) {
                    break;
                }

                s = Math.sqrt(p * p + q * q + r * r);
                if (p < 0) {
                    s = -s;
                }

                if (s !== 0) {
                    if (k !== m) {
                        H[k][k - 1] = -s * x;
                    } else if (l !== m) {
                        H[k][k - 1] = -H[k][k - 1];
                    }

                    p = p + s;
                    x = p / s;
                    y = q / s;
                    z = r / s;
                    q = q / p;
                    r = r / p;

                    for (j = k; j < nn; j++) {
                        p = H[k][j] + q * H[k + 1][j];
                        if (notlast) {
                            p = p + r * H[k + 2][j];
                            H[k + 2][j] = H[k + 2][j] - p * z;
                        }

                        H[k][j] = H[k][j] - p * x;
                        H[k + 1][j] = H[k + 1][j] - p * y;
                    }

                    for (i = 0; i <= Math.min(n, k + 3); i++) {
                        p = x * H[i][k] + y * H[i][k + 1];
                        if (notlast) {
                            p = p + z * H[i][k + 2];
                            H[i][k + 2] = H[i][k + 2] - p * r;
                        }

                        H[i][k] = H[i][k] - p;
                        H[i][k + 1] = H[i][k + 1] - p * q;
                    }

                    for (i = low; i <= high; i++) {
                        p = x * V[i][k] + y * V[i][k + 1];
                        if (notlast) {
                            p = p + z * V[i][k + 2];
                            V[i][k + 2] = V[i][k + 2] - p * r;
                        }

                        V[i][k] = V[i][k] - p;
                        V[i][k + 1] = V[i][k + 1] - p * q;
                    }
                }
            }
        }
    }

    if (norm === 0) {
        return;
    }

    for (n = nn - 1; n >= 0; n--) {
        p = d[n];
        q = e[n];

        if (q === 0) {
            l = n;
            H[n][n] = 1;
            for (i = n - 1; i >= 0; i--) {
                w = H[i][i] - p;
                r = 0;
                for (j = l; j <= n; j++) {
                    r = r + H[i][j] * H[j][n];
                }

                if (e[i] < 0) {
                    z = w;
                    s = r;
                } else {
                    l = i;
                    if (e[i] === 0) {
                        H[i][n] = (w !== 0) ? (-r / w) : (-r / (eps * norm));
                    } else {
                        x = H[i][i + 1];
                        y = H[i + 1][i];
                        q = (d[i] - p) * (d[i] - p) + e[i] * e[i];
                        t = (x * s - z * r) / q;
                        H[i][n] = t;
                        H[i + 1][n] = (Math.abs(x) > Math.abs(z)) ? ((-r - w * t) / x) : ((-s - y * t) / z);
                    }

                    t = Math.abs(H[i][n]);
                    if ((eps * t) * t > 1) {
                        for (j = i; j <= n; j++) {
                            H[j][n] = H[j][n] / t;
                        }
                    }
                }
            }
        } else if (q < 0) {
            l = n - 1;

            if (Math.abs(H[n][n - 1]) > Math.abs(H[n - 1][n])) {
                H[n - 1][n - 1] = q / H[n][n - 1];
                H[n - 1][n] = -(H[n][n] - p) / H[n][n - 1];
            } else {
                cdivres = cdiv(0, -H[n - 1][n], H[n - 1][n - 1] - p, q);
                H[n - 1][n - 1] = cdivres[0];
                H[n - 1][n] = cdivres[1];
            }

            H[n][n - 1] = 0;
            H[n][n] = 1;
            for (i = n - 2; i >= 0; i--) {
                ra = 0;
                sa = 0;
                for (j = l; j <= n; j++) {
                    ra = ra + H[i][j] * H[j][n - 1];
                    sa = sa + H[i][j] * H[j][n];
                }

                w = H[i][i] - p;

                if (e[i] < 0) {
                    z = w;
                    r = ra;
                    s = sa;
                } else {
                    l = i;
                    if (e[i] === 0) {
                        cdivres = cdiv(-ra, -sa, w, q);
                        H[i][n - 1] = cdivres[0];
                        H[i][n] = cdivres[1];
                    } else {
                        x = H[i][i + 1];
                        y = H[i + 1][i];
                        vr = (d[i] - p) * (d[i] - p) + e[i] * e[i] - q * q;
                        vi = (d[i] - p) * 2 * q;
                        if (vr === 0 && vi === 0) {
                            vr = eps * norm * (Math.abs(w) + Math.abs(q) + Math.abs(x) + Math.abs(y) + Math.abs(z));
                        }
                        cdivres = cdiv(x * r - z * ra + q * sa, x * s - z * sa - q * ra, vr, vi);
                        H[i][n - 1] = cdivres[0];
                        H[i][n] = cdivres[1];
                        if (Math.abs(x) > (Math.abs(z) + Math.abs(q))) {
                            H[i + 1][n - 1] = (-ra - w * H[i][n - 1] + q * H[i][n]) / x;
                            H[i + 1][n] = (-sa - w * H[i][n] - q * H[i][n - 1]) / x;
                        } else {
                            cdivres = cdiv(-r - y * H[i][n - 1], -s - y * H[i][n], z, q);
                            H[i + 1][n - 1] = cdivres[0];
                            H[i + 1][n] = cdivres[1];
                        }
                    }

                    t = Math.max(Math.abs(H[i][n - 1]), Math.abs(H[i][n]));
                    if ((eps * t) * t > 1) {
                        for (j = i; j <= n; j++) {
                            H[j][n - 1] = H[j][n - 1] / t;
                            H[j][n] = H[j][n] / t;
                        }
                    }
                }
            }
        }
    }

    for (i = 0; i < nn; i++) {
        if (i < low || i > high) {
            for (j = i; j < nn; j++) {
                V[i][j] = H[i][j];
            }
        }
    }

    for (j = nn - 1; j >= low; j--) {
        for (i = low; i <= high; i++) {
            z = 0;
            for (k = low; k <= Math.min(j, high); k++) {
                z = z + V[i][k] * H[k][j];
            }
            V[i][j] = z;
        }
    }
}

function cdiv(xr, xi, yr, yi) {
    var r, d;
    if (Math.abs(yr) > Math.abs(yi)) {
        r = yi / yr;
        d = yr + r * yi;
        return [(xr + r * xi) / d, (xi - r * xr) / d];
    } else {
        r = yr / yi;
        d = yi + r * yr;
        return [(r * xr + xi) / d, (r * xi - xr) / d];
    }
}

module.exports = EigenvalueDecomposition;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0).Matrix;
var hypotenuse = __webpack_require__(4).hypotenuse;

//https://github.com/lutzroeder/Mapack/blob/master/Source/QrDecomposition.cs
function QrDecomposition(value) {
    if (!(this instanceof QrDecomposition)) {
        return new QrDecomposition(value);
    }
    value = Matrix.checkMatrix(value);

    var qr = value.clone(),
        m = value.rows,
        n = value.columns,
        rdiag = new Array(n),
        i, j, k, s;

    for (k = 0; k < n; k++) {
        var nrm = 0;
        for (i = k; i < m; i++) {
            nrm = hypotenuse(nrm, qr[i][k]);
        }
        if (nrm !== 0) {
            if (qr[k][k] < 0) {
                nrm = -nrm;
            }
            for (i = k; i < m; i++) {
                qr[i][k] /= nrm;
            }
            qr[k][k] += 1;
            for (j = k + 1; j < n; j++) {
                s = 0;
                for (i = k; i < m; i++) {
                    s += qr[i][k] * qr[i][j];
                }
                s = -s / qr[k][k];
                for (i = k; i < m; i++) {
                    qr[i][j] += s * qr[i][k];
                }
            }
        }
        rdiag[k] = -nrm;
    }

    this.QR = qr;
    this.Rdiag = rdiag;
}

QrDecomposition.prototype = {
    solve: function (value) {
        value = Matrix.checkMatrix(value);

        var qr = this.QR,
            m = qr.rows;

        if (value.rows !== m) {
            throw new Error('Matrix row dimensions must agree');
        }
        if (!this.isFullRank()) {
            throw new Error('Matrix is rank deficient');
        }

        var count = value.columns;
        var X = value.clone();
        var n = qr.columns;
        var i, j, k, s;

        for (k = 0; k < n; k++) {
            for (j = 0; j < count; j++) {
                s = 0;
                for (i = k; i < m; i++) {
                    s += qr[i][k] * X[i][j];
                }
                s = -s / qr[k][k];
                for (i = k; i < m; i++) {
                    X[i][j] += s * qr[i][k];
                }
            }
        }
        for (k = n - 1; k >= 0; k--) {
            for (j = 0; j < count; j++) {
                X[k][j] /= this.Rdiag[k];
            }
            for (i = 0; i < k; i++) {
                for (j = 0; j < count; j++) {
                    X[i][j] -= X[k][j] * qr[i][k];
                }
            }
        }

        return X.subMatrix(0, n - 1, 0, count - 1);
    },
    isFullRank: function () {
        var columns = this.QR.columns;
        for (var i = 0; i < columns; i++) {
            if (this.Rdiag[i] === 0) {
                return false;
            }
        }
        return true;
    },
    get upperTriangularMatrix() {
        var qr = this.QR,
            n = qr.columns,
            X = new Matrix(n, n),
            i, j;
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                if (i < j) {
                    X[i][j] = qr[i][j];
                } else if (i === j) {
                    X[i][j] = this.Rdiag[i];
                } else {
                    X[i][j] = 0;
                }
            }
        }
        return X;
    },
    get orthogonalMatrix() {
        var qr = this.QR,
            rows = qr.rows,
            columns = qr.columns,
            X = new Matrix(rows, columns),
            i, j, k, s;

        for (k = columns - 1; k >= 0; k--) {
            for (i = 0; i < rows; i++) {
                X[i][k] = 0;
            }
            X[k][k] = 1;
            for (j = k; j < columns; j++) {
                if (qr[k][k] !== 0) {
                    s = 0;
                    for (i = k; i < rows; i++) {
                        s += qr[i][k] * X[i][j];
                    }

                    s = -s / qr[k][k];

                    for (i = k; i < rows; i++) {
                        X[i][j] += s * qr[i][k];
                    }
                }
            }
        }
        return X;
    }
};

module.exports = QrDecomposition;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0).Matrix;

var SingularValueDecomposition = __webpack_require__(11);
var EigenvalueDecomposition = __webpack_require__(26);
var LuDecomposition = __webpack_require__(10);
var QrDecomposition = __webpack_require__(27);
var CholeskyDecomposition = __webpack_require__(25);

function inverse(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    return solve(matrix, Matrix.eye(matrix.rows));
}

/**
 * Returns the inverse
 * @memberOf Matrix
 * @static
 * @param {Matrix} matrix
 * @return {Matrix} matrix
 * @alias inv
 */
Matrix.inverse = Matrix.inv = inverse;

/**
 * Returns the inverse
 * @memberOf Matrix
 * @static
 * @param {Matrix} matrix
 * @return {Matrix} matrix
 * @alias inv
 */
Matrix.prototype.inverse = Matrix.prototype.inv = function () {
    return inverse(this);
};

function solve(leftHandSide, rightHandSide) {
    leftHandSide = Matrix.checkMatrix(leftHandSide);
    rightHandSide = Matrix.checkMatrix(rightHandSide);
    return leftHandSide.isSquare() ? new LuDecomposition(leftHandSide).solve(rightHandSide) : new QrDecomposition(leftHandSide).solve(rightHandSide);
}

Matrix.solve = solve;
Matrix.prototype.solve = function (other) {
    return solve(this, other);
};

module.exports = {
    SingularValueDecomposition: SingularValueDecomposition,
    SVD: SingularValueDecomposition,
    EigenvalueDecomposition: EigenvalueDecomposition,
    EVD: EigenvalueDecomposition,
    LuDecomposition: LuDecomposition,
    LU: LuDecomposition,
    QrDecomposition: QrDecomposition,
    QR: QrDecomposition,
    CholeskyDecomposition: CholeskyDecomposition,
    CHO: CholeskyDecomposition,
    inverse: inverse,
    solve: solve
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (!Symbol.species) {
    Symbol.species = Symbol.for('@@species');
}


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(1);

class MatrixColumnView extends BaseView {
    constructor(matrix, column) {
        super(matrix, matrix.rows, 1);
        this.column = column;
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(rowIndex, this.column, value);
        return this;
    }

    get(rowIndex) {
        return this.matrix.get(rowIndex, this.column);
    }
}

module.exports = MatrixColumnView;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(1);

class MatrixFlipColumnView extends BaseView {
    constructor(matrix) {
        super(matrix, matrix.rows, matrix.columns);
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(rowIndex, this.columns - columnIndex - 1, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(rowIndex, this.columns - columnIndex - 1);
    }
}

module.exports = MatrixFlipColumnView;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(1);

class MatrixFlipRowView extends BaseView {
    constructor(matrix) {
        super(matrix, matrix.rows, matrix.columns);
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(this.rows - rowIndex - 1, columnIndex, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(this.rows - rowIndex - 1, columnIndex);
    }
}

module.exports = MatrixFlipRowView;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(1);

class MatrixRowView extends BaseView {
    constructor(matrix, row) {
        super(matrix, 1, matrix.columns);
        this.row = row;
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(this.row, columnIndex, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(this.row, columnIndex);
    }
}

module.exports = MatrixRowView;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(1);
var util = __webpack_require__(2);

class MatrixSelectionView extends BaseView {
    constructor(matrix, rowIndices, columnIndices) {
        var indices = util.checkIndices(matrix, rowIndices, columnIndices);
        super(matrix, indices.row.length, indices.column.length);
        this.rowIndices = indices.row;
        this.columnIndices = indices.column;
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(this.rowIndices[rowIndex], this.columnIndices[columnIndex], value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(this.rowIndices[rowIndex], this.columnIndices[columnIndex]);
    }
}

module.exports = MatrixSelectionView;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(1);
var util = __webpack_require__(2);

class MatrixSubView extends BaseView {
    constructor(matrix, startRow, endRow, startColumn, endColumn) {
        util.checkRange(matrix, startRow, endRow, startColumn, endColumn);
        super(matrix, endRow - startRow + 1, endColumn - startColumn + 1);
        this.startRow = startRow;
        this.startColumn = startColumn;
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(this.startRow + rowIndex, this.startColumn + columnIndex, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(this.startRow + rowIndex, this.startColumn + columnIndex);
    }
}

module.exports = MatrixSubView;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(1);

class MatrixTransposeView extends BaseView {
    constructor(matrix) {
        super(matrix, matrix.columns, matrix.rows);
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(columnIndex, rowIndex, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(columnIndex, rowIndex);
    }
}

module.exports = MatrixTransposeView;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var arrayStat = __webpack_require__(12);

function compareNumbers(a, b) {
    return a - b;
}

exports.max = function max(matrix) {
    var max = -Infinity;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] > max) max = matrix[i][j];
        }
    }
    return max;
};

exports.min = function min(matrix) {
    var min = Infinity;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] < min) min = matrix[i][j];
        }
    }
    return min;
};

exports.minMax = function minMax(matrix) {
    var min = Infinity;
    var max = -Infinity;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] < min) min = matrix[i][j];
            if (matrix[i][j] > max) max = matrix[i][j];
        }
    }
    return {
        min:min,
        max:max
    };
};

exports.entropy = function entropy(matrix, eps) {
    if (typeof (eps) === 'undefined') {
        eps = 0;
    }
    var sum = 0,
        l1 = matrix.length,
        l2 = matrix[0].length;
    for (var i = 0; i < l1; i++) {
        for (var j = 0; j < l2; j++) {
            sum += matrix[i][j] * Math.log(matrix[i][j] + eps);
        }
    }
    return -sum;
};

exports.mean = function mean(matrix, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length,
        cols = matrix[0].length,
        theMean, N, i, j;

    if (dimension === -1) {
        theMean = [0];
        N = rows * cols;
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                theMean[0] += matrix[i][j];
            }
        }
        theMean[0] /= N;
    } else if (dimension === 0) {
        theMean = new Array(cols);
        N = rows;
        for (j = 0; j < cols; j++) {
            theMean[j] = 0;
            for (i = 0; i < rows; i++) {
                theMean[j] += matrix[i][j];
            }
            theMean[j] /= N;
        }
    } else if (dimension === 1) {
        theMean = new Array(rows);
        N = cols;
        for (j = 0; j < rows; j++) {
            theMean[j] = 0;
            for (i = 0; i < cols; i++) {
                theMean[j] += matrix[j][i];
            }
            theMean[j] /= N;
        }
    } else {
        throw new Error('Invalid dimension');
    }
    return theMean;
};

exports.sum = function sum(matrix, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length,
        cols = matrix[0].length,
        theSum, i, j;

    if (dimension === -1) {
        theSum = [0];
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                theSum[0] += matrix[i][j];
            }
        }
    } else if (dimension === 0) {
        theSum = new Array(cols);
        for (j = 0; j < cols; j++) {
            theSum[j] = 0;
            for (i = 0; i < rows; i++) {
                theSum[j] += matrix[i][j];
            }
        }
    } else if (dimension === 1) {
        theSum = new Array(rows);
        for (j = 0; j < rows; j++) {
            theSum[j] = 0;
            for (i = 0; i < cols; i++) {
                theSum[j] += matrix[j][i];
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }
    return theSum;
};

exports.product = function product(matrix, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length,
        cols = matrix[0].length,
        theProduct, i, j;

    if (dimension === -1) {
        theProduct = [1];
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                theProduct[0] *= matrix[i][j];
            }
        }
    } else if (dimension === 0) {
        theProduct = new Array(cols);
        for (j = 0; j < cols; j++) {
            theProduct[j] = 1;
            for (i = 0; i < rows; i++) {
                theProduct[j] *= matrix[i][j];
            }
        }
    } else if (dimension === 1) {
        theProduct = new Array(rows);
        for (j = 0; j < rows; j++) {
            theProduct[j] = 1;
            for (i = 0; i < cols; i++) {
                theProduct[j] *= matrix[j][i];
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }
    return theProduct;
};

exports.standardDeviation = function standardDeviation(matrix, means, unbiased) {
    var vari = exports.variance(matrix, means, unbiased), l = vari.length;
    for (var i = 0; i < l; i++) {
        vari[i] = Math.sqrt(vari[i]);
    }
    return vari;
};

exports.variance = function variance(matrix, means, unbiased) {
    if (typeof (unbiased) === 'undefined') {
        unbiased = true;
    }
    means = means || exports.mean(matrix);
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length;
    var vari = new Array(cols);

    for (var j = 0; j < cols; j++) {
        var sum1 = 0, sum2 = 0, x = 0;
        for (var i = 0; i < rows; i++) {
            x = matrix[i][j] - means[j];
            sum1 += x;
            sum2 += x * x;
        }
        if (unbiased) {
            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / (rows - 1);
        } else {
            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / rows;
        }
    }
    return vari;
};

exports.median = function median(matrix) {
    var rows = matrix.length, cols = matrix[0].length;
    var medians = new Array(cols);

    for (var i = 0; i < cols; i++) {
        var data = new Array(rows);
        for (var j = 0; j < rows; j++) {
            data[j] = matrix[j][i];
        }
        data.sort(compareNumbers);
        var N = data.length;
        if (N % 2 === 0) {
            medians[i] = (data[N / 2] + data[(N / 2) - 1]) * 0.5;
        } else {
            medians[i] = data[Math.floor(N / 2)];
        }
    }
    return medians;
};

exports.mode = function mode(matrix) {
    var rows = matrix.length,
        cols = matrix[0].length,
        modes = new Array(cols),
        i, j;
    for (i = 0; i < cols; i++) {
        var itemCount = new Array(rows);
        for (var k = 0; k < rows; k++) {
            itemCount[k] = 0;
        }
        var itemArray = new Array(rows);
        var count = 0;

        for (j = 0; j < rows; j++) {
            var index = itemArray.indexOf(matrix[j][i]);
            if (index >= 0) {
                itemCount[index]++;
            } else {
                itemArray[count] = matrix[j][i];
                itemCount[count] = 1;
                count++;
            }
        }

        var maxValue = 0, maxIndex = 0;
        for (j = 0; j < count; j++) {
            if (itemCount[j] > maxValue) {
                maxValue = itemCount[j];
                maxIndex = j;
            }
        }

        modes[i] = itemArray[maxIndex];
    }
    return modes;
};

exports.skewness = function skewness(matrix, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var means = exports.mean(matrix);
    var n = matrix.length, l = means.length;
    var skew = new Array(l);

    for (var j = 0; j < l; j++) {
        var s2 = 0, s3 = 0;
        for (var i = 0; i < n; i++) {
            var dev = matrix[i][j] - means[j];
            s2 += dev * dev;
            s3 += dev * dev * dev;
        }

        var m2 = s2 / n;
        var m3 = s3 / n;
        var g = m3 / Math.pow(m2, 3 / 2);

        if (unbiased) {
            var a = Math.sqrt(n * (n - 1));
            var b = n - 2;
            skew[j] = (a / b) * g;
        } else {
            skew[j] = g;
        }
    }
    return skew;
};

exports.kurtosis = function kurtosis(matrix, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var means = exports.mean(matrix);
    var n = matrix.length, m = matrix[0].length;
    var kurt = new Array(m);

    for (var j = 0; j < m; j++) {
        var s2 = 0, s4 = 0;
        for (var i = 0; i < n; i++) {
            var dev = matrix[i][j] - means[j];
            s2 += dev * dev;
            s4 += dev * dev * dev * dev;
        }
        var m2 = s2 / n;
        var m4 = s4 / n;

        if (unbiased) {
            var v = s2 / (n - 1);
            var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
            var b = s4 / (v * v);
            var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));
            kurt[j] = a * b - 3 * c;
        } else {
            kurt[j] = m4 / (m2 * m2) - 3;
        }
    }
    return kurt;
};

exports.standardError = function standardError(matrix) {
    var samples = matrix.length;
    var standardDeviations = exports.standardDeviation(matrix);
    var l = standardDeviations.length;
    var standardErrors = new Array(l);
    var sqrtN = Math.sqrt(samples);

    for (var i = 0; i < l; i++) {
        standardErrors[i] = standardDeviations[i] / sqrtN;
    }
    return standardErrors;
};

exports.covariance = function covariance(matrix, dimension) {
    return exports.scatter(matrix, undefined, dimension);
};

exports.scatter = function scatter(matrix, divisor, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    if (typeof (divisor) === 'undefined') {
        if (dimension === 0) {
            divisor = matrix.length - 1;
        } else if (dimension === 1) {
            divisor = matrix[0].length - 1;
        }
    }
    var means = exports.mean(matrix, dimension);
    var rows = matrix.length;
    if (rows === 0) {
        return [[]];
    }
    var cols = matrix[0].length,
        cov, i, j, s, k;

    if (dimension === 0) {
        cov = new Array(cols);
        for (i = 0; i < cols; i++) {
            cov[i] = new Array(cols);
        }
        for (i = 0; i < cols; i++) {
            for (j = i; j < cols; j++) {
                s = 0;
                for (k = 0; k < rows; k++) {
                    s += (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
                }
                s /= divisor;
                cov[i][j] = s;
                cov[j][i] = s;
            }
        }
    } else if (dimension === 1) {
        cov = new Array(rows);
        for (i = 0; i < rows; i++) {
            cov[i] = new Array(rows);
        }
        for (i = 0; i < rows; i++) {
            for (j = i; j < rows; j++) {
                s = 0;
                for (k = 0; k < cols; k++) {
                    s += (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
                }
                s /= divisor;
                cov[i][j] = s;
                cov[j][i] = s;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    return cov;
};

exports.correlation = function correlation(matrix) {
    var means = exports.mean(matrix),
        standardDeviations = exports.standardDeviation(matrix, true, means),
        scores = exports.zScores(matrix, means, standardDeviations),
        rows = matrix.length,
        cols = matrix[0].length,
        i, j;

    var cor = new Array(cols);
    for (i = 0; i < cols; i++) {
        cor[i] = new Array(cols);
    }
    for (i = 0; i < cols; i++) {
        for (j = i; j < cols; j++) {
            var c = 0;
            for (var k = 0, l = scores.length; k < l; k++) {
                c += scores[k][j] * scores[k][i];
            }
            c /= rows - 1;
            cor[i][j] = c;
            cor[j][i] = c;
        }
    }
    return cor;
};

exports.zScores = function zScores(matrix, means, standardDeviations) {
    means = means || exports.mean(matrix);
    if (typeof (standardDeviations) === 'undefined') standardDeviations = exports.standardDeviation(matrix, true, means);
    return exports.standardize(exports.center(matrix, means, false), standardDeviations, true);
};

exports.center = function center(matrix, means, inPlace) {
    means = means || exports.mean(matrix);
    var result = matrix,
        l = matrix.length,
        i, j, jj;

    if (!inPlace) {
        result = new Array(l);
        for (i = 0; i < l; i++) {
            result[i] = new Array(matrix[i].length);
        }
    }

    for (i = 0; i < l; i++) {
        var row = result[i];
        for (j = 0, jj = row.length; j < jj; j++) {
            row[j] = matrix[i][j] - means[j];
        }
    }
    return result;
};

exports.standardize = function standardize(matrix, standardDeviations, inPlace) {
    if (typeof (standardDeviations) === 'undefined') standardDeviations = exports.standardDeviation(matrix);
    var result = matrix,
        l = matrix.length,
        i, j, jj;

    if (!inPlace) {
        result = new Array(l);
        for (i = 0; i < l; i++) {
            result[i] = new Array(matrix[i].length);
        }
    }

    for (i = 0; i < l; i++) {
        var resultRow = result[i];
        var sourceRow = matrix[i];
        for (j = 0, jj = resultRow.length; j < jj; j++) {
            if (standardDeviations[j] !== 0 && !isNaN(standardDeviations[j])) {
                resultRow[j] = sourceRow[j] / standardDeviations[j];
            }
        }
    }
    return result;
};

exports.weightedVariance = function weightedVariance(matrix, weights) {
    var means = exports.mean(matrix);
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length;
    var vari = new Array(cols);

    for (var j = 0; j < cols; j++) {
        var sum = 0;
        var a = 0, b = 0;

        for (var i = 0; i < rows; i++) {
            var z = matrix[i][j] - means[j];
            var w = weights[i];

            sum += w * (z * z);
            b += w;
            a += w * w;
        }

        vari[j] = sum * (b / (b * b - a));
    }

    return vari;
};

exports.weightedMean = function weightedMean(matrix, weights, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length,
        means, i, ii, j, w, row;

    if (dimension === 0) {
        means = new Array(cols);
        for (i = 0; i < cols; i++) {
            means[i] = 0;
        }
        for (i = 0; i < rows; i++) {
            row = matrix[i];
            w = weights[i];
            for (j = 0; j < cols; j++) {
                means[j] += row[j] * w;
            }
        }
    } else if (dimension === 1) {
        means = new Array(rows);
        for (i = 0; i < rows; i++) {
            means[i] = 0;
        }
        for (j = 0; j < rows; j++) {
            row = matrix[j];
            w = weights[j];
            for (i = 0; i < cols; i++) {
                means[j] += row[i] * w;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    var weightSum = arrayStat.sum(weights);
    if (weightSum !== 0) {
        for (i = 0, ii = means.length; i < ii; i++) {
            means[i] /= weightSum;
        }
    }
    return means;
};

exports.weightedCovariance = function weightedCovariance(matrix, weights, means, dimension) {
    dimension = dimension || 0;
    means = means || exports.weightedMean(matrix, weights, dimension);
    var s1 = 0, s2 = 0;
    for (var i = 0, ii = weights.length; i < ii; i++) {
        s1 += weights[i];
        s2 += weights[i] * weights[i];
    }
    var factor = s1 / (s1 * s1 - s2);
    return exports.weightedScatter(matrix, weights, means, factor, dimension);
};

exports.weightedScatter = function weightedScatter(matrix, weights, means, factor, dimension) {
    dimension = dimension || 0;
    means = means || exports.weightedMean(matrix, weights, dimension);
    if (typeof (factor) === 'undefined') {
        factor = 1;
    }
    var rows = matrix.length;
    if (rows === 0) {
        return [[]];
    }
    var cols = matrix[0].length,
        cov, i, j, k, s;

    if (dimension === 0) {
        cov = new Array(cols);
        for (i = 0; i < cols; i++) {
            cov[i] = new Array(cols);
        }
        for (i = 0; i < cols; i++) {
            for (j = i; j < cols; j++) {
                s = 0;
                for (k = 0; k < rows; k++) {
                    s += weights[k] * (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
                }
                cov[i][j] = s * factor;
                cov[j][i] = s * factor;
            }
        }
    } else if (dimension === 1) {
        cov = new Array(rows);
        for (i = 0; i < rows; i++) {
            cov[i] = new Array(rows);
        }
        for (i = 0; i < rows; i++) {
            for (j = i; j < rows; j++) {
                s = 0;
                for (k = 0; k < cols; k++) {
                    s += weights[k] * (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
                }
                cov[i][j] = s * factor;
                cov[j][i] = s * factor;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    return cov;
};


/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = newArray

function newArray (n, value) {
  n = n || 0
  var array = new Array(n)
  for (var i = 0; i < n; i++) {
    array[i] = value
  }
  return array
}


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _parseSDF = __webpack_require__(62);
var Papa = __webpack_require__(59);

var getMoleculeCreators = __webpack_require__(40);

module.exports = function (OCL) {
    var Molecule = OCL.Molecule;

    var moleculeCreators = getMoleculeCreators(Molecule);

    var defaultDBOptions = {
        length: 0,
        computeProperties: false
    };

    var defaultSDFOptions = {
        onStep: function onStep() /*current, total*/{
            // empty function
        }
    };

    var defaultCSVOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        onStep: function onStep() /*current, total*/{
            // empty function
        }
    };

    var defaultSearchOptions = {
        format: 'oclid',
        mode: 'substructure',
        limit: 0
    };

    var MoleculeDB = function () {
        function MoleculeDB(options) {
            _classCallCheck(this, MoleculeDB);

            options = Object.assign({}, defaultDBOptions, options);
            this.data = new Array(options.length);
            this.molecules = new Array(options.length);
            this.statistics = null;
            this.length = 0;
            this.computeProperties = !!options.computeProperties;
            this.searcher = null;
        }

        _createClass(MoleculeDB, [{
            key: 'push',
            value: function push(molecule, data) {
                if (data === undefined) data = {};
                this.molecules[this.length] = molecule;
                var molecularFormula = void 0;
                if (!molecule.index) {
                    molecule.index = molecule.getIndex();
                }
                if (!molecule.idcode) {
                    molecule.idcode = molecule.getIDCode();
                }
                if (!molecule.mw) {
                    molecularFormula = molecule.getMolecularFormula();
                    molecule.mw = molecularFormula.relativeWeight;
                }
                this.data[this.length++] = data;
                if (this.computeProperties) {
                    if (!molecularFormula) {
                        molecularFormula = molecule.getMolecularFormula();
                    }
                    var properties = new OCL.MoleculeProperties(molecule);
                    data.properties = {
                        absoluteWeight: molecularFormula.absoluteWeight,
                        relativeWeight: molecule.mw,
                        formula: molecularFormula.formula,
                        acceptorCount: properties.acceptorCount,
                        donorCount: properties.donorCount,
                        logP: properties.logP,
                        logS: properties.logS,
                        polarSurfaceArea: properties.polarSurfaceArea,
                        rotatableBondCount: properties.rotatableBondCount,
                        stereoCenterCount: properties.stereoCenterCount
                    };
                }
            }
        }, {
            key: 'search',
            value: function search(query, options) {
                options = Object.assign({}, defaultSearchOptions, options);

                if (typeof query === 'string') {
                    query = moleculeCreators.get(options.format.toLowerCase())(query);
                } else if (!(query instanceof Molecule)) {
                    throw new TypeError('toSearch must be a Molecule or string');
                }

                var result = void 0;
                switch (options.mode.toLowerCase()) {
                    case 'exact':
                        result = this.exactSearch(query, options.limit);
                        break;
                    case 'substructure':
                        result = this.subStructureSearch(query, options.limit);
                        break;
                    case 'similarity':
                        result = this.similaritySearch(query, options.limit);
                        break;
                    default:
                        throw new Error('unknown search mode: ' + options.mode);
                }
                return result;
            }
        }, {
            key: 'exactSearch',
            value: function exactSearch(query, limit) {
                var queryIdcode = query.getIDCode();
                var result = new MoleculeDB();
                limit = limit || Number.MAX_SAFE_INTEGER;
                for (var i = 0; i < this.length; i++) {
                    if (this.molecules[i].idcode === queryIdcode) {
                        result.push(this.molecules[i], this.data[i]);
                        if (result.length >= limit) break;
                    }
                }
                return result;
            }
        }, {
            key: 'subStructureSearch',
            value: function subStructureSearch(query, limit) {
                var needReset = false;
                if (!query.isFragment()) {
                    needReset = true;
                    query.setFragment(true);
                }

                var queryIndex = query.getIndex();
                var queryMW = query.getMolecularFormula().relativeWeight;
                var searcher = this.getSearcher();

                searcher.setFragment(query, queryIndex);
                var searchResult = [];
                for (var i = 0; i < this.length; i++) {
                    searcher.setMolecule(this.molecules[i], this.molecules[i].index);
                    if (searcher.isFragmentInMolecule()) {
                        searchResult.push([this.molecules[i], i]);
                    }
                }
                searchResult.sort(function (a, b) {
                    return Math.abs(queryMW - a[0].mw) - Math.abs(queryMW - b[0].mw);
                });

                var length = Math.min(limit || searchResult.length, searchResult.length);
                var result = new MoleculeDB({ length: length });
                for (var _i = 0; _i < length; _i++) {
                    result.push(this.molecules[searchResult[_i][1]], this.data[searchResult[_i][1]]);
                }

                if (needReset) {
                    query.setFragment(false);
                }
                return result;
            }
        }, {
            key: 'similaritySearch',
            value: function similaritySearch(query, limit) {
                var queryIndex = query.getIndex();
                var queryMW = query.getMolecularFormula().relativeWeight;
                var queryIDCode = query.getIDCode();

                var searchResult = new Array(this.length);
                var similarity = void 0;
                for (var i = 0; i < this.length; i++) {
                    if (this.molecules[i].idcode === queryIDCode) {
                        similarity = 1e10;
                    } else {
                        similarity = OCL.SSSearcherWithIndex.getSimilarityTanimoto(queryIndex, this.molecules[i].index) * 100000 - Math.abs(queryMW - this.molecules[i].mw) / 1000;
                    }
                    searchResult[i] = [similarity, i];
                }
                searchResult.sort(function (a, b) {
                    return b[0] - a[0];
                });

                var length = Math.min(limit || searchResult.length, searchResult.length);
                var result = new MoleculeDB({ length: length });
                for (var _i2 = 0; _i2 < length; _i2++) {
                    result.push(this.molecules[searchResult[_i2][1]], this.data[searchResult[_i2][1]]);
                }
                return result;
            }
        }, {
            key: 'getSearcher',
            value: function getSearcher() {
                return this.searcher || (this.searcher = new OCL.SSSearcherWithIndex());
            }
        }], [{
            key: 'parseSDF',
            value: function parseSDF(sdf, options) {
                if (typeof sdf !== 'string') {
                    throw new TypeError('sdf must be a string');
                }
                options = Object.assign({}, defaultSDFOptions, options);
                return new Promise(function (resolve, reject) {
                    var parsed = _parseSDF(sdf);
                    var molecules = parsed.molecules;
                    var db = new MoleculeDB(options);
                    db.statistics = parsed.statistics;
                    var i = 0;
                    var l = molecules.length;
                    parseNext();
                    function parseNext() {
                        if (i === l) {
                            resolve(db);
                            return;
                        }
                        try {
                            db.push(Molecule.fromMolfile(molecules[i].molfile), molecules[i]);
                        } catch (e) {
                            reject(e);
                            return;
                        }
                        options.onStep(++i, l);
                        setImmediate(parseNext);
                    }
                });
            }
        }, {
            key: 'parseCSV',
            value: function parseCSV(csv, options) {
                if (typeof csv !== 'string') {
                    throw new TypeError('csv must be a string');
                }
                options = Object.assign({}, defaultCSVOptions, options);
                return new Promise(function (resolve, reject) {
                    var parsed = Papa.parse(csv, options);
                    var fields = parsed.meta.fields;
                    var stats = new Array(fields.length);
                    var firstElement = parsed.data[0];
                    var datatype = void 0,
                        datafield = void 0;
                    for (var _i3 = 0; _i3 < fields.length; _i3++) {
                        stats[_i3] = {
                            label: fields[_i3],
                            isNumeric: typeof firstElement[fields[_i3]] === 'number'
                        };
                        var lowerField = fields[_i3].toLowerCase();
                        if (moleculeCreators.has(lowerField)) {
                            datatype = moleculeCreators.get(lowerField);
                            datafield = fields[_i3];
                        }
                    }
                    if (!datatype) {
                        throw new Error('this document does not contain any molecule field');
                    }
                    var db = new MoleculeDB(options);
                    db.statistics = stats;

                    var i = 0;
                    var l = parsed.data.length;
                    parseNext();
                    function parseNext() {
                        if (i === l) {
                            resolve(db);
                            return;
                        }
                        try {
                            db.push(datatype(parsed.data[i][datafield]), parsed.data[i]);
                        } catch (e) {
                            reject(e);
                            return;
                        }
                        options.onStep(++i, l);
                        setImmediate(parseNext);
                    }
                });
            }
        }]);

        return MoleculeDB;
    }();

    return MoleculeDB;
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(69).setImmediate))

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (Molecule) {
    var fields = new Map();

    fields.set('oclid', Molecule.fromIDCode);
    fields.set('idcode', Molecule.fromIDCode);
    fields.set('smiles', Molecule.fromSmiles);
    fields.set('molfile', Molecule.fromMolfile);

    return fields;
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var staticMethods = {
    DB: __webpack_require__(39),
    RXN: __webpack_require__(56)
};

// These methods don't need to directly access OCL
var moleculePrototypeMethods = {
    getAllPaths: __webpack_require__(43),
    getFunctions: __webpack_require__(49),
    getGroupedDiastereotopicAtomIDs: __webpack_require__(50),
    getMF: __webpack_require__(52),
    getNumberOfAtoms: __webpack_require__(53),
    toDiastereotopicSVG: __webpack_require__(54),
    toVisualizerMolfile: __webpack_require__(55)
};

// These methods need a direct access to OCL. The must be exported as a function
// that receives OCL and returns the method that will use it.
var moleculePrototypeMethodsNeedOCL = {
    getAtomsInfo: __webpack_require__(44),
    getConnectivityMatrix: __webpack_require__(45),
    getDiastereotopicHoseCodes: __webpack_require__(46),
    getExtendedDiastereotopicAtomIDs: __webpack_require__(47),
    getFunctionCodes: __webpack_require__(48),
    getGroupedHOSECodes: __webpack_require__(51)
};

module.exports = function extend(OCL) {
    var key = void 0;
    for (key in staticMethods) {
        OCL[key] = staticMethods[key](OCL);
    }

    var MoleculePrototype = OCL.Molecule.prototype;
    for (key in moleculePrototypeMethods) {
        MoleculePrototype[key] = moleculePrototypeMethods[key];
    }
    for (key in moleculePrototypeMethodsNeedOCL) {
        MoleculePrototype[key] = moleculePrototypeMethodsNeedOCL[key](OCL);
    }
    return OCL;
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    'gJQLBEeKNVTfjh@': {
        'name': 'tertiary alcohol'
    },
    'eF@HxP': {
        'name': 'alkyne'
    },
    'eF@HhP': {
        'name': 'alkene'
    },
    'eM`BN`p`': {
        'name': 'secondary amine'
    },
    'gC``@deZ@~d\\': {
        'name': 'ester'
    },
    'eMHBN``': {
        'name': 'ether'
    },
    'gC``Adij@pf}IX': {
        'name': 'hemiacetal'
    },
    'gJP`AdizhCzRp': {
        'name': 'acetal'
    },
    'gCh@AGj@`': {
        'name': 'tertiary amine'
    },
    'gJP`AdizhCzQp': {
        'name': 'cetal'
    },
    'gJP`AdizhCzSP': {
        'name': 'acetal'
    },
    'gJY@DDefhCzQp': {
        'name': 'tertiary amide'
    },
    'eMJDVTfP@': {
        'name': 'aldehyde'
    },
    'gCaDLEeKJST`@': {
        'name': 'ketone'
    },
    'eF`BLFD@': {
        'name': 'primary amine'
    },
    'eFHBLFD@': {
        'name': ''
    },
    'eMJDVTf`@': {
        'name': 'primary alcohol'
    },
    'gCaDLEeKJSU@@': {
        'name': 'secondary alcohol'
    },
    'eMDARVCB_Tx': {
        'name': 'carboxylic acid'
    }
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var floydWarshall = __webpack_require__(24);
var Matrix = __webpack_require__(5);

module.exports = function getAllPaths() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var fromLabel = options.fromLabel || '';
    var toLabel = options.toLabel || '';
    var minLength = options.minLength === undefined ? 1 : options.minLength;
    var maxLength = options.maxLength === undefined ? 4 : options.maxLength;

    // we need to find all the atoms 'fromLabel' and 'toLabel'
    var results = {};
    var diaIDs = this.getDiastereotopicAtomIDs();

    var connectivityMatrix = this.getConnectivityMatrix();
    // TODO have a package that allows to convert the connectivityMatrix to a distanceMatrix
    var pathLengthMatrix = floydWarshall(new Matrix(connectivityMatrix));

    for (var from = 0; from < this.getAllAtoms(); from++) {
        for (var to = 0; to < this.getAllAtoms(); to++) {
            if (!fromLabel || this.getAtomLabel(from) === fromLabel) {
                if (!toLabel || this.getAtomLabel(to) === toLabel) {
                    var key = diaIDs[from] + '_' + diaIDs[to];
                    var pathLength = pathLengthMatrix[from][to];
                    if (pathLength >= minLength && pathLength <= maxLength) {
                        if (!results[key]) {
                            results[key] = {
                                fromDiaID: diaIDs[from],
                                toDiaID: diaIDs[to],
                                fromAtoms: [],
                                toAtoms: [],
                                fromLabel: this.getAtomLabel(from),
                                toLabel: this.getAtomLabel(to),
                                pathLength: pathLength
                            };
                        }
                        if (results[key].fromAtoms.indexOf(from) === -1) results[key].fromAtoms.push(from);
                        if (results[key].toAtoms.indexOf(to) === -1) results[key].toAtoms.push(to);
                    }
                }
            }
        }
    }

    var finalResults = [];
    for (var _key in results) {
        results[_key].fromAtoms.sort(function (a, b) {
            return a - b;
        });
        results[_key].toAtoms.sort(function (a, b) {
            return a - b;
        });
        finalResults.push(results[_key]);
    }
    return finalResults;
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (OCL) {
    return function getAtomsInfo() {

        this.ensureHelperArrays(OCL.Molecule.cHelperRings);

        var diaIDs = this.getDiastereotopicAtomIDs();

        var results = [];
        for (var i = 0; i < diaIDs.length; i++) {
            var result = {
                oclID: diaIDs[i],
                extra: {
                    singleBonds: 0,
                    doubleBonds: 0,
                    tripleBonds: 0,
                    aromaticBonds: 0,
                    cnoHybridation: 0 // should be 1 (sp), 2 (sp2) or 3 (sp3)
                }
            };
            var extra = result.extra;
            results.push(result);
            result.abnormalValence = this.getAtomAbnormalValence(i); // -1 is normal otherwise specified
            result.charge = this.getAtomCharge(i);
            result.cipParity = this.getAtomCIPParity(i);
            result.color = this.getAtomColor(i);
            result.customLabel = this.getAtomCustomLabel(i);
            //        result.esrGroup=this.getAtomESRGroup(i);
            //        result.esrType=this.getAtomESRType(i);
            result.atomicNo = this.getAtomicNo(i);
            result.label = this.getAtomLabel(i);
            //        result.list=this.getAtomList(i);
            //        result.listString=this.getAtomListString(i);
            //        result.mapNo=this.getAtomMapNo(i);
            result.mass = this.getAtomMass(i);
            //        result.parity=this.getAtomParity(i);
            //        result.pi=this.getAtomPi(i);
            //        result.preferredStereoBond=this.getAtomPreferredStereoBond(i);
            //        result.queryFeatures=this.getAtomQueryFeatures(i);
            result.radical = this.getAtomRadical(i);
            result.ringBondCount = this.getAtomRingBondCount(i);
            //        result.ringCount=this.getAtomRingCount(i);
            result.ringSize = this.getAtomRingSize(i);
            result.x = this.getAtomX(i);
            result.y = this.getAtomY(i);
            result.z = this.getAtomZ(i);
            result.allHydrogens = this.getAllHydrogens(i);
            result.connAtoms = this.getConnAtoms(i);
            result.allConnAtoms = this.getAllConnAtoms(i);

            result.implicitHydrogens = result.allHydrogens + result.connAtoms - result.allConnAtoms;

            result.isAromatic = this.isAromaticAtom(i);
            result.isAllylic = this.isAllylicAtom(i);
            result.isStereoCenter = this.isAtomStereoCenter(i);
            result.isRing = this.isRingAtom(i);
            result.isSmallRing = this.isSmallRingAtom(i);
            result.isStabilized = this.isStabilizedAtom(i);

            // todo HACK to circumvent bug in OCL that consider than an hydrogen is connected to itself
            result.extra.singleBonds = result.atomicNo === 1 ? 0 : result.implicitHydrogens;
            for (var j = 0; j < this.getAllConnAtoms(i); j++) {
                var bond = this.getConnBond(i, j);
                var bondOrder = this.getBondOrder(bond);
                if (this.isAromaticBond(bond)) {
                    extra.aromaticBonds++;
                } else if (bondOrder === 1) {
                    // not an hydrogen
                    extra.singleBonds++;
                } else if (bondOrder === 2) {
                    extra.doubleBonds++;
                } else if (bondOrder === 3) {
                    extra.tripleBonds++;
                }
            }
            result.extra.totalBonds = result.extra.singleBonds + result.extra.doubleBonds + result.extra.tripleBonds + result.extra.aromaticBonds;

            if (result.atomicNo === 6) {
                result.extra.cnoHybridation = result.extra.totalBonds - 1;
            } else if (result.atomicNo === 7) {
                result.extra.cnoHybridation = result.extra.totalBonds;
            } else if (result.atomicNo === 8) {
                result.extra.cnoHybridation = result.extra.totalBonds + 1;
            } else if (result.atomicNo === 1) {
                var connectedAtom = this.getAllConnAtoms(i) === 0 ? 0 : this.getAtomicNo(this.getConnAtom(i, 0));
                result.extra.hydrogenOnAtomicNo = connectedAtom;
                if (connectedAtom === 7 || connectedAtom === 8) {
                    result.extra.labileHydrogen = true;
                }
            }
        }
        return results;
    };
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (OCL) {
    return function getConnectivityMatrix() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var sdt = options.sdt;
        var mass = options.mass;
        var atomicNo = options.atomicNo;

        this.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
        var nbAtoms = this.getAllAtoms();
        var result = new Array(nbAtoms);
        for (var i = 0; i < nbAtoms; i++) {
            result[i] = new Array(nbAtoms).fill(0);
            if (atomicNo) {
                result[i][i] = this.getAtomicNo(i);
            } else {
                result[i][i] = mass ? OCL.Molecule.cRoundedMass[this.getAtomicNo(i)] : 1;
            }
        }

        for (var _i = 0; _i < nbAtoms; _i++) {
            for (var j = 0; j < this.getAllConnAtoms(_i); j++) {
                result[_i][this.getConnAtom(_i, j)] = sdt ? this.getConnBondOrder(_i, j) : 1;
            }
        }
        return result;
    };
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (OCL) {
    var Util = OCL.Util;
    return function getDiastereotopicHoseCodes() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var diaIDs = this.getDiastereotopicAtomIDs(options).map(function (a) {
            return { oclID: a };
        });
        diaIDs.forEach(function (diaID) {
            var hoses = Util.getHoseCodesFromDiastereotopicID(diaID.oclID, options);
            diaID.hoses = [];
            var level = 1;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = hoses[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var hose = _step.value;

                    diaID.hoses.push({
                        level: level++,
                        oclID: hose
                    });
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        });
        return diaIDs;
    };
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (OCL) {
    return function getExtendedDiastereotopicAtomIDs() {
        var molecule = this.getCompactCopy();
        molecule.addImplicitHydrogens();
        // TODO Temporary code ???
        molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);

        var diaIDs = molecule.getDiastereotopicAtomIDs();
        var newDiaIDs = [];

        for (var i = 0; i < diaIDs.length; i++) {
            var diaID = diaIDs[i];
            var newDiaID = {
                oclID: diaID,
                hydrogenOCLIDs: [],
                nbHydrogens: 0
            };
            for (var j = 0; j < molecule.getAllConnAtoms(i); j++) {
                var atom = molecule.getConnAtom(i, j);
                if (molecule.getAtomicNo(atom) === 1) {
                    newDiaID.nbHydrogens++;
                    if (newDiaID.hydrogenOCLIDs.indexOf(diaIDs[atom]) === -1) {
                        newDiaID.hydrogenOCLIDs.push(diaIDs[atom]);
                    }
                }
            }

            newDiaIDs.push(newDiaID);
        }

        return newDiaIDs;
    };
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (OCL) {
    return function getFunctionCodes() {
        var molecule = this.getCompactCopy();
        var atoms = molecule.getAtomsInfo();
        for (var i = 0; i < molecule.getAllAtoms(); i++) {
            var atom = atoms[i];
            atom.i = i;
            atom.mapNo = molecule.getAtomMapNo(i);
            atom.links = []; // we will store connected atoms of broken bonds
        }

        var bonds = [];
        for (var _i = 0; _i < molecule.getAllBonds(); _i++) {
            var bond = {};
            bonds.push(bond);
            bond.i = _i;
            bond.order = molecule.getBondOrder(_i);
            bond.atom1 = molecule.getBondAtom(0, _i);
            bond.atom2 = molecule.getBondAtom(1, _i);
            bond.type = molecule.getBondType(_i);
            bond.isAromatic = molecule.isAromaticBond(_i);

            if (!bond.isAromatic && molecule.getBondTypeSimple(_i) === 1 && molecule.getAtomicNo(bond.atom1) === 6 && molecule.getAtomicNo(bond.atom2) === 6 && (atoms[bond.atom1].extra.cnoHybridation === 3 || atoms[bond.atom2].extra.cnoHybridation === 3)) {

                bond.selected = true;
                atoms[bond.atom1].links.push(bond.atom2);
                atoms[bond.atom2].links.push(bond.atom1);
            }
        }

        var brokenMolecule = molecule.getCompactCopy();
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = bonds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _bond = _step.value;

                if (_bond.selected) {
                    brokenMolecule.markBondForDeletion(_bond.i);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        brokenMolecule.deleteMarkedAtomsAndBonds();
        var fragmentMap = [];
        var nbFragments = brokenMolecule.getFragmentNumbers(fragmentMap);

        var results = {};

        var _loop = function _loop(_i2) {
            result = {};

            result.atomMap = [];
            includeAtom = fragmentMap.map(function (id) {
                return id === _i2;
            });
            fragment = new OCL.Molecule();
            atomMap = [];

            brokenMolecule.copyMoleculeByAtoms(fragment, includeAtom, false, atomMap);
            parent = fragment.getCompactCopy();

            parent.setFragment(true);
            // we will remove the hydrogens of the broken carbon
            for (var j = 0; j < atomMap.length; j++) {
                if (atomMap[j] > -1) {
                    //                var numberDeletedHydrogens = 0;
                    if (atoms[j].links.length > 0) {
                        for (var k = 0; k < atoms[j].links.length; k++) {
                            if (parent.getAtomicNo(atoms[j].links[k]) === 1) {
                                //                           numberDeletedHydrogens++;
                                fragment.deleteAtom(atoms[j].links[k]);
                            }
                        }
                    }
                    fragment.ensureHelperArrays(OCL.Molecule.cHelperBitNeighbours);
                    // we will allow any substitution on sp3 hydrogens
                    // that is at an extremety (only one connection)

                    if (atoms[j].atomicNo === 6 && fragment.getConnAtoms(atomMap[j]) > 1) {
                        if (atoms[j].allHydrogens !== 0) parent.setAtomQueryFeature(atomMap[j], OCL.Molecule.cAtomQFNot0Hydrogen, true);
                        if (atoms[j].allHydrogens !== 1) parent.setAtomQueryFeature(atomMap[j], OCL.Molecule.cAtomQFNot1Hydrogen, true);
                        if (atoms[j].allHydrogens !== 2) parent.setAtomQueryFeature(atomMap[j], OCL.Molecule.cAtomQFNot2Hydrogen, true);
                        if (atoms[j].allHydrogens !== 3) parent.setAtomQueryFeature(atomMap[j], OCL.Molecule.cAtomQFNot3Hydrogen, true);
                    }
                    if (atoms[j].atomicNo !== 6) {
                        parent.setAtomQueryFeature(atomMap[j], OCL.Molecule.cAtomQFNoMoreNeighbours, true);
                    }
                }
            }

            result.parent = parent.getIDCode();
            fragment.setFragment(false); // required for small molecules like methanol

            // we will add some R groups at the level of the broken bonds
            for (var _j = 0; _j < atomMap.length; _j++) {
                if (atomMap[_j] > -1) {
                    result.atomMap.push(_j);
                    if (atoms[_j].links.length > 0) {
                        for (var _k = 0; _k < atoms[_j].links.length; _k++) {
                            rGroup = fragment.addAtom(154);
                            x = molecule.getAtomX(atoms[_j].links[_k]);
                            y = molecule.getAtomY(atoms[_j].links[_k]);

                            fragment.setAtomX(rGroup, x);
                            fragment.setAtomY(rGroup, y);
                            fragment.addBond(atomMap[_j], rGroup, 1);
                        }
                    }
                }
            }
            result.idCode = fragment.getIDCode();

            if (results[result.idCode]) {
                results[result.idCode].atomMap = results[result.idCode].atomMap.concat(result.atomMap);
            } else {
                results[result.idCode] = {
                    atomMap: result.atomMap,
                    idCode: result.idCode
                };
            }

            if (results[result.parent]) {
                results[result.parent].atomMap = results[result.parent].atomMap.concat(result.atomMap);
            } else {
                results[result.parent] = {
                    atomMap: result.atomMap,
                    idCode: result.parent
                };
            }
        };

        for (var _i2 = 0; _i2 < nbFragments; _i2++) {
            var result;
            var includeAtom;
            var fragment;
            var atomMap;
            var parent;
            var rGroup;
            var x;
            var y;

            _loop(_i2);
        }

        // fragments should be unique
        var fragments = [];
        Object.keys(results).forEach(function (key) {
            fragments.push(results[key]);
        });
        return fragments;
    };
};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var functionIndex = __webpack_require__(42);

module.exports = function getFunctions() {
    var currentFunctionCodes = this.getFunctionCodes();
    var currentFunctions = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = currentFunctionCodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var fragment = _step.value;

            if (functionIndex[fragment.idCode]) {
                var currentFunction = JSON.parse(JSON.stringify(functionIndex[fragment.idCode]));
                currentFunction.atomMap = fragment.atomMap;
                currentFunctions.push(currentFunction);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return currentFunctions;
};

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function getGroupedDiastereotopicAtomIDs() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var label = options.atomLabel;

    var diaIDs = this.getDiastereotopicAtomIDs(options);
    var diaIDsObject = {};

    for (var i = 0; i < diaIDs.length; i++) {
        if (!label || this.getAtomLabel(i) === label) {
            var diaID = diaIDs[i];
            if (!diaIDsObject[diaID]) {
                diaIDsObject[diaID] = {
                    counter: 1,
                    atoms: [i],
                    oclID: diaID,
                    atomLabel: this.getAtomLabel(i),
                    _highlight: [diaID]
                };
            } else {
                diaIDsObject[diaID].counter++;
                diaIDsObject[diaID].atoms.push(i);
            }
        }
    }

    var diaIDsTable = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.keys(diaIDsObject)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            diaIDsTable.push(diaIDsObject[key]);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return diaIDsTable;
};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (OCL) {
    var Util = OCL.Util;
    return function getGroupedHOSECodes() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var diaIDs = this.getGroupedDiastereotopicAtomIDs(options);
        diaIDs.forEach(function (diaID) {
            var hoses = Util.getHoseCodesFromDiastereotopicID(diaID.oclID, options);

            diaID.hoses = [];
            var level = 1;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = hoses[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var hose = _step.value;

                    diaID.hoses.push({
                        level: level++,
                        oclID: hose
                    });
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        });

        return diaIDs;
    };
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Calculate the molecular formula in 'chemcalc' notation taking into account fragments, isotopes and charges
 * @returns {String}
 */

module.exports = function getMF() {
    var entries = this.getFragments();
    var result = {};
    var parts = [];
    var allAtoms = [];
    entries.forEach(function (entry) {
        var mf = getFragmentMF(entry);
        parts.push(mf);
    });

    var counts = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = parts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var part = _step.value;

            if (!counts[part]) counts[part] = 0;
            counts[part]++;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    parts = [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = Object.keys(counts).sort()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var key = _step2.value;

            if (counts[key] > 1) {
                parts.push(counts[key] + key);
            } else {
                parts.push(key);
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    result.parts = parts;
    result.mf = getMF(allAtoms);
    return result;

    function getFragmentMF(molecule) {
        var atoms = [];
        for (var i = 0; i < molecule.getAllAtoms(); i++) {
            var atom = {};
            atom.charge = molecule.getAtomCharge(i);
            atom.label = molecule.getAtomLabel(i);
            atom.mass = molecule.getAtomMass(i);
            atom.implicitHydrogens = molecule.getImplicitHydrogens(i);
            atoms.push(atom);
            allAtoms.push(atom);
        }
        return getMF(atoms);
    }

    function getMF(atoms) {
        var charge = 0;
        var mfs = {};
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = atoms[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var atom = _step3.value;

                var label = atom.label;
                charge += atom.charge;
                if (atom.mass) {
                    label = '[' + atom.mass + label + ']';
                }
                var mfAtom = mfs[label];
                if (!mfAtom) {
                    mfs[label] = 0;
                }
                mfs[label] += 1;
                if (atom.implicitHydrogens) {
                    if (!mfs.H) mfs.H = 0;
                    mfs.H += atom.implicitHydrogens;
                }
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        var mf = '';
        var keys = Object.keys(mfs).sort(function (a, b) {
            if (a === 'C') return -1;
            if (b === 'C') return 1;
            if (a === 'H' && b !== 'C') return -1;
            if (a !== 'C' && b === 'H') return 1;
            if (a < b) return -1;
            return 1;
        });
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = keys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var key = _step4.value;

                mf += key;
                if (mfs[key] > 1) mf += mfs[key];
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }

        if (charge > 0) {
            mf += '(+' + (charge > 1 ? charge : '') + ')';
        } else if (charge < 0) {
            mf += '(' + (charge < -1 ? charge : '-') + ')';
        }
        return mf;
    }
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function getNumberOfAtoms() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var label = options.atomLabel;
    var mf = this.getMolecularFormula().formula;
    var parts = mf.split(/(?=[A-Z])/);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = parts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var part = _step.value;

            var atom = part.replace(/[0-9]/g, '');
            if (atom === label) {
                return part.replace(/[^0-9]/g, '') * 1 || 1;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return 0;
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function toDiastereotopicSVG() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$width = options.width,
        width = _options$width === undefined ? 300 : _options$width,
        _options$height = options.height,
        height = _options$height === undefined ? 200 : _options$height,
        _options$prefix = options.prefix,
        prefix = _options$prefix === undefined ? 'ocl' : _options$prefix;

    var svg = options.svg;
    var diaIDs = this.getDiastereotopicAtomIDs();
    if (!svg) svg = this.toSVG(width, height, prefix);

    svg = svg.replace(/Atom:[0-9]+\"/g, function (value) {
        var atom = value.replace(/[^0-9]/g, '');
        return value + ' data-atomid="' + diaIDs[atom] + '"';
    });

    return svg;
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function toVisualizerMolfile() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var diastereotopic = options.diastereotopic;

    var highlight = [];
    var atoms = {};
    if (diastereotopic) {
        var heavyAtomHydrogen = options.heavyAtomHydrogen;
        var hydrogenInfo = {};
        this.getExtendedDiastereotopicAtomIDs().forEach(function (line) {
            hydrogenInfo[line.oclID] = line;
        });

        var diaIDs = this.getGroupedDiastereotopicAtomIDs();
        diaIDs.forEach(function (diaID) {
            atoms[diaID.oclID] = diaID.atoms;
            highlight.push(diaID.oclID);
            if (heavyAtomHydrogen) {
                if (hydrogenInfo[diaID.oclID] && hydrogenInfo[diaID.oclID].nbHydrogens > 0) {
                    hydrogenInfo[diaID.oclID].hydrogenOCLIDs.forEach(function (id) {
                        highlight.push(id);
                        atoms[id] = diaID.atoms;
                    });
                }
            }
        });
    } else {
        var size = this.getAllAtoms();
        highlight = new Array(size).fill(0).map(function (a, index) {
            return index;
        });
        atoms = highlight.map(function (a) {
            return [a];
        });
    }

    var molfile = {
        type: 'mol2d',
        value: this.toMolfile(),
        _highlight: highlight,
        _atoms: atoms
    };

    return molfile;
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parseRXN = __webpack_require__(61);

module.exports = function (OCL) {
    function RXN(rxn) {
        if (!rxn) {
            this.reagents = [];
            this.products = [];
        } else {
            var parsed = parseRXN(rxn);
            this.reagents = generateInfo(parsed.reagents);
            this.products = generateInfo(parsed.products);
        }
    }

    RXN.prototype.addReagent = function (molfile) {
        this.reagents.push(getMolfileInfo(molfile));
    };

    RXN.prototype.addProduct = function (molfile) {
        this.products.push(getMolfileInfo(molfile));
    };

    RXN.prototype.toRXN = function () {
        var result = [];
        result.push('$RXN');
        result.push('');
        result.push('');
        result.push('Openchemlib');
        result.push(format3(this.reagents.length) + format3(this.products.length));
        for (var i = 0; i < this.reagents.length; i++) {
            result.push('$MOL');
            result.push(getMolfile(this.reagents[i].molfile));
        }
        for (var _i = 0; _i < this.products.length; _i++) {
            result.push('$MOL');
            result.push(getMolfile(this.products[_i].molfile));
        }
        return result.join('\n');
    };

    function getMolfile(molfile) {
        var lines = ~molfile.indexOf('\r\n') ? molfile.split('\r\n') : molfile.split(/[\r\n]/);
        return lines.join('\n');
    }

    function format3(number) {
        var length = (number + '').length;
        return '   '.substring(0, 3 - length) + number;
    }

    function generateInfo(molecules) {
        for (var i = 0; i < molecules.length; i++) {
            molecules[i] = getMolfileInfo(molecules[i]);
        }
        return molecules;
    }

    function getMolfileInfo(molfile) {
        var ocl = OCL.Molecule.fromMolfile(molfile);
        return {
            molfile: molfile,
            smiles: ocl.toSmiles(),
            mf: ocl.getMolecularFormula().formula,
            mw: ocl.getMolecularFormula().relativeWeight,
            idCode: ocl.getIDCode
        };
    }

    return RXN;
};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * openchemlib - Manipulate molecules
 * @version v5.1.2
 * @date 2017-03-08T10:15:49.960Z
 * @link https://github.com/cheminfo/openchemlib-js
 * @license BSD-3-Clause
*/
(function (root) {
    'use strict';

    function getExports($wnd) {

        var $doc = $wnd.document;
        var $gwt = {};
        var navigator = {
            userAgent: 'webkit'
        };

        function noop(){}

        var __gwtModuleFunction = noop;
        __gwtModuleFunction.__moduleStartupDone = noop;
        var $sendStats = noop;
        var $moduleName, $moduleBase;

        // Start GWT code 
var DS='object',ES='anonymous',FS='fnStack',GS='\n',HS={4:1,10:1,7:1},IS='Unknown',JS='boolean',KS='number',LS='string',MS=2147483647,NS='__java$exception',OS='For input string: "',PS='null',QS=524288,RS=1048576,SS='__noinit__',TS={4:1,12:1,14:1},US=65536,VS=65535,WS=10000,XS='fromIndex: 0, toIndex: ',YS=', length: ',ZS='fromIndex: ',$S={6:1,4:1},_S=16777215,aT=0.30000001192092896,bT={13:1,4:1},cT={11:1,4:1},dT=536870912,eT=2.617993878,fT=3.665191429,gT=6.283185307179586,hT=3.141592653589793,iT=1.5707963267948966,jT=4096,kT=2048,lT=1920,mT=1024,nT=234881024,oT=100663296,pT=201326592,qT=114688,rT=16384,sT=4063232,tT=2097152,uT=393216,vT=29360128,wT=268435456,xT=-1.5707963267948966,yT=32640,zT=1572864,AT=229376,BT=1.0471975511965976,CT=0.5235987755982988,DT={4:1,7:1},ET=262144,FT={22:1,4:1,10:1,7:1},GT={4:1,18:1,7:1},HT={4:1},IT=-16777216,JT={8:1,4:1},KT=131072,LT=8192,MT=-65536,NT={4:1,10:1,27:1,18:1,7:1,28:1},OT='??',PT={73:1,4:1,10:1,7:1},QT=-268435456,RT=65011712,ST=3072,TT=126976,UT=1.7976931348623157E308,VT=67108864,WT=134217728,XT=16777216,YT=-66584577,ZT=-3.141592653589793,$T=0.7853981633974483,_T=3.061592653589793,aU={9:1,4:1,7:1},bU='ATOMS',cU='M  END',dU='$$$$',eU='M  V30 ',fU=')\n',gU='M  V30 MDLV30/STEREL',hU='M  V30 MDLV30/STERAC',iU=3.4028234663852886E38,jU=4194303,kU=239060990,lU='" ',mU='stroke-width:',nU='class="event" ',oU='Assignment of aromatic double bonds failed',pU='Members of ESR groups must only be stereo centers with known configuration.',qU='Ambiguous configuration at stereo center because of 2 parallel bonds',rU=-0.5235987755982988,sU=-1.0471975511965976,tU=-0.7853981633974483,uU=2.0943951023931953,vU=0.17453292519943295,wU='Over- or under-specified stereo feature or more than one racemic type bond',xU='undefined',yU=0.08726646502812703,zU='Too many percent/per mille characters in pattern "',AU=1048575,BU=4194304,CU=17592186044416,DU=-17592186044416,EU='CSS1Compat',FU=5.56,GU=11.12,HU=13.34,IU=14.44,JU=1.52587890625E-5,KU={4:1,10:1,18:1,7:1},LU={25:1,45:1},MU={55:1},NU=15525485,OU=5.9604644775390625E-8,PU={4:1,25:1,46:1,38:1},QU='Invalid UTF8 sequence';var hS={};var iS={};var jS={};var kS={};var lS={};var mS={};var nS={};var oS={};var pS={};var qS={};var rS={};var sS={};var tS={};var uS={};var vS={};var wS={};var xS={};var yS={};var zS={};var AS={};var BS={};var CS={};var _;var lH;var fH;var FG=-1;hS.GG=function GG(){};function kH(a,b){typeof window===DS&&typeof window['$gwt']===DS&&(window['$gwt'][a]=b)}
function jH(b,c,d,e){hS.iH();var f=fH;$moduleName=c;$moduleBase=d;FG=e;function g(){for(var a=0;a<f.length;a++){f[a]()}}
if(b){try{gS(g)()}catch(a){b(c,a)}}else{gS(g)()}}
hS.iH=function iH(){fH==null&&(fH=[])};function hH(){hS.iH();var a=fH;for(var b=0;b<arguments.length;b++){a.push(arguments[b])}}
hS.gH=function gH(){};function wH(){}
function vH(a){if(Array.isArray(a)&&a.Kb===wH){return iS.Ac(a)}return a.toString()}
function uH(a,b){var c=$wnd;if(a===''){return c}var d=a.split('.');!(d[0] in c)&&c.execScript&&c.execScript('var '+d[0]);for(var e;d.length&&(e=d.shift());){c=c[e]=c[e]||!d.length&&b||{}}return c}
hS.tH=function tH(a){function b(){}
;b.prototype=a||{};return new b};hS.sH=function sH(a){return a instanceof Array?a[0]:null};function rH(){}
function qH(a,b){for(var c in b){b[c]['configurable']=true}Object.defineProperties(a,b)}
function pH(a,b,c){var d=lH;var e=d[a];var f=hS.sH(e);if(e&&!f){_=e}else{_=hS.oH(b);_.Jb=c;_.constructor=_;!b&&(_.Kb=wH);d[a]=_}for(var g=3;g<arguments.length;++g){arguments[g].prototype=_}f&&(_.Ib=f)}
hS.oH=function oH(a){var b=a&&a.prototype;!b&&(b=lH[a]);return hS.tH(b)};function nH(){lH={};!Array.isArray&&(Array.isArray=function(a){return Object.prototype.toString.call(a)==='[object Array]'})}
hS.mH=function mH(){};nH();iS.pc=function pc(a,b){return a===b};iS.qc=function qc(a){return a.Ib};iS.rc=function rc(a){return lS.WR(a)};function sc(){}
iS.uc=function uc(a,b){return HD(a)?iS.uK(a,b):ED(a)?iS.wJ(a,b):DD(a)?iS.AI(a,b):BD(a)?a.ab(b):SC(a)?iS.pc(a,b):jS.$A(a,b)};iS.wc=function wc(a){return HD(a)?iS.wK():ED(a)?iS.xJ():DD(a)?iS.BI():BD(a)?a.Ib:SC(a)?iS.qc(a):jS._A(a)};iS.yc=function yc(a){return HD(a)?iS.xK(a):ED(a)?iS.yJ(a):DD(a)?iS.CI(a):BD(a)?a.cb():SC(a)?iS.rc(a):jS.aB(a)};iS.Ac=function Ac(a){return iS.UI(iS.wc(a))+'@'+iS.ZJ(iS.yc(a),16)};pH(1,null,{},sc);_.ab=function tc(a){return iS.pc(this,a)};_.bb=function vc(){return iS.qc(this)};_.cb=function xc(){return iS.rc(this)};_.db=function zc(){return iS.UI(iS.wc(this))+'@'+iS.ZJ(iS.yc(this),16)};_.equals=function(a){return this.ab(a)};_.hashCode=function(){return this.cb()};_.toString=function(){return this.db()};jS.$A=function $A(a,b){return jS.eB(a)?jS.bB(a,b):KD(a)===KD(b)};jS._A=function _A(a){return a.Ib||Array.isArray(a)&&KC(hS.WE,1)||hS.WE};jS.aB=function aB(a){return jS.fB(a)?jS.cB(a):lS.WR(a)};jS.bB=function bB(a,b){return a.equals(b)};jS.cB=function cB(a){return a.hashCode()};jS.dB=function dB(){return []};jS.eB=function eB(a){return !!a&&!!a.equals};jS.fB=function fB(a){return !!a&&!!a.hashCode};jS.gB=function gB(a){return a.toString?a.toString():'[JavaScriptObject]'};kS.LB=function LB(){kS.LB=rH;var a,b;b=!kS.UB();a=new kS.bC;kS.KB=b?new kS.VB:a};kS.MB=function MB(a){kS.LB();kS.KB.ob(a)};kS.NB=function NB(a){kS.LB();var b;b=kS.KB.pb(a);return kS.OB(b)};kS.OB=function OB(a){var b,c,d,e;b='MB';c='CA';e=iS.dK(a.length,5);for(d=e-1;d>=0;d--){if(iS.uK(a[d].d,b)||iS.uK(a[d].d,c)){a.length>=d+1&&lS.jR(a,0,d+1);break}}return a};kS.PB=function PB(a){var b=/function(?:\s+([\w$]+))?\s*\(/;var c=b.exec(a);return c&&c[1]||ES};kS.QB=function QB(a){kS.LB();return a&&a[FS]?a[FS]:[]};kS.RB=function RB(a){kS.LB();return a.name||(a.name=kS.PB(a.toString()))};kS.SB=function SB(a){kS.LB();return parseInt(a)||-1};kS.TB=function TB(a){kS.LB();var b=a.backingJsObject;return b&&b.stack?b.stack.split(GS):[]};kS.UB=function UB(){if(Error.stackTraceLimit>0){$wnd.Error.stackTraceLimit=Error.stackTraceLimit=64;return true}return 'stack' in new Error};pH(170,1,{});kS.VB=function VB(){};pH(124,170,{},kS.VB);_.ob=function WB(a){var b={};var c=[];a[FS]=c;var d=arguments.callee.caller;while(d){var e=kS.RB(d);c.push(e);var f=':'+e;var g=b[f];if(g){var h,i;for(h=0,i=g.length;h<i;h++){if(g[h]===d){return}}}(g||(b[f]=[])).push(d);d=d.caller}};_.pb=function XB(a){var b,c,d,e;d=kS.QB(a);c=jS.lB(d);e=QC(hS.KF,HS,39,c,0,1);for(b=0;b<c;b++){e[b]=new iS.kK(jS.kB(d,b),null,-1)}return e};kS.YB=function YB(a,b){var c,d,e,f,g,h,i,j,k;if(iS.IK(b).length==0){return a.qb(IS,ES,-1,-1)}k=iS.FK(b);iS.uK(iS.IK(k).substr(0,3),'at ')&&(k=iS.IK(k).substr(3,iS.IK(k).length-3));k=kS.ZB(k);g=iS.IK(k).indexOf('(');if(g==-1){g=iS.IK(k).indexOf('@');if(g==-1){j=k;k=''}else{j=iS.FK(iS.IK(k).substr(g+1,iS.IK(k).length-(g+1)));k=iS.FK(iS.IK(k).substr(0,g))}}else{c=iS.IK(k).indexOf(')',g);j=iS.IK(k).substr(g+1,c-(g+1));k=iS.FK(iS.IK(k).substr(0,g))}g=iS.yK(k,HK(46));g!=-1&&(k=iS.IK(k).substr(g+1,iS.IK(k).length-(g+1)));(iS.IK(k).length==0||iS.uK(k,'Anonymous function'))&&(k=ES);h=iS.BK(j,HK(58));e=iS.CK(j,HK(58),h-1);i=-1;d=-1;f=IS;if(h!=-1&&e!=-1){f=iS.IK(j).substr(0,e);i=kS.SB(iS.IK(j).substr(e+1,h-(e+1)));d=kS.SB(iS.IK(j).substr(h+1,iS.IK(j).length-(h+1)))}return a.qb(f,k,i,d)};kS.ZB=function ZB(a){return a.replace(/\[.*?\]/g,'')};pH(171,170,{});_.ob=function $B(a){};_.qb=function _B(a,b,c,d){return new iS.kK(b,a+'@'+d,c<0?-1:c)};_.pb=function aC(a){var b,c,d,e,f,g;e=kS.TB(a);f=QC(hS.KF,HS,39,0,0,1);b=0;d=jS.lB(e);if(d==0){return f}g=kS.YB(this,jS.kB(e,0));iS.uK(g.d,ES)||(f[b++]=g);for(c=1;c<d;c++){f[b++]=kS.YB(this,jS.kB(e,c))}return f};kS.bC=function bC(){};pH(125,171,{},kS.bC);_.qb=function cC(a,b,c,d){return new iS.kK(b,a,-1)};hS.JC=function JC(a){return a};function KC(a,b){return hS.LC(a,b)}
hS.LC=function LC(a,b){return iS.cJ(a,b)};hS.MC=function MC(a){return a.__elementTypeCategory$==null?10:a.__elementTypeCategory$};hS.NC=function NC(a){return a.__elementTypeId$};function OC(a,b,c,d,e,f){return hS.PC(a,b,c,d,e,0,f)}
hS.PC=function PC(a,b,c,d,e,f,g){var h,i,j,k,l;k=e[f];j=f==g-1;h=j?d:0;l=hS.RC(h,k);d!=10&&YC(KC(a,g-f),b[f],c[f],h,l);if(!j){++f;for(i=0;i<k;++i){hS.TC(l,i,hS.PC(a,b,c,d,e,f,g))}}return l};function QC(a,b,c,d,e,f){var g;g=hS.RC(e,d);e!=10&&YC(KC(a,f),b,c,e,g);return g}
hS.RC=function RC(a,b){var c=new Array(b);var d;switch(a){case 14:case 15:d=0;break;case 16:d=false;break;default:return c;}for(var e=0;e<b;++e){c[e]=d}return c};function SC(a){return Array.isArray(a)&&a.Kb===wH}
hS.TC=function TC(a,b,c){return a[b]=c};function UC(a,b,c){return hS.TC(a,b,c)}
hS.VC=function VC(a,b){a.Ib=b};hS.WC=function WC(a,b){a.__elementTypeCategory$=b};hS.XC=function XC(a,b){a.__elementTypeId$=b};function YC(a,b,c,d,e){hS.VC(e,a);e.Jb=b;e.Kb=wH;hS.XC(e,c);hS.WC(e,d);return e}
hS.ZC=function ZC(a,b){hS.MC(b)!=10&&YC(iS.wc(b),b.Jb,hS.NC(b),hS.MC(b),a);return hS.JC(a)};function AD(a,b){if(HD(a)){return !!zD[b]}else if(a.Jb){return !!a.Jb[b]}else if(ED(a)){return !!yD[b]}else if(DD(a)){return !!xD[b]}return false}
function BD(a){return !Array.isArray(a)&&a.Kb===wH}
function CD(a,b){return a!=null&&AD(a,b)}
function DD(a){return typeof a===JS}
function ED(a){return typeof a===KS}
function FD(a){return a!=null&&hS.ID(a)&&!(a.Kb===wH)}
function GD(a,b){return hS.JD(a,b)}
function HD(a){return typeof a===LS}
hS.ID=function ID(a){return typeof a===DS||typeof a==='function'};hS.JD=function JD(a,b){return a&&b&&a instanceof b};function KD(a){return a==null?null:a}
function LD(a){return Math.max(Math.min(a,MS),-2147483648)|0}
var xD;var yD;var zD;hS.HG=function HG(a){return a&&a[NS]};function IG(a){var b;if(CD(a,14)){return a}b=hS.HG(a);if(!b){b=new jS.UA(a);kS.MB(b)}return b}
function JG(a){return a.backingJsObject}
function mJ(a){var b;b=lS.RR(a);if(iS.uK(b,JS)||iS.uK(b,KS)||iS.uK(b,LS)){return true}return a!=null&&lS.KR(a)}
iS.xI=function xI(){iS.xI=rH;wI=iS.GI(false);iS.GI(true)};iS.yI=function yI(a,b){return EI(lS.SR((lS.AR(a),a)),lS.SR((lS.AR(b),b)))};iS.zI=function zI(a,b){return iS.yI(a,b)};iS.AI=function AI(a,b){return lS.AR(a),a===b};iS.BI=function BI(){return hS.uF};iS.CI=function CI(a){return lS.SR((lS.AR(a),a))?1231:1237};function DI(a){iS.xI();return iS.uK(JS,lS.RR(a))}
function EI(a,b){iS.xI();return a==b?0:a?1:-1}
iS.FI=function FI(a,b){iS.xI();return HD(a)?iS.pK(a,b):ED(a)?iS.vJ(a,b):DD(a)?iS.zI(a,b):a.fb(b)};iS.GI=function GI(a){return a};xD={4:1,121:1,25:1};var wI;function HI(a){if(iS.uK(lS.RR(a),LS)){return true}return a!=null&&lS.JR(a)}
iS.SI=function SI(a){a.g=RI++};iS.TI=function TI(a){if(a.k!=null){return}iS.gJ(a)};iS.UI=function UI(a){iS.TI(a);return a.k};iS.VI=function VI(a){return (a.e&4)!=0};iS.WI=function WI(a){return (a.e&1)!=0};iS.XI=function XI(){iS.SI(this);this.k=null;this.i=null;this.f=null;this.d=null;this.b=null;this.j=null;this.a=null};iS.ZI=function ZI(a){var b;b=new iS.XI;b.k='Class$'+(a?'S'+a:''+b.g);b.b=b.k;b.i=b.k;return b};function $I(a){var b;b=iS.ZI(a);iS.kJ(a,b);return b}
function _I(a,b){var c;c=iS.ZI(a);iS.kJ(a,c);c.e=b?8:0;return c}
function aJ(a){var b;b=iS.ZI(a);b.j=a;b.e=1;return b}
iS.cJ=function cJ(a,b){var c=a.a=a.a||[];return c[b]||(c[b]=a.rb(b))};function eJ(a){if(a.wb()){return null}var b=a.j;var c=lH[b];return c}
iS.gJ=function gJ(a){if(a.vb()){var b=a.c;b.wb()?(a.k='['+b.j):!b.vb()?(a.k='[L'+b.tb()+';'):(a.k='['+b.tb());a.b=b.sb()+'[]';a.i=b.ub()+'[]';return}var c=a.f;var d=a.d;d=d.split('/');a.k=iS.jJ('.',[c,iS.jJ('$',d)]);a.b=iS.jJ('.',[c,iS.jJ('.',d)]);a.i=d[d.length-1]};iS.jJ=function jJ(a,b){var c=0;while(!b[c]||b[c]==''){c++}var d=b[c++];for(;c<b.length;c++){if(!b[c]||b[c]==''){continue}d+=a+b[c]}return d};iS.kJ=function kJ(a,b){var c;if(!a){return}b.j=a;var d=eJ(b);if(!d){lH[a]=[b];return}d.Ib=b};pH(83,1,{},iS.XI);_.rb=function YI(a){var b;b=new iS.XI;b.e=4;a>1?(b.c=iS.cJ(this,a-1)):(b.c=this);return b};_.sb=function bJ(){iS.TI(this);return this.b};_.tb=function dJ(){return iS.UI(this)};_.ub=function fJ(){iS.TI(this);return this.i};_.vb=function hJ(){return iS.VI(this)};_.wb=function iJ(){return iS.WI(this)};_.db=function lJ(){return ((this.e&2)!=0?'interface ':(this.e&1)!=0?'':'class ')+(iS.TI(this),this.k)};_.e=0;_.g=0;var RI=1;iS.oJ=function oJ(a){return iS.uK(KS,lS.RR(a))||iS.sJ(a)};iS.pJ=function pJ(a){iS.nJ==null&&(iS.nJ=iS.rJ());if(!iS.nJ.test(a)){throw JG(new iS.jK(OS+a+'"'))}return iS.tJ(a)};iS.qJ=function qJ(a){var b,c,d,e,f;if(a==null){throw JG(new iS.jK(PS))}d=iS.IK(a).length;e=d>0&&(iS.IK(a).charCodeAt(0)==45||iS.IK(a).charCodeAt(0)==43)?1:0;for(b=e;b<d;b++){if(KI(iS.IK(a).charCodeAt(b))==-1){throw JG(new iS.jK(OS+a+'"'))}}f=lS.OR(a,10);c=f<-2147483648;if(lS.MR(f)){throw JG(new iS.jK(OS+a+'"'))}else if(c||f>MS){throw JG(new iS.jK(OS+a+'"'))}return f};iS.rJ=function rJ(){return /^\s*[+-]?(NaN|Infinity|((\d+\.?\d*)|(\.\d+))([eE][+-]?\d+)?[dDfF]?)\s*$/};iS.sJ=function sJ(a){return a instanceof Number};iS.tJ=function tJ(a){return parseFloat(a)};pH(75,1,{4:1,75:1});iS.uJ=function uJ(a,b){return AJ(lS.TR((lS.AR(a),a)),lS.TR((lS.AR(b),b)))};iS.vJ=function vJ(a,b){return iS.uJ(a,b)};iS.wJ=function wJ(a,b){return lS.AR(a),a===b};iS.xJ=function xJ(){return hS.wF};iS.yJ=function yJ(a){return LD(lS.TR((lS.AR(a),a)))};function zJ(a){return iS.uK(KS,lS.RR(a))}
function AJ(a,b){if(a<b){return -1}if(a>b){return 1}if(a==b){return 0}return lS.MR(a)?lS.MR(b)?0:1:-1}
function BJ(a){var b,c,d,e,f,g;if(lS.MR(a)){return {l:0,m:0,h:524160}}g=false;if(a==0){return 1/a==-Infinity?{l:0,m:0,h:QS}:0}if(a<0){g=true;a=-a}if(!lS.MR(a)&&!lS.LR(a)){return g?{l:0,m:0,h:1048320}:{l:0,m:0,h:524032}}c=0;if(a<1){b=512;for(d=0;d<10;++d,b>>=1){if(a<(iS.EJ(),iS.CJ)[d]&&c-b>=-1023){a*=iS.DJ[d];c-=b}}if(a<1&&c-1>=-1023){a*=2;--c}}else if(a>=2){b=512;for(d=0;d<10;++d,b>>=1){if(a>=(iS.EJ(),iS.DJ)[d]){a*=iS.CJ[d];c+=b}}}c>-1023?(a-=1):(a*=0.5);e=VG(a*RS);a-=dH(e)*9.5367431640625E-7;f=VG(a*4503599627370496);e=_G(e,hS.TG(c+1023<<20));g&&(e=_G(e,2147483648));return _G(aH(e,32),f)}
yD={4:1,25:1,122:1,75:1};iS.oA=function oA(a){a.g=QC(hS.KF,HS,39,0,0,1)};iS.pA=function pA(a){kS.MB(a)};iS.qA=function qA(a){return kS.NB(a)};iS.rA=function rA(a){if(a.j){a.backingJsObject!==SS&&a.mb();a.g=null}return a};iS.sA=function sA(a,b,c){var d,e,f,g,h;iS.tA(a);for(e=(a.i==null&&(a.i=QC(hS.PF,HS,14,0,0,1)),a.i),f=0,g=e.length;f<g;++f){d=e[f];iS.sA(d,b,'\t'+c)}h=a.e;!!h&&iS.sA(h,b,c)};iS.tA=function tA(a){var b,c,d;for(b=(a.g==null&&(a.g=iS.qA(a)),a.g),c=0,d=b.length;c<d;++c);};iS.uA=function uA(a,b){a.backingJsObject=b;b!=null&&lS.QR(b,NS,a)};iS.vA=function vA(a){return iS.wA(a,a.lb())};iS.wA=function wA(a,b){var c;c=iS.UI(a.Ib);return b==null?c:c+': '+b};iS.xA=function xA(){iS.oA(this);iS.rA(this);this.mb()};iS.yA=function yA(a){iS.oA(this);this.f=a;iS.rA(this);this.mb()};iS.AA=function AA(b){if(!('stack' in b)){try{throw b}catch(a){}}return b};function DA(a){var b;if(a!=null){b=lS.IR(a,NS);if(b){return b}}return GD(a,$wnd.TypeError)?new iS.gK(a):new iS.MA(a)}
pH(14,1,{4:1,14:1});_.kb=function zA(a){return new $wnd.Error(a)};_.lb=function BA(){return this.f};_.mb=function CA(){var a,b,c;c=this.f==null?null:iS.IK(this.f).replace(new $wnd.RegExp(GS,'g'),' ');b=(a=iS.UI(this.Ib),c==null?a:a+': '+c);iS.uA(this,iS.AA(this.kb(b)));iS.pA(this)};_.db=function EA(){return iS.vA(this)};_.backingJsObject=SS;_.j=true;iS.FA=function FA(){iS.xA.call(this)};iS.GA=function GA(a){iS.oA(this);iS.rA(this);this.backingJsObject=a;a!=null&&lS.QR(a,NS,this);this.f=a==null?PS:vH(a)};iS.HA=function HA(a){iS.yA.call(this,a)};pH(12,14,TS,iS.HA);iS.SJ=function SJ(a,b){return UJ(a.a,b.a)};iS.TJ=function TJ(a){this.a=a};function UJ(a,b){return a<b?-1:a>b?1:0}
iS.ZJ=function ZJ(a,b){return (a>>>0).toString(b)};iS.$J=function $J(a){var b,c;if(a>-129&&a<128){b=a+128;c=(iS.aK(),iS._J)[b];!c&&(c=iS._J[b]=new iS.TJ(a));return c}return new iS.TJ(a)};pH(30,75,{4:1,25:1,30:1,75:1},iS.TJ);_.fb=function VJ(a){return iS.SJ(this,a)};_.ab=function WJ(a){return CD(a,30)&&a.a==this.a};_.cb=function XJ(){return this.a};_.db=function YJ(){return ''+this.a};_.a=0;iS.IA=function IA(){iS.FA.call(this)};iS.JA=function JA(a){iS.GA.call(this,a)};iS.KA=function KA(a){iS.HA.call(this,a)};pH(26,12,TS);iS.LA=function LA(){iS.IA.call(this)};iS.MA=function MA(a){iS.JA.call(this,a)};iS.NA=function NA(a){iS.KA.call(this,a)};pH(50,26,TS,iS.MA);iS.fK=function fK(){iS.LA.call(this)};iS.gK=function gK(a){iS.MA.call(this,a)};iS.hK=function hK(a){iS.NA.call(this,a)};pH(67,50,TS,iS.fK,iS.gK,iS.hK);_.kb=function iK(a){return new $wnd.TypeError(a)};iS.oK=function oK(a,b){return iS.IK(a).charCodeAt(b)};iS.pK=function pK(a,b){return iS.qK(a,b)};iS.qK=function qK(a,b){return lS.HR((lS.AR(a),a),(lS.AR(b),b))};iS.rK=function rK(a,b){return iS.qK(iS.IK(a).toLowerCase(),iS.IK(b).toLowerCase())};iS.sK=function sK(a,b){return lS.AR(a),a+(lS.AR(b),b)};iS.tK=function tK(a){var b;return iS.JK(lS.rR(a,0,(b=a.length,lS.oR(),b)))};iS.uK=function uK(a,b){return lS.AR(a),a===b};iS.vK=function vK(a,b){lS.AR(a);if(b==null){return false}if(iS.uK(a,b)){return true}return iS.IK(a).length==iS.IK(b).length&&iS.uK(iS.IK(a).toLowerCase(),iS.IK(b).toLowerCase())};iS.wK=function wK(){return hS.OF};iS.xK=function xK(a){return lS.cS(a)};iS.yK=function yK(a,b){return iS.IK(a).indexOf(b)};iS.zK=function zK(a,b,c){return iS.IK(a).indexOf(b,c)};function AK(a){return iS.uK(LS,lS.RR(a))}
iS.BK=function BK(a,b){return iS.IK(a).lastIndexOf(b)};iS.CK=function CK(a,b,c){return iS.IK(a).lastIndexOf(b,c)};iS.DK=function DK(a,b){return iS.IK(a).substr(b,iS.IK(a).length-b)};iS.EK=function EK(a,b,c){return iS.IK(a).substr(b,c-b)};iS.FK=function FK(a){var b,c,d;c=iS.IK(a).length;d=0;while(d<c&&iS.IK(a).charCodeAt(d)<=32){++d}b=c;while(b>d&&iS.IK(a).charCodeAt(b-1)<=32){--b}return d>0||b<c?iS.IK(a).substr(d,b-d):a};iS.GK=function GK(a){return String.fromCharCode.apply(null,a)};function HK(a){var b,c;if(a>=US){b=55296+(a-US>>10&1023)&VS;c=56320+(a-US&1023)&VS;return String.fromCharCode(b)+(''+String.fromCharCode(c))}else{return String.fromCharCode(a&VS)}}
iS.IK=function IK(a){return a};iS.JK=function JK(a){return iS.KK(a,a.length)};iS.KK=function KK(a,b){var c,d,e;lS.FR(b,a.length);e='';for(d=0;d<b;){c=d+WS<b?d+WS:b;e+=iS.GK(lS.lR(a,d,c));d=c}return e};zD={4:1,84:1,25:1,2:1};lS.vR=function vR(a){if(!a){throw JG(new iS.PJ)}};lS.wR=function wR(a,b){if(0>a){throw JG(new iS.QJ('fromIndex: 0 > toIndex: '+a))}if(a>b){throw JG(new iS.vI(XS+a+YS+b))}};lS.xR=function xR(a){if(a<0){throw JG(new iS.eK('Negative array size: '+a))}};lS.yR=function yR(a){if(!a){throw JG(new CS.eP)}};lS.zR=function zR(a,b){if(a<0||a>=b){throw JG(new iS.tI('Index: '+a+', Size: '+b))}};lS.AR=function AR(a){if(a==null){throw JG(new iS.fK)}return a};lS.BR=function BR(a,b){if(a==null){throw JG(new iS.hK(b))}};lS.CR=function CR(a,b){if(a<0||a>b){throw JG(new iS.tI('Index: '+a+', Size: '+b))}};lS.DR=function DR(a,b,c){if(a<0||b>c){throw JG(new iS.tI(ZS+a+', toIndex: '+b+', size: '+c))}if(a>b){throw JG(new iS.QJ(ZS+a+' > toIndex: '+b))}};lS.ER=function ER(a){if(!a){throw JG(new iS.RJ)}};lS.FR=function FR(a,b){if(a>b||a<0){throw JG(new iS.WK(XS+a+YS+b))}};lS.GR=function GR(a){lS.AR(a);return a};lS.HR=function HR(a,b){return a==b?0:a<b?-1:1};lS.IR=function IR(a,b){return a[b]};lS.JR=function JR(a){return a.$implements__java_lang_CharSequence};lS.KR=function KR(a){return a.$implements__java_lang_Comparable};lS.LR=function LR(a){return isFinite(a)};lS.MR=function MR(a){return isNaN(a)};lS.NR=function NR(a){return a===undefined};lS.OR=function OR(a,b){return parseInt(a,b)};lS.PR=function PR(a,b,c){a[b]=c};lS.QR=function QR(b,c,d){try{b[c]=d}catch(a){}};lS.RR=function RR(a){return typeof a};lS.SR=function SR(a){return a};lS.TR=function TR(a){return a};lS.WR=function WR(a){return a.$H||(a.$H=lS.XR())};lS.XR=function XR(){return ++lS.VR};lS.VR=0;lS._R=function _R(){lS._R=rH;lS.YR=lS.bS();lS.$R=lS.bS()};lS.aS=function aS(a){var b,c,d,e;b=0;d=iS.IK(a).length;e=d-4;c=0;while(c<e){b=iS.IK(a).charCodeAt(c+3)+31*(iS.IK(a).charCodeAt(c+2)+31*(iS.IK(a).charCodeAt(c+1)+31*(iS.IK(a).charCodeAt(c)+31*b)));b=b|0;c+=4}while(c<d){b=b*31+iS.oK(a,c++)}b=b|0;return b};lS.bS=function bS(){return {}};lS.cS=function cS(a){lS._R();var b,c,d;c=':'+a;d=lS.dS(lS.$R,c);if(!lS.NR(d)){return lS.fS(d)}d=lS.dS(lS.YR,c);b=lS.NR(d)?lS.aS(a):lS.fS(d);lS.eS();lS.PR(lS.$R,c,b);return b};lS.dS=function dS(a,b){return a[b]};lS.eS=function eS(){if(lS.ZR==256){lS.YR=lS.$R;lS.$R=lS.bS();lS.ZR=0}++lS.ZR};lS.fS=function fS(a){return a};lS.ZR=0;hS.IF=$I(1);hS.WE=$I(0);hS.bF=$I(170);hS.$E=$I(124);hS.aF=$I(171);hS._E=$I(125);hS.uF=$I(121);hS.vF=$I(83);hS.HF=$I(75);hS.wF=$I(122);hS.PF=$I(14);hS.yF=$I(12);hS.CF=$I(30);hS.JF=$I(26);hS.DF=$I(50);hS.FF=$I(67);hS.OF=$I(2);mS.Nc=function Nc(){mS.Nc=rH;mS.Bc=YC(KC(hS.QD,1),$S,5,15,[0,_S,14286847,13402367,12779264,16758197,9474192,3166456,16715021,9494608,11789301,11230450,9109248,12560038,15780000,16744448,16777008,2093087,8442339,9388244,4062976,15132390,12567239,10921643,9083335,10255047,14706227,15765664,5296208,13140019,8224944,12750735,6721423,12419299,16752896,10889513,6076625,7351984,65280,9764863,9756896,7586505,5551541,3907230,2396047,687500,27013,12632256,16767375,10909043,6717568,10380213,13924864,9699476,4366000,5707663,51456,7394559,16777159,14286791,13107143,10747847,9437127,6422471,4587463,3211207,2097095,65436,58997,54354,48952,43812,5096191,5089023,2200790,2522539,2516630,1528967,13684960,16765219,12105936,10900557,5724513,10375093,11230208,7688005,4358806,4325478,32000,7384058,47871,41471,36863,33023,27647,5528818,7888099,9064419,10565332,11739092,11739066,11734438,12389767,13041766,13369433,13697103,14221381,14680120,15073326,15400998,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13158600,1334015,56540,15075850,15132160,56540,15075850,15461355,8553170,1016335,1016335,1334015,15132160,3289770,14456450,16422400,16422400,11819700,3289770,1016335]);mS.Ec=new xS.IH(255,128,0);mS.Dc=new xS.IH(92,160,255);mS.Mc=new xS.IH(160,0,64);mS.Cc=new xS.IH(255,160,255);mS.Fc=new xS.IH(32,96,255);mS.Lc=new xS.IH(255,0,0);mS.Ic=new xS.IH(0,255,0);mS.Jc=new xS.IH(192,0,255);mS.Kc=new xS.IH(255,160,0);mS.Gc=new xS.IH(0,128,0);mS.Hc=new xS.IH(160,0,0)};mS.Oc=function Oc(a){a.t=new yS.dI};mS.Pc=function Pc(a){var b,c;if((a.B&32)!=0)return;c=mS.So(a.H);if(c!=null){if(a.u.a==0&&a.u.b==0){b=a.L.c*mS.ai(a.H);mS.Id(a);mS.Yc(a,b);mS.Fd(a,null,b,0)}mS.mo(a,LD(a.v));mS.Gd(a,448);mS.go(a,c,a.u.a,a.u.b+aT*a.v)}};mS.Qc=function Qc(a,b){return a==null?b:a+','+b};mS.Rc=function Rc(a){var b;b=a.L.c*mS.ai(a.H);a.S=b*0.06;a.N=b*0.15;a.M=b*0.38;a.Q=b*0.47;a.R=LD(b*a.F*0.6+0.5);a.P=b*0.12;a.T=b*0.4;a.v=b*0.5+0.5};mS.Sc=function Sc(a,b,c,d){var e,f;e=new mS.Od;f=new mS.Od;e.a=b.a;e.c=b.c;e.b=(b.a+b.b)/2;e.d=(b.c+b.d)/2;f.a=e.b;f.c=e.d;f.b=b.b;f.d=b.d;if(mS.Cd(a,e)){mS.Gd(a,a.o[c]);mS.co(a,e)}if(mS.Cd(a,f)){mS.Gd(a,a.o[d]);mS.co(a,f)}mS.Gd(a,a.K)};mS.Tc=function Tc(a,b,c,d){var e,f,g,h,i;h=(b.b-b.a)/10;i=(b.d-b.c)/10;e=new mS.Od;if(mS.Gi(a.H,mS.Ck(a.H,c,d))){f=-3;g=-3}else{f=a.o[c];g=a.o[d]}mS.Gd(a,f);e.a=b.a;e.c=b.c;e.b=b.a+h*2;e.d=b.c+i*2;mS.co(a,e);e.a=b.a+h*4;e.c=b.c+i*4;e.b=b.a+h*5;e.d=b.c+i*5;mS.co(a,e);mS.Gd(a,g);e.a=b.a+h*5;e.c=b.c+i*5;e.b=b.a+h*6;e.d=b.c+i*6;mS.co(a,e);e.a=b.a+h*8;e.c=b.c+i*8;e.b=b.b;e.d=b.d;mS.co(a,e);mS.Gd(a,a.K)};mS.Uc=function Uc(a,b,c){mS.ho(a,b-a.P/2,c-a.P/2,a.P)};mS.Vc=function Vc(a,b,c,d){if(mS.Gi(a.H,mS.Ck(a.H,c,d))){mS.Gd(a,-3);mS.co(a,b);mS.Gd(a,a.K)}else if(a.o[c]!==a.o[d]){mS.Sc(a,b,c,d)}else if(a.o[c]!=0){mS.Gd(a,a.o[c]);mS.co(a,b);mS.Gd(a,a.K)}else{mS.co(a,b)}};mS.Wc=function Wc(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p;l=b.b-b.a;o=b.d-b.c;i=$wnd.Math.sqrt(l*l+o*o);j=2*eH(VG($wnd.Math.round(i/(4*a.S))));m=l/(j-1);p=o/(j-1);if(mS.Gi(a.H,mS.Ck(a.H,c,d))){e=-3;f=-3}else{e=a.o[c];f=a.o[d]}k=b.a-a.S/2;n=b.c-a.S/2;mS.Gd(a,e);for(h=0;h<(j/2|0);h++){mS.ho(a,k,n,a.S);k+=m;n+=p}mS.Gd(a,f);for(g=0;g<(j/2|0);g++){mS.ho(a,k,n,a.S);k+=m;n+=p}mS.Gd(a,a.K)};mS.Xc=function Xc(a,b,c,d){var e,f,g,h,i,j,k,l;k=(b.c-b.d)/9;l=(b.b-b.a)/9;g=QC(hS.OD,bT,5,3,15,1);h=QC(hS.OD,bT,5,3,15,1);i=QC(hS.OD,bT,5,4,15,1);j=QC(hS.OD,bT,5,4,15,1);g[0]=b.a;h[0]=b.c;i[2]=b.b+k;j[2]=b.d+l;i[3]=b.b-k;j[3]=b.d-l;g[1]=(g[0]+i[2])/2;h[1]=(h[0]+j[2])/2;g[2]=(g[0]+i[3])/2;h[2]=(h[0]+j[3])/2;i[0]=g[2];j[0]=h[2];i[1]=g[1];j[1]=h[1];if(mS.Gi(a.H,mS.Ck(a.H,c,d))){e=-3;f=-3}else{e=a.o[c];f=mS._c(a,c);e==mS.Lh(a.H,c)&&(e=f)}mS.Gd(a,e);mS.fo(a,g,h,3);mS.Gd(a,f);mS.fo(a,i,j,4);mS.Gd(a,a.K)};mS.Yc=function Yc(a,b){var c,d;for(d=0;d<a.U.a.length;d++)a.t=yS.bI(a.t,CS.NN(a.U,d));mS.Zc(a,b);c=0.1*b;a.t.c-=c;a.t.d-=c;a.t.b+=2*c;a.t.a+=2*c};mS.Zc=function Zc(a,b){var c,d,e,f,g,h,i;e=QC(hS.EG,cT,5,a.H.o,16,1);for(d=0;d<a.H.p;d++){if(mS.Ei(a.H,d)){e[mS.di(a.H,0,d)]=true;e[mS.di(a.H,1,d)]=true}}g=new yS.dI;for(c=0;c<a.H.o;c++){f=(mS.Wh(a.H,c)&dT)!=0?b*0.47:e[c]?b*0.38:0;if(f!=0){h=mS.Rg(a.L,mS.Yh(a.H,c));i=mS.Sg(a.L,mS.Zh(a.H,c));yS.cI(g,h-f,i-f,f*2,f*2);a.t=yS.bI(a.t,g)}}};mS.$c=function $c(a){var b,c;b=(xS.DH(),xS.zH);c=new xS.HH(a);return rS.hA(c,b)};mS._c=function _c(a,b){var c,d;if((a.B&128)!=0)return a.o[b];d=mS.ad(a,b);if(d==-1){c=mS.mk(a.H,b);if(c!=-1){b=c;d=mS.ad(a,c)}}if(d==-1)return a.o[b];switch(d&255){case 1:return 384;case 2:return 64;default:return 448;}};mS.ad=function ad(a,b){var c,d,e;e=-1;d=-1;if((a.B&128)!=0)return -1;if(mS.Ci(a.H,b)){e=mS.Ph(a.H,b);d=mS.Oh(a.H,b)}c=mS.nk(a.H,b);if(c!=-1){e=mS.ii(a.H,c);d=mS.hi(a.H,c)}e!=-1&&e!=0&&(e|=d<<8);return e};mS.bd=function bd(a){var b,c,d,e;mS.lo(a,2*a.M);e=new mS.Od;for(d=0;d<a.H.p;d++){b=mS.di(a.H,0,d);c=mS.di(a.H,1,d);if(mS.Ei(a.H,d)){e.a=mS.Rg(a.L,mS.Yh(a.H,b));e.c=mS.Sg(a.L,mS.Zh(a.H,b));e.b=mS.Rg(a.L,mS.Yh(a.H,c));e.d=mS.Sg(a.L,mS.Zh(a.H,c));mS.Gd(a,-2);mS.co(a,e)}}};mS.cd=function cd(a){var b,c,d,e,f,g;if(a.H.I){g=a.Q;mS.Gd(a,-7);for(b=0;b<a.H.d;b++)(mS.Wh(a.H,b)&dT)!=0&&mS.ho(a,mS.Rg(a.L,mS.Yh(a.H,b))-g,mS.Sg(a.L,mS.Zh(a.H,b))-g,2*g);mS.lo(a,2*a.Q);f=new mS.Od;for(e=0;e<a.H.p;e++){c=mS.di(a.H,0,e);d=mS.di(a.H,1,e);if((mS.Wh(a.H,c)&mS.Wh(a.H,d)&dT)!=0){f.a=mS.Rg(a.L,mS.Yh(a.H,c));f.c=mS.Sg(a.L,mS.Zh(a.H,c));f.b=mS.Rg(a.L,mS.Yh(a.H,d));f.d=mS.Sg(a.L,mS.Zh(a.H,d));mS.co(a,f)}}}};mS.dd=function dd(a){var b,c,d,e;if(a.H.I){mS.Gd(a,320);if((a.B&8)!=0)for(b=0;b<a.H.d;b++)(mS.Wh(a.H,b)&-536870913)!=0&&mS.ho(a,mS.Rg(a.L,mS.Yh(a.H,b))-a.T/2,mS.Sg(a.L,mS.Zh(a.H,b))-a.T/2,a.T);for(e=0;e<a.H.e;e++){if(mS.ni(a.H,e)!=0){c=mS.di(a.H,0,e);d=mS.di(a.H,1,e);mS.ho(a,(mS.Rg(a.L,mS.Yh(a.H,c))+mS.Rg(a.L,mS.Yh(a.H,d))-a.T)/2,(mS.Sg(a.L,mS.Zh(a.H,c))+mS.Sg(a.L,mS.Zh(a.H,d))-a.T)/2,a.T)}}}};mS.ed=function ed(a){a.F=1;a.L=new mS.Tg;a.U=new CS._N;a.O=new CS._N;a.q=QC(hS.EG,cT,5,a.H.o,16,1);a.u=new yS.TH;a.K=0;a.w=-1;mS.Kd(a)};mS.fd=function fd(a,b){var c;if(mS.rk(a.H,b)==0)return false;for(c=0;c<mS.rk(a.H,b);c++)if(!mS.Gi(a.H,mS.Gk(a.H,b,c)))return false;return true};mS.gd=function gd(a){var b;a.p=QC(hS.EG,cT,5,a.H.o,16,1);for(b=0;b<a.H.p;b++){a.p[mS.di(a.H,0,b)]=true;a.p[mS.di(a.H,1,b)]=true}};mS.hd=function hd(a,b){var c;if(mS.Fk(a.H,b)!=2)return false;for(c=0;c<2;c++)if(mS.Hk(a.H,b,c)!=2)return false;return true};mS.jd=function jd(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o;m=false;e.a=0;e.b=0;d>0?(f=eT):(f=fT);o=mS.ci(a.H,b,c);for(k=0;k<mS.Fk(a.H,b);k++){g=mS.Gk(a.H,b,k);h=o;mS.di(a.H,0,g)==b?(l=mS.di(a.H,1,g)):(l=mS.di(a.H,0,g));if(l==c)continue;n=mS.ci(a.H,b,l);o<n&&(h+=gT);i=h-n;if(d>0){i<hT&&(m=true);i>eT&&(i=eT);i<0.523598776&&(i=0.523598776);if(i<=f){f=i;j=a.N*$wnd.Math.tan(i-iT)/2;e.a=-(j*$wnd.Math.sin(h));e.b=-(j*$wnd.Math.cos(h))}}else{i>=hT&&(m=true);i<fT&&(i=fT);i>5.759586531&&(i=5.759586531);if(i>=f){f=i;j=a.N*$wnd.Math.tan(4.712388981-i)/2;e.a=-(j*$wnd.Math.sin(h));e.b=-(j*$wnd.Math.cos(h))}}}return m};mS.kd=function kd(a,b,c,d){var e;if(b==0){c<0?(d.a=a.N):(d.a=-a.N);d.b=0;return}e=$wnd.Math.atan(c/b);b<0&&(e+=hT);d.a=-(a.N*$wnd.Math.sin(e));d.b=a.N*$wnd.Math.cos(e)};mS.ld=function ld(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p;e=new mS.Od;i=new mS.Od;k=new yS.TH;j=new yS.TH;g=mS.di(a.H,0,c);h=mS.di(a.H,1,c);if(d){m=b.a;b.a=b.b;b.b=m;m=b.c;b.c=b.d;b.d=m;n=g;g=h;h=n}if(!mS.Cd(a,b))return;if(mS.tl(a.H,c)){e.a=b.a;e.c=b.c;e.b=b.b;e.d=b.d;l=d?-mS.Bd(a,c):mS.Bd(a,c);l==0&&(l=1);mS.kd(a,b.b-b.a,b.d-b.c,k);if(l>0){i.a=b.a+k.a;i.c=b.c+k.b;i.b=b.b+k.a;i.d=b.d+k.b;if(mS.jd(a,g,h,1,j)||mS.Fk(a.H,g)>1){i.a+=j.a+k.b;i.c+=j.b-k.a}}else{i.a=b.a-k.a;i.c=b.c-k.b;i.b=b.b-k.a;i.d=b.d-k.b;if(mS.jd(a,g,h,-1,j)||mS.Fk(a.H,g)>1){i.a+=j.a+k.b;i.c+=j.b-k.a}}mS.oi(a.H,c)==26&&mS.Ad(e,i);mS.Cd(a,e)&&mS.Vc(a,e,g,h);mS.oi(a.H,c)==64?mS.Cd(a,i)&&mS.Tc(a,i,g,h):mS.Cd(a,i)&&mS.Vc(a,i,g,h)}else{mS.kd(a,b.b-b.a,b.d-b.c,k);o=k.a/2;p=k.b/2;f=false;e.a=b.a+o;e.c=b.c+p;e.b=b.b+o;e.d=b.d+p;if(mS.Fk(a.H,g)>1){if(mS.jd(a,g,h,1,j)){e.a+=j.a;e.c+=j.b;if(mS.Fk(a.H,g)==2){if(j.a!=0||j.b!=0){e.a+=k.b;e.c-=k.a}}}else{a.n[g]=new yS.UH(e.a,e.c)}}i.a=b.a-o;i.c=b.c-p;i.b=b.b-o;i.d=b.d-p;if(mS.Fk(a.H,g)>1){if(mS.jd(a,g,h,0,j)){i.a+=j.a;i.c+=j.b;if(mS.Fk(a.H,g)==2){if(j.a!=0||j.b!=0){i.a+=k.b;i.c-=k.a}}}else{a.n[g]=new yS.UH(i.a,i.c);f=true}}mS.oi(a.H,c)==26&&mS.Ad(e,i);if(mS.oi(a.H,c)==64){if(f){mS.Tc(a,e,g,h);mS.Vc(a,i,g,h)}else{mS.Vc(a,e,g,h);mS.Tc(a,i,g,h)}}else{mS.Vc(a,e,g,h);mS.Vc(a,i,g,h)}}};
mS.md=function md(a){var b,c,d,e,f,g,h,i,j,k,l;a.n=QC(hS.hF,HS,36,a.H.o,0,1);for(h=0;h<a.H.p;h++)(mS.oi(a.H,h)==2||mS.oi(a.H,h)==26||mS.oi(a.H,h)==64)&&mS.pd(a,h);for(i=0;i<a.H.p;i++)mS.oi(a.H,i)!=2&&mS.oi(a.H,i)!=26&&mS.oi(a.H,i)!=64&&mS.pd(a,i);if((a.B&64)==0){for(g=0;g<a.H.p;g++){if(mS.gi(a.H,g)!=0){switch(mS.gi(a.H,g)){case 1:d=mS.li(a.H,g)==2?'E':mS.Ii(a.H,g)?'p':'P';break;case 2:d=mS.li(a.H,g)==2?'Z':mS.Ii(a.H,g)?'m':'M';break;default:d='?';}mS.mo(a,(a.R*2+1)/3|0);mS.Gd(a,mS.Gi(a.H,g)?-3:448);b=mS.di(a.H,0,g);c=mS.di(a.H,1,g);k=(mS.Rg(a.L,mS.Yh(a.H,b))+mS.Rg(a.L,mS.Yh(a.H,c)))/2;l=(mS.Sg(a.L,mS.Zh(a.H,b))+mS.Sg(a.L,mS.Zh(a.H,c)))/2;e=(mS.Rg(a.L,mS.Yh(a.H,b))-mS.Rg(a.L,mS.Yh(a.H,c)))/3;f=(mS.Sg(a.L,mS.Zh(a.H,b))-mS.Sg(a.L,mS.Zh(a.H,c)))/3;mS.sd(a,k+f,l-e,d,true);mS.Gd(a,a.K);mS.mo(a,a.R)}}}if((a.B&4)!=0){mS.mo(a,(a.R*2+1)/3|0);mS.Gd(a,384);for(g=0;g<a.H.p;g++){b=mS.di(a.H,0,g);c=mS.di(a.H,1,g);j=mS.pl(a.H,g)?'d':mS.nl(a.H,g)?'a':'';k=(mS.Rg(a.L,mS.Yh(a.H,b))+mS.Rg(a.L,mS.Yh(a.H,c)))/2;l=(mS.Sg(a.L,mS.Zh(a.H,b))+mS.Sg(a.L,mS.Zh(a.H,c)))/2;mS.sd(a,k,l,j+(''+g),true)}mS.Gd(a,a.K);mS.mo(a,a.R)}};mS.nd=function nd(a){var b,c;for(c=new CS.vO(a.O);c.a<c.c.a.length;){b=CS.uO(c);mS.Gd(a,b.a);mS.Uc(a,b.b,b.c)}mS.Gd(a,a.K)};mS.od=function od(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W;a.G||mS.io(a,b,(mS.Qh(a.H,b),mS.Rg(a.L,mS.Yh(a.H,b))),mS.Sg(a.L,mS.Zh(a.H,b)));I=null;if(mS.Kh(a.H,b)!=0){Q=iS.bK(mS.Kh(a.H,b))==1?'':''+iS.bK(mS.Kh(a.H,b));I=mS.Kh(a.H,b)<0?Q+'-':Q+'+'}A=null;J=mS.Wh(a.H,b);if(J!=0){(J&2)!=0&&(A='a');(J&4)!=0&&(A=A==null?'!a':A+','+'!a');(J&jT)!=0&&(A=A==null?'s':A+','+'s');(J&kT)!=0&&(A=A==null?'!s':A+','+'!s');if((J&lT)!=0){t=J&lT;t==1792?(A=A==null?'h0':A+','+'h0'):t==1664?(A=A==null?'h1':A+','+'h1'):t==1408?(A=A==null?'h2':A+','+'h2'):t==128?(A=A==null?'h>0':A+','+'h>0'):t==384?(A=A==null?'h>1':A+','+'h>1'):t==896?(A=A==null?'h>2':A+','+'h>2'):t==mT?(A=A==null?'h<3':A+','+'h<3'):t==1536&&(A=A==null?'h<2':A+','+'h<2')}if((J&nT)!=0){h=J&nT;h==167772160?(A=A==null?'c0':A+','+'c0'):h==oT?(A=A==null?'c+':A+','+'c+'):h==pT&&(A=A==null?'c-':A+','+'c-')}if((J&qT)!=0){H=J&qT;H==98304?(A=A==null?'pi0':A+','+'pi0'):H==81920?(A=A==null?'pi1':A+','+'pi1'):H==49152?(A=A==null?'pi2':A+','+'pi2'):H==rT&&(A=A==null?'pi>0':A+','+'pi>0')}if((J&sT)!=0){G=J&sT;G==3801088?(A=A==null?'n1':A+','+'n1'):G==3538944?(A=A==null?'n2':A+','+'n2'):G==3014656?(A=A==null?'n3':A+','+'n3'):G==3145728?(A=A==null?'n<3':A+','+'n<3'):G==tT?(A=A==null?'n<4':A+','+'n<4'):G==uT?(A=A==null?'n>1':A+','+'n>1'):G==917504?(A=A==null?'n>2':A+','+'n>2'):G==1966080&&(A=A==null?'n>3':A+','+'n>3')}if((J&120)!=0){M=J&120;M==112?(A=A==null?'!r':A+','+'!r'):M==8?(A=A==null?'r':A+','+'r'):M==104?(A=A==null?'rb2':A+','+'rb2'):M==88?(A=A==null?'rb3':A+','+'rb3'):M==56&&(A=A==null?'rb4':A+','+'rb4')}(J&vT)!=0&&(A=A==null?'r'+((J&vT)>>22):A+','+('r'+((J&vT)>>22)));(J&wT)!=0&&(A=A==null?'f':A+','+'f')}mS.Uh(a.H,b)!=0&&(A=mS.Qc(A,''+mS.Uh(a.H,b)));P=0;if(mS.Xh(a.H,b)!=0){switch(mS.Xh(a.H,b)){case 16:I=I==null?'|':I+','+'|';break;case 32:P=1;break;case 48:P=2;}}k=null;if((a.B&64)==0){if(mS.zi(a.H,b))k='?';else if(mS.Jh(a.H,b)!=0){if(mS.Fk(a.H,b)==2){switch(mS.Jh(a.H,b)){case 2:k=mS.Bi(a.H,b)?'p':'P';break;case 1:k=mS.Bi(a.H,b)?'m':'M';break;default:k='*';}}else{switch(mS.Jh(a.H,b)){case 1:k=mS.Bi(a.H,b)?'r':'R';break;case 2:k=mS.Bi(a.H,b)?'s':'S';break;default:k='*';}}}}(a.B&1792)!=0&&(k=mS.Qc(k,''+mS.Zo(a.H,b)));D=null;(a.B&16)!=0&&mS.Th(a.H,b)!=0&&(D=''+mS.Th(a.H,b));o=null;if(mS.cl(a.H,b)!=-1){n=mS.ad(a,b);n!=-1&&(o=n==0?'abs':((n&255)==1?'&':'or')+(1+(n>>8)))}u=0;a.H.I?((mS._h(a.H,b)!=6||!a.p[b])&&(mS.Wh(a.H,b)&kT)!=0&&mS.Kh(a.H,b)!=0||mS.Xh(a.H,b)!=0)&&(u=mS.Rk(a.H,b)):(mS._h(a.H,b)!=6||!a.p[b]||mS.Xh(a.H,b)!=0)&&(u=mS.Rk(a.H,b));e=mS.Mh(a.H,b);if(e!=null){u=0}else if(mS.Rh(a.H,b)!=null){d=(mS.Wh(a.H,b)&1)!=0?'[!':'[';e=d+mS.Sh(a.H,b)+']';iS.IK(e).length>5&&(e=d+mS.Rh(a.H,b).length+']');(mS.Wh(a.H,b)&kT)!=0&&(u=-1)}else if((mS.Wh(a.H,b)&1)!=0){e='?';(mS.Wh(a.H,b)&kT)!=0&&(u=-1)}else (mS._h(a.H,b)!=6||I!=null||A!=null||u>0||!a.p[b])&&(e=mS.Qh(a.H,b));C=0;!mS.Ri(a.H,b)&(mS.Wh(a.H,b)&dT)!=0&&mS.Gd(a,-8);if(e!=null){C=(K=(R=xS.OH(a.e,e),new yS.eI(0,0,R,0)).b,K);mS.sd(a,mS.Rg(a.L,mS.Yh(a.H,b)),mS.Sg(a.L,mS.Zh(a.H,b)),e,true);a.q[b]=true}else mS.hd(a,b)&&mS.rd(a,mS.Rg(a.L,mS.Yh(a.H,b)),mS.Sg(a.L,mS.Zh(a.H,b)),b);if(I!=null){mS.mo(a,(a.R*2+1)/3|0);T=mS.Rg(a.L,mS.Yh(a.H,b))+((C+(K=(R=xS.OH(a.e,I),new yS.eI(0,0,R,0)).b,K))/2+1);V=mS.Sg(a.L,mS.Zh(a.H,b))-((a.j*4-4)/8|0);mS.sd(a,T,V,I,true);mS.mo(a,a.R)}(a.B&2)!=0&&(A=''+b);if(A!=null){mS.mo(a,(a.R*2+1)/3|0);T=mS.Rg(a.L,mS.Yh(a.H,b))-(C+(K=(R=xS.OH(a.e,A),new yS.eI(0,0,R,0)).b,K))/2;V=mS.Sg(a.L,mS.Zh(a.H,b))-((a.j*4-4)/8|0);mS.sd(a,T,V,A,true);mS.mo(a,a.R)}if(k!=null){mS.mo(a,(a.R*2+1)/3|0);T=mS.Rg(a.L,mS.Yh(a.H,b))-(C+(K=(R=xS.OH(a.e,k),new yS.eI(0,0,R,0)).b,K))/2;V=mS.Sg(a.L,mS.Zh(a.H,b))+((a.j*4+4)/8|0);O=a.w;mS.Gd(a,448);mS.sd(a,T,V,k,false);mS.Gd(a,O);mS.mo(a,a.R)}if(D!=null){mS.mo(a,(a.R*2+1)/3|0);T=mS.Rg(a.L,mS.Yh(a.H,b))+((C+(K=(R=xS.OH(a.e,D),new yS.eI(0,0,R,0)).b,K))/2+1);V=mS.Sg(a.L,mS.Zh(a.H,b))+((a.j*4+4)/8|0);O=a.w;mS.Gd(a,mS.Di(a.H,b)?384:448);mS.sd(a,T,V,D,true);mS.Gd(a,O);mS.mo(a,a.R)}if(o!=null){c=mS.wd(a,b);mS.mo(a,(a.R*2+1)/3|0);T=mS.Rg(a.L,mS.Yh(a.H,b))+0.7*a.j*$wnd.Math.sin(c);V=mS.Sg(a.L,mS.Zh(a.H,b))+0.7*a.j*$wnd.Math.cos(c);O=a.w;mS.Gd(a,mS._c(a,b));mS.sd(a,T,V,o,false);mS.Gd(a,O);mS.mo(a,a.R)}if(u==0&&P==0){a.w==-8&&mS.Gd(a,-9);return}r=QC(hS.OD,bT,5,4,15,1);for(w=0;w<mS.sk(a.H,b);w++){g=mS.Gk(a.H,b,w);for(B=0;B<2;B++){if(mS.di(a.H,B,g)==b){N=mS.ci(a.H,mS.di(a.H,B,g),mS.di(a.H,1-B,g));if(N<xT){r[0]-=N+iT;r[3]+=N+hT}else if(N<0){r[2]+=N+iT;r[3]-=N}else if(N<iT){r[1]+=N;r[2]+=iT-N}else{r[0]+=N-iT;r[1]+=hT-N}}}}mS.Fk(a.H,b)==0?mS.Ki(a.H,b)?(r[3]-=0.2):(r[1]-=0.2):(r[1]-=0.1);(I!=null||D!=null)&&(r[1]+=10);(A!=null||k!=null)&&(r[3]+=10);p='';if(u!=0){s=(L=(S=xS.OH(a.e,'H'),new yS.eI(0,0,S,0)).b,L);q=0;if(u==-1){p='n';mS.mo(a,(a.R*2+1)/3|0);q=(K=(R=xS.OH(a.e,'n'),new yS.eI(0,0,R,0)).b,K)}else if(u>1){p=''+u;mS.mo(a,(a.R*2+1)/3|0);q=(K=(R=xS.OH(a.e,p),new yS.eI(0,0,R,0)).b,K)}if(r[1]<0.6||r[3]<0.6){j=mS.Sg(a.L,mS.Zh(a.H,b));if(r[1]<=r[3]){r[1]+=10;i=mS.Rg(a.L,mS.Yh(a.H,b))+(C+s)/2}else{r[3]+=10;i=mS.Rg(a.L,mS.Yh(a.H,b))-(C+s)/2-q}}else{i=mS.Rg(a.L,mS.Yh(a.H,b));if(r[0]<r[2]){r[0]+=10;j=mS.Sg(a.L,mS.Zh(a.H,b))-a.j}else{r[2]+=10;j=mS.Sg(a.L,mS.Zh(a.H,b))+a.j}}if(q>0){T=i+(s+q)/2;V=j+((a.j*4+4)/8|0);mS.sd(a,T,V,p,true);mS.mo(a,a.R)}mS.sd(a,i,j,'H',true)}f=0;if(P!=0){F=50;l=0;for(v=0;v<4;v++){m=v>1?v-2:v+2;if(r[v]<F){f=v;F=r[v];l=r[m]}else if(r[v]==F){if(r[m]>l){f=v;l=r[m]}}}switch(f){case 0:i=mS.Rg(a.L,mS.Yh(a.H,b));j=mS.Sg(a.L,mS.Zh(a.H,b))-a.P-C/2;break;case 1:i=mS.Rg(a.L,mS.Yh(a.H,b))+a.P+C/2;j=mS.Sg(a.L,mS.Zh(a.H,b));break;case 2:i=mS.Rg(a.L,mS.Yh(a.H,b));j=mS.Sg(a.L,mS.Zh(a.H,b))+a.P+C/2;break;default:i=mS.Rg(a.L,mS.Yh(a.H,b))-a.P-C/2;j=mS.Sg(a.L,mS.Zh(a.H,b));}if(P==1){CS.IN(a.U,new yS.eI(i-a.P,j-a.P,2*a.P,2*a.P));a.G||CS.IN(a.O,new mS.Nd(i,j,mS.fd(a,b)?-3:a.o[b]))}else{switch(f){case 2:case 0:U=2*a.P;W=0;i-=a.P;break;case 1:U=0;W=2*a.P;j-=a.P;break;default:U=0;W=2*a.P;j-=a.P;}CS.IN(a.U,new yS.eI(i-a.P,j-a.P,2*a.P,2*a.P));a.G||CS.IN(a.O,new mS.Nd(i,j,mS.fd(a,b)?-3:a.o[b]));CS.IN(a.U,new yS.eI(i+U-a.P,j+W-a.P,2*a.P,2*a.P));a.G||CS.IN(a.O,new mS.Nd(i+U,j+W,mS.fd(a,b)?-3:a.o[b]))}}a.w==-8&&mS.Gd(a,-9)};mS.pd=function pd(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p;n=new mS.Od;c=new mS.Od;f=new mS.Od;l=new yS.TH;k=new yS.TH;d=mS.di(a.H,0,b);e=mS.di(a.H,1,b);((mS.Wh(a.H,d)|mS.Wh(a.H,e))&dT)!=0;mS.jo(a,d,e,mS.Rg(a.L,mS.Yh(a.H,d)),mS.Sg(a.L,mS.Zh(a.H,d)),mS.Rg(a.L,mS.Yh(a.H,e)),mS.Sg(a.L,mS.Zh(a.H,e)));!mS.Ri(a.H,d)&&!mS.Ri(a.H,e)&&((mS.Wh(a.H,d)|mS.Wh(a.H,e))&dT)!=0&&mS.Gd(a,-8);if(!a.n[d]){n.a=mS.Rg(a.L,mS.Yh(a.H,d));n.c=mS.Sg(a.L,mS.Zh(a.H,d))}else{n.a=a.n[d].a;n.c=a.n[d].b}if(!a.n[e]){n.b=mS.Rg(a.L,mS.Yh(a.H,e));n.d=mS.Sg(a.L,mS.Zh(a.H,e))}else{n.b=a.n[e].a;n.d=a.n[e].b}if((mS.ni(a.H,b)&yT)!=0){mS.Cd(a,n)&&mS.eo(a,n);mS.Gd(a,-9);return}g=mS.oi(a.H,b)==64?0:mS.oi(a.H,b)==32?1:mS.li(a.H,b);switch(g){case 1:switch(mS.oi(a.H,b)){case 1:mS.Cd(a,n)&&mS.Vc(a,n,d,e);break;case 17:mS.yd(a,n,d,e);break;case 9:o=n.b-n.a;p=n.d-n.c;if(mS.Gi(a.H,mS.Ck(a.H,d,e))){h=-3;i=-3}else{h=a.o[d];i=mS._c(a,d);h==mS.Lh(a.H,d)&&(h=i)}for(j=2;j<17;j+=2){c.a=n.a+j*o/17-j*p/128;c.c=n.c+j*p/17+j*o/128;c.b=n.a+j*o/17+j*p/128;c.d=n.c+j*p/17-j*o/128;if(mS.Cd(a,c)){mS.Gd(a,j<9?h:i);mS.co(a,c);mS.Gd(a,a.K)}}break;case 32:mS.Cd(a,n)&&mS.Wc(a,n,d,e);}break;case 0:case 2:if((a.q[d]||mS.vk(a.H,d)==2)&&(a.q[e]||mS.vk(a.H,e)==2)&&!mS.tl(a.H,b)&&g==2){if(!mS.Cd(a,n))break;mS.kd(a,n.b-n.a,n.d-n.c,l);o=l.a/2;p=l.b/2;c.a=n.a+o;c.c=n.c+p;c.b=n.b+o;c.d=n.d+p;f.a=n.a-o;f.c=n.c-p;f.b=n.b-o;f.d=n.d-p;mS.oi(a.H,b)==26&&mS.Ad(c,f);mS.Vc(a,c,d,e);mS.Vc(a,f,d,e)}else if((a.q[e]||mS.vk(a.H,e)==2)&&g==2){mS.ld(a,n,b,false)}else if((a.q[d]||mS.vk(a.H,d)==2)&&g==2){mS.ld(a,n,b,true)}else{m=mS.Bd(a,b);m==0&&(m=1);c.a=n.a;c.c=n.c;c.b=n.b;c.d=n.d;mS.kd(a,n.b-n.a,n.d-n.c,l);if(m>0){f.a=n.a+l.a;f.c=n.c+l.b;f.b=n.b+l.a;f.d=n.d+l.b;if(mS.jd(a,d,e,1,k)||mS.Fk(a.H,d)>1){f.a+=k.a+l.b;f.c+=k.b-l.a}if(mS.jd(a,e,d,-1,k)||mS.Fk(a.H,e)>1){f.b+=k.a-l.b;f.d+=k.b+l.a}}else{f.a=n.a-l.a;f.c=n.c-l.b;f.b=n.b-l.a;f.d=n.d-l.b;if(mS.jd(a,d,e,-1,k)||mS.Fk(a.H,d)>1){f.a+=k.a+l.b;f.c+=k.b-l.a}if(mS.jd(a,e,d,1,k)||mS.Fk(a.H,e)>1){f.b+=k.a-l.b;f.d+=k.b+l.a}}mS.oi(a.H,b)==26&&mS.Ad(c,f);mS.Cd(a,c)&&mS.Vc(a,c,d,e);g==2?mS.Cd(a,f)&&mS.Vc(a,f,d,e):mS.Cd(a,f)&&mS.Tc(a,f,d,e)}break;case 3:if(mS.Cd(a,n)){mS.Vc(a,n,d,e);mS.kd(a,n.b-n.a,n.d-n.c,l);c.a=n.a+l.a;c.c=n.c+l.b;c.b=n.b+l.a;c.d=n.d+l.b;mS.Vc(a,c,d,e);c.a=n.a-l.a;c.c=n.c-l.b;c.b=n.b-l.a;c.d=n.d-l.b;mS.Vc(a,c,d,e)}}a.w==-8&&mS.Gd(a,-9)};mS.qd=function qd(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r;o=false;for(d=0;d<a.H.e;d++){j=null;if(mS.Fi(a.H,d)){l=mS.fi(a.H,d);k=mS.ei(a.H,d);j=l==k?'['+l+']':'['+l+':'+k+']'}else (mS.ni(a.H,d)&zT)!=0?(j=(mS.ni(a.H,d)&zT)==QS?'a':(mS.ni(a.H,d)&96)==64?'r!a':'!a'):(mS.ni(a.H,d)&96)!=0&&(j=(mS.ni(a.H,d)&96)==64?'r':'!r');n=(mS.ni(a.H,d)&AT)>>15;n!=0&&(j=(j==null?'':j)+n);if(j!=null){b=mS.di(a.H,0,d);c=mS.di(a.H,1,d);if(!o){mS.mo(a,(a.R*2+1)/3|0);o=true}q=(mS.Rg(a.L,mS.Yh(a.H,b))+mS.Rg(a.L,mS.Yh(a.H,c)))/2;r=(mS.Sg(a.L,mS.Zh(a.H,b))+mS.Sg(a.L,mS.Zh(a.H,c)))/2;f=mS.Rg(a.L,mS.Yh(a.H,c))-mS.Rg(a.L,mS.Yh(a.H,b));g=mS.Sg(a.L,mS.Zh(a.H,c))-mS.Sg(a.L,mS.Zh(a.H,b));e=$wnd.Math.sqrt(f*f+g*g);i=(m=(p=xS.OH(a.e,j),new yS.eI(0,0,p,0)).b,0.6*m);h=0.55*a.j;e!=0&&(f>0?mS.sd(a,q+i*g/e,r-h*f/e,j,true):mS.sd(a,q-i*g/e,r+h*f/e,j,true))}}o&&mS.mo(a,a.R)};mS.rd=function rd(a,b,c,d){CS.IN(a.U,new yS.eI(b-a.P,c-a.P,2*a.P,2*a.P));a.G||CS.IN(a.O,new mS.Nd(b,c,mS.fd(a,d)?-3:a.o[d]))};mS.sd=function sd(a,b,c,d,e){var f,g,h,i,j;if(e){g=(f=(h=xS.OH(a.e,d),new yS.eI(0,0,h,0)).b,f);i=g/2+(a.j/8|0);j=a.j/2|0;(d=='+'||d=='-')&&(j=j*2/3);CS.IN(a.U,new yS.eI(b-i,c-j,2*i,2*j))}a.G||mS.go(a,d,b,c)};mS.td=function td(a){var b;b=a.a;a.a=a.b;a.b=b;b=a.c;a.c=a.d;a.d=b};mS.ud=function ud(a,b,c){var d;d=b==0?gT+a[0]-a[a.length-1]:a[b]-a[b-1];c>-2.0943951023931953&&c<BT?(d-=2*$wnd.Math.cos(c+CT)):(d-=0.5*$wnd.Math.cos(c+CT));return d};mS.vd=function vd(a){var b;b=new yS.dI;if(a.a<=a.b){b.c=a.a;b.b=a.b-a.a}else{b.c=a.b;b.b=a.a-a.b}if(a.c<=a.d){b.d=a.c;b.a=a.d-a.c}else{b.d=a.d;b.a=a.c-a.d}return b};mS.wd=function wd(a,b){var c,d,e,f,g,h,i;c=QC(hS.OD,bT,5,mS.rk(a.H,b),15,1);for(e=0;e<mS.rk(a.H,b);e++)c[e]=mS.ci(a.H,b,mS.Ek(a.H,b,e));CS.QO(c);f=mS.xd(c,0);g=mS.ud(c,0,f);for(d=1;d<c.length;d++){h=mS.xd(c,d);i=mS.ud(c,d,h);if(g<i){g=i;f=h}}return f};mS.xd=function xd(a,b){var c;if(b>0)return (a[b]+a[b-1])/2;c=hT+(a[0]+a[a.length-1])/2;return c>hT?c-gT:c};mS.yd=function yd(a,b,c,d){var e,f,g,h;h=new mS.Od;if(b.a==b.b&&b.c==b.d)return;h.a=b.a;h.c=b.c;h.b=b.b;h.d=b.d;g=mS.vd(h);for(e=0;e<a.U.a.length;e++){f=CS.NN(a.U,e);if(f.c>g.c+g.b||f.d>g.d+g.a||g.c>f.c+f.b||g.d>f.d+f.a)continue;if(mS.zd(a,h.a,h.c,e)){if(mS.zd(a,h.b,h.d,e))return;mS.Dd(a,h,0,e);mS.yd(a,h,c,d);return}if(mS.zd(a,h.b,h.d,e)){mS.Dd(a,h,1,e);mS.yd(a,h,c,d);return}}mS.Xc(a,h,c,d)};mS.zd=function zd(a,b,c,d){var e;if((a.B&1)!=0)return false;e=CS.NN(a.U,d);return b>e.c&&b<e.c+e.b&&c>e.d&&c<e.d+e.a};mS.Ad=function Ad(a,b){var c;c=a.b;a.b=b.b;b.b=c;c=a.d;a.d=b.d;b.d=c};mS.Bd=function Bd(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o;k=QC(hS.EG,cT,5,16,16,1);l=QC(hS.EG,cT,5,16,16,1);c=QC(hS.OD,bT,5,16,15,1);f=QC(hS.OD,bT,5,2,15,1);d=0;for(j=0;j<2;j++){e=mS.di(a.H,j,b);for(m=0;m<mS.Fk(a.H,e);m++){h=mS.Gk(a.H,e,m);if(h==b)continue;if(d==4)return 0;k[d]=mS.nl(a.H,h);l[d]=mS.tl(a.H,h);c[d++]=mS.ci(a.H,e,mS.Ek(a.H,e,m))}}f[0]=mS.ci(a.H,mS.di(a.H,0,b),mS.di(a.H,1,b));if(f[0]<0){f[1]=f[0]+hT;g=false}else{f[1]=f[0];f[0]=f[1]-hT;g=true}n=0;for(i=0;i<d;i++){k[i]?(o=20):l[i]?(o=17):(o=16);c[i]>f[0]&&c[i]<f[1]?(n-=o):(n+=o)}return g?-n:n};mS.Cd=function Cd(a,b){var c,d,e,f,g,h;if(b.a==b.b&&b.c==b.d){for(e=0;e<a.U.a.length;e++){g=CS.NN(a.U,e);if(yS.XH(g,b.a,b.c))return false}return true}h=mS.vd(b);c=false;if(b.a>b.b){mS.td(b);c=true}for(d=0;d<a.U.a.length;d++){g=CS.NN(a.U,d);if(g.c>h.c+h.b||g.d>h.d+h.a||h.c>g.c+g.b||h.d>g.d+g.a)continue;if(mS.zd(a,b.a,b.c,d)){if(mS.zd(a,b.b,b.d,d)){c&&mS.td(b);return false}mS.Dd(a,b,0,d);f=mS.Cd(a,b);c&&mS.td(b);return f}if(mS.zd(a,b.b,b.d,d)){mS.Dd(a,b,1,d);f=mS.Cd(a,b);c&&mS.td(b);return f}}c&&mS.td(b);return true};mS.Dd=function Dd(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o;if(c==0){l=b.a;n=b.c;m=b.b;o=b.d}else{l=b.b;n=b.d;m=b.a;o=b.c}k=CS.NN(a.U,d);i=m>l?k.c+k.b:k.c;j=o>n?k.d+k.a:k.d;e=m-l;f=o-n;if($wnd.Math.abs(e)>$wnd.Math.abs(f)){if(n==o){g=i;h=n}else{g=l+e*(j-n)/f;if(m>l==i>g){h=j}else{g=i;h=n+f*(i-l)/e}}}else{if(l==m){g=l;h=j}else{h=n+f*(i-l)/e;if(o>n==j>h){g=i}else{g=l+e*(j-n)/f;h=j}}}if(c==0){b.a=g;b.c=h}else{b.b=g;b.d=h}};mS.Ed=function Ed(a){var b,c,d;if(a.H.o==0)return;mS.Po(a.H,(a.B&256)!=0?31:(a.B&512)!=0?47:(a.B&mT)!=0?79:15);mS.Rc(a);c=false;a.o=QC(hS.QD,$S,5,a.H.o,15,1);for(b=0;b<a.H.o;b++){a.o[b]=mS.Lh(a.H,b);a.o[b]!=0&&(c=true);mS.Ri(a.H,b)&&(a.o[b]=128);mS.vi(a.H,b)&&(a.B&jT)==0&&(a.o[b]=256)}mS.Gd(a,-10);mS.cd(a);mS.bd(a);mS.dd(a);mS.Pc(a);mS.mo(a,a.R);mS.lo(a,a.S);mS.Gd(a,a.K);mS.gd(a);a.O.a=QC(hS.IF,DT,1,0,5,1);a.U.a=QC(hS.IF,DT,1,0,5,1);for(d=0;d<a.H.o;d++){if(mS.fd(a,d)){mS.Gd(a,-3);mS.od(a,d);mS.Gd(a,a.K)}else if(a.o[d]!=0){mS.Gd(a,a.o[d]);mS.od(a,d);mS.Gd(a,a.K)}else if(!c&&mS._h(a.H,d)!=1&&mS._h(a.H,d)!=6&&(a.B&kT)==0&&mS.Rh(a.H,d)==null&&mS._h(a.H,d)<mS.Bc.length){mS.Hd(a,mS.$c(mS.Bc[mS._h(a.H,d)]));mS.od(a,d);mS.Gd(a,a.K)}else{mS.od(a,d)}}mS.nd(a);mS.qd(a);mS.md(a)};mS.Fd=function Fd(a,b,c,d){var e;e=c/2;switch(d&786432){case 786432:if(b){a.u.a=b.c+b.b/2;a.u.b=b.d+b.a-e;break}case 0:a.u.a=a.t.c+a.t.b/2;a.u.b=a.t.d+a.t.a+e;!!b&&a.u.b>b.d+b.a-e&&(a.u.b=b.d+b.a-e);break;case QS:if(b){a.u.a=b.c+b.b/2;a.u.b=b.d+e;break}case ET:a.u.a=a.t.c+a.t.b/2;a.u.b=a.t.d-e;!!b&&a.u.b<b.d+e&&(a.u.b=b.d+e);}};mS.Gd=function Gd(a,b){if(a.G)return;if(b==-10){a.w=-999;b=a.K}if(b==a.w)return;if(a.w==-8&&b!=-9)return;b==-8&&(a.J=a.w);b==-9&&(b=a.J);a.w=b;switch(b){case 0:mS.ko(a,(xS.DH(),xS.AH));break;case -6:mS.ko(a,a.A);break;case -4:mS.ko(a,a.I);break;case -2:mS.ko(a,a.r);break;case -3:mS.ko(a,a.s);break;case -7:mS.ko(a,a.C);break;case -8:mS.ko(a,a.D);break;case 64:mS.ko(a,mS.Fc);break;case 128:mS.ko(a,mS.Lc);break;case 256:mS.ko(a,mS.Jc);break;case 192:mS.ko(a,mS.Ic);break;case 320:mS.ko(a,mS.Kc);break;case 384:mS.ko(a,mS.Gc);break;case 448:mS.ko(a,mS.Hc);break;case 1:mS.ko(a,(xS.DH(),xS.BH));break;default:mS.ko(a,(xS.DH(),xS.AH));}};mS.Hd=function Hd(a,b){a.w=-5;a.d='rgb('+(b.c>>16&255)+','+(b.c>>8&255)+','+(b.c&255)+')'};mS.Id=function Id(a){var b,c,d,e,f;e=mS.Rg(a.L,mS.Yh(a.H,0));c=mS.Rg(a.L,mS.Yh(a.H,0));f=mS.Sg(a.L,mS.Zh(a.H,0));d=mS.Sg(a.L,mS.Zh(a.H,0));for(b=0;b<a.H.o;b++){e>mS.Rg(a.L,mS.Yh(a.H,b))&&(e=mS.Rg(a.L,mS.Yh(a.H,b)));c<mS.Rg(a.L,mS.Yh(a.H,b))&&(c=mS.Rg(a.L,mS.Yh(a.H,b)));f>mS.Sg(a.L,mS.Zh(a.H,b))&&(f=mS.Sg(a.L,mS.Zh(a.H,b)));d<mS.Sg(a.L,mS.Zh(a.H,b))&&(d=mS.Sg(a.L,mS.Zh(a.H,b)))}a.t=new yS.eI(e,f,c-e,d-f)};mS.Jd=function Jd(a,b){var c,d;if(a.H.o==0)return null;mS.Id(a);c=a.L.c*mS.ai(a.H);d=new mS.Ug(a.t,b,c);if(d.c==1&&d.a==0&&d.b==0){d=null}else{mS.Ng(d,a.L);mS.Pg(d,a.t)}mS.Fd(a,b,c,US);return d};mS.Kd=function Kd(a){var b;b=(xS.DH(),xS.zH);a.r=rS.iA(b,mS.Dc);a.s=rS.hA(mS.Ec,b);a.C=mS.Cc;a.D=mS.Mc};mS.Ld=function Ld(a,b){var c,d,e,f;if(a.H.o==0)return null;e=mS.no(a,b);mS.Po(a.H,(a.B&256)!=0?31:(a.B&512)!=0?47:(a.B&mT)!=0?79:15);mS.gd(a);a.O.a=QC(hS.IF,DT,1,0,5,1);a.U.a=QC(hS.IF,DT,1,0,5,1);mS.Rc(a);mS.mo(a,a.R);a.G=true;for(d=0;d<a.H.o;d++)mS.od(a,d);a.G=false;c=a.L.c*mS.ai(a.H);mS.Yc(a,c);mS.Fd(a,b,c,US);if(yS.VH(b,a.t))return e;f=new mS.Ug(a.t,b,c);mS.Ng(f,a.L);mS.Pg(f,a.t);mS.Og(f,a.u);if(!e)return f;mS.Ng(f,e);return e};mS.Md=function Md(a,b){mS.Oc(this);this.H=a;this.B=b;mS.ed(this)};pH(129,1,{});_.v=0;_.w=0;_.B=0;_.F=0;_.G=false;_.J=0;_.K=0;_.M=0;_.N=0;_.P=0;_.Q=0;_.R=0;_.S=0;_.T=0;hS.UD=$I(129);mS.Nd=function Nd(a,b,c){this.b=a;this.c=b;this.a=c};pH(54,1,{54:1},mS.Nd);_.a=0;_.b=0;_.c=0;hS.SD=$I(54);mS.Od=function Od(){};pH(33,1,{},mS.Od);_.a=0;_.b=0;_.c=0;_.d=0;hS.TD=$I(33);mS.Pd=function Pd(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X;J=QC(hS.EG,cT,5,b.i.a.length,16,1);A=QC(hS.QD,$S,5,a.e.d,15,1);for(T=0;T<b.i.a.length;T++){J[T]=true;for(q=CS.NN(b.j,T),r=0,s=q.length;r<s;++r){t=q[r];if(!a.d[t]){J[T]=false;break}}if(J[T])for(d=CS.NN(b.i,T),g=0,j=d.length;g<j;++g){c=d[g];++A[c]}}I=QC(hS.EG,cT,5,a.e.d,16,1);for(U=0;U<b.i.a.length;U++){V=CS.NN(b.j,U).length;if(V==3||V==5||V==6||V==7){if(J[U]){for(e=CS.NN(b.i,U),h=0,k=e.length;h<k;++h){c=e[h];I[c]=true}Q=true;M=-1;N=0;for(f=CS.NN(b.i,U),i=0,l=f.length;i<l;++i){c=f[i];if(V==6||A[c]>1){if(!mS.Td(a,c,false)){Q=false;break}}else{S=V==5?mS.Qd(a,c,false):mS.Rd(a,c,false);if(mS.Td(a,c,false)){if(N<S){N=S;M=c}}else{if(N==10){Q=false;break}M=c;N=20}}}if(Q){for(d=CS.NN(b.i,U),g=0,j=d.length;g<j;++g){c=d[g];if(c==M){V==5?mS.Qd(a,c,true):mS.Rd(a,c,true);mS.ce(a,c)}else{mS.Td(a,c,true)}}}}}}w=QC(hS.QD,$S,5,a.e.d,15,1);C=QC(hS.EG,cT,5,a.e.d,16,1);for(p=0;p<a.e.e;p++){m=mS.di(a.e,0,p);n=mS.di(a.e,1,p);if(!I[m]&&!I[n]){if(a.d[p]){++w[m];++w[n]}if(mS.oi(a.e,p)==32){C[m]=true;C[n]=true}}}R=QC(hS.QD,$S,5,a.e.d,15,1);B=QC(hS.QD,$S,5,a.e.d,15,1);for(X=0;X<a.e.d;X++){if(w[X]==1){B[0]=X;v=0;D=0;while(v<=D){for(F=0;F<mS.Fk(a.e,B[v]);F++){if(a.d[mS.Gk(a.e,B[v],F)]){u=mS.Ek(a.e,B[v],F);if((v==0||u!=B[v-1])&&w[u]!=0){B[++D]=u;if((w[u]&1)!=0){for(L=1;L<D;L+=2)R[B[L]]=-1;D=0}break}}}++v}}}o=QC(hS.EG,cT,5,a.e.d,16,1);for(W=0;W<a.e.d;W++){if(!o[W]&&w[W]!=0){B[0]=W;o[W]=true;v=0;D=0;while(v<=D){for(F=0;F<mS.Fk(a.e,B[v]);F++){if(a.d[mS.Gk(a.e,B[v],F)]){u=mS.Ek(a.e,B[v],F);if(!o[u]){B[++D]=u;o[u]=true}}}++v}if((D&1)==0){for(G=0;G<=D;G++)R[B[G]]==0&&(R[B[G]]=mS.Sd(a,B[G],false));K=true;for(H=0;H<=D;H++){if(R[B[H]]<=0){if(!mS.Td(a,B[H],false)){K=false;break}}}if(K){P=0;O=-1;for(F=0;F<=D;F++){if(P<R[B[F]]){P=R[B[F]];O=B[F]}}if(P>0){mS.Sd(a,O,true);mS.ce(a,O)}}}}}};mS.Qd=function Qd(a,b,c){if(mS._h(a.e,b)==7){if(mS.rk(a.e,b)==3)return 6;else if(mS.Fk(a.e,b)==2)return 4}else if(mS._h(a.e,b)==8){return 10}else if(mS._h(a.e,b)==15||mS._h(a.e,b)==33){if(mS.Fk(a.e,b)==3)return 8}else if(mS._h(a.e,b)==16||mS._h(a.e,b)==34){if(mS.Fk(a.e,b)==2)return 12}else if(mS._h(a.e,b)==6){c&&mS.ij(a.e,b,-1);return mS.rk(a.e,b)!=mS.sk(a.e,b)?2:3}return 0};mS.Rd=function Rd(a,b,c){if(a.a){if(mS.rk(a.e,b)!=3)return 0}else{if(mS.rk(a.e,b)>3)return 0}if(mS._h(a.e,b)==6){c&&mS.ij(a.e,b,1);return 2}if(mS._h(a.e,b)==5){return 4}return 0};mS.Sd=function Sd(a,b,c){if(mS.Kh(a.e,b)!=0)return 0;if(a.a){if(mS._h(a.e,b)==5){if(mS.Wk(a.e,b)!=2)return 0;c&&mS.ij(a.e,b,1);return 1}if(mS._h(a.e,b)==7){if(mS.Wk(a.e,b)!=2)return 0;c&&mS.ij(a.e,b,-1);return mS.Vd(a,b)?6:3}if(mS._h(a.e,b)==8){if(mS.Wk(a.e,b)!=1)return 0;c&&mS.ij(a.e,b,-1);return mS.Vd(a,b)?7:4}if(mS._h(a.e,b)==16){if(mS.Wk(a.e,b)!=1)return 0;c&&mS.ij(a.e,b,-1);return mS.Vd(a,b)?5:2}}else{if(mS._h(a.e,b)==5){if(mS.Wk(a.e,b)>2)return 0;c&&mS.ij(a.e,b,1);return 1}if(mS._h(a.e,b)==7){if(mS.Wk(a.e,b)>2)return 0;c&&mS.ij(a.e,b,-1);return mS.Vd(a,b)?5:3}if(mS._h(a.e,b)==8){if(mS.Wk(a.e,b)>1)return 0;c&&mS.ij(a.e,b,-1);return mS.Vd(a,b)?7:4}if(mS._h(a.e,b)==16){if(mS.Wk(a.e,b)>1)return 0;c&&mS.ij(a.e,b,-1);return mS.Vd(a,b)?5:2}}return 0};mS.Td=function Td(a,b,c){var d,e;d=mS._h(a.e,b);if(d>=5&&d<=8||d==15||d==16||d==33||d==34){e=mS.Ok(a.e,b);if(e==1||e==2)return true;if(mS.Kh(a.e,b)==0){if((d==15||d==33)&&e==3){c&&mS.ij(a.e,b,1);return true}if((d==16||d==34)&&e==4){c&&mS.ij(a.e,b,1);return true}if(d==5&&e==0){c&&mS.ij(a.e,b,-1);return true}if((d==7||d==8)&&e==0){c&&mS.ij(a.e,b,1);return true}}}return false};mS.Ud=function Ud(a,b,c,d){var e;for(e=0;e<mS.Fk(a.e,b);e++)if(d[mS.Gk(a.e,b,e)]==1&&mS.Ek(a.e,b,e)!=c)return e;return -1};mS.Vd=function Vd(a,b){var c;for(c=0;c<mS.Fk(a.e,b);c++)if(mS.Ni(a.e,mS.Ek(a.e,b,c)))return true;return false};mS.Wd=function Wd(a,b,c){var d;for(d=0;d<mS.Fk(a.e,b);d++)if(c[mS.Gk(a.e,b,d)]>1)return true;return false};mS.Xd=function Xd(a,b){var c;for(c=0;c<mS.Fk(a.e,b);c++)if(a.d[mS.Gk(a.e,b,c)])return true;return false};mS.Yd=function Yd(a,b,c){var d,e,f,g,h,i,j,k,l,m,n;mS.Po(a.e,1);if(b!=null){a.d=b}else{a.d=QC(hS.EG,cT,5,a.e.e,16,1);for(e=0;e<a.e.e;e++){if(mS.oi(a.e,e)==64){a.d[e]=true;mS.Lj(a.e,e,1)}}}a.f=0;j=QC(hS.EG,cT,5,a.e.d,16,1);for(f=0;f<a.e.e;f++){if(a.d[f]){++a.c;for(h=0;h<2;h++){if(!j[mS.di(a.e,h,f)]){j[mS.di(a.e,h,f)]=true;++a.b}}}}if(a.c==0)return true;a.a=false;a.e.I&&mS.$d(a);n=new mS.jn(a.e,1);c&&mS.Pd(a,n);mS.ee(a,n);mS.be(a,n);mS.de(a);mS._d(a);while(mS.ae(a,n))mS._d(a);while(a.c!=0){g=false;for(l=0;l<n.i.a.length;l++){if(CS.NN(n.j,l).length==6){k=true;m=CS.NN(n.j,l);for(i=0;i<6;i++){if(!a.d[m[i]]){k=false;break}}if(k){for(h=0;h<6;h+=2)mS.Zd(a,m[h]);g=true;break}}}if(!g){for(d=0;d<a.e.e;d++){if(a.d[d]){mS.Zd(a,d);mS._d(a);break}}}}return a.b==a.f};mS.Zd=function Zd(a,b){var c,d,e,f;if(mS.oi(a.e,b)==1){mS.Lj(a.e,b,2);a.f+=2}for(e=0;e<2;e++){c=mS.di(a.e,e,b);for(f=0;f<mS.Fk(a.e,c);f++){d=mS.Gk(a.e,c,f);if(a.d[d]){a.d[d]=false;--a.c}}}};mS.$d=function $d(a){var b,c,d,e,f,g,h,i;for(c=0;c<a.e.e;c++){if(a.d[c]){for(e=0;e<2;e++){h=mS.di(a.e,e,c);b=false;for(g=0;g<mS.Fk(a.e,h);g++){if(c!=mS.Gk(a.e,h,g)&&a.d[mS.Gk(a.e,h,g)]){b=true;break}}if(!b){i=c;d=mS.di(a.e,1-e,c);while(i!=-1){a.d[i]=false;--a.c;mS.Lj(a.e,i,64);i=-1;h=d;for(f=0;f<mS.Fk(a.e,h);f++){if(a.d[mS.Gk(a.e,h,f)]){if(i==-1){i=mS.Gk(a.e,h,f);d=mS.Ek(a.e,h,f)}else{i=-1;break}}}}break}}}}};mS._d=function _d(a){var b,c,d,e,f,g,h;do{h=false;for(c=0;c<a.e.e;c++){if(a.d[c]){f=false;for(e=0;e<2;e++){d=mS.di(a.e,e,c);b=false;for(g=0;g<mS.Fk(a.e,d);g++){if(c!=mS.Gk(a.e,d,g)&&a.d[mS.Gk(a.e,d,g)]){b=true;break}}if(!b){f=true;break}}if(f){h=true;mS.Zd(a,c)}}}}while(h)};mS.ae=function ae(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o;o=QC(hS.QD,$S,5,a.e.e,15,1);for(m=0;m<b.i.a.length;m++){n=CS.NN(b.j,m);l=true;for(k=0;k<n.length;k++){if(!a.d[n[k]]){l=false;break}}if(l)for(j=0;j<n.length;j++)++o[n[j]]}i=a.c;for(f=0;f<a.e.e;f++){if(o[f]==1){for(j=0;j<2&&a.d[f];j++){c=mS.di(a.e,j,f);d=mS.di(a.e,1-j,f);if(mS.Wd(a,c,o)&&!mS.Wd(a,d,o)){while(-1!=(h=mS.Ud(a,d,c,o))){e=mS.Ek(a.e,d,h);g=mS.Gk(a.e,d,h);if(!a.d[g])break;mS.Zd(a,g);h=mS.Ud(a,e,d,o);if(h==-1)break;c=e;d=mS.Ek(a.e,e,h)}}}}}return i!=a.c};mS.be=function be(a,b){var c;for(c=0;c<a.e.e;c++){if(a.d[c]&&mS.en(b,c)){mS.ce(a,mS.di(a.e,0,c));mS.ce(a,mS.di(a.e,1,c))}}};mS.ce=function ce(a,b){var c,d;--a.b;for(d=0;d<mS.Fk(a.e,b);d++){c=mS.Gk(a.e,b,d);if(a.d[c]){a.d[c]=false;--a.c}}};mS.de=function de(a){var b,c,d,e,f;for(c=0;c<a.e.e;c++){if(mS.li(a.e,c)==2){for(e=0;e<2;e++){b=mS.di(a.e,e,c);for(f=0;f<mS.Fk(a.e,b);f++){d=mS.Gk(a.e,b,f);if(a.d[d]){mS.ce(a,b);break}}}}}};mS.ee=function ee(a,b){var c,d,e,f,g,h,i,j,k,l;for(c=0;c<a.e.d;c++){if(mS.Xd(a,c)){(b.a[c]==3||b.a[c]==7)&&(mS._h(a.e,c)==5&&mS.Kh(a.e,c)==0&&mS.rk(a.e,c)==3||mS._h(a.e,c)==6&&mS.Kh(a.e,c)==1)&&mS.ce(a,c);b.a[c]==5&&(mS._h(a.e,c)==6&&mS.Kh(a.e,c)==-1&&mS.rk(a.e,c)==3||mS._h(a.e,c)==7&&mS.Kh(a.e,c)==0&&mS.rk(a.e,c)==3||mS._h(a.e,c)==8&&mS.Kh(a.e,c)==0&&mS.Fk(a.e,c)==2||mS._h(a.e,c)==16&&mS.Kh(a.e,c)==0&&mS.Fk(a.e,c)==2)&&mS.ce(a,c)}}for(j=0;j<b.i.a.length;j++){if(CS.NN(b.j,j).length==5){l=CS.NN(b.j,j);f=true;for(e=0;e<l.length;e++){if(!a.d[l[e]]){f=false;break}}if(f){k=CS.NN(b.i,j);h=0;g=-1;for(d=0;d<l.length;d++){if(mS.Kh(a.e,k[d])==-1&&mS._h(a.e,k[d])==6){i=mS.rk(a.e,k[d])==3?3:mS.sk(a.e,k[d])==3?2:1;if(h<i){h=i;g=k[d]}}}g!=-1&&mS.ce(a,g)}}}};mS.fe=function fe(a){this.e=a};pH(60,1,{},mS.fe);_.a=false;_.b=0;_.c=0;_.f=0;hS.VD=$I(60);mS.ge=function ge(a,b,c,d,e,f,g){var h,i,j,k;j=0;for(i=0;i<a.L.d;i++)(mS.Wh(a.L,a.t[i])&e)!=0&&++j;if(j==0)return false;if(b>15){mS.$e(a,c);b-=16}mS.Ve(a,1,1);mS.Ve(a,b,4);mS.Ve(a,j,d);for(h=0;h<a.L.d;h++){k=mS.Wh(a.L,a.t[h])&e;if(k!=0){mS.Ve(a,h,d);f!=1&&mS.Ve(a,k>>g,f)}}return true};mS.he=function he(a,b,c,d,e,f,g){var h,i,j,k;j=0;for(i=0;i<a.L.e;i++)(mS.ni(a.L,a.u[i])&e)!=0&&++j;if(j==0)return false;if(b>15){mS.$e(a,c);b-=16}mS.Ve(a,1,1);mS.Ve(a,b,4);mS.Ve(a,j,d);for(h=0;h<a.L.e;h++){k=mS.ni(a.L,a.u[h])&e;if(k!=0){mS.Ve(a,h,d);f!=1&&mS.Ve(a,k>>g,f)}}return true};mS.ie=function ie(a,b,c){var d,e,f,g,h,i,j;if(mS._h(a.L,b)!=6&&mS._h(a.L,b)!=7)return false;e=mS.Ek(a.L,b,0);f=mS.Ek(a.L,b,1);if(mS.vk(a.L,e)!=1||mS.vk(a.L,f)!=1)return false;if(mS.Fk(a.L,e)==1||mS.Fk(a.L,f)==1)return false;if(mS.rk(a.L,e)>3||mS.rk(a.L,f)>3)return false;g=new mS.Yg(a.L,a.c,b,e);if(g.f&&!c)return false;h=new mS.Yg(a.L,a.c,b,f);if(h.f&&!c)return false;if(g.f&&h.f)return false;if(c){g.f&&g.c&&(a.P[b]=true);h.f&&h.c&&(a.P[b]=true)}i=mS.Xg(g);j=mS.Xg(h);if(i==-1||j==-1||(i+j&1)==0){c||(a.W[b]=3);return true}d=0;switch(i+j){case 3:case 7:d=2;break;case 5:d=1;}if(c){if(a.Q&&(a.K&2)!=0||!a.Q&&(a.K&4)!=0){if(g.f){if(d==1){mS.Nf(a.b[g.b],64);mS.Nf(a.b[g.d],16)}else{mS.Nf(a.b[g.b],16);mS.Nf(a.b[g.d],64)}}if(h.f){if(d==2){mS.Nf(a.b[h.b],64);mS.Nf(a.b[h.d],16)}else{mS.Nf(a.b[h.b],16);mS.Nf(a.b[h.d],64)}}}}else{a.W[b]=d}return true};mS.je=function je(a,b,c){var d,e,f,g,h;if(!mS.ol(a.L,b))return false;d=mS.di(a.L,0,b);e=mS.di(a.L,1,b);g=new mS.Yg(a.L,a.c,d,e);if(g.f&&!c)return false;h=new mS.Yg(a.L,a.c,e,d);if(h.f&&!c)return false;if(g.f&&h.f)return false;if(c){g.f&&(a.O[b]=mS.kf(a,e));h.f&&(a.O[b]=mS.kf(a,d))}f=a._?mS.le(a,g,h):mS.ke(g,h);if(c){if(a.Q&&(a.K&2)!=0||!a.Q&&(a.K&4)!=0){if(g.f){if(f==2){mS.Nf(a.b[g.b],4);mS.Nf(a.b[g.d],1)}else{mS.Nf(a.b[g.b],1);mS.Nf(a.b[g.d],4)}}if(h.f){if(f==2){mS.Nf(a.b[h.b],4);mS.Nf(a.b[h.d],1)}else{mS.Nf(a.b[h.b],1);mS.Nf(a.b[h.d],4)}}}}else{a.k[b]=f}return true};mS.ke=function ke(a,b){var c,d,e;d=mS.Xg(a);e=mS.Xg(b);if(d==-1||e==-1||(d+e&1)==0)return 3;c=0;switch(d+e){case 3:case 7:c=1;break;case 5:c=2;}return c};mS.le=function le(a,b,c){var d,e;d=QC(hS.QD,$S,5,4,15,1);d[0]=b.b;d[1]=b.a;d[2]=c.a;d[3]=c.b;e=mS.ph(a.L,d);if($wnd.Math.abs(e)<0.3||$wnd.Math.abs(e)>2.8415926535897933)return 3;return e<0?1:2};mS.me=function me(a,b,c){var d,e,f,g,h;if(a.k[b]!=0)return false;if(mS.li(a.L,b)==1)return mS.je(a,b,c);if(mS.li(a.L,b)!=2)return false;if(mS.nl(a.L,b))return false;e=mS.di(a.L,0,b);f=mS.di(a.L,1,b);if(mS.Fk(a.L,e)==1||mS.Fk(a.L,f)==1)return false;if(mS.Fk(a.L,e)>3||mS.Fk(a.L,f)>3)return false;if(mS.vk(a.L,e)==2||mS.vk(a.L,f)==2)return false;g=new mS.Yg(a.L,a.c,f,e);if(g.f&&!c)return false;h=new mS.Yg(a.L,a.c,e,f);if(h.f&&!c)return false;if(g.f&&h.f)return false;if(c){g.f&&g.c&&(a.O[b]=true);h.f&&h.c&&(a.O[b]=true)}d=mS.Ji(a.L,b)?3:a._?mS.oe(a,g,h):mS.ne(g,h);if(c){if((a.K&2)!=0){if(g.f){if(d==1){mS.Nf(a.b[g.b],4);mS.Nf(a.b[g.d],1)}else if(d==2){mS.Nf(a.b[g.b],1);mS.Nf(a.b[g.d],4)}}if(h.f){if(d==1){mS.Nf(a.b[h.b],4);mS.Nf(a.b[h.d],1)}else if(d==2){mS.Nf(a.b[h.b],1);mS.Nf(a.b[h.d],4)}}}}else{a.k[b]=d}return true};mS.ne=function ne(a,b){if(mS.Xg(a)==-1||mS.Xg(b)==-1)return 3;if(((mS.Xg(a)|mS.Xg(b))&1)!=0)return 3;return mS.Xg(a)==mS.Xg(b)?1:2};mS.oe=function oe(a,b,c){var d,e,f,g,h,i,j;f=QC(hS.OD,bT,5,3,15,1);f[0]=mS.Yh(a.L,c.a)-mS.Yh(a.L,b.a);f[1]=mS.Zh(a.L,c.a)-mS.Zh(a.L,b.a);f[2]=mS.$h(a.L,c.a)-mS.$h(a.L,b.a);i=QC(hS.OD,bT,5,3,15,1);i[0]=mS.Yh(a.L,b.b)-mS.Yh(a.L,b.a);i[1]=mS.Zh(a.L,b.b)-mS.Zh(a.L,b.a);i[2]=mS.$h(a.L,b.b)-mS.$h(a.L,b.a);j=QC(hS.OD,bT,5,3,15,1);j[0]=mS.Yh(a.L,c.b)-mS.Yh(a.L,c.a);j[1]=mS.Zh(a.L,c.b)-mS.Zh(a.L,c.a);j[2]=mS.$h(a.L,c.b)-mS.$h(a.L,c.a);g=QC(hS.OD,bT,5,3,15,1);g[0]=f[1]*i[2]-f[2]*i[1];g[1]=f[2]*i[0]-f[0]*i[2];g[2]=f[0]*i[1]-f[1]*i[0];h=QC(hS.OD,bT,5,3,15,1);h[0]=f[1]*g[2]-f[2]*g[1];h[1]=f[2]*g[0]-f[0]*g[2];h[2]=f[0]*g[1]-f[1]*g[0];d=(i[0]*h[0]+i[1]*h[1]+i[2]*h[2])/($wnd.Math.sqrt(i[0]*i[0]+i[1]*i[1]+i[2]*i[2])*$wnd.Math.sqrt(h[0]*h[0]+h[1]*h[1]+h[2]*h[2]));e=(j[0]*h[0]+j[1]*h[1]+j[2]*h[2])/($wnd.Math.sqrt(j[0]*j[0]+j[1]*j[1]+j[2]*j[2])*$wnd.Math.sqrt(h[0]*h[0]+h[1]*h[1]+h[2]*h[2]));return d<0^e<0?1:2};mS.pe=function pe(a,b){var c,d,e,f;c=mS.Ih(a.L,b);d=mS.Qk(a.L,b,false);e=mS.Qk(a.L,b,true);f=-1;if(d!=e){c!=-1&&c>d?(f=c<<24>>24):(f=d<<24>>24)}else if(c!=-1){(c>e||c<e&&c>=mS.Wk(a.L,b))&&(f=c<<24>>24)}else if(!mS.Kl(a.L,b)&&mS.Jk(a.L,b)!=0){f=mS.Wk(a.L,b);f-=mS.ri(a.L,b,f)}mS.Ke(a,b,f);return f};mS.qe=function qe(a){var b,c,d,e,f,g,h,i,j,k,l;d=QC(hS.QD,$S,5,a.I,15,1);for(b=0;b<a.L.d;b++){k=mS.Fk(a.L,b)+mS.Tk(a.L,b);j=0;for(f=0;f<mS.sk(a.L,b);f++){if(f<mS.Fk(a.L,b)||f>=mS.rk(a.L,b)){l=2*a.c[mS.Ek(a.L,b,f)];c=mS.Gk(a.L,b,f);mS.li(a.L,c)==2&&(mS.nl(a.L,c)||++l);for(h=0;h<j;h++)if(l<d[h])break;for(i=j;i>h;i--)d[i]=d[i-1];d[h]=l;++j}}mS.Pf(a.b[b],b);mS.Mf(a.b[b],16,WG(a.c[b]));for(g=k;g<a.I;g++)mS.Mf(a.b[b],17,0);for(e=0;e<k;e++)mS.Mf(a.b[b],17,hS.TG(d[e]))}};
mS.re=function re(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o;if(a.W[b]!=0)return false;if(mS._h(a.L,b)!=5&&mS._h(a.L,b)!=6&&mS._h(a.L,b)!=7&&mS._h(a.L,b)!=14&&mS._h(a.L,b)!=15&&mS._h(a.L,b)!=16)return false;if(mS.vk(a.L,b)!=0){if(mS.Fk(a.L,b)==2&&mS.Hk(a.L,b,0)==2&&mS.Hk(a.L,b,1)==2)return mS.ie(a,b,c);if(mS._h(a.L,b)!=15&&mS._h(a.L,b)!=16)return false}if(mS.Fk(a.L,b)<3||mS.rk(a.L,b)>4)return false;if(mS._h(a.L,b)==5&&mS.rk(a.L,b)!=4)return false;if(mS._h(a.L,b)==7&&!a.M[b])return false;n=QC(hS.QD,$S,5,4,15,1);o=QC(hS.QD,$S,5,4,15,1);j=QC(hS.EG,cT,5,4,16,1);for(h=0;h<mS.rk(a.L,b);h++){f=-1;e=0;for(i=0;i<mS.rk(a.L,b);i++){if(!j[i]){if(f<a.c[mS.Ek(a.L,b,i)]){f=a.c[mS.Ek(a.L,b,i)];e=i}}}n[h]=e;o[h]=f;j[e]=true}if(mS.rk(a.L,b)==4&&o[0]===o[1]&&o[2]===o[3])return false;if(mS.rk(a.L,b)==4&&(o[0]===o[2]||o[1]===o[3]))return false;if(mS.rk(a.L,b)==3&&o[0]===o[2])return false;k=0;l=0;m=false;for(g=1;g<mS.rk(a.L,b);g++){if(o[g-1]===o[g]){if(!c||o[g]==0)return false;k=mS.Ek(a.L,b,n[g-1]);l=mS.Ek(a.L,b,n[g]);mS.tl(a.L,mS.Gk(a.L,b,n[g]))&&(a.P[b]=true);m=true}}if(c&&!m)return false;d=a._?mS.te(a,b,n):mS.se(a,b,n);if(c){if(a.Q&&(a.K&2)!=0||!a.Q&&(a.K&4)!=0){if(d==1){mS.Nf(a.b[k],mT);mS.Nf(a.b[l],256)}else if(d==2){mS.Nf(a.b[k],256);mS.Nf(a.b[l],mT)}}}else{a.W[b]=d}return true};mS.se=function se(a,b,c){var d,e,f,g,h,i,j,k,l,m;m=YC(KC(hS.QD,2),FT,6,0,[YC(KC(hS.QD,1),$S,5,15,[2,1,2,1]),YC(KC(hS.QD,1),$S,5,15,[1,2,2,1]),YC(KC(hS.QD,1),$S,5,15,[1,1,2,2]),YC(KC(hS.QD,1),$S,5,15,[2,1,1,2]),YC(KC(hS.QD,1),$S,5,15,[2,2,1,1]),YC(KC(hS.QD,1),$S,5,15,[1,2,1,2])]);d=QC(hS.OD,bT,5,mS.rk(a.L,b),15,1);for(g=0;g<mS.rk(a.L,b);g++)d[g]=mS.ci(a.L,mS.Ek(a.L,b,c[g]),b);j=mS.Lk(a.L,b,c,d,null)<<24>>24;if(j!=3)return j;k=0;l=0;for(h=0;h<mS.rk(a.L,b);h++){e=mS.Gk(a.L,b,c[h]);if(mS.di(a.L,0,e)==b){if(mS.oi(a.L,e)==9){l!=0&&mS.Sj(a.L,b);k=h;l=1}if(mS.oi(a.L,e)==17){l!=0&&mS.Sj(a.L,b);k=h;l=2}}}if(l==0)return 3;for(f=1;f<mS.rk(a.L,b);f++)d[f]<d[0]&&(d[f]+=gT);if(mS.rk(a.L,b)==3){switch(k){case 0:(d[1]<d[2]&&d[2]-d[1]<hT||d[1]>d[2]&&d[1]-d[2]>hT)&&(l=3-l);break;case 1:d[2]-d[0]>hT&&(l=3-l);break;case 2:d[1]-d[0]<hT&&(l=3-l);}return l==1?2:1}i=0;d[1]<=d[2]&&d[2]<=d[3]?(i=0):d[1]<=d[3]&&d[3]<=d[2]?(i=1):d[2]<=d[1]&&d[1]<=d[3]?(i=2):d[2]<=d[3]&&d[3]<=d[1]?(i=3):d[3]<=d[1]&&d[1]<=d[2]?(i=4):d[3]<=d[2]&&d[2]<=d[1]&&(i=5);return m[i][k]==l?2:1};mS.te=function te(a,b,c){var d,e,f,g,h,i;d=QC(hS.QD,$S,5,4,15,1);for(h=0;h<mS.rk(a.L,b);h++)d[h]=mS.Ek(a.L,b,c[h]);mS.rk(a.L,b)==3&&(d[3]=b);e=OC(hS.OD,[HS,bT],[13,5],15,[3,3],2);for(g=0;g<3;g++){e[g][0]=mS.Yh(a.L,d[g+1])-mS.Yh(a.L,d[0]);e[g][1]=mS.Zh(a.L,d[g+1])-mS.Zh(a.L,d[0]);e[g][2]=mS.$h(a.L,d[g+1])-mS.$h(a.L,d[0])}i=QC(hS.OD,bT,5,3,15,1);i[0]=e[0][1]*e[1][2]-e[0][2]*e[1][1];i[1]=e[0][2]*e[1][0]-e[0][0]*e[1][2];i[2]=e[0][0]*e[1][1]-e[0][1]*e[1][0];f=(e[2][0]*i[0]+e[2][1]*i[1]+e[2][2]*i[2])/($wnd.Math.sqrt(e[2][0]*e[2][0]+e[2][1]*e[2][1]+e[2][2]*e[2][2])*$wnd.Math.sqrt(i[0]*i[0]+i[1]*i[1]+i[2]*i[2]));return f>0?1:2};mS.ue=function ue(a){var b,c;b=0;CS.RO(a.b);for(c=0;c<a.b.length;c++){(c==0||mS.Of(a.b[c],a.b[c-1])!=0)&&++b;a.c[a.b[c].a]=b}return b};mS.ve=function ve(a){var b,c,d,e,f,g,h,i,j,k,l,m;if(a.s)return;a.s=new CS._N;k=0;l=QC(hS.QD,$S,5,a.L.d,15,1);g=QC(hS.QD,$S,5,a.L.d,15,1);i=QC(hS.QD,$S,5,a.L.e,15,1);for(b=0;b<a.L.d;b++){if(l[b]==0&&(mS.sl(a.L,b)||mS.vk(a.L,b)==1)){g[0]=b;h=1;j=0;l[b]=++k;c=QC(hS.EG,cT,5,a.L.e,16,1);for(f=0;f<h;f++){for(m=0;m<mS.Fk(a.L,g[f]);m++){e=mS.Gk(a.L,g[f],m);if(mS.tl(a.L,e)||mS.li(a.L,e)==2||mS.ol(a.L,e)){d=mS.Ek(a.L,g[f],m);if(!c[e]){i[j++]=e;c[e]=true}if(l[d]==0){g[h++]=d;l[d]=k}}}}CS.IN(a.s,new mS.Sf(g,h,i,j))}}};mS.we=function we(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v;a.M=QC(hS.EG,cT,5,a.L.d,16,1);for(b=0;b<a.L.d;b++){if(mS._h(a.L,b)==7){if(mS.Fk(a.L,b)==4){a.M[b]=true;continue}if(mS.Fk(a.L,b)==3){if(mS.Kh(a.L,b)==1){a.M[b]=true;continue}if(mS.ql(a.L,b))continue;if((a.K&32)!=0){a.M[b]=true;continue}if(mS.xk(a.L,b)!=3)continue;v=mS.zk(a.L,b);if(v>7)continue;t=mS._k(a.L);u=0;while(u<t.i.a.length){if(CS.NN(t.j,u).length==v&&mS.bn(t,u,b))break;++u}i=-1;j=-1;for(l=0;l<3;l++){h=mS.Gk(a.L,b,l);if(!mS.cn(t,u,h)){i=mS.Ek(a.L,b,l);j=h;break}}n=QC(hS.EG,cT,5,a.L.e,16,1);n[j]=true;o=QC(hS.QD,$S,5,11,15,1);p=mS.Xk(a.L,o,i,b,10,n);if(p==-1)continue;d=1;while(!mS.bn(t,u,o[d]))++d;c=p-d;e=o[d];if(v==6&&c==2&&d==3){if(mS.xk(a.L,o[1])>=3){m=false;s=CS.NN(t.i,u);for(k=0;k<6;k++){if(b==s[k]){r=mS.hn(t,u,e==s[mS.hn(t,u,k+2)]?k-2:k+2);q=s[r];mS.xk(a.L,q)>=3&&mS.$k(a.L,o[1],q,2,null)==2&&(m=true);break}}if(m){a.M[b]=true;continue}}}f=mS.vk(a.L,e)==1||mS.ml(a.L,e)||mS.ql(a.L,e);g=!f&&mS._h(a.L,e)==7&&mS.Kh(a.L,e)!=1;if(c==1){!f&&!g&&v<=4&&d<=3&&(a.M[b]=true);continue}switch(v){case 4:!f&&!g&&d<=4&&(a.M[b]=true);break;case 5:g?d<=3&&(a.M[b]=true):f||d<=4&&(a.M[b]=true);break;case 6:c==2?f?d<=4&&(a.M[b]=true):g||d<=3&&(a.M[b]=true):c==3&&(f?d<=6&&(a.M[b]=true):d<=4&&(a.M[b]=true));break;case 7:c==3&&d<=3&&(a.M[b]=true);}}}}};mS.xe=function xe(a,b){var c,d,e,f;e=false;for(d=0;d<a.L.e;d++)if(mS.me(a,d,false)){a.o[d]=a.G;b&&mS.Le(a,d);e=true}f=false;for(c=0;c<a.L.d;c++)if(mS.re(a,c,false)){a.$[c]=a.G;b&&mS.Me(a,c);f=true}f&&(a.G=!a.G);return e||f};mS.ye=function ye(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B;s=QC(hS.EG,cT,5,a.L.d,16,1);t=QC(hS.EG,cT,5,a.L.e,16,1);b=0;v=false;for(d=0;d<a.L.d;d++){if(a.P[d]){if(!a.X[d]){if(mS.re(a,d,false)){a.X[d]=true;s[d]=true;++b}}}}for(f=0;f<a.L.e;f++){if(a.O[f]){if(!a.n[f]){if(mS.me(a,f,false)){a.n[f]=true;t[f]=true;++b}}}}if(b==1){for(c=0;c<a.L.d;c++){if(s[c]){a.W[c]=0;break}}for(e=0;e<a.L.e;e++){if(t[e]){a.k[e]=0;break}}}else if(b>1){mS.ve(a);for(h=new CS.vO(a.s);h.a<h.c.a.length;){g=CS.uO(h);u=0;w=0;k=0;j=0;l=-1;i=-1;for(o=0;o<g.a.length;o++){if(s[g.a[o]]){++u;if(a.W[g.a[o]]==1||a.W[g.a[o]]==2){++w;v=true;if(l<a.c[g.a[o]]){l=a.c[g.a[o]];k=g.a[o]}}}}for(p=0;p<g.b.length;p++){if(t[g.b[p]]){++u;A=a.c[mS.di(a.L,0,g.b[p])];B=a.c[mS.di(a.L,1,g.b[p])];m=A>B?(A<<16)+B:(B<<16)+A;if(a.k[g.b[p]]==1||a.k[g.b[p]]==2){++w;v=true;if(i<m){i=m;j=g.b[p]}}}}if(u==0)continue;if(u==1){for(q=0;q<g.a.length;q++)s[g.a[q]]&&(a.W[g.a[q]]=0);for(n=0;n<g.b.length;n++)t[g.b[n]]&&(a.k[g.b[n]]=0)}else{if(w==1){for(q=0;q<g.a.length;q++)s[g.a[q]]&&(a.W[g.a[q]]=3);for(n=0;n<g.b.length;n++)t[g.b[n]]&&(a.k[g.b[n]]=3)}else{r=false;l!=-1?a.W[k]==2&&(r=true):a.k[j]==2&&(r=true);if(r){for(q=0;q<g.a.length;q++){if(s[g.a[q]]){switch(a.W[g.a[q]]){case 1:a.W[g.a[q]]=2;break;case 2:a.W[g.a[q]]=1;}}}for(n=0;n<g.b.length;n++){if(t[g.b[n]]){switch(a.k[g.b[n]]){case 1:a.k[g.b[n]]=2;break;case 2:a.k[g.b[n]]=1;}}}}}}}}return v};mS.ze=function ze(a,b){var c,d,e,f,g,h,i,j,k,l,m;f=OC(hS.QD,[FT,$S],[6,5],15,[2,32],2);for(g=0;g<2;g++){c=QC(hS.QD,FT,6,32,0,2);m=0;for(e=0;e<32;e++){if(b[g][e]!=null){k=b[g][e].length;c[e]=QC(hS.QD,$S,5,k,15,1);for(h=0;h<k;h++)c[e][h]=a.c[b[g][e][h]];CS.QO(c[e]);++m}}for(l=m;l>0;l--){j=0;i=null;for(d=0;d<32;d++){if(c[d]!=null){if(i==null||i.length<c[d].length){i=c[d];j=d}else if(i.length==c[d].length){for(h=i.length-1;h>=0;h--){if(i[h]<c[d][h]){i=c[d];j=d;break}}}}}f[g][j]=l;c[j]=null}}return f};mS.Ae=function Ae(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t;l=false;if(a.L.I){for(j=0;j<a.L.e;j++){if(mS.ni(a.L,j)!=0){l=true;break}}}a.I=2;for(c=0;c<a.L.d;c++)a.I=iS.cK(a.I,mS.Fk(a.L,c)+mS.Tk(a.L,c));i=iS.cK(2,l?(78+a.I*37)/63|0:(78+a.I*21)/63|0);a.c=QC(hS.QD,$S,5,a.L.o,15,1);a.b=QC(hS.$D,GT,53,a.L.d,0,1);for(d=0;d<a.L.d;d++)a.b[d]=new mS.Qf(i);h=false;for(e=0;e<a.L.d;e++){mS.Pf(a.b[e],e);(mS.Wh(a.L,e)&1)!=0||mS.Rh(a.L,e)!=null?mS.Mf(a.b[e],8,6):mS.Mf(a.b[e],8,WG(mS._h(a.L,e)));mS.Mf(a.b[e],8,WG(mS.Uh(a.L,e)));mS.Mf(a.b[e],2,WG(mS.vk(a.L,e)));mS.Mf(a.b[e],4,WG(mS.Fk(a.L,e)+mS.Tk(a.L,e)));(mS.Wh(a.L,e)&1)!=0?mS.Mf(a.b[e],4,8):mS.Mf(a.b[e],4,WG(8+mS.Kh(a.L,e)));mS.Mf(a.b[e],5,WG(iS.dK(31,mS.zk(a.L,e))));mS.Mf(a.b[e],4,WG(mS.pe(a,e)+1));mS.Mf(a.b[e],2,WG(mS.Xh(a.L,e)>>4));if(a.L.I){mS.Mf(a.b[e],30,WG(mS.Wh(a.L,e)));mS.Rh(a.L,e)!=null&&(h=true)}}a.N=mS.De(a);if(a.N<a.L.d){for(b=0;b<a.L.d;b++){mS.Pf(a.b[b],b);mS.Mf(a.b[b],16,WG(a.c[b]));m=QC(hS.QD,$S,5,mS.Fk(a.L,b),15,1);for(o=0;o<mS.Fk(a.L,b);o++){m[o]=a.c[mS.Ek(a.L,b,o)]<<5;m[o]|=iS.dK(31,mS.Dk(a.L,mS.Gk(a.L,b,o)))}CS.QO(m);for(p=a.I;p>m.length;p--)mS.Mf(a.b[b],21,0);for(n=m.length-1;n>=0;n--)mS.Mf(a.b[b],21,hS.TG(m[n]))}a.N=mS.De(a)}if(h&&a.N<a.L.d){for(b=0;b<a.L.d;b++){mS.Pf(a.b[b],b);mS.Mf(a.b[b],16,WG(a.c[b]));g=mS.Rh(a.L,b);s=g==null?0:iS.dK(12,g.length);for(o=12;o>s;o--)mS.Mf(a.b[b],8,0);for(n=s-1;n>=0;n--)mS.Mf(a.b[b],8,hS.TG(g[n]))}a.N=mS.De(a)}if(l&&a.N<a.L.d){for(b=0;b<a.L.d;b++){mS.Pf(a.b[b],b);mS.Mf(a.b[b],16,WG(a.c[b]));k=QC(hS.RD,HT,5,mS.Fk(a.L,b)+mS.Tk(a.L,b),14,1);q=0;for(o=0;o<mS.sk(a.L,b);o++){if(o<mS.Fk(a.L,b)||o>=mS.rk(a.L,b)){k[q]=WG(a.c[mS.Ek(a.L,b,o)]);k[q]=aH(k[q],21);k[q]=_G(k[q],WG(mS.ni(a.L,mS.Gk(a.L,b,o))));++q}}CS.PO(k,lS.UR());for(p=a.I;p>k.length;p--)mS.Mf(a.b[b],37,0);for(n=k.length-1;n>=0;n--)mS.Mf(a.b[b],37,k[n])}a.N=mS.De(a)}if((a.K&8)!=0&&a.N<a.L.d){r=new mS.No;for(f=0;f<a.L.d;f++)mS.Mh(a.L,f)!=null&&mS.Lo(r,mS.Mh(a.L,f));for(b=0;b<a.L.d;b++){t=mS.Mh(a.L,b)==null?0:1+mS.Mo(r,mS.Mh(a.L,b));mS.Pf(a.b[b],b);mS.Mf(a.b[b],16,WG(a.c[b]));mS.Mf(a.b[b],16,hS.TG(t))}a.N=mS.De(a)}if((a.K&16)!=0&&a.N<a.L.d){for(b=0;b<a.L.d;b++){mS.Pf(a.b[b],b);mS.Mf(a.b[b],16,WG(a.c[b]));mS.Mf(a.b[b],1,WG(mS.Ri(a.L,b)?1:0))}a.N=mS.De(a)}};mS.Be=function Be(a){var b,c,d,e,f,g,h,i,j,k;f=0;for(c=0;c<a.L.d;c++)a.U[c]!=0&&++f;if(f==0)return;k=QC(hS.QD,$S,5,f,15,1);f=0;for(d=0;d<a.L.d;d++){if(a.U[d]!=0){k[f]=a.U[d]<<29|a.T[d]<<24|a.c[d]<<12|d;++f}}CS.QO(k);g=0;j=0;h=k[0]&IT;while(true){++j;if(j==k.length||h!=(k[j]&IT)){e=QC(hS.QD,$S,5,j-g,15,1);for(i=g;i<j;i++){b=k[i]&4095;e[i-g]=b;a.Y[b]=true}CS.IN(a.Z,e);if(j==k.length)break;h=k[j]&IT;g=j}}};mS.Ce=function Ce(a){var b,c,d,e,f,g,h,i,j,k,l;e=false;for(f=0;f<a.Z.a.length;f++){d=CS.NN(a.Z,f);b=true;l=-1;g=false;for(j=0;j<d.length;j++){c=d[j];if(a.W[c]==0){b=false;break}if(a.W[c]!=3){h=true;for(k=0;k<d.length;k++){if(k!=j&&a.c[c]===a.c[d[k]]){h=false;break}}if(h&&l<a.c[c]){l=a.c[c];g=a.W[c]==1}}}if(b&&l!=-1){for(i=0;i<d.length;i++){c=d[i];g&&(a.W[c]==1?(a.W[c]=2):a.W[c]==2&&(a.W[c]=1));a.Y[c]=false}CS.UN(a.Z,d);e=true;--f}}return e};mS.De=function De(a){var b,c;b=mS.ue(a);do{c=b;mS.qe(a);b=mS.ue(a)}while(c!=b);return b};mS.Ee=function Ee(a){var b,c,d,e,f,g,h;a.P=QC(hS.EG,cT,5,a.L.d,16,1);a.O=QC(hS.EG,cT,5,a.L.e,16,1);if((a.K&6)!=0){for(b=0;b<a.L.d;b++){mS.Pf(a.b[b],b);mS.Mf(a.b[b],28,WG(a.c[b]<<12))}}if(a.N<a.L.d){f=0;for(b=0;b<a.L.d;b++)mS.re(a,b,true)&&++f;for(e=0;e<a.L.e;e++)mS.me(a,e,true)&&++f}(a.K&6)!=0&&(a.N=mS.De(a));if((a.K&1)!=0){a.d=QC(hS.QD,$S,5,a.L.d,15,1);for(b=0;b<a.L.d;b++)a.d[b]=a.c[b]}while(a.N<a.L.d){for(c=0;c<a.L.d;c++){mS.Pf(a.b[c],c);mS.Mf(a.b[c],17,WG(2*a.c[c]))}h=QC(hS.QD,$S,5,a.N+1,15,1);for(d=0;d<a.L.d;d++)++h[a.c[d]];g=1;while(h[g]==1)++g;for(b=0;b<a.L.d;b++){if(a.c[b]==g){mS.Nf(a.b[b],1);break}}a.N=mS.De(a);mS.Ce(a);!!a.J&&mS.bg(a.J,a.c)}mS.Ce(a);mS.ye(a);mS._e(a)};mS.Fe=function Fe(a){var b,c,d,e,f,g;g=a.N;f=QC(hS.QD,$S,5,a.L.d,15,1);for(c=0;c<a.L.d;c++)f[c]=a.c[c];if(!a.L.I){mS.He(a);mS.qf(a,g,f)}a.U=QC(hS.MD,JT,5,a.L.d,15,1);a.T=QC(hS.MD,JT,5,a.L.d,15,1);for(d=0;d<a.L.d;d++){a.U[d]=mS.Ph(a.L,d)<<24>>24;a.T[d]=mS.Oh(a.L,d)<<24>>24}a.j=QC(hS.MD,JT,5,a.L.e,15,1);a.i=QC(hS.MD,JT,5,a.L.e,15,1);for(e=0;e<a.L.e;e++){a.j[e]=mS.ii(a.L,e)<<24>>24;a.i[e]=mS.hi(a.L,e)<<24>>24}mS.Ge(a);a.Q=false;a.H=QC(hS.EG,cT,5,a.L.d,16,1);for(b=0;b<a.L.d;b++){if(a.W[b]!=0){a.H[b]=true;a.Q=true}}mS.Je(a);a.J=null;a.V=QC(hS.EG,cT,5,a.L.d,16,1);if(a.Q){a.J=new mS.hg(a.L,f,a.H,a.W,a.k,a.U,a.T,a.$,a.o,a.V);mS.cg(a.J)}a.Y=QC(hS.EG,cT,5,a.L.d,16,1);a.Z=new CS._N;mS.Be(a);mS.qf(a,g,f);mS.Ie(a);!!a.J&&(a.F=mS.$f(a.J));mS.Te(a)};mS.Ge=function Ge(a){var b,c,d,e,f,g;a.G=true;f=mS.xe(a,false);while(a.N<a.L.d&&f){for(b=0;b<a.L.d;b++){mS.Pf(a.b[b],b);mS.Mf(a.b[b],16,WG(a.c[b]));g=a.W[b]<<7;if((a.W[b]==1||a.W[b]==2)&&a.U[b]!=0){g|=a.U[b]<<5;g|=a.T[b]}mS.Mf(a.b[b],18,hS.TG(g<<9))}for(c=0;c<a.L.e;c++){d=a.k[c]<<7;if((a.k[c]==1||a.k[c]==2)&&mS.oi(a.L,c)==1&&a.j[c]!=0){d|=a.j[c]<<5;d|=a.i[c]}mS.Nf(a.b[mS.di(a.L,0,c)],hS.TG(d));mS.Nf(a.b[mS.di(a.L,1,c)],hS.TG(d))}e=mS.De(a);if(a.N==e)break;a.N=e;f=mS.xe(a,false)}};mS.He=function He(a){var b,c,d,e;a.G=true;a.R=QC(hS.MD,JT,5,a.L.d,15,1);a.f=QC(hS.MD,JT,5,a.L.e,15,1);e=mS.xe(a,true);while(a.N<a.L.d&&e){for(b=0;b<a.L.d;b++){mS.Pf(a.b[b],b);mS.Mf(a.b[b],20,WG(a.c[b]<<4|a.W[b]<<2))}for(c=0;c<a.L.e;c++){mS.Nf(a.b[mS.di(a.L,0,c)],WG(a.k[c]));mS.Nf(a.b[mS.di(a.L,1,c)],WG(a.k[c]))}d=mS.De(a);if(a.N==d)break;a.N=d;e=mS.xe(a,true)}};mS.Ie=function Ie(a){var b,c,d,e,f,g;a.G=true;d=mS.Se(a);!!a.J&&mS.bg(a.J,a.c)&&(d=mS.Se(a));mS.xe(a,false)&&mS.Ce(a);g=true;while(a.N<a.L.d&&g){e=mS.ze(a,d);for(b=0;b<a.L.d;b++){mS.Pf(a.b[b],b);mS.Mf(a.b[b],16,WG(a.c[b]));mS.Mf(a.b[b],20,0);!a.V[b]&&a.U[b]!=0&&mS.Nf(a.b[b],WG((a.U[b]<<18)+(e[a.U[b]==1?0:1][a.T[b]]<<8)));mS.Nf(a.b[b],WG(a.W[b]<<4))}for(c=0;c<a.L.e;c++){mS.Nf(a.b[mS.di(a.L,0,c)],WG(a.k[c]));mS.Nf(a.b[mS.di(a.L,1,c)],WG(a.k[c]))}f=mS.De(a);if(a.N==f)break;a.N=f;g=false;if(!!a.J&&mS.bg(a.J,a.c)){g=true;d=mS.Se(a)}if(mS.xe(a,false)){g=true;mS.Ce(a)}}};mS.Je=function Je(a){var b,c;for(b=0;b<a.L.d;b++)(!a.H[b]||a.W[b]==3)&&(a.U[b]=0);for(c=0;c<a.L.e;c++)(mS.oi(a.L,c)!=1||a.k[c]==0||a.k[c]==3)&&(a.j[c]=0)};mS.Ke=function Ke(a,b,c){if(a.a==null){a.a=QC(hS.MD,JT,5,a.L.d,15,1);CS.DO(a.a)}a.a[b]=c<<24>>24};mS.Le=function Le(b,c){var d,e,f,g,h,i;if((b.k[c]==1||b.k[c]==2)&&!mS.wl(b.L,c)){h=false;try{for(g=0;g<2;g++){d=mS.di(b.L,g,c);if(mS.Fk(b.L,d)==3){e=QC(hS.QD,$S,5,2,15,1);f=0;for(i=0;i<mS.Fk(b.L,d);i++)mS.Gk(b.L,d,i)!=c&&(e[f++]=mS.Ek(b.L,d,i));b.c[e[0]]>b.c[e[1]]^mS.Ne(b,d,e[0],e[1])&&(h=!h)}}}catch(a){a=IG(a);if(CD(a,12)){b.f[c]=3;return}else throw JG(a)}b.k[c]==1^h?(b.f[c]=1):(b.f[c]=2)}};mS.Me=function Me(b,c){var d,e,f,g,h,i,j;if(b.W[c]==1||b.W[c]==2){i=false;if(mS.vk(b.L,c)==2){try{for(h=0;h<2;h++){d=mS.Ek(b.L,c,h);if(mS.Fk(b.L,d)==3){f=QC(hS.QD,$S,5,2,15,1);g=0;for(j=0;j<mS.Fk(b.L,d);j++)mS.Hk(b.L,d,j)==1&&(f[g++]=mS.Ek(b.L,d,j));b.c[f[0]]>b.c[f[1]]^mS.Ne(b,d,f[0],f[1])&&(i=!i)}}}catch(a){a=IG(a);if(CD(a,12)){b.R[c]=3;return}else throw JG(a)}}else{try{e=mS.Pe(b,c)}catch(a){a=IG(a);if(CD(a,12)){b.R[c]=3;return}else throw JG(a)}for(h=1;h<e.length;h++)for(j=0;j<h;j++)b.c[e[h]]<b.c[e[j]]&&(i=!i)}b.W[c]==1^i?(b.R[c]=1):(b.R[c]=2)}};mS.Ne=function Ne(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L;if(mS._h(a.L,c)!=mS._h(a.L,d))return mS._h(a.L,c)>mS._h(a.L,d);if(mS.Uh(a.L,c)!=mS.Uh(a.L,d)){H=mS.Oi(a.L,c)?(mS.dh(),mS.ah)[mS._h(a.L,c)]:mS.Uh(a.L,c);I=mS.Oi(a.L,d)?(mS.dh(),mS.ah)[mS._h(a.L,d)]:mS.Uh(a.L,d);return H>I}w=a.L.d;s=QC(hS.QD,$S,5,w,15,1);u=QC(hS.QD,$S,5,w,15,1);v=QC(hS.QD,$S,5,w,15,1);t=QC(hS.EG,cT,5,w,16,1);i=QC(hS.EG,cT,5,a.L.o,16,1);s[0]=b;s[1]=c;s[2]=d;u[0]=-1;u[1]=0;u[2]=0;i[b]=true;i[c]=true;i[d]=true;m=1;A=2;G=QC(hS.QD,$S,5,64,15,1);G[1]=1;G[2]=3;o=2;while(m<=A){while(m<G[o]){n=s[m];if(!t[m]){p=0;q=0;for(C=0;C<mS.Fk(a.L,n);C++){k=mS.Ek(a.L,n,C);if(A+mS.Hk(a.L,n,C)+1>=w){w+=a.L.d;s=mS.sf(s,w);u=mS.sf(u,w);v=mS.sf(v,w);t=mS.tf(t,w)}if(mS.pl(a.L,mS.Gk(a.L,n,C))){++p;q+=mS._h(a.L,k)}else{for(F=1;F<mS.Hk(a.L,n,C);F++){++A;s[A]=k;u[A]=m;t[A]=true}}K=u[m];if(k==s[K])continue;h=false;if(i[k]){J=u[K];while(J!=-1){if(k==s[J]){h=true;break}J=u[J]}}if(h){++A;s[A]=k;u[A]=m;t[A]=true}else{++A;s[A]=k;u[A]=m;i[k]=true}}if(p!=0){++A;v[A]=(q<<2)/p|0;u[A]=m;t[A]=true}}++m;if(m==WS){throw JG(new iS.HA('Emergency break in while loop.'))}}G.length==o+1&&(G=mS.sf(G,G.length+64));G[o+1]=A+1;for(B=G[o];B<G[o+1];B++){v[B]==0&&(v[B]=(mS._h(a.L,s[B])==151?1:mS._h(a.L,s[B])==152?1:mS._h(a.L,s[B]))<<2);v[B]+=v[u[B]]<<16}mS.Re(a,t,v,u,s,G,o);if(v[1]!==v[2])return v[1]>v[2];o>1&&mS.Oe(v,u,G,o);++o}l=QC(hS.QD,$S,5,a.L.d,15,1);D=false;for(f=0;f<a.L.d;f++){if(i[f]&&!mS.Oi(a.L,f)){D=true;break}}if(D){for(g=0;g<a.L.d;g++)l[g]=mS.Oi(a.L,g)?(mS.dh(),mS.ah)[mS._h(a.L,g)]:mS.Uh(a.L,g);if(mS.Qe(a,t,v,u,s,l,G,o))return v[1]>v[2]}CS.HO(l,l.length,0);r=false;for(j=0;j<a.L.e;j++){if(i[mS.di(a.L,0,j)]||i[mS.di(a.L,1,j)]){if(a.f[j]==1){l[mS.di(a.L,0,j)]=1;l[mS.di(a.L,1,j)]=1;r=true}else if(a.f[j]==2){l[mS.di(a.L,0,j)]=2;l[mS.di(a.L,1,j)]=2;r=true}}}if(r&&mS.Qe(a,t,v,u,s,l,G,o))return v[1]>v[2];CS.HO(l,l.length,0);L=false;for(e=0;e<a.L.d;e++){if(i[e]){if(a.R[e]==2){l[e]=1;L=true}else if(a.R[e]==1){l[e]=2;L=true}}}if(L&&mS.Qe(a,t,v,u,s,l,G,o))return v[1]>v[2];throw JG(new iS.HA('no distinction applying CIP rules'))};mS.Oe=function Oe(a,b,c,d){var e,f,g,h,i,j,k,l,m;l=c[d];g=c[d+1]-l;m=QC(hS.YD,DT,78,g,0,1);for(i=0;i<g;i++){m[i]=new mS.Lf;m[i].c=a[i+l];m[i].b=b[i+l];m[i].a=i+l}e=new mS.If;for(k=d;k>1;k--){for(j=0;j<g;j++){m[j].c+=a[m[j].b]<<16;m[j].b=b[m[j].b]}CS.NO(m,0,m.length,e);f=1;for(h=0;h<g;h++){a[m[h].a]=f;h!=g-1&&mS.Hf(m[h],m[h+1])!=0&&++f}}};mS.Pe=function Pe(a,b){var c,d,e,f,g,h,i;g=mS.rk(a.L,b);h=QC(hS.QD,$S,5,g,15,1);for(e=0;e<g;e++)h[e]=mS.Ek(a.L,b,e);for(d=g;d>1;d--){c=false;for(f=1;f<d;f++){if(mS.Ne(a,b,h[f-1],h[f])){c=true;i=h[f-1];h[f-1]=h[f];h[f]=i}}if(!c)break}return h};mS.Qe=function Qe(a,b,c,d,e,f,g,h){var i,j;for(j=1;j<h;j++){for(i=g[j];i<g[j+1];i++)c[i]=f[e[i]]+(c[d[i]]<<8);mS.Re(a,b,c,d,e,g,j);if(c[1]!==c[2])return true;j>1&&mS.Oe(c,d,g,j)}return false};mS.Re=function Re(a,b,c,d,e,f,g){var h,i,j,k,l,m,n,o,p,q,r;for(l=g;l>1;l--){p=f[l]-f[l-1];r=QC(hS.WD,DT,77,p,0,1);h=f[l];for(o=0;o<p;o++){q=f[l-1]+o;m=h;while(m<f[l+1]&&d[m]==q)++m;r[o]=new mS.Ff;r[o].c=q;r[o].d=c[q];r[o].b=b[q]?0:mS.tk(a.L,e[q]);r[o].a=QC(hS.QD,$S,5,m-h,15,1);for(k=h;k<m;k++)r[o].a[k-h]=c[k];CS.QO(r[o].a);h=m}i=new mS.Cf;CS.NO(r,0,r.length,i);j=1;for(n=0;n<p;n++){c[r[n].c]=j;n!=p-1&&mS.Bf(r[n],r[n+1])!=0&&++j}}};mS.Se=function Se(a){var b,c;c=OC(hS.QD,[HS,FT],[22,6],0,[2,32],2);for(b=0;b<a.L.d;b++){a.H[b]&&(a.U[b]==1?(c[0][a.T[b]]=mS.ig(c[0][a.T[b]],b)):a.U[b]==2&&(c[1][a.T[b]]=mS.ig(c[0][a.T[b]],b)))}return c};mS.Te=function Te(a){var b,c,d,e,f,g,h,i,j,k,l,m;f=0;k=0;g=0;h=0;i=0;j=0;l=0;m=false;b=QC(hS.EG,cT,5,32,16,1);for(c=0;c<a.L.d;c++){if(a.W[c]!=0){++f;if(a.W[c]==3){++k}else{if(a.U[c]==0){++g;!!a.J&&mS.Zf(a.J,c)&&++h}else if(a.U[c]==2){a.T[c]==0&&++j}else if(a.U[c]==1){e=a.T[c];if(!b[e]){++l;b[e]=true}a.T[c]==0&&++i;!!a.J&&mS.Zf(a.J,c)&&(m=true)}}}}for(d=0;d<a.L.e;d++){if(a.k[d]!=0&&mS.oi(a.L,d)==1){++f;if(a.k[d]==3){++k}else{if(a.j[d]==0){++g;!!a.J&&mS.Zf(a.J,mS.di(a.L,0,d))&&mS.Zf(a.J,mS.di(a.L,1,d))&&++h}else if(a.j[d]==2){a.i[d]==0&&++j}else if(a.j[d]==1){e=a.i[d];if(!b[e]){++l;b[e]=true}a.i[d]==0&&++i;!!a.J&&mS.Zf(a.J,mS.di(a.L,0,d))&&mS.Zf(a.J,mS.di(a.L,1,d))&&(m=true)}}}}if(f==0){mS.Mj(a.L,US);return}if(k!=0){mS.Mj(a.L,0);return}if(a.F){mS.Mj(a.L,KT+(1<<l));return}i+h==f&&!m?mS.Mj(a.L,196608):g==f?mS.Mj(a.L,ET):j==f?mS.Mj(a.L,327680):g==f-1&&i==1?mS.Mj(a.L,uT):mS.Mj(a.L,458752+(1<<l))};mS.Ue=function Ue(a,b,c,d,e,f){var g,h,i;g=c==-1?(mS.Yh(a.L,b)-mS.Yh(a.L,a.t[0]))/8:mS.Yh(a.L,b)-mS.Yh(a.L,c);h=c==-1?(mS.Zh(a.L,b)-mS.Zh(a.L,a.t[0]))/8:mS.Zh(a.L,b)-mS.Zh(a.L,c);mS.Ve(a,LD((d+g)/e),f);mS.Ve(a,LD((d+h)/e),f);if(a._){i=c==-1?(mS.$h(a.L,b)-mS.$h(a.L,a.t[0]))/8:mS.$h(a.L,b)-mS.$h(a.L,c);mS.Ve(a,LD((d+i)/e),f)}};mS.Ve=function Ve(a,b,c){while(c!=0){if(a.p==0){iS.NK(a.q,a.r+64&VS);a.p=6;a.r=0}a.r<<=1;a.r|=b&1;b>>=1;--c;--a.p}};mS.We=function We(a){a.r<<=a.p;iS.NK(a.q,a.r+64&VS);return a.q.a};mS.Xe=function Xe(a){a.q=new iS.TK;a.p=6;a.r=0};mS.Ye=function Ye(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p;if(a.L.d==0){a.e='';return}k=false;if(a._&&a.L.o>a.L.d&&!a.L.I){k=true;for(h=0;h<a.L.d;h++){if(mS.Rk(a.L,h)!=0){k=false;break}}}p=a._?16:8;mS.Xe(a);iS.NK(a.q,k?35:33);mS.Ve(a,a._?1:0,1);mS.Ve(a,b?1:0,1);mS.Ve(a,p/2|0,4);n=0;for(i=1;i<a.L.d;i++)n=mS.gf(a,a.t[i],a.w[i]==-1?-1:a.t[a.w[i]],n);if(k){for(h=0;h<a.L.d;h++){c=a.t[h];for(m=mS.Fk(a.L,c);m<mS.rk(a.L,c);m++)n=mS.gf(a,mS.Ek(a.L,c,m),c,n)}}if(n==0){a.e='';return}f=1<<p;l=n/(f/2-1);o=n+l/2;for(j=1;j<a.L.d;j++)mS.Ue(a,a.t[j],a.w[j]==-1?-1:a.t[a.w[j]],o,l,p);if(k){for(g=0;g<a.L.d;g++){c=a.t[g];for(m=mS.Fk(a.L,c);m<mS.rk(a.L,c);m++)mS.Ue(a,mS.Ek(a.L,c,m),c,o,l,p)}}if(b){e=a._?1.5:(mS.dh(),mS.dh(),mS.bh);d=mS.bi(a.L,a.L.d,a.L.e,e);mS.Ve(a,iS.dK(f-1,iS.cK(0,LD(0.5+$wnd.Math.log(d/0.1)*$wnd.Math.LOG10E/($wnd.Math.log(2000)*$wnd.Math.LOG10E)*(f-1)))),p);mS.Ve(a,mS.Ze(mS.Yh(a.L,a.t[0])/d,f),p);mS.Ve(a,mS.Ze(mS.Zh(a.L,a.t[0])/d,f),p);a._&&mS.Ve(a,mS.Ze(mS.$h(a.L,a.t[0]),f),p)}a.e=mS.We(a)};mS.Ze=function Ze(a,b){var c,d,e,f;c=b/2|0;e=a<0;a=$wnd.Math.abs(a);f=b/32|0;d=iS.dK(c-1,eH(VG($wnd.Math.round(a*c/(a+f)))));return e?c+d:d};mS.$e=function $e(a,b){if(!b){mS.Ve(a,1,1);mS.Ve(a,15,4)}return true};mS._e=function _e(a){var b,c,d;for(b=0;b<a.L.d;b++){mS.zi(a.L,b)^a.W[b]==3&&mS.Sj(a.L,b);(mS.Ph(a.L,b)==1||mS.Ph(a.L,b)==2)&&(!a.H[b]||a.W[b]==3)&&mS.Sj(a.L,b)}for(d=0;d<a.L.p;d++)mS.Ti(a.L,d)&&!mS.rf(a,d)&&mS.Sj(a.L,mS.di(a.L,0,d));for(c=0;c<a.L.e;c++){if(mS.li(a.L,c)==2){if(mS.Ji(a.L,c)&&(a.k[c]==1||a.k[c]==2)){a.k[c]=3;mS.Lj(a.L,c,26)}if(a.k[c]==3&&!a.n[c]){if(mS.oi(a.L,c)!=26){mS.Sj(a.L,mS.di(a.L,0,c));mS.Sj(a.L,mS.di(a.L,1,c))}}}if(mS.oi(a.L,c)==1&&a.k[c]==3){mS.Sj(a.L,mS.di(a.L,0,c));mS.Sj(a.L,mS.di(a.L,1,c))}if((mS.ii(a.L,c)==1||mS.ii(a.L,c)==2)&&(mS.oi(a.L,c)!=1||a.k[c]!=1&&a.k[c]!=2)){mS.Sj(a.L,mS.di(a.L,0,c));mS.Sj(a.L,mS.di(a.L,1,c))}}};mS.af=function af(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v;if(a.L.d==0)return;if(a.A)return;a.C=0;v=0;for(c=1;c<a.L.d;c++)a.c[c]>a.c[v]&&(v=c);d=QC(hS.EG,cT,5,a.L.d,16,1);g=QC(hS.EG,cT,5,a.L.e,16,1);a.B=QC(hS.QD,$S,5,a.L.d,15,1);a.t=QC(hS.QD,$S,5,a.L.d,15,1);a.w=QC(hS.QD,$S,5,a.L.d,15,1);a.u=QC(hS.QD,$S,5,a.L.e,15,1);a.t[0]=v;a.B[v]=0;d[v]=true;e=1;i=0;j=1;k=0;while(i<a.L.d){if(i<j){while(true){o=0;p=0;m=-1;b=a.t[i];for(q=0;q<mS.sk(a.L,b);q++){if(q<mS.Fk(a.L,b)||q>=mS.rk(a.L,b)){h=mS.Ek(a.L,b,q);if(!d[h]&&a.c[h]>m){o=h;p=mS.Gk(a.L,b,q);m=a.c[h]}}}if(m==-1)break;a.B[o]=j;a.w[j]=i;a.t[j++]=o;a.u[k++]=p;d[o]=true;g[p]=true}++i}else{n=0;m=-1;for(b=0;b<a.L.d;b++){if(!d[b]&&a.c[b]>m){n=b;m=a.c[b]}}++e;a.B[n]=j;a.w[j]=-1;a.t[j++]=n;d[n]=true}}a.v=QC(hS.QD,$S,5,2*(a.L.e-k),15,1);while(true){s=a.L.K;t=a.L.K;u=-1;for(f=0;f<a.L.e;f++){if(!g[f]){if(a.B[mS.di(a.L,0,f)]<a.B[mS.di(a.L,1,f)]){r=a.B[mS.di(a.L,0,f)];l=a.B[mS.di(a.L,1,f)]}else{r=a.B[mS.di(a.L,1,f)];l=a.B[mS.di(a.L,0,f)]}if(r<s||r==s&&l<t){s=r;t=l;u=f}}}if(u==-1)break;g[u]=true;a.u[k++]=u;a.v[2*a.C]=s;a.v[2*a.C+1]=t;++a.C}a.A=true};mS.bf=function bf(a){var b,c,d,e,f,g,h,i,j,k,l,m,n;h=null;n=mS._k(a.L);for(k=0;k<n.i.a.length;k++){if(n.e[k]){e=0;l=CS.NN(n.i,k);for(c=0,d=l.length;c<d;++c){b=l[c];mS.lf(a,b)&&++e}if(e!=0){m=CS.NN(n.j,k);h==null&&(h=QC(hS.EG,cT,5,a.L.e,16,1));if(e==l.length){i=-1;j=MS;for(f=0;f<l.length;f++){if(j>a.t[m[f]]){j=a.t[m[f]];i=f}}while(e>0){h[m[i]]=true;i=mS.yf(i+2,l.length);e-=2}}else{g=0;while(mS.lf(a,l[g]))++g;while(!mS.lf(a,l[g]))g=mS.yf(g+1,l.length);while(e>0){h[m[g]]=true;g=mS.yf(g+2,l.length);e-=2;while(!mS.lf(a,l[g]))g=mS.yf(g+1,l.length)}}}}}return h};mS.cf=function cf(a,b){return a.k[b]};mS.df=function df(a){return mS.ef(a,a._)};mS.ef=function ef(a,b){if(a.e==null){mS.af(a);mS.Ye(a,b)}return a.e};mS.ff=function ff(a){if(a.D==null){mS.af(a);mS.nf(a);mS.pf(a,1);mS.pf(a,2);mS.mf(a)}return a.D};mS.gf=function gf(a,b,c,d){var e,f,g;e=c==-1?$wnd.Math.abs(mS.Yh(a.L,b)-mS.Yh(a.L,a.t[0]))/8:$wnd.Math.abs(mS.Yh(a.L,b)-mS.Yh(a.L,c));d<e&&(d=e);f=c==-1?$wnd.Math.abs(mS.Zh(a.L,b)-mS.Zh(a.L,a.t[0]))/8:$wnd.Math.abs(mS.Zh(a.L,b)-mS.Zh(a.L,c));d<f&&(d=f);if(a._){g=c==-1?$wnd.Math.abs(mS.$h(a.L,b)-mS.$h(a.L,a.t[0]))/8:$wnd.Math.abs(mS.$h(a.L,b)-mS.$h(a.L,c));d<g&&(d=g)}return d};mS.hf=function hf(a,b){return a.d==null?-1:a.d[b]};mS.jf=function jf(a,b){return a.W[b]};mS.kf=function kf(a,b){var c,d,e,f,g,h,i;i=mS._k(a.L);for(c=0;c<i.i.a.length;c++){if(i.d[c]&&mS.bn(i,c,b)){for(e=CS.NN(i.i,c),f=0,g=e.length;f<g;++f){d=e[f];if(d!=b)for(h=0;h<mS.Fk(a.L,d);h++)if(mS.ol(a.L,mS.Gk(a.L,d,h)))return true}return false}}return false};mS.lf=function lf(a,b){var c,d,e;if(mS.vk(a.L,b)<2)return false;if(mS.Fk(a.L,b)==2)return true;c=0;for(e=0;e<mS.Fk(a.L,b);e++){d=mS.Gk(a.L,b,e);mS.nl(a.L,d)&&(c+=mS.li(a.L,d)-1)}return c>1};mS.mf=function mf(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y;mS.Xe(a);mS.Ve(a,9,4);U=iS.cK(mS.of(a.L.d),mS.of(a.L.e));mS.Ve(a,U,4);if(U==0){mS.Ve(a,a.L.I?1:0,1);mS.Ve(a,0,1);a.D=mS.We(a);return}V=X=W=H=0;for(f=0;f<a.L.d;f++){if((mS.Wh(a.L,f)&1)==0){switch(mS._h(a.L,f)){case 6:break;case 7:++V;break;case 8:++X;break;default:++W;}mS.Kh(a.L,f)!=0&&++H}}mS.Ve(a,a.L.d,U);mS.Ve(a,a.L.e,U);mS.Ve(a,V,U);mS.Ve(a,X,U);mS.Ve(a,W,U);mS.Ve(a,H,U);for(g=0;g<a.L.d;g++)mS._h(a.L,a.t[g])==7&&(mS.Wh(a.L,a.t[g])&1)==0&&mS.Ve(a,g,U);for(l=0;l<a.L.d;l++)mS._h(a.L,a.t[l])==8&&(mS.Wh(a.L,a.t[l])&1)==0&&mS.Ve(a,l,U);for(m=0;m<a.L.d;m++)if(mS._h(a.L,a.t[m])!=6&&mS._h(a.L,a.t[m])!=7&&mS._h(a.L,a.t[m])!=8&&(mS.Wh(a.L,a.t[m])&1)==0){mS.Ve(a,m,U);mS.Ve(a,mS._h(a.L,a.t[m]),8)}for(n=0;n<a.L.d;n++)if(mS.Kh(a.L,a.t[n])!=0&&(mS.Wh(a.L,a.t[n])&1)==0){mS.Ve(a,n,U);mS.Ve(a,8+mS.Kh(a.L,a.t[n]),4)}T=0;u=0;for(o=1;o<a.L.d;o++){if(a.w[o]==-1){L=0}else{L=1+a.w[o]-u;u=a.w[o]}T<L&&(T=L)}K=mS.of(T);mS.Ve(a,K,4);u=0;for(p=1;p<a.L.d;p++){if(a.w[p]==-1){L=0}else{L=1+a.w[p]-u;u=a.w[p]}mS.Ve(a,L,K)}for(N=0;N<2*a.C;N++)mS.Ve(a,a.v[N],U);for(w=0;w<a.L.e;w++){G=(mS.ni(a.L,a.u[w])&yT)!=0||mS.oi(a.L,a.u[w])==32?1:mS.pl(a.L,a.u[w])?0:mS.li(a.L,a.u[w]);mS.Ve(a,G,2)}c=0;for(q=0;q<a.L.d;q++)a.S[a.t[q]]!=0&&a.S[a.t[q]]!=3&&++c;mS.Ve(a,c,U);for(r=0;r<a.L.d;r++)if(a.S[a.t[r]]!=0&&a.S[a.t[r]]!=3){mS.Ve(a,r,U);if(a.U[a.t[r]]==0){mS.Ve(a,a.S[a.t[r]],3)}else{Y=a.S[a.t[r]]==1?a.U[a.t[r]]==1?4:6:a.U[a.t[r]]==1?5:7;mS.Ve(a,Y,3);mS.Ve(a,a.T[a.t[r]],3)}}b=0;for(A=0;A<a.L.e;A++)a.g[a.u[A]]!=0&&a.g[a.u[A]]!=3&&(!mS.wl(a.L,a.u[A])||mS.oi(a.L,a.u[A])==1)&&++b;mS.Ve(a,b,U);for(B=0;B<a.L.e;B++)if(a.g[a.u[B]]!=0&&a.g[a.u[B]]!=3&&(!mS.wl(a.L,a.u[B])||mS.oi(a.L,a.u[B])==1)){mS.Ve(a,B,U);if(mS.oi(a.L,a.u[B])==1){if(a.j[a.u[B]]==0){mS.Ve(a,a.g[a.u[B]],3)}else{Y=a.g[a.u[B]]==1?a.j[a.u[B]]==1?4:6:a.j[a.u[B]]==1?5:7;mS.Ve(a,Y,3);mS.Ve(a,a.i[a.u[B]],3)}}else{mS.Ve(a,a.g[a.u[B]],2)}}mS.Ve(a,a.L.I?1:0,1);I=0;for(s=0;s<a.L.d;s++)mS.Uh(a.L,a.t[s])!=0&&++I;if(I!=0){mS.Ve(a,1,1);mS.Ve(a,1,4);mS.Ve(a,I,U);for(h=0;h<a.L.d;h++){if(mS.Uh(a.L,a.t[h])!=0){mS.Ve(a,h,U);mS.Ve(a,mS.Uh(a.L,a.t[h]),8)}}}P=false;if(a.L.I){mS.ge(a,0,false,U,kT,1,-1);mS.he(a,2,false,U,64,1,-1);mS.ge(a,3,false,U,jT,1,-1);mS.ge(a,4,false,U,120,4,3);mS.ge(a,5,false,U,6,2,1);mS.ge(a,6,false,U,1,1,-1);mS.ge(a,7,false,U,lT,4,7);I=0;for(h=0;h<a.L.d;h++)mS.Rh(a.L,a.t[h])!=null&&++I;if(I>0){mS.Ve(a,1,1);mS.Ve(a,8,4);mS.Ve(a,I,U);for(i=0;i<a.L.d;i++){t=mS.Rh(a.L,a.t[i]);if(t!=null){mS.Ve(a,i,U);mS.Ve(a,t.length,4);for(M=0;M<t.length;M++)mS.Ve(a,t[M],8)}}}mS.he(a,9,false,U,96,2,5);mS.he(a,10,false,U,31,5,0);mS.ge(a,11,false,U,LT,1,-1);mS.he(a,12,false,U,yT,8,7);mS.ge(a,13,false,U,qT,3,14);mS.ge(a,14,false,U,sT,5,17);P=P|mS.ge(a,16,false,U,vT,3,22)}I=0;for(j=0;j<a.L.d;j++)a.a!=null&&a.a[a.t[j]]!=-1&&++I;if(I!=0){P=mS.$e(a,P);mS.Ve(a,1,1);mS.Ve(a,1,4);mS.Ve(a,I,U);for(h=0;h<a.L.d;h++){if(a.a!=null&&a.a[a.t[h]]!=-1){mS.Ve(a,h,U);mS.Ve(a,a.a[a.t[h]],4)}}}if((a.K&8)!=0){I=0;S=0;for(h=0;h<a.L.d;h++){Q=mS.Mh(a.L,a.t[h]);if(Q!=null){++I;S=iS.cK(S,iS.IK(Q).length)}}if(I!=0){P=mS.$e(a,P);R=mS.of(S);mS.Ve(a,1,1);mS.Ve(a,2,4);mS.Ve(a,I,U);mS.Ve(a,R,4);for(i=0;i<a.L.d;i++){J=mS.Mh(a.L,a.t[i]);if(J!=null){mS.Ve(a,i,U);mS.Ve(a,iS.IK(J).length,R);for(M=0;M<iS.IK(J).length;M++)mS.Ve(a,iS.IK(J).charCodeAt(M),7)}}}}if(a.L.I){P=P|mS.ge(a,19,P,U,nT,3,25);P=P|mS.he(a,20,P,U,AT,3,15)}I=0;for(k=0;k<a.L.d;k++)mS.Xh(a.L,a.t[k])!=0&&++I;if(I!=0){P=mS.$e(a,P);mS.Ve(a,1,1);mS.Ve(a,5,4);mS.Ve(a,I,U);for(e=0;e<a.L.d;e++){if(mS.Xh(a.L,a.t[e])!=0){mS.Ve(a,e,U);mS.Ve(a,mS.Xh(a.L,a.t[e])>>4,2)}}}if(a.L.I){P=P|mS.ge(a,22,P,U,wT,1,-1);P=P|mS.he(a,23,P,U,ET,1,-1);P=P|mS.he(a,24,P,U,zT,2,19)}if((a.K&16)!=0){for(e=0;e<a.L.d;e++){if(mS.Ri(a.L,a.t[e])){P=mS.$e(a,P);mS.Ve(a,1,1);mS.Ve(a,9,4);for(d=0;d<a.L.d;d++)mS.Ve(a,mS.Ri(a.L,a.t[d])?1:0,1);break}}}O=mS.bf(a);if(O!=null){I=0;for(C=0;C<a.L.e;C++)O[a.u[C]]&&++I;P=mS.$e(a,P);mS.Ve(a,1,1);mS.Ve(a,10,4);mS.Ve(a,I,U);for(D=0;D<a.L.e;D++)O[a.u[D]]&&mS.Ve(a,D,U)}a.L.I&&(P=P|mS.ge(a,27,P,U,dT,1,-1));I=0;for(F=0;F<a.L.e;F++)mS.oi(a.L,a.u[F])==32&&++I;if(I!=0){mS.$e(a,P);mS.Ve(a,1,1);mS.Ve(a,12,4);mS.Ve(a,I,U);for(v=0;v<a.L.e;v++)mS.oi(a.L,a.u[v])==32&&mS.Ve(a,v,U)}mS.Ve(a,0,1);a.D=mS.We(a)};mS.nf=function nf(a){var b,c,d,e,f,g,h,i,j,k,l;a.S=QC(hS.MD,JT,5,a.L.d,15,1);for(b=0;b<a.L.d;b++){if(a.W[b]==1||a.W[b]==2){i=false;if(mS.Fk(a.L,b)==2&&mS.Hk(a.L,b,0)==2&&mS.Hk(a.L,b,1)==2){for(h=0;h<mS.Fk(a.L,b);h++){e=mS.Ek(a.L,b,h);l=0;k=QC(hS.QD,$S,5,3,15,1);for(j=0;j<mS.Fk(a.L,e);j++){k[l]=mS.Ek(a.L,e,j);k[l]!=b&&++l}l==2&&a.c[k[0]]>a.c[k[1]]^a.B[k[0]]<a.B[k[1]]&&(i=!i)}}else{for(h=1;h<mS.Fk(a.L,b);h++){for(j=0;j<h;j++){f=mS.Ek(a.L,b,h);g=mS.Ek(a.L,b,j);a.c[f]>a.c[g]&&(i=!i);a.B[f]<a.B[g]&&(i=!i)}}}a.S[b]=a.W[b]==1^i?1:2}else{a.S[b]=a.W[b]}}a.g=QC(hS.MD,JT,5,a.L.e,15,1);for(c=0;c<a.L.e;c++){if(a.k[c]==1||a.k[c]==2){i=false;for(h=0;h<2;h++){d=mS.di(a.L,h,c);if(mS.Fk(a.L,d)==3){k=QC(hS.QD,$S,5,2,15,1);l=0;for(j=0;j<3;j++)mS.Ek(a.L,d,j)!=mS.di(a.L,1-h,c)&&(k[l++]=mS.Ek(a.L,d,j));a.c[k[0]]>a.c[k[1]]&&(i=!i);a.B[k[0]]<a.B[k[1]]&&(i=!i)}}a.g[c]=a.k[c]==1^i?1:2}else{a.g[c]=a.k[c]}}};mS.of=function of(a){var b;b=0;while(a>0){a>>=1;++b}return b};mS.pf=function pf(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o;i=QC(hS.QD,$S,5,32,15,1);j=0;for(d=0;d<a.L.d;d++){if((a.S[d]==1||a.S[d]==2)&&a.U[d]==b){h=a.T[d];if(i[h]<a.c[d]){i[h]==0&&++j;i[h]=a.c[d]}}}for(f=0;f<a.L.e;f++){if((a.g[f]==1||a.g[f]==2)&&a.j[f]==b&&mS.oi(a.L,f)==1){h=a.i[f];o=iS.cK(a.c[mS.di(a.L,0,f)],a.c[mS.di(a.L,1,f)]);if(i[h]<o){i[h]==0&&++j;i[h]=o}}}g=QC(hS.MD,JT,5,32,15,1);for(k=0;k<j;k++){m=-1;n=0;for(l=0;l<32;l++){if(n<i[l]){n=i[l];m=l}}i[m]=0;g[m]=k<<24>>24}for(c=0;c<a.L.d;c++)(a.S[c]==1||a.S[c]==2)&&a.U[c]==b&&(a.T[c]=g[a.T[c]]);for(e=0;e<a.L.e;e++)(a.g[e]==1||a.g[e]==2)&&a.j[e]==b&&mS.oi(a.L,e)==1&&(a.i[e]=g[a.i[e]])};
mS.qf=function qf(a,b,c){var d,e;a.N=b;for(d=0;d<a.L.d;d++){a.c[d]=c[d];a.W[d]=0;a.$[d]=false}for(e=0;e<a.L.e;e++){a.k[e]=0;a.o[e]=false}};mS.rf=function rf(a,b){var c,d,e;c=mS.di(a.L,0,b);if(c>=a.L.d)return false;if(a.W[c]==1||a.W[c]==2)return true;if(a.W[c]==3)return false;d=mS.nk(a.L,c);if(d!=-1)return a.k[d]==1||a.k[d]==2;for(e=0;e<mS.Fk(a.L,c);e++){if(mS.Hk(a.L,c,e)==2){if(a.W[mS.Ek(a.L,c,e)]==1||a.W[mS.Ek(a.L,c,e)]==2)return true}}return false};mS.sf=function sf(a,b){var c;c=QC(hS.QD,$S,5,b,15,1);iS.ZK(a,c,a.length);return c};mS.tf=function tf(a,b){var c;c=QC(hS.EG,cT,5,b,16,1);iS.ZK(a,c,a.length);return c};mS.uf=function uf(a){var b,c;if(a.R!=null)for(b=0;b<a.L.d;b++)mS.hj(a.L,b,a.R[b]);if(a.f!=null)for(c=0;c<a.L.e;c++)mS.Ej(a.L,c,a.f[c])};mS.vf=function vf(a){var b,c,d,e,f,g,h,i,j,k,l;for(b=0;b<a.L.d;b++){if(a.W[b]==1||a.W[b]==2){i=false;if(mS.vk(a.L,b)!=0&&mS.Fk(a.L,b)==2&&mS.Hk(a.L,b,0)==2&&mS.Hk(a.L,b,1)==2){for(h=0;h<mS.Fk(a.L,b);h++){e=mS.Ek(a.L,b,h);l=0;k=QC(hS.QD,$S,5,3,15,1);for(j=0;j<mS.Fk(a.L,e);j++){k[l]=mS.Ek(a.L,e,j);k[l]!=b&&++l}l==2&&a.c[k[0]]>a.c[k[1]]^k[0]<k[1]&&(i=!i)}}else{for(h=1;h<mS.Fk(a.L,b);h++){for(j=0;j<h;j++){f=mS.Ek(a.L,b,h);g=mS.Ek(a.L,b,j);a.c[f]>a.c[g]&&(i=!i);f<g&&(i=!i)}}}mS.tj(a.L,b,a.W[b]==1^i?1:2,a.X[b])}else{mS.tj(a.L,b,a.W[b],a.X[b])}}for(c=0;c<a.L.e;c++){if(a.k[c]==1||a.k[c]==2){i=false;for(h=0;h<2;h++){d=mS.di(a.L,h,c);if(mS.Fk(a.L,d)==3){k=QC(hS.QD,$S,5,2,15,1);l=0;for(j=0;j<3;j++)mS.Ek(a.L,d,j)!=mS.di(a.L,1-h,c)&&(k[l++]=mS.Ek(a.L,d,j));a.c[k[0]]>a.c[k[1]]&&(i=!i);k[0]<k[1]&&(i=!i)}}mS.Ij(a.L,c,a.k[c]==1^i?1:2,a.n[c])}else{mS.Ij(a.L,c,a.k[c],a.n[c])}}};mS.wf=function wf(a){var b;for(b=0;b<a.L.d;b++){mS.xj(a.L,b,a.H[b])}};mS.xf=function xf(a){var b,c;for(b=0;b<a.L.d;b++)!mS.zi(a.L,b)&&a.W[b]==3&&mS.kj(a.L,b,true);for(c=0;c<a.L.e;c++){a.k[c]==3&&mS.li(a.L,c)==2&&mS.Lj(a.L,c,26)}};mS.yf=function yf(a,b){return a<b?a:a-b};mS.zf=function zf(a,b){var c;if(a.o>VS)throw JG(new iS.QJ('Cannot canonize a molecule having more than 65535 atoms'));if(a.p>VS)throw JG(new iS.QJ('Cannot canonize a molecule having more than 65535 bonds'));this.L=a;this.K=b;mS.Po(this.L,3);mS.we(this);this._=(b&64)!=0;if(!this._){for(c=0;c<this.L.d;c++){if(mS.$h(this.L,c)!=0){this._=true;break}}}this.W=QC(hS.MD,JT,5,this.L.d,15,1);this.X=QC(hS.EG,cT,5,this.L.d,16,1);this.$=QC(hS.EG,cT,5,this.L.d,16,1);this.k=QC(hS.MD,JT,5,this.L.e,15,1);this.o=QC(hS.EG,cT,5,this.L.e,16,1);this.n=QC(hS.EG,cT,5,this.L.e,16,1);mS.Ae(this);mS.Fe(this);mS.Ee(this)};pH(59,1,{},mS.zf);_.p=0;_.r=0;_.A=false;_.C=0;_.F=false;_.G=false;_.I=0;_.K=0;_.N=0;_.Q=false;_._=false;hS.eE=$I(59);mS.Af=function Af(a,b){var c,d,e,f;if(a.d!=b.d)return a.d>b.d?1:-1;e=a.a.length;f=b.a.length;c=e<f?e:f;for(d=0;d<c;d++){--e;--f;if(a.a[e]!==b.a[f])return a.a[e]>b.a[f]?1:-1}if(e!=f)return e>f?1:-1;if(a.b!=b.b)return a.b>b.b?1:-1;return 0};mS.Bf=function Bf(a,b){return mS.Af(a,b)};mS.Cf=function Cf(){};pH(133,1,{},mS.Cf);_.eb=function Df(a,b){return mS.Bf(a,b)};_.ab=function Ef(a){return this===a};hS.XD=$I(133);mS.Ff=function Ff(){};pH(77,1,{77:1},mS.Ff);_.b=0;_.c=0;_.d=0;hS.WD=$I(77);mS.Gf=function Gf(a,b){if(a.c!=b.c)return a.c>b.c?1:-1;return 0};mS.Hf=function Hf(a,b){return mS.Gf(a,b)};mS.If=function If(){};pH(134,1,{},mS.If);_.eb=function Jf(a,b){return mS.Hf(a,b)};_.ab=function Kf(a){return this===a};hS.ZD=$I(134);mS.Lf=function Lf(){};pH(78,1,{78:1},mS.Lf);_.a=0;_.b=0;_.c=0;hS.YD=$I(78);mS.Mf=function Mf(a,b,c){if(a.b==0){++a.c;a.b=63}if(a.b==63){a.d[a.c]=_G(a.d[a.c],c);a.b-=b}else{if(a.b>=b){a.d[a.c]=aH(a.d[a.c],b);a.d[a.c]=_G(a.d[a.c],c);a.b-=b}else{a.d[a.c]=aH(a.d[a.c],a.b);a.d[a.c]=_G(a.d[a.c],bH(c,b-a.b));b-=a.b;++a.c;a.b=63-b;a.d[a.c]=_G(a.d[a.c],LG(c,hS.TG((1<<b)-1)))}}};mS.Nf=function Nf(a,b){a.d[a.c]=KG(a.d[a.c],b)};mS.Of=function Of(a,b){var c;for(c=0;c<a.c;c++)if($G(a.d[c],b.d[c]))return YG(a.d[c],b.d[c])?-1:1;return UG(a.d[a.c],b.d[a.c])?0:YG(a.d[a.c],b.d[a.c])?-1:1};mS.Pf=function Pf(a,b){a.a=b;a.c=0;a.b=63;CS.FO(a.d)};mS.Qf=function Qf(a){this.d=QC(hS.RD,HT,5,a,14,1)};pH(53,1,{53:1,25:1},mS.Qf);_.fb=function Rf(a){return mS.Of(this,a)};_.a=0;_.b=0;_.c=0;hS.$D=$I(53);mS.Sf=function Sf(a,b,c,d){var e,f;this.a=QC(hS.QD,$S,5,b,15,1);this.b=QC(hS.QD,$S,5,d,15,1);for(e=0;e<b;e++)this.a[e]=a[e];for(f=0;f<d;f++)this.b[f]=c[f]};pH(101,1,{101:1},mS.Sf);hS._D=$I(101);mS.Tf=function Tf(a,b,c){var d,e,f,g,h,i,j,k,l;if(b==null)return;h=0;for(e=0;e<a.i.d;e++)b[e]&&++h;l=QC(hS.QD,$S,5,h,15,1);h=0;for(d=0;d<a.i.d;d++)b[d]&&(l[h++]=d);j=false;for(g=new CS.vO(c);g.a<g.c.a.length;){f=CS.uO(g);if(f.length==l.length){i=false;for(k=0;k<f.length;k++){if(f[k]!==l[k]){i=true;break}}if(!i){j=true;break}}}j||(c.a[c.a.length]=l,true)};mS.Uf=function Uf(a,b){var c,d;for(d=0;d<a.g[b].length;d++){c=a.g[b][d];if(a.f[c]&&(a.o[c]==1||a.o[c]==2)&&a.k[c]==0)return true}return false};mS.Vf=function Vf(a,b,c){var d,e,f,g,h;e=0;g=0;for(h=0;h<a.g[b].length;h++){d=a.g[b][h];if(a.k[d]==c){f=1<<a.j[d];if((g&f)==0){g|=f;++e}}}return e};mS.Wf=function Wf(a){var b,c,d,e,f,g,h,i,j,k,l,m;k=new CS._N;for(l=0;l<a.i.d;l++){if(mS.vk(a.i,l)<2||mS.Fk(a.i,l)>2){for(g=1;g<mS.Fk(a.i,l);g++){b=mS.Ek(a.i,l,g);for(j=0;j<g;j++){c=mS.Ek(a.i,l,j);mS._f(a,b,c)&&mS.Tf(a,mS.gg(a,b,c),k)}}}}for(m=0;m<a.i.e;m++){if(a.c[m]!=0){if(mS.li(a.i,m)!=2||a.c[m]!=2)continue}b=mS.di(a.i,0,m);c=mS.di(a.i,1,m);mS._f(a,b,c)&&mS.Tf(a,mS.gg(a,b,c),k)}for(h=k.a.length-1;h>=0;h--){d=(lS.zR(h,k.a.length),k.a[h]);e=false;for(j=0;j<d.length;j++){if(a.f[d[j]]){e=true;break}}e||CS.UN(k,d)}a.g=CS.$N(k,OC(hS.QD,[FT,$S],[6,5],15,[0,0],2));CS.TO(a.g,new mS.kg);a.e=QC(hS.EG,cT,5,a.i.d,16,1);for(f=0;f<a.g.length;f++)for(i=0;i<a.g[f].length;i++)a.e[a.g[f][i]]=true};mS.Xf=function Xf(a,b,c,d){var e,f;for(f=0;f<mS.Fk(a.i,c);f++){e=mS.Ek(a.i,c,f);if(!d[e]&&mS._f(a,b,e))return e}return -1};mS.Yf=function Yf(a,b){return a.f[b]&&(a.o[b]==1||a.o[b]==2)};mS.Zf=function Zf(a,b){return a.e[b]};mS.$f=function $f(a){var b,c;c=true;for(b=0;b<a.i.d;b++){if(a.o[b]!=0&&!a.e[b]){c=false;break}}return c};mS._f=function _f(a,b,c){var d,e,f,g,h;if(b==c)return false;if(a.a[b]!==a.a[c])return false;if(a.o[b]!=0){if(a.o[b]==3||a.o[c]==3)return false;if(a.p[b]^a.o[b]!==a.o[c])return false;if(a.k[b]!==a.k[c]||a.j[b]!==a.j[c])return false}d=mS.Ck(a.i,b,c);if(d!=-1){if(mS.li(a.i,d)==1&&a.c[d]!=0)return false;if(mS.li(a.i,d)==2&&a.c[d]==2)return false}if(mS.vk(a.i,b)==1&&!mS.ml(a.i,b)){e=-1;for(h=0;h<mS.Fk(a.i,b);h++){if(mS.Ek(a.i,b,h)!=c&&mS.Hk(a.i,b,h)==2){e=mS.Gk(a.i,b,h);break}}f=-1;for(g=0;g<mS.Fk(a.i,c);g++){if(mS.Ek(a.i,c,g)!=b&&mS.Hk(a.i,c,g)==2){f=mS.Gk(a.i,c,g);break}}if(e!=-1&&a.c[e]!=0&&a.d[e]^a.c[e]===a.c[f])return false}return true};mS.ag=function ag(a,b,c,d,e){var f,g,h,i,j,k;i=null;f=null;for(k=0;k<a.g[b].length;k++){g=a.g[b][k];a.f[g]&&(a.o[g]==1||a.o[g]==2)&&(a.k[g]==0?(f=mS.ig(f,(e[g]<<16)+g)):a.k[g]==d&&a.j[g]==c&&(i=mS.ig(i,(e[g]<<16)+g)))}h=mS.Ag(i,f);if(h==0)return false;if(h<0){for(j=0;j<a.g[b].length;j++){g=a.g[b][j];if(a.f[g]&&(a.o[g]==1||a.o[g]==2)){if(a.k[g]==0){a.k[g]=d<<24>>24;a.j[g]=c<<24>>24}else if(a.k[g]==d&&a.j[g]==c){a.k[g]=0;a.j[g]=-1}}}}return true};mS.bg=function bg(a,b){var c,d,e,f,g,h;if(!a.b)return false;e=false;for(f=a.b.a.length-1;f>=0;f--){d=false;g=CS.NN(a.b,f);g.a==2?(d=mS.ag(a,g.b,g.c,g.d,b)):g.a==1&&(d=mS.fg(a,g.b,b));if(d){CS.UN(a.b,g);for(h=0;h<a.g[g.b].length;h++){c=a.g[g.b][h];a.n[c]=false}e=true}}return e};mS.cg=function cg(a){var b,c,d,e,f,g,h,i;if(a.g!=null){g=new mS.zg(a);a.b=new CS._N;for(e=0;e<a.g.length;e++){d=mS.rg(g,e);if(d==0){mS.ng(g,e);h=mS.Vf(a,e,2);b=mS.Vf(a,e,1);c=mS.Uf(a,e);if(h==1&&b==1&&!c){mS.eg(a,e,g.a+g.f++);CS.IN(a.b,new mS.Wg(e,1,-1,-1))}if(h>0){if(c){mS.dg(a,e,g.i+g.g++,2);++h}CS.IN(a.b,new mS.Wg(e,1,-1,-1))}else if(b>0){c&&mS.dg(a,e,g.a+g.f++,1);CS.IN(a.b,new mS.Wg(e,1,-1,-1))}else if(c){mS.dg(a,e,g.a+g.f++,1);CS.IN(a.b,new mS.Wg(e,1,-1,-1))}}else if(d==1){if(mS.Uf(a,e)){f=mS.qg(g,e);i=mS.sg(g,e);CS.IN(a.b,new mS.Wg(e,2,f,i))}else{mS.ng(g,e);CS.IN(a.b,new mS.Wg(e,1,-1,-1))}}}}};mS.dg=function dg(a,b,c,d){var e,f;for(f=0;f<a.g[b].length;f++){e=a.g[b][f];if(a.f[e]&&(a.o[e]==1||a.o[e]==2)&&a.k[e]==0){a.k[e]=d<<24>>24;a.j[e]=c<<24>>24}}};mS.eg=function eg(a,b,c){var d,e;for(e=0;e<a.g[b].length;e++){d=a.g[b][e];if(a.k[d]==2){a.k[d]=1;a.j[d]=c<<24>>24}}};mS.fg=function fg(a,b,c){var d,e,f,g,h,i,j,k;f=a.g[b];e=1;for(i=0;i<f.length;i++){d=f[i];if(a.f[d]&&a.k[d]==2){e=2;break}}g=QC(hS.QD,FT,6,32,0,2);for(j=0;j<f.length;j++){d=f[j];a.f[d]&&a.k[d]==e&&(g[a.j[d]]=mS.ig(g[a.j[d]],(c[d]<<16)+d))}for(k=0;k<32;k++)g[k]!=null&&CS.QO(g[k]);CS.TO(g,new mS.Bg);if(mS.Ag(g[0],g[1])==0)return false;for(h=0;h<g[0].length;h++){d=g[0][h]&VS;a.k[d]=0;a.j[d]=-1}return true};mS.gg=function gg(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v;i=QC(hS.QD,$S,5,a.i.d,15,1);s=QC(hS.QD,$S,5,a.i.d,15,1);o=QC(hS.EG,cT,5,a.i.d,16,1);p=QC(hS.EG,cT,5,a.i.d,16,1);j=QC(hS.EG,cT,5,a.i.d,16,1);i[0]=b;s[b]=c;s[c]=-2;o[b]=true;o[c]=true;f=0;k=0;while(f<=k){g=i[f];if(s[g]==g){for(l=0;l<mS.Fk(a.i,g);l++){d=mS.Ek(a.i,g,l);if(!o[d]){if(mS.Hk(a.i,g,l)==2&&mS._h(a.i,d)<10){i[++k]=d;s[d]=d;j[d]=j[g]||mS.vk(a.i,d)==2;p[d]=j[g]&&!p[g];o[d]=true}else if(j[g]&&p[g]){t=mS.Xf(a,d,s[g],o);if(t==-1)return null;i[++k]=d;s[d]=t;s[t]=-2;j[d]=false;o[d]=true;o[t]=true}else if(mS.tl(a.i,mS.Gk(a.i,g,l))){i[++k]=d;s[d]=d;j[d]=false;o[d]=true;if((mS._h(a.i,d)==6&&mS.vk(a.i,d)==0||mS._h(a.i,d)==7&&mS.Kh(a.i,d)==1||mS._h(a.i,d)==14||mS._h(a.i,d)==15&&mS.Fk(a.i,d)>2||mS._h(a.i,d)==16&&mS.Fk(a.i,d)>2)&&mS.Fk(a.i,d)>2){h=false;for(q=1;q<mS.Fk(a.i,d);q++){u=mS.Ek(a.i,d,q);if(!o[u]){for(r=0;r<q;r++){v=mS.Ek(a.i,d,r);if(!o[v]){if(mS._f(a,u,v)){i[++k]=u;s[u]=v;s[v]=-2;j[u]=false;o[u]=true;o[v]=true;h=true}}}}}if(!h)return null}}}}}else{e=QC(hS.EG,cT,5,mS.Fk(a.i,g),16,1);for(m=0;m<mS.Fk(a.i,g);m++){d=mS.Ek(a.i,g,m);if(o[d]){e[m]=s[d]==d}else{for(q=0;q<mS.Fk(a.i,d);q++){if(mS.Ek(a.i,d,q)==s[g]){e[m]=true;break}}}}for(n=0;n<mS.Fk(a.i,g);n++){if(e[n]){d=mS.Ek(a.i,g,n);if(o[d]){if(mS.Ck(a.i,d,s[g])==-1)return null}else{i[++k]=d;s[d]=d;p[d]=false;j[d]=true;o[d]=true}}}for(l=0;l<mS.Fk(a.i,g);l++){if(!e[l]){d=mS.Ek(a.i,g,l);if(!o[d]){t=mS.Xf(a,d,s[g],o);if(t==-1)return null;i[++k]=d;s[d]=t;s[t]=-2;j[d]=false;o[d]=true;o[t]=true}}}}++f}return o};mS.hg=function hg(a,b,c,d,e,f,g,h,i,j){this.i=a;this.a=b;this.f=c;this.o=d;this.c=e;this.k=f;this.j=g;this.p=h;this.d=i;this.n=j;mS.Wf(this)};mS.ig=function ig(a,b){var c,d;d=QC(hS.QD,$S,5,a==null?1:a.length+1,15,1);for(c=0;c<d.length-1;c++)d[c]=a[c];d[d.length-1]=b;return d};pH(142,1,{},mS.hg);hS.cE=$I(142);mS.jg=function jg(a,b){var c;if(a.length!=b.length)return a.length<b.length?-1:1;for(c=0;c<a.length;c++)if(a[c]!==b[c])return a[c]<b[c]?-1:1;return 0};mS.kg=function kg(){};pH(145,1,{},mS.kg);_.eb=function lg(a,b){return mS.jg(a,b)};_.ab=function mg(a){return this===a};hS.aE=$I(145);mS.ng=function ng(a,b){var c,d,e,f,g,h;for(e=0;e<a.b;e++){if(a.e[e][b]&&a.c[e]!=-3){for(d=0;d<=a.j.g.length;d++){if(d!=b&&a.e[e][d]){a.e[e][b]=false;h=e<a.a?e:e<a.b?e-a.a:-1;g=mS.xg(a,e<a.a?1:e<a.b?2:0);for(f=0;f<a.j.g[b].length;f++){c=a.j.g[b][f];mS.Yf(a.j,c)&&a.j.j[c]==h&&(a.j.j[c]=g<<24>>24)}}}}}};mS.og=function og(a,b,c){var d,e,f,g,h;h=false;g=1;b[c]=1;d=true;while(d){d=false;for(e=0;e<a.b;e++){if(b[e]==g){for(f=0;f<a.b;f++){if(b[f]==0&&mS.wg(a,e,f)){if(a.c[f]==-2){b[f]=g+1;d=true}else if(a.c[f]!==a.c[c]){b[f]=g+1;h=true}}}}}++g}return h};mS.pg=function pg(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o;for(i=d+1;i<a.j.g.length;i++){if(i!=d&&a.e[b][i]&&a.e[c][i]){g=QC(hS.QD,$S,5,2,15,1);g[0]=c;g[1]=b;return g}}o=QC(hS.QD,$S,5,a.b,15,1);k=QC(hS.QD,$S,5,a.b,15,1);j=QC(hS.QD,$S,5,a.b,15,1);f=0;l=0;j[0]=b;k[b]=1;while(f<=l){for(m=0;m<a.d[j[f]].length;m++){e=a.d[j[f]][m];if(e==c){if(f==0)continue;h=k[j[f]]+1;g=QC(hS.QD,$S,5,h,15,1);g[0]=e;g[1]=j[f];for(n=2;n<h;n++)g[n]=o[g[n-1]];return g}if(k[e]==0&&a.c[e]!=-3){k[e]=k[j[f]]+1;j[++l]=e;o[e]=j[f]}}++f}return null};mS.qg=function qg(a,b){var c;for(c=0;c<a.b;c++)if(a.e[c][b]&&a.c[c]==-3)return c<a.a?c:c<a.b?c-a.a:-1;return -1};mS.rg=function rg(a,b){var c,d;c=0;for(d=0;d<a.b;d++)a.e[d][b]&&a.c[d]==-3&&++c;return c};mS.sg=function sg(a,b){var c;for(c=0;c<a.b;c++)if(a.e[c][b]&&a.c[c]==-3)return c<a.a?1:c<a.b?2:0;return -1};mS.tg=function tg(a,b){return b<a.a?b:b<a.b?b-a.a:-1};mS.ug=function ug(a,b){return b<a.a?1:b<a.b?2:0};mS.vg=function vg(a,b){var c,d;d=a.j.k[b];c=a.j.j[b];return d==0?a.b:d==1?c:a.a+c};mS.wg=function wg(a,b,c){var d;for(d=0;d<a.j.g.length;d++)if(a.e[b][d]&&a.e[c][d])return true;return false};mS.xg=function xg(a,b){return b==1?a.a+a.f++:a.i+a.g++};mS.yg=function yg(a,b){var c,d,e,f,g,h,i,j,k,l;k=MS;i=-1;l=-1;j=-1;for(d=0;d<a.j.i.d;d++){if(mS.Yf(a.j,d)&&a.j.k[d]!=0){for(h=0;h<b.length;h++){e=mS.tg(a,b[h]);f=mS.ug(a,b[h]);if(a.j.k[d]==f&&a.j.j[d]==e){if(k>a.j.a[d]+(f==1?US:0)){k=a.j.a[d]+(f==1?US:0);i=e;l=f;j=b[h]}}}}}for(c=0;c<a.j.i.d;c++){if(mS.Yf(a.j,c)&&a.j.k[c]==l&&a.j.j[c]==i){a.j.k[c]=0;a.j.j[c]=-1}}for(g=0;g<a.j.g.length;g++)a.e[j][g]=false};mS.zg=function zg(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q;this.j=a;for(d=0;d<a.i.d;d++){a.f[d]&&(a.o[d]==1||a.o[d]==2)&&(a.k[d]==1?this.a<=a.j[d]&&(this.a=1+a.j[d]):a.k[d]==2&&this.i<=a.j[d]&&(this.i=1+a.j[d]))}this.b=this.a+this.i;this.e=OC(hS.EG,[HS,cT],[11,5],16,[this.b+1,a.g.length+1],2);for(e=0;e<a.i.d;e++)a.f[e]&&(a.o[e]==1||a.o[e]==2)&&!a.e[e]&&(this.e[mS.vg(this,e)][a.g.length]=true);for(i=0;i<a.g.length;i++){for(q=0;q<a.g[i].length;q++){c=a.g[i][q];a.f[c]&&(a.o[c]==1||a.o[c]==2)&&(this.e[mS.vg(this,c)][i]=true)}}this.d=QC(hS.QD,FT,6,this.b,0,2);for(j=0;j<a.g.length;j++){for(n=1;n<this.b;n++){if(this.e[n][j]){for(o=0;o<n;o++){if(this.e[o][j]){this.d[n]=mS.ig(this.d[n],o);this.d[o]=mS.ig(this.d[o],n)}}}}}this.c=QC(hS.QD,$S,5,this.b+1,15,1);for(m=0;m<this.b;m++){this.e[m][a.g.length]?(this.c[m]=-1):(this.c[m]=-2)}for(k=0;k<a.g.length;k++){if(this.e[this.b][k]){for(l=0;l<this.b;l++){this.e[l][k]&&this.c[l]!=k&&(this.c[l]==-2?(this.c[l]=k):(this.c[l]=-3))}}}for(b=0;b<this.b;b++){if(this.c[b]>=-1){f=QC(hS.QD,$S,5,this.b,15,1);if(mS.og(this,f,b)){for(l=0;l<this.b;l++){f[l]!=0&&(this.c[l]=-3)}}}}for(h=0;h<a.g.length-1;h++){for(n=1;n<this.b;n++){if(this.e[n][h]&&this.c[n]!=-3){for(o=0;o<n;o++){if(this.e[o][h]&&this.c[o]!=-3){g=mS.pg(this,n,o,h);if(g!=null){for(p=0;p<g.length;p++)this.c[g[p]]=-3;mS.yg(this,g);break}}}}}}};pH(143,1,{},mS.zg);_.a=0;_.b=0;_.f=0;_.g=0;_.i=0;hS.bE=$I(143);mS.Ag=function Ag(a,b){var c,d;if(a==null)return b==null?0:1;if(b==null)return -1;c=iS.dK(a.length,b.length);for(d=0;d<c;d++)if((a[d]&MT)!=(b[d]&MT))return (a[d]&MT)<(b[d]&MT)?-1:1;return a.length==b.length?0:a.length<b.length?-1:1};mS.Bg=function Bg(){};pH(144,1,{},mS.Bg);_.eb=function Cg(a,b){return mS.Ag(a,b)};_.ab=function Dg(a){return this===a};hS.dE=$I(144);mS.Eg=function Eg(a,b){if(a.a!=b.a)return a.a<b.a?-1:1;if(a.b!=b.b)return a.b<b.b?-1:1;if(a.c!=b.c)return a.c<b.c?-1:1;return 0};mS.Fg=function Fg(a,b){return $wnd.Math.sqrt((b.a-a.a)*(b.a-a.a)+(b.b-a.b)*(b.b-a.b)+(b.c-a.c)*(b.c-a.c))};mS.Gg=function Gg(a,b,c,d){a.a=b;a.b=c;a.c=d};mS.Hg=function Hg(a,b){mS.Gg(a,b.a,b.b,b.c);return a};mS.Ig=function Ig(){};mS.Jg=function Jg(a,b,c){this.a=a;this.b=b;this.c=c};pH(35,1,{35:1,4:1,25:1},mS.Ig,mS.Jg);_.fb=function Kg(a){return mS.Eg(this,a)};_.ab=function Lg(a){var b;if(a==null||!CD(a,35))return false;b=a;return $wnd.Math.abs(b.a-this.a)+$wnd.Math.abs(b.b-this.b)+$wnd.Math.abs(b.c-this.c)<1.0E-6};_.db=function Mg(){var a;a=new BS.hL('0.00');return '['+BS.gL(a,this.a)+', '+BS.gL(a,this.b)+', '+BS.gL(a,this.c)+']'};_.a=0;_.b=0;_.c=0;hS.fE=$I(35);mS.Ng=function Ng(a,b){b.c*=a.c;b.a=b.a*a.c+a.a;b.b=b.b*a.c+a.b};mS.Og=function Og(a,b){b.a=b.a*a.c+a.a;b.b=b.b*a.c+a.b};mS.Pg=function Pg(a,b){b.c=b.c*a.c+a.a;b.d=b.d*a.c+a.b;b.b*=a.c;b.a*=a.c};mS.Qg=function Qg(a){a.a=0;a.b=0;a.c=1};mS.Rg=function Rg(a,b){return b*a.c+a.a};mS.Sg=function Sg(a,b){return b*a.c+a.b};mS.Tg=function Tg(){mS.Qg(this)};mS.Ug=function Ug(a,b,c){var d,e,f,g;mS.Qg(this);e=b.b/a.b;g=b.a/a.a;f=0;f==0&&(f=24);d=f/c;this.c=$wnd.Math.min(d,$wnd.Math.min(e,g));this.a=b.c+b.b/2-this.c*(a.c+a.b/2);this.b=b.d+b.a/2-this.c*(a.d+a.a/2)};pH(76,1,{},mS.Tg,mS.Ug);_.db=function Vg(){return 'DepictorTransformation Offset: '+this.a+','+this.b+' Scaling: '+this.c};_.a=0;_.b=0;_.c=0;hS.gE=$I(76);mS.Wg=function Wg(a,b,c,d){this.b=a;this.a=b;this.c=c;this.d=d};pH(43,1,{43:1},mS.Wg);_.a=0;_.b=0;_.c=0;_.d=0;hS.hE=$I(43);mS.Xg=function Xg(a){var b,c,d,e,f,g;if(a.j!=0)return a.j;if(a.i&&mS._h(a.e,a.a)!=15&&mS._h(a.e,a.a)!=16){for(g=0;g<mS.rk(a.e,a.a);g++){f=mS.Gk(a.e,a.a,g);if(mS.Ui(a.e,f,a.a)){mS.Ek(a.e,a.a,g)==a.b?(a.j=mS.oi(a.e,f)==17?3:1):(a.j=mS.oi(a.e,f)==17?1:3);return a.j}}}b=mS.ci(a.e,a.a,a.g);d=mS.ci(a.e,a.a,a.b);d<b&&(d+=gT);if(mS.rk(a.e,a.a)==2){c=d-b;if(c>3.0915926535897933&&c<3.191592653589793){a.j=-1;return a.j}a.j=c<hT?4:2;return a.j}else{e=mS.ci(a.e,a.a,a.d);e<b&&(e+=gT);a.j=e<d?2:4;return a.j}};mS.Yg=function Yg(a,b,c,d){var e,f,g,h;this.e=a;this.g=c;this.a=d;g=-1;for(h=0;h<mS.rk(this.e,this.a);h++){e=mS.Ek(this.e,this.a,h);f=mS.Gk(this.e,this.a,h);if(e==this.g){mS.oi(this.e,f)==26&&(this.j=-1);continue}if(mS.Ui(this.e,f,this.a)){this.i&&(a.s[d]|=KT);this.i=true}if(g==b[e]){this.d=e;this.f=true;this.c=mS.tl(this.e,f);continue}else if(g<b[e]){g=b[e];this.d=this.b;this.b=e}else{this.d=e}}};pH(48,1,{},mS.Yg);_.a=0;_.b=0;_.c=false;_.d=0;_.f=false;_.g=0;_.i=false;_.j=0;hS.iE=$I(48);mS.dh=function dh(){mS.dh=rH;mS.Zg=YC(KC(hS.OF,1),NT,2,6,['?','H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca','Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn','Ga','Ge','As','Se','Br','Kr','Rb','Sr','Y','Zr','Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn','Sb','Te','I','Xe','Cs','Ba','La','Ce','Pr','Nd','Pm','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb','Lu','Hf','Ta','W','Re','Os','Ir','Pt','Au','Hg','Tl','Pb','Bi','Po','At','Rn','Fr','Ra','Ac','Th','Pa','U','Np','Pu','Am','Cm','Bk','Cf','Es','Fm','Md','No','Lr',OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,'R4','R5','R6','R7','R8','R9','R10','R11','R12','R13','R14','R15','R16','R1','R2','R3','A','A1','A2','A3',OT,OT,'D','T','X','R','H2','H+','Nnn','HYD','Pol',OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,'Ala','Arg','Asn','Asp','Cys','Gln','Glu','Gly','His','Ile','Leu','Lys','Met','Phe','Pro','Ser','Thr','Trp','Tyr','Val']);mS.ah=YC(KC(hS.DG,1),HT,5,15,[0,1,4,7,9,11,12,14,16,19,20,23,24,27,28,31,32,35,40,39,40,45,48,51,52,55,56,59,58,63,64,69,74,75,80,79,84,85,88,89,90,93,98,0,102,103,106,107,114,115,120,121,130,127,132,133,138,139,140,141,142,0,152,153,158,159,164,165,166,169,174,175,180,181,184,187,192,193,195,197,202,205,208,209,0,0,0,0,0,0,232,0,238,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,71,156,114,115,103,128,129,57,137,113,113,128,131,147,97,87,101,186,163,99]);mS.$g=YC(KC(hS.MD,2),PT,8,0,[null,YC(KC(hS.MD,1),JT,5,15,[1]),YC(KC(hS.MD,1),JT,5,15,[0]),YC(KC(hS.MD,1),JT,5,15,[1]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[4]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[1]),YC(KC(hS.MD,1),JT,5,15,[0]),YC(KC(hS.MD,1),JT,5,15,[1]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[4]),YC(KC(hS.MD,1),JT,5,15,[3,5]),YC(KC(hS.MD,1),JT,5,15,[2,4,6]),YC(KC(hS.MD,1),JT,5,15,[1,3,5,7]),YC(KC(hS.MD,1),JT,5,15,[0]),YC(KC(hS.MD,1),JT,5,15,[1]),YC(KC(hS.MD,1),JT,5,15,[2]),null,null,null,null,null,null,null,null,null,null,YC(KC(hS.MD,1),JT,5,15,[2,3]),YC(KC(hS.MD,1),JT,5,15,[2,4]),YC(KC(hS.MD,1),JT,5,15,[3,5]),YC(KC(hS.MD,1),JT,5,15,[2,4,6]),YC(KC(hS.MD,1),JT,5,15,[1,3,5,7]),YC(KC(hS.MD,1),JT,5,15,[0,2]),YC(KC(hS.MD,1),JT,5,15,[1,2,3,4]),YC(KC(hS.MD,1),JT,5,15,[2]),null,null,null,null,null,null,null,null,null,null,YC(KC(hS.MD,1),JT,5,15,[1,2,3]),YC(KC(hS.MD,1),JT,5,15,[2,4]),YC(KC(hS.MD,1),JT,5,15,[3,5]),YC(KC(hS.MD,1),JT,5,15,[2,4,6]),YC(KC(hS.MD,1),JT,5,15,[1,3,5,7]),YC(KC(hS.MD,1),JT,5,15,[0,2,4,6]),YC(KC(hS.MD,1),JT,5,15,[1]),YC(KC(hS.MD,1),JT,5,15,[2]),null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[2])]);mS._g=YC(KC(hS.MD,2),PT,8,0,[null,YC(KC(hS.MD,1),JT,5,15,[1]),null,YC(KC(hS.MD,1),JT,5,15,[1]),YC(KC(hS.MD,1),JT,5,15,[2]),null,null,YC(KC(hS.MD,1),JT,5,15,[-3]),YC(KC(hS.MD,1),JT,5,15,[-2]),YC(KC(hS.MD,1),JT,5,15,[-1]),null,YC(KC(hS.MD,1),JT,5,15,[1]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[3]),null,YC(KC(hS.MD,1),JT,5,15,[-3]),YC(KC(hS.MD,1),JT,5,15,[-2]),YC(KC(hS.MD,1),JT,5,15,[-1]),null,YC(KC(hS.MD,1),JT,5,15,[1]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[2,3,4]),YC(KC(hS.MD,1),JT,5,15,[2,3,4,5]),YC(KC(hS.MD,1),JT,5,15,[2,3,6]),YC(KC(hS.MD,1),JT,5,15,[2,3,4,7]),YC(KC(hS.MD,1),JT,5,15,[2,3]),YC(KC(hS.MD,1),JT,5,15,[2,3]),YC(KC(hS.MD,1),JT,5,15,[2,3]),YC(KC(hS.MD,1),JT,5,15,[1,2]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[2,4]),YC(KC(hS.MD,1),JT,5,15,[-3,3,5]),YC(KC(hS.MD,1),JT,5,15,[-2]),YC(KC(hS.MD,1),JT,5,15,[-1]),null,YC(KC(hS.MD,1),JT,5,15,[1]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[4]),YC(KC(hS.MD,1),JT,5,15,[3,5]),YC(KC(hS.MD,1),JT,5,15,[6]),YC(KC(hS.MD,1),JT,5,15,[4,6,7]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[2,4]),YC(KC(hS.MD,1),JT,5,15,[1]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[2,4]),YC(KC(hS.MD,1),JT,5,15,[-3,3,5]),YC(KC(hS.MD,1),JT,5,15,[-2,4,6]),YC(KC(hS.MD,1),JT,5,15,[-1]),null,YC(KC(hS.MD,1),JT,5,15,[1]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[3,4]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[2,3]),YC(KC(hS.MD,1),JT,5,15,[2,3]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[2,3]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[4]),YC(KC(hS.MD,1),JT,5,15,[5]),YC(KC(hS.MD,1),JT,5,15,[6]),YC(KC(hS.MD,1),JT,5,15,[4,6,7]),YC(KC(hS.MD,1),JT,5,15,[3,4]),YC(KC(hS.MD,1),JT,5,15,[3,4]),YC(KC(hS.MD,1),JT,5,15,[2,4]),YC(KC(hS.MD,1),JT,5,15,[1,3]),YC(KC(hS.MD,1),JT,5,15,[1,2]),YC(KC(hS.MD,1),JT,5,15,[1,3]),YC(KC(hS.MD,1),JT,5,15,[2,4]),YC(KC(hS.MD,1),JT,5,15,[3,5]),YC(KC(hS.MD,1),JT,5,15,[-2,2,4]),YC(KC(hS.MD,1),JT,5,15,[-1,1]),null,YC(KC(hS.MD,1),JT,5,15,[1]),YC(KC(hS.MD,1),JT,5,15,[2]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[4]),YC(KC(hS.MD,1),JT,5,15,[4,5]),YC(KC(hS.MD,1),JT,5,15,[3,4,5,6]),YC(KC(hS.MD,1),JT,5,15,[3,4,5,6]),YC(KC(hS.MD,1),JT,5,15,[3,4,5,6]),YC(KC(hS.MD,1),JT,5,15,[3,4,5,6]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[3,4]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[3]),YC(KC(hS.MD,1),JT,5,15,[2,3]),YC(KC(hS.MD,1),JT,5,15,[2,3]),YC(KC(hS.MD,1),JT,5,15,[3])])};mS.eh=function eh(a,b,c,d){var e;e=mS.fh(a,6);mS.Gg(a.H[e],b,c,d);return e};mS.fh=function fh(a,b){a.o>=a.K&&mS.Pj(a,a.K*2);a.A[a.o]=0;mS.Bj(a,a.o,b);a.q[a.o]=0;a.s[a.o]=0;a.w[a.o]=0;a.u[a.o]=0;mS.Gg(a.H[a.o],0,0,0);a.t!=null&&(a.t[a.o]=null);a.r!=null&&(a.r[a.o]=null);a.Q=0;return a.o++};mS.gh=function gh(a,b,c){var d,e;return mS.hh(a,b,c,(e=a.A[b],e>=3&&e<=4||e>=11&&e<=13||e>=19&&e<=31||e>=37&&e<=51||e>=55&&e<=84||e>=87&&e<=103||(d=a.A[c],d>=3&&d<=4||d>=11&&d<=13||d>=19&&d<=31||d>=37&&d<=51||d>=55&&d<=84||d>=87&&d<=103)?32:1))};mS.hh=function hh(a,b,c,d){var e;if(b==c)return -1;for(e=0;e<a.p;e++){if(a.B[0][e]==b&&a.B[1][e]==c||a.B[0][e]==c&&a.B[1][e]==b){a.F[e]<d&&(a.F[e]=d);return e}}a.p>=a.L&&mS.Qj(a,a.L*2);a.B[0][a.p]=b;a.B[1][a.p]=c;a.F[a.p]=d;a.C[a.p]=0;a.D[a.p]=0;a.Q=0;return a.p++};mS.ih=function ih(a,b){var c,d,e,f,g;a.I=a.I|b.I;d=QC(hS.QD,$S,5,b.o,15,1);f=mS.cj(a,1);g=mS.cj(a,2);for(c=0;c<b.o;c++){d[c]=mS.uh(b,a,c,f,g)}for(e=0;e<b.p;e++){mS.vh(b,a,e,f,g,d,false)}a.J=a.J&&b.J;a.G=0;a.Q=0;return d};mS.jh=function jh(a,b,c,d,e,f,g){var h;h=mS.Gh(a,b,c);if(h==-1){a.o>=a.K&&mS.Pj(a,a.K*2);h=mS.fh(a,d);mS.Gg(a.H[h],b,c,0);a.v[h]=e;mS.gj(a,h,f);mS.vj(a,h,g);return true}return mS.qh(a,h,d,e,f,g)};mS.kh=function kh(a,b,c,d){var e;for(e=0;e<a.p;e++){if(a.B[0][e]==b&&a.B[1][e]==c||a.B[0][e]==c&&a.B[1][e]==b){mS.sh(a,e,d);a.Q=0;return e}}a.p>=a.L&&mS.Qj(a,a.L*2);a.B[0][a.p]=b;a.B[1][a.p]=c;a.F[a.p]=d;a.C[a.p]=0;a.D[a.p]=0;a.Q=0;return a.p++};mS.lh=function lh(a,b,c,d,e){var f,g,h;while(a.o+d>a.K)mS.Pj(a,a.K*2);while(a.p+d>a.L)mS.Qj(a,a.L*2);f=mS.Gh(a,b,c);if(f!=-1)return mS.mh(a,f,d,e);g=mS.Hh(a,b,c);if(g!=-1)return mS.nh(a,g,d,e);f=mS.eh(a,b,c,0);h=hT*(d-2)/d;mS.Xi(a,f,d,f,e,0,hT-h);a.Q=0;return true};mS.mh=function mh(a,b,c,d){var e,f,g,h,i,j;if(d&&mS.Wk(a,b)>1||!d&&mS.Wk(a,b)>2)return false;f=0;e=QC(hS.OD,bT,5,4,15,1);for(h=0;h<a.p;h++){for(i=0;i<2;i++){if(a.B[i][h]==b){if(f==2){f=3;break}e[f++]=mS.ci(a,b,a.B[1-i][h])}}if(f==3)break}if(f==3)return false;j=f==1?e[0]+hT:$wnd.Math.abs(e[0]-e[1])>hT?(e[0]+e[1])/2:(e[0]+e[1])/2+hT;g=hT*(c-2)/c;mS.Xi(a,b,c,b,d,j-g/2,hT-g);a.Q=0;return true};mS.nh=function nh(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o;i=QC(hS.QD,$S,5,2,15,1);h=QC(hS.OD,bT,5,2,15,1);i[0]=a.B[0][b];i[1]=a.B[1][b];if(mS.Wk(a,i[0])>3)return false;if(mS.Wk(a,i[1])>3)return false;f=0;e=QC(hS.OD,bT,5,4,15,1);for(l=0;l<a.p;l++){if(l==b)continue;for(m=0;m<2;m++){for(n=0;n<2;n++){if(a.B[m][l]===i[n]){if(f==4){f=5;break}e[f++]=mS.ci(a,i[n],a.B[1-m][l])}}if(f==5)break}if(f==5)break}if(f==5)return false;h[0]=mS.ci(a,i[0],i[1]);if(h[0]<0){h[1]=h[0]+hT;g=0}else{h[1]=h[0];h[0]=h[1]-hT;g=1}o=0;for(k=0;k<f;k++){e[k]>h[0]&&e[k]<h[1]?--o:++o}g=o>0?1-g:g;j=hT*(c-2)/c;mS.Xi(a,i[g],c-1,i[1-g],d,h[o>0?0:1]+hT-j,hT-j);a.Q=0;return true};mS.oh=function oh(a,b,c){var d,e,f,g,h;e=QC(hS.QD,$S,5,b.o,15,1);g=mS.cj(a,1);h=mS.cj(a,2);for(d=0;d<b.o;d++){b.A[d]!=0?(e[d]=mS.uh(b,a,d,g,h)):(e[d]=c)}for(f=0;f<b.p;f++){mS.vh(b,a,f,g,h,e,false)}a.J=a.J&&b.J;a.G=0;a.Q=0;return e};mS.ph=function ph(a,b){var c,d,e,f,g,h,i,j,k;c=a.H[b[0]];d=a.H[b[1]];e=a.H[b[2]];f=a.H[b[3]];i=new mS.Jg(d.a-c.a,d.b-c.b,d.c-c.c);j=new mS.Jg(e.a-d.a,e.b-d.b,e.c-d.c);k=new mS.Jg(f.a-e.a,f.b-e.b,f.c-e.c);g=new mS.Jg(i.b*j.c-i.c*j.b,-(i.a*j.c-i.c*j.a),i.a*j.b-i.b*j.a);h=new mS.Jg(j.b*k.c-j.c*k.b,-(j.a*k.c-j.c*k.a),j.a*k.b-j.b*k.a);return -$wnd.Math.atan2($wnd.Math.sqrt(j.a*j.a+j.b*j.b+j.c*j.c)*(i.a*h.a+i.b*h.b+i.c*h.c),g.a*h.a+g.b*h.b+g.c*h.c)};mS.qh=function qh(a,b,c,d,e,f){if((c==1||c==151||c==152)&&mS.Wk(a,b)>1)return false;a.w[b]&=-2;a.t!=null&&(a.t[b]=null);a.r!=null&&(a.r[b]=null);if(c==a.A[b]&&d==a.v[b]&&e==((a.s[b]&QT)>>>28)-1&&f==(a.s[b]&48))return false;if(c==151||c==152){d=c-149;c=1}a.s[b]&=960;a.A[b]=c;a.v[b]=d;a.q[b]=0;a.w[b]=0;mS.gj(a,b,e);mS.vj(a,b,f);mS.bj(a,a.u[b]);a.Q=0;return true};mS.rh=function rh(a,b,c){if(c){if(a.q[b]>8)return false;++a.q[b]}else{if(a.q[b]<-8)return false;--a.q[b]}a.Q=0;return true};mS.sh=function sh(a,b,c){var d,e,f,g,h;f=false;g=a.F[b];if(c==127){f=mS.wi(a,b)}else if(mS.Ml(a,b,c)){if(c==17||c==9){d=mS.Yi(a,b,a.B[0][b]);e=mS.Yi(a,b,a.B[1][b]);if(c==g){if(d==e||e){h=a.B[0][b];a.B[0][b]=a.B[1][b];a.B[1][b]=h;f=true}}else{if(!d&&e){h=a.B[0][b];a.B[0][b]=a.B[1][b];a.B[1][b]=h}a.F[b]=c;f=true}}else{a.F[b]=c;f=true}}if(f){a.Q=(g&103)==(c&103)?a.Q&3:0;a.D[b]=0}return f};mS.th=function th(a){var b,c,d,e,f,g,h,i;for(g=0;g<a.p;g++){if(a.F[g]==128){c=a.B[0][g];d=a.B[1][g];if(a.A[c]==-1^a.A[d]==-1){if(a.q[c]!=0&&a.q[d]!=0){if(a.q[c]<0^a.q[d]<0){if(a.q[c]<0){++a.q[c];--a.q[d]}else{--a.q[c];++a.q[d]}}}}}}i=QC(hS.QD,$S,5,a.o,15,1);e=0;for(b=0;b<a.o;b++){if(a.A[b]==-1){i[b]=-1;continue}if(e<b){a.A[e]=a.A[b];a.q[e]=a.q[b];a.v[e]=a.v[b];a.s[e]=a.s[b];a.w[e]=a.w[b];a.u[e]=a.u[b];mS.Hg(a.H[e],a.H[b]);a.t!=null&&(a.t[e]=a.t[b]);a.r!=null&&(a.r[e]=a.r[b])}i[b]=e;++e}a.o=e;h=0;for(f=0;f<a.p;f++){if(a.F[f]==128)continue;a.F[h]=a.F[f];a.C[h]=a.C[f];a.D[h]=a.D[f];a.B[0][h]=i[a.B[0][f]];a.B[1][h]=i[a.B[1][f]];++h}a.p=h;return i};mS.uh=function uh(a,b,c,d,e){var f,g,h,i;f=b.o;f>=b.K&&mS.Pj(b,b.K*2);h=(a.s[c]&zT)>>19;g=-1;h==1?d==-1?(g=mS.cj(b,1)):(g=iS.dK(32,d+((a.s[c]&zT)>>19!=1&&(a.s[c]&zT)>>19!=2?-1:(a.s[c]&RT)>>21))):h==2&&(e==-1?(g=mS.cj(b,2)):(g=iS.dK(32,e+((a.s[c]&zT)>>19!=1&&(a.s[c]&zT)>>19!=2?-1:(a.s[c]&RT)>>21))));b.A[f]=a.A[c];b.q[f]=a.q[c];b.v[f]=a.v[c];b.s[f]=a.s[c];b.w[f]=b.I?a.w[c]:0;mS.Hg(b.H[f],a.H[c]);b.u[f]=a.u[c];b.t!=null&&(b.t[f]=null);if(a.t!=null&&a.t[c]!=null&&b.I){b.t==null&&(b.t=QC(hS.QD,FT,6,b.A.length,0,2));b.t[f]=QC(hS.QD,$S,5,a.t[c].length,15,1);for(i=0;i<a.t[c].length;i++)b.t[f][i]=a.t[c][i]}b.r!=null&&(b.r[f]=null);if(a.r!=null&&a.r[c]!=null){b.r==null&&(b.r=QC(hS.MD,PT,8,b.A.length,0,2));b.r[f]=QC(hS.MD,JT,5,a.r[c].length,15,1);for(i=0;i<a.r[c].length;i++)b.r[f][i]=a.r[c][i]}if(g!=-1){b.s[f]&=-65011713;b.s[f]|=g<<21}++b.o;b.Q=0;return f};
mS.vh=function vh(a,b,c,d,e,f,g){var h,i,j,k,l;i=b.p;i>=b.L&&mS.Qj(b,b.L*2);k=(a.C[c]&ST)>>10;j=-1;k==1&&(d==-1?(j=mS.cj(b,1)):(j=iS.dK(32,d+((a.C[c]&ST)>>10!=1&&(a.C[c]&ST)>>10!=2?-1:(a.C[c]&TT)>>12))));k==2&&(e==-1?(j=mS.cj(b,2)):(j=iS.dK(32,e+((a.C[c]&ST)>>10!=1&&(a.C[c]&ST)>>10!=2?-1:(a.C[c]&TT)>>12))));for(l=0;l<2;l++)b.B[l][i]=f==null?a.B[l][c]:f[a.B[l][c]];h=g&&(a.C[c]&512)!=0?64:a.F[c];b.F[i]=h;b.C[i]=a.C[c];b.D[i]=b.I?a.D[c]:0;if(j!=-1){b.C[i]&=-126977;b.C[i]|=j<<12}++b.p;b.Q=0;return i};mS.wh=function wh(a,b){var c,d;b.t=null;b.r=null;b.I=a.I;b.o=0;for(c=0;c<a.o;c++)mS.uh(a,b,c,0,0);b.p=0;for(d=0;d<a.p;d++)mS.vh(a,b,d,0,0,null,false);mS.xh(a,b);!!a.b&&(b.Q=0)};mS.xh=function xh(a,b){b.I=a.I;b.J=a.J;b.P=a.P;b.G=a.G;b.M=a.M==null?null:lS.GR(a.M);b.Q=a.Q&12};mS.yh=function yh(a,b){var c,d,e,f;for(c=0;c<a.p;c++){for(e=0;e<2;e++){if(a.B[e][c]==b){a.F[c]=128;d=0;for(f=0;f<a.p;f++){if(f==c)continue;(a.B[0][f]===a.B[1-e][c]||a.B[1][f]===a.B[1-e][c])&&++d}if(d==0){mS.bj(a,a.u[a.B[1-e][c]]);a.A[a.B[1-e][c]]=-1}}}}mS.bj(a,a.u[b]);a.A[b]=-1;a.t!=null&&(a.t[b]=null);a.r!=null&&(a.r[b]=null);mS.th(a);a.Q=0};mS.zh=function zh(a,b,c){var d,e;d=mS.Gh(a,b,c);if(d!=-1){(a.s[d]&512)!=0?mS.Fh(a):mS.yh(a,d);a.Q=0;return true}e=mS.Hh(a,b,c);if(e!=-1){(a.s[a.B[0][e]]&a.s[a.B[1][e]]&512)!=0?mS.Fh(a):mS.Ch(a,e);a.Q=0;return true}return false};mS.Ah=function Ah(a,b){var c;if(b.length==0)return null;for(c=0;c<b.length;c++)mS.Vi(a,b[c]);return mS.Dh(a)};mS.Bh=function Bh(a,b){a.F[b]=128;mS.th(a);a.Q=0};mS.Ch=function Ch(a,b){var c,d,e;for(d=0;d<2;d++){c=0;for(e=0;e<a.p;e++){if(e==b)continue;(a.B[0][e]===a.B[d][b]||a.B[1][e]===a.B[d][b])&&++c}if(c==0){mS.bj(a,a.u[a.B[d][b]]);a.A[a.B[d][b]]=-1}}a.F[b]=128;mS.th(a);a.Q=0};mS.Dh=function Dh(a){var b,c,d;d=false;for(b=0;b<a.o;b++){if(a.A[b]==-1){d=true;mS.bj(a,a.u[b])}}for(c=0;c<a.p;c++){if(a.F[c]==128){d=true}else if(a.A[a.B[0][c]]==-1||a.A[a.B[1][c]]==-1){a.F[c]=128;d=true}}if(d){a.Q=0;return mS.th(a)}return null};mS.Eh=function Eh(a){a.o=0;a.p=0;a.I=false;a.J=false;a.G=0;a.t=null;a.r=null;a.M=null;a.Q=0};mS.Fh=function Fh(a){var b,c;c=false;for(b=0;b<a.o;b++){if((a.s[b]&512)!=0){a.A[b]=-1;c=true}}return c&&mS.Dh(a)!=null};mS.Gh=function Gh(a,b,c){var d,e,f,g,h,i,j,k;g=-1;e=mS.bi(a,a.o,a.p,mS.bh);h=UT;i=e*e/12;for(d=0;d<a.o;d++){j=a.H[d].a;k=a.H[d].b;f=(b-j)*(b-j)+(c-k)*(c-k);if(f<i&&f<h){h=f;g=d}}return g};mS.Hh=function Hh(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s;m=-1;o=mS.bi(a,a.o,a.p,mS.bh);n=UT;for(d=0;d<a.p;d++){p=a.H[a.B[0][d]].a;r=a.H[a.B[0][d]].b;q=a.H[a.B[1][d]].a;s=a.H[a.B[1][d]].b;k=q-p;l=s-r;e=$wnd.Math.sqrt(k*k+l*l);f=(p+q)/2;g=(r+s)/2;k=b-f;l=c-g;if($wnd.Math.sqrt(k*k+l*l)>e/2)continue;if(q==p)j=$wnd.Math.abs(p-b);else{h=(s-r)/(p-q);i=-h*p-r;j=$wnd.Math.abs((h*b+c+i)/$wnd.Math.sqrt(h*h+1))}if(j<o&&j<n){n=j;m=d}}return m};mS.Ih=function Ih(a,b){return ((a.s[b]&QT)>>>28)-1};mS.Jh=function Jh(a,b){return (a.s[b]&98304)>>15};mS.Kh=function Kh(a,b){return a.q[b]};mS.Lh=function Lh(a,b){return a.s[b]&448};mS.Mh=function Mh(a,b){return a.r==null?null:a.r[b]==null?null:iS.tK(a.r[b])};mS.Nh=function Nh(a,b){return a.r==null?null:a.r[b]};mS.Oh=function Oh(a,b){return (a.s[b]&zT)>>19!=1&&(a.s[b]&zT)>>19!=2?-1:(a.s[b]&RT)>>21};mS.Ph=function Ph(a,b){return (a.s[b]&zT)>>19};mS.Qh=function Qh(a,b){return mS.Zg[a.A[b]]};mS.Rh=function Rh(a,b){return a.t==null?null:a.t[b]};mS.Sh=function Sh(a,b){var c,d,e;if(a.t==null||a.t[b]==null)return (a.w[b]&1)!=0?'':mS.Zg[a.A[b]];e='';for(d=0;d<a.t[b].length;d++){d>0&&(e=(lS.AR(e),e+(lS.AR(','),',')));c=a.t[b][d];e=iS.sK(e,mS.Zg[c])}return e};mS.Th=function Th(a,b){return iS.bK(a.u[b])};mS.Uh=function Uh(a,b){return a.v[b]};mS.Vh=function Vh(a,b){return a.s[b]&3};mS.Wh=function Wh(a,b){return a.w[b]};mS.Xh=function Xh(a,b){return a.s[b]&48};mS.Yh=function Yh(a,b){return a.H[b].a};mS.Zh=function Zh(a,b){return a.H[b].b};mS.$h=function $h(a,b){return a.H[b].c};mS._h=function _h(a,b){return a.A[b]};mS.ai=function ai(a){return mS.bi(a,a.o,a.p,mS.bh)};mS.bi=function bi(a,b,c,d){var e,f,g,h,i,j,k,l,m;j=false;k=0;while(k==0&&!j){for(i=0;i<c;i++)(j||a.F[i]!=32)&&(a.D[i]&yT)==0&&++k;k==0&&(j=true)}if(k==0){if(b<2)return d;m=UT;for(e=1;e<b;e++){for(f=0;f<e;f++){l=mS.Fg(a.H[e],a.H[f]);l>0&&l<m&&(m=l)}}return m!=UT?0.6*m:d}g=0;for(h=0;h<c;h++){(j||a.F[h]!=32)&&(a.D[h]&yT)==0&&(g+=mS.Fg(a.H[a.B[1][h]],a.H[a.B[0][h]]))}return g/k};mS.ci=function ci(a,b,c){return mS.ak(a.H[b].a,a.H[b].b,a.H[c].a,a.H[c].b)};mS.di=function di(a,b,c){return a.B[b][c]};mS.ei=function ei(a,b){return ((a.D[b]&lT)>>7)+((a.D[b]&30720)>>11)};mS.fi=function fi(a,b){return (a.D[b]&lT)>>7};mS.gi=function gi(a,b){return (a.C[b]&48)>>4};mS.hi=function hi(a,b){return (a.C[b]&ST)>>10!=1&&(a.C[b]&ST)>>10!=2?-1:(a.C[b]&TT)>>12};mS.ii=function ii(a,b){return (a.C[b]&ST)>>10};mS.ji=function ji(a,b){var c,d,e,f;c=a.B[0][b];d=a.B[1][b];e=a.H[d].a-a.H[c].a;f=a.H[d].b-a.H[c].b;return $wnd.Math.sqrt(e*e+f*f)};mS.ki=function ki(a,b,c){var d;for(d=0;d<a.p;d++)if(a.B[0][d]==b&&a.B[1][d]==c||a.B[0][d]==c&&a.B[1][d]==b)if(a.F[d]!=128)return d;return -1};mS.li=function li(a,b){switch(a.F[b]&103){case 1:case 64:return 1;case 2:return 2;case 4:return 3;default:return 0;}};mS.mi=function mi(a,b){return a.C[b]&3};mS.ni=function ni(a,b){return a.D[b]};mS.oi=function oi(a,b){return a.F[b]};mS.pi=function pi(a,b){return a.F[b]&103};mS.qi=function qi(a,b){var c;c=a.A[b]<mS.$g.length?mS.$g[a.A[b]]:null;return c==null?6:c[c.length-1]};mS.ri=function ri(a,b,c){var d,e;if(a.A[b]>=171&&a.A[b]<=190)return 0;e=0;(a.s[b]&48)==32&&(e-=1);((a.s[b]&48)==16||(a.s[b]&48)==48)&&(e-=2);d=a.q[b];if(d==0&&a.I){(a.w[b]&nT)==pT&&(d=-1);(a.w[b]&nT)==oT&&(d=1)}a.A[b]==7||a.A[b]==8||a.A[b]==9?(e+=d):a.A[b]==6||a.A[b]==14||a.A[b]==32?(e-=d<0?-d:d):a.A[b]==15||a.A[b]==33?c-e-d<=3?(e+=d):(e-=d):a.A[b]==16||a.A[b]==34||a.A[b]==52?c-e-d<=4?(e+=d):(e-=d<0?-d:d):a.A[b]==17||a.A[b]==35||a.A[b]==53?c-e-d<=5?(e+=d):(e-=d<0?-d:d):(e-=d);return e};mS.si=function si(a,b){var c;c=mS.ti(a,b);return c+mS.ri(a,b,c)};mS.ti=function ti(a,b){var c,d;c=((a.s[b]&QT)>>>28)-1;c==-1&&(c=(d=a.A[b]<mS.$g.length?mS.$g[a.A[b]]:null,d==null?6:d[d.length-1]));return c};mS.ui=function ui(a,b){var c,d,e,f,g;f=3;for(d=0;d<2;d++){c=a.B[d][b];e=mS.li(a,b)+(g=mS.ti(a,c),g+mS.ri(a,c,g))-mS.Wk(a,c);f>e&&(f=e)}return f};mS.vi=function vi(a,b){return (a.s[b]&KT)!=0};mS.wi=function wi(a,b){var c,d,e;d=mS.ui(a,b);c=mS.Ni(a,a.B[0][b])||mS.Ni(a,a.B[1][b]);e=c?32:1;if(a.F[b]==4){a.F[b]=e;a.Q=0;return true}if(a.F[b]==2){a.F[b]=26;a.Q&=3;if((a.C[b]&128)==0)return true}if(a.F[b]==26){d==3?(a.F[b]=4):(a.F[b]=e);a.Q=0;return true}if((24&a.F[b])!=0){a.F[b]=1;a.Q&=3;return true}if(!c&&d<2)return false;if(a.F[b]==1){a.F[b]=2;a.Q=0;return true}if(d<1)return false;if(a.F[b]==32){a.F[b]=1;a.Q=0;return true}return false};mS.xi=function xi(a){var b;a.Q=0;a.A=QC(hS.QD,$S,5,a.K,15,1);a.q=QC(hS.QD,$S,5,a.K,15,1);a.u=QC(hS.QD,$S,5,a.K,15,1);a.H=QC(hS.fE,{183:1,4:1,10:1,18:1,7:1},35,a.K,0,1);for(b=0;b<a.K;b++)a.H[b]=new mS.Ig;a.v=QC(hS.QD,$S,5,a.K,15,1);a.s=QC(hS.QD,$S,5,a.K,15,1);a.w=QC(hS.QD,$S,5,a.K,15,1);a.t=null;a.r=null;a.B=OC(hS.QD,[FT,$S],[6,5],15,[2,a.L],2);a.F=QC(hS.QD,$S,5,a.L,15,1);a.C=QC(hS.QD,$S,5,a.L,15,1);a.D=QC(hS.QD,$S,5,a.L,15,1)};mS.yi=function yi(a,b){a.Q&=~b};mS.zi=function zi(a,b){return (a.s[b]&VT)!=0};mS.Ai=function Ai(a,b){return a.A[b]==-1};mS.Bi=function Bi(a,b){return (a.s[b]&4)!=0};mS.Ci=function Ci(a,b){return (a.s[b]&WT)!=0};mS.Di=function Di(a,b){return a.u[b]<0};mS.Ei=function Ei(a,b){return (a.C[b]&KT)!=0};mS.Fi=function Fi(a,b){return (a.D[b]&yT)!=0};mS.Gi=function Gi(a,b){return (a.C[b]&ET)!=0};mS.Hi=function Hi(a,b){return a.F[b]==128};mS.Ii=function Ii(a,b){return (a.C[b]&4)!=0};mS.Ji=function Ji(a,b){return (a.C[b]&XT)!=0};mS.Ki=function Ki(a,b){return mS.dk(a.A[b])};mS.Li=function Li(a,b){return mS.ek(a.A[b])};mS.Mi=function Mi(a,b){return (a.s[b]&ET)!=0};mS.Ni=function Ni(a,b){var c;c=a.A[b];return c>=3&&c<=4||c>=11&&c<=13||c>=19&&c<=31||c>=37&&c<=51||c>=55&&c<=84||c>=87&&c<=103};mS.Oi=function Oi(a,b){return a.v[b]==0};mS.Pi=function Pi(a,b){var c;c=a.A[b];return c==1||c>=5&&c<=9||c>=14&&c<=17||c>=32&&c<=35||c>=52&&c<=53};mS.Qi=function Qi(a){var b;for(b=0;b<a.o;b++){switch(a.A[b]){case 1:case 5:case 6:case 7:case 8:case 9:case 14:case 15:case 16:case 17:case 33:case 34:case 35:case 52:case 53:continue;default:return false;}}return true};mS.Ri=function Ri(a,b){return (a.s[b]&512)!=0};mS.Si=function Si(a,b){return (a.s[a.B[0][b]]&a.s[a.B[1][b]]&512)!=0};mS.Ti=function Ti(a,b){return a.F[b]==17||a.F[b]==9};mS.Ui=function Ui(a,b,c){return (a.F[b]==17||a.F[b]==9)&&a.B[0][b]==c};mS.Vi=function Vi(a,b){a.A[b]=-1};mS.Wi=function Wi(a,b){a.F[b]=128};mS.Xi=function Xi(a,b,c,d,e,f,g){var h,i,j,k,l,m,n,o,p,q,r,s,t,u,v;if(b==d){n=mS.bi(a,a.o,a.p,mS.bh)}else{u=a.H[b].a-a.H[d].a;v=a.H[b].b-a.H[d].b;n=$wnd.Math.sqrt(u*u+v*v)}h=b;o=mS.Tj(a,b)!=3;for(t=1;t<c;t++){q=a.H[h].a+n*$wnd.Math.sin(f);r=a.H[h].b+n*$wnd.Math.cos(f);s=-1;for(p=0;p<a.o;p++){if($wnd.Math.abs(q-a.H[p].a)<4&&$wnd.Math.abs(r-a.H[p].b)<4){s=p;break}}if(s==-1){s=mS.eh(a,q,r,0);a.H[s].a=q;a.H[s].b=r;a.H[s].c=0}m=mS.ki(a,h,s);if(m==-1){m=mS.hh(a,h,s,(j=a.A[h],j>=3&&j<=4||j>=11&&j<=13||j>=19&&j<=31||j>=37&&j<=51||j>=55&&j<=84||j>=87&&j<=103||(k=a.A[s],k>=3&&k<=4||k>=11&&k<=13||k>=19&&k<=31||k>=37&&k<=51||k>=55&&k<=84||k>=87&&k<=103)?32:1));if(e){o&&mS.Tj(a,a.B[0][m])<4&&mS.Tj(a,a.B[1][m])<3&&(a.F[m]=2);o=!o}}h=s;f+=g}m=mS.ki(a,h,d);m==-1&&(m=mS.hh(a,h,d,(l=a.A[h],l>=3&&l<=4||l>=11&&l<=13||l>=19&&l<=31||l>=37&&l<=51||l>=55&&l<=84||l>=87&&l<=103||(i=a.A[d],i>=3&&i<=4||i>=11&&i<=13||i>=19&&i<=31||i>=37&&i<=51||i>=55&&i<=84||i>=87&&i<=103)?32:1)));e&&o&&mS.Tj(a,a.B[0][m])<4&&mS.Tj(a,a.B[1][m])<4&&(a.F[m]=2)};mS.Yi=function Yi(a,b,c){var d,e;if(mS.li(a,b)!=1)return false;if((a.s[c]&3)!=0)return true;for(e=0;e<a.p;e++)if(e!=b&&a.F[e]==2&&(a.B[0][e]==c&&(a.s[a.B[1][e]]&3)!=0||a.B[1][e]==c&&(a.s[a.B[0][e]]&3)!=0))return true;for(d=0;d<a.p;d++)if(d!=b&&a.F[d]==1&&(a.B[0][d]==c||a.B[1][d]==c)&&(a.C[d]&3)!=0)return true;return false};mS.Zi=function Zi(a){var b;for(b=0;b<a.o;b++)a.s[b]&=-449};mS.$i=function $i(a){var b;for(b=0;b<a.o;b++)a.s[b]&=-262145};mS._i=function _i(a){var b;for(b=0;b<a.o;b++)a.s[b]&=-513};mS.aj=function aj(a){var b;for(b=0;b<a.p;b++)a.C[b]&=-393217};mS.bj=function bj(a,b){var c;for(c=0;c<a.o;c++)iS.bK(a.u[c])==(b<0?-b:b)&&(a.u[c]=0)};mS.cj=function cj(a,b){var c,d,e,f,g,h,i,j,k;if(b==0)return 0;h=null;for(d=0;d<a.o;d++){if((a.s[d]&zT)>>19==b){h==null&&(h=QC(hS.EG,cT,5,32,16,1));h[(a.s[d]&zT)>>19!=1&&(a.s[d]&zT)>>19!=2?-1:(a.s[d]&RT)>>21]=true}}for(f=0;f<a.p;f++){if((a.C[f]&ST)>>10==b){h==null&&(h=QC(hS.EG,cT,5,32,16,1));h[(a.C[f]&ST)>>10!=1&&(a.C[f]&ST)>>10!=2?-1:(a.C[f]&TT)>>12]=true}}k=0;if(h!=null){j=QC(hS.QD,$S,5,32,15,1);for(i=0;i<32;i++)h[i]&&(j[i]=k++);for(c=0;c<a.o;c++){if((a.s[c]&zT)>>19==b){g=j[(a.s[c]&zT)>>19!=1&&(a.s[c]&zT)>>19!=2?-1:(a.s[c]&RT)>>21];a.s[c]&=-65011713;a.s[c]|=g<<21}}for(e=0;e<a.p;e++){if((a.C[e]&ST)>>10==b){g=j[(a.C[e]&ST)>>10!=1&&(a.C[e]&ST)>>10!=2?-1:(a.C[e]&TT)>>12];a.C[e]&=-126977;a.C[e]|=g<<12}}}return k};mS.dj=function dj(a,b){var c;for(c=0;c<a.o;c++){a.H[c].a*=b;a.H[c].b*=b}};mS.ej=function ej(a,b){a.o=b;a.Q=0};mS.fj=function fj(a,b){a.p=b;a.Q=0};mS.gj=function gj(a,b,c){if(c>=-1&&c<=14){a.s[b]&=268435455;a.s[b]|=1+c<<28;if(a.A[b]==6){if(c==-1||c==0||c==2||c==4){a.s[b]&=-49;c==2&&(a.s[b]|=16)}}}};mS.hj=function hj(a,b,c){a.s[b]&=-98305;a.s[b]|=c<<15};mS.ij=function ij(a,b,c){a.q[b]=c;a.Q=0};mS.jj=function jj(a,b,c){a.s[b]&=-449;a.s[b]|=c};mS.kj=function kj(a,b,c){c?(a.s[b]|=VT):(a.s[b]&=-67108865);a.Q&=3};mS.lj=function lj(a,b,c){var d,e;if(c!=null){if(iS.IK(c).length==0)c=null;else{d=mS.ck(c);if(d!=0&&iS.uK(c,mS.Zg[d])||iS.uK(c,'?')){mS.Bj(a,b,d);c=null}}}if(c==null){a.r!=null&&(a.r[b]=null)}else{a.r==null&&(a.r=QC(hS.MD,PT,8,a.K,0,2));a.r[b]=lS.tR((e=c,lS.oR(),e))}};mS.mj=function mj(a,b,c){c!=null&&c.length==0&&(c=null);if(c==null){a.r!=null&&(a.r[b]=null)}else{a.r==null&&(a.r=QC(hS.MD,PT,8,a.K,0,2));a.r[b]=c}};mS.nj=function nj(a,b,c,d){var e,f,g;if(c==0){a.s[b]&=YT;a.s[b]|=0}else{if(d>=32)return;if(d==-1){g=-1;for(f=0;f<a.o;f++)f!=b&&c==(a.s[f]&zT)>>19&&g<((a.s[f]&zT)>>19!=1&&(a.s[f]&zT)>>19!=2?-1:(a.s[f]&RT)>>21)&&(g=(a.s[f]&zT)>>19!=1&&(a.s[f]&zT)>>19!=2?-1:(a.s[f]&RT)>>21);for(e=0;e<a.p;e++)c==(a.C[e]&ST)>>10&&g<((a.C[e]&ST)>>10!=1&&(a.C[e]&ST)>>10!=2?-1:(a.C[e]&TT)>>12)&&(g=(a.C[e]&ST)>>10!=1&&(a.C[e]&ST)>>10!=2?-1:(a.C[e]&TT)>>12);d=g+1;if(d>=32)return}a.s[b]&=YT;a.s[b]|=c<<19|d<<21}a.Q&=3};mS.oj=function oj(a,b,c){a.t==null&&(a.t=QC(hS.QD,FT,6,a.K,0,2));CS.QO(c);a.t[b]=c;a.Q=0;a.I=true};mS.pj=function pj(a,b,c,d){var e;if(c==null){a.t!=null&&(a.t[b]=null);return}if(c.length==1&&!d){e=c[0];a.A[b]!=e&&mS.qh(a,b,e,0,-1,0);a.t!=null&&(a.t[b]=null);return}a.t==null&&(a.t=QC(hS.QD,FT,6,a.K,0,2));a.t[b]=c;d&&(a.w[b]|=1);a.Q=0;a.I=true};mS.qj=function qj(a,b,c,d){a.u[b]=d?-c:c};mS.rj=function rj(a,b,c){c?(a.s[b]|=ET):(a.s[b]&=-262145)};mS.sj=function sj(a,b,c){a.v[b]=c;a.Q&=3};mS.tj=function tj(a,b,c,d){a.s[b]&=-8;a.s[b]|=c;d&&(a.s[b]|=4)};mS.uj=function uj(a,b,c,d){d?(a.w[b]|=c):(a.w[b]&=~c);a.Q=0;a.I=true};mS.vj=function vj(a,b,c){a.s[b]&=-49;a.s[b]|=c;a.Q&=3};mS.wj=function wj(a,b,c){c?(a.s[b]|=512):(a.s[b]&=-513)};mS.xj=function xj(a,b,c){a.s[b]&=-134217729;c&&(a.s[b]|=WT)};mS.yj=function yj(a,b,c){a.H[b].a=c;a.Q&=3};mS.zj=function zj(a,b,c){a.H[b].b=c;a.Q&=3};mS.Aj=function Aj(a,b,c){a.H[b].c=c;a.Q&=3};mS.Bj=function Bj(a,b,c){if(c>=0&&c<=190){if(c==151||c==152){a.A[b]=1;a.v[b]=c-149}else{a.A[b]=c;a.v[b]=0}a.s[b]&=268435455;a.Q=0}};mS.Cj=function Cj(a,b,c,d){a.B[b][c]=d;a.Q=0};mS.Dj=function Dj(a,b,c){c?(a.C[b]|=KT):(a.C[b]&=-131073)};mS.Ej=function Ej(a,b,c){a.C[b]&=-49;a.C[b]|=c<<4};mS.Fj=function Fj(a,b,c,d){var e,f,g;if(c==0){a.C[b]&=-130049;a.C[b]|=0}else{if(d>=32)return;if(d==-1){g=-1;for(f=0;f<a.o;f++)c==(a.s[f]&zT)>>19&&g<((a.s[f]&zT)>>19!=1&&(a.s[f]&zT)>>19!=2?-1:(a.s[f]&RT)>>21)&&(g=(a.s[f]&zT)>>19!=1&&(a.s[f]&zT)>>19!=2?-1:(a.s[f]&RT)>>21);for(e=0;e<a.p;e++)e!=b&&c==(a.C[e]&ST)>>10&&g<((a.C[e]&ST)>>10!=1&&(a.C[e]&ST)>>10!=2?-1:(a.C[e]&TT)>>12)&&(g=(a.C[e]&ST)>>10!=1&&(a.C[e]&ST)>>10!=2?-1:(a.C[e]&TT)>>12);d=g+1;if(d>=32)return}a.C[b]&=-130049;a.C[b]|=c<<10|d<<12}a.Q&=3};mS.Gj=function Gj(a,b,c){c?(a.C[b]|=ET):(a.C[b]&=-262145)};mS.Hj=function Hj(a,b,c){a.F[b]=c==1?1:c==2?2:c==3?4:32;a.Q=0};mS.Ij=function Ij(a,b,c,d){a.C[b]&=-16777224;a.C[b]|=c;d&&(a.C[b]|=4)};mS.Jj=function Jj(a,b){a.C[b]|=XT};mS.Kj=function Kj(a,b,c,d){d?(a.D[b]|=c):(a.D[b]&=~c);a.Q=0;a.I=true};mS.Lj=function Lj(a,b,c){a.F[b]=c;a.Q=0};mS.Mj=function Mj(a,b){a.G=b};mS.Nj=function Nj(a,b){var c,d;a.I=b;if(!b){a.t=null;for(c=0;c<a.o;c++)a.w[c]=0;for(d=0;d<a.p;d++){a.D[d]=0;a.F[d]==64&&(a.F[d]=1)}}a.Q=0};mS.Oj=function Oj(a,b){a.P=b};mS.Pj=function Pj(a,b){var c,d;a.A=CS.AO(a.A,b);a.q=CS.AO(a.q,b);a.u=CS.AO(a.u,b);d=a.H.length;a.H=CS.BO(a.H,b);for(c=d;c<b;c++)a.H[c]=new mS.Ig;a.v=CS.AO(a.v,b);a.s=CS.AO(a.s,b);a.w=CS.AO(a.w,b);a.t!=null&&(a.t=CS.BO(a.t,b));a.r!=null&&(a.r=CS.BO(a.r,b));a.K=b};mS.Qj=function Qj(a,b){a.B[0]=CS.AO(a.B[0],b);a.B[1]=CS.AO(a.B[1],b);a.F=CS.AO(a.F,b);a.C=CS.AO(a.C,b);a.D=CS.AO(a.D,b);a.L=b};mS.Rj=function Rj(a,b){a.M=b};mS.Sj=function Sj(a,b){a.s[b]|=KT};mS.Tj=function Tj(a,b){var c,d;d=0;for(c=0;c<a.p;c++)(a.B[0][c]==b||a.B[1][c]==b)&&(d+=mS.li(a,c));return d};mS.Uj=function Uj(a){var b,c,d;c=false;d=false;for(b=0;b<a.o;b++){if(a.v[b]!=0){a.v[b]=0;c=true;a.A[b]==1&&(d=true)}}d&&(a.Q=0);return c};mS.Vj=function Vj(a,b,c){var d,e;return e=a.A[b],e>=3&&e<=4||e>=11&&e<=13||e>=19&&e<=31||e>=37&&e<=51||e>=55&&e<=84||e>=87&&e<=103||(d=a.A[c],d>=3&&d<=4||d>=11&&d<=13||d>=19&&d<=31||d>=37&&d<=51||d>=55&&d<=84||d>=87&&d<=103)?32:1};mS.Wj=function Wj(a,b,c){var d,e,f,g,h;g=a.A[b];a.A[b]=a.A[c];a.A[c]=g;g=a.q[b];a.q[b]=a.q[c];a.q[c]=g;g=a.v[b];a.v[b]=a.v[c];a.v[c]=g;g=a.s[b];a.s[b]=a.s[c];a.s[c]=g;g=a.w[b];a.w[b]=a.w[c];a.w[c]=g;g=a.u[b];a.u[b]=a.u[c];a.u[c]=g;f=a.H[b];a.H[b]=a.H[c];a.H[c]=f;if(a.t!=null){h=a.t[b];a.t[b]=a.t[c];a.t[c]=h}if(a.r!=null){h=a.r[b];a.r[b]=a.r[c];a.r[c]=h}for(d=0;d<a.p;d++){for(e=0;e<2;e++){a.B[e][d]==b?(a.B[e][d]=c):a.B[e][d]==c&&(a.B[e][d]=b)}}a.Q=0};mS.Xj=function Xj(a,b,c){var d;for(d=0;d<a.o;d++){a.H[d].a+=b;a.H[d].b+=c}a.R+=b;a.S+=c};mS.Yj=function Yj(a,b,c){var d,e;e=c&103;d=mS.ui(a,b);switch(e){case 1:case 64:return d>=1;case 2:return d>=2;case 4:return d>=3;case 32:return true;default:return false;}};mS.Zj=function Zj(a,b,c,d){var e,f,g;for(e=0;e<a.o;e++){if(!d||(a.s[e]&512)!=0){g=a.O[e]*b;f=a.N[e]-c;a.H[e].a=a.R+g*$wnd.Math.sin(f);a.H[e].b=a.S+g*$wnd.Math.cos(f)}}d&&(a.Q&=3)};mS.$j=function $j(a,b,c){var d,e,f;a.R=b;a.S=c;a.N=QC(hS.OD,bT,5,a.o,15,1);a.O=QC(hS.OD,bT,5,a.o,15,1);for(d=0;d<a.o;d++){e=b-a.H[d].a;f=c-a.H[d].b;a.O[d]=$wnd.Math.sqrt(e*e+f*f);a.N[d]=mS.ak(b,c,a.H[d].a,a.H[d].b)}};mS._j=function _j(a,b){this.K=1>a?1:a;this.L=1>b?1:b;mS.xi(this)};mS.ak=function ak(a,b,c,d){mS.dh();var e,f,g;f=c-a;g=d-b;if(g!=0){e=$wnd.Math.atan(f/g);g<0&&(f<0?(e-=hT):(e+=hT))}else e=f>0?iT:xT;return e};mS.bk=function bk(a,b){mS.dh();var c;c=a-b;while(c<ZT)c+=gT;while(c>hT)c-=gT;return c};mS.ck=function ck(a){mS.dh();var b;for(b=1;b<mS.Zg.length;b++)if(iS.vK(a,mS.Zg[b]))return b;return 0};mS.dk=function dk(a){mS.dh();switch(a){case 7:case 8:case 9:case 15:case 16:case 17:case 33:case 34:case 35:case 53:return true;}return false};mS.ek=function ek(a){mS.dh();if(a==1||a==6)return false;if(mS.dk(a))return false;if(a==2||a==10||a==18||a==36||a==54)return false;if(a>103)return false;return true};pH(51,1,{51:1,4:1});_.o=0;_.p=0;_.G=0;_.I=false;_.J=false;_.K=0;_.L=0;_.P=false;_.Q=0;_.R=0;_.S=0;mS.bh=24;hS.nE=$I(51);mS.fk=function fk(a,b,c,d){var e,f,g,h,i,j,k,l,m;mS.Po(b,1);d==null&&(d=QC(hS.QD,$S,5,b.o,15,1));h=mS.cj(a,1);i=mS.cj(a,2);m=QC(hS.EG,cT,5,b.o,16,1);j=QC(hS.QD,$S,5,b.o,15,1);j[0]=c;m[c]=true;d[c]=mS.uh(b,a,c,h,i);g=0;k=0;while(g<=k){for(l=0;l<mS.rk(b,j[g]);l++){f=b.f[j[g]][l];if(!m[f]){j[++k]=f;m[f]=true;d[f]=mS.uh(b,a,f,h,i)}}++g}for(e=0;e<b.p;e++)m[b.B[0][e]]&&mS.vh(b,a,e,h,i,d,false);mS.cj(a,1);mS.cj(a,2);a.Q=0};mS.gk=function gk(a){var b,c,d,e,f,g,h,i,j,k,l,m,n;a.g=QC(hS.QD,$S,5,a.o,15,1);a.c=QC(hS.QD,$S,5,a.o,15,1);a.f=QC(hS.QD,FT,6,a.o,0,2);a.i=QC(hS.QD,FT,6,a.o,0,2);a.j=QC(hS.QD,FT,6,a.o,0,2);a.k=QC(hS.QD,$S,5,a.d,15,1);k=QC(hS.QD,$S,5,a.o,15,1);for(h=0;h<a.p;h++){++k[a.B[0][h]];++k[a.B[1][h]]}for(d=0;d<a.o;d++){a.f[d]=QC(hS.QD,$S,5,k[d],15,1);a.i[d]=QC(hS.QD,$S,5,k[d],15,1);a.j[d]=QC(hS.QD,$S,5,k[d],15,1)}m=false;for(i=0;i<a.e;i++){n=mS.li(a,i);if(n==0){m=true;continue}for(l=0;l<2;l++){e=a.B[l][i];b=a.c[e];a.j[e][b]=n;a.f[e][b]=a.B[1-l][i];a.i[e][b]=i;++a.c[e];++a.g[e];e<a.d&&(n>1?(a.k[e]+=n+n-2):a.F[i]==64&&(a.k[e]=2))}}for(j=a.e;j<a.p;j++){n=mS.li(a,j);if(n==0){m=true;continue}for(l=0;l<2;l++){e=a.B[l][j];b=a.c[e];a.j[e][b]=n;a.f[e][b]=a.B[1-l][j];a.i[e][b]=j;++a.c[e];a.B[1-l][j]<a.d&&++a.g[e]}}if(m){b=QC(hS.QD,$S,5,a.o,15,1);for(e=0;e<a.o;e++)b[e]=a.c[e];for(g=0;g<a.p;g++){n=mS.li(a,g);if(n==0){for(l=0;l<2;l++){f=a.B[l][g];a.j[f][b[f]]=0;a.f[f][b[f]]=a.B[1-l][g];a.i[f][b[f]]=g;++b[f]}}}}for(c=0;c<a.d;c++)a.k[c]=a.k[c]/2|0};mS.hk=function hk(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r;mS.Po(a,1);for(j=0;j<a.p;j++){k=mS.li(a,j);if(k==1||k==2){if(a.q[a.B[0][j]]>0&&a.q[a.B[1][j]]<0){e=a.B[0][j];f=a.B[1][j]}else if(a.q[a.B[0][j]]<0&&a.q[a.B[1][j]]>0){e=a.B[1][j];f=a.B[0][j]}else continue;i=a.A[e];if(i>=3&&i<=4||i>=11&&i<=13||i>=19&&i<=31||i>=37&&i<=51||i>=55&&i<=84||i>=87&&i<=103||(h=a.A[f],h>=3&&h<=4||h>=11&&h<=13||h>=19&&h<=31||h>=37&&h<=51||h>=55&&h<=84||h>=87&&h<=103))continue;if(a.A[e]<9&&mS.Wk(a,e)>3||a.A[f]<9&&mS.Wk(a,f)>3)continue;a.q[e]-=1;a.q[f]+=1;k==1?(a.F[j]=2):(a.F[j]=4);a.Q=0}}q=0;p=0;n=0;for(d=0;d<a.o;d++){q+=a.q[d];if(a.q[d]<0){++p;mS.dk(a.A[d])&&(n+=a.q[d])}}if(!b&&q!=0)throw JG(new iS.HA("molecule's overall charges are not balanced"));mS.Po(a,1);r=0;for(g=0;g<a.o;g++){if(a.q[g]>0){if(!mS.il(a,g)&&mS.dk(a.A[g])){l=iS.dK(mS.Rk(a,g),a.q[g]);if(l!=0&&n>=l){r-=l;n+=l;a.q[g]-=l;a.Q&=1}}}}if(r<0){o=QC(hS.QD,$S,5,p,15,1);p=0;for(e=0;e<a.o;e++){a.q[e]<0&&(mS.jl(a,e)||(o[p++]=(a.A[e]<<16)+e))}CS.QO(o);for(m=o.length-1;q<0&&m>=o.length-p;m--){c=o[m]&VS;if(mS.dk(a.A[c])){l=iS.dK(-r,-a.q[c]);r+=l;a.q[c]+=l;a.Q&=1}}}return q};mS.ik=function ik(a,b){var c,d;for(d=0;d<a.c[b];d++){c=a.i[b][d];(a.F[c]==17||a.F[c]==9)&&a.B[0][c]==b&&(a.F[c]=1)}};mS.jk=function jk(a,b,c,d,e){var f,g,h,i,j;d&&mS.Po(a,3);b.t=null;a.I&&mS.Nj(b,true);i=c.length;e==null&&(e=QC(hS.QD,$S,5,i,15,1));b.o=0;for(f=0;f<i;f++)e[f]=c[f]?mS.uh(a,b,f,0,0):-1;b.p=0;for(j=0;j<a.p;j++){g=a.B[0][j];h=a.B[1][j];if(g<i&&h<i){if(c[g]&&c[h])mS.vh(a,b,j,0,0,e,d);else if(a.q[g]!=0&&a.q[h]!=0&&a.q[g]<0^a.q[h]<0){c[g]&&(b.q[e[g]]+=a.q[g]<0?1:-1);c[h]&&(b.q[e[h]]+=a.q[h]<0?1:-1)}}}mS.xh(a,b);!!a.b&&(b.Q=0);b.Q=0;mS.cj(b,1);mS.cj(b,2);b.o!=i&&mS.Nj(b,true);d&&mS.Yd(new mS.fe(b),null,false)};mS.kk=function kk(a,b,c,d,e){var f,g,h,i,j;d&&mS.Po(a,3);b.t=null;a.I&&mS.Nj(b,true);e==null&&(e=QC(hS.QD,$S,5,a.o,15,1));b.o=0;for(f=0;f<a.o;f++){e[f]=-1;for(j=0;j<a.g[f];j++){if(c[a.i[f][j]]){e[f]=mS.uh(a,b,f,0,0);break}}}b.p=0;for(i=0;i<a.p;i++)if(c[i]){mS.vh(a,b,i,0,0,e,d)}else{g=a.B[0][i];h=a.B[1][i];if(e[g]==-1^e[h]==-1){if(a.q[g]!=0&&a.q[h]!=0&&a.q[g]<0^a.q[h]<0){e[g]!=-1&&(b.q[e[g]]+=a.q[g]<0?1:-1);e[h]!=-1&&(b.q[e[h]]+=a.q[h]<0?1:-1)}}}mS.xh(a,b);!!a.b&&(b.Q=0);b.Q=0;mS.cj(b,1);mS.cj(b,2);b.o!=a.o&&mS.Nj(b,true);d&&mS.Yd(new mS.fe(b),null,false);return e};mS.lk=function lk(a,b){var c,d,e,f,g,h,i,j,k,l,m;if((b&~a.Q)==0)return;if((a.Q&1)==0){mS.hl(a);mS.gk(a);a.Q|=1;if(mS.Nl(a)){mS.hl(a);mS.gk(a)}}if((b&~a.Q)==0)return;if((a.Q&2)==0){for(d=0;d<a.d;d++)a.s[d]&=-31753;for(g=0;g<a.e;g++)a.C[g]&=-961;mS.pk(a);for(f=0;f<a.e;f++){if(a.F[f]==64){a.s[a.B[0][f]]|=jT;a.s[a.B[1][f]]|=jT;a.C[f]|=256;a.C[f]|=512}}for(e=0;e<a.d;e++){for(l=0;l<a.g[e];l++){j=a.i[e][l];if((a.C[j]&256)!=0)continue;i=a.f[e][l];for(m=0;m<a.g[i];m++){if(a.i[i][m]==j)continue;a.j[i][m]>1&&(a.A[a.f[i][m]]==6?(a.s[e]|=LT):!mS.nl(a,a.i[i][m])&&mS.Ki(a,a.f[i][m])&&(a.s[e]|=rT))}}}while(true){k=false;for(c=0;c<a.d;c++){if(a.k[c]>0&&(20480&a.s[c])==rT){for(l=0;l<a.g[c];l++){if(a.j[c][l]>1){i=a.f[c][l];j=a.i[c][l];for(m=0;m<a.g[i];m++){if(a.i[i][m]!=j){h=a.f[i][m];if((a.s[h]&rT)==0){a.s[h]|=rT;k=true}}}}}}}if(!k)break}a.Q|=2}};mS.mk=function mk(a,b){var c,d,e,f,g;c=-1;if(a.k[b]==1){for(f=0;f<a.g[b];f++){if(a.j[b][f]==2){d=a.f[b][f];if(a.g[d]==2&&a.k[d]==2){for(g=0;g<2;g++){e=a.f[d][g];if(e!=b&&a.k[e]==1){c=d;break}}}break}}}return c};mS.nk=function nk(a,b){var c;if(a.g[b]==3&&(a.s[b]&jT)!=0&&(!!a.n&&b<a.d?mS.Wm(a.n,b):0)>=6)for(c=0;c<a.g[b];c++)if(mS.ol(a,a.i[b][c]))return a.i[b][c];return -1};mS.ok=function ok(a,b,c,d,e){var f,g,h,i,j,k;mS.Po(a,3);if((a.s[b]&ST)==0||c&&(a.s[b]&jT)==0)return;i=QC(hS.QD,$S,5,a.d,15,1);i[0]=b;d[b]=true;h=0;j=0;while(h<=j){for(k=0;k<a.g[i[h]];k++){g=a.i[i[h]][k];if(!e[g]&&(a.C[g]&64)!=0&&(!c||(a.C[g]&256)!=0)){e[g]=true;f=a.f[i[h]][k];if(!d[f]){d[f]=true;i[++j]=f}}}++h}};mS.pk=function pk(a){var b,c,d,e,f,g,h,i;a.n=new mS.jn(a,7);c=QC(hS.QD,$S,5,a.d,15,1);for(d=0;d<a.e;d++){if(mS.Xm(a.n,d)!=0){a.C[d]|=64;++c[a.B[0][d]];++c[a.B[1][d]]}}for(b=0;b<a.d;b++){c[b]==2?(a.s[b]|=mT):c[b]==3?(a.s[b]|=kT):c[b]>3&&(a.s[b]|=ST)}for(i=0;i<a.n.i.a.length;i++){f=mS.Ym(a.n,i);h=mS.Zm(a.n,i);g=f.length;for(e=0;e<g;e++){a.s[f[e]]|=8;a.C[h[e]]|=128;if(mS.an(a.n,i)){a.s[f[e]]|=jT;a.C[h[e]]|=256}mS.dn(a.n,i)&&(a.C[h[e]]|=512);a.F[h[e]]==26&&(a.F[h[e]]=2)}}};mS.qk=function qk(a){var b,c,d,e,f,g,h,i,j,k;j=QC(hS.EG,cT,5,a.o,16,1);for(c=0;c<a.o;c++)j[c]=a.A[c]==1&&a.v[c]==0&&a.q[c]==0&&(a.r==null||a.r[c]==null);k=QC(hS.EG,cT,5,a.o,16,1);for(i=0;i<a.p;i++){d=a.B[0][i];e=a.B[1][i];if(mS.li(a,i)!=1){j[d]=false;j[e]=false;continue}k[d]&&(j[d]=false);k[e]&&(j[e]=false);j[d]&&(g=a.A[e],g>=3&&g<=4||g>=11&&g<=13||g>=19&&g<=31||g>=37&&g<=51||g>=55&&g<=84||g>=87&&g<=103)&&(j[d]=false);j[e]&&(f=a.A[d],f>=3&&f<=4||f>=11&&f<=13||f>=19&&f<=31||f>=37&&f<=51||f>=55&&f<=84||f>=87&&f<=103)&&(j[e]=false);k[d]=true;k[e]=true}for(h=0;h<a.p;h++){if(j[a.B[0][h]]&&j[a.B[1][h]]){j[a.B[0][h]]=false;j[a.B[1][h]]=false}}for(b=0;b<a.o;b++)k[b]||(j[b]=false);return j};mS.rk=function rk(a,b){return a.c[b]};mS.sk=function sk(a,b){return a.f[b].length};mS.tk=function tk(a,b){return a.c[b]-a.g[b]+mS.Rk(a,b)};mS.uk=function uk(a){var b,c;mS.Po(a,3);b=0;for(c=0;c<a.n.i.a.length;c++)mS.an(a.n,c)&&++b;return b};mS.vk=function vk(a,b){return a.k[b]};mS.wk=function wk(a,b){mS.Po(a,3);return a.k[b]==2&&a.g[b]==2?mS.zl(a,b):mS.Bl(a,b)};mS.xk=function xk(a,b){var c;c=a.s[b]&ST;return c==0?0:c==mT?2:c==kT?3:4};mS.yk=function yk(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o;mS.Po(a,3);f=QC(hS.EG,cT,5,a.e,16,1);l=QC(hS.EG,cT,5,a.e,16,1);o=QC(hS.QD,$S,5,a.d,15,1);g=0;for(h=1;h<a.g[b];h++){d=a.i[b][h];if((a.C[d]&64)!=0){for(j=0;j<h;j++){e=a.i[b][j];if((a.C[e]&64)!=0){l[d]=true;l[e]=true;n=mS.Xk(a,o,a.f[b][h],a.f[b][j],c-2,l);l[d]=false;l[e]=false;if(n!=-1){i=false;m=QC(hS.QD,$S,5,n,15,1);mS.Yk(a,o,m,n);for(k=0;k<n;k++){if(!f[m[k]]){f[m[k]]=true;i=true}}i&&++g}}}}}return g};mS.zk=function zk(a,b){return !!a.n&&b<a.d?mS.Wm(a.n,b):0};mS.Ak=function Ak(a,b){if(b){mS.Po(a,1);return mS.bi(a,a.d,a.e,mS.bh)}else{return mS.bi(a,a.o,a.p,mS.bh)}};mS.Bk=function Bk(a){var b,c,d,e,f,g,h,i;mS.Po(a,1);h=QC(hS.PD,HT,5,a.d,15,1);d=QC(hS.QD,$S,5,a.d,15,1);for(i=0;i<a.d;i++){d[0]=i;e=QC(hS.QD,$S,5,a.d,15,1);e[i]=1;c=0;f=0;while(c<=f){for(g=0;g<a.g[d[c]];g++){b=a.f[d[c]][g];if(e[b]==0){e[b]=e[d[c]]+1;d[++f]=b;h[i]+=e[b]-1}}++c}h[i]/=f}return h};mS.Ck=function Ck(a,b,c){var d;for(d=0;d<a.f[b].length;d++)if(a.f[b][d]==c)return a.i[b][d];return -1};mS.Dk=function Dk(a,b){return !!a.n&&b<a.e?mS.Xm(a.n,b):0};mS.Ek=function Ek(a,b,c){return a.f[b][c]};mS.Fk=function Fk(a,b){return a.g[b]};mS.Gk=function Gk(a,b,c){return a.i[b][c]};mS.Hk=function Hk(a,b,c){return a.j[b][c]};mS.Ik=function Ik(a,b){var c,d;mS.Po(a,1);d=0;for(c=0;c<a.c[b];c++)a.I&&(a.w[a.f[b][c]]&dT)!=0&&(d+=a.j[b][c]);return d};mS.Jk=function Jk(a,b){return a.c[b]-a.g[b]};mS.Kk=function Kk(a,b,c,d,e){var f,g,h,i;g=a.c[b];if(a.k[b]!=0||(a.s[b]&jT)!=0||a.g[b]<3||g>4)return false;i=QC(hS.EG,cT,5,4,16,1);for(h=0;h<g;h++){f=3.9269908169872414-d[h];if($wnd.Math.abs($T-f%iT)>0.0872664675116539)return false;e[h]=3&LD(f/iT);if(i[e[h]])return false;i[e[h]]=true;if((e[h]&1)==0){if(a.F[a.i[b][c[h]]]!=1)return false}else{if(!mS.Ui(a,a.i[b][c[h]],b))return false}}return i[0]&&i[2]};mS.Lk=function Lk(a,b,c,d,e){var f,g,h,i,j,k,l,m;f=a.c[b];e==null&&(e=QC(hS.QD,$S,5,f,15,1));if(!mS.Kk(a,b,c,d,e))return 3;i=-1;for(j=0;j<f;j++){if((e[j]&1)==1){g=a.F[a.i[b][c[j]]];if(i!=-1&&i!=g)return 3;i=g}}k=iS.bK(e[0]-e[1])==2?1:0;h=e[k]-e[k+1];m=(h<0?-h:h)==3^e[k]<e[k+1];l=f==3||(e[3]&1)==1;return m^l^i==9?1:2};mS.Mk=function Mk(a,b,c){var d,e,f,g,h,i,j,k,l,m;mS.Po(a,1);m=QC(hS.EG,cT,5,a.o,16,1);j=QC(hS.QD,$S,5,a.o,15,1);j[0]=b;m[b]=true;g=0;k=0;i=1;while(g<=k){f=c?mS.sk(a,j[g]):a.c[j[g]];for(l=0;l<f;l++){e=a.f[j[g]][l];if(!m[e]){j[++k]=e;m[e]=true;++i}}++g}h=QC(hS.QD,$S,5,i,15,1);i=0;for(d=0;d<a.o;d++)m[d]&&(h[i++]=d);return h};mS.Nk=function Nk(a,b,c,d){var e,f,g,h,i,j,k,l,m;mS.Po(a,1);for(f=0;f<a.o;f++)b[f]=-1;j=0;for(e=0;e<a.o;e++){if(b[e]==-1&&(!c||(a.s[e]&ET)!=0)){b[e]=j;k=QC(hS.QD,$S,5,a.o,15,1);k[0]=e;i=0;l=0;while(i<=l){h=d?mS.sk(a,k[i]):a.c[k[i]];for(m=0;m<h;m++){g=a.f[k[i]][m];if(b[g]==-1&&(!c||(a.s[g]&ET)!=0)){k[++l]=g;b[g]=j}}++i}++j}}return j};mS.Ok=function Ok(a,b){var c;return c=mS.ti(a,b),c+mS.ri(a,b,c)-mS.Wk(a,b)};mS.Pk=function Pk(a){var b,c,d,e;e=QC(hS.QD,$S,5,a.o,15,1);c=mS.qk(a);d=a.o-1;while(d>=0&&c[d]){e[d]=d;--d}for(b=0;b<=d;b++){if(c[b]){e[b]=d;e[d]=b;--d;while(d>=0&&c[d]){e[d]=d;--d}}else{e[b]=b}}return e};mS.Qk=function Qk(a,b,c){var d,e,f,g;e=mS.Wk(a,b);e-=mS.ri(a,b,e);c&&(e-=a.c[b]-a.g[b]);g=a.A[b]<mS.$g.length?mS.$g[a.A[b]]:null;f=g==null?6:g[0];if(e<=f)return -1;if(g!=null)for(d=1;f<e&&d<g.length;d++)f=g[d];return f>e?f:e};mS.Rk=function Rk(a,b){var c,d,e,f,g,h;if(a.I&&(a.w[b]&kT)==0)return 0;if(!mS.Kl(a,b))return 0;mS.Po(a,1);g=0;for(e=0;e<a.c[b];e++)g+=a.j[b][e];if(a.I){c=1;for(d=0;d<a.g[b];d++)a.F[a.i[b][d]]==64&&++c;g+=c>>1}g-=mS.ri(a,b,g);f=((a.s[b]&QT)>>>28)-1;if(f==-1){if(a.A[b]>=171&&a.A[b]<=190){f=2}else{h=a.A[b]<mS.$g.length?mS.$g[a.A[b]]:null;if(h==null){f=6}else{f=h[0];for(d=1;f<g&&d<h.length;d++)f=h[d]}}}return 0>f-g?0:f-g};mS.Sk=function Sk(a,b){var c,d,e,f;d=mS.Wk(a,b);d+=mS.ri(a,b,d);e=((a.s[b]&QT)>>>28)-1;if(e==-1){f=a.A[b]<mS.$g.length?mS.$g[a.A[b]]:null;if(f==null){e=6}else{c=0;while(d>f[c]&&c<f.length-1)++c;e=f[c]}}return e-d};mS.Tk=function Tk(a,b){return a.f[b].length-a.c[b]};mS.Uk=function Uk(a){var b,c,d,e;mS.Po(a,1);e=0;for(b=0;b<a.o;b++){d=a.v[b]!=0?a.v[b]:mS.ah[a.A[b]];e+=d+mS.Rk(a,b)*mS.ah[1];if(a.A[b]>=171&&a.A[b]<=190){c=a.c[b];c>2&&(e-=(c-2)*mS.ah[1])}}return e};mS.Vk=function Vk(a,b){var c,d;c=a.g[b];for(d=0;d<a.g[b];d++)a.A[a.f[b][d]]==1&&--c;return c};mS.Wk=function Wk(a,b){var c,d;a.gb(1);d=0;for(c=0;c<a.c[b];c++)d+=a.j[b][c];return d};mS.Xk=function Xk(a,b,c,d,e,f){var g,h,i,j,k,l,m,n,o;if(c==d){b[0]=c;return 0}mS.Po(a,1);j=QC(hS.QD,$S,5,a.o,15,1);i=QC(hS.QD,$S,5,a.o,15,1);o=QC(hS.QD,$S,5,a.o,15,1);i[0]=c;j[c]=1;h=0;k=0;while(h<=k&&j[i[h]]<=e){n=i[h];for(l=0;l<a.c[n];l++){if(f==null||f.length<=a.i[n][l]||!f[a.i[n][l]]){g=a.f[n][l];if(g==d){m=j[n];b[m]=g;b[--m]=n;while(m>0){b[m-1]=o[b[m]];--m}return j[n]}if(j[g]==0){i[++k]=g;j[g]=j[n]+1;o[g]=n}}}++h}return -1};mS.Yk=function Yk(a,b,c,d){var e,f;mS.Po(a,1);for(e=0;e<d;e++){for(f=0;f<a.c[b[e]];f++){if(a.f[b[e]][f]===b[e+1]){c[e]=a.i[b[e]][f];break}}}};mS.Zk=function Zk(a,b,c){var d,e,f,g,h,i;if(b==c)return 0;mS.Po(a,1);g=QC(hS.QD,$S,5,a.o,15,1);f=QC(hS.QD,$S,5,a.o,15,1);f[0]=b;g[b]=1;e=0;h=0;while(e<=h){for(i=0;i<a.c[f[e]];i++){d=a.f[f[e]][i];if(d==c)return g[f[e]];if(g[d]==0){f[++h]=d;g[d]=g[f[e]]+1}}++e}return -1};
mS.$k=function $k(a,b,c,d,e){var f,g,h,i,j,k;if(b==c)return 0;mS.Po(a,1);i=QC(hS.QD,$S,5,a.o,15,1);h=QC(hS.QD,$S,5,a.o,15,1);h[0]=b;i[b]=1;g=0;j=0;while(g<=j&&i[h[g]]<=d){for(k=0;k<a.c[h[g]];k++){f=a.f[h[g]][k];if(f==c)return i[h[g]];if(i[f]==0&&(e==null||e.length<=f||!e[f])){h[++j]=f;i[f]=i[h[g]]+1}}++g}return -1};mS._k=function _k(a){mS.Po(a,3);return a.n};mS.al=function al(a){var b,c,d,e,f,g,h,i,j;j=0;mS.Po(a,3);for(d=0;d<a.e;d++){if(mS.li(a,d)==1&&(a.C[d]&64)==0){h=true;for(g=0;g<2;g++){b=a.B[g][d];if(a.g[b]==1){h=false;break}if(a.A[b]==7&&(a.s[b]&jT)==0){c=a.B[1-g][d];for(i=0;i<a.g[c];i++){e=a.f[c][i];f=a.i[c][i];if(f!=d&&mS.li(a,f)>1&&(a.s[e]&jT)==0&&mS.dk(a.A[e])){h=false;break}}}}h&&!mS.rl(a,d)&&++j}}return j};mS.bl=function bl(a,b){var c,d,e,f;c=a.c[b];f=QC(hS.QD,$S,5,c,15,1);for(e=0;e<c;e++)f[e]=(a.f[b][e]<<16)+e;CS.QO(f);for(d=0;d<c;d++)f[d]&=VS;return f};mS.cl=function cl(a,b){var c,d;mS.Po(a,1);if(a.g[b]==2&&a.j[b][0]==2&&a.j[b][1]==2){for(c=0;c<2;c++)for(d=0;d<a.c[a.f[b][c]];d++)if(mS.Ui(a,a.i[a.f[b][c]][d],a.f[b][c]))return a.i[a.f[b][c]][d]}else{for(c=0;c<a.c[b];c++)if(mS.Ui(a,a.i[b][c],b))return a.i[b][c]}return -1};mS.dl=function dl(a,b,c){if(mS.li(a,b)!=1)return 0;return 16-a.c[c]+(a.A[c]==1?jT:0)+((a.F[b]&24)==0||a.B[0][b]!=c?kT:0)+((a.s[c]&3)==0?mT:0)+((a.C[b]&64)!=0?0:512)+(a.A[c]!=6?256:0)};mS.el=function el(a,b,c,d,e,f){var g,h,i,j,k,l;mS.Po(a,1);if(e){mS.Eh(e);e.I=false}j=QC(hS.QD,$S,5,a.o,15,1);d==null?(d=QC(hS.EG,cT,5,a.o,16,1)):CS.JO(d,d.length);j[0]=b;j[1]=c;d[b]=true;d[c]=true;i=1;k=1;while(i<=k){h=mS.sk(a,j[i]);for(l=0;l<h;l++){g=a.f[j[i]][l];if(g==b){if(i!=1)return -1}if(!d[g]){d[g]=true;j[++k]=g}}++i}if(e){f==null&&(f=QC(hS.QD,$S,5,d.length,15,1));mS.jk(a,e,d,false,f);mS.qh(e,f[b],0,0,-1,0)}d[b]=false;return k};mS.fl=function fl(a,b,c){var d,e,f,g,h,i;mS.Po(a,1);f=QC(hS.QD,$S,5,a.d,15,1);i=QC(hS.EG,cT,5,a.d,16,1);f[0]=b;f[1]=c;i[b]=true;i[c]=true;e=1;g=1;while(e<=g){for(h=0;h<a.g[f[e]];h++){d=a.f[f[e]][h];if(d==b){if(e!=1)return -1}if(!i[d]){i[d]=true;f[++g]=d}}++e}return g};mS.gl=function gl(a,b,c){var d,e,f,g,h,i,j,k,l,m,n;if(mS.li(a,c)!=2&&(a.C[c]&256)==0)return -1;n=a.C[c]&3;if(n!=1&&n!=2)return -1;for(i=0;i<2;i++){d=a.B[i][c];e=a.B[1-i][c];m=-1;g=false;for(k=0;k<a.g[d];k++){f=a.f[d][k];f!=e&&(f==b?(g=true):(m=f))}if(g){l=-1;h=-1;for(j=0;j<a.g[e];j++){f=a.f[e][j];if(f!=d){if(l==-1)l=f;else if(f>l)h=f;else{h=l;l=f}}}if(a.g[d]==2){if(a.g[e]==2)return n==2?l:-1;return n==2?l:h}else{if(a.g[e]==2)return n==2^b<m?-1:l;return n==2^b<m?h:l}}}return -1};mS.hl=function hl(a){var b,c,d,e,f,g,h,i,j,k,l;h=mS.qk(a);i=a.o;do --i;while(i>=0&&h[i]);for(b=0;b<i;b++){if(h[b]){mS.Wj(a,b,i);k=h[b];h[b]=h[i];h[i]=k;do --i;while(h[i])}}a.d=i+1;if(a.o==a.d){a.e=a.p;return}g=QC(hS.EG,cT,5,a.p,16,1);for(f=0;f<a.p;f++){c=a.B[0][f];d=a.B[1][f];(h[c]||h[d])&&(g[f]=true)}j=a.p;do --j;while(j>=0&&g[j]);for(e=0;e<j;e++){if(g[e]){l=a.B[0][e];a.B[0][e]=a.B[0][j];a.B[0][j]=l;l=a.B[1][e];a.B[1][e]=a.B[1][j];a.B[1][j]=l;l=a.F[e];a.F[e]=a.F[j];a.F[j]=l;g[e]=false;do --j;while(g[j])}}a.e=j+1};mS.il=function il(a,b){var c;for(c=0;c<a.g[b];c++)if(a.q[a.f[b][c]]<0)return true;return false};mS.jl=function jl(a,b){var c;for(c=0;c<a.g[b];c++)if(a.q[a.f[b][c]]>0)return true;return false};mS.kl=function kl(a,b){return (a.s[b]&LT)!=0};mS.ll=function ll(a,b){var c,d,e,f,g,h;a.gb(1);for(g=0;g<2;g++){c=a.B[g][b];if(a.A[c]==7){d=a.B[1-g][b];for(h=0;h<a.g[d];h++){e=a.f[d][h];f=a.i[d][h];if((a.A[e]==7||a.A[e]==8||a.A[e]==16)&&mS.li(a,f)>=2)return true}}}return false};mS.ml=function ml(a,b){return (a.s[b]&jT)!=0};mS.nl=function nl(a,b){return (a.C[b]&256)!=0};mS.ol=function ol(a,b){var c,d,e,f,g,h;if(a.F[b]!=1||(a.C[b]&256)!=0||(a.C[b]&64)!=0&&(!!a.n&&b<a.e?mS.Xm(a.n,b):0)<7)return false;c=a.B[0][b];if((a.s[c]&jT)==0||(!!a.n&&c<a.d?mS.Wm(a.n,c):0)<6)return false;d=a.B[1][b];if((a.s[d]&jT)==0||(!!a.n&&d<a.d?mS.Wm(a.n,d):0)<6)return false;h=0;for(g=0;g<a.g[c];g++){e=a.f[c][g];e!=d&&a.g[e]>2&&++h}for(f=0;f<a.g[d];f++){e=a.f[d][f];e!=c&&a.g[e]>2&&++h}return h>2};mS.pl=function pl(a,b){return (a.C[b]&512)!=0};mS.ql=function ql(a,b){var c,d,e,f,g,h,i,j,k,l,m;if(a.A[b]!=7)return false;if((a.s[b]&jT)!=0||a.k[b]!=0||(a.w[b]&wT)!=0)return true;if(a.q[b]==1)return false;f=0;for(h=0;h<a.g[b];h++){if(a.j[b][h]==1){c=a.A[a.f[b][h]];(c==8||c==9||c==17)&&++f}}if(f==0){for(g=0;g<a.g[b];g++){d=a.f[b][g];if(a.k[d]!=0){if((a.s[d]&jT)!=0){if((!!a.n&&d<a.d?mS.Wm(a.n,d):0)>=5){m=0;for(k=0;k<a.g[d];k++){l=a.f[d][k];l!=b&&a.g[l]>=3&&++m}if(m==2||m==1&&a.g[b]==3)continue}return true}for(j=0;j<a.g[d];j++){if((a.j[d][j]==2||mS.nl(a,a.i[d][j]))&&mS.xl(a,a.f[d][j]))return true}}}}if(f<2){for(g=0;g<a.g[b];g++){d=a.f[b][g];i=false;e=false;for(j=0;j<a.g[d];j++){if(a.f[d][j]!=b){a.j[d][j]!=1&&(a.A[a.f[d][j]]==7||a.A[a.f[d][j]]==8||a.A[a.f[d][j]]==16)&&(i=true);a.j[d][j]==1&&a.A[a.f[d][j]]==7&&(e=true)}}if(i&&(!e||f==0))return true}}return false};mS.rl=function rl(a,b){var c,d,e,f,g,h;if(mS.li(a,b)!=1)return false;for(f=0;f<2;f++){c=a.B[f][b];h=a.B[1-f][b];while(a.k[c]==2&&a.g[c]==2&&a.A[c]<10){for(g=0;g<2;g++){d=a.f[c][g];if(d!=h){if(a.g[d]==1)return true;e=a.i[c][g];if(mS.li(a,e)==1&&e<b)return true;h=c;c=d;break}}}if(a.g[c]==1)return true}return false};mS.sl=function sl(a,b){return (a.s[b]&ST)!=0};mS.tl=function tl(a,b){return (a.C[b]&64)!=0};mS.ul=function ul(a,b){return a.A[b]==1&&a.v[b]==0&&a.q[b]==0&&(a.r==null||a.r[b]==null)};mS.vl=function vl(a,b){return (a.s[b]&8)!=0};mS.wl=function wl(a,b){return (a.C[b]&128)!=0};mS.xl=function xl(a,b){return (a.s[b]&rT)!=0};mS.yl=function yl(a){var b,c,d,e,f,g,h,i,j,k;mS.Po(a,1);i=false;for(c=0;c<a.d;c++){if(a.A[c]==7&&a.q[c]==0){k=mS.Wk(a,c);if(k==4){for(j=0;j<a.g[c];j++){g=a.f[c][j];if(a.j[c][j]==1&&a.A[g]==8&&a.g[g]==1&&a.q[g]==0){i=true;++a.q[c];--a.q[g];break}}}else if(k==5){for(j=0;j<a.g[c];j++){g=a.f[c][j];h=a.i[c][j];if(a.j[c][j]==2&&a.A[g]==8){i=true;++a.q[c];--a.q[g];a.F[h]=1;break}if(a.j[c][j]==3&&a.A[g]==7){i=true;++a.q[c];--a.q[g];a.F[h]=2;break}}}}}f=false;for(e=0;e<a.e;e++){for(j=0;j<2;j++){if(mS.Ki(a,a.B[j][e])){b=a.B[1-j][e];d=a.A[b];if(d==3||d==11||d==12||d==19||d==20||d==37||d==38||d==55||d==56){if(mS.li(a,e)==1){++a.q[b];--a.q[a.B[j][e]];a.F[e]=128;f=true}else if(a.F[e]==32){a.F[e]=128;f=true}}break}}}if(f){mS.th(a);i=true}i&&(a.Q=0);return i};mS.zl=function zl(a,b){var c,d,e,f,g,h,i,j;i=-1;d=0;for(g=0;g<2;g++){c=a.f[b][g];for(h=0;h<a.c[c];h++){e=a.f[c][h];if(e!=b){f=a.i[c][h];j=mS.dl(a,f,e);if(d<j){d=j;i=f}}}}return i};mS.Al=function Al(a,b){var c,d,e,f,g,h,i,j;i=-1;d=0;for(g=0;g<2;g++){c=a.B[g][b];for(h=0;h<a.c[c];h++){e=a.f[c][h];if(e!=a.B[1-g][b]){f=a.i[c][h];j=mS.dl(a,f,e);if(d<j){d=j;i=f}}}}return i};mS.Bl=function Bl(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r;c=a.c[b];d=QC(hS.OD,bT,5,c,15,1);for(m=0;m<c;m++)d[m]=mS.ci(a,b,a.f[b][m]);for(n=1;n<c;n++){for(o=0;o<n;o++){e=$wnd.Math.abs(mS.bk(d[n],d[o]));if(e<0.08||e>_T){f=0;g=0;for(p=0;p<c;p++){if(p!=n&&p!=o){f+=$wnd.Math.abs(rS.dA(d[n],d[p]));g+=$wnd.Math.abs(rS.dA(d[o],d[p]))}}i=f<g?a.i[b][n]:a.i[b][o];if(mS.li(a,i)==1)return i}}}q=-1;h=0;for(l=0;l<c;l++){j=a.f[b][l];k=a.i[b][l];r=mS.dl(a,k,j);if(h<r){h=r;q=k}}return q};mS.Cl=function Cl(a){var b,c,d,e;mS.Po(a,7);a.o=a.d;a.p=a.e;for(c=0;c<a.d;c++){if(a.c[c]!==a.g[c]){b=mS.Qk(a,c,false);a.c[c]=a.g[c];if(b!=-1){e=mS.Qk(a,c,true);if(b!=e){d=((a.s[c]&QT)>>>28)-1;(d==-1||d<b)&&mS.gj(a,c,b)}}}}mS.Il(a);a.Q=0};mS.Dl=function Dl(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B;if(a.g[b]!=2||a.j[b][0]!=2||a.j[b][1]!=2||a.g[a.f[b][0]]<2||a.g[a.f[b][1]]<2||a.k[a.f[b][0]]!=1||a.k[a.f[b][1]]!=1){mS.tj(a,b,0,false);return}w=-1;v=-1;u=-1;r=-1;f=0;for(l=0;l<2;l++){d=a.f[b][l];for(p=0;p<a.c[d];p++){g=a.f[d][p];if(g!=b){h=a.i[d][p];A=mS.dl(a,h,g);if(f<A){f=A;v=g;w=h;u=d;r=a.f[b][1-l]}}}}if(v==-1)return;for(m=0;m<2;m++)for(o=0;o<a.c[a.f[b][m]];o++)a.f[a.f[b][m]][o]!=b&&(a.F[a.i[a.f[b][m]][o]]=1);if(a.B[1][w]!=v){a.B[0][w]=a.B[1][w];a.B[1][w]=v}i=MS;for(n=0;n<a.g[u];n++){g=a.f[u][n];g!=b&&i>g&&(i=g)}s=QC(hS.QD,$S,5,2,15,1);t=0;for(k=0;k<a.g[r];k++){g=a.f[r][k];g!=b&&(s[t++]=g)}c=mS.ak(a.H[b].a,a.H[b].b,a.H[r].a,a.H[r].b);if(t==2){if(s[0]>s[1]){B=s[0];s[0]=s[1];s[1]=B}j=mS.bk(c,mS.ci(a,r,s[0]));q=mS.bk(c,mS.ci(a,r,s[1]));e=j-q}else{e=mS.bk(c,mS.ci(a,r,s[0]))}e<0^(a.s[b]&3)==1^i==v?(a.F[w]=17):(a.F[w]=9)};mS.El=function El(a,b,c,d){var e,f,g,h,i,j;e=a.c[b];h=QC(hS.QD,$S,5,e,15,1);j=mS.Lk(a,b,c,d,h);if(j==3)return false;g=(a.s[b]&3)==j?17:9;for(i=0;i<e;i++){if((h[i]&1)==1){f=a.i[b][c[i]];a.F[f]=g;if(a.B[0][f]!=b){a.B[1][f]=a.B[0][f];a.B[0][f]=b}}}return true};mS.Fl=function Fl(a,b){a.Q|=252&(4|b)};mS.Gl=function Gl(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s;if((a.s[b]&3)==0||(a.s[b]&3)==3)return;if(a.k[b]==2&&a.g[b]==2){mS.Dl(a,b);return}if(a.g[b]<3||a.g[b]>4){mS.tj(a,b,0,false);return}c=a.c[b];q=false;for(h=0;h<c;h++){if(mS.li(a,a.i[b][h])==1){q=true;break}}if(!q)return;r=mS.bl(a,b);d=QC(hS.OD,bT,5,c,15,1);for(i=0;i<c;i++)d[i]=mS.ci(a,a.f[b][r[i]],b);for(j=0;j<c;j++)a.B[0][a.i[b][j]]==b&&mS.li(a,a.i[b][j])==1&&(a.F[a.i[b][j]]=1);if(mS.El(a,b,r,d))return;o=-1;for(k=0;k<c;k++){f=a.i[b][k];if((a.F[f]==17||a.F[f]==9)&&a.B[0][f]==b){a.F[a.i[b][k]]=1;o==-1?(o=f):(o=-2)}}o<0&&(o=mS.Bl(a,b));if(a.B[0][o]!=b){a.B[1][o]=a.B[0][o];a.B[0][o]=b}p=-1;for(l=0;l<c;l++){if(o==a.i[b][r[l]]){p=l;break}}s=YC(KC(hS.QD,2),FT,6,0,[YC(KC(hS.QD,1),$S,5,15,[2,1,2,1]),YC(KC(hS.QD,1),$S,5,15,[1,2,2,1]),YC(KC(hS.QD,1),$S,5,15,[1,1,2,2]),YC(KC(hS.QD,1),$S,5,15,[2,1,1,2]),YC(KC(hS.QD,1),$S,5,15,[2,2,1,1]),YC(KC(hS.QD,1),$S,5,15,[1,2,1,2])]);for(g=1;g<c;g++)d[g]<d[0]&&(d[g]+=gT);if(c==3){m=false;switch(p){case 0:m=d[1]<d[2]&&d[2]-d[1]<hT||d[1]>d[2]&&d[1]-d[2]>hT;break;case 1:m=d[2]-d[0]>hT;break;case 2:m=d[1]-d[0]<hT;}e=(a.s[b]&3)==1^m?17:9}else{n=0;d[1]<=d[2]&&d[2]<=d[3]?(n=0):d[1]<=d[3]&&d[3]<=d[2]?(n=1):d[2]<=d[1]&&d[1]<=d[3]?(n=2):d[2]<=d[3]&&d[3]<=d[1]?(n=3):d[3]<=d[1]&&d[1]<=d[2]?(n=4):d[3]<=d[2]&&d[2]<=d[1]&&(n=5);e=(a.s[b]&3)==1^s[n][p]==1?9:17}a.F[o]=e};mS.Hl=function Hl(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A;if((a.C[b]&3)==0||(a.C[b]&3)==3||!mS.ol(a,b))return;v=-1;t=-1;u=-1;s=-1;e=0;for(l=0;l<2;l++){d=a.B[l][b];for(o=0;o<a.c[d];o++){h=a.i[d][o];if(h!=b&&mS.li(a,h)==1){g=a.f[d][o];w=mS.dl(a,h,g);if(e<w){e=w;t=g;v=h;u=d;s=a.B[1-l][b]}}}}if(t==-1)return;for(m=0;m<2;m++){for(o=0;o<a.c[a.B[m][b]];o++){h=a.i[a.B[m][b]][o];h!=b&&mS.li(a,h)==1&&(a.F[h]=1)}}if(a.B[1][v]!=t){a.B[0][v]=a.B[1][v];a.B[1][v]=t}i=MS;for(n=0;n<a.g[u];n++){g=a.f[u][n];a.i[u][n]!=b&&i>g&&(i=g)}q=QC(hS.QD,$S,5,2,15,1);r=0;for(k=0;k<a.g[s];k++)a.i[s][k]!=b&&(q[r++]=a.f[s][k]);f=mS.ak(a.H[u].a,a.H[u].b,a.H[s].a,a.H[s].b);if(r==2){if(q[0]>q[1]){A=q[0];q[0]=q[1];q[1]=A}j=mS.bk(f,mS.ci(a,s,q[0]));p=mS.bk(f,mS.ci(a,s,q[1]));c=j-p}else{c=mS.bk(f,mS.ci(a,s,q[0]))}c<0^(a.C[b]&3)==2^i==t?(a.F[v]=17):(a.F[v]=9)};mS.Il=function Il(a){var b,c;mS.Po(a,3);for(b=0;b<a.d;b++)mS.Gl(a,b);for(c=0;c<a.e;c++)mS.Hl(a,c)};mS.Jl=function Jl(b,c){var d,e,f,g,h,i,j,k,l,m;i=QC(hS.QD,$S,5,b.o,15,1);h=mS.Nk(b,i,false,c);if(h<=1)return null;j=QC(hS.QD,$S,5,h,15,1);for(e=0;e<b.d;e++)++j[i[e]];l=0;m=j[0];for(k=1;k<h;k++){if(m<j[k]){m=j[k];l=k}}for(d=0;d<b.o;d++)i[d]!=l&&(b.A[d]=-1);for(g=0;g<b.p;g++)(!c&&b.F[g]==32||i[b.B[0][g]]!=l)&&(b.F[g]=128);f=mS.th(b);b.Q=0;try{mS.hk(b,true)}catch(a){a=IG(a);if(!CD(a,12))throw JG(a)}return f};mS.Kl=function Kl(a,b){var c;if((a.s[b]&QT)!=0)return true;if(a.A[b]==1)return false;return c=a.A[b],c==1||c>=5&&c<=9||c>=14&&c<=17||c>=32&&c<=35||c>=52&&c<=53||a.A[b]==13||a.A[b]>=171};mS.Ll=function Ll(a){var b,c,d,e,f,g,h,i,j;f=mS.bi(a,a.o,a.p,mS.bh);g=f*f/16;for(d=1;d<a.o;d++){for(e=0;e<d;e++){i=a.H[e].a-a.H[d].a;j=a.H[e].b-a.H[d].b;if(i*i+j*j<g)throw JG(new iS.HA('The distance between two atoms is too close.'))}}mS.Po(a,1);b=0;for(c=0;c<a.d;c++){if(mS.Wk(a,c)>(h=mS.ti(a,c),h+mS.ri(a,c,h)))throw JG(new iS.HA('atom valence exceeded'));b+=a.q[c]}if(b!=0)throw JG(new iS.HA('unbalanced atom charge'))};mS.Ml=function Ml(a,b,c){var d;d=mS.Yj(a,b,c);if(d&&c==26){mS.Po(a,3);d=d&(a.C[b]&128)==0}return d};mS.Nl=function Nl(a){var b,c,d,e,f,g,h,i,j,k,l,m;if(!a.I)return false;for(c=0;c<a.o;c++)mS.Wk(a,c)>=(m=mS.ti(a,c),m+mS.ri(a,c,m))&&(a.w[c]&=-6145);e=false;for(b=0;b<a.d;b++){f=a.c[b]-a.g[b];if(!a.P&&f>0){if((a.w[b]&kT)==0){i=(a.w[b]&lT)==896?3:(a.w[b]&lT)==384?2:(a.w[b]&128)==128?1:0;g=(l=mS.ti(a,b),l+mS.ri(a,b,l)-mS.Wk(a,b));a.q[b]==0&&(a.w[b]&nT)==0&&a.A[b]!=6&&++g;j=f;f>3-i&&(j=3-i);j>g+f-i&&(j=g+f-i);if(j>0){k=i==0?0:(a.w[b]&lT)<<j;k|=(j==3?7:f==2?3:1)<<7;a.w[b]&=-1921;a.w[b]|=lT&k}}for(h=a.g[b];h<a.c[b];h++){d=a.i[b][h];if(a.F[d]==1){a.A[a.f[b][h]]=-1;a.F[d]=128;e=true}}}(a.w[b]&2)!=0&&(a.w[b]&=-9);a.q[b]!=0&&(a.s[b]&=-234881025)}e&&mS.th(a);return e};mS.Ol=function Ol(a,b){mS._j.call(this,a,b)};mS.Pl=function Pl(a){mS._j.call(this,!a?256:a.K,!a?256:a.L);!!a&&mS.wh(a,this)};pH(58,51,{58:1,51:1,4:1});_.gb=function Ql(a){mS.lk(this,a)};_.d=0;_.e=0;hS.jE=$I(58);mS.Rl=function Rl(a,b){return $wnd.Math.pow(10,$wnd.Math.log(2000)*$wnd.Math.LOG10E*a/(b-1)-1)};mS.Sl=function Sl(a,b){var c,d;c=b;d=0;while(b!=0){if(a.c==0){a.e=(a.a[++a.d]&63)<<11;a.c=6}d|=(US&a.e)>>16-c+b;a.e<<=1;--b;--a.c}return d};mS.Tl=function Tl(a,b,c){a.c=6;a.d=c;a.a=b;a.e=(b[a.d]&63)<<11};mS.Ul=function Ul(a,b){var c,d,e,f;d=b/2|0;e=a>=d;e&&(a-=d);f=b/32|0;c=f*a/(d-a);return e?-c:c};mS.Vl=function Vl(a,b){var c;return b==null||iS.IK(b).length==0?null:mS.Xl(a,lS.tR((c=b,lS.oR(),c)),null)};mS.Wl=function Wl(a,b,c){var d,e;return b==null?null:mS.Xl(a,lS.tR((e=b,lS.oR(),e)),c==null?null:lS.tR((d=c,d)))};mS.Xl=function Xl(a,b,c){var d,e,f,g,h;if(b==null)return null;mS.Tl(a,b,0);d=mS.Sl(a,4);g=mS.Sl(a,4);d>8&&(d=g);e=mS.Sl(a,d);f=mS.Sl(a,g);h=new mS.dp(e,f);mS.Yl(a,h,b,c);return h};mS.Yl=function Yl(b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,ab,bb,cb,db,eb,fb,gb,hb,ib,jb,kb,lb,mb,nb,ob,pb,qb,rb,sb,tb,ub,vb,wb,xb,yb,zb,Ab,Bb,Cb,Db,Eb,Fb,Gb,Hb,Ib,Jb,Kb,Lb,Mb,Nb,Ob,Pb,Qb,Rb,Sb,Tb,Ub,Vb,Wb,Xb,Yb,Zb,$b,_b,ac,bc,cc,dc,ec,fc,gc,hc,ic,jc,kc,lc,mc,nc,oc;ic=8;b.f=c;mS.Eh(b.f);if(d==null||d.length==0)return;e!=null&&e.length==0&&(e=null);mS.Tl(b,d,0);h=mS.Sl(b,4);A=mS.Sl(b,4);if(h>8){ic=h;h=A}if(h==0){mS.Nj(b.f,mS.Sl(b,1)==1);return}i=mS.Sl(b,h);j=mS.Sl(b,A);Zb=mS.Sl(b,h);bc=mS.Sl(b,h);ac=mS.Sl(b,h);L=mS.Sl(b,h);for(n=0;n<i;n++)mS.fh(b.f,6);for(gb=0;gb<Zb;gb++)mS.Bj(b.f,mS.Sl(b,h),7);for(hb=0;hb<bc;hb++)mS.Bj(b.f,mS.Sl(b,h),8);for(sb=0;sb<ac;sb++)mS.Bj(b.f,mS.Sl(b,h),mS.Sl(b,8));for(Db=0;Db<L;Db++)mS.ij(b.f,mS.Sl(b,h),mS.Sl(b,4)-8);M=1+j-i;T=mS.Sl(b,4);w=0;mS.yj(b.f,0,0);mS.zj(b.f,0,0);mS.Aj(b.f,0,0);U=e!=null&&e[0]>=39;hc=0;kc=0;mc=0;oc=0;P=false;Q=false;if(U){if(e.length>2*i-2&&e[2*i-2]==39||e.length>3*i-3&&e[3*i-3]==39){Q=true;P=e.length==3*i-3+9;Pb=P?3*i-3:2*i-2;v=86*(e[Pb+1]-40)+e[Pb+2]-40;hc=$wnd.Math.pow(10,v/2000-1);Pb+=2;jc=86*(e[Pb+1]-40)+e[Pb+2]-40;kc=$wnd.Math.pow(10,jc/1500-1);Pb+=2;lc=86*(e[Pb+1]-40)+e[Pb+2]-40;mc=$wnd.Math.pow(10,lc/1500-1);if(P){Pb+=2;nc=86*(e[Pb+1]-40)+e[Pb+2]-40;oc=$wnd.Math.pow(10,nc/1500-1)}}else{P=e.length==3*i-3}}if(b.b&&P){e=null;U=false}for(Jb=1;Jb<i;Jb++){V=mS.Sl(b,T);if(V==0){if(U){mS.yj(b.f,Jb,mS.Yh(b.f,0)+8*(e[Jb*2-2]-83));mS.zj(b.f,Jb,mS.Zh(b.f,0)+8*(e[Jb*2-1]-83));P&&mS.Aj(b.f,Jb,mS.$h(b.f,0)+8*(e[2*i-3+Jb]-83))}++M;continue}w+=V-1;if(U){mS.yj(b.f,Jb,mS.Yh(b.f,w)+e[Jb*2-2]-83);mS.zj(b.f,Jb,mS.Zh(b.f,w)+e[Jb*2-1]-83);P&&mS.Aj(b.f,Jb,mS.$h(b.f,w)+(e[2*i-3+Jb]-83))}mS.hh(b.f,w,Jb,1)}for(Kb=0;Kb<M;Kb++)mS.hh(b.f,mS.Sl(b,h),mS.Sl(b,h),1);Rb=QC(hS.EG,cT,5,j,16,1);for(G=0;G<j;G++){H=mS.Sl(b,2);switch(H){case 0:Rb[G]=true;break;case 2:mS.Lj(b.f,G,2);break;case 3:mS.Lj(b.f,G,4);}}g=mS.Sl(b,h);for(Lb=0;Lb<g;Lb++){m=mS.Sl(b,h);if(ic==8){cc=mS.Sl(b,2);if(cc==3){mS.nj(b.f,m,1,0);mS.tj(b.f,m,1,false)}else{mS.tj(b.f,m,cc,false)}}else{cc=mS.Sl(b,3);switch(cc){case 4:mS.tj(b.f,m,1,false);mS.nj(b.f,m,1,mS.Sl(b,3));break;case 5:mS.tj(b.f,m,2,false);mS.nj(b.f,m,1,mS.Sl(b,3));break;case 6:mS.tj(b.f,m,1,false);mS.nj(b.f,m,2,mS.Sl(b,3));break;case 7:mS.tj(b.f,m,2,false);mS.nj(b.f,m,2,mS.Sl(b,3));break;default:mS.tj(b.f,m,cc,false);}}}ic==8&&mS.Sl(b,1)==0&&(b.f.J=true);f=mS.Sl(b,A);for(Mb=0;Mb<f;Mb++){C=mS.Sl(b,A);if(mS.oi(b.f,C)==1){cc=mS.Sl(b,3);switch(cc){case 4:mS.Ij(b.f,C,1,false);mS.Fj(b.f,C,1,mS.Sl(b,3));break;case 5:mS.Ij(b.f,C,2,false);mS.Fj(b.f,C,1,mS.Sl(b,3));break;case 6:mS.Ij(b.f,C,1,false);mS.Fj(b.f,C,2,mS.Sl(b,3));break;case 7:mS.Ij(b.f,C,2,false);mS.Fj(b.f,C,2,mS.Sl(b,3));break;default:mS.Ij(b.f,C,cc,false);}}else{mS.Ij(b.f,C,mS.Sl(b,2),false)}}mS.Nj(b.f,mS.Sl(b,1)==1);l=null;_b=0;while(mS.Sl(b,1)==1){S=_b+mS.Sl(b,4);switch(S){case 0:$b=mS.Sl(b,h);for(Nb=0;Nb<$b;Nb++){m=mS.Sl(b,h);mS.uj(b.f,m,kT,true)}break;case 1:$b=mS.Sl(b,h);for(Ob=0;Ob<$b;Ob++){m=mS.Sl(b,h);Xb=mS.Sl(b,8);mS.sj(b.f,m,Xb)}break;case 2:$b=mS.Sl(b,A);for(ib=0;ib<$b;ib++){C=mS.Sl(b,A);mS.Lj(b.f,C,64)}break;case 3:$b=mS.Sl(b,h);for(jb=0;jb<$b;jb++){m=mS.Sl(b,h);mS.uj(b.f,m,jT,true)}break;case 4:$b=mS.Sl(b,h);for(kb=0;kb<$b;kb++){m=mS.Sl(b,h);gc=mS.Sl(b,4)<<3;mS.uj(b.f,m,gc,true)}break;case 5:$b=mS.Sl(b,h);for(lb=0;lb<$b;lb++){m=mS.Sl(b,h);k=mS.Sl(b,2)<<1;mS.uj(b.f,m,k,true)}break;case 6:$b=mS.Sl(b,h);for(mb=0;mb<$b;mb++){m=mS.Sl(b,h);mS.uj(b.f,m,1,true)}break;case 7:$b=mS.Sl(b,h);for(nb=0;nb<$b;nb++){m=mS.Sl(b,h);db=mS.Sl(b,4)<<7;mS.uj(b.f,m,db,true)}break;case 8:$b=mS.Sl(b,h);for(ob=0;ob<$b;ob++){m=mS.Sl(b,h);s=mS.Sl(b,4);q=QC(hS.QD,$S,5,s,15,1);for(Sb=0;Sb<s;Sb++){r=mS.Sl(b,8);q[Sb]=r}mS.oj(b.f,m,q)}break;case 9:$b=mS.Sl(b,A);for(pb=0;pb<$b;pb++){C=mS.Sl(b,A);gc=mS.Sl(b,2)<<5;mS.Kj(b.f,C,gc,true)}break;case 10:$b=mS.Sl(b,A);for(qb=0;qb<$b;qb++){C=mS.Sl(b,A);I=mS.Sl(b,5);mS.Kj(b.f,C,I,true)}break;case 11:$b=mS.Sl(b,h);for(rb=0;rb<$b;rb++){m=mS.Sl(b,h);mS.uj(b.f,m,LT,true)}break;case 12:$b=mS.Sl(b,A);for(tb=0;tb<$b;tb++){C=mS.Sl(b,A);J=mS.Sl(b,8)<<7;mS.Kj(b.f,C,J,true)}break;case 13:$b=mS.Sl(b,h);for(ub=0;ub<$b;ub++){m=mS.Sl(b,h);dc=mS.Sl(b,3)<<14;mS.uj(b.f,m,dc,true)}break;case 14:$b=mS.Sl(b,h);for(vb=0;vb<$b;vb++){m=mS.Sl(b,h);Yb=mS.Sl(b,5)<<17;mS.uj(b.f,m,Yb,true)}break;case 15:_b=16;break;case 16:$b=mS.Sl(b,h);for(wb=0;wb<$b;wb++){m=mS.Sl(b,h);fc=mS.Sl(b,3)<<22;mS.uj(b.f,m,fc,true)}break;case 17:$b=mS.Sl(b,h);for(xb=0;xb<$b;xb++){m=mS.Sl(b,h);mS.gj(b.f,m,mS.Sl(b,4))}break;case 18:$b=mS.Sl(b,h);Wb=mS.Sl(b,4);for(yb=0;yb<$b;yb++){m=mS.Sl(b,h);R=mS.Sl(b,Wb);Tb=QC(hS.MD,JT,5,R,15,1);for(Sb=0;Sb<R;Sb++)Tb[Sb]=mS.Sl(b,7)<<24>>24;mS.lj(b.f,m,iS.JK(lS.rR(Tb,0,(Ub=Tb.length,lS.oR(),Ub))))}break;case 19:$b=mS.Sl(b,h);for(zb=0;zb<$b;zb++){m=mS.Sl(b,h);K=mS.Sl(b,3)<<25;mS.uj(b.f,m,K,true)}break;case 20:$b=mS.Sl(b,A);for(Ab=0;Ab<$b;Ab++){C=mS.Sl(b,A);fc=mS.Sl(b,3)<<15;mS.Kj(b.f,C,fc,true)}break;case 21:$b=mS.Sl(b,h);for(Bb=0;Bb<$b;Bb++){m=mS.Sl(b,h);mS.vj(b.f,m,mS.Sl(b,2)<<4)}break;case 22:$b=mS.Sl(b,h);for(Cb=0;Cb<$b;Cb++){m=mS.Sl(b,h);mS.uj(b.f,m,wT,true)}break;case 23:$b=mS.Sl(b,A);for(Eb=0;Eb<$b;Eb++){C=mS.Sl(b,A);mS.Kj(b.f,C,ET,true)}break;case 24:$b=mS.Sl(b,A);for(Fb=0;Fb<$b;Fb++){C=mS.Sl(b,A);k=mS.Sl(b,2)<<19;mS.Kj(b.f,C,k,true)}break;case 25:for(Gb=0;Gb<i;Gb++)mS.Sl(b,1)==1&&mS.wj(b.f,Gb,true);break;case 26:$b=mS.Sl(b,A);l=QC(hS.QD,$S,5,$b,15,1);for(Hb=0;Hb<$b;Hb++)l[Hb]=mS.Sl(b,A);break;case 27:$b=mS.Sl(b,h);for(Ib=0;Ib<$b;Ib++){m=mS.Sl(b,h);mS.uj(b.f,m,dT,true)}break;case 28:$b=mS.Sl(b,A);for(fb=0;fb<$b;fb++)mS.Lj(b.f,mS.Sl(b,A),32);}}mS.Yd(new mS.fe(b.f),Rb,false);if(l!=null)for(D=0,F=l.length;D<F;++D){C=l[D];mS.Lj(b.f,C,mS.oi(b.f,C)==2?4:2)}N=0;if(e==null&&d.length>b.d+1&&(d[b.d+1]==32||d[b.d+1]==9)){e=d;N=b.d+2}if(e!=null){try{if(e[N]==33||e[N]==35){mS.Tl(b,e,N+1);P=mS.Sl(b,1)==1;Q=mS.Sl(b,1)==1;ec=2*mS.Sl(b,4);B=1<<ec;C=0;for(o=1;o<i;o++){if(C<j&&mS.di(b.f,1,C)==o){bb=mS.di(b.f,0,C++);ab=1}else{bb=0;ab=8}mS.yj(b.f,o,mS.Yh(b.f,bb)+ab*(mS.Sl(b,ec)-(B/2|0)));mS.zj(b.f,o,mS.Zh(b.f,bb)+ab*(mS.Sl(b,ec)-(B/2|0)));P&&mS.Aj(b.f,o,mS.$h(b.f,bb)+ab*(mS.Sl(b,ec)-(B/2|0)))}u=P?1.5:(mS.dh(),mS.dh(),mS.bh);t=mS.bi(b.f,i,j,u);if(e[N]==35){eb=0;cb=QC(hS.QD,$S,5,i,15,1);for(p=0;p<i;p++)eb+=cb[p]=mS.Rk(b.f,p);for(m=0;m<i;m++){for(fb=0;fb<cb[m];fb++){db=mS.fh(b.f,1);mS.hh(b.f,m,db,1);mS.yj(b.f,db,mS.Yh(b.f,m)+(mS.Sl(b,ec)-(B/2|0)));mS.zj(b.f,db,mS.Zh(b.f,m)+(mS.Sl(b,ec)-(B/2|0)));P&&mS.Aj(b.f,db,mS.$h(b.f,m)+(mS.Sl(b,ec)-(B/2|0)))}}i+=eb;j+=eb}if(Q){hc=mS.Rl(mS.Sl(b,ec),B);kc=hc*mS.Ul(mS.Sl(b,ec),B);mc=hc*mS.Ul(mS.Sl(b,ec),B);P&&(oc=hc*mS.Ul(mS.Sl(b,ec),B));ab=hc/t;for(m=0;m<i;m++){mS.yj(b.f,m,kc+ab*mS.Yh(b.f,m));mS.zj(b.f,m,mc+ab*mS.Zh(b.f,m));P&&mS.Aj(b.f,m,oc+ab*mS.$h(b.f,m))}}else{ab=1.5/t;for(m=0;m<i;m++){mS.yj(b.f,m,ab*mS.Yh(b.f,m));mS.zj(b.f,m,ab*mS.Zh(b.f,m));P&&mS.Aj(b.f,m,ab*mS.$h(b.f,m))}}}else{P&&!Q&&hc==0&&(hc=1.5);if(hc!=0&&b.f.p!=0){t=0;for(C=0;C<b.f.p;C++){W=mS.Yh(b.f,mS.di(b.f,0,C))-mS.Yh(b.f,mS.di(b.f,1,C));X=mS.Zh(b.f,mS.di(b.f,0,C))-mS.Zh(b.f,mS.di(b.f,1,C));Y=P?mS.$h(b.f,mS.di(b.f,0,C))-mS.$h(b.f,mS.di(b.f,1,C)):0;t+=$wnd.Math.sqrt(W*W+X*X+Y*Y)}t/=b.f.p;$=hc/t;for(m=0;m<b.f.o;m++){mS.yj(b.f,m,mS.Yh(b.f,m)*$+kc);mS.zj(b.f,m,mS.Zh(b.f,m)*$+mc);P&&mS.Aj(b.f,m,mS.$h(b.f,m)*$+oc)}}}}catch(a){a=IG(a);if(CD(a,12)){Z=a;iS.sA(Z,(iS.YK(),iS.XK),'');'Faulty id-coordinates:'+iS.wA(Z,Z.lb())+' '+iS.JK(lS.rR(d,0,(Vb=d.length,lS.oR(),Vb)))+' '+iS.JK(lS.rR(e,0,(Ub=e.length,Ub)));e=null;P=false}else throw JG(a)}}O=e!=null&&!P;if(O||b.b){mS.Po(b.f,3);for(C=0;C<b.f.e;C++)mS.li(b.f,C)==2&&!mS.wl(b.f,C)&&mS.mi(b.f,C)==0&&mS.Jj(b.f,C)}if(!O&&b.b){mS.Fl(b.f,0);try{Qb=new oS.oq;Qb.g=new CS.pP(78187493520);oS.$p(Qb,b.f);O=true}catch(a){a=IG(a);if(CD(a,12)){Z=a;iS.sA(Z,(iS.YK(),iS.XK),'');'2D-coordinate creation failed:'+iS.wA(Z,Z.lb())+' '+iS.JK(lS.rR(d,0,(Ub=d.length,lS.oR(),Ub)))}else throw JG(a)}}if(O){mS.Il(b.f);mS._o(b.f)}else P||mS.Fl(b.f,0)};mS.Zl=function Zl(a){this.b=a};pH(47,1,{},mS.Zl);_.b=false;_.c=0;_.d=0;_.e=0;hS.kE=$I(47);mS.$l=function $l(a,b){this.b=a;this.a=b};pH(3,1,{3:1},mS.$l);_.a=0;_.b=0;hS.lE=$I(3);
mS.am=function am(){mS.am=rH;mS._l=YC(KC(hS.lE,2),HS,9,0,[null,YC(KC(hS.lE,1),aU,3,0,[new mS.$l(0,1.007825032),new mS.$l(1,2.014101778),new mS.$l(2,3.016049268),new mS.$l(3,4.027834627),new mS.$l(4,5.039542911),new mS.$l(5,6.044942608)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(1,3.01602931),new mS.$l(2,4.00260325),new mS.$l(3,5.012223628),new mS.$l(4,6.018888072),new mS.$l(5,7.028030527),new mS.$l(6,8.033921838),new mS.$l(7,9.043820323),new mS.$l(8,10.052399713)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(1,4.027182329),new mS.$l(2,5.012537796),new mS.$l(3,6.015122281),new mS.$l(4,7.016004049),new mS.$l(5,8.02248667),new mS.$l(6,9.026789122),new mS.$l(7,10.035480884),new mS.$l(8,11.043796166),new mS.$l(9,12.05378)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(1,5.04079),new mS.$l(2,6.019725804),new mS.$l(3,7.016929246),new mS.$l(4,8.005305094),new mS.$l(5,9.012182135),new mS.$l(6,10.01353372),new mS.$l(7,11.021657653),new mS.$l(8,12.026920631),new mS.$l(9,13.036133834),new mS.$l(10,14.042815522)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(2,7.029917389),new mS.$l(3,8.024606713),new mS.$l(4,9.013328806),new mS.$l(5,10.012937027),new mS.$l(6,11.009305466),new mS.$l(7,12.014352109),new mS.$l(8,13.017780267),new mS.$l(9,14.025404064),new mS.$l(10,15.031097291),new mS.$l(11,16.039808836),new mS.$l(12,17.046931399),new mS.$l(13,18.05617),new mS.$l(14,19.06373)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(2,8.037675026),new mS.$l(3,9.031040087),new mS.$l(4,10.01685311),new mS.$l(5,11.011433818),new mS.$l(6,12),new mS.$l(7,13.003354838),new mS.$l(8,14.003241988),new mS.$l(9,15.010599258),new mS.$l(10,16.014701243),new mS.$l(11,17.022583712),new mS.$l(12,18.026757058),new mS.$l(13,19.035248094),new mS.$l(14,20.040322395),new mS.$l(15,21.04934),new mS.$l(16,22.05645)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(3,10.042618),new mS.$l(4,11.026796226),new mS.$l(5,12.018613202),new mS.$l(6,13.005738584),new mS.$l(7,14.003074005),new mS.$l(8,15.000108898),new mS.$l(9,16.006101417),new mS.$l(10,17.008449673),new mS.$l(11,18.014081827),new mS.$l(12,19.017026896),new mS.$l(13,20.023367295),new mS.$l(14,21.027087574),new mS.$l(15,22.034440259),new mS.$l(16,23.04051),new mS.$l(17,24.0505)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(4,12.034404776),new mS.$l(5,13.0248104),new mS.$l(6,14.008595285),new mS.$l(7,15.003065386),new mS.$l(8,15.994914622),new mS.$l(9,16.999131501),new mS.$l(10,17.999160419),new mS.$l(11,19.00357873),new mS.$l(12,20.00407615),new mS.$l(13,21.008654631),new mS.$l(14,22.009967157),new mS.$l(15,23.015691325),new mS.$l(16,24.020369922),new mS.$l(17,25.02914),new mS.$l(18,26.03775)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(5,14.03608),new mS.$l(6,15.018010856),new mS.$l(7,16.01146573),new mS.$l(8,17.002095238),new mS.$l(9,18.000937667),new mS.$l(10,18.998403205),new mS.$l(11,19.999981324),new mS.$l(12,20.999948921),new mS.$l(13,22.00299925),new mS.$l(14,23.003574385),new mS.$l(15,24.008099371),new mS.$l(16,25.012094963),new mS.$l(17,26.019633157),new mS.$l(18,27.026892316),new mS.$l(19,28.03567),new mS.$l(20,29.04326)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(6,16.025756907),new mS.$l(7,17.017697565),new mS.$l(8,18.005697066),new mS.$l(9,19.001879839),new mS.$l(10,19.992440176),new mS.$l(11,20.993846744),new mS.$l(12,21.99138551),new mS.$l(13,22.994467337),new mS.$l(14,23.993615074),new mS.$l(15,24.997789899),new mS.$l(16,26.000461498),new mS.$l(17,27.0076152),new mS.$l(18,28.012108072),new mS.$l(19,29.019345902),new mS.$l(20,30.023872),new mS.$l(21,31.03311),new mS.$l(22,32.03991)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(7,18.02718),new mS.$l(8,19.01387945),new mS.$l(9,20.00734826),new mS.$l(10,20.997655099),new mS.$l(11,21.994436782),new mS.$l(12,22.989769675),new mS.$l(13,23.990963332),new mS.$l(14,24.989954352),new mS.$l(15,25.992589898),new mS.$l(16,26.994008702),new mS.$l(17,27.99889041),new mS.$l(18,29.002811301),new mS.$l(19,30.009226487),new mS.$l(20,31.013595108),new mS.$l(21,32.019649792),new mS.$l(22,33.027386),new mS.$l(23,34.0349),new mS.$l(24,35.04418)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(8,20.018862744),new mS.$l(9,21.011714174),new mS.$l(10,21.999574055),new mS.$l(11,22.99412485),new mS.$l(12,23.985041898),new mS.$l(13,24.985837023),new mS.$l(14,25.98259304),new mS.$l(15,26.984340742),new mS.$l(16,27.983876703),new mS.$l(17,28.988554743),new mS.$l(18,29.990464529),new mS.$l(19,30.996548459),new mS.$l(20,31.999145889),new mS.$l(21,33.005586975),new mS.$l(22,34.00907244),new mS.$l(23,35.018669),new mS.$l(24,36.02245),new mS.$l(25,37.03124)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(8,21.02804),new mS.$l(9,22.01952),new mS.$l(10,23.0072649),new mS.$l(11,23.999940911),new mS.$l(12,24.990428555),new mS.$l(13,25.986891659),new mS.$l(14,26.981538441),new mS.$l(15,27.981910184),new mS.$l(16,28.980444848),new mS.$l(17,29.982960304),new mS.$l(18,30.983946023),new mS.$l(19,31.988124379),new mS.$l(20,32.990869587),new mS.$l(21,33.996927255),new mS.$l(22,34.99993765),new mS.$l(23,36.006351501),new mS.$l(24,37.01031),new mS.$l(25,38.0169),new mS.$l(26,39.0219)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(8,22.03453),new mS.$l(9,23.02552),new mS.$l(10,24.011545711),new mS.$l(11,25.00410664),new mS.$l(12,25.992329935),new mS.$l(13,26.986704764),new mS.$l(14,27.976926533),new mS.$l(15,28.976494719),new mS.$l(16,29.973770218),new mS.$l(17,30.975363275),new mS.$l(18,31.974148129),new mS.$l(19,32.97800052),new mS.$l(20,33.978575745),new mS.$l(21,34.984584158),new mS.$l(22,35.986687363),new mS.$l(23,36.99299599),new mS.$l(24,37.99598),new mS.$l(25,39.0023),new mS.$l(26,40.0058),new mS.$l(27,41.0127),new mS.$l(28,42.0161)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(9,24.03435),new mS.$l(10,25.02026),new mS.$l(11,26.01178),new mS.$l(12,26.999191645),new mS.$l(13,27.99231233),new mS.$l(14,28.981801376),new mS.$l(15,29.978313807),new mS.$l(16,30.973761512),new mS.$l(17,31.973907163),new mS.$l(18,32.971725281),new mS.$l(19,33.973636381),new mS.$l(20,34.973314249),new mS.$l(21,35.978259824),new mS.$l(22,36.979608338),new mS.$l(23,37.98447),new mS.$l(24,38.98642),new mS.$l(25,39.99105),new mS.$l(26,40.9948),new mS.$l(27,42.00009),new mS.$l(28,43.00331),new mS.$l(29,44.00988),new mS.$l(30,45.01514),new mS.$l(31,46.02383)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(10,26.02788),new mS.$l(11,27.018795),new mS.$l(12,28.004372661),new mS.$l(13,28.996608805),new mS.$l(14,29.984902954),new mS.$l(15,30.979554421),new mS.$l(16,31.97207069),new mS.$l(17,32.971458497),new mS.$l(18,33.967866831),new mS.$l(19,34.96903214),new mS.$l(20,35.96708088),new mS.$l(21,36.971125716),new mS.$l(22,37.971163443),new mS.$l(23,38.975135275),new mS.$l(24,39.97547),new mS.$l(25,40.98003),new mS.$l(26,41.98149),new mS.$l(27,42.9866),new mS.$l(28,43.98832),new mS.$l(29,44.99482),new mS.$l(30,45.99957),new mS.$l(31,47.00762),new mS.$l(32,48.01299),new mS.$l(33,49.02201)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(11,28.02851),new mS.$l(12,29.01411),new mS.$l(13,30.00477),new mS.$l(14,30.992416014),new mS.$l(15,31.985688908),new mS.$l(16,32.977451798),new mS.$l(17,33.973761967),new mS.$l(18,34.968852707),new mS.$l(19,35.968306945),new mS.$l(20,36.9659026),new mS.$l(21,37.96801055),new mS.$l(22,38.968007677),new mS.$l(23,39.970415555),new mS.$l(24,40.970650212),new mS.$l(25,41.973174994),new mS.$l(26,42.974203385),new mS.$l(27,43.978538712),new mS.$l(28,44.9797),new mS.$l(29,45.98412),new mS.$l(30,46.98795),new mS.$l(31,47.99485),new mS.$l(32,48.99989),new mS.$l(33,50.00773),new mS.$l(34,51.01353)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(12,30.02156),new mS.$l(13,31.012126),new mS.$l(14,31.99766066),new mS.$l(15,32.989928719),new mS.$l(16,33.980270118),new mS.$l(17,34.975256726),new mS.$l(18,35.967546282),new mS.$l(19,36.966775912),new mS.$l(20,37.962732161),new mS.$l(21,38.964313413),new mS.$l(22,39.962383123),new mS.$l(23,40.964500828),new mS.$l(24,41.963046386),new mS.$l(25,42.965670701),new mS.$l(26,43.965365269),new mS.$l(27,44.968094979),new mS.$l(28,45.968093467),new mS.$l(29,46.972186238),new mS.$l(30,47.97507),new mS.$l(31,48.98218),new mS.$l(32,49.98594),new mS.$l(33,50.99324),new mS.$l(34,51.99817),new mS.$l(35,53.006227)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(13,32.02192),new mS.$l(14,33.00726),new mS.$l(15,33.99841),new mS.$l(16,34.988011615),new mS.$l(17,35.981293405),new mS.$l(18,36.973376915),new mS.$l(19,37.969080107),new mS.$l(20,38.963706861),new mS.$l(21,39.963998672),new mS.$l(22,40.961825972),new mS.$l(23,41.962403059),new mS.$l(24,42.960715746),new mS.$l(25,43.961556146),new mS.$l(26,44.960699658),new mS.$l(27,45.961976203),new mS.$l(28,46.961677807),new mS.$l(29,47.965512946),new mS.$l(30,48.967450084),new mS.$l(31,49.972782832),new mS.$l(32,50.97638),new mS.$l(33,51.98261),new mS.$l(34,52.98712),new mS.$l(35,53.99399),new mS.$l(36,54.999388)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(14,34.01412),new mS.$l(15,35.004765),new mS.$l(16,35.993087234),new mS.$l(17,36.985871505),new mS.$l(18,37.976318637),new mS.$l(19,38.970717729),new mS.$l(20,39.962591155),new mS.$l(21,40.962278349),new mS.$l(22,41.958618337),new mS.$l(23,42.958766833),new mS.$l(24,43.955481094),new mS.$l(25,44.956185938),new mS.$l(26,45.953692759),new mS.$l(27,46.954546459),new mS.$l(28,47.952533512),new mS.$l(29,48.955673302),new mS.$l(30,49.957518286),new mS.$l(31,50.961474238),new mS.$l(32,51.9651),new mS.$l(33,52.97005),new mS.$l(34,53.97468),new mS.$l(35,54.98055),new mS.$l(36,55.98579),new mS.$l(37,56.992356)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(15,36.01492),new mS.$l(16,37.00305),new mS.$l(17,37.9947),new mS.$l(18,38.984790009),new mS.$l(19,39.977964014),new mS.$l(20,40.969251316),new mS.$l(21,41.965516761),new mS.$l(22,42.96115098),new mS.$l(23,43.959403048),new mS.$l(24,44.955910243),new mS.$l(25,45.95517025),new mS.$l(26,46.952408027),new mS.$l(27,47.952234991),new mS.$l(28,48.950024065),new mS.$l(29,49.952187008),new mS.$l(30,50.9536027),new mS.$l(31,51.95665),new mS.$l(32,52.95817),new mS.$l(33,53.963),new mS.$l(34,54.9694),new mS.$l(35,55.97266),new mS.$l(36,56.97704),new mS.$l(37,57.98307),new mS.$l(38,58.988041)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(16,38.00977),new mS.$l(17,39.001323),new mS.$l(18,39.990498907),new mS.$l(19,40.983131),new mS.$l(20,41.973031622),new mS.$l(21,42.968523342),new mS.$l(22,43.959690235),new mS.$l(23,44.958124349),new mS.$l(24,45.952629491),new mS.$l(25,46.951763792),new mS.$l(26,47.947947053),new mS.$l(27,48.947870789),new mS.$l(28,49.944792069),new mS.$l(29,50.946616017),new mS.$l(30,51.946898175),new mS.$l(31,52.949731709),new mS.$l(32,53.95087),new mS.$l(33,54.95512),new mS.$l(34,55.95799),new mS.$l(35,56.9643),new mS.$l(36,57.96611),new mS.$l(37,58.97196),new mS.$l(38,59.97564),new mS.$l(39,60.982018)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(17,40.01109),new mS.$l(18,40.99974),new mS.$l(19,41.99123),new mS.$l(20,42.98065),new mS.$l(21,43.9744),new mS.$l(22,44.965782286),new mS.$l(23,45.960199491),new mS.$l(24,46.954906918),new mS.$l(25,47.95225448),new mS.$l(26,48.948516914),new mS.$l(27,49.947162792),new mS.$l(28,50.943963675),new mS.$l(29,51.944779658),new mS.$l(30,52.944342517),new mS.$l(31,53.946444381),new mS.$l(32,54.947238194),new mS.$l(33,55.95036),new mS.$l(34,56.95236),new mS.$l(35,57.95665),new mS.$l(36,58.9593),new mS.$l(37,59.9645),new mS.$l(38,60.96741),new mS.$l(39,61.97314),new mS.$l(40,62.97675)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(18,42.00643),new mS.$l(19,42.997707),new mS.$l(20,43.98547),new mS.$l(21,44.97916),new mS.$l(22,45.968361649),new mS.$l(23,46.962906512),new mS.$l(24,47.954035861),new mS.$l(25,48.951341135),new mS.$l(26,49.946049607),new mS.$l(27,50.944771767),new mS.$l(28,51.940511904),new mS.$l(29,52.940653781),new mS.$l(30,53.938884921),new mS.$l(31,54.940844164),new mS.$l(32,55.940645238),new mS.$l(33,56.9437538),new mS.$l(34,57.94425),new mS.$l(35,58.94863),new mS.$l(36,59.94973),new mS.$l(37,60.95409),new mS.$l(38,61.9558),new mS.$l(39,62.96186),new mS.$l(40,63.9642),new mS.$l(41,64.97037)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(19,44.00687),new mS.$l(20,44.99451),new mS.$l(21,45.98672),new mS.$l(22,46.9761),new mS.$l(23,47.96887),new mS.$l(24,48.959623415),new mS.$l(25,49.95424396),new mS.$l(26,50.948215487),new mS.$l(27,51.945570079),new mS.$l(28,52.941294702),new mS.$l(29,53.940363247),new mS.$l(30,54.938049636),new mS.$l(31,55.938909366),new mS.$l(32,56.938287458),new mS.$l(33,57.939986451),new mS.$l(34,58.940447166),new mS.$l(35,59.943193998),new mS.$l(36,60.94446),new mS.$l(37,61.94797),new mS.$l(38,62.94981),new mS.$l(39,63.95373),new mS.$l(40,64.9561),new mS.$l(41,65.96082),new mS.$l(42,66.96382)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(19,45.01456),new mS.$l(20,46.00081),new mS.$l(21,46.99289),new mS.$l(22,47.98056),new mS.$l(23,48.97361),new mS.$l(24,49.962993316),new mS.$l(25,50.956824936),new mS.$l(26,51.948116526),new mS.$l(27,52.945312282),new mS.$l(28,53.939614836),new mS.$l(29,54.938298029),new mS.$l(30,55.934942133),new mS.$l(31,56.935398707),new mS.$l(32,57.933280458),new mS.$l(33,58.934880493),new mS.$l(34,59.934076943),new mS.$l(35,60.936749461),new mS.$l(36,61.936770495),new mS.$l(37,62.940118442),new mS.$l(38,63.94087),new mS.$l(39,64.94494),new mS.$l(40,65.94598),new mS.$l(41,66.95),new mS.$l(42,67.95251),new mS.$l(43,68.9577)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(21,48.00176),new mS.$l(22,48.98972),new mS.$l(23,49.98154),new mS.$l(24,50.97072),new mS.$l(25,51.96359),new mS.$l(26,52.954224985),new mS.$l(27,53.948464147),new mS.$l(28,54.942003149),new mS.$l(29,55.939843937),new mS.$l(30,56.936296235),new mS.$l(31,57.935757571),new mS.$l(32,58.933200194),new mS.$l(33,59.933822196),new mS.$l(34,60.932479381),new mS.$l(35,61.934054212),new mS.$l(36,62.933615218),new mS.$l(37,63.935813523),new mS.$l(38,64.936484581),new mS.$l(39,65.939825412),new mS.$l(40,66.94061),new mS.$l(41,67.94436),new mS.$l(42,68.9452),new mS.$l(43,69.94981),new mS.$l(44,70.95173),new mS.$l(45,71.95641)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(22,49.99593),new mS.$l(23,50.98772),new mS.$l(24,51.97568),new mS.$l(25,52.96846),new mS.$l(26,53.957910508),new mS.$l(27,54.951336329),new mS.$l(28,55.942136339),new mS.$l(29,56.939800489),new mS.$l(30,57.935347922),new mS.$l(31,58.934351553),new mS.$l(32,59.930790633),new mS.$l(33,60.931060442),new mS.$l(34,61.928348763),new mS.$l(35,62.929672948),new mS.$l(36,63.927969574),new mS.$l(37,64.930088013),new mS.$l(38,65.929115232),new mS.$l(39,66.931569638),new mS.$l(40,67.931844932),new mS.$l(41,68.935181837),new mS.$l(42,69.93614),new mS.$l(43,70.94),new mS.$l(44,71.9413),new mS.$l(45,72.94608),new mS.$l(46,73.94791),new mS.$l(47,74.95297),new mS.$l(48,75.95533),new mS.$l(49,76.96083),new mS.$l(50,77.9638)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(23,51.99718),new mS.$l(24,52.98555),new mS.$l(25,53.97671),new mS.$l(26,54.96605),new mS.$l(27,55.95856),new mS.$l(28,56.949215695),new mS.$l(29,57.944540734),new mS.$l(30,58.939504114),new mS.$l(31,59.937368123),new mS.$l(32,60.933462181),new mS.$l(33,61.932587299),new mS.$l(34,62.929601079),new mS.$l(35,63.929767865),new mS.$l(36,64.927793707),new mS.$l(37,65.928873041),new mS.$l(38,66.927750294),new mS.$l(39,67.929637875),new mS.$l(40,68.929425281),new mS.$l(41,69.932409287),new mS.$l(42,70.932619818),new mS.$l(43,71.93552),new mS.$l(44,72.93649),new mS.$l(45,73.9402),new mS.$l(46,74.9417),new mS.$l(47,75.94599),new mS.$l(48,76.94795),new mS.$l(49,77.95281),new mS.$l(50,78.95528),new mS.$l(51,79.96189)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(24,53.99295),new mS.$l(25,54.98398),new mS.$l(26,55.97238),new mS.$l(27,56.96491),new mS.$l(28,57.954596465),new mS.$l(29,58.949267074),new mS.$l(30,59.941832031),new mS.$l(31,60.939513907),new mS.$l(32,61.934334132),new mS.$l(33,62.933215563),new mS.$l(34,63.929146578),new mS.$l(35,64.929245079),new mS.$l(36,65.926036763),new mS.$l(37,66.927130859),new mS.$l(38,67.924847566),new mS.$l(39,68.926553538),new mS.$l(40,69.92532487),new mS.$l(41,70.927727195),new mS.$l(42,71.926861122),new mS.$l(43,72.929779469),new mS.$l(44,73.929458261),new mS.$l(45,74.932937379),new mS.$l(46,75.933394207),new mS.$l(47,76.937085857),new mS.$l(48,77.938569576),new mS.$l(49,78.942095175),new mS.$l(50,79.944414722),new mS.$l(51,80.95048),new mS.$l(52,81.95484)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(25,55.99491),new mS.$l(26,56.98293),new mS.$l(27,57.97425),new mS.$l(28,58.96337),new mS.$l(29,59.95706),new mS.$l(30,60.94917),new mS.$l(31,61.944179608),new mS.$l(32,62.939141527),new mS.$l(33,63.936838307),new mS.$l(34,64.932739322),new mS.$l(35,65.931592355),new mS.$l(36,66.928204915),new mS.$l(37,67.927983497),new mS.$l(38,68.925580912),new mS.$l(39,69.926027741),new mS.$l(40,70.92470501),new mS.$l(41,71.92636935),new mS.$l(42,72.925169832),new mS.$l(43,73.926940999),new mS.$l(44,74.926500645),new mS.$l(45,75.928928262),new mS.$l(46,76.929281189),new mS.$l(47,77.93165595),new mS.$l(48,78.932916371),new mS.$l(49,79.936588154),new mS.$l(50,80.937752955),new mS.$l(51,81.94316),new mS.$l(52,82.94687),new mS.$l(53,83.95234)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(26,57.99101),new mS.$l(27,58.98175),new mS.$l(28,59.97019),new mS.$l(29,60.96379),new mS.$l(30,61.95465),new mS.$l(31,62.94964),new mS.$l(32,63.941572638),new mS.$l(33,64.939440762),new mS.$l(34,65.933846798),new mS.$l(35,66.932738415),new mS.$l(36,67.928097266),new mS.$l(37,68.927972002),new mS.$l(38,69.924250365),new mS.$l(39,70.924953991),new mS.$l(40,71.922076184),new mS.$l(41,72.923459361),new mS.$l(42,73.921178213),new mS.$l(43,74.922859494),new mS.$l(44,75.921402716),new mS.$l(45,76.923548462),new mS.$l(46,77.922852886),new mS.$l(47,78.92540156),new mS.$l(48,79.925444764),new mS.$l(49,80.928821065),new mS.$l(50,81.929550326),new mS.$l(51,82.93451),new mS.$l(52,83.93731),new mS.$l(53,84.94269),new mS.$l(54,85.94627)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(27,59.99313),new mS.$l(28,60.98062),new mS.$l(29,61.9732),new mS.$l(30,62.96369),new mS.$l(31,63.957572),new mS.$l(32,64.949484),new mS.$l(33,65.944099147),new mS.$l(34,66.939190417),new mS.$l(35,67.936792976),new mS.$l(36,68.932280154),new mS.$l(37,69.930927811),new mS.$l(38,70.927114724),new mS.$l(39,71.926752647),new mS.$l(40,72.923825288),new mS.$l(41,73.923929076),new mS.$l(42,74.921596417),new mS.$l(43,75.922393933),new mS.$l(44,76.920647703),new mS.$l(45,77.921828577),new mS.$l(46,78.920948498),new mS.$l(47,79.922578162),new mS.$l(48,80.922132884),new mS.$l(49,81.924504668),new mS.$l(50,82.924980625),new mS.$l(51,83.92906),new mS.$l(52,84.93181),new mS.$l(53,85.93623),new mS.$l(54,86.93958),new mS.$l(55,87.94456),new mS.$l(56,88.94923)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(31,64.96466),new mS.$l(32,65.95521),new mS.$l(33,66.95009),new mS.$l(34,67.94187),new mS.$l(35,68.939562155),new mS.$l(36,69.933504),new mS.$l(37,70.931868378),new mS.$l(38,71.927112313),new mS.$l(39,72.9267668),new mS.$l(40,73.922476561),new mS.$l(41,74.922523571),new mS.$l(42,75.919214107),new mS.$l(43,76.91991461),new mS.$l(44,77.917309522),new mS.$l(45,78.918499802),new mS.$l(46,79.916521828),new mS.$l(47,80.917992931),new mS.$l(48,81.9167),new mS.$l(49,82.919119072),new mS.$l(50,83.918464523),new mS.$l(51,84.922244678),new mS.$l(52,85.924271165),new mS.$l(53,86.928520749),new mS.$l(54,87.931423982),new mS.$l(55,88.93602),new mS.$l(56,89.93942),new mS.$l(57,90.94537),new mS.$l(58,91.94933)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(32,66.96479),new mS.$l(33,67.958248),new mS.$l(34,68.950178),new mS.$l(35,69.944208),new mS.$l(36,70.939246),new mS.$l(37,71.936496876),new mS.$l(38,72.931794889),new mS.$l(39,73.929891152),new mS.$l(40,74.92577641),new mS.$l(41,75.924541974),new mS.$l(42,76.921380123),new mS.$l(43,77.92114613),new mS.$l(44,78.918337647),new mS.$l(45,79.918529952),new mS.$l(46,80.91629106),new mS.$l(47,81.916804666),new mS.$l(48,82.915180219),new mS.$l(49,83.916503685),new mS.$l(50,84.915608027),new mS.$l(51,85.918797162),new mS.$l(52,86.920710713),new mS.$l(53,87.924065908),new mS.$l(54,88.92638726),new mS.$l(55,89.930634988),new mS.$l(56,90.9339653),new mS.$l(57,91.939255258),new mS.$l(58,92.9431),new mS.$l(59,93.94868)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(33,68.96532),new mS.$l(34,69.95601),new mS.$l(35,70.95051),new mS.$l(36,71.94190754),new mS.$l(37,72.938931115),new mS.$l(38,73.933258225),new mS.$l(39,74.931033794),new mS.$l(40,75.925948304),new mS.$l(41,76.92466788),new mS.$l(42,77.920386271),new mS.$l(43,78.920082992),new mS.$l(44,79.91637804),new mS.$l(45,80.916592419),new mS.$l(46,81.913484601),new mS.$l(47,82.914135952),new mS.$l(48,83.911506627),new mS.$l(49,84.912526954),new mS.$l(50,85.910610313),new mS.$l(51,86.913354251),new mS.$l(52,87.914446951),new mS.$l(53,88.917632505),new mS.$l(54,89.919523803),new mS.$l(55,90.923442418),new mS.$l(56,91.926152752),new mS.$l(57,92.931265246),new mS.$l(58,93.934362),new mS.$l(59,94.93984),new mS.$l(60,95.94307),new mS.$l(61,96.94856)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(34,70.96532),new mS.$l(35,71.95908),new mS.$l(36,72.950366),new mS.$l(37,73.944470376),new mS.$l(38,74.938569199),new mS.$l(39,75.935071448),new mS.$l(40,76.930406599),new mS.$l(41,77.928141485),new mS.$l(42,78.923996719),new mS.$l(43,79.922519322),new mS.$l(44,80.918994165),new mS.$l(45,81.918207691),new mS.$l(46,82.915111951),new mS.$l(47,83.914384676),new mS.$l(48,84.911789341),new mS.$l(49,85.91116708),new mS.$l(50,86.909183465),new mS.$l(51,87.911318556),new mS.$l(52,88.912279939),new mS.$l(53,89.914808941),new mS.$l(54,90.91653416),new mS.$l(55,91.919725442),new mS.$l(56,92.922032765),new mS.$l(57,93.926407326),new mS.$l(58,94.92931926),new mS.$l(59,95.934283962),new mS.$l(60,96.937342863),new mS.$l(61,97.941703557),new mS.$l(62,98.945420616),new mS.$l(63,99.94987),new mS.$l(64,100.953195994),new mS.$l(65,101.95921)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(35,72.96597),new mS.$l(36,73.95631),new mS.$l(37,74.94992),new mS.$l(38,75.94161),new mS.$l(39,76.937761511),new mS.$l(40,77.932179362),new mS.$l(41,78.929707076),new mS.$l(42,79.924524588),new mS.$l(43,80.923213095),new mS.$l(44,81.918401258),new mS.$l(45,82.917555029),new mS.$l(46,83.913424778),new mS.$l(47,84.912932689),new mS.$l(48,85.909262351),new mS.$l(49,86.908879316),new mS.$l(50,87.905614339),new mS.$l(51,88.907452906),new mS.$l(52,89.907737596),new mS.$l(53,90.910209845),new mS.$l(54,91.911029895),new mS.$l(55,92.91402241),new mS.$l(56,93.915359856),new mS.$l(57,94.919358213),new mS.$l(58,95.921680473),new mS.$l(59,96.926148757),new mS.$l(60,97.928471177),new mS.$l(61,98.933315038),new mS.$l(62,99.935351729),new mS.$l(63,100.940517434),new mS.$l(64,101.943018795),new mS.$l(65,102.94895),new mS.$l(66,103.95233)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(38,76.94962),new mS.$l(39,77.9435),new mS.$l(40,78.937350712),new mS.$l(41,79.931982402),new mS.$l(42,80.929128719),new mS.$l(43,81.926792071),new mS.$l(44,82.922352572),new mS.$l(45,83.920387768),new mS.$l(46,84.916427076),new mS.$l(47,85.914887724),new mS.$l(48,86.910877833),new mS.$l(49,87.909503361),new mS.$l(50,88.905847902),new mS.$l(51,89.907151443),new mS.$l(52,90.907303415),new mS.$l(53,91.908946832),new mS.$l(54,92.909581582),new mS.$l(55,93.911594008),new mS.$l(56,94.912823709),new mS.$l(57,95.915897787),new mS.$l(58,96.918131017),new mS.$l(59,97.922219525),new mS.$l(60,98.924634736),new mS.$l(61,99.927756402),new mS.$l(62,100.930313395),new mS.$l(63,101.933555501),new mS.$l(64,102.93694),new mS.$l(65,103.94145),new mS.$l(66,104.94509),new mS.$l(67,105.95022)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(39,78.94916),new mS.$l(40,79.94055),new mS.$l(41,80.936815296),new mS.$l(42,81.931086249),new mS.$l(43,82.92865213),new mS.$l(44,83.92325),new mS.$l(45,84.92146522),new mS.$l(46,85.916472851),new mS.$l(47,86.914816578),new mS.$l(48,87.910226179),new mS.$l(49,88.908888916),new mS.$l(50,89.904703679),new mS.$l(51,90.905644968),new mS.$l(52,91.905040106),new mS.$l(53,92.906475627),new mS.$l(54,93.906315765),new mS.$l(55,94.908042739),new mS.$l(56,95.908275675),new mS.$l(57,96.910950716),new mS.$l(58,97.912746366),new mS.$l(59,98.916511084),new mS.$l(60,99.917761704),new mS.$l(61,100.921139958),new mS.$l(62,101.922981089),new mS.$l(63,102.926597062),new mS.$l(64,103.92878),new mS.$l(65,104.93305),new mS.$l(66,105.93591),new mS.$l(67,106.94086),new mS.$l(68,107.94428)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(40,80.94905),new mS.$l(41,81.94313),new mS.$l(42,82.936703713),new mS.$l(43,83.93357),new mS.$l(44,84.927906486),new mS.$l(45,85.925037588),new mS.$l(46,86.920361435),new mS.$l(47,87.91833144),new mS.$l(48,88.913495503),new mS.$l(49,89.911264109),new mS.$l(50,90.906990538),new mS.$l(51,91.907193214),new mS.$l(52,92.906377543),new mS.$l(53,93.907283457),new mS.$l(54,94.906835178),new mS.$l(55,95.908100076),new mS.$l(56,96.908097144),new mS.$l(57,97.91033069),new mS.$l(58,98.911617864),new mS.$l(59,99.914181434),new mS.$l(60,100.915251567),new mS.$l(61,101.918037417),new mS.$l(62,102.919141297),new mS.$l(63,103.922459464),new mS.$l(64,104.923934023),new mS.$l(65,105.92819),new mS.$l(66,106.93031),new mS.$l(67,107.93501),new mS.$l(68,108.93763),new mS.$l(69,109.94268)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(41,82.94874),new mS.$l(42,83.94009),new mS.$l(43,84.93659),new mS.$l(44,85.930695167),new mS.$l(45,86.92732683),new mS.$l(46,87.921952728),new mS.$l(47,88.919480562),new mS.$l(48,89.913936161),new mS.$l(49,90.911750754),new mS.$l(50,91.90681048),new mS.$l(51,92.906812213),new mS.$l(52,93.905087578),new mS.$l(53,94.905841487),new mS.$l(54,95.904678904),new mS.$l(55,96.906021033),new mS.$l(56,97.905407846),new mS.$l(57,98.907711598),new mS.$l(58,99.907477149),new mS.$l(59,100.910346543),new mS.$l(60,101.910297162),new mS.$l(61,102.913204596),new mS.$l(62,103.913758387),new mS.$l(63,104.916972087),new mS.$l(64,105.918134284),new mS.$l(65,106.921694724),new mS.$l(66,107.923973837),new mS.$l(67,108.92781),new mS.$l(68,109.92973),new mS.$l(69,110.93451),new mS.$l(70,111.93684),new mS.$l(71,112.94203)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(42,84.94894),new mS.$l(43,85.94288),new mS.$l(44,86.93653),new mS.$l(45,87.93283),new mS.$l(46,88.92754288),new mS.$l(47,89.92355583),new mS.$l(48,90.9184282),new mS.$l(49,91.915259655),new mS.$l(50,92.910248473),new mS.$l(51,93.909656309),new mS.$l(52,94.907656454),new mS.$l(53,95.907870803),new mS.$l(54,96.906364843),new mS.$l(55,97.907215692),new mS.$l(56,98.906254554),new mS.$l(57,99.907657594),new mS.$l(58,100.90731438),new mS.$l(59,101.909212938),new mS.$l(60,102.909178805),new mS.$l(61,103.911444898),new mS.$l(62,104.911658043),new mS.$l(63,105.914355408),new mS.$l(64,106.915081691),new mS.$l(65,107.918479973),new mS.$l(66,108.919980998),new mS.$l(67,109.92339),new mS.$l(68,110.92505),new mS.$l(69,111.92924),new mS.$l(70,112.93133),new mS.$l(71,113.93588),new mS.$l(72,114.93828)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(43,86.94918),new mS.$l(44,87.94042),new mS.$l(45,88.93611),new mS.$l(46,89.92978),new mS.$l(47,90.926377434),new mS.$l(48,91.92012),new mS.$l(49,92.917051523),new mS.$l(50,93.911359569),new mS.$l(51,94.910412729),new mS.$l(52,95.907597681),new mS.$l(53,96.907554546),new mS.$l(54,97.905287111),new mS.$l(55,98.905939307),new mS.$l(56,99.904219664),new mS.$l(57,100.905582219),new mS.$l(58,101.904349503),new mS.$l(59,102.906323677),new mS.$l(60,103.905430145),new mS.$l(61,104.907750341),new mS.$l(62,105.907326913),new mS.$l(63,106.909907207),new mS.$l(64,107.910192211),new mS.$l(65,108.913201565),new mS.$l(66,109.913966185),new mS.$l(67,110.91756),new mS.$l(68,111.918821673),new mS.$l(69,112.92254),new mS.$l(70,113.923891981),new mS.$l(71,114.92831),new mS.$l(72,115.93016),new mS.$l(73,116.93479),new mS.$l(74,117.93703)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(44,88.94938),new mS.$l(45,89.94287),new mS.$l(46,90.93655),new mS.$l(47,91.93198),new mS.$l(48,92.92574),new mS.$l(49,93.921698),new mS.$l(50,94.915898541),new mS.$l(51,95.914518212),new mS.$l(52,96.911336643),new mS.$l(53,97.910716431),new mS.$l(54,98.908132101),new mS.$l(55,99.90811663),new mS.$l(56,100.906163526),new mS.$l(57,101.906842845),new mS.$l(58,102.905504182),new mS.$l(59,103.906655315),new mS.$l(60,104.905692444),new mS.$l(61,105.907284615),new mS.$l(62,106.90675054),new mS.$l(63,107.908730768),new mS.$l(64,108.908735621),new mS.$l(65,109.910949525),new mS.$l(66,110.91166),new mS.$l(67,111.913969253),new mS.$l(68,112.91542),new mS.$l(69,113.91734336),new mS.$l(70,114.920124676),new mS.$l(71,115.922746643),new mS.$l(72,116.92535),new mS.$l(73,117.92943),new mS.$l(74,118.93136),new mS.$l(75,119.93578),new mS.$l(76,120.93808)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(45,90.94948),new mS.$l(46,91.94042),new mS.$l(47,92.93591),new mS.$l(48,93.92877),new mS.$l(49,94.92469),new mS.$l(50,95.91822194),new mS.$l(51,96.916478921),new mS.$l(52,97.912720751),new mS.$l(53,98.911767757),new mS.$l(54,99.908504596),new mS.$l(55,100.908289144),new mS.$l(56,101.905607716),new mS.$l(57,102.906087204),new mS.$l(58,103.904034912),new mS.$l(59,104.905084046),new mS.$l(60,105.903483087),new mS.$l(61,106.905128453),new mS.$l(62,107.903894451),new mS.$l(63,108.905953535),new mS.$l(64,109.905152385),new mS.$l(65,110.907643952),new mS.$l(66,111.907313277),new mS.$l(67,112.910151346),new mS.$l(68,113.910365322),new mS.$l(69,114.91368341),new mS.$l(70,115.914158288),new mS.$l(71,116.91784),new mS.$l(72,117.918983915),new mS.$l(73,118.92268),new mS.$l(74,119.92403),new mS.$l(75,120.92818),new mS.$l(76,121.9298),new mS.$l(77,122.93426)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(47,93.94278),new mS.$l(48,94.93548),new mS.$l(49,95.93068),new mS.$l(50,96.924),new mS.$l(51,97.921759995),new mS.$l(52,98.917597103),new mS.$l(53,99.916069387),new mS.$l(54,100.912802135),new mS.$l(55,101.911999996),new mS.$l(56,102.908972453),new mS.$l(57,103.908628228),new mS.$l(58,104.906528234),new mS.$l(59,105.906666431),new mS.$l(60,106.90509302),new mS.$l(61,107.905953705),new mS.$l(62,108.904755514),new mS.$l(63,109.90611046),new mS.$l(64,110.905294679),new mS.$l(65,111.907004132),new mS.$l(66,112.906565708),new mS.$l(67,113.908807907),new mS.$l(68,114.908762282),new mS.$l(69,115.911359558),new mS.$l(70,116.911684187),new mS.$l(71,117.914582383),new mS.$l(72,118.915666045),new mS.$l(73,119.918788609),new mS.$l(74,120.919851074),new mS.$l(75,121.92332),new mS.$l(76,122.9249),new mS.$l(77,123.92853),new mS.$l(78,124.93054),new mS.$l(79,125.9345),new mS.$l(80,126.93688)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(48,95.93977),new mS.$l(49,96.93494),new mS.$l(50,97.927579),new mS.$l(51,98.92501),new mS.$l(52,99.920230232),new mS.$l(53,100.918681442),new mS.$l(54,101.914777255),new mS.$l(55,102.913418952),new mS.$l(56,103.909848091),new mS.$l(57,104.909467818),new mS.$l(58,105.906458007),new mS.$l(59,106.906614232),new mS.$l(60,107.904183403),new mS.$l(61,108.904985569),new mS.$l(62,109.903005578),new mS.$l(63,110.904181628),new mS.$l(64,111.902757226),new mS.$l(65,112.904400947),new mS.$l(66,113.903358121),new mS.$l(67,114.905430553),new mS.$l(68,115.904755434),new mS.$l(69,116.907218242),new mS.$l(70,117.906914144),new mS.$l(71,118.909922582),new mS.$l(72,119.909851352),new mS.$l(73,120.91298039),new mS.$l(74,121.9135),new mS.$l(75,122.917003675),new mS.$l(76,123.917648302),new mS.$l(77,124.92124717),new mS.$l(78,125.922353996),new mS.$l(79,126.926434822),new mS.$l(80,127.927760617),new mS.$l(81,128.93226),new mS.$l(82,129.93398)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(49,97.94224),new mS.$l(50,98.93461),new mS.$l(51,99.931149033),new mS.$l(52,100.92656),new mS.$l(53,101.924707541),new mS.$l(54,102.919913896),new mS.$l(55,103.918338416),new mS.$l(56,104.914673434),new mS.$l(57,105.913461134),new mS.$l(58,106.910292195),new mS.$l(59,107.909719683),new mS.$l(60,108.907154078),new mS.$l(61,109.907168783),new mS.$l(62,110.905110677),new mS.$l(63,111.905533338),new mS.$l(64,112.904061223),new mS.$l(65,113.904916758),new mS.$l(66,114.903878328),new mS.$l(67,115.905259995),new mS.$l(68,116.904515731),new mS.$l(69,117.906354623),new mS.$l(70,118.905846334),new mS.$l(71,119.907961505),new mS.$l(72,120.907848847),new mS.$l(73,121.910277103),new mS.$l(74,122.910438951),new mS.$l(75,123.913175916),new mS.$l(76,124.913601387),new mS.$l(77,125.916464532),new mS.$l(78,126.917344048),new mS.$l(79,127.920170658),new mS.$l(80,128.921657958),new mS.$l(81,129.924854941),new mS.$l(82,130.926767408),new mS.$l(83,131.932919005),new mS.$l(84,132.93834),new mS.$l(85,133.94466)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(50,99.938954),new mS.$l(51,100.93606),new mS.$l(52,101.93049),new mS.$l(53,102.92813),new mS.$l(54,103.923185469),new mS.$l(55,104.921390409),new mS.$l(56,105.916880472),new mS.$l(57,106.915666702),new mS.$l(58,107.911965339),new mS.$l(59,108.911286879),new mS.$l(60,109.907852688),new mS.$l(61,110.907735404),new mS.$l(62,111.90482081),new mS.$l(63,112.905173373),new mS.$l(64,113.902781816),new mS.$l(65,114.903345973),new mS.$l(66,115.901744149),new mS.$l(67,116.902953765),new mS.$l(68,117.901606328),new mS.$l(69,118.90330888),new mS.$l(70,119.902196571),new mS.$l(71,120.904236867),new mS.$l(72,121.903440138),new mS.$l(73,122.905721901),new mS.$l(74,123.90527463),new mS.$l(75,124.907784924),new mS.$l(76,125.907653953),new mS.$l(77,126.91035098),new mS.$l(78,127.910534953),new mS.$l(79,128.913439976),new mS.$l(80,129.913852185),new mS.$l(81,130.916919144),new mS.$l(82,131.917744455),new mS.$l(83,132.923814085),new mS.$l(84,133.928463576),new mS.$l(85,134.93473),new mS.$l(86,135.93934),new mS.$l(87,136.94579)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(52,102.94012),new mS.$l(53,103.936287),new mS.$l(54,104.931528593),new mS.$l(55,105.928183134),new mS.$l(56,106.92415),new mS.$l(57,107.92216),new mS.$l(58,108.918136092),new mS.$l(59,109.917533911),new mS.$l(60,110.912534147),new mS.$l(61,111.91239464),new mS.$l(62,112.909377941),new mS.$l(63,113.909095876),new mS.$l(64,114.906598812),new mS.$l(65,115.906797235),new mS.$l(66,116.90483959),new mS.$l(67,117.905531885),new mS.$l(68,118.90394646),new mS.$l(69,119.905074315),new mS.$l(70,120.903818044),new mS.$l(71,121.905175415),new mS.$l(72,122.904215696),new mS.$l(73,123.905937525),new mS.$l(74,124.905247804),new mS.$l(75,125.907248153),new mS.$l(76,126.906914564),new mS.$l(77,127.90916733),new mS.$l(78,128.909150092),new mS.$l(79,129.911546459),new mS.$l(80,130.911946487),new mS.$l(81,131.914413247),new mS.$l(82,132.915236466),new mS.$l(83,133.920551554),new mS.$l(84,134.925167962),new mS.$l(85,135.93066),new mS.$l(86,136.93531),new mS.$l(87,137.94096),new mS.$l(88,138.94571)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(54,105.937702),new mS.$l(55,106.935036),new mS.$l(56,107.929486838),new mS.$l(57,108.927456483),new mS.$l(58,109.922407164),new mS.$l(59,110.921120589),new mS.$l(60,111.917061617),new mS.$l(61,112.915452551),new mS.$l(62,113.912498025),new mS.$l(63,114.911578627),new mS.$l(64,115.908420253),new mS.$l(65,116.90863418),new mS.$l(66,117.905825187),new mS.$l(67,118.90640811),new mS.$l(68,119.904019891),new mS.$l(69,120.904929815),new mS.$l(70,121.903047064),new mS.$l(71,122.904272951),new mS.$l(72,123.902819466),new mS.$l(73,124.904424718),new mS.$l(74,125.903305543),new mS.$l(75,126.90521729),new mS.$l(76,127.904461383),new mS.$l(77,128.906595593),new mS.$l(78,129.906222753),new mS.$l(79,130.90852188),new mS.$l(80,131.908523782),new mS.$l(81,132.910939068),new mS.$l(82,133.911540546),new mS.$l(83,134.916450782),new mS.$l(84,135.920103155),new mS.$l(85,136.925324769),new mS.$l(86,137.92922),new mS.$l(87,138.93473),new mS.$l(88,139.9387),new mS.$l(89,140.94439),new mS.$l(90,141.9485)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(55,107.943291),new mS.$l(56,108.938191658),new mS.$l(57,109.934634181),new mS.$l(58,110.930276),new mS.$l(59,111.92797),new mS.$l(60,112.923644245),new mS.$l(61,113.92185),new mS.$l(62,114.918272),new mS.$l(63,115.916735014),new mS.$l(64,116.913647692),new mS.$l(65,117.91337523),new mS.$l(66,118.910180837),new mS.$l(67,119.910047843),new mS.$l(68,120.907366063),new mS.$l(69,121.907592451),new mS.$l(70,122.905597944),new mS.$l(71,123.906211423),new mS.$l(72,124.90462415),new mS.$l(73,125.905619387),new mS.$l(74,126.90446842),new mS.$l(75,127.905805254),new mS.$l(76,128.904987487),new mS.$l(77,129.906674018),new mS.$l(78,130.906124168),new mS.$l(79,131.907994525),new mS.$l(80,132.907806465),new mS.$l(81,133.909876552),new mS.$l(82,134.91005031),new mS.$l(83,135.914655105),new mS.$l(84,136.917872653),new mS.$l(85,137.922383666),new mS.$l(86,138.926093402),new mS.$l(87,139.93121),new mS.$l(88,140.93483),new mS.$l(89,141.94018),new mS.$l(90,142.94407),new mS.$l(91,143.94961)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(56,109.944476),new mS.$l(57,110.941632),new mS.$l(58,111.93566535),new mS.$l(59,112.933382836),new mS.$l(60,113.928145),new mS.$l(61,114.926979032),new mS.$l(62,115.921394197),new mS.$l(63,116.920564355),new mS.$l(64,117.91657092),new mS.$l(65,118.915554295),new mS.$l(66,119.91215199),new mS.$l(67,120.911386497),new mS.$l(68,121.908548396),new mS.$l(69,122.908470748),new mS.$l(70,123.905895774),new mS.$l(71,124.906398236),new mS.$l(72,125.904268868),new mS.$l(73,126.905179581),new mS.$l(74,127.903530436),new mS.$l(75,128.904779458),new mS.$l(76,129.903507903),new mS.$l(77,130.90508192),new mS.$l(78,131.904154457),new mS.$l(79,132.90590566),new mS.$l(80,133.905394504),new mS.$l(81,134.907207499),new mS.$l(82,135.907219526),new mS.$l(83,136.911562939),new mS.$l(84,137.913988549),new mS.$l(85,138.918786859),new mS.$l(86,139.921635665),new mS.$l(87,140.926646282),new mS.$l(88,141.929702981),new mS.$l(89,142.93489),new mS.$l(90,143.93823),new mS.$l(91,144.94367),new mS.$l(92,145.9473),new mS.$l(93,146.95301)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(57,111.950331),new mS.$l(58,112.944535512),new mS.$l(59,113.940841319),new mS.$l(60,114.935939),new mS.$l(61,115.932914152),new mS.$l(62,116.928639484),new mS.$l(63,117.926554883),new mS.$l(64,118.922370879),new mS.$l(65,119.920678219),new mS.$l(66,120.917183637),new mS.$l(67,121.916121946),new mS.$l(68,122.912990168),new mS.$l(69,123.912245731),new mS.$l(70,124.909724871),new mS.$l(71,125.909447953),new mS.$l(72,126.9074176),new mS.$l(73,127.907747919),new mS.$l(74,128.906063369),new mS.$l(75,129.906706163),new mS.$l(76,130.905460232),new mS.$l(77,131.906429799),new mS.$l(78,132.90544687),new mS.$l(79,133.906713419),new mS.$l(80,134.905971903),new mS.$l(81,135.907305741),new mS.$l(82,136.907083505),new mS.$l(83,137.911010537),new mS.$l(84,138.913357921),new mS.$l(85,139.917277075),new mS.$l(86,140.920043984),new mS.$l(87,141.924292317),new mS.$l(88,142.927330292),new mS.$l(89,143.932027373),new mS.$l(90,144.935388226),new mS.$l(91,145.940162028),new mS.$l(92,146.943864435),new mS.$l(93,147.948899539),new mS.$l(94,148.95272),new mS.$l(95,149.95797),new mS.$l(96,150.962)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(58,113.950941),new mS.$l(59,114.94771),new mS.$l(60,115.94168),new mS.$l(61,116.937700229),new mS.$l(62,117.93344),new mS.$l(63,118.931051927),new mS.$l(64,119.926045941),new mS.$l(65,120.924485908),new mS.$l(66,121.92026),new mS.$l(67,122.91885),new mS.$l(68,123.915088437),new mS.$l(69,124.914620234),new mS.$l(70,125.911244146),new mS.$l(71,126.911121328),new mS.$l(72,127.90830887),new mS.$l(73,128.908673749),new mS.$l(74,129.906310478),new mS.$l(75,130.906930798),new mS.$l(76,131.905056152),new mS.$l(77,132.906002368),new mS.$l(78,133.904503347),new mS.$l(79,134.905682749),new mS.$l(80,135.904570109),new mS.$l(81,136.905821414),new mS.$l(82,137.905241273),new mS.$l(83,138.908835384),new mS.$l(84,139.910599485),new mS.$l(85,140.914406439),new mS.$l(86,141.916448175),new mS.$l(87,142.920617184),new mS.$l(88,143.922940468),new mS.$l(89,144.926923807),new mS.$l(90,145.930106645),new mS.$l(91,146.933992519),new mS.$l(92,147.937682377),new mS.$l(93,148.94246),new mS.$l(94,149.94562),new mS.$l(95,150.9507),new mS.$l(96,151.95416),new mS.$l(97,152.95961)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(60,116.95001),new mS.$l(61,117.94657),new mS.$l(62,118.94099),new mS.$l(63,119.93807),new mS.$l(64,120.93301),new mS.$l(65,121.93071),new mS.$l(66,122.92624),new mS.$l(67,123.92453),new mS.$l(68,124.92067),new mS.$l(69,125.91937),new mS.$l(70,126.91616),new mS.$l(71,127.91544794),new mS.$l(72,128.912667334),new mS.$l(73,129.91232),new mS.$l(74,130.910108489),new mS.$l(75,131.910110399),new mS.$l(76,132.908396372),new mS.$l(77,133.908489607),new mS.$l(78,134.906971003),new mS.$l(79,135.907651181),new mS.$l(80,136.906465656),new mS.$l(81,137.907106826),new mS.$l(82,138.90634816),new mS.$l(83,139.909472552),new mS.$l(84,140.910957016),new mS.$l(85,141.914074489),new mS.$l(86,142.916058646),new mS.$l(87,143.919591666),new mS.$l(88,144.92163837),new mS.$l(89,145.925700146),new mS.$l(90,146.927819639),new mS.$l(91,147.932191197),new mS.$l(92,148.93437),new mS.$l(93,149.93857),new mS.$l(94,150.94156),new mS.$l(95,151.94611),new mS.$l(96,152.94945),new mS.$l(97,153.9544),new mS.$l(98,154.95813)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(61,118.95276),new mS.$l(62,119.94664),new mS.$l(63,120.94367),new mS.$l(64,121.93801),new mS.$l(65,122.93551),new mS.$l(66,123.93052),new mS.$l(67,124.92854),new mS.$l(68,125.9241),new mS.$l(69,126.92275),new mS.$l(70,127.91887),new mS.$l(71,128.918679183),new mS.$l(72,129.914339361),new mS.$l(73,130.914424137),new mS.$l(74,131.91149),new mS.$l(75,132.91155),new mS.$l(76,133.909026379),new mS.$l(77,134.909145555),new mS.$l(78,135.907143574),new mS.$l(79,136.907777634),new mS.$l(80,137.905985574),new mS.$l(81,138.906646605),new mS.$l(82,139.905434035),new mS.$l(83,140.908271103),new mS.$l(84,141.909239733),new mS.$l(85,142.912381158),new mS.$l(86,143.913642686),new mS.$l(87,144.917227871),new mS.$l(88,145.918689722),new mS.$l(89,146.922510962),new mS.$l(90,147.924394738),new mS.$l(91,148.928289207),new mS.$l(92,149.930226399),new mS.$l(93,150.93404),new mS.$l(94,151.93638),new mS.$l(95,152.94058),new mS.$l(96,153.94332),new mS.$l(97,154.94804),new mS.$l(98,155.95126),new mS.$l(99,156.95634)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(62,120.955364),new mS.$l(63,121.95165),new mS.$l(64,122.94596),new mS.$l(65,123.94296),new mS.$l(66,124.93783),new mS.$l(67,125.93531),new mS.$l(68,126.93083),new mS.$l(69,127.9288),new mS.$l(70,128.92486),new mS.$l(71,129.92338),new mS.$l(72,130.920060245),new mS.$l(73,131.91912),new mS.$l(74,132.9162),new mS.$l(75,133.915672),new mS.$l(76,134.91313914),new mS.$l(77,135.912646935),new mS.$l(78,136.910678351),new mS.$l(79,137.910748891),new mS.$l(80,138.908932181),new mS.$l(81,139.909071204),new mS.$l(82,140.907647726),new mS.$l(83,141.910039865),new mS.$l(84,142.910812233),new mS.$l(85,143.913300595),new mS.$l(86,144.914506897),new mS.$l(87,145.917588016),new mS.$l(88,146.918979001),new mS.$l(89,147.922183237),new mS.$l(90,148.923791056),new mS.$l(91,149.926995031),new mS.$l(92,150.928227869),new mS.$l(93,151.9316),new mS.$l(94,152.93365),new mS.$l(95,153.93739),new mS.$l(96,154.93999),new mS.$l(97,155.94412),new mS.$l(98,156.94717),new mS.$l(99,157.95178),new mS.$l(100,158.95523)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(66,125.94307),new mS.$l(67,126.9405),new mS.$l(68,127.93539),new mS.$l(69,128.932385),new mS.$l(70,129.92878),new mS.$l(71,130.927102697),new mS.$l(72,131.92312),new mS.$l(73,132.92221),new mS.$l(74,133.918645),new mS.$l(75,134.91824),new mS.$l(76,135.915020542),new mS.$l(77,136.91463973),new mS.$l(78,137.91291745),new mS.$l(79,138.91192415),new mS.$l(80,139.909309824),new mS.$l(81,140.9096048),new mS.$l(82,141.907718643),new mS.$l(83,142.909809626),new mS.$l(84,143.910082629),new mS.$l(85,144.912568847),new mS.$l(86,145.913112139),new mS.$l(87,146.916095794),new mS.$l(88,147.916888516),new mS.$l(89,148.92014419),new mS.$l(90,149.920886563),new mS.$l(91,150.923824739),new mS.$l(92,151.924682428),new mS.$l(93,152.927694534),new mS.$l(94,153.929483295),new mS.$l(95,154.932629551),new mS.$l(96,155.9352),new mS.$l(97,156.93927),new mS.$l(98,157.94187),new mS.$l(99,158.94639),new mS.$l(100,159.94939),new mS.$l(101,160.95433)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(67,127.94826),new mS.$l(68,128.94316),new mS.$l(69,129.94045),new mS.$l(70,130.9358),new mS.$l(71,131.93375),new mS.$l(72,132.92972),new mS.$l(73,133.92849),new mS.$l(74,134.924617),new mS.$l(75,135.923447865),new mS.$l(76,136.920713),new mS.$l(77,137.920432261),new mS.$l(78,138.916759814),new mS.$l(79,139.915801649),new mS.$l(80,140.913606636),new mS.$l(81,141.912950738),new mS.$l(82,142.910927571),new mS.$l(83,143.912585768),new mS.$l(84,144.912743879),new mS.$l(85,145.914692165),new mS.$l(86,146.915133898),new mS.$l(87,147.917467786),new mS.$l(88,148.918329195),new mS.$l(89,149.920979477),new mS.$l(90,150.921202693),new mS.$l(91,151.923490557),new mS.$l(92,152.924113189),new mS.$l(93,153.926547019),new mS.$l(94,154.928097047),new mS.$l(95,155.931060357),new mS.$l(96,156.9332),new mS.$l(97,157.93669),new mS.$l(98,158.93913),new mS.$l(99,159.94299),new mS.$l(100,160.94586),new mS.$l(101,161.95029),new mS.$l(102,162.95352)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(68,129.94863),new mS.$l(69,130.94589),new mS.$l(70,131.94082),new mS.$l(71,132.93873),new mS.$l(72,133.93402),new mS.$l(73,134.93235),new mS.$l(74,135.9283),new mS.$l(75,136.927046709),new mS.$l(76,137.92354),new mS.$l(77,138.922302),new mS.$l(78,139.918991),new mS.$l(79,140.918468512),new mS.$l(80,141.915193274),new mS.$l(81,142.914623555),new mS.$l(82,143.91199473),new mS.$l(83,144.913405611),new mS.$l(84,145.91303676),new mS.$l(85,146.914893275),new mS.$l(86,147.914817914),new mS.$l(87,148.917179521),new mS.$l(88,149.917271454),new mS.$l(89,150.919928351),new mS.$l(90,151.919728244),new mS.$l(91,152.922093907),new mS.$l(92,153.922205303),new mS.$l(93,154.92463594),new mS.$l(94,155.925526236),new mS.$l(95,156.928354506),new mS.$l(96,157.929987938),new mS.$l(97,158.9332),new mS.$l(98,159.93514),new mS.$l(99,160.93883),new mS.$l(100,161.94122),new mS.$l(101,162.94536),new mS.$l(102,163.94828),new mS.$l(103,164.95298)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(69,131.95416),new mS.$l(70,132.9489),new mS.$l(71,133.94632),new mS.$l(72,134.94172),new mS.$l(73,135.9395),new mS.$l(74,136.93521),new mS.$l(75,137.93345),new mS.$l(76,138.92882915),new mS.$l(77,139.928083921),new mS.$l(78,140.924885867),new mS.$l(79,141.923400033),new mS.$l(80,142.920286634),new mS.$l(81,143.918774116),new mS.$l(82,144.916261285),new mS.$l(83,145.917199714),new mS.$l(84,146.916741206),new mS.$l(85,147.918153775),new mS.$l(86,148.917925922),new mS.$l(87,149.919698294),new mS.$l(88,150.919846022),new mS.$l(89,151.921740399),new mS.$l(90,152.921226219),new mS.$l(91,153.922975386),new mS.$l(92,154.922889429),new mS.$l(93,155.924750855),new mS.$l(94,156.925419435),new mS.$l(95,157.927841923),new mS.$l(96,158.9290845),new mS.$l(97,159.931460406),new mS.$l(98,160.93368),new mS.$l(99,161.93704),new mS.$l(100,162.93921),new mS.$l(101,163.94299),new mS.$l(102,164.94572),new mS.$l(103,165.94997),new mS.$l(104,166.95305)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(72,135.94707),new mS.$l(73,136.94465),new mS.$l(74,137.93997),new mS.$l(75,138.93808),new mS.$l(76,139.933236934),new mS.$l(77,140.93221),new mS.$l(78,141.927908919),new mS.$l(79,142.926738636),new mS.$l(80,143.923390357),new mS.$l(81,144.921687498),new mS.$l(82,145.918305344),new mS.$l(83,146.919089446),new mS.$l(84,147.918109771),new mS.$l(85,148.919336427),new mS.$l(86,149.918655455),new mS.$l(87,150.920344273),new mS.$l(88,151.919787882),new mS.$l(89,152.921746283),new mS.$l(90,153.920862271),new mS.$l(91,154.922618801),new mS.$l(92,155.922119552),new mS.$l(93,156.923956686),new mS.$l(94,157.924100533),new mS.$l(95,158.926385075),new mS.$l(96,159.927050616),new mS.$l(97,160.929665688),new mS.$l(98,161.930981211),new mS.$l(99,162.93399),new mS.$l(100,163.93586),new mS.$l(101,164.93938),new mS.$l(102,165.9416),new mS.$l(103,166.94557),new mS.$l(104,167.94836),new mS.$l(105,168.95287)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(73,137.95287),new mS.$l(74,138.94803),new mS.$l(75,139.945367985),new mS.$l(76,140.94116),new mS.$l(77,141.939073781),new mS.$l(78,142.93475),new mS.$l(79,143.93253),new mS.$l(80,144.92888),new mS.$l(81,145.927180629),new mS.$l(82,146.924037176),new mS.$l(83,147.924298636),new mS.$l(84,148.92324163),new mS.$l(85,149.923654158),new mS.$l(86,150.923098169),new mS.$l(87,151.924071324),new mS.$l(88,152.923430858),new mS.$l(89,153.924686236),new mS.$l(90,154.923500411),new mS.$l(91,155.924743749),new mS.$l(92,156.924021155),new mS.$l(93,157.92541026),new mS.$l(94,158.925343135),new mS.$l(95,159.927164021),new mS.$l(96,160.927566289),new mS.$l(97,161.929484803),new mS.$l(98,162.930643942),new mS.$l(99,163.933347253),new mS.$l(100,164.93488),new mS.$l(101,165.93805),new mS.$l(102,166.94005),new mS.$l(103,167.94364),new mS.$l(104,168.94622),new mS.$l(105,169.95025),new mS.$l(106,170.9533)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(74,139.95379),new mS.$l(75,140.95119),new mS.$l(76,141.946695946),new mS.$l(77,142.94383),new mS.$l(78,143.93907),new mS.$l(79,144.936717),new mS.$l(80,145.932720118),new mS.$l(81,146.930878496),new mS.$l(82,147.927177882),new mS.$l(83,148.927333981),new mS.$l(84,149.925579728),new mS.$l(85,150.92617963),new mS.$l(86,151.924713874),new mS.$l(87,152.925760865),new mS.$l(88,153.924422046),new mS.$l(89,154.92574895),new mS.$l(90,155.924278273),new mS.$l(91,156.925461256),new mS.$l(92,157.924404637),new mS.$l(93,158.92573566),new mS.$l(94,159.925193718),new mS.$l(95,160.926929595),new mS.$l(96,161.926794731),new mS.$l(97,162.928727532),new mS.$l(98,163.929171165),new mS.$l(99,164.931699828),new mS.$l(100,165.932803241),new mS.$l(101,166.935649025),new mS.$l(102,167.93723),new mS.$l(103,168.940303648),new mS.$l(104,169.94267),new mS.$l(105,170.94648),new mS.$l(106,171.94911),new mS.$l(107,172.95344)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(75,141.95986),new mS.$l(76,142.95469),new mS.$l(77,143.95164),new mS.$l(78,144.94688),new mS.$l(79,145.9441),new mS.$l(80,146.93984),new mS.$l(81,147.937269),new mS.$l(82,148.933789944),new mS.$l(83,149.932760914),new mS.$l(84,150.931680791),new mS.$l(85,151.931740598),new mS.$l(86,152.930194506),new mS.$l(87,153.930596268),new mS.$l(88,154.929079084),new mS.$l(89,155.929001869),new mS.$l(90,156.928188059),new mS.$l(91,157.92894573),new mS.$l(92,158.927708537),new mS.$l(93,159.928725679),new mS.$l(94,160.927851662),new mS.$l(95,161.92909242),new mS.$l(96,162.928730286),new mS.$l(97,163.930230577),new mS.$l(98,164.930319169),new mS.$l(99,165.932281267),new mS.$l(100,166.933126195),new mS.$l(101,167.935496424),new mS.$l(102,168.936868306),new mS.$l(103,169.939614951),new mS.$l(104,170.941461227),new mS.$l(105,171.94482),new mS.$l(106,172.94729),new mS.$l(107,173.95115),new mS.$l(108,174.95405)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(76,143.96059),new mS.$l(77,144.95746),new mS.$l(78,145.95212),new mS.$l(79,146.94931),new mS.$l(80,147.94444),new mS.$l(81,148.942780527),new mS.$l(82,149.937171034),new mS.$l(83,150.93746),new mS.$l(84,151.935078452),new mS.$l(85,152.935093125),new mS.$l(86,153.932777294),new mS.$l(87,154.933204273),new mS.$l(88,155.931015001),new mS.$l(89,156.931945517),new mS.$l(90,157.929912),new mS.$l(91,158.930680718),new mS.$l(92,159.929078924),new mS.$l(93,160.930001348),new mS.$l(94,161.928774923),new mS.$l(95,162.930029273),new mS.$l(96,163.929196996),new mS.$l(97,164.9307228),new mS.$l(98,165.93028997),new mS.$l(99,166.932045448),new mS.$l(100,167.932367781),new mS.$l(101,168.934588082),new mS.$l(102,169.935460334),new mS.$l(103,170.938025885),new mS.$l(104,171.939352149),new mS.$l(105,172.9424),new mS.$l(106,173.94434),new mS.$l(107,174.94793),new mS.$l(108,175.95029),new mS.$l(109,176.95437)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(77,145.966495),new mS.$l(78,146.961081),new mS.$l(79,147.95755),new mS.$l(80,148.95265),new mS.$l(81,149.94967),new mS.$l(82,150.944842),new mS.$l(83,151.9443),new mS.$l(84,152.942027631),new mS.$l(85,153.940832325),new mS.$l(86,154.939191562),new mS.$l(87,155.939006895),new mS.$l(88,156.936756069),new mS.$l(89,157.936996),new mS.$l(90,158.934808966),new mS.$l(91,159.935090772),new mS.$l(92,160.933398042),new mS.$l(93,161.933970147),new mS.$l(94,162.932647648),new mS.$l(95,163.933450972),new mS.$l(96,164.932432463),new mS.$l(97,165.933553133),new mS.$l(98,166.932848844),new mS.$l(99,167.934170375),new mS.$l(100,168.934211117),new mS.$l(101,169.935797877),new mS.$l(102,170.936425817),new mS.$l(103,171.938396118),new mS.$l(104,172.939600336),new mS.$l(105,173.942164618),new mS.$l(106,174.943832897),new mS.$l(107,175.946991412),new mS.$l(108,176.94904),new mS.$l(109,177.95264),new mS.$l(110,178.95534)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(78,147.96676),new mS.$l(79,148.96348),new mS.$l(80,149.95799),new mS.$l(81,150.954657965),new mS.$l(82,151.950167),new mS.$l(83,152.94921),new mS.$l(84,153.945651145),new mS.$l(85,154.945792),new mS.$l(86,155.942847109),new mS.$l(87,156.94265865),new mS.$l(88,157.939857897),new mS.$l(89,158.940153735),new mS.$l(90,159.93756),new mS.$l(91,160.937357719),new mS.$l(92,161.93575),new mS.$l(93,162.936265492),new mS.$l(94,163.93452),new mS.$l(95,164.935397592),new mS.$l(96,165.933879623),new mS.$l(97,166.934946862),new mS.$l(98,167.933894465),new mS.$l(99,168.93518712),new mS.$l(100,169.934758652),new mS.$l(101,170.936322297),new mS.$l(102,171.936377696),new mS.$l(103,172.938206756),new mS.$l(104,173.938858101),new mS.$l(105,174.941272494),new mS.$l(106,175.942568409),new mS.$l(107,176.945257126),new mS.$l(108,177.946643396),new mS.$l(109,178.95017),new mS.$l(110,179.95233),new mS.$l(111,180.95615)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(79,149.972668),new mS.$l(80,150.967147),new mS.$l(81,151.96361),new mS.$l(82,152.95869),new mS.$l(83,153.9571),new mS.$l(84,154.953641324),new mS.$l(85,155.952907),new mS.$l(86,156.950101536),new mS.$l(87,157.948577981),new mS.$l(88,158.946615113),new mS.$l(89,159.945383),new mS.$l(90,160.943047504),new mS.$l(91,161.943222),new mS.$l(92,162.941203796),new mS.$l(93,163.941215),new mS.$l(94,164.939605886),new mS.$l(95,165.939762646),new mS.$l(96,166.938307056),new mS.$l(97,167.938698576),new mS.$l(98,168.937648757),new mS.$l(99,169.93847219),new mS.$l(100,170.937909903),new mS.$l(101,171.939082239),new mS.$l(102,172.938926901),new mS.$l(103,173.940333522),new mS.$l(104,174.940767904),new mS.$l(105,175.942682399),new mS.$l(106,176.943754987),new mS.$l(107,177.945951366),new mS.$l(108,178.947324216),new mS.$l(109,179.949879968),new mS.$l(110,180.95197),new mS.$l(111,181.95521),new mS.$l(112,182.95757),new mS.$l(113,183.96117)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(82,153.96425),new mS.$l(83,154.96276),new mS.$l(84,155.959247),new mS.$l(85,156.958127),new mS.$l(86,157.95405528),new mS.$l(87,158.954003),new mS.$l(88,159.950713588),new mS.$l(89,160.950330852),new mS.$l(90,161.947202977),new mS.$l(91,162.947057),new mS.$l(92,163.944422),new mS.$l(93,164.94454),new mS.$l(94,165.94225),new mS.$l(95,166.9426),new mS.$l(96,167.94063),new mS.$l(97,168.941158567),new mS.$l(98,169.93965),new mS.$l(99,170.94049),new mS.$l(100,171.93945798),new mS.$l(101,172.94065),new mS.$l(102,173.940040159),new mS.$l(103,174.941502991),new mS.$l(104,175.941401828),new mS.$l(105,176.943220013),new mS.$l(106,177.943697732),new mS.$l(107,178.945815073),new mS.$l(108,179.94654876),new mS.$l(109,180.949099124),new mS.$l(110,181.950552893),new mS.$l(111,182.953531012),new mS.$l(112,183.95544788),new mS.$l(113,184.95878),new mS.$l(114,185.96092)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(83,155.971689),new mS.$l(84,156.968145),new mS.$l(85,157.966368),new mS.$l(86,158.96232309),new mS.$l(87,159.961358),new mS.$l(88,160.958372992),new mS.$l(89,161.956556553),new mS.$l(90,162.95431665),new mS.$l(91,163.95357),new mS.$l(92,164.950817),new mS.$l(93,165.95047),new mS.$l(94,166.948639),new mS.$l(95,167.947787),new mS.$l(96,168.94592),new mS.$l(97,169.94609),new mS.$l(98,170.94446),new mS.$l(99,171.944739818),new mS.$l(100,172.94459),new mS.$l(101,173.944167937),new mS.$l(102,174.94365),new mS.$l(103,175.944740551),new mS.$l(104,176.944471766),new mS.$l(105,177.945750349),new mS.$l(106,178.945934113),new mS.$l(107,179.947465655),new mS.$l(108,180.947996346),new mS.$l(109,181.950152414),new mS.$l(110,182.951373188),new mS.$l(111,183.954009331),new mS.$l(112,184.955559086),new mS.$l(113,185.9585501),new mS.$l(114,186.96041),new mS.$l(115,187.96371)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(84,157.973939),new mS.$l(85,158.97228),new mS.$l(86,159.968369),new mS.$l(87,160.967089),new mS.$l(88,161.962750303),new mS.$l(89,162.962532),new mS.$l(90,163.95898381),new mS.$l(91,164.958335962),new mS.$l(92,165.955019896),new mS.$l(93,166.954672),new mS.$l(94,167.951863),new mS.$l(95,168.951759),new mS.$l(96,169.948473988),new mS.$l(97,170.94946),new mS.$l(98,171.948228837),new mS.$l(99,172.948884),new mS.$l(100,173.94616),new mS.$l(101,174.94677),new mS.$l(102,175.94559),new mS.$l(103,176.94662),new mS.$l(104,177.945848364),new mS.$l(105,178.947071733),new mS.$l(106,179.946705734),new mS.$l(107,180.948198054),new mS.$l(108,181.948205519),new mS.$l(109,182.950224458),new mS.$l(110,183.950932553),new mS.$l(111,184.953420586),new mS.$l(112,185.954362204),new mS.$l(113,186.957158365),new mS.$l(114,187.958486954),new mS.$l(115,188.96191222),new mS.$l(116,189.963179541)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(85,159.981485),new mS.$l(86,160.977661),new mS.$l(87,161.975707),new mS.$l(88,162.971375872),new mS.$l(89,163.970319),new mS.$l(90,164.967050268),new mS.$l(91,165.965211372),new mS.$l(92,166.962564),new mS.$l(93,167.961609),new mS.$l(94,168.95883),new mS.$l(95,169.958163),new mS.$l(96,170.955547),new mS.$l(97,171.955285),new mS.$l(98,172.953062),new mS.$l(99,173.952114),new mS.$l(100,174.951393),new mS.$l(101,175.95157),new mS.$l(102,176.95027),new mS.$l(103,177.950851081),new mS.$l(104,178.949981038),new mS.$l(105,179.95078768),new mS.$l(106,180.950064596),new mS.$l(107,181.951211444),new mS.$l(108,182.950821349),new mS.$l(109,183.952524289),new mS.$l(110,184.952955747),new mS.$l(111,185.954986529),new mS.$l(112,186.955750787),new mS.$l(113,187.958112287),new mS.$l(114,188.959228359),new mS.$l(115,189.961816139),new mS.$l(116,190.963123592),new mS.$l(117,191.96596)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(86,161.983819),new mS.$l(87,162.982048),new mS.$l(88,163.977927),new mS.$l(89,164.976475),new mS.$l(90,165.971934911),new mS.$l(91,166.971554),new mS.$l(92,167.967832911),new mS.$l(93,168.967076205),new mS.$l(94,169.963569716),new mS.$l(95,170.96304),new mS.$l(96,171.960078),new mS.$l(97,172.959791),new mS.$l(98,173.956307704),new mS.$l(99,174.95708),new mS.$l(100,175.953757941),new mS.$l(101,176.955045),new mS.$l(102,177.953348225),new mS.$l(103,178.953951),new mS.$l(104,179.952308241),new mS.$l(105,180.953274494),new mS.$l(106,181.952186222),new mS.$l(107,182.95311),new mS.$l(108,183.952490808),new mS.$l(109,184.954043023),new mS.$l(110,185.953838355),new mS.$l(111,186.955747928),new mS.$l(112,187.955835993),new mS.$l(113,188.958144866),new mS.$l(114,189.95844521),new mS.$l(115,190.960927951),new mS.$l(116,191.961479047),new mS.$l(117,192.964148083),new mS.$l(118,193.965179314),new mS.$l(119,194.968123889),new mS.$l(120,195.96962255)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(88,164.98758),new mS.$l(89,165.985506),new mS.$l(90,166.980951577),new mS.$l(91,167.979966),new mS.$l(92,168.976390868),new mS.$l(93,169.974441697),new mS.$l(94,170.971779),new mS.$l(95,171.970643),new mS.$l(96,172.967707),new mS.$l(97,173.966804),new mS.$l(98,174.964279),new mS.$l(99,175.963511),new mS.$l(100,176.96117),new mS.$l(101,177.960084944),new mS.$l(102,178.95915),new mS.$l(103,179.958555615),new mS.$l(104,180.957642156),new mS.$l(105,181.958127689),new mS.$l(106,182.956814),new mS.$l(107,183.957388318),new mS.$l(108,184.95659),new mS.$l(109,185.957951104),new mS.$l(110,186.95736083),new mS.$l(111,187.958851962),new mS.$l(112,188.958716473),new mS.$l(113,189.960592299),new mS.$l(114,190.960591191),new mS.$l(115,191.962602198),new mS.$l(116,192.9629237),new mS.$l(117,193.96507561),new mS.$l(118,194.9659768),new mS.$l(119,195.968379906),new mS.$l(120,196.969636496),new mS.$l(121,197.97228),new mS.$l(122,198.973787159)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(90,167.988035),new mS.$l(91,168.986421),new mS.$l(92,169.981734918),new mS.$l(93,170.981251),new mS.$l(94,171.977376138),new mS.$l(95,172.976499642),new mS.$l(96,173.972811276),new mS.$l(97,174.972276),new mS.$l(98,175.969),new mS.$l(99,176.968453),new mS.$l(100,177.964894223),new mS.$l(101,178.965475),new mS.$l(102,179.962023729),new mS.$l(103,180.963177),new mS.$l(104,181.961267637),new mS.$l(105,182.961729),new mS.$l(106,183.959851685),new mS.$l(107,184.960753782),new mS.$l(108,185.959432346),new mS.$l(109,186.960697),new mS.$l(110,187.959395697),new mS.$l(111,188.9608319),new mS.$l(112,189.959930073),new mS.$l(113,190.961684653),new mS.$l(114,191.961035158),new mS.$l(115,192.962984504),new mS.$l(116,193.962663581),new mS.$l(117,194.964774449),new mS.$l(118,195.964934884),new mS.$l(119,196.967323401),new mS.$l(120,197.967876009),new mS.$l(121,198.970576213),new mS.$l(122,199.971423885),new mS.$l(123,200.974496467),new mS.$l(124,201.97574)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(92,170.991183),new mS.$l(93,171.990109),new mS.$l(94,172.986398138),new mS.$l(95,173.984325861),new mS.$l(96,174.981552),new mS.$l(97,175.980269),new mS.$l(98,176.977215),new mS.$l(99,177.975975),new mS.$l(100,178.973412),new mS.$l(101,179.972396),new mS.$l(102,180.969948),new mS.$l(103,181.968621416),new mS.$l(104,182.96762),new mS.$l(105,183.966776046),new mS.$l(106,184.965806956),new mS.$l(107,185.965997671),new mS.$l(108,186.964562),new mS.$l(109,187.965321662),new mS.$l(110,188.9642243),new mS.$l(111,189.964698757),new mS.$l(112,190.963649239),new mS.$l(113,191.964810107),new mS.$l(114,192.964131745),new mS.$l(115,193.96533889),new mS.$l(116,194.965017928),new mS.$l(117,195.966551315),new mS.$l(118,196.966551609),new mS.$l(119,197.968225244),new mS.$l(120,198.968748016),new mS.$l(121,199.970717886),new mS.$l(122,200.971640839),new mS.$l(123,201.973788431),new mS.$l(124,202.975137256),new mS.$l(125,203.977705),new mS.$l(126,204.97961)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(95,174.991411),new mS.$l(96,175.987413248),new mS.$l(97,176.986336874),new mS.$l(98,177.982476325),new mS.$l(99,178.981783),new mS.$l(100,179.978322),new mS.$l(101,180.977806),new mS.$l(102,181.97393546),new mS.$l(103,182.974561),new mS.$l(104,183.970705219),new mS.$l(105,184.971983),new mS.$l(106,185.969460021),new mS.$l(107,186.969785),new mS.$l(108,187.967511693),new mS.$l(109,188.968733187),new mS.$l(110,189.966958568),new mS.$l(111,190.96706311),new mS.$l(112,191.965921572),new mS.$l(113,192.966644169),new mS.$l(114,193.965381832),new mS.$l(115,194.966638981),new mS.$l(116,195.965814846),new mS.$l(117,196.967195333),new mS.$l(118,197.96675183),new mS.$l(119,198.968262489),new mS.$l(120,199.968308726),new mS.$l(121,200.970285275),new mS.$l(122,201.970625604),new mS.$l(123,202.972857096),new mS.$l(124,203.97347564),new mS.$l(125,204.976056104),new mS.$l(126,205.977498672),new mS.$l(127,206.982577025),new mS.$l(128,207.98594)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(96,176.996881),new mS.$l(97,177.994637),new mS.$l(98,178.991466),new mS.$l(99,179.990194),new mS.$l(100,180.986904),new mS.$l(101,181.98561),new mS.$l(102,182.982697),new mS.$l(103,183.98176),new mS.$l(104,184.9791),new mS.$l(105,185.977549881),new mS.$l(106,186.97617),new mS.$l(107,187.97592),new mS.$l(108,188.974290451),new mS.$l(109,189.974473379),new mS.$l(110,190.972261952),new mS.$l(111,191.972770785),new mS.$l(112,192.970548),new mS.$l(113,193.971053),new mS.$l(114,194.96965),new mS.$l(115,195.970515),new mS.$l(116,196.9695362),new mS.$l(117,197.970466294),new mS.$l(118,198.969813837),new mS.$l(119,199.970945394),new mS.$l(120,200.97080377),new mS.$l(121,201.972090569),new mS.$l(122,202.972329088),new mS.$l(123,203.973848646),new mS.$l(124,204.97441227),new mS.$l(125,205.976095321),new mS.$l(126,206.977407908),new mS.$l(127,207.982004653),new mS.$l(128,208.985349125),new mS.$l(129,209.990065574)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(99,180.996714),new mS.$l(100,181.992676101),new mS.$l(101,182.99193),new mS.$l(102,183.988198),new mS.$l(103,184.98758),new mS.$l(104,185.983485388),new mS.$l(105,186.98403),new mS.$l(106,187.979869108),new mS.$l(107,188.98088),new mS.$l(108,189.978180008),new mS.$l(109,190.9782),new mS.$l(110,191.975719811),new mS.$l(111,192.97608),new mS.$l(112,193.974648056),new mS.$l(113,194.975920279),new mS.$l(114,195.97271),new mS.$l(115,196.97338),new mS.$l(116,197.97198),new mS.$l(117,198.972909384),new mS.$l(118,199.97181556),new mS.$l(119,200.972846589),new mS.$l(120,201.972143786),new mS.$l(121,202.973375491),new mS.$l(122,203.973028761),new mS.$l(123,204.974467112),new mS.$l(124,205.974449002),new mS.$l(125,206.975880605),new mS.$l(126,207.97663585),new mS.$l(127,208.981074801),new mS.$l(128,209.984173129),new mS.$l(129,210.988731474),new mS.$l(130,211.991887495),new mS.$l(131,212.9965),new mS.$l(132,213.999798147)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(102,184.997708),new mS.$l(103,185.99648),new mS.$l(104,186.993458),new mS.$l(105,187.992173),new mS.$l(106,188.989505),new mS.$l(107,189.987520007),new mS.$l(108,190.986053),new mS.$l(109,191.985368),new mS.$l(110,192.983662229),new mS.$l(111,193.983430186),new mS.$l(112,194.98112697),new mS.$l(113,195.981236107),new mS.$l(114,196.978934287),new mS.$l(115,197.979024396),new mS.$l(116,198.977576953),new mS.$l(117,199.978141983),new mS.$l(118,200.976970721),new mS.$l(119,201.977674504),new mS.$l(120,202.976868118),new mS.$l(121,203.977805161),new mS.$l(122,204.977374688),new mS.$l(123,205.978482854),new mS.$l(124,206.978455217),new mS.$l(125,207.979726699),new mS.$l(126,208.980383241),new mS.$l(127,209.984104944),new mS.$l(128,210.987258139),new mS.$l(129,211.991271542),new mS.$l(130,212.994374836),new mS.$l(131,213.998698664),new mS.$l(132,215.001832349),new mS.$l(133,216.006199)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(106,189.994293888),new mS.$l(107,190.994653),new mS.$l(108,191.99033039),new mS.$l(109,192.991102),new mS.$l(110,193.988284107),new mS.$l(111,194.988045),new mS.$l(112,195.985469432),new mS.$l(113,196.985567),new mS.$l(114,197.984024384),new mS.$l(115,198.985044507),new mS.$l(116,199.981735),new mS.$l(117,200.982209),new mS.$l(118,201.980704),new mS.$l(119,202.981412863),new mS.$l(120,203.980307113),new mS.$l(121,204.981165396),new mS.$l(122,205.980465241),new mS.$l(123,206.981578228),new mS.$l(124,207.981231059),new mS.$l(125,208.982415788),new mS.$l(126,209.982857396),new mS.$l(127,210.986636869),new mS.$l(128,211.988851755),new mS.$l(129,212.992842522),new mS.$l(130,213.995185949),new mS.$l(131,214.999414609),new mS.$l(132,216.001905198),new mS.$l(133,217.006253),new mS.$l(134,218.008965773)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(108,193.000188),new mS.$l(109,193.997973),new mS.$l(110,194.996554),new mS.$l(111,195.995702),new mS.$l(112,196.993891293),new mS.$l(113,197.99343368),new mS.$l(114,198.991008569),new mS.$l(115,199.990920883),new mS.$l(116,200.988486908),new mS.$l(117,201.988448629),new mS.$l(118,202.986847216),new mS.$l(119,203.987261559),new mS.$l(120,204.986036352),new mS.$l(121,205.986599242),new mS.$l(122,206.985775861),new mS.$l(123,207.986582508),new mS.$l(124,208.986158678),new mS.$l(125,209.987131308),new mS.$l(126,210.987480806),new mS.$l(127,211.990734657),new mS.$l(128,212.99292115),new mS.$l(129,213.996356412),new mS.$l(130,214.998641245),new mS.$l(131,216.002408839),new mS.$l(132,217.004709619),new mS.$l(133,218.008681458),new mS.$l(134,219.011296478),new mS.$l(135,220.015301),new mS.$l(136,221.01814),new mS.$l(137,222.02233),new mS.$l(138,223.02534)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(110,196.001117268),new mS.$l(111,197.001661),new mS.$l(112,197.998779978),new mS.$l(113,198.998309),new mS.$l(114,199.995634148),new mS.$l(115,200.995535),new mS.$l(116,201.993899382),new mS.$l(117,202.994765192),new mS.$l(118,203.991365),new mS.$l(119,204.991668),new mS.$l(120,205.99016),new mS.$l(121,206.990726826),new mS.$l(122,207.989631237),new mS.$l(123,208.990376634),new mS.$l(124,209.989679862),new mS.$l(125,210.99058541),new mS.$l(126,211.990688899),new mS.$l(127,212.993868354),new mS.$l(128,213.995346275),new mS.$l(129,214.998729195),new mS.$l(130,216.000258153),new mS.$l(131,217.003914555),new mS.$l(132,218.005586315),new mS.$l(133,219.009474831),new mS.$l(134,220.011384149),new mS.$l(135,221.015455),new mS.$l(136,222.017570472),new mS.$l(137,223.02179),new mS.$l(138,224.02409),new mS.$l(139,225.02844),new mS.$l(140,226.03089),new mS.$l(141,227.035407),new mS.$l(142,228.038084)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(113,200.006499),new mS.$l(114,201.00458692),new mS.$l(115,202.00396885),new mS.$l(116,203.001423829),new mS.$l(117,204.001221209),new mS.$l(118,204.998663961),new mS.$l(119,205.998486886),new mS.$l(120,206.996859385),new mS.$l(121,207.997133849),new mS.$l(122,208.995915421),new mS.$l(123,209.996398327),new mS.$l(124,210.995529332),new mS.$l(125,211.996194988),new mS.$l(126,212.996174845),new mS.$l(127,213.99895474),new mS.$l(128,215.000326029),new mS.$l(129,216.003187873),new mS.$l(130,217.004616452),new mS.$l(131,218.007563326),new mS.$l(132,219.009240843),new mS.$l(133,220.012312978),new mS.$l(134,221.014245654),new mS.$l(135,222.017543957),new mS.$l(136,223.019730712),new mS.$l(137,224.023235513),new mS.$l(138,225.025606914),new mS.$l(139,226.029343423),new mS.$l(140,227.031833167),new mS.$l(141,228.034776087),new mS.$l(142,229.038426),new mS.$l(143,230.04251),new mS.$l(144,231.045407),new mS.$l(145,232.049654)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(115,203.00921),new mS.$l(116,204.006434513),new mS.$l(117,205.006187),new mS.$l(118,206.004463814),new mS.$l(119,207.005176607),new mS.$l(120,208.001776),new mS.$l(121,209.001944),new mS.$l(122,210.000446),new mS.$l(123,211.000893996),new mS.$l(124,211.999783492),new mS.$l(125,213.000345847),new mS.$l(126,214.000091141),new mS.$l(127,215.002704195),new mS.$l(128,216.003518402),new mS.$l(129,217.00630601),new mS.$l(130,218.007123948),new mS.$l(131,219.010068787),new mS.$l(132,220.011014669),new mS.$l(133,221.013907762),new mS.$l(134,222.01536182),new mS.$l(135,223.01849714),new mS.$l(136,224.020202004),new mS.$l(137,225.023604463),new mS.$l(138,226.025402555),new mS.$l(139,227.029170677),new mS.$l(140,228.031064101),new mS.$l(141,229.034820309),new mS.$l(142,230.037084774),new mS.$l(143,231.04122),new mS.$l(144,232.043693),new mS.$l(145,233.047995),new mS.$l(146,234.050547)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(118,207.012469754),new mS.$l(119,208.012112949),new mS.$l(120,209.009568736),new mS.$l(121,210.009256802),new mS.$l(122,211.007648196),new mS.$l(123,212.007811441),new mS.$l(124,213.006573689),new mS.$l(125,214.006893072),new mS.$l(126,215.006450832),new mS.$l(127,216.008721268),new mS.$l(128,217.009332676),new mS.$l(129,218.011625045),new mS.$l(130,219.012404918),new mS.$l(131,220.014752105),new mS.$l(132,221.015575746),new mS.$l(133,222.017828852),new mS.$l(134,223.01912603),new mS.$l(135,224.021708435),new mS.$l(136,225.023220576),new mS.$l(137,226.026089848),new mS.$l(138,227.027746979),new mS.$l(139,228.031014825),new mS.$l(140,229.032930871),new mS.$l(141,230.036025144),new mS.$l(142,231.038551503),new mS.$l(143,232.042022474),new mS.$l(144,233.04455),new mS.$l(145,234.04842),new mS.$l(146,235.051102),new mS.$l(147,236.055178)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(120,210.015711883),new mS.$l(121,211.016306912),new mS.$l(122,212.012916),new mS.$l(123,213.012962),new mS.$l(124,214.011451),new mS.$l(125,215.011726597),new mS.$l(126,216.011050963),new mS.$l(127,217.013066169),new mS.$l(128,218.013267744),new mS.$l(129,219.015521253),new mS.$l(130,220.015733126),new mS.$l(131,221.018171499),new mS.$l(132,222.018454131),new mS.$l(133,223.020795153),new mS.$l(134,224.02145925),new mS.$l(135,225.023941441),new mS.$l(136,226.024890681),new mS.$l(137,227.027698859),new mS.$l(138,228.028731348),new mS.$l(139,229.03175534),new mS.$l(140,230.033126574),new mS.$l(141,231.03629706),new mS.$l(142,232.03805036),new mS.$l(143,233.041576923),new mS.$l(144,234.043595497),new mS.$l(145,235.04750442),new mS.$l(146,236.04971),new mS.$l(147,237.053894),new mS.$l(148,238.056243)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(122,213.021183209),new mS.$l(123,214.02073923),new mS.$l(124,215.019097612),new mS.$l(125,216.019109649),new mS.$l(126,217.018288571),new mS.$l(127,218.020007906),new mS.$l(128,219.019880348),new mS.$l(129,220.021876493),new mS.$l(130,221.021863742),new mS.$l(131,222.023726),new mS.$l(132,223.023963748),new mS.$l(133,224.025614854),new mS.$l(134,225.026115172),new mS.$l(135,226.02793275),new mS.$l(136,227.028793151),new mS.$l(137,228.031036942),new mS.$l(138,229.032088601),new mS.$l(139,230.034532562),new mS.$l(140,231.035878898),new mS.$l(141,232.03858172),new mS.$l(142,233.040240235),new mS.$l(143,234.043302325),new mS.$l(144,235.045436759),new mS.$l(145,236.048675176),new mS.$l(146,237.05113943),new mS.$l(147,238.054497046),new mS.$l(148,239.05713),new mS.$l(149,240.06098)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(126,218.023487),new mS.$l(127,219.024915423),new mS.$l(128,220.024712),new mS.$l(129,221.026351),new mS.$l(130,222.02607),new mS.$l(131,223.027722956),new mS.$l(132,224.027590139),new mS.$l(133,225.029384369),new mS.$l(134,226.02933975),new mS.$l(135,227.031140069),new mS.$l(136,228.031366357),new mS.$l(137,229.033496137),new mS.$l(138,230.033927392),new mS.$l(139,231.036289158),new mS.$l(140,232.03714628),new mS.$l(141,233.039628196),new mS.$l(142,234.040945606),new mS.$l(143,235.043923062),new mS.$l(144,236.045561897),new mS.$l(145,237.048723955),new mS.$l(146,238.050782583),new mS.$l(147,239.054287777),new mS.$l(148,240.056585734),new mS.$l(149,241.06033),new mS.$l(150,242.062925)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(132,225.033899689),new mS.$l(133,226.035129),new mS.$l(134,227.034958261),new mS.$l(135,228.03618),new mS.$l(136,229.036246866),new mS.$l(137,230.037812591),new mS.$l(138,231.038233161),new mS.$l(139,232.040099),new mS.$l(140,233.04073235),new mS.$l(141,234.042888556),new mS.$l(142,235.044055876),new mS.$l(143,236.046559724),new mS.$l(144,237.048167253),new mS.$l(145,238.050940464),new mS.$l(146,239.052931399),new mS.$l(147,240.056168828),new mS.$l(148,241.058246266),new mS.$l(149,242.061635),new mS.$l(150,243.064273),new mS.$l(151,244.06785)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(134,228.038727686),new mS.$l(135,229.040138934),new mS.$l(136,230.039645603),new mS.$l(137,231.041258),new mS.$l(138,232.041179445),new mS.$l(139,233.04298757),new mS.$l(140,234.043304681),new mS.$l(141,235.0452815),new mS.$l(142,236.046048088),new mS.$l(143,237.048403774),new mS.$l(144,238.0495534),new mS.$l(145,239.052156519),new mS.$l(146,240.05380746),new mS.$l(147,241.056845291),new mS.$l(148,242.058736847),new mS.$l(149,243.061997013),new mS.$l(150,244.06419765),new mS.$l(151,245.067738657),new mS.$l(152,246.070198429),new mS.$l(153,247.07407)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(136,231.04556),new mS.$l(137,232.04659),new mS.$l(138,233.046472),new mS.$l(139,234.047794),new mS.$l(140,235.048029),new mS.$l(141,236.049569),new mS.$l(142,237.049970748),new mS.$l(143,238.051977839),new mS.$l(144,239.053018481),new mS.$l(145,240.055287826),new mS.$l(146,241.056822944),new mS.$l(147,242.059543039),new mS.$l(148,243.061372686),new mS.$l(149,244.064279429),new mS.$l(150,245.066445398),new mS.$l(151,246.069768438),new mS.$l(152,247.072086),new mS.$l(153,248.075745),new mS.$l(154,249.07848)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(137,233.0508),new mS.$l(138,234.05024),new mS.$l(139,235.051591),new mS.$l(140,236.051405),new mS.$l(141,237.052891),new mS.$l(142,238.053016298),new mS.$l(143,239.054951),new mS.$l(144,240.055519046),new mS.$l(145,241.057646736),new mS.$l(146,242.058829326),new mS.$l(147,243.061382249),new mS.$l(148,244.062746349),new mS.$l(149,245.065485586),new mS.$l(150,246.067217551),new mS.$l(151,247.070346811),new mS.$l(152,248.072342247),new mS.$l(153,249.075947062),new mS.$l(154,250.078350687),new mS.$l(155,251.082277873),new mS.$l(156,252.08487)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(138,235.05658),new mS.$l(139,236.05733),new mS.$l(140,237.057127),new mS.$l(141,238.058266),new mS.$l(142,239.058362),new mS.$l(143,240.059749),new mS.$l(144,241.060223),new mS.$l(145,242.06205),new mS.$l(146,243.06300157),new mS.$l(147,244.065167882),new mS.$l(148,245.066355386),new mS.$l(149,246.068666836),new mS.$l(150,247.070298533),new mS.$l(151,248.07308),new mS.$l(152,249.074979937),new mS.$l(153,250.078310529),new mS.$l(154,251.08075344),new mS.$l(155,252.084303),new mS.$l(156,253.08688),new mS.$l(157,254.0906)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(139,237.06207),new mS.$l(140,238.06141),new mS.$l(141,239.062579),new mS.$l(142,240.062295),new mS.$l(143,241.063716),new mS.$l(144,242.063688713),new mS.$l(145,243.065421),new mS.$l(146,244.06599039),new mS.$l(147,245.068039),new mS.$l(148,246.068798807),new mS.$l(149,247.070992043),new mS.$l(150,248.07217808),new mS.$l(151,249.074846818),new mS.$l(152,250.076399951),new mS.$l(153,251.079580056),new mS.$l(154,252.081619582),new mS.$l(155,253.085126791),new mS.$l(156,254.087316198),new mS.$l(157,255.091039),new mS.$l(158,256.09344)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(141,240.06892),new mS.$l(142,241.068662),new mS.$l(143,242.069699),new mS.$l(144,243.069631),new mS.$l(145,244.070969),new mS.$l(146,245.071317),new mS.$l(147,246.072965),new mS.$l(148,247.07365),new mS.$l(149,248.075458),new mS.$l(150,249.076405),new mS.$l(151,250.078654),new mS.$l(152,251.079983592),new mS.$l(153,252.082972247),new mS.$l(154,253.084817974),new mS.$l(155,254.088016026),new mS.$l(156,255.090266386),new mS.$l(157,256.093592),new mS.$l(158,257.095979)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(142,242.07343),new mS.$l(143,243.07451),new mS.$l(144,244.074077),new mS.$l(145,245.075375),new mS.$l(146,246.075281634),new mS.$l(147,247.076819),new mS.$l(148,248.077184411),new mS.$l(149,249.079024),new mS.$l(150,250.079514759),new mS.$l(151,251.081566467),new mS.$l(152,252.082460071),new mS.$l(153,253.085176259),new mS.$l(154,254.086847795),new mS.$l(155,255.089955466),new mS.$l(156,256.091766522),new mS.$l(157,257.095098635),new mS.$l(158,258.097069),new mS.$l(159,259.100588)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(144,245.081017),new mS.$l(145,246.081933),new mS.$l(146,247.081804),new mS.$l(147,248.082909),new mS.$l(148,249.083002),new mS.$l(149,250.084488),new mS.$l(150,251.084919),new mS.$l(151,252.08663),new mS.$l(152,253.08728),new mS.$l(153,254.089725),new mS.$l(154,255.091075196),new mS.$l(155,256.094052757),new mS.$l(156,257.095534643),new mS.$l(157,258.098425321),new mS.$l(158,259.100503),new mS.$l(159,260.103645)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(147,249.087823),new mS.$l(148,250.087493),new mS.$l(149,251.08896),new mS.$l(150,252.088965909),new mS.$l(151,253.090649),new mS.$l(152,254.090948746),new mS.$l(153,255.093232449),new mS.$l(154,256.094275879),new mS.$l(155,257.096852778),new mS.$l(156,258.0982),new mS.$l(157,259.101024),new mS.$l(158,260.102636),new mS.$l(159,261.105743),new mS.$l(160,262.10752)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(148,251.09436),new mS.$l(149,252.09533),new mS.$l(150,253.095258),new mS.$l(151,254.096587),new mS.$l(152,255.096769),new mS.$l(153,256.098763),new mS.$l(154,257.099606),new mS.$l(155,258.101883),new mS.$l(156,259.10299),new mS.$l(157,260.105572),new mS.$l(158,261.106941),new mS.$l(159,262.109692),new mS.$l(160,263.111394)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(149,253.100679),new mS.$l(150,254.100166),new mS.$l(151,255.101492),new mS.$l(152,256.101179573),new mS.$l(153,257.103072),new mS.$l(154,258.103568),new mS.$l(155,259.105628),new mS.$l(156,260.106434),new mS.$l(157,261.108752),new mS.$l(158,262.109918),new mS.$l(159,263.11254),new mS.$l(160,264.113978)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(150,255.107398),new mS.$l(151,256.10811),new mS.$l(152,257.107858),new mS.$l(153,258.109438),new mS.$l(154,259.109721),new mS.$l(155,260.111427),new mS.$l(156,261.112106),new mS.$l(157,262.114153),new mS.$l(158,263.115078),new mS.$l(159,264.117473),new mS.$l(160,265.118659)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(152,258.113151),new mS.$l(153,259.114652),new mS.$l(154,260.114435447),new mS.$l(155,261.116199),new mS.$l(156,262.116477),new mS.$l(157,263.118313),new mS.$l(158,264.118924),new mS.$l(159,265.121066),new mS.$l(160,266.121928)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(153,260.121803),new mS.$l(154,261.1218),new mS.$l(155,262.123009),new mS.$l(156,263.123146),new mS.$l(157,264.12473),new mS.$l(158,265.125198),new mS.$l(159,266.127009),new mS.$l(160,267.12774)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(155,263.12871),new mS.$l(156,264.128408258),new mS.$l(157,265.130001),new mS.$l(158,266.130042),new mS.$l(159,267.131774),new mS.$l(160,268.132156),new mS.$l(161,269.134114)]),YC(KC(hS.lE,1),aU,3,0,[new mS.$l(156,265.136567),new mS.$l(157,266.13794),new mS.$l(158,267.137526),new mS.$l(159,268.138816),new mS.$l(160,269.139106),new mS.$l(161,270.140723),new mS.$l(162,271.141229)])])};
mS.bm=function bm(a,b){mS.am();var c,d;d=b-a;for(c=0;c<mS._l[a].length;c++)if(mS._l[a][c].b==d)return mS._l[a][c].a;return NaN};mS.fm=function fm(){mS.fm=rH;mS.em=YC(KC(hS.OD,1),bT,5,15,[0,1.00794,4.0026,6.941,9.0122,10.811,12.011,14.007,15.999,18.998,20.18,22.99,24.305,26.982,28.086,30.974,32.066,35.453,39.948,39.098,40.078,44.956,47.867,50.942,51.996,54.938,55.845,58.933,58.693,63.546,65.39,69.723,72.61,74.922,78.96,79.904,83.8,85.468,87.62,88.906,91.224,92.906,95.94,98.906,101.07,102.91,106.42,107.87,112.41,114.82,118.71,121.76,127.6,126.9,131.29,132.91,137.33,138.91,140.12,140.91,144.24,146.92,150.36,151.96,157.25,158.93,162.5,164.93,167.26,168.93,173.04,174.97,178.49,180.95,183.84,186.21,190.23,192.22,195.08,196.97,200.59,204.38,207.2,208.98,209.98,209.99,222.02,223.02,226.03,227.03,232.04,231.04,238.03,237.05,239.05,241.06,244.06,249.08,252.08,252.08,257.1,258.1,259.1,262.11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2.0141,3.016,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);mS.cm=YC(KC(hS.OD,1),bT,5,15,[0,1.007825,4.0026,7.016003,9.012182,11.009305,12,14.003074,15.994915,18.998403,19.992435,22.989767,23.985042,26.98153,27.976927,30.973762,31.97207,34.968852,39.962384,38.963707,39.962591,44.95591,47.947947,50.943962,51.940509,54.938047,55.934939,58.933198,57.935346,62.939598,63.929145,68.92558,73.921177,74.921594,79.91652,78.918336,83.911507,84.911794,87.905619,88.905849,89.904703,92.906377,97.905406,89.92381,101.904348,102.9055,105.903478,106.905092,113.903357,114.90388,119.9022,120.903821,129.906229,126.904473,131.904144,132.905429,137.905232,138.906346,139.905433,140.907647,141.907719,135.92398,151.919729,152.921225,157.924099,158.925342,163.929171,164.930319,165.93029,168.934212,173.938859,174.94077,179.946545,180.947992,183.950928,186.955744,191.961467,192.962917,194.964766,196.966543,201.970617,204.974401,207.976627,208.980374,193.98818,195.99573,199.9957,201.00411,206.0038,210.00923,232.038054,216.01896,238.050784,229.03623,232.041169,237.05005,238.05302,242.06194,240.06228,243.06947,243.07446,248.08275,251.08887,253.09515,257.10295,257.10777,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2.014,3.01605,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);mS.dm=YC(KC(hS.QD,1),$S,5,15,[6,1,7,8])};mS.gm=function gm(a){var b,c;c=a.a;for(b=0;b<a.b.length;b++)c+=a.b[b]*mS.cm[a.c[b]];return c};mS.hm=function hm(a){var b,c;b=new iS.MK;for(c=0;c<a.b.length;c++){iS.LK(b,(mS.dh(),mS.Zg)[a.c[c]]);a.b[c]>1&&iS.LK(b,''+a.b[c])}return b.a};mS.im=function im(a){var b,c;c=a.d;for(b=0;b<a.b.length;b++)c+=a.b[b]*mS.em[a.c[b]];return c};mS.jm=function jm(a){var b,c,d,e,f,g,h,i,j,k,l;mS.Po(a,1);e=QC(hS.QD,$S,5,191,15,1);for(c=0;c<a.o;c++){switch(a.A[c]){case 171:e[1]+=5;e[6]+=3;e[7]+=1;e[8]+=1;break;case 172:e[1]+=12;e[6]+=6;e[7]+=4;e[8]+=1;break;case 173:e[1]+=6;e[6]+=4;e[7]+=2;e[8]+=2;break;case 174:e[1]+=5;e[6]+=4;e[7]+=1;e[8]+=3;break;case 175:e[1]+=5;e[6]+=3;e[7]+=1;e[8]+=1;e[16]+=1;break;case 176:e[1]+=8;e[6]+=5;e[7]+=2;e[8]+=2;break;case 177:e[1]+=7;e[6]+=5;e[7]+=1;e[8]+=3;break;case 178:e[1]+=3;e[6]+=2;e[7]+=1;e[8]+=1;break;case 179:e[1]+=7;e[6]+=6;e[7]+=3;e[8]+=1;break;case 181:case 180:e[1]+=11;e[6]+=6;e[7]+=1;e[8]+=1;break;case 182:e[1]+=12;e[6]+=6;e[7]+=2;e[8]+=1;break;case 183:e[1]+=9;e[6]+=5;e[7]+=1;e[8]+=1;e[16]+=1;break;case 184:e[1]+=9;e[6]+=9;e[7]+=1;e[8]+=1;break;case 185:e[1]+=7;e[6]+=5;e[7]+=1;e[8]+=1;break;case 186:e[1]+=5;e[6]+=3;e[7]+=1;e[8]+=2;break;case 187:e[1]+=7;e[6]+=4;e[7]+=1;e[8]+=2;break;case 188:e[1]+=10;e[6]+=11;e[7]+=2;e[8]+=1;break;case 189:e[1]+=9;e[6]+=9;e[7]+=1;e[8]+=2;break;case 190:e[1]+=9;e[6]+=5;e[7]+=1;e[8]+=1;break;case 1:switch(a.v[c]){case 0:case 1:++e[1];break;case 2:++e[151];break;case 3:++e[152];}break;default:++e[a.A[c]];}}for(d=0;d<a.o;d++)a.A[d]>=171&&a.A[d]<=190?(e[1]+=2-mS.Wk(a,d)):(e[1]+=mS.Rk(a,d));h=0;for(j=1;j<=190;j++)e[j]!=0&&++h;this.b=QC(hS.QD,$S,5,h,15,1);this.c=QC(hS.QD,$S,5,h,15,1);h=0;for(i=0;i<mS.dm.length;i++){if(e[mS.dm[i]]!=0){this.b[h]=e[mS.dm[i]];this.c[h]=mS.dm[i];++h;e[mS.dm[i]]=0}}while(true){l='zzz';k=-1;for(g=1;g<=190;g++)if(e[g]>0&&iS.qK(l,(mS.dh(),mS.Zg)[g])>0){l=(mS.dh(),mS.Zg)[g];k=g}if(k==-1)break;this.b[h]=e[k];this.c[h]=k;++h;e[k]=0}this.a=0;this.d=0;for(b=0;b<a.d;b++){if(a.A[b]!=1&&a.v[b]!=0){g=a.A[b];f=a.v[b];this.a+=mS.bm(g,f)-mS.cm[g];this.d+=mS.bm(g,f)-mS.em[g]}}};pH(116,1,{});_.a=0;_.d=0;hS.mE=$I(116);mS.km=function km(a){a.a=new BS.iL('0.0000')};mS.lm=function lm(a,b){var c,d;d=BS.gL(a.a,b);for(c=iS.IK(d).length;c<10;c++)iS.NK(a.b,32);iS.QK(a.b,d)};mS.mm=function mm(a,b){var c,d,e;if(b<0||b>999){iS.QK(a.b,'  ?');return}c=false;for(d=0;d<3;d++){e=b/100|0;if(e==0){d==2||c?iS.NK(a.b,48):iS.NK(a.b,32)}else{iS.NK(a.b,48+e&VS);c=true}b=10*(b%100)}};mS.nm=function nm(a){mS.om.call(this,a)};mS.om=function om(a){mS.pm.call(this,a,new iS.UK)};mS.pm=function pm(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T;mS.km(this);mS.Po(a,7);H=true;for(d=0;d<a.d;d++){if((a.s[d]&3)!=0&&(a.s[d]&3)!=3&&(a.s[d]&zT)>>19!=1){H=false;break}}J=-1;if(H){A=QC(hS.QD,$S,5,32,15,1);for(e=0;e<a.d;e++){if((a.s[e]&3)!=0&&(a.s[e]&3)!=3&&(a.s[e]&zT)>>19==1){C=(a.s[e]&zT)>>19!=1&&(a.s[e]&zT)>>19!=2?-1:(a.s[e]&RT)>>21;++A[C];0<A[C]&&(J=C);break}}}this.b=b;L=a.M!=null?a.M:'';iS.QK(this.b,L+GS);iS.QK(this.b,'Actelion Java MolfileCreator 1.0\n\n');mS.mm(this,a.o);mS.mm(this,a.p);iS.QK(this.b,'  0  0');mS.mm(this,H?0:1);iS.QK(this.b,'  0  0  0  0  0999 V2000\n');D=a.o==1;for(g=1;g<a.o;g++){if(a.H[g].a!=a.H[0].a||a.H[g].b!=a.H[0].b||a.H[g].c!=a.H[0].c){D=true;break}}B=1;if(D){p=mS.bi(a,a.o,a.p,(mS.dh(),mS.bh));if(p!=0){(p<1||p>3)&&(B=1.5/p)}else{K=UT;for(e=1;e<a.o;e++){for(f=0;f<e;f++){u=a.H[f].a-a.H[e].a;v=a.H[f].b-a.H[e].b;w=a.H[f].c-a.H[e].c;t=u*u+v*v+w*w;K>t&&(K=t)}}B=3/K}}for(h=0;h<a.o;h++){if(D){mS.lm(this,B*a.H[h].a);mS.lm(this,B*-a.H[h].b);mS.lm(this,B*-a.H[h].c)}else{iS.QK(this.b,'    0.0000    0.0000    0.0000')}if((a.t==null?null:a.t[h])!=null)iS.QK(this.b,' L  ');else if((a.w[h]&1)!=0)iS.QK(this.b,' A  ');else{n=(mS.dh(),mS.Zg)[a.A[h]];iS.QK(this.b,' '+n);iS.IK(n).length==1?iS.QK(this.b,'  '):iS.IK(n).length==2&&iS.QK(this.b,' ')}iS.QK(this.b,' 0  0  0');F=lT&a.w[h];F==0?iS.QK(this.b,'  0'):F==384?iS.QK(this.b,'  3'):F==128?iS.QK(this.b,'  2'):F==1792?iS.QK(this.b,'  1'):F==1664&&iS.QK(this.b,'  2');iS.QK(this.b,(a.w[h]&LT)!=0?'  1':'  0');T=((a.s[h]&QT)>>>28)-1;T==-1?iS.QK(this.b,'  0'):T==0?iS.QK(this.b,' 15'):mS.mm(this,T);iS.QK(this.b,'  0  0  0');mS.mm(this,iS.bK(a.u[h]));iS.QK(this.b,'  0  0\n')}for(q=0;q<a.p;q++){switch(a.F[q]){case 1:N=1;Q=0;break;case 2:N=2;Q=0;break;case 4:N=3;Q=0;break;case 9:N=1;Q=6;break;case 17:N=1;Q=1;break;case 26:N=2;Q=3;break;case 64:N=4;Q=0;break;case 32:N=8;Q=0;break;default:N=1;Q=0;}H&&(Q==1||Q==6)&&mS.Oh(a,a.B[0][q])!=J&&(Q=0);r=a.D[q]&31;r!=0&&(r==8?(N=4):r==3?(N=5):r==9?(N=6):r==10?(N=7):(N=8));P=a.D[q]&96;S=P==0?0:P==64?1:2;mS.mm(this,1+a.B[0][q]);mS.mm(this,1+a.B[1][q]);mS.mm(this,N);mS.mm(this,Q);iS.QK(this.b,'  0');mS.mm(this,S);iS.QK(this.b,'  0\n')}M=0;for(i=0;i<a.o;i++)a.q[i]!=0&&++M;if(M!=0){iS.QK(this.b,'M  CHG');mS.mm(this,M);for(e=0;e<a.o;e++){if(a.q[e]!=0){iS.QK(this.b,' ');mS.mm(this,e+1);s=a.q[e];if(s<0){iS.QK(this.b,'  -');s=-s}else iS.QK(this.b,'   ');iS.NK(this.b,48+s&VS)}}iS.QK(this.b,GS)}M=0;for(j=0;j<a.o;j++)a.v[j]==0||++M;if(M!=0){iS.QK(this.b,'M  ISO');mS.mm(this,M);for(e=0;e<a.o;e++){if(a.v[e]!=0){iS.QK(this.b,' ');mS.mm(this,e+1);iS.QK(this.b,' ');mS.mm(this,a.v[e])}}iS.QK(this.b,GS)}M=0;for(k=0;k<a.o;k++)(a.s[k]&48)!=0&&++M;if(M!=0){iS.QK(this.b,'M  RAD');mS.mm(this,M);for(c=0;c<a.o;c++){if((a.s[c]&48)!=0){iS.QK(this.b,' ');mS.mm(this,c+1);switch(a.s[c]&48){case 16:iS.QK(this.b,'   1');break;case 32:iS.QK(this.b,'   2');break;case 48:iS.QK(this.b,'   3');}}}iS.QK(this.b,GS)}if(a.I){M=0;for(e=0;e<a.o;e++)(a.w[e]&120)!=0&&++M;if(M!=0){iS.QK(this.b,'M  RBD');mS.mm(this,M);for(f=0;f<a.o;f++){O=a.w[f]&120;if(O!=0){iS.QK(this.b,' ');mS.mm(this,f+1);switch(O){case 112:iS.QK(this.b,'  -1');break;case 8:iS.QK(this.b,'   1');break;case 104:iS.QK(this.b,'   2');break;case 88:iS.QK(this.b,'   3');break;case 56:iS.QK(this.b,'   4');}}}iS.QK(this.b,GS)}for(l=0;l<a.o;l++){o=a.t==null?null:a.t[l];if(o!=null){iS.QK(this.b,'M  ALS ');mS.mm(this,l+1);mS.mm(this,o.length);iS.QK(this.b,(a.w[l]&1)!=0?' T ':' F ');for(G=0;G<o.length;G++){I=(mS.dh(),mS.Zg)[o[G]];switch(iS.IK(I).length){case 1:iS.QK(this.b,I+'   ');break;case 2:iS.QK(this.b,I+'  ');break;case 3:iS.QK(this.b,I+' ');break;default:iS.QK(this.b,'   ?');}}iS.QK(this.b,GS)}}M=0;for(m=0;m<a.o;m++)(a.w[m]&6144)!=0&&++M;if(M!=0){iS.QK(this.b,'M  SUB');mS.mm(this,M);for(c=0;c<a.o;c++){R=a.w[c]&6144;if(R!=0){iS.QK(this.b,' ');mS.mm(this,c+1);(R&jT)!=0?iS.QK(this.b,'   '+(a.c[c]+1)):iS.QK(this.b,'  -2')}}iS.QK(this.b,GS)}}iS.QK(this.b,'M  END\n')};pH(70,1,{},mS.nm);hS.oE=$I(70);mS.qm=function qm(a,b,c,d,e,f){var g,h,i,j;j=1;h=false;switch(e){case 1:j=17;break;case 3:j=26;break;case 4:j=17;h=true;break;case 6:j=9;break;default:switch(d){case 1:j=1;break;case 2:j=2;break;case 3:j=4;break;case 4:j=64;break;case 8:a.e&&(j=32);break;case 9:j=32;}}g=mS.hh(a.d,b,c,j);i=0;h&&mS.nj(a.d,b,1,-1);if(d>4){switch(d){case 5:i|=3;break;case 6:i|=9;break;case 7:i|=10;break;case 8:a.e||(i|=31);}}f==1&&(i|=64);f==2&&(i|=32);i!=0&&mS.Kj(a.d,g,i,true);return g};mS.rm=function rm(a){var b,c,d,e,f,g,h,i,j,k,l;g=QC(hS.QD,$S,5,a.d.o,15,1);for(c=0;c<a.d.o;c++)g[c]=-mS.Kh(a.d,c);mS.Yd(new mS.fe(a.d),null,true);for(d=0;d<a.d.o;d++)g[d]+=mS.Kh(a.d,d);for(b=0;b<a.d.o;b++){if(g[b]!=0){h=-g[b];for(e=0;e<a.d.p;e++){for(j=0;j<2;j++){if(h>0&&mS.oi(a.d,e)==32&&mS.di(a.d,1-j,e)==b){l=mS.di(a.d,j,e);if(mS.Ni(a.d,l)){k=mS.tm(a,l);f=mS.Kh(a.d,l);if(f<k){i=h<k-f?h:k-f;mS.ij(a.d,l,f+i);h-=i}}}}}}}};mS.sm=function sm(a,b){a.d=null;return mS.Jm(a,new zS.hI(new zS.kI(b)))?a.d:null};mS.tm=function tm(a,b){var c,d;c=mS._h(a.d,b);d=c<(mS.dh(),mS._g).length?mS._g[c]:null;return d==null?0:d[d.length-1]};mS.um=function um(a,b){var c;c=!a.a?null:CS.iN(a.a,new iS.TJ(b));return !c?b-1:c.a};mS.vm=function vm(a,b){var c;c=!a.b?null:CS.iN(a.b,new iS.TJ(b));return !c?b-1:c.a};mS.wm=function wm(a,b){var c;if(b==-1){return -1}for(c=b+1;c<iS.IK(a).length;c++){if(iS.IK(a).charCodeAt(c)!=32&&iS.IK(a).charCodeAt(c)!=9){return c}}return -1};mS.xm=function xm(a,b){var c;for(c=b;c<iS.IK(a).length;c++){if(iS.IK(a).charCodeAt(c)==32||iS.IK(a).charCodeAt(c)==9){return c}}return -1};mS.ym=function ym(a){if(iS.IK(a).indexOf('ATOMS=(')!=-1)return bU;if(iS.IK(a).indexOf('BONDS=(')!=-1)return 'BONDS';return null};mS.zm=function zm(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F;q=(h=mS.xm(b,1),h==-1?iS.IK(b).length:h);d=iS.qJ(iS.IK(b).substr(0,q));p=mS.wm(b,q);q=(i=mS.xm(b,p+1),i==-1?iS.IK(b).length:i);s=iS.IK(b).substr(p,q-p);A=null;e=false;r=mS.Gm(b);if(r!=0){A=mS.Am(b);r<0&&(e=true);q=r<0?-r:r}p=mS.wm(b,q);q=(j=mS.xm(b,p+1),j==-1?iS.IK(b).length:j);C=OJ(iS.IK(b).substr(p,q-p));p=mS.wm(b,q);q=(k=mS.xm(b,p+1),k==-1?iS.IK(b).length:k);D=OJ(iS.IK(b).substr(p,q-p));p=mS.wm(b,q);q=(l=mS.xm(b,p+1),l==-1?iS.IK(b).length:l);F=OJ(iS.IK(b).substr(p,q-p));p=mS.wm(b,q);q=(m=mS.xm(b,p+1),m==-1?iS.IK(b).length:m);u=iS.qJ(iS.IK(b).substr(p,q-p));c=mS.eh(a.d,C,-D,-F);c+1!=d&&(!a.a&&(a.a=new CS.KP),CS.CP(a.a,new iS.TJ(d),new iS.TJ(c)));A!=null&&mS.pj(a.d,c,A,e);u!=0&&mS.qj(a.d,c,u,false);if(iS.uK(s,'A')){mS.uj(a.d,c,1,true)}else if(iS.uK(s,'Q')){t=QC(hS.QD,$S,5,1,15,1);t[0]=6;mS.pj(a.d,c,t,true)}else{mS.Bj(a.d,c,mS.ck(s))}while((p=mS.wm(b,q))!=-1){q=(g=mS.xm(b,p+1),g==-1?iS.IK(b).length:g);v=iS.IK(b).substr(p,q-p);o=iS.yK(v,HK(61));n=iS.IK(v).substr(0,o);B=iS.qJ(iS.IK(v).substr(o+1,iS.IK(v).length-(o+1)));if(iS.uK(n,'CHG')){mS.ij(a.d,c,B)}else if(iS.uK(n,'RAD')){switch(B){case 1:mS.vj(a.d,c,16);break;case 2:mS.vj(a.d,c,32);break;case 3:mS.vj(a.d,c,48);}}else if(iS.uK(n,'CFG'));else if(iS.uK(n,'MASS')){mS.sj(a.d,c,B)}else if(iS.uK(n,'VAL')){mS.gj(a.d,c,B==-1?0:B==0?-1:B)}else if(iS.uK(n,'HCOUNT')){switch(B){case 0:break;case -1:mS.uj(a.d,c,1792,true);break;case 1:mS.uj(a.d,c,128,true);break;case 2:mS.uj(a.d,c,384,true);break;default:mS.uj(a.d,c,896,true);}}else if(iS.uK(n,'SUBST')){if(B==-1){mS.uj(a.d,c,kT,true)}else if(B>0){w=0;for(f=0;f<a.d.p;f++){(mS.di(a.d,0,f)==c||mS.di(a.d,1,f)==c)&&++w}B>w&&mS.uj(a.d,c,jT,true)}}else if(iS.uK(n,'RBCNT')){switch(B){case 3:case -1:mS.uj(a.d,c,112,true);break;case 1:mS.uj(a.d,c,8,true);break;case 2:mS.uj(a.d,c,104,true);break;case 4:mS.uj(a.d,c,56,true);}}}};mS.Am=function Am(a){var b,c,d,e,f,g,h,i;h=null;c=iS.IK(a).indexOf('[');d=iS.IK(a).indexOf(']',c);if(c>=0&&d>0){b=QC(hS.QD,$S,5,16,15,1);i=iS.IK(a).substr(c+1,d-(c+1));e=0;g=true;while(g&&e<16){c=iS.IK(i).indexOf(',');if(c==-1){f=i;g=false}else{f=iS.IK(i).substr(0,c);i=iS.IK(i).substr(c+1,iS.IK(i).length-(c+1))}b[e++]=mS.ck(f)}h=QC(hS.QD,$S,5,e,15,1);iS.ZK(b,h,e)}return h};mS.Bm=function Bm(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t;p=(i=mS.xm(b,1),i==-1?iS.IK(b).length:i);f=iS.qJ(iS.IK(b).substr(0,p));o=mS.wm(b,p);p=(j=mS.xm(b,o+1),j==-1?iS.IK(b).length:j);g=iS.qJ(iS.IK(b).substr(o,p-o));o=mS.wm(b,p);p=(k=mS.xm(b,o+1),k==-1?iS.IK(b).length:k);c=mS.um(a,iS.qJ(iS.IK(b).substr(o,p-o)));o=mS.wm(b,p);p=(l=mS.xm(b,o+1),l==-1?iS.IK(b).length:l);d=mS.um(a,iS.qJ(iS.IK(b).substr(o,p-o)));r=0;s=0;while((o=mS.wm(b,p))!=-1){p=(h=mS.xm(b,o+1),h==-1?iS.IK(b).length:h);q=iS.IK(b).substr(o,p-o);n=iS.yK(q,HK(61));m=iS.IK(q).substr(0,n);t=iS.qJ(iS.IK(q).substr(n+1,iS.IK(q).length-(n+1)));if(iS.uK(m,'CFG')){switch(t){case 1:r=1;break;case 2:r=g==2?3:4;break;case 3:r=6;}}else iS.uK(m,'TOPO')?(s=t):undefined}e=mS.qm(a,c,d,g,r,s);e+1!=f&&(!a.b&&(a.b=new CS.KP),CS.CP(a.b,new iS.TJ(f),new iS.TJ(e)))};mS.Cm=function Cm(a,b){var c,d,e,f,g,h;h=mS.ym(b);if(h!=null){g=mS.Em(b,h);if(iS.uK(iS.IK(b).substr(0,13),'MDLV30/STEABS')){if(iS.uK(h,bU))for(f=0;f<g.length;f++)mS.nj(a.d,mS.um(a,g[f]),0,-1);else for(e=0;e<g.length;e++)mS.Fj(a.d,mS.vm(a,g[e]),0,-1)}else if(iS.uK(iS.IK(b).substr(0,13),'MDLV30/STERAC')){d=iS.qJ(iS.EK(b,13,mS.xm(b,13)));if(iS.uK(h,bU))for(f=0;f<g.length;f++)mS.nj(a.d,mS.um(a,g[f]),1,d-1);else for(e=0;e<g.length;e++)mS.Fj(a.d,mS.vm(a,g[e]),1,d-1)}else if(iS.uK(iS.IK(b).substr(0,13),'MDLV30/STEREL')){d=iS.qJ(iS.EK(b,13,mS.xm(b,13)));if(iS.uK(h,bU))for(f=0;f<g.length;f++)mS.nj(a.d,mS.um(a,g[f]),2,d-1);else for(e=0;e<g.length;e++)mS.Fj(a.d,mS.vm(a,g[e]),2,d-1)}else if(iS.uK(iS.IK(b).substr(0,13),'MDLV30/HILITE')){if(iS.uK(h,bU)){for(e=0;e<g.length;e++)mS.jj(a.d,mS.um(a,g[e]),448)}else{for(e=0;e<g.length;e++){c=mS.vm(a,g[e]);mS.jj(a.d,mS.di(a.d,0,c),448);mS.jj(a.d,mS.di(a.d,1,c),448)}}}}};mS.Dm=function Dm(a,b){var c,d,e;if(!a.d){if(iS.uK(iS.IK(b).substr(0,6),'COUNTS')){c=mS.wm(b,mS.xm(b,7));d=iS.qJ(iS.EK(b,7,mS.xm(b,7)));e=iS.qJ(iS.EK(b,c,mS.xm(b,c)));a.d=new mS.dp(d,e)}}};mS.Em=function Em(a,b){var c,d,e,f,g,h;f=iS.IK(a).indexOf(b+'=(')+iS.IK(b).length+2;g=iS.zK(a,HK(41),f);e=mS.xm(a,f);c=iS.qJ(iS.IK(a).substr(f,e-f));h=QC(hS.QD,$S,5,c,15,1);for(d=0;d<c;d++){f=mS.wm(a,e);e=mS.xm(a,f);(e==-1||e>g)&&(e=g);h[d]=iS.qJ(iS.IK(a).substr(f,e-f))}return h};mS.Fm=function Fm(a){var b,c,d,e,f,g,h,i,j;i=QC(hS.QD,$S,5,a.d.o,15,1);for(d=0;d<a.d.p;d++)if(mS.oi(a.d,d)==64)for(g=0;g<2;g++)i[mS.di(a.d,g,d)]=1;for(e=0;e<a.d.p;e++){j=mS.li(a.d,e);for(f=0;f<2;f++)i[mS.di(a.d,f,e)]+=j}for(c=0;c<a.d.p;c++){if(mS.li(a.d,c)==1){for(f=0;f<2;f++){h=mS.di(a.d,1-f,c);if(mS.Ni(a.d,h)){b=mS.di(a.d,f,c);if(mS.Ki(a.d,b)&&i[b]>mS.si(a.d,b)){mS.Lj(a.d,c,32);continue}}}}}};mS.Gm=function Gm(a){var b,c;if(iS.IK(a).indexOf('[')>=0){b=iS.IK(a).indexOf(' NOT[');c=iS.IK(a).indexOf(']',b);if(b>=0&&c>0){return -(c+1)}else{b=iS.IK(a).indexOf(' [');c=iS.IK(a).indexOf(']',b);if(b>=0&&c>0){return c+1}}b=iS.IK(a).indexOf(" 'NOT[");c=iS.IK(a).indexOf("]'",b);if(b>=0&&c>0){return -(c+2)}else{b=iS.IK(a).indexOf(" '[");c=iS.IK(a).indexOf("]'",b);if(b>=0&&c>0){return c+2}}iS.YK()}return 0};mS.Hm=function Hm(a,b,c){a.d=b;return mS.Jm(a,c)};mS.Im=function Im(a){return iS.IK(a).length==0?0:iS.qJ(a)};mS.Jm=function Jm(b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X;try{if(b.d){mS.Eh(b.d);mS.Nj(b.d,false)}D=zS.gI(c);if(null==D){return false}if(null==zS.gI(c)){return false}if(null==(w=zS.gI(c))){return false}b.e=iS.IK(w).indexOf("From CSD data. Using bond type 'Any'")!=-1;b.c=iS.IK(w).indexOf('From CSD data.')!=-1;if(null==(w=zS.gI(c))){return false}try{F=iS.qJ(iS.FK(iS.IK(w).substr(0,3)));G=iS.qJ(iS.FK(iS.IK(w).substr(3,3)));H=mS.Im(iS.FK(iS.IK(w).substr(6,3)));n=mS.Im(iS.FK(iS.IK(w).substr(12,3)));T=iS.IK(w).length>=39&&iS.uK(iS.IK(w).substr(34,5),'V3000')?3:2}catch(a){a=IG(a);if(CD(a,12)){return false}else throw JG(a)}if(T==3){K=mS.Km(b,c);mS.Rj(b.d,D);return K}!b.d&&(b.d=new mS.dp(F,G));mS.Rj(b.d,D);n==0&&(b.d.J=true);if(0==F){while(w!=null&&!(iS.uK(w,cU)||iS.uK(w,dU)||iS.uK(iS.IK(w).substr(1,iS.IK(w).length-1),'$'))){w=zS.gI(c)}return true}for(r=0;r<F;r++){if(null==(w=zS.gI(c))){return false}V=OJ(iS.FK(iS.IK(w).substr(0,10)));W=OJ(iS.FK(iS.IK(w).substr(10,10)));X=OJ(iS.FK(iS.IK(w).substr(20,10)));e=mS.eh(b.d,V,-W,-X);v=iS.FK(iS.IK(w).substr(31,3));h=mS.ck(v);mS.Bj(b.d,e,h);iS.uK(v,'A')&&mS.uj(b.d,e,1,true);C=mS.Im(iS.FK(iS.IK(w).substr(34,2)));C!=0&&mS.sj(b.d,e,(mS.dh(),mS.ah)[h]+C);m=mS.Im(iS.FK(iS.IK(w).substr(36,3)));m!=0&&mS.ij(b.d,e,4-m);A=iS.IK(w).length<63?0:mS.Im(iS.FK(iS.IK(w).substr(60,3)));mS.qj(b.d,e,A,false);p=iS.IK(w).length<45?0:mS.Im(iS.FK(iS.IK(w).substr(42,3)));switch(p){case 0:break;case 1:mS.uj(b.d,e,768,true);break;case 2:mS.uj(b.d,e,128,true);break;case 3:mS.uj(b.d,e,384,true);break;default:mS.uj(b.d,e,896,true);}iS.IK(w).length>=48&&iS.IK(w).charCodeAt(47)==49&&mS.uj(b.d,e,LT,true);S=iS.IK(w).length<51?0:mS.Im(iS.FK(iS.IK(w).substr(48,3)));switch(S){case 0:break;case 15:mS.gj(b.d,e,0);break;default:mS.gj(b.d,e,S);}}for(s=0;s<G;s++){if(null==(w=zS.gI(c))){return false}f=iS.qJ(iS.FK(iS.IK(w).substr(0,3)))-1;g=iS.qJ(iS.FK(iS.IK(w).substr(3,3)))-1;k=iS.qJ(iS.FK(iS.IK(w).substr(6,3)));M=iS.IK(w).length<12?0:mS.Im(iS.FK(iS.IK(w).substr(9,3)));Q=iS.IK(w).length<18?0:mS.Im(iS.FK(iS.IK(w).substr(15,3)));mS.qm(b,f,g,k,M,Q)}for(q=0;q<H;q++){if(null==zS.gI(c)){return false}}if(null==(w=zS.gI(c))){n==0&&mS.Po(b.d,7);return true}while(w!=null&&!(iS.uK(w,cU)||iS.uK(w,dU))){if(iS.uK(iS.IK(w).substr(0,6),'M  CHG')){t=iS.qJ(iS.FK(iS.IK(w).substr(6,3)));if(t>0){d=10;U=14;for(u=1;u<=t;++u,d+=8,U+=8){e=iS.qJ(iS.FK(iS.IK(w).substr(d,d+3-d)))-1;l=iS.qJ(iS.FK(iS.IK(w).substr(U,U+3-U)));mS.ij(b.d,e,l)}}}if(iS.uK(iS.IK(w).substr(0,6),'M  ISO')){t=iS.qJ(iS.FK(iS.IK(w).substr(6,3)));if(t>0){d=10;U=14;for(u=1;u<=t;++u,d+=8,U+=8){e=iS.qJ(iS.FK(iS.IK(w).substr(d,d+3-d)))-1;B=iS.qJ(iS.FK(iS.IK(w).substr(U,U+3-U)));mS.sj(b.d,e,B)}}}if(iS.uK(iS.IK(w).substr(0,6),'M  RAD')){t=iS.qJ(iS.FK(iS.IK(w).substr(6,3)));if(t>0){d=10;U=14;for(u=1;u<=t;++u,d+=8,U+=8){e=iS.qJ(iS.FK(iS.IK(w).substr(d,d+3-d)))-1;J=iS.qJ(iS.FK(iS.IK(w).substr(U,U+3-U)));switch(J){case 1:mS.vj(b.d,e,16);break;case 2:mS.vj(b.d,e,32);break;case 3:mS.vj(b.d,e,48);}}}}if(iS.uK(iS.IK(w).substr(0,6),'M  RBD')){t=iS.qJ(iS.FK(iS.IK(w).substr(6,3)));if(t>0){d=10;U=14;for(u=1;u<=t;++u,d+=8,U+=8){e=iS.qJ(iS.FK(iS.IK(w).substr(d,d+3-d)))-1;L=iS.qJ(iS.FK(iS.IK(w).substr(U,U+3-U)));switch(L){case 3:case -1:mS.uj(b.d,e,112,true);break;case 1:mS.uj(b.d,e,8,true);break;case 2:mS.uj(b.d,e,104,true);break;case 4:mS.uj(b.d,e,56,true);}}}}if(iS.uK(iS.IK(w).substr(0,6),'M  ALS')){e=iS.qJ(iS.FK(iS.IK(w).substr(7,3)))-1;if(e>=0){I=iS.qJ(iS.FK(iS.IK(w).substr(10,3)));i=iS.IK(w).charCodeAt(14)==84;R=QC(hS.QD,$S,5,I,15,1);d=16;for(u=0;u<I;++u,d+=4){P=iS.FK(iS.IK(w).substr(d,d+4-d));R[u]=mS.ck(P)}mS.pj(b.d,e,R,i)}}if(iS.uK(iS.IK(w).substr(0,6),'M  SUB')){t=iS.qJ(iS.FK(iS.IK(w).substr(6,3)));if(t>0){d=10;U=14;for(u=1;u<=t;++u,d+=8,U+=8){e=iS.qJ(iS.FK(iS.IK(w).substr(d,d+3-d)))-1;N=iS.qJ(iS.FK(iS.IK(w).substr(U,U+3-U)));if(N==-2){mS.uj(b.d,e,kT,true)}else if(N>0){O=0;for(j=0;j<b.d.p;j++){(mS.di(b.d,0,j)==e||mS.di(b.d,1,j)==e)&&++O}N>O&&mS.uj(b.d,e,jT,true)}}}}w=zS.gI(c)}}catch(a){a=IG(a);if(CD(a,12)){o=a;iS.sA(o,(iS.YK(),iS.XK),'');return false}else throw JG(a)}if(b.c){mS.Fm(b);mS.rm(b)}mS.Po(b.d,7);return true};mS.Km=function Km(a,b){var c,d,e,f,g;!!a.a&&CS.vP(a.a);!!a.b&&CS.vP(a.b);e=0;d=zS.gI(b);while(d!=null&&iS.uK(iS.IK(d).substr(0,7),eU)){d=iS.FK(iS.IK(d).substr(7,iS.IK(d).length-7));while(g=iS.IK('-').length,iS.uK(iS.IK(d).substr(iS.IK(d).length-g,g),'-')){c=zS.gI(b);if(!iS.uK(iS.IK(c).substr(0,7),eU)){return false}d=iS.FK(iS.sK(iS.EK(d,0,iS.IK(d).length-1),iS.IK(c).substr(7,iS.IK(c).length-7)))}if(iS.uK(iS.IK(d).substr(0,5),'BEGIN')){f=iS.FK(iS.IK(d).substr(6,iS.IK(d).length-6));if(iS.uK(iS.IK(f).substr(0,4),'CTAB')){e=1}else if(iS.uK(iS.IK(f).substr(0,4),'ATOM')){e=2}else if(iS.uK(iS.IK(f).substr(0,4),'BOND')){e=3}else if(iS.uK(iS.IK(f).substr(0,10),'COLLECTION')){e=4}else{return false}}else if(iS.uK(iS.IK(d).substr(0,3),'END')){e=0}else if(e==1){mS.Dm(a,d)}else if(e==2){mS.zm(a,d)}else if(e==3){mS.Bm(a,d)}else if(e==4){mS.Cm(a,d)}else{return false}d=zS.gI(b)}while(d!=null&&!(iS.uK(iS.IK(d).substr(0,6),cU)||iS.uK(d,dU))){d=zS.gI(b)}return true};mS.Lm=function Lm(){};pH(86,1,{},mS.Lm);_.c=false;_.e=false;hS.pE=$I(86);mS.Mm=function Mm(a){};mS.Nm=function Nm(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I;iS.QK(a.a,'M  V30 BEGIN CTAB\n');iS.QK(a.a,'M  V30 COUNTS '+b.o+' '+b.p+' 0 0 0\n');iS.QK(a.a,'M  V30 BEGIN ATOM\n');for(i=0;i<b.o;i++){iS.QK(a.a,eU+(i+1));if((b.t==null?null:b.t[i])!=null){k=b.t==null?null:b.t[i];t=(b.w[i]&1)!=0;iS.QK(a.a,t?' NOT[':' [');for(r=0;r<k.length;r++){r>0&&iS.QK(a.a,',');s=(mS.dh(),mS.Zg)[k[r]];switch(iS.IK(s).length){case 2:case 3:case 1:iS.QK(a.a,s);break;default:iS.QK(a.a,'?');}}iS.QK(a.a,']')}else (b.w[i]&1)!=0?iS.QK(a.a,' A'):iS.QK(a.a,' '+(mS.dh(),mS.Zg)[b.A[i]]);if(c){iS.QK(a.a,' '+LD(WS*a.b*b.H[i].a)/WS);iS.QK(a.a,' '+LD(WS*a.b*-b.H[i].b)/WS);iS.QK(a.a,' '+LD(WS*a.b*-b.H[i].c)/WS)}else{iS.QK(a.a,' 0 0 0')}iS.QK(a.a,' '+iS.bK(b.u[i]));b.q[i]!=0&&iS.QK(a.a,' CHG='+b.q[i]);if((b.s[i]&48)!=0){iS.QK(a.a,' RAD=');switch(b.s[i]&48){case 16:iS.QK(a.a,'1');break;case 32:iS.QK(a.a,'2');break;case 48:iS.QK(a.a,'3');}}if((b.s[i]&3)==1||(b.s[i]&3)==2){iS.QK(a.a,' CFG=');(b.s[i]&3)==1?iS.QK(a.a,'1'):iS.QK(a.a,'2')}b.v[i]!=0&&iS.QK(a.a,' MASS='+b.v[i]);I=((b.s[i]&QT)>>>28)-1;I!=-1&&iS.QK(a.a,' VAL='+(I==0?'-1':iS.$J(I)));q=lT&b.w[i];q==384?iS.QK(a.a,' HCOUNT=2'):q==128?iS.QK(a.a,' HCOUNT=1'):q==1792?iS.QK(a.a,' HCOUNT=-1'):q==1664&&iS.QK(a.a,' HCOUNT=1');F=b.w[i]&6144;F!=0&&((F&jT)!=0?iS.QK(a.a,' SUBST='+(b.c[i]+1)):iS.QK(a.a,' SUBST=-1'));B=b.w[i]&120;if(B!=0){switch(B){case 112:iS.QK(a.a,' RBCNT=-1');break;case 104:case 8:iS.QK(a.a,' RBCNT=2');break;case 88:iS.QK(a.a,' RBCNT=3');break;case 56:iS.QK(a.a,' RBCNT=4');}}iS.QK(a.a,GS)}iS.QK(a.a,'M  V30 END ATOM\n');iS.QK(a.a,'M  V30 BEGIN BOND\n');for(m=0;m<b.p;m++){iS.QK(a.a,eU+(m+1));switch(b.F[m]){case 1:w=1;D=0;break;case 2:w=2;D=0;break;case 4:w=3;D=0;break;case 9:w=1;D=3;break;case 17:w=1;D=1;break;case 26:w=2;D=2;break;case 64:w=4;D=0;break;case 32:w=9;D=0;break;default:w=1;D=0;}o=b.D[m]&31;o!=0&&(o==8?(w=4):o==3?(w=5):o==9?(w=6):o==10?(w=7):(w=8));iS.QK(a.a,' '+w+' '+(b.B[0][m]+1)+' '+(b.B[1][m]+1));D!=0&&iS.QK(a.a,' CFG='+D);C=b.D[m]&96;G=C==0?0:C==64?1:2;G!=0&&iS.QK(a.a,' TOPO='+G);iS.QK(a.a,GS)}iS.QK(a.a,'M  V30 END BOND\n');A=false;d=0;u=QC(hS.QD,$S,5,32,15,1);f=QC(hS.QD,$S,5,32,15,1);for(j=0;j<b.d;j++){if((b.s[j]&3)==1||(b.s[j]&3)==2){A=true;H=(b.s[j]&zT)>>19;H==1?++f[(b.s[j]&zT)>>19!=1&&(b.s[j]&zT)>>19!=2?-1:(b.s[j]&RT)>>21]:H==2?++u[(b.s[j]&zT)>>19!=1&&(b.s[j]&zT)>>19!=2?-1:(b.s[j]&RT)>>21]:++d}}e=0;v=QC(hS.QD,$S,5,32,15,1);g=QC(hS.QD,$S,5,32,15,1);for(n=0;n<b.e;n++){if(mS.li(b,n)!=2&&((b.C[n]&3)==1||(b.C[n]&3)==2)){A=true;H=(b.C[n]&ST)>>10;H==1?++g[(b.C[n]&ST)>>10!=1&&(b.C[n]&ST)>>10!=2?-1:(b.C[n]&TT)>>12]:H==2?++v[(b.C[n]&ST)>>10!=1&&(b.C[n]&ST)>>10!=2?-1:(b.C[n]&TT)>>12]:++e}}if(A){iS.QK(a.a,'M  V30 BEGIN COLLECTION\n');if(d!=0){iS.QK(a.a,'M  V30 MDLV30/STEABS ATOMS=('+d);for(h=0;h<b.d;h++){((b.s[h]&3)==1||(b.s[h]&3)==2)&&(b.s[h]&zT)>>19==0&&iS.QK(a.a,' '+(h+1))}iS.QK(a.a,fU)}if(e!=0){iS.QK(a.a,'M  V30 MDLV30/STEABS BONDS=('+e);for(l=0;l<b.e;l++){mS.li(b,l)!=2&&((b.C[l]&3)==1||(b.C[l]&3)==2)&&(b.C[l]&ST)>>10==0&&iS.QK(a.a,' '+(l+1))}iS.QK(a.a,fU)}for(p=0;p<32;p++){if(u[p]!=0){iS.QK(a.a,gU+(p+1)+' ATOMS=('+u[p]);for(h=0;h<b.d;h++){((b.s[h]&3)==1||(b.s[h]&3)==2)&&(b.s[h]&zT)>>19==2&&((b.s[h]&zT)>>19!=1&&(b.s[h]&zT)>>19!=2?-1:(b.s[h]&RT)>>21)==p&&iS.QK(a.a,' '+(h+1))}iS.QK(a.a,fU)}if(f[p]!=0){iS.QK(a.a,hU+(p+1)+' ATOMS=('+f[p]);for(h=0;h<b.d;h++){((b.s[h]&3)==1||(b.s[h]&3)==2)&&(b.s[h]&zT)>>19==1&&((b.s[h]&zT)>>19!=1&&(b.s[h]&zT)>>19!=2?-1:(b.s[h]&RT)>>21)==p&&iS.QK(a.a,' '+(h+1))}iS.QK(a.a,fU)}if(v[p]!=0){iS.QK(a.a,gU+(p+1)+' BONDS=('+v[p]);for(l=0;l<b.e;l++){mS.li(b,l)!=2&&((b.C[l]&3)==1||(b.C[l]&3)==2)&&(b.C[l]&ST)>>10==2&&((b.C[l]&ST)>>10!=1&&(b.C[l]&ST)>>10!=2?-1:(b.C[l]&TT)>>12)==p&&iS.QK(a.a,' '+(l+1))}iS.QK(a.a,fU)}if(g[p]!=0){iS.QK(a.a,hU+(p+1)+' BONDS=('+g[p]);for(l=0;l<b.e;l++){mS.li(b,l)!=2&&((b.C[l]&3)==1||(b.C[l]&3)==2)&&(b.C[l]&ST)>>10==1&&((b.C[l]&ST)>>10!=1&&(b.C[l]&ST)>>10!=2?-1:(b.C[l]&TT)>>12)==p&&iS.QK(a.a,' '+(l+1))}iS.QK(a.a,fU)}}iS.QK(a.a,'M  V30 END COLLECTION\n')}iS.QK(a.a,'M  V30 END CTAB\n')};mS.Om=function Om(a){mS.Pm.call(this,a)};mS.Pm=function Pm(a){mS.Qm.call(this,a,new iS.UK)};mS.Qm=function Qm(a,b){var c,d,e,f,g,h,i,j,k,l,m;mS.Mm(this);mS.Po(a,7);this.a=b;m=a.M!=null?a.M:'';iS.QK(this.a,m+GS);iS.QK(this.a,'Actelion Java MolfileCreator 2.0\n\n');iS.QK(this.a,'  0  0  0  0  0  0              0 V3000\n');k=a.o==1;for(c=1;c<a.o;c++){if(a.H[c].a!=a.H[0].a||a.H[c].b!=a.H[0].b||a.H[c].c!=a.H[0].c){k=true;break}}this.b=1;if(k){f=mS.bi(a,a.o,a.p,(mS.dh(),mS.bh));if(f!=0){(f<1||f>3)&&(this.b=1.5/f)}else{l=iU;for(d=1;d<a.o;d++){for(e=0;e<d;e++){h=a.H[e].a-a.H[d].a;i=a.H[e].b-a.H[d].b;j=a.H[e].c-a.H[d].c;g=h*h+i*i+j*j;l>g&&(l=g)}}this.b=3/l}}mS.Nm(this,a,k);iS.QK(this.a,'M  END\n')};pH(71,1,{},mS.Om);_.b=1;hS.qE=$I(71);mS.Rm=function Rm(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p;k=a.g.K;l=0;for(f=0;f<c;f++){if(k>b[f]){k=b[f];l=f}}p=QC(hS.QD,$S,5,c,15,1);j=l>0?l-1:c-1;m=l<c-1?l+1:0;h=b[j]<b[m];for(g=0;g<c;g++){p[g]=b[l];h?--l<0&&(l=c-1):++l==c&&(l=0)}for(e=0;e<a.i.a.length;e++){o=CS.NN(a.i,e);if(o.length!=c)continue;d=true;for(i=0;i<c;i++){if(o[i]!==p[i]){d=false;break}}if(d)return}CS.IN(a.i,p);n=mS.$m(a,p);CS.IN(a.j,n);mS.gn(a,p,n)};mS.Sm=function Sm(a,b,c){var d,e,f,g,h,i,j;i=QC(hS.QD,$S,5,a.f,15,1);g=QC(hS.QD,$S,5,a.f,15,1);j=QC(hS.EG,cT,5,a.g.d,16,1);d=mS.di(a.g,0,b);e=mS.di(a.g,1,b);i[0]=d;i[1]=e;g[1]=-1;j[e]=true;h=1;while(h>=1){++g[h];if(g[h]==mS.Fk(a.g,i[h])){j[i[h]]=false;--h;continue}f=mS.Ek(a.g,i[h],g[h]);if(j[f]||c[f])continue;if(f==d&&h>1){mS.Rm(a,i,h+1);if(a.i.a.length>=256)return;continue}if(h+1<a.f){++h;i[h]=f;j[f]=true;g[h]=-1}}};mS.Tm=function Tm(a,b,c,d,e,f,g){var h,i,j,k,l,m,n,o,p,q,r,s,t,u,v;s=CS.NN(a.i,b);t=CS.NN(a.j,b);u=t.length;j=0;i=0;v=false;for(q=0;q<u;q++){j<<=1;i<<=1;if(mS.fn(a,t[q])){j|=1}else{h=c[b][q];if(h!=-1){if(d[h]){if(e[h]){j|=1;f[h]||(i|=1)}}else{v=true}}}}p=false;switch(u){case 3:k=YC(KC(hS.QD,1),$S,5,15,[2,1,4]);p=true;for(o=0;o<3;o++){if((j&k[o])==k[o]){if(mS._h(a.g,s[o])==6&&mS.Kh(a.g,s[o])==1||mS._h(a.g,s[o])==5&&mS.Kh(a.g,s[o])==0){e[b]=true;g[b]=o;(i&k[o])==0&&(p=false)}}}break;case 5:l=YC(KC(hS.QD,1),$S,5,15,[10,5,18,9,20]);p=true;for(r=0;r<5;r++){if((j&l[r])==l[r]){switch(mS._h(a.g,s[r])){case 6:if(mS.Kh(a.g,s[r])==-1){e[b]=true;g[b]=r;(i&l[r])==0&&(p=false)}break;case 7:if(mS.Kh(a.g,s[r])<=0){e[b]=true;g[b]=r}break;case 8:e[b]=true;g[b]=r;break;case 16:if(mS.Fk(a.g,s[r])==2){e[b]=true;g[b]=r}}}}break;case 6:p=true;if((j&21)==21){e[b]=true;(i&21)==0&&(p=false)}if((j&42)==42){e[b]=true;(i&42)==0&&(p=false)}break;case 7:m=YC(KC(hS.QD,1),$S,5,15,[42,21,74,37,82,41,84]);p=true;for(n=0;n<7;n++){if((j&m[n])==m[n]){if(mS._h(a.g,s[n])==6&&mS.Kh(a.g,s[n])==1||mS._h(a.g,s[n])==5&&mS.Kh(a.g,s[n])==0){e[b]=true;g[b]=n;(i&m[n])==0&&(p=false)}}}}e[b]&&!p&&(f[b]=true);if(e[b])return true;return !v};mS.Um=function Um(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p;e=QC(hS.QD,FT,6,a.i.a.length,0,2);for(i=0;i<a.i.a.length;i++){e[i]=QC(hS.QD,$S,5,CS.NN(a.i,i).length,15,1);for(j=0;j<CS.NN(a.i,i).length;j++)e[i][j]=-1}o=QC(hS.QD,$S,5,a.g.e,15,1);for(m=0;m<a.j.a.length;m++){n=CS.NN(a.j,m);if(n.length==3||n.length>=5&&n.length<=7){for(h=0;h<n.length;h++){g=n[h];if(mS.Fk(a.g,mS.di(a.g,0,g))==3&&mS.Fk(a.g,mS.di(a.g,1,g))==3){if(o[g]>0){e[o[g]>>>16][o[g]&32767]=m;e[m][h]=o[g]>>>16}else{o[g]=(m<<16)+32768+h}}}}}f=QC(hS.EG,cT,5,a.i.a.length,16,1);p=0;k=-1;while(p>k){k=p;for(l=0;l<a.i.a.length;l++){if(!f[l]){if(mS.Tm(a,l,e,f,b,c,d)){f[l]=true;++p}}}}};mS.Vm=function Vm(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o;e=mS.di(a.g,0,b);f=mS.di(a.g,1,b);i=QC(hS.QD,$S,5,a.g.d,15,1);j=QC(hS.QD,$S,5,a.g.d,15,1);k=QC(hS.QD,$S,5,a.g.d,15,1);i[0]=e;i[1]=f;j[e]=1;j[f]=2;k[e]=-1;k[f]=e;h=1;l=1;while(h<=l){for(m=0;m<mS.Fk(a.g,i[h]);m++){g=mS.Ek(a.g,i[h],m);if(h>1&&g==e){o=QC(hS.QD,$S,5,j[i[h]],15,1);d=i[h];for(n=0;n<o.length;n++){o[n]=d;d=k[d]}return o}if(j[g]==0&&!c[g]){i[++l]=g;j[g]=j[i[h]]+1;k[g]=i[h]}}++h}return null};mS.Wm=function Wm(a,b){return a.a[b]};mS.Xm=function Xm(a,b){return a.b[b]};mS.Ym=function Ym(a,b){return CS.NN(a.i,b)};mS.Zm=function Zm(a,b){return CS.NN(a.j,b)};mS.$m=function $m(a,b){var c,d,e,f,g;f=b.length;g=QC(hS.QD,$S,5,f,15,1);for(d=0;d<f;d++){c=d==f-1?b[0]:b[d+1];for(e=0;e<mS.Fk(a.g,b[d]);e++){if(mS.Ek(a.g,b[d],e)==c){g[d]=mS.Gk(a.g,b[d],e);break}}}return g};mS._m=function _m(a,b,c){var d;for(d=0;d<a.j.a.length;d++)if(mS.cn(a,d,b)&&mS.cn(a,d,c))return d;return -1};mS.an=function an(a,b){return a.d[b]};mS.bn=function bn(a,b,c){var d,e;e=CS.NN(a.i,b);for(d=0;d<e.length;d++)if(c==e[d])return true;return false};mS.cn=function cn(a,b,c){var d,e;e=CS.NN(a.j,b);for(d=0;d<e.length;d++)if(c==e[d])return true;return false};
mS.dn=function dn(a,b){return a.e[b]};mS.en=function en(a,b){var c,d,e,f,g,h;for(g=0;g<2;g++){c=mS.di(a.g,g,b);if(mS._h(a.g,c)==7&&mS.Fk(a.g,c)==2){d=mS.di(a.g,1-g,b);for(h=0;h<mS.Fk(a.g,d);h++){e=mS.Ek(a.g,d,h);f=mS.Gk(a.g,d,h);if((mS._h(a.g,e)==8||mS._h(a.g,e)==16)&&mS.li(a.g,f)==2&&mS.Fk(a.g,e)==1)return true}}}return false};mS.fn=function fn(a,b){return mS.li(a.g,b)>1||mS.oi(a.g,b)==64};mS.gn=function gn(a,b,c){var d,e,f;f=b.length;for(e=0;e<f;e++)(a.a[b[e]]==0||a.a[b[e]]>f)&&(a.a[b[e]]=f);for(d=0;d<f;d++)(a.b[c[d]]==0||a.b[c[d]]>f)&&(a.b[c[d]]=f)};mS.hn=function hn(a,b,c){var d;d=CS.NN(a.j,b).length;while(c>=d)c-=d;while(c<0)c+=d;return c};mS.jn=function jn(a,b){mS.kn.call(this,a,b)};mS.kn=function kn(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s;this.g=a;this.f=7;this.i=new CS._N;this.j=new CS._N;this.a=QC(hS.QD,$S,5,this.g.d,15,1);this.b=QC(hS.QD,$S,5,this.g.e,15,1);this.g.gb(1);m=QC(hS.EG,cT,5,this.g.d,16,1);n=QC(hS.EG,cT,5,this.g.e,16,1);do{g=false;for(c=0;c<this.g.d;c++){if(!m[c]){q=0;for(l=0;l<mS.Fk(this.g,c);l++)m[mS.Ek(this.g,c,l)]||++q;if(q<2){m[c]=true;for(k=0;k<mS.Fk(this.g,c);k++)n[mS.Gk(this.g,c,k)]=true;g=true}}}}while(g);s=0;while(s<this.g.d&&m[s])++s;if(s==this.g.d)return;i=QC(hS.QD,$S,5,this.g.d,15,1);i[0]=s;p=QC(hS.QD,$S,5,this.g.d,15,1);p[0]=-1;h=QC(hS.QD,$S,5,this.g.d,15,1);h[s]=1;f=0;j=0;o=1;while(f<=j){for(k=0;k<mS.Fk(this.g,i[f]);k++){e=mS.Ek(this.g,i[f],k);if(e==p[i[f]])continue;if(h[e]!=0){mS.Sm(this,mS.Gk(this.g,i[f],k),m);continue}if(!m[e]){h[e]=o;p[e]=i[f];i[++j]=e}}++f;if(f>j){for(c=0;c<this.g.d;c++){if(h[c]==0&&!m[c]){h[c]=++o;i[++j]=c;p[c]=-1;break}}}}if((b&4)!=0){this.d=QC(hS.EG,cT,5,this.i.a.length,16,1);this.e=QC(hS.EG,cT,5,this.i.a.length,16,1);this.c=QC(hS.QD,$S,5,this.i.a.length,15,1);mS.Um(this,this.d,this.e,this.c)}if((b&2)!=0){for(d=0;d<this.g.e;d++){if(!n[d]&&mS.li(this.g,d)!=0){r=mS.Vm(this,d,m);r!=null&&mS.gn(this,r,mS.$m(this,r))}}}};pH(61,1,{},mS.jn);_.f=0;hS.rE=$I(61);mS.ln=function ln(a){var b;b=mS.Ln(a.w,a.w.length);if(a.j!=0){CS.QO(b);if(!CS.wQ(a.H,b)){CS.uQ(a.H,b);CS.IN(a.v,mS.Ln(a.w,a.w.length))}return}return};mS.mn=function mn(a,b,c){var d,e,f,g,h,i,j,k,l,m;i=mS.Fk(a.A,b);e=a.i[c];if(e>i)return false;k=mS.Wh(a.A,b);g=mS.Wh(a.d,c);f=mS.Rh(a.d,c);j=mS.Rh(a.A,b);if((g&1)!=0){if(f!=null){if((k&1)!=0){if(j==null)return false;if(!mS.An(f,j))return false}else{if(j!=null){if(mS.Cn(j,f))return false}else{if(mS.zn(mS._h(a.A,b),f))return false}}}}else{if((k&1)!=0)return false;if(f!=null){if(j!=null){if(!mS.An(j,f))return false}else{if(!mS.zn(mS._h(a.A,b),f))return false}}else{if(j!=null)return false;if(a.C[b]!==a.f[c])return false}}if((k|g)!=0){if((g&kT)!=0){if(a.A.I&&(k&kT)==0)return false;else if(e!=i)return false}if((g&jT)!=0){if(e>=i&&(k&jT)==0)return false}}if((a.B[b]&~a.e[c])!=0)return false;if(mS.Kh(a.d,c)!=0&&mS.Kh(a.d,c)!=mS.Kh(a.A,b))return false;if(mS.Uh(a.d,c)!=0&&mS.Uh(a.d,c)!=mS.Uh(a.A,b))return false;m=(mS.Wh(a.d,c)&vT)>>22;if(m!=0){if(a.A.I&&m==(mS.Wh(a.A,c)&vT)>>22)return true;d=false;l=mS._k(a.A);for(h=0;h<l.i.a.length;h++){if(CS.NN(l.j,h).length==m){if(mS.bn(l,h,b)){d=true;break}}}if(!d)return false}return true};mS.nn=function nn(a,b,c){var d,e,f,g;if((a.D[b]&~a.g[c])!=0)return false;g=(mS.ni(a.d,c)&AT)>>15;if(g!=0){if(a.A.I&&g==(mS.ni(a.A,c)&AT)>>15)return true;d=false;f=mS._k(a.A);for(e=0;e<f.i.a.length;e++){if(CS.NN(f.j,e).length==g){if(mS.cn(f,e,b)){d=true;break}}}if(!d)return false}return true};mS.on=function on(a){var b,c;a.a=null;for(b=0;b<a.d.e;b++){if(mS.Fi(a.d,b)){!a.a&&(a.a=new CS._N);c=new mS.Mn;c.a=mS.di(a.d,0,b);c.b=mS.di(a.d,1,b);c.d=mS.fi(a.d,b);c.c=mS.ei(a.d,b);CS.IN(a.a,c)}}};mS.pn=function pn(a){var b,c,d,e,f,g,h,i,j;mS.Po(a.d,a.G);h=a.d.e+12;a.o=QC(hS.QD,$S,5,h,15,1);a.q=QC(hS.QD,$S,5,h,15,1);a.r=QC(hS.QD,$S,5,h,15,1);a.p=QC(hS.EG,cT,5,h+1,16,1);f=QC(hS.EG,cT,5,a.d.d,16,1);g=QC(hS.EG,cT,5,a.d.e,16,1);e=0;for(c=0;c<a.d.d;c++){if(!a.u[c]&&!f[c]){a.o[e]=c;a.r[e]=-1;a.q[e]=-1;i=e;while(e<=i){for(j=0;j<mS.sk(a.d,a.o[e]);j++){d=mS.Ek(a.d,a.o[e],j);d<a.d.d&&!a.u[d]&&(i=mS.Jn(a,e,i,j,f,g))}while(a.p[++e]);}}}a.s=e;if(a.j!=0){i=e-1;e=0;while(e<=i){for(j=0;j<mS.sk(a.d,a.o[e]);j++){d=mS.Ek(a.d,a.o[e],j);d<a.d.d&&(a.u[d]||a.u[a.o[e]])&&(i=mS.Jn(a,e,i,j,f,g))}while(a.p[++e]);}for(b=0;b<a.d.d;b++){if(a.u[b]&&!f[b]){a.o[e]=b;a.r[e]=-1;a.q[e]=-1;i=e;while(e<=i){for(j=0;j<mS.sk(a.d,a.o[e]);j++)mS.Ek(a.d,a.o[e],j)<a.d.d&&(i=mS.Jn(a,e,i,j,f,g));while(a.p[++e]);}}}}a.t=e};mS.qn=function qn(a,b,c){var d,e,f;if(a.a){for(e=new CS.vO(a.a);e.a<e.c.a.length;){d=CS.uO(e);if((a.u[d.a]||a.u[d.b])==c){f=mS.$k(a.A,a.w[d.a],a.w[d.b],d.c+1,b)-1;if(f<d.d||f>d.c)return false}}}return true};mS.rn=function rn(a,b){var c,d,e,f,g,h,i,j;for(e=0;e<a.d.e;e++){if((mS.ni(a.d,e)&ET)!=0){f=mS.mi(a.d,e);if(f==0)continue;c=mS.di(a.d,0,e);d=mS.di(a.d,1,e);if((a.u[c]||a.u[d])==b){g=a.w[c];h=a.w[d];i=mS.Ck(a.A,g,h);j=mS.mi(a.A,i);if(j==0)continue;if(f==3)continue;if(j==3)continue;if(mS.xn(a,e,i)==(f==j))return false}}}return true};mS.sn=function sn(a,b,c){var d,e,f,g,h;for(g=a.s;g<a.t;g++)c[g]=-1;f=a.s;while(true){h=a.q[f]==-1?a.A.d:mS.sk(a.A,a.w[a.q[f]]);++c[f];if(c[f]==h){c[f]=-1;if(f==a.s)break;--f;if(!a.p[f]){b[a.w[a.o[f]]]=false;a.w[a.o[f]]=-1}continue}if(a.q[f]==-1){if(!b[c[f]]){if(mS.mn(a,c[f],a.o[f])){a.w[a.o[f]]=c[f];b[c[f]]=true;++f}}}else{if(mS.Ek(a.A,a.w[a.q[f]],c[f])>=a.A.d){++c[f];continue}e=mS.Ek(a.A,a.w[a.q[f]],c[f]);if(a.p[f]){e==a.w[a.o[f]]&&mS.nn(a,mS.Gk(a.A,a.w[a.q[f]],c[f]),a.r[f])&&++f}else{if(!b[e]){if(mS.mn(a,e,a.o[f])&&mS.nn(a,mS.Gk(a.A,a.w[a.q[f]],c[f]),a.r[f])){b[e]=true;a.w[a.o[f]]=e;++f}}}}if(f==a.t){if(mS.tn(a,true)&&mS.rn(a,true)&&mS.qn(a,b,true)){for(d=0;d<a.d.d;d++){if(a.u[d]){b[a.w[d]]=false;a.w[d]=-1}}return true}--f;if(!a.p[f]){b[a.w[a.o[f]]]=false;a.w[a.o[f]]=-1}}}return false};mS.tn=function tn(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p;g=0;for(i=0;i<a.d.d;i++){if(a.u[i]==b&&(mS.Wh(a.d,i)&LT)!=0){m=a.w[i];l=mS.Vh(a.d,i);o=mS.Vh(a.A,m);if(l==0)continue;if(o==0)continue;if(l==3)continue;if(o==3)continue;if(mS.Ph(a.d,i)==1){++g;continue}if(mS.Ph(a.A,m)==1)return false;if(mS.Ph(a.d,i)==2){++g;continue}if(mS.Ph(a.A,m)==2)return false;if(mS.Bn(a,i)==(l==o))return false}}if(g!=0){e=QC(hS.QD,$S,5,g,15,1);f=0;for(j=0;j<a.d.d;j++){if(a.u[j]==b&&(mS.Wh(a.d,j)&LT)!=0){l=mS.Vh(a.d,j);l!=0&&l!=3&&(e[f++]=mS.Oh(a.d,j)<<24|mS.Ph(a.d,j)<<22|j)}}CS.QO(e);f=0;while(f<e.length){k=e[f]&jU;n=a.w[k];c=e[f]&-4194304;d=mS.Bn(a,k)^mS.Vh(a.d,k)==mS.Vh(a.A,n);for(++f;f<e.length&&(e[f]&-4194304)==c;f++){h=e[f]&jU;m=a.w[h];if(mS.Ph(a.A,m)!=mS.Ph(a.A,n)||mS.Oh(a.A,m)!=mS.Oh(a.A,n))return false;p=mS.Bn(a,h)^mS.Vh(a.d,h)==mS.Vh(a.A,m);if(p!=d)return false}}}return true};mS.un=function un(a,b){var c,d,e,f,g,h,i,j,k,l;a.v=new CS._N;CS.vP(a.H.a);CS.vP(a.c.a);if(!a.A||!a.d)return 0;if(a.d.d-a.j>a.A.d||a.d.e-a.k>a.A.e)return 0;if(a.d.d-a.j==0)return 0;mS.Fn(a,b);c=QC(hS.EG,cT,5,a.A.d,16,1);a.w=QC(hS.QD,$S,5,a.d.d,15,1);CS.EO(a.w);g=QC(hS.QD,$S,5,a.t,15,1);CS.HO(g,g.length,-1);e=0;while(true){j=a.q[e]==-1?a.A.d:mS.sk(a.A,a.w[a.q[e]]);++g[e];if(g[e]==j){g[e]=-1;if(e==0)break;--e;a.p[e]||(c[a.w[a.o[e]]]=false);continue}if(a.q[e]==-1){if(!c[g[e]]){if(mS.mn(a,g[e],a.o[e])){a.w[a.o[e]]=g[e];c[g[e]]=true;++e}}}else{if(mS.Ek(a.A,a.w[a.q[e]],g[e])>=a.A.d)continue;d=mS.Ek(a.A,a.w[a.q[e]],g[e]);if(a.p[e]){d==a.w[a.o[e]]&&mS.nn(a,mS.Gk(a.A,a.w[a.q[e]],g[e]),a.r[e])&&++e}else{if(!c[d]){if(mS.mn(a,d,a.o[e])&&mS.nn(a,mS.Gk(a.A,a.w[a.q[e]],g[e]),a.r[e])){c[d]=true;a.w[a.o[e]]=d;++e}}}}if(e==a.s){if(mS.tn(a,false)&&mS.rn(a,false)&&mS.qn(a,c,false)){if(a.j==0)return 1;h=false;if(a.j!=0){k=mS.Ln(a.w,a.w.length);CS.QO(k);if(CS.wQ(a.c,k)){h=true}else if(mS.sn(a,c,g)){CS.uQ(a.c,k);l=QC(hS.QD,$S,5,k.length,15,1);for(f=a.v.a.length-1;f>=0;f--){i=CS.NN(a.v,f);iS.ZK(i,l,l.length);CS.QO(l);rS.kA(l,k)==0&&CS.TN(a.v,f)}h=true}}h||mS.ln(a)}--e;a.p[e]||(c[a.w[a.o[e]]]=false)}}return a.v.a.length};mS.vn=function vn(a,b){var c,d,e,f,g,h,i,j;i=0;if(a.I){(a.s[b]&jT)!=0&&(i|=2);j=(d=a.s[b]&ST,d==0?0:d==mT?2:d==kT?3:4);if(j!=0){i|=8;j>2&&(i|=16);j>3&&(i|=32)}c=a.q[b];c<0?(i|=pT):c>0&&(i|=oT);f=a.g[b];switch(f){case 0:break;case 1:i|=KT;break;case 2:i|=uT;break;case 3:i|=917504;break;default:i|=1966080;}}else{(a.s[b]&jT)!=0?(i|=2):(i|=4);j=(d=a.s[b]&ST,d==0?0:d==mT?2:d==kT?3:4);j==0?(i|=112):j==2?(i|=104):j==3?(i|=88):(i|=56);c=a.q[b];c==0?(i|=167772160):c<0?(i|=pT):c>0&&(i|=oT);e=a.c[b]-a.g[b]+mS.Rk(a,b);switch(e){case 0:i|=1792;break;case 1:i|=1664;break;case 2:i|=1408;break;default:i|=896;}f=a.g[b];switch(f){case 0:i|=3932160;break;case 1:i|=3801088;break;case 2:i|=3538944;break;case 3:i|=3014656;break;default:i|=1966080;}h=a.k[b];switch(h){case 0:i|=98304;break;case 1:i|=81920;break;default:i|=49152;}}g=a.k[b];g>0&&(i|=rT);g>1&&(i|=32768);return i};mS.wn=function wn(a,b){var c;c=0;if((a.C[b]&512)!=0||a.F[b]==64)c|=8;else switch(mS.li(a,b)){case 0:c|=32;break;case 1:c|=1;break;case 2:c|=2;break;case 3:c|=4;}(a.C[b]&64)!=0?(c|=64):a.I||(c|=32);(a.C[b]&256)!=0?(c|=QS):a.I||(c|=RS);return c};mS.xn=function xn(a,b,c){var d,e,f,g,h,i,j,k,l,m;h=false;for(g=0;g<2;g++){d=mS.di(a.d,g,b);k=a.w[d];if(mS.Fk(a.d,d)==2){if(mS.Fk(a.A,k)==2)continue;e=-1;for(j=0;j<2;j++)mS.Gk(a.d,d,j)!=b&&(e=mS.Ek(a.d,d,j));m=0;l=QC(hS.QD,$S,5,2,15,1);for(i=0;i<3;i++)mS.Gk(a.A,k,i)!=c&&(l[m++]=mS.Ek(a.A,k,i));a.w[e]!==l[0]&&(h=!h)}else if(mS.Fk(a.d,d)==3&&mS.Fk(a.A,k)==3){e=QC(hS.QD,$S,5,2,15,1);f=0;for(i=0;i<3;i++)mS.Gk(a.d,d,i)!=b&&(e[f++]=mS.Ek(a.d,d,i));a.w[e[0]]>a.w[e[1]]^e[0]>e[1]&&(h=!h)}}return h};mS.yn=function yn(a){return mS.un(a,a.b)>0};mS.zn=function zn(a,b){var c;for(c=0;c<b.length;c++)if(b[c]==a)return true;return false};mS.An=function An(a,b){var c,d,e;e=0;for(d=0;d<a.length;d++){c=a[d];while(b[e]<c){++e;if(e==b.length)return false}if(b[e]>c)return false}return true};mS.Bn=function Bn(a,b){var c,d,e,f,g,h,i,j;g=false;if(mS.vk(a.d,b)==0){for(f=1;f<mS.Fk(a.d,b);f++){for(h=0;h<f;h++){d=mS.Ek(a.d,b,f);e=mS.Ek(a.d,b,h);a.w[d]>a.w[e]^d>e&&(g=!g)}}}else{for(f=0;f<mS.Fk(a.d,b);f++){c=mS.Ek(a.d,b,f);j=0;i=QC(hS.QD,$S,5,3,15,1);for(h=0;h<mS.Fk(a.d,c);h++){i[j]=mS.Ek(a.d,c,h);i[j]!=b&&++j}j==2&&a.w[i[0]]>a.w[i[1]]^i[0]>i[1]&&(g=!g)}}return g};mS.Cn=function Cn(a,b){var c,d,e,f;e=0;f=0;while(e<a.length&&f<b.length){c=a[e];d=b[f];if(c==d)return true;c<d?++e:++f}return false};mS.Dn=function Dn(a,b){var c,d,e,f;if(b.o==0||!b.I){a.d=null;return}a.d=b;a.n=false;mS.Po(a.d,1);a.G=3;for(d=0;d<a.d.d;d++)(mS.Wh(a.d,d)&LT)!=0&&(a.G=7);for(f=0;f<a.d.e;f++)(mS.ni(a.d,f)&ET)!=0&&(a.G=7);a.F&&a.G!=3&&mS.Po(a.A,a.G);a.j=0;a.u=QC(hS.EG,cT,5,a.d.d,16,1);for(c=0;c<a.d.d;c++){a.u[c]=(mS.Wh(a.d,c)&dT)!=0;a.u[c]&&++a.j}a.k=0;if(a.j!=0)for(e=0;e<a.d.e;e++)(a.u[mS.di(a.d,0,e)]||a.u[mS.di(a.d,1,e)])&&++a.k};mS.En=function En(a,b){if(b.o==0){a.A=null;return}a.A=b;a.F=false;mS.Po(a.A,1)};mS.Fn=function Fn(a,b){if(!a.F){mS.In(a,b);a.F=true}if(!a.n){mS.Gn(a,b);mS.pn(a);mS.on(a);a.n=true}};mS.Gn=function Gn(a,b){var c,d,e,f,g,h,i,j,k,l;f=null;i=null;g=null;mS.Po(a.d,a.G);a.i=QC(hS.QD,$S,5,a.d.d,15,1);for(d=0;d<a.d.d;d++)a.i[d]=mS.Fk(a.d,d);if(a.j!=0){j=new mS.dp(a.d.o,a.d.p);l=QC(hS.EG,cT,5,a.d.o,16,1);for(e=0;e<a.d.o;e++)l[e]=!a.u[e];mS.jk(a.d,j,l,true,null);mS.Po(j,a.G);mS.Hn(a,j,b);f=a.e;i=a.g;g=a.f;k=0;for(c=0;c<a.d.d;c++)a.u[c]||(a.i[c]=mS.Fk(j,k++))}mS.Hn(a,a.d,b);if(a.j!=0){k=0;for(c=0;c<a.d.o;c++){if(!a.u[c]){a.e[c]=f[k];a.f[c]=g[k++]}}k=0;for(h=0;h<a.d.p;h++){!a.u[mS.di(a.d,0,h)]&&!a.u[mS.di(a.d,1,h)]&&(a.g[h]=i[k++])}}};mS.Hn=function Hn(a,b,c){var d,e,f,g;f=b.d;a.e=QC(hS.QD,$S,5,b.d,15,1);a.f=QC(hS.QD,$S,5,b.d,15,1);for(d=0;d<f;d++){a.e[d]=(mS.vn(b,d)|b.w[d])&kU^kU;a.f[d]=b.A[d];(c&1)!=0&&(a.f[d]+=b.q[d]+16<<8);(c&2)!=0&&(a.f[d]+=b.v[d]<<16)}g=b.e;a.g=QC(hS.QD,$S,5,b.e,15,1);for(e=0;e<g;e++){a.g[e]=(mS.wn(b,e)|b.D[e])&1572991^1572960;(c&4)!=0?(a.g[e]&2)!=0&&(a.g[e]|=8):(c&8)!=0&&(a.g[e]&2)!=0&&(b.C[e]&256)!=0&&(a.g[e]|=8)}};mS.In=function In(a,b){var c,d,e,f;mS.Po(a.A,a.G);e=a.A.d;a.C=QC(hS.QD,$S,5,e,15,1);a.B=QC(hS.QD,$S,5,e,15,1);for(c=0;c<e;c++){a.B[c]=(mS.vn(a.A,c)|mS.Wh(a.A,c))&kU^kU;a.C[c]=mS._h(a.A,c);(b&1)!=0&&(a.C[c]+=mS.Kh(a.A,c)+16<<8);(b&2)!=0&&(a.C[c]+=mS.Uh(a.A,c)<<16)}f=a.A.e;a.D=QC(hS.QD,$S,5,f,15,1);for(d=0;d<f;d++)a.D[d]=(mS.wn(a.A,d)|mS.ni(a.A,d))&1605631^1572960};mS.Jn=function Jn(a,b,c,d,e,f){var g,h;g=mS.Ek(a.d,a.o[b],d);if(g!=a.q[b]){h=mS.Gk(a.d,a.o[b],d);if(!f[h]&&!mS.Fi(a.d,h)){a.o[++c]=g;a.q[c]=a.o[b];a.r[c]=h;f[h]=true;e[g]?(a.p[c]=true):(e[g]=true)}}return c};mS.Kn=function Kn(){this.b=8;this.v=new CS._N;this.H=new CS.xQ(new rS.lA);this.c=new CS.xQ(new rS.lA)};mS.Ln=function Ln(a,b){var c;c=QC(hS.QD,$S,5,b,15,1);iS.ZK(a,c,iS.dK(a.length,b));return c};pH(88,1,{},mS.Kn);_.b=0;_.j=0;_.k=0;_.n=false;_.s=0;_.t=0;_.F=false;_.G=0;hS.uE=$I(88);mS.Mn=function Mn(){};pH(91,1,{91:1},mS.Mn);_.a=0;_.b=0;_.c=0;_.d=0;hS.sE=$I(91);mS.Pn=function Pn(){mS.Pn=rH;mS.Nn=YC(KC(hS.OF,1),NT,2,6,['QM@HzAmdqjF@','RF@Q``','qC`@ISTAlQE`','`J@H','QM@HzAmdqbF@','qC`@ISTAlQEhqPp@','sJP@DiZhAmQEb','RF@QPvR@','QM@HzA@','qC`@ISTAlQEhpPp@','qC`@Qz`MbHl','sJP@DiZhAmQEcFZF@','RFPDXH','qC`@IVtAlQE`','QM@HvAmdqfF@','sGP@DiVj`FsDVM@','`L@H','sJP@DizhAmQEcFBF@','sJP@DjvhAmQEb','sFp@DiTt@@AlqEcP','sGP@LdbMU@MfHlZ','QMHAIhD','QM@HzAy@','sJP@DkVhAmQEb','sNp@DiUjj@[\\QXu`','sJP@DiZhAmQEcFBF@','sGP@DjVj`FsDVM@','RFPDTH','RG@DXOH@','sGP@Divj`FsDVMcAC@','sGP@Dj}j`FsDVM@','qC`@Qz`MbHmFRF@','sNp@LdbJjj@[\\QXu`','QMHAIhGe@','QM@HzAyd`','QM`AIhD','qC`@ISTA@','sGP@DkUj`FsDVM@','qC`@IVtAlQEhqPp@','sNp@DiUjj@[\\QXuqea`@','KAx@@IRjuUPAlHPfES\\','QM`BN`P','sJP@DjZhAmQEcFJF@','Hid@@DjU^nBBH@FtaBXUMp`','sNp@Diujj@[\\QXuq`a`@','sJP@DjvhAmQEcFZF@','sJP@DjZhAmQEcFFF@','sOp@DjWkB@@FwDVM\\YhX@','sNp@Dj}Zj@[\\QXu`','sNp@DiWjj@[\\QXuq`a`@','sOp@DjWkB@@D','KAx@@ITouUPAlHPfES\\','KAx@@YIDTjjh@vDHSBin@','sNp@DkUZj@[\\QXu`','RFPDXOH@','QM`BN`^L`','qC`@ISTAy@','sGP@LdbMU@MfHl[FVF@','qCb@AIZ`H','KAx@@IRjuUPAlHPfES]FFa`@','KAx@@ITnuUPAlHPfES\\','HiD@@DiUVjj`AmHPfES\\H','sNp@DjUjj@[\\QXu`','sJP@DkVhAmQEcFJF@','sGP@DjVj`FsDVMcCC@','qC`@Qz`MbHmFBF@','sJP@DkfhAmQEb','qC`@IVtAlQEhsPp@','sGP@Djuj`FsDVM@','sGP@Dj}j`FsDVMcMC@','sJP@DiZhA@','KAx@@ISjuUPAlHPfES]F@a`@','sJP@DjZhAmQEcFRF@','KAx@@IRnuUPAlHPfES]F@a`@','HiD@@DjWvjj`AmHPfES\\H','QMHAIhGd@','sNp@DiUjj@[\\QXuq`a`@','KAx@@IVjmUPAlHPfES\\','sGP@DjVj`FsDVMcMC@','QM`AIhGe@','HiD@@LdbJRjjh@[RDIaTwB','qCp@AIZ`H','sGP@LdbMU@MfHl[FFF@','QMDARVA@','sNp@LdbJjj@[\\QXuqba`@','sNp@LdbJjj@[\\QXuqca`@','sGP@Dkej`FsDVM@','qCb@AIZ`OI@','HaD@@DjUZxHH@AlHPfES]FLa`@','sGP@DkYj`FsDVM@','qCb@AIV`H','sNp@LdbJjj@[\\QXuqea`@','sGP@DkUj`FsDVMcEC@','sFp@DiTt@@Axa@','Hmt@@DjU_ZxHHj@AmhPfES\\Lj','QM`BN`^P','qCb@AIZ`OH`','sFp@DiTt@@AxaP','sGP@Djuj`FsDVMcEC@','sGP@Djuj`FsDVMcIC@','sGP@DkUj`FsDVMcKC@','sJP@DkfhAmQEcFRF@','sGP@DjVj`FsDVMcIC@','HaD@@DjUZxHH@AlHPfES]FFa`@','qC`@IRtDVqDV@','sNp@Dj}Zj@[\\QXuqfa`@','KAx@@ITnuUPAlHPfES]FFa`@','HiD@@DkUUjj`AmHPfES\\H','sJQ@@dkU@H','qC`@Qz`H','KAx@@IUkmUPAlHPfES\\','KAx@@ITouUPAlHPfES]FJa`@','sJP@H~j@[TQX`','sGP@DjZj`FsDVM@','sJP@DkVhAmQEcFFF@','sJX@@eKU@H','sJP@DizhAy@','QMHAIhGbP','KAx@@ITouUPAlHPfES]FNa`@','HaD@@DjUZxHD@AlHPfES\\','HaD@@DjUZxHH@A@','sNp@LdbJjj@[\\QXuqaa`@','Hed@@LdbRQUUUP@vTHSBinFP','KAx@@ITouUPAlHPfES]FLa`@','sNp@DkUZj@[\\QXuqba`@','KAx@@ITjuUPAlHPfES]FNa`@','KAx@@YIDTjjh@vDHSBincGPp@','HaD@@DjYvxH`@AlHPfES]FLa`@','RF@QP`','qCb@AIj`H','sNp@DjUjj@[\\QXuqaa`@','sNp@DkVZj@[\\QXu`','KAx@@YIDUJjh@vDHSBin@','sGP@DkYj`FsDVMcIC@','sGP@DjVj`FsDVMcAC@','sGP@DiVj`D','sJP@DkVhAmQEcFZF@','sNp@LdbLjj@[\\QXu`','QM@HvAmdqbF@','HaD@@DjWjXHB@AlHPfES\\','sNp@DjwZj@[\\QXuqba`@','sNp@LdbJjj@[\\QXuqda`@','sFp@DiTt@@Axa`','HiD@@Djuujj`AmHPfES\\H','sNp@DkUZj@[\\QXuqca`@','sJP@DiZhAy@','KAx@@YIDTjjh@vDHSBincCPp@','KAx@@IWNmUPAlHPfES\\','KAx@@IVkMUPAlHPfES\\','sJQ@@dju@H','qCb@AIZ`OH@','qC`@ISTAxa@','sNp@DjyZj@[\\QXu`','Hid@@DjUfaBB`@FtaBXUMp`','HiD@@DiUVjj`AmHPfES\\LXBF@','KAx@@IUjmUPAlHPfES\\','HiD@@DjWvjj`AmHPfES\\LXjF@','sJP@DjVhAmQEb','qCb@AIV`OH`','HiD@@LdbJRjjh@[RDIaTwCFDa`@','KAx@@YIDTjjh@vDHSBinc@Pp@','sNp@DjUjj@[\\QXuqda`@','qC`@Qz`OED','sJP@DkfhAmQEcFZF@','KAx@@YIDbjjh@vDHSBincDPp@','sGP@Djyj`FsDVMcMC@','KAx@@IVrmUPAlHPfES\\','qCp@AIZ`OI@','sJX@@dkU@H','sJQ@@dkU@OH`','sNp@Di]ZjBBvxbqk@','Hkl@@DjU_Uk``bj`@[VDIaTwCJzX','sGP@DjZj`FsDVMcEC@','Hid@@DjU^nBBH@FtaBXUMpqcHX@','sNp@DkeZj@[\\QXu`','sNp@DjYjj@[\\QXuqca`@','sGQ@@djuT@`','HiD@@LdbJTjjh@[RDIaTwB','sOp@DjWkB@@Gd`','HeT@@LdbbRKBDQD@CYPaLJfxY@','qCr@XIKTA@','HiD@@DjW^jj`AmHPfES\\LXJF@','HeT@@DjU]k``b`@[JDIaTwCH','sGP@Djuj`FsDVMcCC@','`IH`B','sOp@DjWkB@@GdX','sJQ@@eKU@H','KAx@@YIDUJjh@vDHSBincBPp@','sJX@@eKU@OH@','KAx@@YIDTjjh@vDHSBincAPp@','sOq@@drm\\@@@`','KAx@@IUkMUPAlHPfES\\','qCp@AIj`H','Hed@@DjUUjjj@FraBXUMpr','sGX@@eJuT@`','sGP@DkUj`FsDVMcCC@','HiD@@Dj}Ujj`AmHPfES\\LXrF@','KAx@@ITouUPAlHPfES]FHa`@','Hed@@DjWujjj@FraBXUMpsFIa`@','sGP@DiUj``mfHlZ','sFp@DiTvjhAlqEcP','Hid@@DjU^nBBH@FtaBXUMpq`XX@','sJP@DkVdAmQEb','qCp@AIZ`OH`','QMhDRVA@','qC`@ISJAlQE`','qCp@BOTAyhl','sJX@@eOU@ODB','sFp@DiTt@@AyaB','sGP@DkUj`FsDVMcMC@','Hid@@DjYUaBH`@FtaBXUMpqcHX@','qC`@Qz`OH@','HiD@@DjUVjj`AmHPfES\\LXZF@','sJP@H~j@[TQXqda`@','sJX@@eKU@OI@','sNp@Djejj@[\\QXu`','sJQ@@dsU@H','sJQ@@dkU@OI`','KAx@@YIMDVjh@vDHSBin@','Hid@@DjU^nBBD@FtaBXUMp`','sNp@DkgZj@[\\QXuqca`@','qC`@IRtDVqDVcEC@','Hed@@LdbRQeUUP@vTHSBinFP','sNp@DiUjj@P','qC`@IRtDT','sNp@DkYZj@[\\QXuqca`@','KAx@@IUkmUPAlHPfES]FDa`@','KAx@@IVjmUPAlHPfES]FNa`@','sOx@@drm\\@@@`','KAx@@ITjuUPAlHPfES]FBa`@','QMDARVAyH','sJP`@dfvhA@','HeT@@DjU_k``b`@[JDIaTwCLXfF@','KAx@@IToUUPAlHPfES]FJa`@','sGP@DkYj`FsDVMcEC@','qCb@AIZ`ODH','`I@`B','KAx@@IUzmUPAlHPfES]FFa`@','sNp@DkfZj@[\\QXu`','KAx@@ITnuUPAlHPfES]F@a`@','HiD@@LddURjjh@[RDIaTwB','sNp@Dj~Zj@[\\QXuqfa`@','Hed@@Dj{uZjj@FraBXUMpr','KAx@@ITsUUPAlHPfES\\','Hid@@LdbRQk``b@AmHPfES\\LXrF@','sOp@DjWkB@@GdH','sJQ@@dkU@OH@','Hid@@DjU^nBBH@FtaBXUMpqahX@','sGP@DiYj``mfHlZ','KAx@@IToUUPAlHPfES]FLa`@','qCp@AJZ`ODH','Hmt@@DjU]ZxHHj@AmhPfES\\Lj','sGP@DkUjPFsDVM@','qC`@IVtA@','Hed@@LdbJReUUP@vTHSBinFP','sNp@DjuZj@[\\QXuqea`@','KAx@@IUkmUPAlHPfES]FNa`@','HiD@@DkVUjj`AmHPfES\\H','Hed@@DkUeZjj@FraBXUMpr','sNp@DkVZj@[\\QXuqea`@','sJP@DiVhHKZbKFLLL@','HiD@@Djuyjj`AmHPfES\\H','sNp@DjUjj@[\\QXuq`a`@','HeT@@DjYUXPbH`@[JDIaTwCH','HiD@@DjwUjj`AmHPfES\\LXRF@','sNq@@djmUPB','KAx@@YIEEZjh@vDHSBincCPp@','sGP@Di^V`dmfHlZ','Hid@@DjYUaBHP@FtaBXUMp`','sNp@DjYjj@[\\QXuqba`@','sGP@Dkej`FsDVMcKC@','HeT@@DjU^k``b`@[JDIaTwCH','qC`@Qv`MbHmFBF@','sGQ@@djmT@`','qCr@XIKTAyH','qC`@IVtAlQEhpPp@','Hid@@LdbbQxXF@@AmHPfES\\LXjF@','sGP@DkYj`FsDVMcCC@','KAx@@IVsMUPAlHPfES\\','qCp@AIj`ODl','HiD@@DkeUjj`AmHPfES\\H','HeT@@DjU[kjjjh@ZLDXSSYPaLJfxY@','sJP@DkVdAmQEcFRF@','HiD@@LdbJTjjh@[RDIaTwCFDa`@','HiD@@DkYyjj`AmHPfES\\H','sJP@DjZhAyH','KAx@@IVkMUPAlHPfES]FDa`@','sJX@@dkU@OI@','Hed@@LdbRQUUUP@vTHSBinFXpLL@','Hed@@DjuUZjj@FraBXUMpr','sGP@Djfj`FsDVMcKC@','sNp@DkVZj@[\\QXuqba`@','sNp@DjyZj@[\\QXuqfa`@','qCb@AIj`OH@','sNp@DjUZj@[\\QXu`','KAx@@IWOMUPAlHPfES\\','Hid@@DjU^nBBH@D','Hed@@DjuvZjj@FraBXUMpr','sJP@DiVhHKZbKFLtL@','Hmt@@DjU_Zzjjj`AhpQaLmmBDpj[aeXplL@','sNp@DjuZj@[\\QXuqca`@','sJP@DkfhAmQEcFJF@','sNp@LdbJZj@[\\QXu`','HeT@@DjU_k``b`@[JDIaTwCLXFF@','KAx@@IVlmUPAlHPfES]FNa`@','HeT@@LdbbRKBDQD@CYPaLJfxYcEPp@','Hid@@DjUZnBBH@FtaBXUMpqcHX@','qCa@CIKTA@','HiD@@Dj~]jj`AmHPfES\\LXFF@','sKP@Di\\Zj@[TQX`','sGP@Djfj`FsDVMcEC@','HiD@@DkgYjj`AmHPfES\\H','sNp@DjuZj@[\\QXuqaa`@','KAx@@YIMDVjh@vDHSBincDPp@','sJP@DjVhHKZbKFLTL@','Hid@@LdbRQk``b@AmHPfES\\LXZF@','HiD@@Dj}Ujj`AmHPfES\\LXzF@','HeT@@DjU_k``bP@[JDIaTwCH','sNp@DkUZi@[\\QXu`','HiD@@DjYfjj`AmHPfES\\H','sGP@DjZj`FsDVMcAC@','Hmt@@DjU_jxHHj@AmhPfES\\Lj','Hid@@LdbRQk``R@AmHPfES\\H','KAx@@YIDUJjh@vDHSBincDPp@','qCr@XIKTAyD','sOq@@drm\\@@@|`@','Hed@@DjW^jjj@FraBXUMpsFBa`@','HeT@@DjY]zXFB@@[JDIaTwCH','Hkl@@DjU_Vk``bj`@[VDIaTwCJzX','Hid@@DjY}nBHH@FtaBXUMpqcHX@','sGX@@eKuT@|d@','sGP@Dj^Y`FsDVM@','HcL@@DjU_ZnBBJh@FqaBXUMprn`','sJP@DkVdAmQEcFJF@','sOq@@drm\\@@@|b@','sNp@DjyZj@[\\QXuqaa`@','HaD@@DjUZxHH@AyD@','qC`@Qv`H','Hmt@@DjU_Zzjjj`AhpQaLmmBDpj[aeXqdL@','sGP@Dkej`FsDVMcMC@','Hed@@DjUUjjj@FraBXUMpsFHa`@','HeT@@LdbbRkBDQD@CYPaLJfxY@','KAx@@IU{MUPAlHPfES]FLa`@','RG@DTH','sJY@DDeVhA@','KAx@@YIDUJjh@vDHSBinc@Pp@','sJX@@dkU@OI`','sJQ@@dju@OI`','HeT@@LdbbRKBDQD@CYPaLJfxYcFPp@','sFp@DiTvjhAlqEcXpPp@','HaD@@DjUZxHH@AyG@','sNx@@eJ}UPB','sNp@LddUjj@[\\QXuqca`@','HaDH@@RVU[j@@@D','sNp@DkgZi@[\\QXu`','sGY@LDeVj`D','sNp@LdbJfZBZvxbqk@','sJP`@dfvhAyL','sGX@AddQjhAxe`','Hmt@@DjU_ZxHHj@AmhPfES\\LkFIa`@','qCh@CIKTA@','sNp@LdbLjj@[\\QXuq`a`@','sOq@@drm\\@@@|a@','KAx@@IUzmUPAlHPfES]FJa`@','sNx@AddQUUPB','sGP@Di]jP`mfHlZ','sJP`@TeZhA@','KAx@@IRjmUPHKXPaLJfx','HeT@@LdbRTM\\DDT@CYPaLJfxY@','HaF@@@Rfu[j@@@D','Hid@@DjYUaBH`@FtaBXUMpqchX@','KAx@@IUjmTpAlHPfES\\','Hid@@DjU^nBBD@FtaBXUMpqcHX@','sGP@DiUj``mfHl[FFF@','KAx@@IUvmUPAlHPfES]FLa`@','Hed@@LdbQTUUUP@vTHSBinFXqDL@','sJP@DkVhA@','sOx@@drm\\@@@|b@','KAx@@IUkMUPAlHPfES]FDa`@','HeT@@LdbRQU\\DDT@CYPaLJfxY@','HiD@@Dj}Yjj`AmHPfES\\LXrF@','HiD@@Dj{ujj`AmHPfES\\LXFF@','KAx@@IWNmUPAlHPfES]FFa`@','KAx@@IRkMUPHKXPaLJfx','sJP@DjYdAmQEcFZF@','sJY@LDeZhAyL','HaDH@@RVU[f@@@D','sJP`@deVhAyB','HaD@@DjWjZjj`AlHPfES\\','sGP@DkYj`FsDVMcMC@','sNp@DkgZj@[\\QXuqea`@','sJQ@@dlu@H','HeT@@DjU]k``b`@[JDIaTwCLXrF@','sJX@@dkU@OH`','RFDDQFCr`','sJP@DiYXIKZbKFLLL@','KAx@@YIHjjjh@vDHSBincGPp@','Hk\\@@DjU^ukmLHH@@@AmXPfES\\Lki`','sGQ@@djmT@|b@','Hid@@DjUfaBB`@FtaBXUMpqahX@','sNx@@eRmUPB','Hmt@@LdbRVak``ah@FvaBXUMprh','qCr@XIJtA@','KAx@@IWMmUPAlHPfES]FNa`@','HeT@@DjYYZPbJ@@[JDIaTwCH','sNp@DkfZj@[\\QXuqea`@','Hid@@DjU^nBAHAEVtaBXUMp`','Hmt@@DjYU^Vjjj`AhtISRmmBDpj[aeP','sGP@DkejPFsDVM@','sNx@@eJmUPB','qCb@AIf`H','HcL@@DjU_VnBBJh@FqaBXUMprnqcXX@','Hid@@DjUZnBBH@FtaBXUMpqahX@','sNp@LdbQZjBBvxbqkcGC@','sOx@@drm\\@@@|c@','sJP@H~j@^R@','KAx@@YIDcFjhDElHPfES\\','Hid@@DjUZnBAH@FtaBXUMp`','sNp@LddUji@[\\QXu`','sGP@DjfjPFsDVM@','HeT@@DjYUXPbD`@[JDIaTwCH','KAx@@IUoMUPAlHPfES]FDa`@','sFp@DiTt@@AyaD','Hed@@DjuuZjj@FraBXUMpsFIa`@','HeT@@DjUghP`h`@[JDIaTwCLXfF@','sOp@DjWkjj`FwDVM\\YhX@','sGP@Djfj`FsDVMcIC@','KAx@@IRkmUPHKXPaLJfzL]C@','sNx@@djmUPB','QM`AIdD','sOp@DjWkB@@Gbe@','sNp@DjyZj@[\\QXuqca`@','QM@HuAmd`','sNp@LddUjj@[\\QXuqea`@','HaD@@DkeVyjj`AhrXUMuaBDpj[hpDL@','qCb@AIZPH','HiD@@LdbJTjjh@[RDIaTwCF@a`@','Hmt@@DjU_ZxHHi@AmhPfES\\Lj','HaDH@@RYWih@H@D','HiD@@LdbJTjjh@[RDIaTwCFHa`@','sGX@@djuT@|a@','sNp@DkfZj@[\\QXuqaa`@','Hid@@DjU^nBBH@GdL','KAx@@IVkMUPAlHPfES]FJa`@','qCr@XIKTAy@','HmT@@Dj{uVjjh@[ZDIaTwCJqaXX@','Hmt@@DjYWVFjjj`AhpQe\\mmBDpj[aeP','Hif@@@RUe^Fh@@@P','HaDH@@Rfu[j@@@GdH','KAx@@IVsMUPAlHPfES]FDa`@','sKP@Di\\Zj@[TQXq`a`@','sJX@@eMU@OH@','HeT@@DjU^k``b`@[JDIaTwCLXFF@','Hmt@@LdbbRJXPbHh@FvaBXUMprh','sJP@DjvhAmQEcFBF@','Hmt@@LdbbRNXZjjj@FcAFUrvtHSBinFUcBpp@','sJP`@dfvhAyD','sGP@Di^V`dmfHl[FVF@','KAx@@IVsmUPAlHPfES]FBa`@','sOq@@drm\\@@@|PP','sJY@BDeZhA@','HeT@@LdbRbmBDED@CYPaLJfxY@','Hed@@Djy[Zjj@FraBXUMpr','HeT@@DjU]k``b`@[JDIaTwCLXFF@','Hid@@DjUfaBB`@D','qCa@CIJtA@','QMPARVA@','Hid@@DjUfaBB`@FtaBXUMpqcHX@','sJY@BDfZhA@','HeT@@DjUghP`hP@[JDIaTwCH','Hed@@Dj{uZjj@FraBXUMpsFIa`@','Hmt@@LdbbRUXZjjj@FcAFUrvtHSBinFUcFPp@','sNp`@dfuZj@P','sJQ@@dmU@OH@','sJX@@dmU@H','HeT@@DjU]k``b`@[JDIaTwCLXZF@','HiD@@LdfbJZjh@[RDIaTwCFAa`@','sOx@@drm\\@@@|a@','HeT@@LdbbQgCUUU@CQhRfz[JDIaTwCH','Hmt@@DjU]Zzjjj`AhpQaLmmBDpj[aeXplL@','sOp@DjWkjj`FwDVM\\XHX@','HcL@@LdbbRNSBDQEP@McBDpj[ae]cFpp@','HiD@@Dj}Yji`AmHPfES\\H','HaDH@@RYe[hB@@D','Hid@@DjU^njjj@FtaBXUMpq`XX@','HeT@@DkYeFVjjh@ZMaUpsYPaLJfxY@','QMPARZA@','sOq@@drm\\@@@|QX','HaD@@DjYvxH`@A@','HcL@@LdbbRNcBDQEP@McBDpj[ae]@','QMhDRZA@','RG@DXLHmP','QM`BN`XQYd','RG@DTLHmP','QMHAIXFEVd','QMDARVAaH','RFPDXLHmP','RF@Q`vRbdLEC@','RF@QpvR@','QO@HyjAmd`','`II@B','`II@CFspqJp','`II@CF[@hM@prB`','`H@[T[|B`XN@PdM@p|@bHrBcDk@','RG@DXMj}F@','QM`BN`[L~b@','RG@DTMj}D@','QMHAIXFt~j@','QMDARVA}L@','RFPDXMj}D@','sKP@Di\\YZ@[TQXqaa`@','RG@DXMH'])};mS.Qn=function Qn(a,b){var c,d;if(!b)return null;d=QC(hS.QD,$S,5,(mS.Nn.length+31)/32|0,15,1);b=mS.Tn(b);mS.En(a.g,b);for(c=0;c<mS.Nn.length;c++){mS.Dn(a.g,mS.On[c]);mS.un(a.g,4)>0&&(d[c/32|0]|=1<<31-c%32)}return d};mS.Rn=function Rn(){var a,b;if(mS.On==null){b=new mS.Zl(false);mS.On=QC(hS.AE,HS,29,mS.Nn.length,0,1);for(a=0;a<mS.Nn.length;a++){mS.On[a]=mS.Vl(b,mS.Nn[a]);mS.Po(mS.On[a],1)}}};mS.Sn=function Sn(a){var b;for(b=0;b<a.f.length;b++)if((a.c[b]&~a.f[b])!=0)return false;!a.d&&(a.d=mS.Xl(new mS.Zl(false),a.e,null));!a.a&&(a.a=mS.Xl(new mS.Zl(false),a.b,null));mS.En(a.g,a.d);mS.Dn(a.g,a.a);return mS.yn(a.g)};mS.Tn=function Tn(a){var b,c;if(a.I){for(b=0;b<a.o;b++){if((a.w[b]&dT)!=0){a=new mS.ep(a);for(c=b;c<a.o;c++)(a.w[c]&dT)!=0&&(a.A[c]=-1);mS.Dh(a)}}}return a};mS.Un=function Un(a,b,c){a.b=null;a.a=b;c==null?(a.c=mS.Qn(a,b)):(a.c=c)};mS.Vn=function Vn(a,b,c){a.e=null;a.d=b;c==null?(a.f=mS.Qn(a,b)):(a.f=c)};mS.Wn=function Wn(){mS.Pn();this.g=new mS.Kn;mS.Rn()};mS.Xn=function Xn(a){mS.Pn();a=(a&1431655765)+(a>>>1&1431655765);a=(a&858993459)+(a>>>2&858993459);a=(a&117901063)+(a>>>4&117901063);a=(a&983055)+(a>>>8&983055);return (a&31)+(a>>>16)};mS.Yn=function Yn(a){mS.Pn();var b,c,d,e,f,g;if(a==null)return null;b=QC(hS.MD,JT,5,a.length*8,15,1);for(d=0;d<a.length;d++){g=a[d];for(e=7;e>=0;e--){c=g&15;c>9&&(c+=7);b[d*8+e]=48+c<<24>>24;g>>=4}}return iS.JK(lS.rR(b,0,(f=b.length,lS.oR(),f)))};mS.Zn=function Zn(a){mS.Pn();var b,c,d,e;if(iS.IK(a).length==0||(iS.IK(a).length&7)!=0)return null;d=QC(hS.QD,$S,5,iS.IK(a).length/8|0,15,1);for(c=0;c<iS.IK(a).length;c++){e=c/8|0;b=iS.IK(a).charCodeAt(c)-48;b>16&&(b-=7);d[e]<<=4;d[e]+=b}return d};mS.$n=function $n(a,b){mS.Pn();var c,d,e,f;f=0;d=0;e=0;for(c=0;c<a.length;c++){f+=mS.Xn(a[c]&b[c]);d+=mS.Xn(a[c]);e+=mS.Xn(b[c])}return f/$wnd.Math.sqrt(d*e)};mS._n=function _n(a,b){mS.Pn();var c,d,e,f,g;g=0;c=0;for(d=0;d<a.length;d++){e=a[d];f=b[d];g+=mS.Xn(e&f);c+=mS.Xn(e|f)}return g/c};pH(87,1,{},mS.Wn);hS.tE=$I(87);mS.bo=function bo(a){a.i=1;a.j=10;a.k=400;a.f=400;a.d='black';a.b=new CS._N;a.a=new CS._N;a.c=new iS.MK;a.e=new xS.QH(12)};mS.co=function co(a,b){var c,d,e,f,g;d=LD(b.a);e=LD(b.b);f=LD(b.c);g=LD(b.d);c='<line x1="'+d+lU+'y1="'+f+lU+'x2="'+e+lU+'y2="'+g+lU+'style="stroke:'+a.d+';'+mU+LD(a.i)+'"/>';mS.po(a,c)};mS.eo=function eo(a,b){var c,d,e,f,g;d=LD(b.a);e=LD(b.b);f=LD(b.c);g=LD(b.d);c='<line stroke-dasharray="3, 3" x1="'+d+lU+'y1="'+f+lU+'x2="'+e+lU+'y2="'+g+lU+'stroke="'+a.d+lU+mU+LD(a.i)+'"/>';mS.po(a,c)};mS.fo=function fo(a,b,c,d){var e,f;f=new iS.VK('<polygon points="');for(e=0;e<d;e++){iS.OK(f,LD(b[e]));f.a+=',';iS.OK(f,LD(c[e]));f.a+=' '}iS.QK(f,'" style="fill:'+a.d+';'+'stroke:'+a.d+';'+'stroke-width:1"/>');mS.po(a,f.a)};mS.go=function go(a,b,c,d){var e,f,g,h;g=(e=(h=xS.OH(a.e,b),new yS.eI(0,0,h,0)).b,e);f='<text x="'+LD(c-g/2)+lU+'y="'+LD(d+(a.j/3|0))+lU+'font-family=" '+a.e.a+lU+'font-size="'+a.e.b+lU+'fill="'+a.d+'">'+b+'<\/text>';mS.po(a,f)};mS.ho=function ho(a,b,c,d){var e;e='<circle cx="'+LD(b)+lU+'cy="'+LD(c)+lU+'r="'+LD(d)+lU+'fill="'+a.d+'" />';mS.po(a,e)};mS.io=function io(a,b,c,d){var e;e='<circle id="'+(a.g!=null?a.g:'mol'+mS.ao)+':Atom:'+b+lU+nU+'cx="'+LD(c)+lU+'cy="'+LD(d)+lU+'r="'+8+lU+'fill-opacity="0"/>';CS.IN(a.a,e)};mS.jo=function jo(a,b,c,d,e,f,g){var h;h='<line id="'+(a.g!=null?a.g:'mol'+mS.ao)+':Bond:'+b+'-'+c+lU+nU+'x1="'+LD(d)+lU+'y1="'+LD(e)+lU+'x2="'+LD(f)+lU+'y2="'+LD(g)+lU+'stroke-width="'+8+lU+'stroke-opacity="0"'+'/>';CS.IN(a.b,h)};mS.ko=function ko(a,b){a.d='rgb('+(b.c>>16&255)+','+(b.c>>8&255)+','+(b.c&255)+')'};mS.lo=function lo(a,b){a.i=$wnd.Math.max(b,1)};mS.mo=function mo(a,b){if(a.j!=b){a.j=b;a.e=new xS.QH(b)}};mS.no=function no(a,b){a.k=LD(b.b);a.f=LD(b.a);return mS.Jd(a,b)};mS.oo=function oo(a){var b,c,d,e,f,g;f='<svg id="'+(a.g!=null?a.g:'mol'+mS.ao)+lU+'xmlns="http://www.w3.org/2000/svg" version="1.1" '+'width="'+a.k+'px" '+'height="'+a.f+'px" '+'viewBox="0 0 '+a.k+' '+a.f+'">\n';g='<style> #'+(a.g!=null?a.g:'mol'+mS.ao)+' {pointer-events:none; } '+' #'+(a.g!=null?a.g:'mol'+mS.ao)+' .event '+' { pointer-events:all;} '+' <\/style>\n';f+='\t';f+=g;for(e=new CS.vO(a.b);e.a<e.c.a.length;){d=CS.uO(e);mS.po(a,d)}for(c=new CS.vO(a.a);c.a<c.c.a.length;){b=CS.uO(c);mS.po(a,b)}return f+a.c.a+'<\/svg>'};mS.po=function po(a,b){iS.LK(a.c,'\t');iS.LK(a.c,b);iS.LK(a.c,GS)};mS.qo=function qo(a,b,c){mS.Nc();mS.Md.call(this,a,b);mS.bo(this);this.g=c;++mS.ao};pH(114,129,{},mS.qo);_.db=function ro(){return mS.oo(this)};_.f=0;_.i=0;_.j=0;_.k=0;mS.ao=0;hS.vE=$I(114);mS.so=function so(a,b){var c,d,e,f;f=false;a.b=b;mS.Po(a.b,7);c=a.b.d;d=a.b.e;a.j=QC(hS.EG,cT,5,d,16,1);for(e=0;e<d;++e)a.j[e]=false;a.g=QC(hS.EG,cT,5,c,16,1);a.c=QC(hS.QD,$S,5,c,15,1);for(e=0;e<c;++e){a.g[e]=false;a.c[e]=-1}a.e=QC(hS.OF,NT,2,3*c,6,1);a.i=0;a.d=0;a.a=0;while(!f){for(e=0;e<c;++e){if(!a.g[e]){a.a>0&&(a.e[a.i++]='.');mS.uo(a,e,-1);++a.a;break}}e==c&&(f=true)}a.f='';for(e=0;e<a.i;++e)a.f+=''+a.e[e];return a.f};mS.to=function to(a){switch(a){case 5:case 6:case 7:case 8:case 9:case 15:case 16:case 17:case 36:case 53:return true;default:return false;}};mS.uo=function uo(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p;d=true;i=0;p=0;m=a.i;a.c[b]=m;h=mS._h(a.b,b);g=mS.Qh(a.b,b);e=mS.Kh(a.b,b);f=mS.Uh(a.b,b);k=mS.Fk(a.b,b);e==0&&f==0&&mS.to(h)&&(d=false);a.e[m]='';if(c!=-1){switch(mS.li(a.b,c)){case 0:a.e[m]+='~';break;case 2:a.e[m]+='=';break;case 3:a.e[m]+='#';}}d&&(a.e[m]+='[');f!=0&&(a.e[m]+=''+f);a.e[m]+=''+g;if(d){if(0<(o=mS.Rk(a.b,b))){a.e[m]+='H';1<o&&(a.e[m]+=o)}}if(e!=0){e>0?(a.e[m]+='+'):(a.e[m]+='-');(e<0?-e:e)>1&&(a.e[m]+=''+(e<0?-e:e))}d&&(a.e[m]+=']');c!=-1&&(a.j[c]=true);a.g[b]=true;++a.i;for(n=0;n<k;++n)a.j[mS.Gk(a.b,b,n)]||++i;for(n=0;n<k;++n){j=mS.Ek(a.b,b,n);l=mS.Gk(a.b,b,n);if(a.j[l]){++p;continue}if(a.g[j]){++a.d;a.j[l]=true;switch(mS.li(a.b,l)){case 0:a.e[a.c[j]]+='~';a.e[m]+='~';break;case 2:a.e[a.c[j]]+='=';a.e[m]+='=';break;case 3:a.e[a.c[j]]+='#';a.e[m]+='3';}if(a.d>9){a.e[a.c[j]]+='%';a.e[m]+='%'}a.e[a.c[j]]+=''+a.d;a.e[m]+=''+a.d;continue}n-p<i-1&&(a.e[a.i++]='(');mS.uo(a,j,l);n-p<i-1&&(a.e[a.i++]=')')}};mS.vo=function vo(){};pH(118,1,{},mS.vo);_.a=0;_.d=0;_.i=0;hS.wE=$I(118);
mS.wo=function wo(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o;j=QC(hS.QD,$S,5,a.d.d,15,1);h=QC(hS.QD,$S,5,a.d.d,15,1);i=QC(hS.QD,$S,5,a.d.d,15,1);k=QC(hS.QD,$S,5,a.d.d,15,1);c=mS.di(a.d,0,b);d=mS.di(a.d,1,b);h[0]=c;h[1]=d;i[0]=-1;i[1]=b;j[c]=1;j[d]=2;k[c]=-1;k[d]=c;g=1;l=1;while(g<=l&&j[h[g]]<15){o=h[g];for(m=0;m<mS.Fk(a.d,o);m++){e=mS.Ek(a.d,o,m);if(e!=k[o]){f=mS.Gk(a.d,o,m);if(e==c){i[0]=f;for(n=0;n<=l;n++){if(!a.c[i[m]]){a.c[i[m]]=true;++a.b}}return}if(mS.Mi(a.d,e)&&j[e]==0){++l;h[l]=e;i[l]=f;j[e]=j[o]+1;k[e]=o}}}++g}return};mS.xo=function xo(a,b){var c,d,e,f,g,h,i,j,k,l,m;for(c=0;c<a.d.d;c++){if(mS.Mi(a.d,c)){i=QC(hS.QD,$S,5,a.d.d,15,1);h=QC(hS.QD,$S,5,a.d.d,15,1);j=QC(hS.QD,$S,5,a.d.d,15,1);h[0]=c;i[c]=1;j[c]=-1;g=0;k=0;while(g<=k){e=(i[h[g]]&1)==1?1:2;for(l=0;l<mS.Fk(a.d,h[g]);l++){d=mS.Gk(a.d,h[g],l);if(mS.li(a.d,d)==e&&b[d]){f=mS.Ek(a.d,h[g],l);if(i[f]==0){if(e==1&&mS.Mi(a.d,f)){m=h[g];while(m!=-1){mS.Lj(a.d,mS.Ck(a.d,f,m),e==1?2:1);e=3-e;f=m;m=j[m]}mS.rj(a.d,c,false);mS.rj(a.d,f,false);a.a-=2;return true}h[++k]=f;j[f]=h[g];i[f]=i[h[g]]+1}}}++g}}}return false};mS.yo=function yo(a){var b,c,d,e;for(b=0;b<a.d.d;b++){if(mS._h(a.d,b)==7&&mS.Kh(a.d,b)==0&&mS.Wk(a.d,b)>3&&mS.vk(a.d,b)>0){for(e=0;e<mS.Fk(a.d,b);e++){c=mS.Ek(a.d,b,e);d=mS.Gk(a.d,b,e);if(mS.li(a.d,d)>1&&mS.Ki(a.d,c)){mS.oi(a.d,d)==4?mS.Lj(a.d,d,2):mS.Lj(a.d,d,1);mS.ij(a.d,b,mS.Kh(a.d,b)+1);mS.ij(a.d,c,mS.Kh(a.d,c)-1);break}}}}};mS.zo=function zo(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B;mS.Po(a.d,1);a.c=QC(hS.EG,cT,5,a.d.e,16,1);a.b=0;for(f=0;f<a.d.e;f++){if(mS.oi(a.d,f)==64){mS.Lj(a.d,f,1);a.c[f]=true;++a.b}}B=new mS.jn(a.d,3);o=QC(hS.EG,cT,5,B.i.a.length,16,1);for(u=0;u<B.i.a.length;u++){w=CS.NN(B.i,u);o[u]=true;for(k=0;k<w.length;k++){if(!mS.Mi(a.d,w[k])){o[u]=false;break}}if(o[u]){A=CS.NN(B.j,u);for(l=0;l<A.length;l++){if(!a.c[A[l]]){a.c[A[l]]=true;++a.b}}}}for(g=0;g<a.d.e;g++){!a.c[g]&&B.b[g]!=0&&mS.Mi(a.d,mS.di(a.d,0,g))&&mS.Mi(a.d,mS.di(a.d,1,g))&&mS.wo(a,g)}mS.Po(a.d,3);n=QC(hS.EG,cT,5,a.d.e,16,1);for(m=0;m<a.d.e;m++)n[m]=a.c[m];for(v=0;v<B.i.a.length;v++){if(o[v]){w=CS.NN(B.i,v);for(j=0;j<w.length;j++){if(!mS.Do(a,w[j])){if(mS.Mi(a.d,w[j])){mS.rj(a.d,w[j],false);--a.a}for(q=0;q<mS.Fk(a.d,w[j]);q++){i=mS.Gk(a.d,w[j],q);if(a.c[i]){a.c[i]=false;--a.b}}}}}}mS.Co(a);for(t=0;t<B.i.a.length;t++){if(o[t]&&CS.NN(B.j,t).length==6){A=CS.NN(B.j,t);p=true;for(d=0,e=A.length;d<e;++d){c=A[d];if(!a.c[c]){p=false;break}}if(p){mS.Bo(a,A[0]);mS.Bo(a,A[2]);mS.Bo(a,A[4]);mS.Co(a)}}}for(s=5;s>=4;s--){do{r=false;for(c=0;c<a.d.e;c++){if(a.c[c]){b=0;for(j=0;j<2;j++){h=mS.di(a.d,j,c);for(q=0;q<mS.Fk(a.d,h);q++)a.c[mS.Gk(a.d,h,q)]&&++b}if(b==s){mS.Bo(a,c);mS.Co(a);r=true;break}}}}while(r)}while(a.a>=2)if(!mS.xo(a,n))break;if(a.a!=0)throw JG(new iS.HA(oU));if(a.b!=0)throw JG(new iS.HA(oU))};mS.Ao=function Ao(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z;a.d=b;mS.Eh(a.d);L=null;i=QC(hS.QD,$S,5,64,15,1);i[0]=-1;O=QC(hS.QD,$S,5,64,15,1);Q=QC(hS.QD,$S,5,64,15,1);P=QC(hS.QD,$S,5,64,15,1);for(v=0;v<64;v++)O[v]=-1;N=0;g=0;T=false;M=false;R=false;k=0;S=c.length;j=1;while(c[N]<=32)++N;while(N<S){U=c[N++]&VS;if(MI(U)||U==42){h=0;q=-1;A=false;K=false;w=false;if(T){if(U==82&&LI(c[N]&VS)){F=LI(c[N+1]&VS)?2:1;h=mS.ck(iS.JK(lS.rR(c,N-1,(C=1+F,lS.oR(),C))));N+=F}else{B=QI(c[N]&VS)==(c[N]&VS)&&MI(c[N]&VS)?2:1;h=mS.ck(iS.JK(lS.rR(c,N-1,(lS.oR(),B))));N+=B-1;q=0}if(c[N]==64){++N;if(c[N]==64){w=true;++N}K=true}if(c[N]==72){++N;q=1;if(LI(c[N]&VS)){q=c[N]-48;++N}}}else if(U==42){h=6;A=true}else{switch(String.fromCharCode(U).toUpperCase().charCodeAt(0)){case 66:if(N<S&&c[N]==114){h=35;++N}else h=5;break;case 67:if(N<S&&c[N]==108){h=17;++N}else h=6;break;case 70:h=9;break;case 73:h=53;break;case 78:h=7;break;case 79:h=8;break;case 80:h=15;break;case 83:h=16;}}if(h==0)throw JG(new iS.HA('SmilesParser: unknown element label found'));f=mS.fh(a.d,h);if(A){R=true;mS.uj(a.d,f,1,true)}if(QI(U)==U&&MI(U)){mS.rj(a.d,f,true);++a.a}else{mS.rj(a.d,f,false)}if(q!=-1&&h!=1){l=QC(hS.MD,JT,5,1,15,1);l[0]=q<<24>>24;mS.mj(a.d,f,l)}r=i[k];i[k]!=-1&&j!=128&&mS.hh(a.d,f,i[k],j);j=1;i[k]=f;if(g!=0){mS.sj(a.d,f,g);g=0}if(d){I=!L?null:CS.iN(L,iS.$J(r));!!I&&mS.Go(I,f,N,h==1);if(K){!L&&(L=new CS.KP);CS.CP(L,iS.$J(f),new mS.Jo(a,f,r,q,N,w))}}continue}if(U==46){j=128;continue}if(U==61){j=2;continue}if(U==35){j=4;continue}if(LI(U)){G=U-48;if(T){while(N<S&&LI(c[N]&VS)){G=10*G+c[N]-48;++N}g=G}else{t=c[N-2]==45||c[N-2]==61||c[N-2]==35||c[N-2]==58;if(M&&N<S&&LI(c[N]&VS)){G=10*G+c[N]-48;++N}M=false;if(G>=64)throw JG(new iS.HA('SmilesParser: ringClosureAtom number out of range'));if(O[G]==-1){O[G]=i[k];Q[G]=N-1;P[G]=t?j:-1}else{if(O[G]===i[k])throw JG(new iS.HA('SmilesParser: ring closure to same atom'));if(d&&!!L){I=CS.iN(L,iS.$J(O[G]));!!I&&mS.Go(I,i[k],Q[G],false);I=CS.iN(L,iS.$J(i[k]));!!I&&mS.Go(I,O[G],N-1,false)}P[G]!=-1&&(j=P[G]);mS.hh(a.d,i[k],O[G],j);O[G]=-1}j=1}continue}if(U==43){if(!T)throw JG(new iS.HA("SmilesParser: '+' found outside brackets"));m=1;while(c[N]==43){++m;++N}if(m==1&&LI(c[N]&VS)){m=c[N]-48;++N}mS.ij(a.d,i[k],m);continue}if(U==45){if(!T)continue;m=-1;while(c[N]==45){--m;++N}if(m==-1&&LI(c[N]&VS)){m=48-c[N];++N}mS.ij(a.d,i[k],m);continue}if(U==40){if(i[k]==-1)throw JG(new iS.HA('Smiles with leading parenthesis are not supported'));i[k+1]=i[k];++k;continue}if(U==41){--k;continue}if(U==91){if(T)throw JG(new iS.HA('SmilesParser: nested square brackets found'));T=true;continue}if(U==93){if(!T)throw JG(new iS.HA('SmilesParser: closing bracket without opening one'));T=false;continue}if(U==37){M=true;continue}if(U==58){if(!T){j=64;continue}D=0;while(LI(c[N]&VS)){D=10*D+c[N]-48;++N}mS.qj(a.d,i[k],D,false);continue}if(U==47){d&&(j=17);continue}if(U==92){d&&(j=9);continue}throw JG(new iS.HA("SmilesParser: unexpected character found: '"+String.fromCharCode(U)+"'"))}if(j!=1)throw JG(new iS.HA('SmilesParser: dangling open bond'));for(u=0;u<64;u++)if(O[u]!=-1)throw JG(new iS.HA('SmilesParser: dangling ring closure'));s=mS.Pk(a.d);mS.Oj(a.d,true);mS.Po(a.d,1);for(e=0;e<a.d.o;e++){if((b.r==null?null:b.r[e]==null?null:iS.tK(b.r[e]))!=null){if(!mS.Mi(a.d,e)){p=mS.Nh(a.d,e)[0];if(mS._h(a.d,e)<(mS.dh(),mS.$g).length&&mS.$g[mS._h(a.d,e)]!=null){n=false;V=mS.Wk(a.d,e);V-=mS.ri(a.d,e,V);for(X=mS.$g[mS._h(a.d,e)],Y=0,Z=X.length;Y<Z;++Y){W=X[Y];if(V<=W){n=true;W!=V+p&&mS.gj(a.d,e,V+p);break}}n||mS.gj(a.d,e,V+p)}}}}mS.yo(a);mS.zo(a);a.d.r=null;mS.Oj(a.d,false);d&&mS.Eo(a)&&mS.Fl(a.d,0);if(d){oS.$p(new oS.oq,a.d);if(L){for(J=(H=new CS.UP((new CS.ZP((new CS.NM(L)).a)).b),new CS.UM(H));CS.OL(J.a.a);){I=(o=CS.SP(J.a),o.Fb());mS.tj(a.d,I.a,mS.Ho(I,s),false)}mS.Fl(a.d,0)}mS.Il(a.d);mS._o(a.d)}R&&mS.Nj(a.d,true)};mS.Bo=function Bo(a,b){var c,d,e,f;mS.oi(a.d,b)==1&&mS.Lj(a.d,b,2);for(e=0;e<2;e++){c=mS.di(a.d,e,b);if(mS.Mi(a.d,c)){mS.rj(a.d,c,false);--a.a}for(f=0;f<mS.Fk(a.d,c);f++){d=mS.Gk(a.d,c,f);if(a.c[d]){a.c[d]=false;--a.b}}}};mS.Co=function Co(a){var b,c,d,e,f,g,h;do{h=false;for(c=0;c<a.d.e;c++){if(a.c[c]){f=false;for(e=0;e<2;e++){b=false;d=mS.di(a.d,e,c);for(g=0;g<mS.Fk(a.d,d);g++){if(c!=mS.Gk(a.d,d,g)&&a.c[mS.Gk(a.d,d,g)]){b=true;break}}if(!b){f=true;break}}if(f){h=true;mS.Bo(a,c)}}}}while(h)};mS.Do=function Do(a,b){var c;if(mS._h(a.d,b)==16&&mS.Kh(a.d,b)<=0||mS._h(a.d,b)==6&&mS.Kh(a.d,b)!=0||!mS.Mi(a.d,b))return false;c=mS.Mh(a.d,b)==null?0:mS.Nh(a.d,b)[0];if(mS.Ok(a.d,b)-c<1)return false;if(mS._h(a.d,b)!=5&&mS._h(a.d,b)!=6&&mS._h(a.d,b)!=7&&mS._h(a.d,b)!=8&&mS._h(a.d,b)!=15&&mS._h(a.d,b)!=16&&mS._h(a.d,b)!=33&&mS._h(a.d,b)!=34)return false;return true};mS.Eo=function Eo(a){var b,c,d,e,f,g,h,i,j,k,l,m,n;mS.Po(a.d,3);l=false;m=QC(hS.QD,$S,5,2,15,1);n=QC(hS.QD,$S,5,2,15,1);k=QC(hS.QD,$S,5,2,15,1);for(d=0;d<a.d.e;d++){if(!mS.wl(a.d,d)&&mS.oi(a.d,d)==2){for(g=0;g<2;g++){m[g]=-1;k[g]=-1;b=mS.di(a.d,g,d);for(j=0;j<mS.Fk(a.d,b);j++){e=mS.Gk(a.d,b,j);if(e!=d){if(mS.oi(a.d,e)==17||mS.oi(a.d,e)==9){m[g]=mS.Ek(a.d,b,j);n[g]=e}else{k[g]=mS.Ek(a.d,b,j)}}}if(m[g]==-1)break}if(m[0]!=-1&&m[1]!=-1){i=mS.oi(a.d,n[0])!=mS.oi(a.d,n[1]);h=false;for(f=0;f<2;f++){k[f]!=-1&&k[f]<m[f]&&(h=!h)}mS.Ij(a.d,d,i^h?2:1,false);l=true}}}for(c=0;c<a.d.e;c++)(mS.oi(a.d,c)==17||mS.oi(a.d,c)==9)&&mS.Lj(a.d,c,1);return l};mS.Fo=function Fo(){};pH(117,1,{},mS.Fo);_.a=0;_.b=0;hS.yE=$I(117);mS.Go=function Go(a,b,c,d){if(a.b)return;if(a.g==4||a.g==3&&a.c!=-1){a.b=true;return}a.i[a.g]=d;a.f[a.g]=b;a.j[a.g]=c;++a.g};mS.Ho=function Ho(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p;if(a.b)return 3;a.c!=-1&&(a.c=b[a.c]);for(g=0;g<a.g;g++)a.f[g]!=MS&&(a.f[g]=b[a.f[g]]);if(a.c==-1&&a.d==0){n=MS;m=-1;for(h=0;h<a.g;h++){if(n>a.j[h]){n=a.j[h];m=h}}a.c=a.f[m];for(i=m+1;i<a.g;i++){a.f[i-1]=a.f[i];a.j[i-1]=a.j[i];a.i[i-1]=a.i[i]}--a.g}p=(a.c==-1?0:1)+a.d+a.g;if(p>4||p<3)return 3;c=a.c==-1&&a.d==1||a.c!=-1&&mS.ul(a.k.d,a.c);e=-1;for(j=0;j<a.g;j++){if(a.i[j]){if(e!=-1||c)return 3;e=j}}l=false;if(e!=-1)for(k=0;k<a.g;k++)!a.i[k]&&a.f[e]<a.f[k]&&(l=!l);d=false;if(a.c!=-1&&!c)for(f=0;f<a.g;f++)a.c<a.f[f]&&(d=!d);o=a.e^mS.Io(a.f,a.j,a.g)^d^l?2:1;return o};mS.Io=function Io(a,b,c){var d,e,f;e=false;for(d=1;d<c;d++){for(f=0;f<d;f++){a[f]>a[d]&&(e=!e);b[f]>b[d]&&(e=!e)}}return e};mS.Jo=function Jo(a,b,c,d,e,f){this.k=a;if(d!=0&&d!=1){this.b=true}else{this.a=b;this.c=c;this.d=d;this.e=f;this.g=0;this.i=QC(hS.EG,cT,5,4,16,1);this.f=QC(hS.QD,$S,5,4,15,1);this.j=QC(hS.QD,$S,5,4,15,1);if(c!=-1&&d==1){mS.Go(this,MS,e,true);this.d=0}}};pH(97,1,{97:1},mS.Jo);_.a=0;_.b=false;_.c=0;_.d=0;_.e=false;_.g=0;hS.xE=$I(97);mS.Ko=function Ko(a){a.c=new CS._N};mS.Lo=function Lo(a,b){var c,d,e,f;f=a.c.a.length;if(f==0){CS.HN(a.c,0,b);return 0}e=1;while(2*e<=f)e<<=1;d=e;--e;while(d!=0){d>>=1;if(e>=f){e-=d;continue}c=iS.qK(b,CS.NN(a.c,e));if(c==0)return -1;if(d==0)break;c<0?(e-=d):(e+=d)}e<f&&iS.qK(b,CS.NN(a.c,e))>0&&++e;CS.HN(a.c,e,b);return e};mS.Mo=function Mo(a,b){var c,d,e,f;f=a.c.a.length;if(f==0)return -1;e=1;while(2*e<=f)e<<=1;d=e;--e;while(d!=0){d>>=1;if(e>=f){e-=d;continue}c=iS.qK(b,CS.NN(a.c,e));if(c==0)return e;if(d==0)break;c<0?(e-=d):(e+=d)}return -1};mS.No=function No(){mS.Ko(this)};pH(109,1,HT,mS.No);hS.zE=$I(109);mS.Oo=function Oo(a,b){mS.xh(a,b);!!a.b&&(b.Q=0)};mS.Po=function Po(a,b){var c,d,e,f;mS.lk(a,b);if((b&~a.Q)==0)return;a.a&&(b|=128);for(c=0;c<a.o;c++)a.s[c]&=-134447112;for(d=0;d<a.e;d++)a.C[d]&=-64;e=0;f=0;if((b&16)!=0){e=16;f=1}else if((b&32)!=0){e=32;f=3}else if((b&64)!=0){e=64;f=5}if((b&128)!=0){e|=128;f|=32}a.b=new mS.zf(a,f);mS.vf(a.b);mS.wf(a.b);mS.uf(a.b);mS.cp(a)&&(a.b=new mS.zf(a,f));a.Q|=12|e};mS.Qo=function Qo(a,b){return mS.jf(a.b,b)};mS.Ro=function Ro(a,b){return mS.cf(a.b,b)};mS.So=function So(a){var b;mS.Po(a,15);b=a.G&VS;switch(a.G&MT){case US:return null;case KT:return b==1?'meso':''+b+' meso diastereomers';case 0:return 'unknown chirality';case 196608:return 'racemate';case ET:return 'this enantiomer';case 327680:return 'this or other enantiomer';case uT:return 'two epimers';default:return b==1?'one stereo isomer':''+b+' stereo isomers';}};mS.To=function To(a){var b;b=new mS.dp(a.o,a.p);mS.wh(a,b);return b};mS.Uo=function Uo(a){var b,c;b=QC(hS.QD,$S,5,a.o,15,1);c=mS.Nk(a,b,false,false);return mS.Vo(a,b,c)};mS.Vo=function Vo(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q;p=QC(hS.AE,HS,29,c,0,1);g=QC(hS.QD,$S,5,c,15,1);j=QC(hS.QD,$S,5,c,15,1);f=QC(hS.QD,$S,5,a.o,15,1);for(e=0;e<a.o;e++)b[e]!=-1&&(f[e]=g[b[e]]++);for(i=0;i<a.p;i++){n=b[a.B[0][i]];o=b[a.B[1][i]];n==o&&n!=-1&&++j[n]}for(q=0;q<c;q++){p[q]=new mS.dp(g[q],j[q]);mS.Oo(a,p[q])}for(d=0;d<a.o;d++)b[d]!=-1&&mS.uh(a,p[b[d]],d,0,0);for(h=0;h<a.p;h++){n=b[a.B[0][h]];o=b[a.B[1][h]];n==o&&n!=-1&&mS.vh(a,p[n],h,0,0,f,false)}for(l=0,m=p.length;l<m;++l){k=p[l];mS.cj(k,1);mS.cj(k,2)}return p};mS.Wo=function Wo(a){mS.Po(a,7);return !a.b?null:mS.ff(a.b)};mS.Xo=function Xo(a){mS.Po(a,7);return !a.b?null:mS.df(a.b)};mS.Yo=function Yo(a){var b,c;mS.Po(a,15);c=0;for(b=0;b<a.d;b++)(a.s[b]&3)!=0&&(a.s[b]&4)==0&&++c;return c};mS.Zo=function Zo(a,b){return mS.hf(a.b,b)};mS.$o=function $o(a,b){a.a=b;a.Q&=-136};mS._o=function _o(a){mS.Po(a,15);!!a.b&&mS.xf(a.b)};mS.ap=function ap(a){var b,c;mS.Po(a,7);a.J=false;for(b=0;b<a.o;b++){a.s[b]&=YT;(a.s[b]&3)!=0?(a.s[b]|=VT):(a.s[b]&=-67108865)}for(c=0;c<a.p;c++)(a.C[c]&3)!=0&&mS.li(a,c)==2?(a.F[c]=26):(a.F[c]&=-25);a.Q&=-253};mS.bp=function bp(a){var b,c,d,e,f,g;mS.Ll(a);mS.Po(a,15);for(d=0;d<a.d;d++){if(((a.s[d]&zT)>>19==1||(a.s[d]&zT)>>19==2)&&((a.s[d]&WT)==0||(a.s[d]&3)==3))throw JG(new iS.HA(pU));if((a.s[d]&KT)!=0)throw JG(new iS.HA('Over- or under-specified stereofeature or more than one racemic type bond'));if(((a.s[d]&3)==1||(a.s[d]&3)==2)&&a.k[d]==0){b=QC(hS.OD,bT,5,a.g[d],15,1);for(f=0;f<a.g[d];f++)b[f]=mS.ci(a,d,a.f[d][f]);for(e=1;e<a.g[d];e++)if(!mS.Ui(a,a.i[d][e],d))for(g=0;g<e;g++)if(!mS.Ui(a,a.i[d][g],d)){c=$wnd.Math.abs(mS.bk(b[e],b[g]));if(c<0.08||c>_T)throw JG(new iS.HA(qU))}}}};mS.cp=function cp(a){var b,c,d,e,f,g;g=false;for(c=0;c<a.d;c++)((a.s[c]&WT)==0||(a.s[c]&3)==3)&&(a.s[c]&=YT);if(a.J){if((a.G&MT)!=KT){f=QC(hS.EG,cT,5,a.d,16,1);for(d=0;d<a.d;d++)(a.s[d]&WT)!=0&&(a.s[d]&3)!=3&&(a.s[d]&zT)>>19==1&&(f[d]=true);for(e=0;e<a.d;e++){if((a.s[e]&WT)!=0&&(a.s[e]&3)!=3){mS.nj(a,e,1,0);g=true}}for(b=0;b<a.d;b++){if(f[b]){mS.tj(a,b,1,false);mS.nj(a,b,1,-1);g=true}}}a.J=false}mS.cj(a,1);mS.cj(a,2);return g};mS.dp=function dp(a,b){mS.dh();mS.Ol.call(this,a,b)};mS.ep=function ep(a){mS.dh();mS.Pl.call(this,a)};pH(29,58,{58:1,51:1,29:1,4:1},mS.dp,mS.ep);_.gb=function fp(a){mS.Po(this,a)};_.a=false;hS.AE=$I(29);mS.gp=function gp(a){a.b=new CS._N;a.a=new CS._N};mS.hp=function hp(a,b){var c,d;c=mS.Lo(a,b);if(c==-1)return -1;d=a.b.a.length;CS.IN(a.b,b);CS.HN(a.a,c,new iS.TJ(d));return d};mS.ip=function ip(){mS.No.call(this);mS.gp(this)};pH(120,109,HT,mS.ip);hS.BE=$I(120);nS.jp=function jp(a){var b,c,d,e,f;for(d=0;d<a.o;d++){f=mS.To(a);mS.Po(f,15);mS.lj(f,d,(mS.dh(),mS.Zg)[f.A[d]]+'*');mS.Bj(f,d,mS.ck('X'));if(mS.Yo(f)>0){for(c=0;c<f.d;c++){if((f.s[c]&WT)!=0&&mS.cl(f,c)==-1){e=(mS.Po(f,3),f.k[c]==2&&f.g[c]==2?mS.zl(f,c):mS.Bl(f,c));if(e!=-1){a.F[e]=17;a.Q=0;if(a.B[1][e]==c){b=a.B[0][e];a.B[0][e]=c;a.Q=0;a.B[1][e]=b;a.Q=0}mS.nj(a,c,1,0)}}}}}};nS.kp=function kp(a){var b,c,d,e;nS.jp(a);d=a.o;c=QC(hS.OF,NT,2,d,6,1);for(b=0;b<d;b++){e=mS.To(a);mS.Po(e,15);mS.lj(e,b,(mS.dh(),mS.Zg)[e.A[b]]+'*');mS.Bj(e,b,mS.ck('X'));nS.lp(e);c[b]=mS.ff(new mS.zf(e,8))}return c};nS.lp=function lp(a){var b;mS.Po(a,15);for(b=0;b<a.o;b++){(a.s[b]&3)!=0&&mS.nj(a,b,1,0)}};nS.mp=function mp(a,b,c){var d,e;d=OC(hS.OF,[HS,NT],[28,2],6,[a.d,b],2);mS.Po(a,3);for(e=0;e<a.d;e++){d[e]=nS.np(a,e,b,c)}return d};nS.np=function np(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p;i=new mS.dp(a.d,a.e);k=new CS.HQ;n=0;m=0;g=QC(hS.EG,cT,5,a.d,16,1);f=QC(hS.QD,$S,5,a.d,15,1);for(p=0;p<c&&m<a.d;p++){if(m==0){f[0]=b;g[b]=true;m=1}else{o=m;for(j=n;j<m;j++){e=f[j];for(l=0;l<a.g[e];l++){h=a.f[e][l];if(!g[h]){switch(d){case 0:g[h]=true;f[o++]=h;break;case 1:if(!(nS.pp(a,e)&&nS.pp(a,h))){g[h]=true;f[o++]=h}}}}}n=m;m=o}mS.jk(a,i,g,true,null);CS.EQ(k,mS.ff(new mS.zf(i,8)))}return CS.GQ(k,QC(hS.OF,NT,2,k.a.a.length,6,1))};nS.op=function op(a,b,c){var d,e,f,g,h;g=mS.Vl(new mS.Zl(true),a);e=-1;for(;0<g.o;f++){d=g.r==null?null:g.r[0]==null?null:iS.tK(g.r[0]);d!=null&&(h=iS.IK('*').length,iS.uK(iS.IK(d).substr(iS.IK(d).length-h,h),'*'));e=0;break}if(e>=0){return nS.np(g,e,b,c)}return QC(hS.OF,NT,2,0,6,1)};nS.pp=function pp(a,b){if(a.A[b]!=6)return false;if(a.q[b]!=0)return false;if(mS.Rk(a,b)+a.g[b]!=4)return false;return true};nS.Ap=function Ap(){nS.Ap=rH;nS.qp=$wnd.Math.cos(CT);nS.vp=$wnd.Math.sin(CT);nS.sp=$wnd.Math.cos(rU);nS.xp=$wnd.Math.sin(rU);nS.up=$wnd.Math.cos(BT);nS.zp=$wnd.Math.sin(BT);nS.rp=$wnd.Math.cos(sU);nS.wp=$wnd.Math.sin(sU);nS.tp=$wnd.Math.cos($T);nS.yp=$wnd.Math.sin($T);$wnd.Math.cos(tU);$wnd.Math.sin(tU)};nS.Bp=function Bp(a){nS.Ap();var b,c;mS.Po(a,1);c=a.d;for(b=0;b<c;b++){nS.Cp(a,b)}};nS.Cp=function Cp(a,b){nS.Ap();var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M,N,O,P;H=mS.Rk(a,b);O=a.H[b].a;P=a.H[b].b;switch(H){case 1:{J=a.g[b];if(J==0){n=UT;B=-1;for(f=0;f<a.o;f++){if(f==b)continue;l=O-a.H[f].a;m=P-a.H[f].b;j=$wnd.Math.sqrt(l*l+m*m);if(n>j){n=j;B=f}}p=O-a.H[B].a;s=P-a.H[B].b}else{p=O-mS.Yh(a,a.f[b][0]);s=P-mS.Zh(a,a.f[b][0])}if(J==1){C=mS.eh(a,O+nS.tp*p+nS.yp*s,P-nS.yp*p+nS.tp*s,0)}else if(J==2){p=O-0.5*(mS.Yh(a,a.f[b][0])+mS.Yh(a,a.f[b][1]));s=P-0.5*(mS.Zh(a,a.f[b][0])+mS.Zh(a,a.f[b][1]));C=mS.eh(a,O+p,P+s,0)}else if(J==3){L=a.f[b][0];for(w=1;w<3;w++){i=a.i[b][w];(a.F[i]==9||a.F[i]==17)&&(L=a.f[b][w])}c=$wnd.Math.abs(mS.bk(mS.ak(a.H[b].a,a.H[b].b,mS.Yh(a,a.f[b][0]),mS.Zh(a,a.f[b][0])),mS.ak(a.H[b].a,a.H[b].b,mS.Yh(a,a.f[b][1]),mS.Zh(a,a.f[b][1]))));d=$wnd.Math.abs(mS.bk(mS.ak(a.H[b].a,a.H[b].b,mS.Yh(a,a.f[b][0]),mS.Zh(a,a.f[b][0])),mS.ak(a.H[b].a,a.H[b].b,mS.Yh(a,a.f[b][2]),mS.Zh(a,a.f[b][2]))));e=$wnd.Math.abs(mS.bk(mS.ak(a.H[b].a,a.H[b].b,mS.Yh(a,a.f[b][1]),mS.Zh(a,a.f[b][1])),mS.ak(a.H[b].a,a.H[b].b,mS.Yh(a,a.f[b][2]),mS.Zh(a,a.f[b][2]))));K=true;if(c>d&&c>e){if(d+e<hT){K=false;p=O-0.5*(mS.Yh(a,a.f[b][0])+mS.Yh(a,a.f[b][1]));s=P-0.5*(mS.Zh(a,a.f[b][0])+mS.Zh(a,a.f[b][1]))}}else if(d>c&&d>e){if(c+e<hT){K=false;p=O-0.5*(mS.Yh(a,a.f[b][0])+mS.Yh(a,a.f[b][2]));s=P-0.5*(mS.Zh(a,a.f[b][0])+mS.Zh(a,a.f[b][2]))}}else{if(c+d<hT){K=false;p=O-0.5*(mS.Yh(a,a.f[b][1])+mS.Yh(a,a.f[b][2]));s=P-0.5*(mS.Zh(a,a.f[b][1])+mS.Zh(a,a.f[b][2]))}}if(K){M=a.f[b][0];o=UT;for(v=0;v<3;v++){g=a.f[b][v];if(g!=L){k=$wnd.Math.pow(a.H[b].a-a.H[g].a,2)+$wnd.Math.pow(a.H[b].b-a.H[g].b,2);if(k<o){M=g;o=k;iS.YK()}}}C=mS.eh(a,(a.H[L].a+a.H[M].a)/2,(a.H[L].b+a.H[M].b)/2,0)}else{C=mS.eh(a,O+p,P+s,0)}}else{C=mS.eh(a,O+p,P+s,0)}mS.Bj(a,C,1);mS.hh(a,b,C,1)}break;case 2:I=a.g[b];if(I==1){p=O-mS.Yh(a,a.f[b][0]);s=P-mS.Zh(a,a.f[b][0]);C=mS.eh(a,O+(nS.up*p-nS.zp*s)*0.7,P+(nS.zp*p+nS.up*s)*0.7,0);mS.Bj(a,C,1);mS.hh(a,b,C,1);C=mS.eh(a,O+(nS.rp*p-nS.wp*s)*0.7,P+(nS.wp*p+nS.rp*s)*0.7,0);mS.Bj(a,C,1);mS.hh(a,b,C,1)}else if(I==2){q=O-mS.Yh(a,a.f[b][0]);t=P-mS.Zh(a,a.f[b][0]);r=O-mS.Yh(a,a.f[b][1]);u=P-mS.Zh(a,a.f[b][1]);F=$wnd.Math.sqrt(q*q+t*t)*0.7;G=$wnd.Math.sqrt(r*r+u*u)*0.7;p=q+r;s=t+u;D=$wnd.Math.sqrt(p*p+s*s);h=(F+G)/2;p=p/D*h;s=s/D*h;N=mS.cl(a,b);C=mS.eh(a,O+nS.qp*p-nS.vp*s,P+nS.vp*p+nS.qp*s,0);mS.Bj(a,C,1);N>-1?mS.hh(a,b,C,1):mS.hh(a,b,C,17);C=mS.eh(a,O+nS.sp*p-nS.xp*s,P+nS.xp*p+nS.sp*s,0);mS.Bj(a,C,1);mS.hh(a,b,C,1)}else{for(A=0;A<2;A++){C=mS.eh(a,O,P,0);mS.Bj(a,C,1);mS.hh(a,b,C,1)}}break;case 3:{p=(O-mS.Yh(a,a.f[b][0]))*0.7;s=(P-mS.Zh(a,a.f[b][0]))*0.7;C=mS.eh(a,O+p,P+s,0);mS.Bj(a,C,1);mS.hh(a,b,C,1);C=mS.eh(a,O-s,P+p,0);mS.Bj(a,C,1);mS.hh(a,b,C,1);C=mS.eh(a,O+s,P-p,0);mS.Bj(a,C,1);mS.hh(a,b,C,1)}break;default:{for(A=0;A<H;A++){C=mS.eh(a,O,P,0);mS.Bj(a,C,1);mS.hh(a,b,C,1)}break}}};nS.Dp=function Dp(a){nS.Ap();var b,c;mS.Po(a,1);c=0;for(b=0;b<a.o;b++){a.A[b]==1?++c:(c+=a.c[b]-a.g[b]+mS.Rk(a,b))}return c};nS.qp=0;nS.rp=0;nS.sp=0;nS.tp=0;nS.up=0;nS.vp=0;nS.wp=0;nS.xp=0;nS.yp=0;nS.zp=0;oS.Ep=function Ep(a,b,c){var d,e,f;f=b.length;d=new oS.Zq(a.f,f,a.e);d.a[0]=0;d.b[0]=0;for(e=0;e<f;e++){d.k[e]=128-f;d.e[e]=b[e]}f<8?oS.Np(d):oS.Lp(a,d,b,c);CS.IN(a.c,d)};oS.Fp=function Fp(a,b,c){var d,e,f,g,h,i,j,k;e=QC(hS.QD,$S,5,16,15,1);for(d=0;d<a.f.o;d++){for(g=0;g<mS.rk(a.f,d);g++){k=c[mS.Ek(a.f,d,g)];for(h=0;h<g;h++)if(k<e[h])break;for(i=g;i>h;i--)e[i]=e[i-1];e[h]=k}j=iS.dK(6,mS.rk(a.f,d));mS.Pf(b[d],d);mS.Mf(b[d],16,hS.TG(c[d]));mS.Mf(b[d],(6-j)*17,0);for(f=0;f<j;f++)mS.Mf(b[d],17,hS.TG(e[f]))}};oS.Gp=function Gp(a){var b,c,d,e,f,g,h;c=QC(hS.$D,GT,53,a.f.o,0,1);for(b=0;b<a.f.o;b++){c[b]=new mS.Qf(2);mS.Pf(c[b],b)}h=QC(hS.QD,$S,5,a.f.o,15,1);for(d=0;d<a.f.e;d++){e=mS.mi(a.f,d);if(e==1||e==2){mS.Nf(c[mS.di(a.f,0,d)],hS.TG(e));mS.Nf(c[mS.di(a.f,1,d)],hS.TG(e))}}f=oS.Hp(c,h);do{g=f;oS.Fp(a,c,h);f=oS.Hp(c,h)}while(g!=f);return h};oS.Hp=function Hp(a,b){var c,d;d=0;CS.NO(a,0,a.length,null);for(c=0;c<a.length;c++){(c==0||mS.Of(a[c],a[c-1])!=0)&&++d;b[a[c].a]=d}return d};oS.Ip=function Ip(a){var b,c,d,e,f,g,h,i,j,k,l,m;for(i=0;i<a.c.a.length;i++){h=CS.NN(a.c,i);for(j=0;j<h.f.length;j++){d=h.f[j];if(mS.li(a.f,d)==2){!mS.wl(a.f,d)&&mS.mi(a.f,d)==0&&mS.Jj(a.f,d);if(!mS.tl(a.f,d)&&mS.Fk(a.f,mS.di(a.f,0,d))>1&&mS.Fk(a.f,mS.di(a.f,1,d))>1&&(mS.mi(a.f,d)==1||mS.mi(a.f,d)==2)){m=QC(hS.QD,$S,5,2,15,1);e=QC(hS.QD,$S,5,2,15,1);for(k=0;k<2;k++){m[k]=a.f.K;e[k]=mS.di(a.f,k,d);for(l=0;l<mS.rk(a.f,e[k]);l++){f=mS.Ek(a.f,e[k],l);f!=mS.di(a.f,1-k,d)&&m[k]>f&&(m[k]=f)}}g=oS.Iq(h.a[h.g[e[0]]],h.b[h.g[e[0]]],h.a[h.g[e[1]]],h.b[h.g[e[1]]]);b=oS.Iq(h.a[h.g[m[0]]],h.b[h.g[m[0]]],h.a[h.g[e[0]]],h.b[h.g[e[0]]]);c=oS.Iq(h.a[h.g[e[1]]],h.b[h.g[e[1]]],h.a[h.g[m[1]]],h.b[h.g[m[1]]]);oS.Pp(g,b)<0^oS.Pp(g,c)<0^mS.mi(a.f,d)==2&&oS.Oq(h,d)}}}}};oS.Jp=function Jp(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r;m=new CS._N;r=new CS._N;d=new CS._N;for(f=new CS.vO(a.c);f.a<f.c.a.length;){e=CS.uO(f);g=0;d.a=QC(hS.IF,DT,1,0,5,1);for(h=0;h<e.e.length;h++){b=e.e[h];c=a.i[b];if(c!=0){CS.IN(d,new oS.Kq(e,h,c));g+=c}}if(g!=0){CS.YN(d,new oS.rq);for(j=new CS.vO(d);j.a<j.c.a.length;){i=CS.uO(j);if(g*i.b>0){c=(g<0?-g:g)>=iS.bK(i.b)?i.b:g;g-=c;CS.IN(c<0?m:r,new oS.Kq(e,i.a,c));if(g==0)break}}}}if(m.a.length==0||r.a.length==0)return null;CS.YN(r,new oS.vq);CS.YN(m,new oS.zq);for(p=new CS.vO(r);p.a<p.c.a.length;){n=CS.uO(p);for(l=new CS.vO(m);l.a<l.c.a.length;){k=CS.uO(l);if(n.b==-k.b){a.i[oS.Sq(n.c,n.a)]-=n.b;a.i[oS.Sq(k.c,k.a)]-=k.b;return new oS.Fq(n.c,k.c,n.a,k.a)}}}for(q=new CS.vO(r);q.a<q.c.a.length;){n=CS.uO(q);for(l=new CS.vO(m);l.a<l.c.a.length;){k=CS.uO(l);if(n.b>-k.b){a.i[oS.Sq(n.c,n.a)]+=k.b;a.i[oS.Sq(k.c,k.a)]-=k.b;return new oS.Fq(n.c,k.c,n.a,k.a)}}}for(o=new CS.vO(r);o.a<o.c.a.length;){n=CS.uO(o);for(l=new CS.vO(m);l.a<l.c.a.length;){k=CS.uO(l);if(n.b<-k.b){a.i[oS.Sq(n.c,n.a)]-=n.b;a.i[oS.Sq(k.c,k.a)]+=n.b;return new oS.Fq(n.c,k.c,n.a,k.a)}}}return null};oS.Kp=function Kp(a){if(a.c.a.length<2)return null;return new oS.Eq(CS.NN(a.c,0),CS.NN(a.c,1))};oS.Lp=function Lp(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v;k=YC(KC(hS.OD,2),HS,13,0,[YC(KC(hS.OD,1),bT,5,15,[-20]),null,null,null,null,null,YC(KC(hS.OD,1),bT,5,15,[-4,12]),YC(KC(hS.OD,1),bT,5,15,[0,0,7.5]),null,null,null,null,YC(KC(hS.OD,1),bT,5,15,[8,-8]),null,null,null,YC(KC(hS.OD,1),bT,5,15,[-2.4])]);l=YC(KC(hS.QD,2),FT,6,0,[YC(KC(hS.QD,1),$S,5,15,[146]),YC(KC(hS.QD,1),$S,5,15,[627]),null,YC(KC(hS.QD,1),$S,5,15,[2457]),null,YC(KC(hS.QD,1),$S,5,15,[2451,8643,2519]),YC(KC(hS.QD,1),$S,5,15,[9362,14798]),YC(KC(hS.QD,1),$S,5,15,[34377,-2147448999,26214]),null,YC(KC(hS.QD,1),$S,5,15,[37449,137313,95703,34371,37815,54891,132867,-2147309741,54857,55129,-2147449005,-2147449065]),null,YC(KC(hS.QD,1),$S,5,15,[530697,531819,899169,137289,694617,-2146951863,-2146952797,-2146939175,-2146929547,-2146929564,-2146625111,-2146931799,-2146940503,-2146931935]),YC(KC(hS.QD,1),$S,5,15,[1007293,610915]),YC(KC(hS.QD,1),$S,5,15,[542985,137283,2122017,530691,2206773,-2144711351,219209,2840841,137555,-2146871031,-2147264167,613705,-2145360543,-2146625271,694611,2454837,-2145356703,-2147345133,-2146928951,-2146931805,-2144641719,-2146951869,-2146625237,-2146624183,2841963,1074905,-2146625117,2799955,-2144723645,138583,859225,-2145264843,-2145216253,-2146624149,-2144700727,-2146928917,-2143905527,-2144045771,-2146789097,2288547,544407,2104323,-2146911977,-2144479405,3633737,-2146870089,-2146952169]),null,YC(KC(hS.QD,1),$S,5,15,[8487297,2172633,2116611,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8829813]),YC(KC(hS.QD,1),$S,5,15,[14071213])]);q=1<<b.e.length;g=0;i=0;if(b.e.length>7){for(n=0;n<b.e.length;n++){h=oS.Tp(a,c,d,n);h==1?(g+=q):h==2&&(i+=q);g>>>=1;i>>>=1}}s=b.e.length-9;if(b.e.length>=9&&b.e.length<=25&&l[s]!=null){for(v=0;v<l[s].length;v++){p=(-2147483648&l[s][v])==0;j=MS&l[s][v];for(o=false;!o;o=!o){if(o){if(p)break;r=0;for(e=1;e!=q;e<<=1){r<<=1;(j&e)!=0&&(r|=1)}j=r}for(t=0;t<b.e.length;t++){if((j&g)==0&&(~j&i)==0){f=0;m=0.017453292519943295*(k[s]==null?0:k[s][v]);u=true;for(n=1;n<b.e.length;n++){b.a[n]=b.a[n-1]+$wnd.Math.sin(f);b.b[n]=b.b[n-1]+$wnd.Math.cos(f);(j&1)==0&&(u=!u);f+=m+(u?BT:sU);j>>>=1}return}(j&1)!=0&&(j|=q);j>>>=1}}}}oS.Op(b,g,i)};oS.Mp=function Mp(a){var b,c,d,e,f,g,h,i,j,k;b=null;j=null;for(g=0;g<a.f.e;g++){if(mS.oi(a.f,g)==32){c=mS.di(a.f,0,g);e=-1;h=0;for(;h<a.c.a.length;h++){e=oS.Tq(CS.NN(a.c,h),c);if(e!=-1)break}d=mS.di(a.f,1,g);f=-1;i=0;for(;i<a.c.a.length;i++){f=oS.Tq(CS.NN(a.c,i),d);if(f!=-1)break}if(h!=i){if(h>i){k=h;h=i;i=k;k=e;e=f;f=k}j==null&&(j=QC(hS.GE,HS,180,a.c.a.length,0,2));j[i]==null&&(j[i]=QC(hS.GE,{180:1,4:1,7:1},41,i,0,1));if(j[i][h])oS.Cq(j[i][h],e,f);else{UC(j[i],h,new oS.Fq(CS.NN(a.c,h),CS.NN(a.c,i),e,f));!b&&(b=new CS._N);CS.IN(b,j[i][h])}}}}return b};oS.Np=function Np(a){var b,c;b=hT-hT*(a.e.length-2)/a.e.length;for(c=1;c<a.e.length;c++){a.a[c]=a.a[c-1]+$wnd.Math.sin(b*(c-1));a.b[c]=a.b[c-1]+$wnd.Math.cos(b*(c-1))}};oS.Op=function Op(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r;if(b==0||(b&c)!=0){oS.Np(a);return}q=-1;r=0;f=1<<a.e.length-2;e=1<<a.e.length-1;h=1;g=2;for(j=0;j<a.e.length;j++){if((c&(e|h))==0&&(b&(e|h))!=0&&(b&f)==0){o=0;(c&f)!=0&&(o+=4);(b&e)!=0&&(o+=2);(b&h)!=0&&(o+=1);if(r<o){r=o;q=j}}f=e;e=h;h=g;g=1<<(j+2<a.e.length?j+2:j+2-a.e.length)}if(q==-1){oS.Np(a);return}m=0;m|=1<<q;n=2;while(n<a.e.length-1){l=q+n<a.e.length?q+n:q+n-a.e.length;e=1<<(l==0?a.e.length-1:l-1);if((c&e)!=0){++n;continue}h=1<<l;if((b&e)!=0){if((c&h)!=0){oS.Np(a);return}m|=h;n+=2;continue}g=1<<(l+1<a.e.length?l+1:l+1-a.e.length);if((b&h)!=0&&(c&g)!=0){m|=h;n+=3;continue}++n}if(m==0){oS.Np(a);return}d=hT-hT*(a.e.length-2)/a.e.length;for(k=1;k<a.e.length;k++){a.a[k]=a.a[k-1]+$wnd.Math.sin(d*(k-1));a.b[k]=a.b[k-1]+$wnd.Math.cos(d*(k-1))}h=1;p=2*$wnd.Math.sin(d/2);for(i=0;i<a.e.length;i++){if((m&h)!=0){a.a[i]+=p*$wnd.Math.cos(d*(i-0.5));a.b[i]-=p*$wnd.Math.sin(d*(i-0.5))}h<<=1}};oS.Pp=function Pp(a,b){var c;c=a-b;while(c<ZT)c+=gT;while(c>hT)c-=gT;return c};oS.Qp=function Qp(a,b,c){var d,e;d=0;for(e=0;e<mS.rk(a.f,c);e++){oS.Uq(b,mS.Ek(a.f,c,e))&&++d}return d};oS.Rp=function Rp(a,b,c,d){var e,f,g,h,i;h=oS.Tq(b,d);i=oS.Tq(c,d);oS.Yq(c,b.a[h]-c.a[i],b.b[h]-c.b[i]);e=oS.mq(a,b,d);f=oS.mq(a,c,d);g=0;oS.Qp(a,b,d)==1&&oS.Qp(a,c,d)==1&&(g=BT);oS.Xq(c,c.a[i],c.b[i],e-f+g+hT);return oS.Wp(a,b,c,1)};oS.Sp=function Sp(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L;t=QC(hS.QD,$S,5,e,15,1);u=QC(hS.QD,$S,5,e,15,1);for(p=0;p<e;p++){t[p]=oS.Tq(b,d[p]);u[p]=oS.Tq(c,d[p])}F=0;H=0;G=0;I=0;for(q=0;q<e;q++){F+=b.a[t[q]];H+=b.b[t[q]];G+=c.a[u[q]];I+=c.b[u[q]]}F/=e;H/=e;G/=e;I/=e;oS.Yq(c,F-G,H-I);j=QC(hS.HE,DT,17,e,0,1);l=QC(hS.HE,DT,17,e,0,1);f=QC(hS.HE,DT,17,e,0,1);g=QC(hS.HE,DT,17,e,0,1);for(r=0;r<e;r++){j[r]=new oS.Hq(F,H,b.a[t[r]],b.b[t[r]]);l[r]=new oS.Hq(F,H,c.a[u[r]],c.b[u[r]]);f[r]=new oS.Gq(j[r].a-l[r].a,j[r].b*l[r].b);g[r]=new oS.Gq(j[r].a+l[r].a,j[r].b*l[r].b)}w=oS.pq(f,e);A=oS.pq(g,e);K=0;L=0;for(s=0;s<e;s++){for(v=0;v<mS.rk(a.f,d[s]);v++){h=mS.Ek(a.f,d[s],v);oS.Uq(b,h)&&!oS.Uq(c,h)&&++K;!oS.Uq(b,h)&&oS.Uq(c,h)&&++L}}k=QC(hS.HE,DT,17,K,0,1);m=QC(hS.HE,DT,17,L,0,1);n=QC(hS.HE,DT,17,L,0,1);K=0;L=0;for(o=0;o<e;o++){for(v=0;v<mS.rk(a.f,d[o]);v++){h=mS.Ek(a.f,d[o],v);if(oS.Uq(b,h)&&!oS.Uq(c,h)){i=oS.Tq(b,h);k[K]=new oS.Hq(b.a[t[o]],b.b[t[o]],b.a[i],b.b[i]);++K}if(!oS.Uq(b,h)&&oS.Uq(c,h)){i=oS.Tq(c,h);J=new oS.Hq(c.a[u[o]],c.b[u[o]],c.a[i],c.b[i]);m[L]=new oS.Gq(w.a+J.a,J.b);n[L]=new oS.Gq(A.a-J.a,J.b);++L}}}B=oS.pq(k,K);C=oS.pq(m,L);D=oS.pq(n,L);if($wnd.Math.abs(oS.Pp(B.a,C.a))>$wnd.Math.abs(oS.Pp(B.a,D.a))){oS.Xq(c,F,H,w.a)}else{oS.Nq(c,F,H);oS.Xq(c,F,H,A.a)}return oS.Wp(a,b,c,e)};oS.Tp=function Tp(a,b,c,d){var e,f,g,h,i,j;f=d==b.length-1?0:d+1;h=d==0?b.length-1:d-1;g=f==b.length-1?0:f+1;if(mS.li(a.f,c[d])==2){e=mS.mi(a.f,c[d]);if(e==1||e==2){oS._p(a,b[h],b[d],b[f])^oS._p(a,b[g],b[f],b[d])&&(e=e==1?2:1);return e}}if(mS.wl(a.f,c[d])){i=mS._m(mS._k(a.f),c[h],c[d]);j=mS._m(mS._k(a.f),c[f],c[d]);if(i!=-1||j!=-1)return i==j?2:1}return 0};oS.Up=function Up(a,b){var c,d,e,f,g,h,i,j,k,l,m,n;e=QC(hS.QD,$S,5,a.f.o,15,1);f=QC(hS.QD,$S,5,a.f.o,15,1);g=QC(hS.QD,$S,5,a.f.o,15,1);h=QC(hS.QD,$S,5,a.f.o,15,1);e[0]=b;g[b]=1;h[0]=-1;d=0;i=0;while(d<=i){if(d==0||!a.a[e[d]]){for(j=0;j<mS.rk(a.f,e[d]);j++){c=mS.Ek(a.f,e[d],j);m=mS.Gk(a.f,e[d],j);if(g[c]==0&&!a.b[m]){e[++i]=c;f[i]=m;g[c]=g[e[d]]+1;h[i]=d}}}if(d==i){n=new oS.Jq(g[e[d]]);k=d;for(l=0;l<n.a.length;l++){n.a[l]=e[k];n.b[l]=f[k];k=h[k]}return n}++d}return null};oS.Vp=function Vp(a){var b,c,d,e;e=0;d=null;for(c=new CS.vO(a);c.a<c.c.a.length;){b=CS.uO(c);if(e<b.b[0].e.length*b.b[1].e.length){e=b.b[0].e.length*b.b[1].e.length;d=b}}return d};oS.Wp=function Wp(a,b,c,d){var e,f,g,h,i;f=new oS.Zq(a.f,b.e.length+c.e.length-d,a.e);e=0;for(h=0;h<b.e.length;h++){f.e[e]=b.e[h];f.k[e]=b.k[h];f.a[e]=b.a[h];f.b[e++]=b.b[h]}for(g=0;g<c.e.length;g++){i=oS.Tq(b,c.e[g]);if(i==-1){f.e[e]=c.e[g];f.k[e]=c.k[g];f.a[e]=c.a[g];f.b[e++]=c.b[g]}else{if(f.k[i]<c.k[g]){f.k[i]=c.k[g];f.a[i]=c.a[g];f.b[i]=c.b[g]}}}return f};oS.Xp=function Xp(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o;h=QC(hS.QD,$S,5,a.f.o,15,1);i=QC(hS.QD,$S,5,a.f.o,15,1);j=QC(hS.QD,$S,5,a.f.o,15,1);k=QC(hS.QD,$S,5,a.f.o,15,1);h[0]=c;j[c]=1;k[0]=-1;g=0;l=0;while(g<=l){for(m=0;m<mS.rk(a.f,h[g]);m++){e=mS.Ek(a.f,h[g],m);o=mS.Gk(a.f,h[g],m);if(e==b){f=j[h[g]];d=QC(hS.QD,$S,5,f,15,1);d[0]=o;for(n=1;n<f;n++){d[n]=i[g];g=k[g]}return d}if(j[e]==0){h[++l]=e;i[l]=o;j[e]=j[h[g]]+1;k[l]=g}}if(g==l)return null;++g}return null};oS.Yp=function Yp(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o;c=mS.di(a.f,0,b);d=mS.di(a.f,1,b);g=QC(hS.QD,$S,5,a.f.o,15,1);h=QC(hS.QD,$S,5,a.f.o,15,1);i=QC(hS.QD,$S,5,a.f.o,15,1);j=QC(hS.QD,$S,5,a.f.o,15,1);g[0]=c;g[1]=d;h[1]=b;i[c]=1;i[d]=2;j[0]=-1;j[1]=0;f=1;k=1;while(f<=k){for(l=0;l<mS.rk(a.f,g[f]);l++){e=mS.Ek(a.f,g[f],l);if(f>1&&e==c){o=new oS.Jq(i[g[f]]);h[0]=mS.Gk(a.f,g[f],l);m=f;for(n=0;n<o.a.length;n++){o.a[n]=g[m];o.b[n]=h[m];m=j[m]}return o}if(i[e]==0&&mS.sl(a.f,e)){g[++k]=e;h[k]=mS.Gk(a.f,g[f],l);i[e]=i[g[f]]+1;j[k]=f}}++f}return null};
oS.Zp=function Zp(a,b,c,d){var e,f,g,h,i,j;g=QC(hS.QD,$S,5,a.f.o,15,1);h=QC(hS.QD,$S,5,a.f.o,15,1);g[0]=c;g[1]=b;h[c]=1;h[b]=2;f=1;i=1;while(f<=i){for(j=0;j<mS.rk(a.f,g[f]);j++){e=mS.Ek(a.f,g[f],j);if(e==d)return 1+h[g[f]];if(h[e]==0&&mS.sl(a.f,e)){g[++i]=e;h[e]=h[g[f]]+1}}++f}return 0};oS.$p=function $p(a,b){var c,d,e,f,g,h,i;!a.g&&(a.g=new CS.oP);(a.e&1)!=0&&mS.Cl(b);a.f=b;mS.Po(a.f,3);a.c=new CS._N;a.a=QC(hS.EG,cT,5,a.f.o,16,1);a.b=QC(hS.EG,cT,5,a.f.p,16,1);a.d=QC(hS.EG,cT,5,a.f.p,16,1);for(e=0;e<a.f.p;e++)a.d[e]=mS.oi(a.f,e)!=32;a.i=QC(hS.QD,$S,5,a.f.o,15,1);for(c=0;c<a.f.o;c++)a.i[c]=mS.Kh(a.f,c);if((a.e&6)!=0){for(d=0;d<a.f.p;d++)a.d[d]=!a.d[d]&&mS.Mi(a.f,mS.di(a.f,0,d))&&mS.Mi(a.f,mS.di(a.f,1,d));oS.hq(a)}oS.jq(a);oS.eq(a);oS.gq(a);oS.eq(a);for(g=new CS.vO(a.c);g.a<g.c.a.length;){f=CS.uO(g);oS.Vq(f)}oS.Ip(a);oS.lq(a);oS.kq(a);oS.dq(a);oS.bq(a);oS.fq(a);for(h=0;h<a.c.a.length;h++){f=CS.NN(a.c,h);for(i=0;i<f.e.length;i++){mS.yj(a.f,f.e[i],f.a[i]);mS.zj(a.f,f.e[i],f.b[i]);mS.Aj(a.f,f.e[i],0)}}};oS._p=function _p(a,b,c,d){var e,f;for(f=0;f<mS.Fk(a.f,c);f++){e=mS.Ek(a.f,c,f);if(e!=d&&e<b)return false}return true};oS.aq=function aq(a,b,c){var d;oS.Dq(b,c,(a.e&6)!=0);d=oS.Wp(a,b.b[0],b.b[1],0);oS.nq(a,b.b[0],b.b[1],d)};oS.bq=function bq(a){var b;b=oS.Jp(a);while(b){oS.aq(a,b,1.5);b=oS.Jp(a)}};oS.cq=function cq(a,b,c,d){var e,f,g,h,i;e=QC(hS.QD,$S,5,d,15,1);f=0;for(g=0;g<b.e.length;g++)for(h=0;h<c.e.length;h++)b.e[g]===c.e[h]&&(e[f++]=b.e[g]);i=d==1?oS.Rp(a,b,c,e[0]):oS.Sp(a,b,c,e,d);oS.nq(a,b,c,i)};oS.dq=function dq(a){var b,c;c=oS.Mp(a);while(c){b=oS.Vp(c);oS.aq(a,b,1.2);c=oS.Mp(a)}};oS.eq=function eq(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s;while(true){s=0;n=0;q=null;r=null;for(g=1;g<a.c.a.length;g++){d=CS.NN(a.c,g);for(h=0;h<g;h++){e=CS.NN(a.c,h);b=0;c=0;o=0;p=0;for(k=0;k<d.e.length;k++){for(m=0;m<e.e.length;m++){if(d.e[k]===e.e[m]){++c;b=d.e[k];o<d.k[k]&&(o=d.k[k]);p<e.k[m]&&(p=e.k[m])}}}if(c>0){f=c==1&&oS.Qp(a,d,b)==1&&oS.Qp(a,e,b)==1?0:1;o>p?(i=(f<<24)+(o<<16)+(p<<8)+c):(i=(f<<24)+(p<<16)+(o<<8)+c);if(s<i){s=i;n=c;o=0;p=0;for(l=0;l<d.e.length;l++)o<d.k[l]&&(o=d.k[l]);for(j=0;j<e.e.length;j++)p<e.k[j]&&(p=e.k[j]);if(o>p){q=d;r=e}else{q=e;r=d}}}}}if(s==0)break;n==q.e.length?CS.UN(a.c,q):n==r.e.length?CS.UN(a.c,r):oS.cq(a,q,r,n)}};oS.fq=function fq(a){var b;b=oS.Kp(a);while(b){oS.aq(a,b,1.8);b=oS.Kp(a)}};oS.gq=function gq(a){var b,c,d,e,f,g,h;while(true){f=null;for(b=0;b<a.f.o;b++){h=0;for(e=0;e<mS.rk(a.f,b);e++)a.b[mS.Gk(a.f,b,e)]||++h;if(h==1){g=oS.Up(a,b);(!f||g.a.length>f.a.length)&&(f=g)}}if(!f)break;c=new oS.Zq(a.f,f.a.length,a.e);for(d=0;d<f.a.length;d++){a.a[f.a[d]]=true;d<f.a.length-1&&(a.b[f.b[d]]=true);c.e[d]=f.a[d];c.a[d]=$wnd.Math.cos(CT)*d;c.b[d]=(d&1)==1?0:0.5;c.k[d]=128+f.a.length}CS.IN(a.c,c)}};oS.hq=function hq(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r;h=0;f=0;for(g=0;g<a.f.p;g++){if(mS.Mi(a.f,mS.di(a.f,0,g))&&mS.Mi(a.f,mS.di(a.f,1,g))){a.b[g]=true;f+=mS.ji(a.f,g);++h}}if(h==0||f==0)return;f/=h;for(c=0;c<a.f.o;c++){mS.Mi(a.f,c)&&(mS.sk(a.f,c)==0?mS.rj(a.f,c,false):(a.a[c]=true))}p=QC(hS.QD,$S,5,a.f.o,15,1);i=mS.Nk(a.f,p,true,true);o=QC(hS.QD,$S,5,i,15,1);for(d=0;d<a.f.o;d++)p[d]!=-1&&++o[p[d]];n=QC(hS.KE,DT,23,i,0,1);for(k=0;k<i;k++)n[k]=new oS.Zq(a.f,o[k],a.e);e=QC(hS.QD,$S,5,i,15,1);for(b=0;b<a.f.o;b++){l=p[b];if(l!=-1){n[l].k[e[l]]=256;n[l].e[e[l]]=b;n[l].a[e[l]]=mS.Yh(a.f,b)/f;n[l].b[e[l]]=mS.Zh(a.f,b)/f;++e[l]}}q=-1;r=0;for(m=0;m<i;m++){if(r<o[m]){r=o[m];q=m}}CS.IN(a.c,n[q]);for(j=0;j<i;j++)j!=q&&CS.IN(a.c,n[j])};oS.iq=function iq(a,b,c){var d,e,f,g,h,i,j,k,l,m;for(f=0;f<a.f.p;f++){d=mS.di(a.f,0,f);e=mS.di(a.f,1,f);if(mS.tl(a.f,f)||mS.li(a.f,f)!=1||mS.rk(a.f,d)==1||mS.rk(a.f,e)==1)continue;if((a.e&2)!=0&&mS.Mi(a.f,d)&&mS.Mi(a.f,e))continue;l=false;for(j=0;j<2;j++){g=mS.di(a.f,j,f);if(mS.rk(a.f,g)>2){m=true;i=-1;for(k=0;k<mS.rk(a.f,g);k++){h=mS.Ek(a.f,g,k);h!=mS.di(a.f,1-j,f)&&(i==-1?(i=c[h]):i!=c[h]&&(m=false))}if(m){l=true;break}}}l||((a.e&4)!=0&&mS.Mi(a.f,d)&&mS.Mi(a.f,e)?(b[f]=1):(b[f]=2))}};oS.jq=function jq(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M;for(d=0;d<a.f.o;d++){if(mS.rk(a.f,d)>4){m=new oS.Zq(a.f,1+mS.rk(a.f,d),a.e);m.a[mS.rk(a.f,d)]=0;m.b[mS.rk(a.f,d)]=0;m.k[mS.rk(a.f,d)]=32;m.e[mS.rk(a.f,d)]=d;a.a[d]=true;for(o=0;o<mS.rk(a.f,d);o++){j=mS.Ek(a.f,d,o);m.a[o]=$wnd.Math.sin(BT*o-uU);m.b[o]=$wnd.Math.cos(BT*o-uU);m.k[o]=32;m.e[o]=j;a.a[j]=true;a.b[mS.Gk(a.f,d,o)]=true}CS.IN(a.c,m)}}I=mS._k(a.f);for(H=0;H<I.i.a.length;H++){J=CS.NN(I.j,H).length;F=CS.NN(I.i,H);K=false;if((a.e&6)!=0){K=true;for(o=0;o<J;o++){if(!mS.Mi(a.f,F[o])){K=false;break}}}if(!K){r=false;for(p=0;p<J;p++){if(mS.zk(a.f,F[p])==J){r=true;break}}if(r){G=CS.NN(I.j,H);oS.Ep(a,F,G);for(o=0;o<J;o++){a.a[F[o]]=true;a.b[G[o]]=true}}}}for(h=0;h<a.f.p;h++){if(mS.tl(a.f,h)&&!a.b[h]){M=oS.Yp(a,h);F=M.a;G=M.b;oS.Ep(a,F,G);for(o=0;o<M.a.length;o++){a.a[F[o]]=true;a.b[G[o]]=true}}}for(i=0;i<a.f.p;i++){if(!a.b[i]&&mS.li(a.f,i)==3){e=mS.di(a.f,0,i);f=mS.di(a.f,1,i);w=mS.rk(a.f,e)+mS.rk(a.f,f);if(w>2){m=new oS.Zq(a.f,w,a.e);k=0;for(p=0;p<mS.rk(a.f,e);p++){j=mS.Ek(a.f,e,p);if(j!=f){m.e[k++]=j;a.a[j]=true;a.b[mS.Gk(a.f,e,p)]=true}}m.e[k++]=e;m.e[k++]=f;for(q=0;q<mS.rk(a.f,f);q++){j=mS.Ek(a.f,f,q);if(j!=e){m.e[k++]=j;a.a[j]=true;a.b[mS.Gk(a.f,f,q)]=true}}for(o=0;o<w;o++){m.a[o]=o;m.b[o]=0;m.k[o]=1}a.a[e]=true;a.a[f]=true;a.b[i]=true;CS.IN(a.c,m)}}}for(g=0;g<a.f.p;g++){if(!a.b[g]&&mS.li(a.f,g)==2){b=QC(hS.QD,$S,5,a.f.o,15,1);for(o=0;o<2;o++){b[0]=mS.di(a.f,o,g);b[1]=mS.di(a.f,1-o,g);if(mS.vk(a.f,b[0])==1&&mS.vk(a.f,b[1])==2&&mS.rk(a.f,b[1])==2){a.a[b[0]]=true;a.a[b[1]]=true;a.b[g]=true;v=1;do{A=mS.Ek(a.f,b[v],0)==b[v-1]?1:0;b[v+1]=mS.Ek(a.f,b[v],A);if(mS.vk(a.f,b[v+1])==2&&mS.rk(a.f,b[v+1])>2)break;a.a[b[v+1]]=true;a.b[mS.Gk(a.f,b[v],A)]=true;++v}while(mS.vk(a.f,b[v])==2&&mS.rk(a.f,b[v])==2);w=mS.rk(a.f,b[0])+mS.rk(a.f,b[v])+v-1;m=new oS.Zq(a.f,w,a.e);for(t=0;t<=v;t++){m.a[t]=t;m.b[t]=0;m.k[t]=64;m.e[t]=b[t]}l=v+1;n=false;for(u=0;u<mS.rk(a.f,b[0]);u++){j=mS.Ek(a.f,b[0],u);if(j!=b[1]){m.a[l]=-0.5;m.b[l]=n?$wnd.Math.sin(BT):-$wnd.Math.sin(BT);m.k[l]=64;m.e[l]=j;++l;n=true}}n=false;for(s=0;s<mS.rk(a.f,b[v]);s++){j=mS.Ek(a.f,b[v],s);if(j!=b[v-1]){m.a[l]=v+0.5;m.b[l]=n?-$wnd.Math.sin(BT):$wnd.Math.sin(BT);m.k[l]=64;m.e[l]=j;++l;n=true}}CS.IN(a.c,m)}}}}for(c=0;c<a.f.o;c++){if(mS.rk(a.f,c)==4){B=QC(hS.QD,$S,5,4,15,1);C=QC(hS.QD,$S,5,4,15,1);D=0;for(p=0;p<4;p++){B[D]=mS.Ek(a.f,c,p);C[D]=mS.Gk(a.f,c,p);mS.rk(a.f,B[D])==1&&!a.b[C[D]]&&++D}if(D==2){m=new oS.Zq(a.f,3,a.e);for(o=0;o<2;o++){a.a[B[o]]=true;a.b[C[o]]=true;m.e[o]=B[o];m.k[o]=32}m.a[0]=-0.5;m.b[0]=0.866;m.a[1]=0.5;m.b[1]=0.866;m.a[2]=0;m.b[2]=0;m.k[2]=32;m.e[2]=c;CS.IN(a.c,m)}if(D==3){for(q=0;q<2;q++){if(mS.li(a.f,C[q])==1){L=B[q];B[q]=B[2];B[2]=L;L=C[q];C[q]=C[2];C[2]=L}}m=new oS.Zq(a.f,4,a.e);for(o=0;o<3;o++){a.a[B[o]]=true;a.b[C[o]]=true;m.e[o]=B[o];m.k[o]=32}m.a[0]=-1;m.b[0]=0;m.a[1]=1;m.b[1]=0;m.a[2]=0;m.b[2]=1;m.a[3]=0;m.b[3]=0;m.k[3]=32;m.e[3]=c;CS.IN(a.c,m)}}}};oS.kq=function kq(a){var b,c;for(b=0;b<a.f.o;b++){if(!mS.Mi(a.f,b)&&mS.rk(a.f,b)==0){c=new oS.Zq(a.f,1,a.e);a.a[b]=true;c.e[0]=b;c.a[0]=0;c.b[0]=0;c.k[0]=0;CS.IN(a.c,c)}}};oS.lq=function lq(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u;b=oS.Gp(a);f=QC(hS.MD,JT,5,a.f.p,15,1);oS.iq(a,f,b);for(e=0;e<a.f.p;e++)f[e]==2&&(mS.sl(a.f,mS.di(a.f,0,e))||mS.sl(a.f,mS.di(a.f,1,e)))&&(f[e]=3);for(n=0;n<a.c.a.length;n++){l=CS.NN(a.c,n);i=oS.Rq(l);r=l.c;q=new oS.$q(l,a.e);p=-1;for(m=0;m<224&&i.a.length!=0;m++){j=CS.lP(a.g,i.a.length);h=(lS.zR(j,i.a.length),i.a[j]);g=oS.Xp(a,h[0],h[1]);c=QC(hS.QD,$S,5,g.length,15,1);d=0;if(m<32){for(o=1;o<g.length-1;o++)f[g[o]]==3&&(c[d++]=g[o])}else if(m<96){for(o=1;o<g.length-1;o++)f[g[o]]>=2&&(c[d++]=g[o])}else{for(o=1;o<g.length-1;o++)f[g[o]]>=1&&(c[d++]=g[o])}if(d!=0){t=c[0];if(d>1){do{t=c[CS.lP(a.g,d)]}while(t==p)}if(t!=p){p=t;oS.Oq(l,t);i=oS.Rq(l);if(r>l.c){r=l.c;q=new oS.$q(l,a.e)}}}}CS.WN(a.c,n,q);l=q;k=1;do{s=9999;for(o=0;o<l.e.length;o++){u=b[l.e[o]];u==k?oS.Wq(l,o):u>k&&u<s&&(s=u)}k=s}while(s!=9999)}};oS.mq=function mq(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t;e=QC(hS.OD,bT,5,mS.rk(a.f,c)+1,15,1);g=QC(hS.QD,$S,5,mS.rk(a.f,c)+1,15,1);h=QC(hS.QD,$S,5,mS.rk(a.f,c)+1,15,1);q=oS.Tq(b,c);f=0;for(j=0;j<mS.rk(a.f,c);j++){g[f]=mS.Ek(a.f,c,j);h[f]=mS.Gk(a.f,c,j);l=oS.Tq(b,g[f]);l!=-1&&(e[f++]=oS.Iq(b.a[q],b.b[q],b.a[l],b.b[l]))}if(f==1)return e[0]+hT;for(k=f-1;k>0;k--){for(m=0;m<k;m++){if(e[m]>e[m+1]){r=e[m];e[m]=e[m+1];e[m+1]=r;s=g[m];g[m]=g[m+1];g[m+1]=s;t=h[m];h[m]=h[m+1];h[m+1]=t}}}e[f]=e[0]+gT;g[f]=g[0];h[f]=h[0];n=-100;o=0;for(i=0;i<f;i++){d=e[i+1]-e[i];if(f>2&&mS.tl(a.f,h[i])&&mS.tl(a.f,h[i+1])){p=oS.Zp(a,g[i],c,g[i+1]);p!=0&&(d-=100-p)}if(n<d){n=d;o=i}}return (e[o]+e[o+1])/2};oS.nq=function nq(a,b,c,d){var e;e=iS.dK(CS.PN(a.c,b,0),CS.PN(a.c,c,0));CS.HN(a.c,e,d);CS.UN(a.c,b);CS.UN(a.c,c)};oS.oq=function oq(){this.e=1};oS.pq=function pq(a,b){var c,d,e,f,g;g=0;c=0;for(d=0;d<b;d++){g+=a[d].b*$wnd.Math.sin(a[d].a);c+=a[d].b*$wnd.Math.cos(a[d].a)}if(c==0)f=g>0?iT:xT;else{f=$wnd.Math.atan(g/c);c<0&&(f+=hT)}e=$wnd.Math.sqrt(g*g+c*c)/b;return new oS.Gq(f,e)};pH(74,1,{},oS.oq);_.e=0;hS.FE=$I(74);oS.qq=function qq(a,b){var c,d;c=iS.bK(a.b);d=iS.bK(b.b);return c<d?-1:c==d?0:1};oS.rq=function rq(){};pH(126,1,{},oS.rq);_.eb=function sq(a,b){return oS.qq(a,b)};_.ab=function tq(a){return this===a};hS.CE=$I(126);oS.uq=function uq(a){var b,c;b=a.c.e.length;c=a.c.e.length;return b<c?1:b==c?0:-1};oS.vq=function vq(){};pH(127,1,{},oS.vq);_.eb=function wq(a,b){var c;return oS.uq((c=a,b,c))};_.ab=function xq(a){return this===a};hS.DE=$I(127);oS.yq=function yq(a){var b,c;b=a.c.e.length;c=a.c.e.length;return b<c?-1:b==c?0:1};oS.zq=function zq(){};pH(128,1,{},oS.zq);_.eb=function Aq(a,b){var c;return oS.yq((c=a,b,c))};_.ab=function Bq(a){return this===a};hS.EE=$I(128);oS.Cq=function Cq(a,b,c){a.c[0]+=oS.Pq(a.b[0],b);a.d[0]+=oS.Qq(a.b[0],b);a.c[1]+=oS.Pq(a.b[1],c);a.d[1]+=oS.Qq(a.b[1],c);++a.a[0];++a.a[1]};oS.Dq=function Dq(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w;d=QC(hS.OD,bT,5,2,15,1);for(j=0;j<2;j++){a.c[j]/=a.a[j];a.d[j]/=a.a[j];d[j]=oS.Lq(a.b[j],a.c[j],a.d[j],a.b[1-j].e.length,b)}oS.Xq(a.b[0],a.c[0],a.d[0],iT-d[0]);oS.Xq(a.b[1],a.c[1],a.d[1],4.71238898038469-d[1]);w=UT;v=-1.7976931348623157E308;g=a.d[0]-a.d[1];for(k=0;k<a.b[1].b.length;k++){a.b[1].b[k]+=g;w>a.b[1].b[k]&&(w=a.b[1].b[k]);v<a.b[1].b[k]&&(v=a.b[1].b[k])}t=v-w+2*b;e=LD($wnd.Math.ceil(t));w+=(t-e)/2-b;r=QC(hS.OD,bT,5,e,15,1);for(l=0;l<e;l++)r[l]=a.c[1]+b;for(m=0;m<a.b[1].b.length;m++){u=a.b[1].b[m]-w;s=LD(u-b);h=iS.dK(LD(u+b),e-1);for(q=s;q<=h;q++){r[q]>a.b[1].a[m]&&(r[q]=a.b[1].a[m])}}for(n=0;n<e;n++)r[n]-=b;f=a.c[0]-a.c[1];for(o=0;o<a.b[0].a.length;o++){p=LD(a.b[0].b[o]-w);p>=0&&p<r.length&&f<a.b[0].a[o]-r[p]&&(f=a.b[0].a[o]-r[p])}for(i=0;i<a.b[1].a.length;i++)a.b[1].a[i]+=f;if(c){oS.Xq(a.b[0],a.c[0],a.d[0],d[0]-iT);oS.Xq(a.b[1],a.c[0],a.d[0],d[0]-iT)}};oS.Eq=function Eq(a,b){var c,d;this.b=QC(hS.KE,DT,23,2,0,1);this.b[0]=a;this.b[1]=b;this.c=QC(hS.OD,bT,5,2,15,1);this.d=QC(hS.OD,bT,5,2,15,1);this.a=QC(hS.QD,$S,5,2,15,1);for(c=0;c<2;c++){for(d=0;d<this.b[c].e.length;d++){this.c[c]+=oS.Pq(this.b[c],d);this.d[c]+=oS.Qq(this.b[c],d)}this.a[c]=this.b[c].e.length}};oS.Fq=function Fq(a,b,c,d){this.b=QC(hS.KE,DT,23,2,0,1);this.b[0]=a;this.b[1]=b;this.c=QC(hS.OD,bT,5,2,15,1);this.d=QC(hS.OD,bT,5,2,15,1);this.c[0]=oS.Pq(this.b[0],c);this.d[0]=oS.Qq(this.b[0],c);this.c[1]=oS.Pq(this.b[1],d);this.d[1]=oS.Qq(this.b[1],d);this.a=QC(hS.QD,$S,5,2,15,1);this.a[0]=1;this.a[1]=1};pH(41,1,{41:1},oS.Eq,oS.Fq);hS.GE=$I(41);oS.Gq=function Gq(a,b){this.a=a;this.b=b};oS.Hq=function Hq(a,b,c,d){var e,f;this.a=oS.Iq(a,b,c,d);e=c-a;f=d-b;this.b=$wnd.Math.sqrt(e*e+f*f)};oS.Iq=function Iq(a,b,c,d){var e,f,g;f=c-a;g=d-b;if(g!=0){e=$wnd.Math.atan(f/g);g<0&&(f<0?(e-=hT):(e+=hT))}else e=f>0?iT:xT;return e};pH(17,1,{17:1},oS.Gq,oS.Hq);_.a=0;_.b=0;hS.HE=$I(17);oS.Jq=function Jq(a){this.a=QC(hS.QD,$S,5,a,15,1);this.b=QC(hS.QD,$S,5,a,15,1)};pH(107,1,{},oS.Jq);hS.IE=$I(107);oS.Kq=function Kq(a,b,c){this.c=a;this.a=b;this.b=c};pH(80,1,{80:1},oS.Kq);_.a=0;_.b=0;hS.JE=$I(80);oS.Lq=function Lq(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G;if(a.e.length==1)return 0;C=e+$wnd.Math.sqrt(d);k=QC(hS.OD,bT,5,36,15,1);for(o=0;o<a.e.length;o++){f=oS.Iq(b,c,a.a[o],a.b[o]);h=oS.Mq(eH(VG($wnd.Math.round(f*36/gT))));l=b-a.a[o];m=c-a.b[o];F=l*l+m*m;k[h]<F&&(k[h]=F)}v=-1;u=-1;for(p=0;p<36;p++){k[p]=$wnd.Math.sqrt(k[p]);if(v<k[p]){v=k[p];u=p}}D=u-18<0?u-18+36:u-18>=36?u-18-36:u-18;for(q=0;q<=18;q++){k[D+q<0?D+q+36:D+q>=36?D+q-36:D+q]+=0.01*q;k[D-q<0?D-q+36:D-q>=36?D-q-36:D-q]+=0.01*q}G=QC(hS.OD,bT,5,9,15,1);i=QC(hS.OD,bT,5,9,15,1);for(r=1;r<9;r++){G[r]=$wnd.Math.sin(r*vU);i[r]=$wnd.Math.cos(r*vU)}A=UT;w=-1;for(g=0;g<36;g++){if(k[g]>=A)continue;t=k[g];for(n=1;n<9;n++){for(s=-1;s<=1;s+=2){B=g+s*n<0?g+s*n+36:g+s*n>=36?g+s*n-36:g+s*n;if(k[B]*i[n]<=t)continue;j=i[n]*$wnd.Math.min(k[B],C/G[n]);if(t<j){t=j;if(A<=j)break}}if(A<=t)break}if(A>t){A=t;w=g}}return gT*w/36};oS.Mq=function Mq(a){return a<0?a+36:a>=36?a-36:a};oS.Nq=function Nq(a,b,c){var d,e,f;for(f=0;f<a.e.length;f++){e=$wnd.Math.sqrt((a.a[f]-b)*(a.a[f]-b)+(a.b[f]-c)*(a.b[f]-c));d=0-oS.Iq(b,c,a.a[f],a.b[f]);a.a[f]=b+e*$wnd.Math.sin(d);a.b[f]=c+e*$wnd.Math.cos(d)}};oS.Oq=function Oq(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v;a.d==null&&(a.d=QC(hS.QD,FT,6,a.j.p,0,2));if(a.d[b]==null){m=QC(hS.QD,$S,5,a.e.length,15,1);s=QC(hS.EG,cT,5,a.j.o,16,1);d=mS.di(a.j,0,b);e=mS.di(a.j,1,b);m[0]=d;s[d]=true;j=0;n=0;while(j<=n){for(p=0;p<mS.rk(a.j,m[j]);p++){f=mS.Ek(a.j,m[j],p);if(!s[f]&&f!=e){m[++n]=f;s[f]=true}}if(j==n)break;++j}l=n+1>(a.e.length/2|0);if((a.i&6)!=0){h=false;g=false;for(p=0;p<a.e.length;p++){mS.Mi(a.j,a.e[p])&&(s[a.e[p]]?(h=true):(g=true))}h!=g&&(l=h)}i=2;a.d[b]=QC(hS.QD,$S,5,l?a.e.length-n:n+2,15,1);for(q=0;q<a.e.length;q++){a.e[q]==d?(a.d[b][l?0:1]=q):a.e[q]==e?(a.d[b][l?1:0]=q):l^s[a.e[q]]&&(a.d[b][i++]=q)}}u=a.a[a.d[b][0]];v=a.b[a.d[b][0]];t=oS.Iq(u,v,a.a[a.d[b][1]],a.b[a.d[b][1]]);for(o=2;o<a.d[b].length;o++){r=a.d[b][o];k=$wnd.Math.sqrt((a.a[r]-u)*(a.a[r]-u)+(a.b[r]-v)*(a.b[r]-v));c=2*t-oS.Iq(u,v,a.a[r],a.b[r]);a.a[r]=u+k*$wnd.Math.sin(c);a.b[r]=v+k*$wnd.Math.cos(c)}};oS.Pq=function Pq(a,b){return a.a[b]};oS.Qq=function Qq(a,b){return a.b[b]};oS.Rq=function Rq(a){var b,c,d,e,f,g,h,i;a.c=0;c=new CS._N;for(e=1;e<a.e.length;e++){for(f=0;f<e;f++){h=$wnd.Math.abs(a.a[e]-a.a[f]);i=$wnd.Math.abs(a.b[e]-a.b[f]);d=$wnd.Math.sqrt(h*h+i*i);if(d<0.8){b=QC(hS.QD,$S,5,2,15,1);b[0]=a.e[e];b[1]=a.e[f];c.a[c.a.length]=b}g=1-$wnd.Math.min(d,1);a.c+=g*g}}return c};oS.Sq=function Sq(a,b){return a.e[b]};oS.Tq=function Tq(a,b){var c;for(c=0;c<a.e.length;c++)if(b==a.e[c])return c;return -1};oS.Uq=function Uq(a,b){var c;for(c=0;c<a.e.length;c++)if(b==a.e[c])return true;return false};oS.Vq=function Vq(a){var b,c,d,e,f,g;d=0;for(f=0;f<a.e.length;f++){b=a.e[f];c=mS.rk(a.j,b);for(g=0;g<c;g++)mS.Ek(a.j,b,g)>b&&++d}a.f=QC(hS.QD,$S,5,d,15,1);a.g=QC(hS.QD,$S,5,a.j.o,15,1);d=0;for(e=0;e<a.e.length;e++){b=a.e[e];c=mS.rk(a.j,b);a.g[b]=e;for(g=0;g<c;g++)mS.Ek(a.j,b,g)>b&&(a.f[d++]=mS.Gk(a.j,b,g))}};oS.Wq=function Wq(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v;o=a.a[b];s=a.b[b];f=QC(hS.HE,DT,17,4,0,1);k=0;for(l=0;l<a.f.length;l++){if(k>=4)break;if(b==a.g[mS.di(a.j,0,a.f[l])]||b==a.g[mS.di(a.j,1,a.f[l])])continue;p=a.a[a.g[mS.di(a.j,0,a.f[l])]];t=a.b[a.g[mS.di(a.j,0,a.f[l])]];q=a.a[a.g[mS.di(a.j,1,a.f[l])]];u=a.b[a.g[mS.di(a.j,1,a.f[l])]];h=$wnd.Math.sqrt((p-o)*(p-o)+(t-s)*(t-s));i=$wnd.Math.sqrt((q-o)*(q-o)+(u-s)*(u-s));e=$wnd.Math.sqrt((q-p)*(q-p)+(u-t)*(u-t));if(h<e&&i<e){if(p==q){g=$wnd.Math.abs(o-p);g<0.5&&(f[k++]=new oS.Gq(oS.Iq(p,s,o,s),(0.5-g)/2))}else if(t==u){g=$wnd.Math.abs(s-t);g<0.5&&(f[k++]=new oS.Gq(oS.Iq(o,t,o,s),(0.5-g)/2))}else{m=(u-t)/(q-p);n=-1/m;c=t-m*p;d=s-n*o;r=(d-c)/(m-n);v=m*r+c;g=$wnd.Math.sqrt((r-o)*(r-o)+(v-s)*(v-s));g<0.5&&(f[k++]=new oS.Gq(oS.Iq(r,v,o,s),(0.5-g)/2))}continue}if(h<0.5){f[k++]=new oS.Gq(oS.Iq(p,t,o,s),(0.5-h)/2);continue}if(i<0.5){f[k++]=new oS.Gq(oS.Iq(q,u,o,s),(0.5-i)/2);continue}}if(k>0){j=oS.pq(f,k);a.a[b]+=j.b*$wnd.Math.sin(j.a);a.b[b]+=j.b*$wnd.Math.cos(j.a)}};oS.Xq=function Xq(a,b,c,d){var e,f,g;for(g=0;g<a.e.length;g++){f=$wnd.Math.sqrt((a.a[g]-b)*(a.a[g]-b)+(a.b[g]-c)*(a.b[g]-c));e=oS.Iq(b,c,a.a[g],a.b[g])+d;a.a[g]=b+f*$wnd.Math.sin(e);a.b[g]=c+f*$wnd.Math.cos(e)}};oS.Yq=function Yq(a,b,c){var d;for(d=0;d<a.e.length;d++){a.a[d]+=b;a.b[d]+=c}};oS.Zq=function Zq(a,b,c){this.j=a;this.i=c;this.e=QC(hS.QD,$S,5,b,15,1);this.k=QC(hS.QD,$S,5,b,15,1);this.a=QC(hS.OD,bT,5,b,15,1);this.b=QC(hS.OD,bT,5,b,15,1)};oS.$q=function $q(a,b){var c,d;this.j=a.j;this.i=b;this.e=QC(hS.QD,$S,5,a.e.length,15,1);this.k=QC(hS.QD,$S,5,a.e.length,15,1);this.a=QC(hS.OD,bT,5,a.e.length,15,1);this.b=QC(hS.OD,bT,5,a.e.length,15,1);for(d=0;d<a.e.length;d++){this.e[d]=a.e[d];this.k[d]=a.k[d];this.a[d]=a.a[d];this.b[d]=a.b[d]}if(a.f!=null){this.f=QC(hS.QD,$S,5,a.f.length,15,1);for(c=0;c<a.f.length;c++)this.f[c]=a.f[c]}if(a.g!=null){this.g=QC(hS.QD,$S,5,a.g.length,15,1);for(c=0;c<a.g.length;c++)this.g[c]=a.g[c]}};pH(23,1,{23:1},oS.Zq,oS.$q);_.c=0;_.i=0;hS.KE=$I(23);pH(157,1,{});hS.LE=$I(157);pS.ar=function ar(){pS.ar=rH;pS._q=YC(KC(hS.OF,1),NT,2,6,['Actelion No','ID','IDNUMBER','COMPOUND_ID','NAME','COMPND'])};pS.br=function br(b){var c,d,e,f,g,h,i,j,k;if(!b.g)return false;iS.oI(b.f);iS.oI(b.a);b.e=null;k=false;d=-1;b.b=b.c==null?null:QC(hS.OF,NT,2,b.c.length,6,1);b.d=-1;do{try{j=zS.gI(b.g);if(j==null){iS.oI(b.f);return false}}catch(a){a=IG(a);if(CD(a,56)){iS.oI(b.f);return false}else throw JG(a)}if(k){iS.QK(b.a,j);iS.NK(b.a,10)}else{if(iS.uK(iS.IK(j).substr(0,1),'>')){k=true;iS.QK(b.f,cU);iS.NK(b.f,10);iS.QK(b.a,j);iS.NK(b.a,10)}else{iS.QK(b.f,j);iS.NK(b.f,10);iS.uK(iS.IK(j).substr(0,6),cU)&&(k=true);continue}}if(b.c!=null){if(iS.IK(j).length==0){d=-1}else if(d==-1){e=pS.dr(j);if(e!=null){d=-1;for(c=0;c<b.c.length;c++){if(iS.uK(e,b.c[c])){d=c;break}}if(b.d==-1){for(g=pS._q,h=0,i=g.length;h<i;++h){f=g[h];if(iS.uK(e,f)){b.d=d;break}}}}}else{b.b[d]==null?(b.b[d]=j):(b.b[d]=iS.sK(iS.sK(b.b[d],GS),j))}}}while(!iS.uK(iS.IK(j).substr(0,4),dU));return true};pS.cr=function cr(b,c){var d,e,f,g;g=0;e=new mS.ip;while(g<c){try{f=zS.gI(b.g)}catch(a){a=IG(a);if(CD(a,56)){break}else throw JG(a)}if(f==null){break}iS.uK(iS.IK(f).substr(0,4),dU)&&++g;if(iS.uK(iS.IK(f).substr(0,1),'>')){d=pS.dr(f);d!=null&&mS.hp(e,d)}}b.c=CS.$N(e.b,QC(hS.OF,NT,2,0,6,1))};pS.dr=function dr(a){var b,c,d,e;if(iS.IK(a).length==0||iS.IK(a).charCodeAt(0)!=62)return null;d=1;e=0;b=0;while(d<iS.IK(a).length){if(iS.IK(a).charCodeAt(d)==60){if(e!=0)return null;e=d}else if(iS.IK(a).charCodeAt(d)==62){if(b!=0)return null;b=d}++d}if(e!=0&&e<b)return iS.IK(a).substr(e+1,b-(e+1));d=iS.IK(a).indexOf('DT',1);if(d==-1)return null;c=d+2;while(LI(iS.IK(a).charCodeAt(c)))++c;return c==d+2?null:iS.IK(a).substr(d,c-d)};pS.er=function er(a,b){if(a.b==null)return null;return a.b[b]};pS.fr=function fr(a){a.c==null&&pS.cr(a,10240);return a.c};pS.gr=function gr(a,b){a.c==null&&pS.cr(a,b);return a.c};pS.hr=function hr(a){var b;if(a.e)return a.e;a.e=mS.sm(new mS.Lm,(b=a.f.a,b));!!a.e&&(a.e.M==null||iS.IK(a.e.M).length==0)&&mS.Rj(a.e,a.d==-1||a.b==null?null:a.b[a.d]);return a.e};pS.ir=function ir(a,b){pS.ar();this.c=b;this.g=new zS.hI(a);this.f=new iS.UK;this.a=new iS.UK};pH(119,157,{},pS.ir);_.d=0;hS.ME=$I(119);qS.ru=function ru(){qS.ru=rH;qS.qu=(!qS.Vz&&(qS.Vz=new qS.bA),qS.Vz);qS.Br=YC(KC(hS.OF,1),NT,2,6,['?','H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca','Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn','Ga','Ge','As','Se','Br','Kr','Rb','Sr','Y','Zr','Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn','Sb','Te','I','Xe','Cs','Ba','La','Ce','Pr','Nd','Pm','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb','Lu','Hf','Ta','W','Re','Os','Ir','Pt','Au','Hg','Tl','Pb','Bi','Po','At','Rn','Fr','Ra','Ac','Th','Pa','U','Np','Pu','Am','Cm','Bk','Cf','Es','Fm','Md','No','Lr',OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,'R4','R5','R6','R7','R8','R9','R10','R11','R12','R13','R14','R15','R16','R1','R2','R3','A','A1','A2','A3',OT,OT,'D','T','X','R','H2','H+','Nnn','HYD','Pol',OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,OT,'Ala','Arg','Asn','Asp','Cys','Gln','Glu','Gly','His','Ile','Leu','Lys','Met','Phe','Pro','Ser','Thr','Trp','Tyr','Val']);qS.pu=YC(KC(hS.DG,1),HT,5,15,[0,1,4,7,9,11,12,14,16,19,20,23,24,27,28,31,32,35,40,39,40,45,48,51,52,55,56,59,58,63,64,69,74,75,80,79,84,85,88,89,90,93,98,0,102,103,106,107,114,115,120,121,130,127,132,133,138,139,140,141,142,0,152,153,158,159,164,165,166,169,174,175,180,181,184,187,192,193,195,197,202,205,208,209,0,0,0,0,0,0,232,0,238,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,71,156,114,115,103,128,129,57,137,113,113,128,131,147,97,87,101,186,163,99]);qS.lr=YC(KC(hS.OF,1),NT,2,6,[pU,wU,qU])};qS.su=function su(a){var b;b=qS.Xz(qS.qu);b.g=new CS.pP(0);oS.$p(b,a.a);mS.Il(a.a)};qS.tu=function tu(){qS.uu.call(this,null)};qS.uu=function uu(a){qS.ru();!a&&(a=new mS.dp(32,32));this.a=a};qS.hv=function hv(a,b){qS.ru();var c;typeof b===xU&&(b=true);if(typeof b===JS){c=qS.jv(a,false);b===true&&c.inventCoordinates()}else typeof b===LS&&(c=qS.iv(a,b));return c};qS.iv=function iv(a,b){return new qS.uu(mS.Wl(qS.Yz(qS.qu,false),a,b))};qS.jv=function jv(a,b){return new qS.uu(mS.Vl(qS.Yz(qS.qu,b),a))};qS.kv=function kv(a){qS.ru();var b;b=new qS.tu;mS.Hm(qS.Zz(qS.qu),b.a,new zS.hI(new zS.kI(a)));return b};qS.lv=function lv(a,b){qS.ru();b=b||{};var c=!b.noCoordinates;var d=!b.noStereo;return qS.mv(a,c,d)};qS.mv=function mv(a,b,c){var d,e;e=new qS.tu;mS.Ao(qS.aA(qS.qu),e.a,lS.tR((d=a,lS.oR(),d)),c);b&&qS.su(e);return e};qS.uv=function uv(a,b,c,d){qS.ru();return mS.ak(a,b,c,d)};qS.vv=function vv(a,b){qS.ru();return mS.bk(a,b)};qS.Vv=function Vv(a){qS.ru();return mS.ck(a)};qS.vw=function vw(){qS.ru();return mS.dh(),mS.dh(),mS.bh};qS.vx=function vx(a){qS.ru();return mS.dk(a)};qS.wx=function wx(a){qS.ru();return mS.ek(a)};qS.Py=function Py(a){qS.ru();mS.dh();mS.bh=a};pH(34,1,{34:1},qS.tu,qS.uu);_.addAtom=function vu(a){return mS.fh(this.a,a)};_.addBond=function wu(a,b){return mS.gh(this.a,a,b)};_.addFragment=function xu(a,b,c){mS.fk(this.a,a.a,b,c)};_.hb=function yu(){nS.Bp(this.a)};_.ib=function zu(a){nS.Cp(this.a,a)};_.addImplicitHydrogens=function Au(a){a===undefined?this.hb():this.ib(a)};_.addMissingChirality=function Bu(){nS.jp(this.a)};_.addMolecule=function Cu(a){return mS.ih(this.a,a.a)};_.addOrChangeAtom=function Du(a,b,c,d,e,f){return mS.jh(this.a,a,b,c,d,e,f)};_.addOrChangeBond=function Eu(a,b,c){return mS.kh(this.a,a,b,c)};_.addRing=function Fu(a,b,c,d){return mS.lh(this.a,a,b,c,d)};_.addRingToAtom=function Gu(a,b,c){return mS.mh(this.a,a,b,c)};_.addRingToBond=function Hu(a,b,c){return mS.nh(this.a,a,b,c)};_.addSubstituent=function Iu(a,b){return mS.oh(this.a,a.a,b)};_.calculateTorsion=function Ju(a){return mS.ph(this.a,a)};_.canonizeCharge=function Ku(a){return mS.hk(this.a,a)};_.changeAtom=function Lu(a,b,c,d,e){return mS.qh(this.a,a,b,c,d,e)};_.changeAtomCharge=function Mu(a,b){return mS.rh(this.a,a,b)};_.changeBond=function Nu(a,b){return mS.sh(this.a,a,b)};_.convertStereoBondsToSingleBonds=function Ou(a){mS.ik(this.a,a)};_.copyAtom=function Pu(a,b,c,d){return mS.uh(this.a,a.a,b,c,d)};_.copyBond=function Qu(a,b,c,d,e,f){return mS.vh(this.a,a.a,b,c,d,e,f)};_.copyMolecule=function Ru(a){mS.wh(this.a,a.a)};_.copyMoleculeByAtoms=function Su(a,b,c,d){mS.jk(this.a,a.a,b,c,d)};_.copyMoleculeByBonds=function Tu(a,b,c,d){return mS.kk(this.a,a.a,b,c,d)};_.copyMoleculeProperties=function Uu(a){mS.Oo(this.a,a.a)};_.deleteAtom=function Vu(a){mS.yh(this.a,a)};_.deleteAtomOrBond=function Wu(a,b){return mS.zh(this.a,a,b)};_.deleteAtoms=function Xu(a){return mS.Ah(this.a,a)};_.deleteBond=function Yu(a){mS.Bh(this.a,a)};_.deleteBondAndSurrounding=function Zu(a){mS.Ch(this.a,a)};_.deleteMarkedAtomsAndBonds=function $u(){return mS.Dh(this.a)};_.deleteMolecule=function _u(){mS.Eh(this.a)};_.deleteSelectedAtoms=function av(){return mS.Fh(this.a)};_.ensureHelperArrays=function bv(a){mS.Po(this.a,a)};_.findAlleneCenterAtom=function cv(a){return mS.mk(this.a,a)};_.findAtom=function dv(a,b){return mS.Gh(this.a,a,b)};_.findBINAPChiralityBond=function ev(a){return mS.nk(this.a,a)};_.findBond=function fv(a,b){return mS.Hh(this.a,a,b)};_.findRingSystem=function gv(a,b,c,d){mS.ok(this.a,a,b,c,d)};_.getAbsoluteAtomParity=function nv(a){return mS.Qo(this.a,a)};_.getAbsoluteBondParity=function ov(a){return mS.Ro(this.a,a)};_.getAllAtoms=function pv(){return this.a.o};_.getAllBonds=function qv(){return this.a.p};_.getAllConnAtoms=function rv(a){return mS.rk(this.a,a)};_.getAllConnAtomsPlusMetalBonds=function sv(a){return mS.sk(this.a,a)};_.getAllHydrogens=function tv(a){return mS.tk(this.a,a)};_.getAromaticRingCount=function wv(){return mS.uk(this.a)};_.getAtomAbnormalValence=function xv(a){return mS.Ih(this.a,a)};_.getAtomCIPParity=function yv(a){return mS.Jh(this.a,a)};_.getAtomCharge=function zv(a){return mS.Kh(this.a,a)};_.getAtomColor=function Av(a){return mS.Lh(this.a,a)};_.getAtomCustomLabel=function Bv(a){return mS.Mh(this.a,a)};_.getAtomESRGroup=function Cv(a){return mS.Oh(this.a,a)};_.getAtomESRType=function Dv(a){return mS.Ph(this.a,a)};_.getAtomLabel=function Ev(a){return mS.Qh(this.a,a)};_.getAtomList=function Fv(a){return mS.Rh(this.a,a)};_.getAtomListString=function Gv(a){return mS.Sh(this.a,a)};_.getAtomMapNo=function Hv(a){return mS.Th(this.a,a)};_.getAtomMass=function Iv(a){return mS.Uh(this.a,a)};_.getAtomParity=function Jv(a){return mS.Vh(this.a,a)};_.getAtomPi=function Kv(a){return mS.vk(this.a,a)};_.getAtomPreferredStereoBond=function Lv(a){return mS.wk(this.a,a)};_.getAtomQueryFeatures=function Mv(a){return mS.Wh(this.a,a)};_.getAtomRadical=function Nv(a){return mS.Xh(this.a,a)};_.getAtomRingBondCount=function Ov(a){return mS.xk(this.a,a)};_.getAtomRingCount=function Pv(a,b){return mS.yk(this.a,a,b)};_.getAtomRingSize=function Qv(a){return mS.zk(this.a,a)};_.getAtomX=function Rv(a){return mS.Yh(this.a,a)};_.getAtomY=function Sv(a){return mS.Zh(this.a,a)};_.getAtomZ=function Tv(a){return mS.$h(this.a,a)};_.getAtomicNo=function Uv(a){return mS._h(this.a,a)};_.getAtoms=function Wv(){return this.a.d};_.getAverageBondLength=function Xv(a){return mS.Ak(this.a,a)};_.getAverageTopologicalAtomDistance=function Yv(){return mS.Bk(this.a)};_.getBond=function Zv(a,b){return mS.Ck(this.a,a,b)};_.getBondAngle=function $v(a,b){return mS.ci(this.a,a,b)};_.getBondAtom=function _v(a,b){return mS.di(this.a,a,b)};_.getBondBridgeMaxSize=function aw(a){return mS.ei(this.a,a)};_.getBondBridgeMinSize=function bw(a){return mS.fi(this.a,a)};_.getBondCIPParity=function cw(a){return mS.gi(this.a,a)};_.getBondESRGroup=function dw(a){return mS.hi(this.a,a)};_.getBondESRType=function ew(a){return mS.ii(this.a,a)};_.getBondLength=function fw(a){return mS.ji(this.a,a)};_.getBondOrder=function gw(a){return mS.li(this.a,a)};_.getBondParity=function hw(a){return mS.mi(this.a,a)};_.getBondPreferredStereoBond=function iw(a){return mS.Al(this.a,a)};_.getBondQueryFeatures=function jw(a){return mS.ni(this.a,a)};_.getBondRingSize=function kw(a){return mS.Dk(this.a,a)};_.getBondType=function lw(a){return mS.oi(this.a,a)};_.getBondTypeSimple=function mw(a){return mS.pi(this.a,a)};_.getBonds=function nw(){return this.a.e};_.getChiralText=function ow(){return mS.So(this.a)};_.getChirality=function pw(){return this.a.G};_.getCompactCopy=function qw(){return new qS.uu(mS.To(this.a))};_.getConnAtom=function rw(a,b){return mS.Ek(this.a,a,b)};_.getConnAtoms=function sw(a){return mS.Fk(this.a,a)};_.getConnBond=function tw(a,b){return mS.Gk(this.a,a,b)};_.getConnBondOrder=function uw(a,b){return mS.Hk(this.a,a,b)};_.getDefaultMaxValenceUncharged=function ww(a){return mS.qi(this.a,a)};_.getDiastereotopicAtomIDs=function xw(){return nS.kp(this.a)};_.getElectronValenceCorrection=function yw(a,b){return mS.ri(this.a,a,b)};_.getExcludeGroupValence=function zw(a){return mS.Ik(this.a,a)};_.getExplicitHydrogens=function Aw(a){return mS.Jk(this.a,a)};_.getFisherProjectionParity=function Bw(a,b,c,d){return mS.Lk(this.a,a,b,c,d)};_.getFragmentAtoms=function Cw(a,b){return mS.Mk(this.a,a,b)};_.getFragmentNumbers=function Dw(a,b,c){return mS.Nk(this.a,a,b,c)};_.getFragments=function Ew(){var a,b,c;a=mS.Uo(this.a);c=QC(hS.NE,DT,34,a.length,0,1);for(b=0;b<a.length;b++){c[b]=new qS.uu(a[b])}return c};_.getFreeValence=function Fw(a){return mS.Ok(this.a,a)};_.getHandleHydrogenMap=function Gw(){return mS.Pk(this.a)};_.getHelperArrayStatus=function Hw(){return this.a.Q};_.getHoseCodes=function Iw(a){a=a||{};var b=(typeof a.maxSphereSize===xU?5:a.maxSphereSize)|0;var c=(typeof a.type===xU?0:a.type)|0;return nS.mp(this.a,b,c)};_.getIDCode=function Jw(){return mS.Wo(this.a)};_.getIDCodeAndCoordinates=function Kw(){return {idCode:this.getIDCode(),coordinates:this.getIDCoordinates()}};_.getIDCoordinates=function Lw(){return mS.Xo(this.a)};_.getImplicitHigherValence=function Mw(a,b){return mS.Qk(this.a,a,b)};_.getImplicitHydrogens=function Nw(a){return mS.Rk(this.a,a)};_.getIndex=function Ow(){return mS.Qn(qS.$z(qS.qu),this.a)};_.getLowestFreeValence=function Pw(a){return mS.Sk(this.a,a)};_.getMaxAtoms=function Qw(){return this.a.K};_.getMaxBonds=function Rw(){return this.a.L};_.getMaxValence=function Sw(a){return mS.si(this.a,a)};_.getMaxValenceUncharged=function Tw(a){return mS.ti(this.a,a)};_.getMetalBondedConnAtoms=function Uw(a){return mS.Tk(this.a,a)};_.getMolecularFormula=function Vw(){return new qS.Rz(this.a)};_.getMolweight=function Ww(){return mS.Uk(this.a)};_.getName=function Xw(){return this.a.M};_.getNonHydrogenNeighbourCount=function Yw(a){return mS.Vk(this.a,a)};_.getNumberOfHydrogens=function Zw(){return nS.Dp(this.a)};_.getOccupiedValence=function $w(a){return mS.Wk(this.a,a)};_.getPath=function _w(a,b,c,d,e){return mS.Xk(this.a,a,b,c,d,e)};
_.getPathBonds=function ax(a,b,c){mS.Yk(this.a,a,b,c)};_.getPathLength=function bx(a,b){return mS.Zk(this.a,a,b)};_.getRotatableBondCount=function cx(){return mS.al(this.a)};_.jb=function dx(a,b,c,d){var e,f;f=qS.cA(d);e=new mS.qo(this.a,f,c);mS.Ld(e,new yS.eI(0,0,a,b));mS.Ed(e);return mS.oo(e)};_.getStereoBond=function ex(a){return mS.cl(this.a,a)};_.getStereoCenterCount=function fx(){return mS.Yo(this.a)};_.getStereoProblem=function gx(a){return mS.vi(this.a,a)};_.getSubstituent=function hx(a,b,c,d,e){return mS.el(this.a,a,b,c,d.a,e)};_.getSubstituentSize=function ix(a,b){return mS.fl(this.a,a,b)};_.getSymmetryRank=function jx(a){return mS.Zo(this.a,a)};_.getZNeighbour=function kx(a,b){return mS.gl(this.a,a,b)};_.invalidateHelperArrays=function lx(a){mS.yi(this.a,a)};_.inventCoordinates=function mx(){qS.su(this)};_.isAllylicAtom=function nx(a){return mS.kl(this.a,a)};_.isAmideTypeBond=function ox(a){return mS.ll(this.a,a)};_.isAromaticAtom=function px(a){return mS.ml(this.a,a)};_.isAromaticBond=function qx(a){return mS.nl(this.a,a)};_.isAtomConfigurationUnknown=function rx(a){return mS.zi(this.a,a)};_.isAtomMarkedForDeletion=function sx(a){return mS.Ai(this.a,a)};_.isAtomParityPseudo=function tx(a){return mS.Bi(this.a,a)};_.isAtomStereoCenter=function ux(a){return mS.Ci(this.a,a)};_.isAutoMappedAtom=function xx(a){return mS.Di(this.a,a)};_.isBINAPChiralityBond=function yx(a){return mS.ol(this.a,a)};_.isBondBackgroundHilited=function zx(a){return mS.Ei(this.a,a)};_.isBondBridge=function Ax(a){return mS.Fi(this.a,a)};_.isBondForegroundHilited=function Bx(a){return mS.Gi(this.a,a)};_.isBondMarkedForDeletion=function Cx(a){return mS.Hi(this.a,a)};_.isBondParityPseudo=function Dx(a){return mS.Ii(this.a,a)};_.isBondParityUnknownOrNone=function Ex(a){return mS.Ji(this.a,a)};_.isDelocalizedBond=function Fx(a){return mS.pl(this.a,a)};_.isElectronegative=function Gx(a){return mS.Ki(this.a,a)};_.isElectropositive=function Hx(a){return mS.Li(this.a,a)};_.isFlatNitrogen=function Ix(a){return mS.ql(this.a,a)};_.isFragment=function Jx(){return this.a.I};_.isMarkedAtom=function Kx(a){return mS.Mi(this.a,a)};_.isMetalAtom=function Lx(a){return mS.Ni(this.a,a)};_.isNaturalAbundance=function Mx(a){return mS.Oi(this.a,a)};_.isOrganicAtom=function Nx(a){return mS.Pi(this.a,a)};_.isPseudoRotatableBond=function Ox(a){return mS.rl(this.a,a)};_.isPurelyOrganic=function Px(){return mS.Qi(this.a)};_.isRingAtom=function Qx(a){return mS.sl(this.a,a)};_.isRingBond=function Rx(a){return mS.tl(this.a,a)};_.isSelectedAtom=function Sx(a){return mS.Ri(this.a,a)};_.isSelectedBond=function Tx(a){return mS.Si(this.a,a)};_.isSimpleHydrogen=function Ux(a){return mS.ul(this.a,a)};_.isSmallRingAtom=function Vx(a){return mS.vl(this.a,a)};_.isSmallRingBond=function Wx(a){return mS.wl(this.a,a)};_.isStabilizedAtom=function Xx(a){return mS.xl(this.a,a)};_.isStereoBond=function Yx(a){return mS.Ti(this.a,a)};_.markAtomForDeletion=function Zx(a){mS.Vi(this.a,a)};_.markBondForDeletion=function $x(a){mS.Wi(this.a,a)};_.normalizeAmbiguousBonds=function _x(){return mS.yl(this.a)};_.removeAtomColors=function ay(){mS.Zi(this.a)};_.removeAtomCustomLabels=function by(){this.a.r=null};_.removeAtomMarkers=function cy(){mS.$i(this.a)};_.removeAtomSelection=function dy(){mS._i(this.a)};_.removeBondHiliting=function ey(){mS.aj(this.a)};_.removeExplicitHydrogens=function fy(){mS.Cl(this.a)};_.renumberESRGroups=function gy(a){return mS.cj(this.a,a)};_.scaleCoords=function hy(a){mS.dj(this.a,a)};_.setAllAtoms=function iy(a){mS.ej(this.a,a)};_.setAllBonds=function jy(a){mS.fj(this.a,a)};_.setAssignParitiesToNitrogen=function ky(a){mS.$o(this.a,a)};_.setAtomAbnormalValence=function ly(a,b){mS.gj(this.a,a,b)};_.setAtomCIPParity=function my(a,b){mS.hj(this.a,a,b)};_.setAtomCharge=function ny(a,b){mS.ij(this.a,a,b)};_.setAtomColor=function oy(a,b){mS.jj(this.a,a,b)};_.setAtomConfigurationUnknown=function py(a,b){mS.kj(this.a,a,b)};_.setAtomCustomLabel=function qy(a,b){mS.lj(this.a,a,b)};_.setAtomESR=function ry(a,b,c){mS.nj(this.a,a,b,c)};_.setAtomList=function sy(a,b,c){mS.pj(this.a,a,b,c)};_.setAtomMapNo=function ty(a,b,c){mS.qj(this.a,a,b,c)};_.setAtomMarker=function uy(a,b){mS.rj(this.a,a,b)};_.setAtomMass=function vy(a,b){mS.sj(this.a,a,b)};_.setAtomParity=function wy(a,b,c){mS.tj(this.a,a,b,c)};_.setAtomQueryFeature=function xy(a,b,c){mS.uj(this.a,a,b,c)};_.setAtomRadical=function yy(a,b){mS.vj(this.a,a,b)};_.setAtomSelection=function zy(a,b){mS.wj(this.a,a,b)};_.setAtomX=function Ay(a,b){mS.yj(this.a,a,b)};_.setAtomY=function By(a,b){mS.zj(this.a,a,b)};_.setAtomZ=function Cy(a,b){mS.Aj(this.a,a,b)};_.setAtomicNo=function Dy(a,b){mS.Bj(this.a,a,b)};_.setBondAtom=function Ey(a,b,c){mS.Cj(this.a,a,b,c)};_.setBondBackgroundHiliting=function Fy(a,b){mS.Dj(this.a,a,b)};_.setBondCIPParity=function Gy(a,b){mS.Ej(this.a,a,b)};_.setBondESR=function Hy(a,b,c){mS.Fj(this.a,a,b,c)};_.setBondForegroundHiliting=function Iy(a,b){mS.Gj(this.a,a,b)};_.setBondOrder=function Jy(a,b){mS.Hj(this.a,a,b)};_.setBondParity=function Ky(a,b,c){mS.Ij(this.a,a,b,c)};_.setBondParityUnknownOrNone=function Ly(a){mS.Jj(this.a,a)};_.setBondQueryFeature=function My(a,b,c){mS.Kj(this.a,a,b,c)};_.setBondType=function Ny(a,b){mS.Lj(this.a,a,b)};_.setChirality=function Oy(a){mS.Mj(this.a,a)};_.setFragment=function Qy(a){mS.Nj(this.a,a)};_.setHydrogenProtection=function Ry(a){mS.Oj(this.a,a)};_.setMaxAtoms=function Sy(a){mS.Pj(this.a,a)};_.setMaxBonds=function Ty(a){mS.Qj(this.a,a)};_.setName=function Uy(a){mS.Rj(this.a,a)};_.setParitiesValid=function Vy(a){mS.Fl(this.a,a)};_.setStereoBondFromAtomParity=function Wy(a){mS.Gl(this.a,a)};_.setStereoBondFromBondParity=function Xy(a){mS.Hl(this.a,a)};_.setStereoBondsFromParity=function Yy(){mS.Il(this.a)};_.setToRacemate=function Zy(){this.a.J=true};_.setUnknownParitiesToExplicitlyUnknown=function $y(){mS._o(this.a)};_.shareSameFragment=function _y(a,b){return mS.Zk(this.a,a,b)!=-1};_.stripIsotopInfo=function az(){return mS.Uj(this.a)};_.stripSmallFragments=function bz(a){return mS.Jl(this.a,a)};_.stripStereoInformation=function cz(){mS.ap(this.a)};_.suggestBondType=function dz(a,b){return mS.Vj(this.a,a,b)};_.supportsImplicitHydrogen=function ez(a){return mS.Kl(this.a,a)};_.toMolfile=function fz(){var a;a=new mS.nm(this.a);return a.b.a};_.toMolfileV3=function gz(){var a;a=new mS.Om(this.a);return a.a.a};_.toSVG=function hz(a,b,c,d){return this.jb(a,b,c,d)};_.toSmiles=function iz(){return mS.so(qS._z(qS.qu),this.a)};_.translateCoords=function jz(a,b){mS.Xj(this.a,a,b)};_.validate=function kz(){mS.bp(this.a)};_.zoomAndRotate=function lz(a,b,c){mS.Zj(this.a,a,b,c)};_.zoomAndRotateInit=function mz(a,b){mS.$j(this.a,a,b)};qS.jr=yU;qS.kr=yU;qS.mr=qU;qS.nr=pU;qS.or=wU;qS.pr=0;qS.qr=3;qS.rr=1;qS.sr=2;qS.tr=64;qS.ur=384;qS.vr=448;qS.wr=192;qS.xr=256;qS.yr=0;qS.zr=320;qS.Ar=128;qS.Cr=1;qS.Dr=2;qS.Er=4;qS.Fr=0;qS.Gr=3;qS.Hr=1;qS.Ir=6;qS.Jr=2;qS.Kr=1;qS.Lr=2;qS.Mr=nT;qS.Nr=3;qS.Or=25;qS.Pr=dT;qS.Qr=wT;qS.Rr=lT;qS.Sr=4;qS.Tr=7;qS.Ur=LT;qS.Vr=jT;qS.Wr=kU;qS.Xr=5;qS.Yr=17;qS.Zr=sT;qS.$r=kT;qS._r=30;qS.as=128;qS.bs=KT;qS.cs=rT;qS.ds=256;qS.es=ET;qS.fs=32768;qS.gs=512;qS.hs=QS;qS.is=US;qS.js=16;qS.ks=mT;qS.ls=RS;qS.ms=32;qS.ns=tT;qS.os=64;qS.ps=4;qS.qs=8;qS.rs=VT;qS.ss=33554432;qS.ts=WT;qS.us=3;qS.vs=14;qS.ws=qT;qS.xs=vT;qS.ys=3;qS.zs=22;qS.As=120;qS.Bs=4;qS.Cs=3;qS.Ds=kU;qS.Es=48;qS.Fs=32;qS.Gs=0;qS.Hs=16;qS.Is=4;qS.Js=48;qS.Ks=1;qS.Ls=0;qS.Ms=3;qS.Ns=2;qS.Os=1;qS.Ps=0;qS.Qs=3;qS.Rs=2;qS.Ss=2097151;qS.Ts=zT;qS.Us=2;qS.Vs=19;qS.Ws=QS;qS.Xs=31;qS.Ys=5;qS.Zs=0;qS.$s=yT;qS._s=8;qS.at=lT;qS.bt=4;qS.ct=7;qS.dt=7;qS.et=30720;qS.ft=4;qS.gt=11;qS.ht=8;qS.it=2;qS.jt=ET;qS.kt=16;qS.lt=1572960;qS.mt=21;qS.nt=RS;qS.ot=32;qS.pt=64;qS.qt=AT;qS.rt=3;qS.st=15;qS.tt=96;qS.ut=2;qS.vt=5;qS.wt=1572991;qS.xt=1;qS.yt=4;qS.zt=26;qS.At=128;qS.Bt=64;qS.Ct=2;qS.Dt=9;qS.Et=127;qS.Ft=32;qS.Gt=1;qS.Ht=4;qS.It=17;qS.Jt=458752;qS.Kt=uT;qS.Lt=VS;qS.Mt=ET;qS.Nt=KT;qS.Ot=US;qS.Pt=196608;qS.Qt=0;qS.Rt=327680;qS.St=6;qS.Tt=5;qS.Ut=32;qS.Vt=0;qS.Wt=1;qS.Xt=2;qS.Yt=8;qS.Zt=128;qS.$t=1;qS._t=4;qS.au=2;qS.bu=32;qS.cu=64;qS.du=16;qS.eu=252;qS.fu=15;qS.gu=1;qS.hu=0;qS.iu=7;qS.ju=3;qS.ku=47;qS.lu=79;qS.mu=31;qS.nu=190;qS.ou=16;hS.NE=$I(34);qS.nz=function nz(a,b){this.a=new pS.ir(new zS.kI(a),b)};pH(156,1,{},qS.nz);_.getField=function oz(a){var b,c;c=pS.fr(this.a);for(b=0;b<c.length;b++){if(iS.uK(c[b],a)){return pS.er(this.a,b)}}return null};_.getFieldData=function pz(a){return pS.er(this.a,a)};_.getFieldNames=function qz(a){return pS.gr(this.a,a)};_.getMolecule=function rz(){return new qS.uu(pS.hr(this.a))};_.getNextFieldData=function sz(){var a;return a=this.a.a.a,a};_.getNextMolFile=function tz(){var a;return a=this.a.f.a,a};_.next=function uz(){return pS.br(this.a)};hS.OE=$I(156);qS.vz=function vz(a){a.a=new mS.Kn};qS.wz=function wz(a,b){mS.Dn(a.a,b.a)};qS.xz=function xz(a,b){mS.En(a.a,b.a)};qS.yz=function yz(){qS.vz(this)};pH(158,1,{},qS.yz);_.isFragmentInMolecule=function zz(){return mS.yn(this.a)};_.setFragment=function Az(a){qS.wz(this,a)};_.setMol=function Bz(a,b){mS.En(this.a,b.a);mS.Dn(this.a,a.a)};_.setMolecule=function Cz(a){qS.xz(this,a)};hS.QE=$I(158);qS.Dz=function Dz(a){a.a=new mS.Wn};qS.Ez=function Ez(){qS.Dz(this)};qS.Fz=function Fz(a){return mS.Xn(a)};qS.Hz=function Hz(a){return mS.Yn(a)};qS.Iz=function Iz(a){return mS.Zn(a)};qS.Jz=function Jz(){return mS.Pn(),mS.Nn};qS.Kz=function Kz(a,b){return mS.$n(a,b)};qS.Lz=function Lz(a,b){return mS._n(a,b)};pH(159,1,{},qS.Ez);_.createIndex=function Gz(a){return mS.Qn(this.a,a.a)};_.isFragmentInMolecule=function Mz(){return mS.Sn(this.a)};_.setFragment=function Nz(a,b){mS.Un(this.a,a.a,b)};_.setMolecule=function Oz(a,b){mS.Vn(this.a,a.a,b)};hS.PE=$I(159);qS.Pz=function Pz(){};qS.Qz=function Qz(a,b){b=b||{};var c=(typeof b.maxSphereSize===xU?5:b.maxSphereSize)|0;var d=(typeof b.type===xU?0:b.type)|0;return nS.op(a,c,d)};pH(160,1,{},qS.Pz);hS.RE=$I(160);qS.Rz=function Rz(a){mS.fm();mS.jm.call(this,a)};pH(115,116,{},qS.Rz);qH(_,{absoluteWeight:{'get':function Sz(){return mS.gm(this)}}});qH(_,{formula:{'get':function Tz(){return mS.hm(this)}}});qH(_,{relativeWeight:{'get':function Uz(){return mS.im(this)}}});hS.SE=$I(115);qS.Wz=function Wz(a){};qS.Xz=function Xz(a){!a.a&&(a.a=new oS.oq);return a.a};qS.Yz=function Yz(a,b){if(b){!a.c&&(a.c=new mS.Zl(true));return a.c}else{!a.b&&(a.b=new mS.Zl(false));return a.b}};qS.Zz=function Zz(a){!a.d&&(a.d=new mS.Lm);return a.d};qS.$z=function $z(a){!a.e&&(a.e=new mS.Wn);return a.e};qS._z=function _z(a){!a.f&&(a.f=new mS.vo);return a.f};qS.aA=function aA(a){!a.g&&(a.g=new mS.Fo);return a.g};qS.bA=function bA(){qS.Wz(this)};pH(113,1,{},qS.bA);_.a=null;_.b=null;_.c=null;_.d=null;_.e=null;_.f=null;_.g=null;qS.Vz=null;hS.TE=$I(113);qS.cA=function cA(a){if(!a)return 0;var b=0;a.inflateToMaxAVBL&&(b|=US);a.inflateToHighResAVBL&&(b|=KT);a.chiralTextBelowMolecule&&(b|=0);a.chiralTextAboveMolecule&&(b|=ET);a.chiralTextOnFrameTop&&(b|=QS);a.chiralTextOnFrameBottom&&(b|=786432);a.noTabus&&(b|=1);a.showAtomNumber&&(b|=2);a.showBondNumber&&(b|=4);a.highlightQueryFeatures&&(b|=8);a.showMapping&&(b|=16);a.suppressChiralText&&(b|=32);a.suppressCIPParity&&(b|=64);a.suppressESR&&(b|=128);a.showSymmetrySimple&&(b|=256);a.showSymmetryDiastereotopic&&(b|=512);a.showSymmetryEnantiotopic&&(b|=mT);a.noImplicitAtomLabelColors&&(b|=kT);a.noStereoProblem&&(b|=jT);return b};rS.dA=function dA(a,b){var c;c=a-b;c>=hT?(c-=gT):c<ZT&&(c+=gT);return c};rS.fA=function fA(){rS.fA=rH;rS.eA=YC(KC(hS.PD,1),HT,5,15,[0.29899999499320984,0.5870000123977661,0.11400000005960464])};rS.gA=function gA(a,b){var c,d,e,f,g,h,i,j,k;c=xS.FH(a);h=!a?1:(rS.eA[0]*(a.c>>16&255)+rS.eA[1]*(a.c>>8&255)+rS.eA[2]*(a.c&255))/255;if(h==0)return new xS.GH(h,h,h,c[3]);d=b/(!a?1:(rS.eA[0]*(a.c>>16&255)+rS.eA[1]*(a.c>>8&255)+rS.eA[2]*(a.c&255))/255);k=0;j=0;for(f=0;f<3;f++){c[f]*=d;if(c[f]<1){j+=rS.eA[f]}else{k+=(c[f]-1)*rS.eA[f];c[f]=1}}if(k!=0){i=0;for(g=0;g<3;g++){if(c[g]<1){c[g]+=k/j;if(c[g]>1){i+=(c[g]-1)*rS.eA[g];c[g]=1}}}if(i!=0){for(e=0;e<3;e++){if(c[e]<1){c[e]+=i/rS.eA[e];c[e]>1&&(c[e]=1)}}}}return new xS.GH(c[0],c[1],c[2],c[3])};rS.hA=function hA(a,b){rS.fA();var c,d,e,f,g,h,i,j,k,l,m;c=!b?1:(rS.eA[0]*(b.c>>16&255)+rS.eA[1]*(b.c>>8&255)+rS.eA[2]*(b.c&255))/255;g=!a?1:(rS.eA[0]*(a.c>>16&255)+rS.eA[1]*(a.c>>8&255)+rS.eA[2]*(a.c&255))/255;e=$wnd.Math.abs(c-g);if(e>aT)return a;h=QC(hS.PD,HT,5,3,15,1);xS.DH();xS.KH((b.c>>16&255)/255,(b.c>>8&255)/255,(b.c&255)/255,h);i=QC(hS.PD,HT,5,3,15,1);xS.KH((a.c>>16&255)/255,(a.c>>8&255)/255,(a.c&255)/255,i);j=$wnd.Math.abs(i[0]-h[0]);j>0.5&&(j=1-j);m=1-$wnd.Math.max(i[1],h[1]);d=$wnd.Math.abs(g+c-1);k=$wnd.Math.cos(hT*j*3);l=aT*$wnd.Math.max(m,$wnd.Math.max(d,k));if(e>l)return a;f=g>c?g+l>1:g-l>0;return rS.gA(a,f?c-l:c+l)};rS.iA=function iA(a,b){rS.fA();return new xS.IH(LD((a.c>>16&255)+aT*((b.c>>16&255)-(a.c>>16&255))),LD((a.c>>8&255)+aT*((b.c>>8&255)-(a.c>>8&255))),LD((a.c&255)+aT*((b.c&255)-(a.c&255))))};rS.jA=function jA(a,b){return rS.kA(a,b)};rS.kA=function kA(a,b){var c;if(a==null)return b==null?0:1;if(b==null)return -1;for(c=0;c<a.length;c++){if(b.length==c)return 1;if(a[c]!==b[c])return a[c]<b[c]?-1:1}return b.length>a.length?-1:0};rS.lA=function lA(){};pH(89,1,HT,rS.lA);_.eb=function mA(a,b){return rS.jA(a,b)};_.ab=function nA(a){return this===a};hS.UE=$I(89);kS.OA=function OA(a){iS.MA.call(this,a)};pH(130,50,TS);hS.YE=$I(130);jS.QA=function QA(){jS.QA=rH;jS.PA=new sc};jS.RA=function RA(a){a.a=''};jS.SA=function SA(a){var b;if(a.c==null){b=KD(a.b)===KD(jS.PA)?null:a.b;a.d=b==null?PS:FD(b)?jS.XA(b):HD(b)?'String':iS.UI(iS.wc(b));a.a=a.a+': '+(FD(b)?jS.WA(b):b+'');a.c='('+a.d+') '+a.a}};jS.TA=function TA(a){return KD(a.b)===KD(jS.PA)?null:a.b};jS.UA=function UA(a){jS.QA();jS.VA.call(this,a)};jS.VA=function VA(a){kS.OA.call(this,a);jS.RA(this);this.b=a;this.a=''};jS.WA=function WA(a){return a==null?null:a.message};jS.XA=function XA(a){return a==null?null:a.name};pH(62,130,{62:1,4:1,12:1,14:1},jS.UA);_.lb=function YA(){jS.SA(this);return this.c};_.nb=function ZA(){return jS.TA(this)};hS.VE=$I(62);jS.hB=function hB(b,a){return b[a]};jS.iB=function iB(a){return a.length};jS.jB=function jB(b,a){b[b.length]=a};jS.kB=function kB(b,a){return b[a]};jS.lB=function lB(a){return a.length};jS.mB=function mB(){if(Date.now){return Date.now()}return (new Date).getTime()};pH(153,1,{});hS.XE=$I(153);kS.qB=function qB(){kS.qB=rH;!!(kS.LB(),kS.KB)};kS.rB=function rB(a,b,c){return a.apply(b,c);var d};kS.sB=function sB(){var a;if(nB!=0){a=jS.mB();if(a-oB>2000){oB=a;pB=kS.zB()}}if(nB++==0){kS.CB((kS.BB(),kS.AB));return true}return false};function tB(b){kS.qB();return function(){return kS.uB(b,this,arguments);var a}}
kS.uB=function uB(a,b,c){var d;d=kS.sB();try{return kS.rB(a,b,c)}finally{kS.vB(d)}};kS.vB=function vB(a){a&&kS.DB((kS.BB(),kS.AB));--nB;if(a){if(pB!=-1){kS.xB(pB);pB=-1}}};kS.wB=function wB(a){kS.qB();$wnd.setTimeout(function(){throw a},0)};kS.xB=function xB(a){$wnd.clearTimeout(a)};kS.yB=function yB(){nB!=0&&(nB=0);pB=-1};kS.zB=function zB(){return $wnd.setTimeout(kS.yB,10)};var nB=0;var oB=0;var pB=-1;kS.BB=function BB(){kS.BB=rH;kS.AB=new kS.EB};kS.CB=function CB(a){var b,c;if(a.a){c=null;do{b=a.a;a.a=null;c=kS.GB(b,c)}while(a.a);a.a=c}};kS.DB=function DB(a){var b,c;if(a.b){c=null;do{b=a.b;a.b=null;c=kS.GB(b,c)}while(a.b);a.b=c}};kS.EB=function EB(){};kS.FB=function FB(a,b){!a&&(a=jS.dB());jS.jB(a,b);return a};kS.GB=function GB(b,c){var d,e,f,g;for(e=0,f=jS.iB(b);e<f;e++){g=jS.hB(b,e);try{kS.JB(g)?kS.HB(g).Lb()&&(c=kS.FB(c,g)):kS.IB(g).Lb()}catch(a){a=IG(a);if(CD(a,14)){d=a;kS.qB();kS.wB(CD(d,62)?d.nb():d)}else throw JG(a)}}return c};pH(147,153,{},kS.EB);hS.ZE=$I(147);kS.HB=function HB(a){return a[0]};kS.IB=function IB(a){return a[0]};kS.JB=function JB(a){return a[1]};sS.dC=function dC(a){return a.compatMode};sS.eC=function eC(){return $doc};tS.fC=function fC(){return ['USD','US$',2,'US$','$']};tS.hC=function hC(){tS.hC=rH;tS.gC=new tS.jC};tS.iC=function iC(a){!a.a&&(a.a=new uS.EC);return a.a};tS.jC=function jC(){};pH(149,1,{},tS.jC);hS.cF=$I(149);tS.kC=function kC(){tS.kC=rH;tS.iC((tS.hC(),tS.hC(),tS.gC))};tS.lC=function lC(a){};tS.mC=function mC(a,b){var c,d;b.a+='E';if(a.e<0){a.e=-a.e;b.a+='-'}c=''+a.e;for(d=iS.IK(c).length;d<a.k;++d){b.a+='0'}b.a+=c};tS.nC=function nC(a,b,c){if(a.d==0){b.a=iS.EK(b.a,0,0)+'0'+iS.DK(b.a,0);++a.b;++a.d}if(a.b<a.d||a.c){iS.SK(b,a.b,String.fromCharCode(c));++a.d}};tS.oC=function oC(a,b){var c,d;c=a.b+a.n;if(a.d<c){while(a.d<c){b.a+='0';++a.d}}else{d=a.b+a.i;d>a.d&&(d=a.d);while(d>c&&iS.oK(b.a,d-1)==48){--d}if(d<a.d){iS.RK(b,d,a.d);a.d=d}}};tS.pC=function pC(a,b){var c,d;d=0;while(d<a.d-1&&iS.oK(b.a,d)==48){++d}if(d>0){b.a=iS.EK(b.a,0,0)+''+iS.DK(b.a,d);a.d-=d;a.e-=d}if(a.j>a.o&&a.j>0){a.e+=a.b-1;c=a.e%a.j;c<0&&(c+=a.j);a.b=c+1;a.e-=c}else{a.e+=a.b-a.o;a.b=a.o}if(a.d==1&&iS.oK(b.a,0)==48){a.e=0;a.b=a.o}};tS.qC=function qC(a,b){var c,d,e,f;if(lS.MR(b)){return 'NaN'}d=b<0||b==0&&1/b<0;d&&(b=-b);c=new iS.TK;if(!lS.MR(b)&&!lS.LR(b)){iS.QK(c,d?a.q:a.t);c.a+='\u221E';iS.QK(c,d?a.r:a.u);return c.a}b*=a.p;f=tS.DC(c,b);e=iS.IK(c.a).length+f+a.i+3;if(e>0&&e<iS.IK(c.a).length&&iS.oK(c.a,e)==57){tS.yC(a,c,e-1);f+=iS.IK(c.a).length-e;iS.RK(c,e,iS.IK(c.a).length)}tS.rC(a,d,c,f);return c.a};tS.rC=function rC(a,b,c,d){var e,f,g,h,i;if(a.g){f=iS.IK('.').charCodeAt(0);g=iS.IK(',').charCodeAt(0)}else{f=iS.IK('.').charCodeAt(0);g=iS.IK(',').charCodeAt(0)}a.e=0;a.d=iS.IK(c.a).length;a.b=a.d+d;h=a.v;e=a.f;a.b>mT&&(h=true);h&&tS.pC(a,c);tS.xC(a,c);tS.zC(a,c);tS.sC(a,c,g,e);tS.oC(a,c);tS.nC(a,c,f);h&&tS.mC(a,c);i=iS.IK('0').charCodeAt(0);i!=48&&tS.tC(c,i);iS.SK(c,0,b?a.q:a.t);iS.QK(c,b?a.r:a.u)};tS.sC=function sC(a,b,c,d){var e;if(d>0){for(e=d;e<a.b;e+=d+1){iS.SK(b,a.b-e,String.fromCharCode(c));++a.b;++a.d}}};tS.tC=function tC(a,b){var c,d,e;e=iS.IK(a.a).length;for(d=0;d<e;++d){c=iS.oK(a.a,d);c>=48&&c<=57&&iS.nI(a,d,c-48+b&VS)}};tS.uC=function uC(a,b,c,d,e){var f,g,h,i;iS.RK(d,0,iS.IK(d.a).length);g=false;h=iS.IK(b).length;for(i=c;i<h;++i){f=iS.IK(b).charCodeAt(i);if(f==39){if(i+1<h&&iS.IK(b).charCodeAt(i+1)==39){++i;d.a+="'"}else{g=!g}continue}if(g){d.a+=String.fromCharCode(f)}else{switch(f){case 35:case 48:case 44:case 46:case 59:return i-c;case 164:a.g=true;if(i+1<h&&iS.IK(b).charCodeAt(i+1)==164){++i;if(i<h-2&&iS.IK(b).charCodeAt(i+1)==164&&iS.IK(b).charCodeAt(i+2)==164){i+=2;iS.QK(d,vS.IC(a.a))}else{iS.QK(d,vS.FC(a.a))}}else{iS.QK(d,vS.GC(a.a))}break;case 37:if(!e){if(a.p!=1){throw JG(new iS.QJ(zU+b+'"'))}a.p=100}d.a+='%';break;case 8240:if(!e){if(a.p!=1){throw JG(new iS.QJ(zU+b+'"'))}a.p=1000}d.a+='\u2030';break;case 45:d.a+='-';break;default:d.a+=String.fromCharCode(f);}}}return h-c};tS.vC=function vC(a,b){var c,d;d=0;c=new iS.TK;d+=tS.uC(a,b,0,c,false);a.t=c.a;d+=tS.wC(a,b,d,false);d+=tS.uC(a,b,d,c,false);a.u=c.a;if(d<iS.IK(b).length&&iS.IK(b).charCodeAt(d)==59){++d;d+=tS.uC(a,b,d,c,true);a.q=c.a;d+=tS.wC(a,b,d,true);d+=tS.uC(a,b,d,c,true);a.r=c.a}else{a.q='-'+a.t;a.r=a.u}};tS.wC=function wC(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p;f=-1;g=0;p=0;h=0;j=-1;k=iS.IK(b).length;n=c;l=true;for(;n<k&&l;++n){e=iS.IK(b).charCodeAt(n);switch(e){case 35:p>0?++h:++g;j>=0&&f<0&&++j;break;case 48:if(h>0){throw JG(new iS.QJ("Unexpected '0' in pattern \""+b+'"'))}++p;j>=0&&f<0&&++j;break;case 44:j=0;break;case 46:if(f>=0){throw JG(new iS.QJ('Multiple decimal separators in pattern "'+b+'"'))}f=g+p+h;break;case 69:if(!d){if(a.v){throw JG(new iS.QJ('Multiple exponential symbols in pattern "'+b+'"'))}a.v=true;a.k=0}while(n+1<k&&iS.IK(b).charCodeAt(n+1)==48){++n;d||++a.k}if(!d&&g+p<1||a.k<1){throw JG(new iS.QJ('Malformed exponential pattern "'+b+'"'))}l=false;break;default:--n;l=false;}}if(p==0&&g>0&&f>=0){m=f;f==0&&++m;h=g-m;g=m-1;p=1}if(f<0&&h>0||f>=0&&(f<g||f>g+p)||j==0){throw JG(new iS.QJ('Malformed pattern "'+b+'"'))}if(d){return n-c}o=g+p+h;a.i=f>=0?o-f:0;if(f>=0){a.n=g+p-f;a.n<0&&(a.n=0)}i=f>=0?f:o;a.o=i-g;if(a.v){a.j=g+a.o;a.i==0&&a.o==0&&(a.o=1)}a.f=j>0?j:0;a.c=f==0||f==o;return n-c};tS.xC=function xC(a,b){var c,d,e;if(a.b>a.d){while(a.d<a.b){b.a+='0';++a.d}}if(!a.v){if(a.b<a.o){d=new iS.TK;while(a.b<a.o){d.a+='0';++a.b;++a.d}iS.SK(b,0,d.a)}else if(a.b>a.o){e=a.b-a.o;for(c=0;c<e;++c){if(iS.oK(b.a,c)!=48){e=c;break}}if(e>0){b.a=iS.EK(b.a,0,0)+''+iS.DK(b.a,e);a.d-=e;a.b-=e}}}};tS.yC=function yC(a,b,c){var d,e;d=true;while(d&&c>=0){e=iS.oK(b.a,c);if(e==57){iS.nI(b,c--,48)}else{iS.nI(b,c,e+1&VS);d=false}}if(d){b.a=iS.EK(b.a,0,0)+'1'+iS.DK(b.a,0);++a.b;++a.d}};tS.zC=function zC(a,b){var c;if(a.d>a.b+a.i&&iS.lI(b,a.b+a.i)>=53){c=a.b+a.i-1;tS.yC(a,b,c)}};tS.AC=function AC(a,b,c){tS.lC(this);if(!b){throw JG(new iS.QJ('Unknown currency code'))}this.s=a;this.a=b;tS.vC(this,this.s);if(!c&&this.g){this.n=vS.HC(this.a)&7;this.i=this.n}};tS.BC=function BC(a,b){tS.kC();tS.AC.call(this,a,b,true)};tS.CC=function CC(a,b){return a.toPrecision(b)};tS.DC=function DC(a,b){var c,d,e,f,g;g=iS.IK(a.a).length;iS.QK(a,tS.CC(b,20));f=0;e=iS.zK(a.a,'e',g);e<0&&(e=iS.zK(a.a,'E',g));if(e>=0){d=e+1;d<iS.IK(a.a).length&&iS.oK(a.a,d)==43&&++d;d<iS.IK(a.a).length&&(f=iS.qJ(iS.DK(a.a,d)));iS.RK(a,e,iS.IK(a.a).length)}c=iS.zK(a.a,'.',g);if(c>=0){a.a=iS.EK(a.a,0,c)+''+iS.DK(a.a,c+1);f-=iS.IK(a.a).length-c}return f};pH(110,1,{},tS.BC);_.b=0;_.c=false;_.d=0;_.e=0;_.f=3;_.g=false;_.i=3;_.j=40;_.k=0;_.n=0;_.o=1;_.p=1;_.q='-';_.r='';_.t='';_.u='';_.v=false;hS.dF=$I(110);uS.EC=function EC(){};pH(151,1,{},uS.EC);hS.eF=$I(151);vS.FC=function FC(a){return a[0]};vS.GC=function GC(a){return a[1]};vS.HC=function HC(a){return a[2]};vS.IC=function IC(a){return a[4]||a[1]};hS.$C=function $C(a){var b,c,d;b=a&jU;c=a>>22&jU;d=a<0?AU:0;return hS._C(b,c,d)};hS._C=function _C(a,b,c){return {l:a,m:b,h:c}};hS.aD=function aD(a){return a.h};hS.bD=function bD(a){return a.l};hS.cD=function cD(a){return a.m};hS.dD=function dD(a){var b,c,d;b=~hS.bD(a)+1&jU;c=~hS.cD(a)+(b==0?1:0)&jU;d=~hS.aD(a)+(b==0&&c==0?1:0)&AU;hS.fD(a,b);hS.gD(a,c);hS.eD(a,d)};hS.eD=function eD(a,b){a.h=b};hS.fD=function fD(a,b){a.l=b};hS.gD=function gD(a,b){a.m=b};hS.hD=function hD(a){return hS.bD(a)+hS.cD(a)*BU+hS.aD(a)*CU};hS.iD=function iD(a,b){var c,d,e;c=hS.bD(a)+hS.bD(b);d=hS.cD(a)+hS.cD(b)+(c>>22);e=hS.aD(a)+hS.aD(b)+(d>>22);return hS._C(c&jU,d&jU,e&AU)};hS.jD=function jD(a,b){return hS._C(hS.bD(a)&hS.bD(b),hS.cD(a)&hS.cD(b),hS.aD(a)&hS.aD(b))};hS.kD=function kD(a,b){var c,d,e,f,g,h,i,j;i=hS.aD(a)>>19;j=hS.aD(b)>>19;if(i!=j){return j-i}e=hS.aD(a);h=hS.aD(b);if(e!=h){return e-h}d=hS.cD(a);g=hS.cD(b);if(d!=g){return d-g}c=hS.bD(a);f=hS.bD(b);return c-f};hS.lD=function lD(a){var b,c,d,e,f;if(lS.MR(a)){return hS.wD(),hS.vD}if(a<-9223372036854775808){return hS.wD(),hS.uD}if(a>=9223372036854775807){return hS.wD(),hS.tD}e=false;if(a<0){e=true;a=-a}d=0;if(a>=CU){d=LD(a/CU);a-=d*CU}c=0;if(a>=BU){c=LD(a/BU);a-=c*BU}b=LD(a);f=hS._C(b,c,d);e&&hS.dD(f);return f};hS.mD=function mD(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G;c=hS.bD(a)&8191;d=hS.bD(a)>>13|(hS.cD(a)&15)<<9;e=hS.cD(a)>>4&8191;f=hS.cD(a)>>17|(hS.aD(a)&255)<<5;g=(hS.aD(a)&1048320)>>8;h=hS.bD(b)&8191;i=hS.bD(b)>>13|(hS.cD(b)&15)<<9;j=hS.cD(b)>>4&8191;k=hS.cD(b)>>17|(hS.aD(b)&255)<<5;l=(hS.aD(b)&1048320)>>8;B=c*h;C=d*h;D=e*h;F=f*h;G=g*h;if(i!=0){C+=c*i;D+=d*i;F+=e*i;G+=f*i}if(j!=0){D+=c*j;F+=d*j;G+=e*j}if(k!=0){F+=c*k;G+=d*k}l!=0&&(G+=c*l);n=B&jU;o=(C&511)<<13;m=n+o;q=B>>22;r=C>>9;s=(D&262143)<<4;t=(F&31)<<17;p=q+r+s+t;v=D>>18;w=F>>5;A=(G&4095)<<8;u=v+w+A;p+=m>>22;m&=jU;u+=p>>22;p&=jU;u&=AU;return hS._C(m,p,u)};hS.nD=function nD(a){var b,c,d;b=~hS.bD(a)+1&jU;c=~hS.cD(a)+(b==0?1:0)&jU;d=~hS.aD(a)+(b==0&&c==0?1:0)&AU;return hS._C(b,c,d)};hS.oD=function oD(a,b){return hS._C(hS.bD(a)|hS.bD(b),hS.cD(a)|hS.cD(b),hS.aD(a)|hS.aD(b))};hS.pD=function pD(a,b){var c,d,e;b&=63;if(b<22){c=hS.bD(a)<<b;d=hS.cD(a)<<b|hS.bD(a)>>22-b;e=hS.aD(a)<<b|hS.cD(a)>>22-b}else if(b<44){c=0;d=hS.bD(a)<<b-22;e=hS.cD(a)<<b-22|hS.bD(a)>>44-b}else{c=0;d=0;e=hS.bD(a)<<b-44}return hS._C(c&jU,d&jU,e&AU)};hS.qD=function qD(a,b){var c,d,e,f,g;b&=63;c=hS.aD(a);d=(c&QS)!=0;d&&(c|=-1048576);if(b<22){g=c>>b;f=hS.cD(a)>>b|c<<22-b;e=hS.bD(a)>>b|hS.cD(a)<<22-b}else if(b<44){g=d?AU:0;f=c>>b-22;e=hS.cD(a)>>b-22|c<<44-b}else{g=d?AU:0;f=d?jU:0;e=c>>b-44}return hS._C(e&jU,f&jU,g&AU)};hS.rD=function rD(a){if(hS.kD(a,(hS.wD(),hS.vD))<0){return -hS.hD(hS.nD(a))}return hS.bD(a)+hS.cD(a)*BU+hS.aD(a)*CU};hS.sD=function sD(a){return hS.bD(a)|hS.cD(a)<<22};hS.wD=function wD(){hS.wD=rH;hS.tD=hS._C(jU,jU,524287);hS.uD=hS._C(0,0,QS);hS.$C(1);hS.$C(2);hS.vD=hS.$C(0)};function KG(a,b){var c;if(hS.XG(a)&&hS.XG(b)){c=hS.NG(hS.OG(a))+hS.NG(hS.OG(b));if(DU<c&&c<CU){return hS.TG(c)}}return hS.SG(hS.iD(hS.XG(a)?hS.cH(hS.OG(a)):hS.MG(a),hS.XG(b)?hS.cH(hS.OG(b)):hS.MG(b)))}
function LG(a,b){return hS.SG(hS.jD(hS.XG(a)?hS.cH(hS.OG(a)):hS.MG(a),hS.XG(b)?hS.cH(hS.OG(b)):hS.MG(b)))}
hS.MG=function MG(a){return a};hS.NG=function NG(a){return a};hS.OG=function OG(a){return a};hS.PG=function PG(a){return a|0};function QG(a,b){var c;if(hS.XG(a)&&hS.XG(b)){c=hS.NG(hS.OG(a))-hS.NG(hS.OG(b));if(!lS.MR(c)){return c}}return hS.kD(hS.XG(a)?hS.cH(hS.OG(a)):hS.MG(a),hS.XG(b)?hS.cH(hS.OG(b)):hS.MG(b))}
hS.RG=function RG(a){return a};hS.SG=function SG(a){var b;b=hS.aD(a);if(b==0){return hS.TG(hS.bD(a)+hS.cD(a)*BU)}if(b==AU){return hS.TG(hS.bD(a)+hS.cD(a)*BU-CU)}return hS.RG(a)};hS.TG=function TG(a){return a};function UG(a,b){return QG(a,b)==0}
function VG(a){if(DU<a&&a<CU){return hS.TG(a<0?$wnd.Math.ceil(a):$wnd.Math.floor(a))}return hS.SG(hS.lD(a))}
function WG(a){return hS.TG(a)}
hS.XG=function XG(a){return typeof a===KS};function YG(a,b){return QG(a,b)<0}
function ZG(a,b){var c;if(hS.XG(a)&&hS.XG(b)){c=hS.NG(hS.OG(a))*hS.NG(hS.OG(b));if(DU<c&&c<CU){return hS.TG(c)}}return hS.SG(hS.mD(hS.XG(a)?hS.cH(hS.OG(a)):hS.MG(a),hS.XG(b)?hS.cH(hS.OG(b)):hS.MG(b)))}
function $G(a,b){return QG(a,b)!=0}
function _G(a,b){return hS.SG(hS.oD(hS.XG(a)?hS.cH(hS.OG(a)):hS.MG(a),hS.XG(b)?hS.cH(hS.OG(b)):hS.MG(b)))}
function aH(a,b){return hS.SG(hS.pD(hS.XG(a)?hS.cH(hS.OG(a)):hS.MG(a),b))}
function bH(a,b){return hS.SG(hS.qD(hS.XG(a)?hS.cH(hS.OG(a)):hS.MG(a),b))}
hS.cH=function cH(a){var b,c,d,e;e=hS.NG(a);d=0;if(e<0){e+=CU;d=AU}c=LD(e/BU);b=LD(e-c*BU);return hS._C(b,c,d)};function dH(a){var b;if(hS.XG(a)){b=hS.NG(hS.OG(a));return b==-0.?0:b}return hS.rD(hS.MG(a))}
function eH(a){if(hS.XG(a)){return hS.PG(hS.NG(hS.OG(a)))}return hS.sD(hS.MG(a))}
function xH(){wS.yH()}
wS.yH=function yH(){var a,b,c;b=sS.dC(sS.eC());a=YC(KC(hS.OF,1),NT,2,6,[EU]);for(c=0;c<a.length;c++){if(iS.uK(a[c],b)){return}}a.length==1&&iS.uK(EU,a[0])&&iS.uK('BackCompat',b)?"GWT no longer supports Quirks Mode (document.compatMode=' BackCompat').<br>Make sure your application's host HTML page has a Standards Mode (document.compatMode=' CSS1Compat') doctype,<br>e.g. by using &lt;!doctype html&gt; at the start of your application's HTML page.<br><br>To continue using this unsupported rendering mode and risk layout problems, suppress this message by adding<br>the following line to your*.gwt.xml module file:<br>&nbsp;&nbsp;&lt;extend-configuration-property name=\"document.compatMode\" value=\""+b+'"/&gt;':"Your *.gwt.xml module configuration prohibits the use of the current document rendering mode (document.compatMode=' "+b+"').<br>Modify your application's host HTML page doctype, or update your custom "+"'document.compatMode' configuration property settings."};xS.DH=function DH(){xS.DH=rH;xS.CH=new xS.IH(255,255,255);xS.zH=xS.CH;xS.BH=new xS.IH(128,128,128);xS.AH=new xS.IH(0,0,0)};xS.EH=function EH(a){};xS.FH=function FH(a){var b;b=QC(hS.PD,HT,5,4,15,1);if(a.b==null){b[0]=(a.c>>16&255)/255;b[1]=(a.c>>8&255)/255;b[2]=(a.c&255)/255;b[3]=(a.c>>24&255)/255}else{b[0]=a.b[0];b[1]=a.b[1];b[2]=a.b[2];b[3]=a.a}return b};xS.GH=function GH(a,b,c,d){xS.DH();xS.JH.call(this,LD(a*255+0.5),LD(b*255+0.5),LD(c*255+0.5),LD(d*255+0.5));this.b=QC(hS.PD,HT,5,3,15,1);this.b[0]=a;this.b[1]=b;this.b[2]=c;this.a=d};xS.HH=function HH(a){xS.DH();xS.EH(this);this.c=IT|a};xS.IH=function IH(a,b,c){xS.DH();xS.JH.call(this,a,b,c,255)};xS.JH=function JH(a,b,c,d){xS.EH(this);this.c=(d&255)<<24|(a&255)<<16|(b&255)<<8|c&255};xS.KH=function KH(a,b,c,d){xS.DH();var e,f,g,h,i;i=0;h=$wnd.Math.min(a,$wnd.Math.min(b,c));g=$wnd.Math.max(a,$wnd.Math.max(b,c));e=g-h;if(e==0){f=0;d[0]=f;d[1]=i;d[2]=h;return d}if(g!=0)i=e/g;else{i=0;f=0;d[0]=f;d[1]=i;d[2]=g;return d}a==g?(f=(b-c)/e):b==g?(f=2+(c-a)/e):(f=4+(a-b)/e);f*=60;f<0&&(f+=360);d[0]=f/360;d[1]=i;d[2]=g;return d};pH(20,1,{},xS.GH,xS.HH,xS.IH);_.a=0;_.b=null;_.c=0;hS.fF=$I(20);xS.NH=function NH(){xS.NH=rH;xS.MH=YC(KC(hS.OD,1),bT,5,15,[5.55,15,15,15,15,15,15,15,15,FU,FU,FU,FU,FU,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,FU,FU,7.1,GU,GU,17.78,HU,3.82,6.66,6.66,7.78,11.68,FU,6.66,FU,FU,GU,GU,GU,GU,GU,GU,GU,GU,GU,GU,FU,FU,11.68,11.68,11.68,GU,20.3,HU,HU,IU,IU,HU,12.22,15.56,IU,FU,10,HU,GU,16.66,IU,15.56,HU,15.56,IU,HU,12.22,IU,HU,18.88,HU,HU,12.22,FU,FU,FU,9.38,GU,6.66,GU,GU,10,GU,GU,FU,GU,GU,4.44,4.44,10,4.44,16.66,GU,GU,GU,GU,6.66,10,FU,GU,10,IU,10,10,10,6.68,5.2,6.68,11.68,10.5])};xS.OH=function OH(a,b){var c,d,e,f,g;if(iS.uK(a.a,'Helvetica')){f=0;for(d=0,e=iS.IK(b).length;d<e;d++){c=iS.IK(b).charCodeAt(d);f+=(c<128?(g=xS.MH[c]):(g=FU),g*a.b/20)}return f}else{return xS.PH(a,b)}};xS.PH=function PH(e,a){var b=xS.LH;if(!b){b=$doc.createElement('canvas');xS.LH=b}var c=''+e.b+'px '+e.a;var d=b.getContext('2d');d.font=c;var a=d.measureText(a);return a.width};xS.QH=function QH(a){xS.NH();this.a='Helvetica';this.b=a};pH(108,1,{},xS.QH);_.b=0;xS.LH=null;hS.gF=$I(108);pH(95,1,{95:1});_.ab=function RH(a){var b;if(this===a)return true;if(CD(a,36)){b=a;return this.a==b.a&&this.b==b.b}return this===a};_.cb=function SH(){var a;a=this.a+this.b;return LD(a)*37};hS.iF=$I(95);yS.TH=function TH(){};yS.UH=function UH(a,b){this.a=a;this.b=b};pH(36,95,{95:1,36:1,4:1},yS.TH,yS.UH);_.a=0;_.b=0;hS.hF=$I(36);yS.VH=function VH(a,b){return yS.YH(a,b.c,b.d,b.b,b.a)};yS.WH=function WH(a,b,c,d,e){var f;if(d<b){f=b;b=d;d=f}if(e<c){f=c;c=e;e=f}yS.cI(a,b,c,d-b,e-c)};pH(172,1,{});hS.lF=$I(172);
yS.XH=function XH(a,b,c){var d,e;d=a.c;e=a.d;return b>=d&&c>=e&&b<d+a.b&&c<e+a.a};yS.YH=function YH(a,b,c,d,e){var f,g;if(a.b<=0||a.a<=0||d<=0||e<=0){return false}f=a.c;g=a.d;return b>=f&&c>=g&&b+d<=f+a.b&&c+e<=g+a.a};yS.aI=function aI(a,b,c){var d,e,f,g;d=$wnd.Math.min(a.c,b.c);f=$wnd.Math.min(a.d,b.d);e=$wnd.Math.max(a.c+a.b,b.c+b.b);g=$wnd.Math.max(a.d+a.a,b.d+b.a);yS.WH(c,d,f,e,g)};pH(96,172,{96:1});_.ab=function ZH(a){var b;if(a===this){return true}if(CD(a,15)){b=a;return this.c==b.c&&this.d==b.d&&this.b==b.b&&this.a==b.a}return false};_.cb=function _H(){var a;a=BJ(this.c);a=KG(a,ZG(BJ(this.d),37));a=KG(a,ZG(BJ(this.b),43));a=KG(a,ZG(BJ(this.a),47));return eH(a)^eH(bH(a,32))};hS.kF=$I(96);yS.bI=function bI(a,b){var c;c=new yS.dI;yS.aI(a,b,c);return c};yS.cI=function cI(a,b,c,d,e){a.c=b;a.d=c;a.b=d;a.a=e};yS.dI=function dI(){};yS.eI=function eI(a,b,c,d){yS.cI(this,a,b,c,d)};pH(15,96,{96:1,15:1},yS.dI,yS.eI);_.a=0;_.b=0;_.c=0;_.d=0;hS.jF=$I(15);pH(173,1,{});hS.qF=$I(173);zS.fI=function fI(a){var b;if(a.a!=-2){b=a.a;a.a=-2}else{b=zS.jI(a.b)}return b};zS.gI=function gI(a){var b,c,d;c=zS.fI(a);if(c==-1)return null;d=new iS.TK;b=false;while(!b){if(c==10){b=true}else if(c==13){b=true;c=zS.fI(a);c!=10&&(a.a=c)}if(!b){if(c==-1){break}iS.NK(d,c&VS);c=zS.fI(a)}}return d.a};zS.hI=function hI(a){this.b=a;this.a=-2};pH(69,173,{},zS.hI);_.a=0;hS.mF=$I(69);pH(155,1,{});hS.oF=$I(155);pH(154,155,{});hS.nF=$I(154);zS.iI=function iI(){};pH(112,154,{},zS.iI);hS.pF=$I(112);zS.jI=function jI(a){return a.a==iS.IK(a.b).length?-1:iS.oK(a.b,a.a++)};zS.kI=function kI(a){this.b=a;this.a=0};pH(68,173,{},zS.kI);_.a=0;hS.rF=$I(68);iS.lI=function lI(a,b){return iS.oK(a.a,b)};iS.mI=function mI(a,b,c,d){a.a=iS.EK(a.a,0,b)+(''+d)+iS.DK(a.a,c)};iS.nI=function nI(a,b,c){iS.mI(a,b,b+1,String.fromCharCode(c))};iS.oI=function oI(a){var b;b=iS.IK(a.a).length;0<b?(a.a=iS.EK(a.a,0,0)):0>b&&(a.a+=iS.JK(QC(hS.ND,HT,5,-b,15,1)))};iS.pI=function pI(a){return a.a};iS.qI=function qI(a){this.a=a};pH(57,1,{84:1});_.db=function rI(){return iS.pI(this)};hS.sF=$I(57);iS.sI=function sI(){iS.IA.call(this)};iS.tI=function tI(a){iS.KA.call(this,a)};pH(40,26,TS,iS.sI,iS.tI);hS.BF=$I(40);iS.uI=function uI(){iS.sI.call(this)};iS.vI=function vI(a){iS.tI.call(this,a)};pH(111,40,TS,iS.uI,iS.vI);hS.tF=$I(111);function II(a){if(!a){throw JG(new iS.PJ)}}
function JI(a,b,c){var d,e;d=iS.oK(a,b++);if(d>=55296&&d<=56319&&b<c&&NI(e=iS.IK(a).charCodeAt(b))){return US+((d&1023)<<10)+(e&1023)}return d}
function KI(a){if(a>=48&&a<58){return a-48}if(a>=97&&a<97){return a-97+10}if(a>=65&&a<65){return a-65+10}return -1}
function LI(a){return null!=String.fromCharCode(a).match(/\d/)}
function MI(a){return null!=String.fromCharCode(a).match(/[A-Z]/i)}
function NI(a){return a>=56320&&a<=57343}
function OI(a,b,c){II(a>=0&&a<=1114111);if(a>=US){b[c++]=55296+(a-US>>10&1023)&VS;b[c]=56320+(a-US&1023)&VS;return 2}else{b[c]=a&VS;return 1}}
function QI(a){return String.fromCharCode(a).toLowerCase().charCodeAt(0)}
iS.EJ=function EJ(){iS.EJ=rH;iS.DJ=YC(KC(hS.OD,1),bT,5,15,[1.3407807929942597E154,1.157920892373162E77,3.4028236692093846E38,1.8446744073709552E19,4294967296,US,256,16,4,2]);iS.CJ=YC(KC(hS.OD,1),bT,5,15,[7.458340731200207E-155,8.636168555094445E-78,2.9387358770557188E-39,5.421010862427522E-20,2.3283064365386963E-10,JU,0.00390625,0.0625,0.25,0.5])};iS.FJ=function FJ(a,b){return a.b-b.b};iS.GJ=function GJ(a){return a.a!=null?a.a:''+a.b};pH(46,1,{4:1,25:1,46:1});_.fb=function IJ(a){return iS.FJ(this,a)};_.compareTo=function HJ(a){return iS.FJ(this,a)};_.equals=function JJ(a){return this===a};_.ab=function(a){return this.equals(a)};_.hashCode=function KJ(){return lS.WR(this)};_.cb=function(){return this.hashCode()};_.name=function LJ(){return iS.GJ(this)};_.ordinal=function MJ(){return this.b};_.toString=function NJ(){return this.a!=null?this.a:''+this.b};_.db=function(){return this.toString()};_.b=0;hS.xF=$I(46);function OJ(a){var b;b=iS.pJ(a);if(b>iU){return Infinity}else if(b<-3.4028234663852886E38){return -Infinity}return b}
iS.PJ=function PJ(){iS.IA.call(this)};iS.QJ=function QJ(a){iS.KA.call(this,a)};pH(19,26,TS,iS.PJ,iS.QJ);hS.zF=$I(19);iS.RJ=function RJ(){iS.IA.call(this)};pH(131,26,TS,iS.RJ);hS.AF=$I(131);iS.aK=function aK(){iS.aK=rH;iS._J=QC(hS.CF,KU,30,256,0,1)};iS.bK=function bK(a){return a<0?-a:a};iS.cK=function cK(a,b){return a>b?a:b};iS.dK=function dK(a,b){return a<b?a:b};iS.eK=function eK(a){iS.KA.call(this,a)};pH(148,26,TS,iS.eK);hS.EF=$I(148);iS.jK=function jK(a){iS.QJ.call(this,a)};pH(52,19,TS,iS.jK);hS.GF=$I(52);iS.kK=function kK(a,b,c){this.a=IS;this.d=a;this.b=b;this.c=c};pH(39,1,{4:1,39:1},iS.kK);_.ab=function lK(a){var b;if(CD(a,39)){b=a;return this.c==b.c&&CS.fP(this.d,b.d)&&CS.fP(this.a,b.a)&&CS.fP(this.b,b.b)}return false};_.cb=function mK(){return CS.KO(YC(KC(hS.IF,1),DT,1,5,[iS.$J(this.c),this.a,this.d,this.b]))};_.db=function nK(){return this.a+'.'+this.d+'('+(this.b!=null?this.b:'Unknown Source')+(this.c>=0?':'+this.c:'')+')'};_.c=0;hS.KF=$I(39);iS.LK=function LK(a,b){a.a+=''+b;return a};iS.MK=function MK(){iS.qI.call(this,'')};pH(85,57,{84:1},iS.MK);hS.LF=$I(85);iS.NK=function NK(a,b){a.a+=String.fromCharCode(b);return a};iS.OK=function OK(a,b){a.a+=b;return a};iS.PK=function PK(a,b){a.a+=''+b;return a};iS.QK=function QK(a,b){a.a+=''+b;return a};iS.RK=function RK(a,b,c){a.a=iS.EK(a.a,0,b)+''+iS.DK(a.a,c);return a};iS.SK=function SK(a,b,c){a.a=iS.EK(a.a,0,b)+(''+c)+iS.DK(a.a,b);return a};iS.TK=function TK(){iS.qI.call(this,'')};iS.UK=function UK(){iS.qI.call(this,'')};iS.VK=function VK(a){iS.qI.call(this,(lS.AR(a),a))};pH(32,57,{84:1},iS.TK,iS.UK,iS.VK);hS.MF=$I(32);iS.WK=function WK(a){iS.tI.call(this,a)};pH(132,40,TS,iS.WK);hS.NF=$I(132);iS.YK=function YK(){iS.YK=rH;iS.XK=new zS.iI};iS.ZK=function ZK(a,b,c){iS.YK();var d,e;lS.BR(a,'src');lS.BR(b,'dest');iS.wc(a);iS.wc(b);e=lS.gR(a);d=lS.gR(b);if(c<0||c>e||c>d){throw JG(new iS.sI)}c>0&&lS.eR(a,0,b,0,c,true)};pH(200,1,{});iS.$K=function $K(){iS.IA.call(this)};iS._K=function _K(a){iS.KA.call(this,a)};pH(44,26,TS,iS.$K,iS._K);hS.QF=$I(44);AS.aL=function aL(a,b){return iS.rK(a.a,b.a)};AS.bL=function bL(a){this.a=a};pH(45,1,LU);_.fb=function cL(a){return AS.aL(this,a)};_.ab=function dL(a){var b;if(a===this){return true}if(!CD(a,45)){return false}b=a;return iS.uK(this.a,b.a)};_.cb=function eL(){return lS.cS(this.a)};_.db=function fL(){return this.a};hS.RF=$I(45);pH(179,1,{});hS.TF=$I(179);BS.gL=function gL(a,b){return tS.qC(a.a,b)};BS.hL=function hL(a){this.a=(tS.kC(),new tS.BC(a,tS.fC()))};BS.iL=function iL(a){BS.hL.call(this,a)};pH(81,179,{},BS.hL,BS.iL);hS.SF=$I(81);CS.jL=function jL(a,b,c){var d,e;for(e=a.xb();e.Ab();){d=e.Bb();if(KD(b)===KD(d)||b!=null&&iS.uc(b,d)){c&&e.Cb();return true}}return false};CS.kL=function kL(a,b){var c,d;lS.AR(b);for(d=b.xb();d.Ab();){c=d.Bb();if(!a.contains(c)){return false}}return true};CS.lL=function lL(a,b){var c,d,e;lS.AR(b);c=false;for(d=a.xb();d.Ab();){e=d.Bb();if(b.contains(e)){d.Cb();c=true}}return c};CS.mL=function mL(a){var b,c,d;d=new CS.sP('[',']');for(c=a.xb();c.Ab();){b=c.Bb();CS.qP(d,b===a?'(this Collection)':b==null?PS:vH(b))}return !d.a?d.c:iS.IK(d.e).length==0?d.a.a:d.a.a+(''+d.e)};pH(174,1,{});_.add=function nL(a){throw JG(new iS._K('Add not supported on this collection'))};_.addAll=function oL(a){var b,c,d;lS.AR(a);b=false;for(d=a.xb();d.Ab();){c=d.Bb();b=b|this.add(c)}return b};_.clear=function pL(){var a;for(a=this.xb();a.Ab();){a.Bb();a.Cb()}};_.contains=function qL(a){return CS.jL(this,a,false)};_.containsAll=function rL(a){return CS.kL(this,a)};_.isEmpty=function sL(){return this.size()==0};_.remove=function tL(a){return CS.jL(this,a,true)};_.removeAll=function uL(a){return CS.lL(this,a)};_.retainAll=function vL(a){var b,c,d;lS.AR(a);b=false;for(c=this.xb();c.Ab();){d=c.Bb();if(!a.contains(d)){c.Cb();b=true}}return b};_.toArray=function wL(){return this.yb(QC(hS.IF,DT,1,this.size(),5,1))};_.yb=function xL(a){var b,c,d,e;e=this.size();a.length<e&&(a=(d=lS.fR(e),lS.mR(d,a)));c=this.xb();for(b=0;b<e;++b){UC(a,b,c.Bb())}a.length>e&&hS.TC(a,e,null);return a};_.db=function yL(){return CS.mL(this)};hS.UF=$I(174);CS.zL=function zL(a,b,c){return new CS.YL(a,b,c)};pH(175,174,{82:1});_.addAtIndex=function AL(a,b){throw JG(new iS._K('Add not supported on this list'))};_.add=function BL(a){this.addAtIndex(this.size(),a);return true};_.addAllAtIndex=function CL(a,b){var c,d,e;lS.AR(b);c=false;for(e=b.xb();e.Ab();){d=e.Bb();this.addAtIndex(a++,d);c=true}return c};_.clear=function DL(){this.zb(0,this.size())};_.ab=function EL(a){var b,c,d,e,f;if(a===this){return true}if(!CD(a,82)){return false}f=a;if(this.size()!=f.size()){return false}e=f.xb();for(c=this.xb();c.Ab();){b=c.Bb();d=e.Bb();if(!(KD(b)===KD(d)||b!=null&&iS.uc(b,d))){return false}}return true};_.cb=function FL(){return CS.VO(this)};_.indexOf=function GL(a){var b,c;for(b=0,c=this.size();b<c;++b){if(CS.fP(a,this.getAtIndex(b))){return b}}return -1};_.xb=function HL(){return new CS.RL(this)};_.lastIndexOf=function IL(a){var b;for(b=this.size()-1;b>-1;--b){if(CS.fP(a,this.getAtIndex(b))){return b}}return -1};_.removeAtIndex=function JL(a){throw JG(new iS._K('Remove not supported on this list'))};_.zb=function KL(a,b){var c,d;d=new CS.WL(this,a);for(c=a;c<b;++c){lS.yR(d.a<d.c.size());d.c.getAtIndex(d.b=d.a++);CS.QL(d)}};_.setAtIndex=function LL(a,b){throw JG(new iS._K('Set not supported on this list'))};_.subList=function ML(a,b){return CS.zL(this,a,b)};hS.YF=$I(175);CS.aP=function aP(){throw JG(new iS.$K)};CS.NL=function NL(a){};CS.OL=function OL(a){return a.a<a.c.size()};CS.PL=function PL(a){lS.yR(a.a<a.c.size());return a.c.getAtIndex(a.b=a.a++)};CS.QL=function QL(a){lS.ER(a.b!=-1);a.c.removeAtIndex(a.b);a.a=a.b;a.b=-1};CS.RL=function RL(a){this.c=a;CS.NL(this)};pH(98,1,{},CS.RL);_.Ab=function SL(){return CS.OL(this)};_.Bb=function TL(){return CS.PL(this)};_.Cb=function UL(){CS.QL(this)};_.a=0;_.b=-1;hS.VF=$I(98);CS.VL=function VL(a){CS.QL(a)};CS.WL=function WL(a,b){CS.RL.call(this,a);lS.CR(b,a.size());this.a=b};pH(99,98,{},CS.WL);_.Cb=function XL(){CS.VL(this)};hS.WF=$I(99);CS.YL=function YL(a,b,c){lS.DR(b,c,a.size());this.c=a;this.a=b;this.b=c-b};pH(100,175,{82:1},CS.YL);_.addAtIndex=function ZL(a,b){lS.CR(a,this.b);this.c.addAtIndex(this.a+a,b);++this.b};_.getAtIndex=function $L(a){lS.zR(a,this.b);return this.c.getAtIndex(this.a+a)};_.removeAtIndex=function _L(a){var b;lS.zR(a,this.b);b=this.c.removeAtIndex(this.a+a);--this.b;return b};_.setAtIndex=function aM(a,b){lS.zR(a,this.b);return this.c.setAtIndex(this.a+a,b)};_.size=function bM(){return this.b};_.a=0;_.b=0;hS.XF=$I(100);CS.bP=function bP(a,b,c){var d;d=CS.lM(CS.xP(a,b));return d==null&&!CS.xP(a,b)?c:d};CS.cP=function cP(a,b,c){var d;d=CS.lM(CS.xP(a,b));return d!=null?d:CS.CP(a,b,c)};CS.dP=function dP(a,b,c){return CS.xP(a,b)?CS.CP(a,b,c):null};CS.cM=function cM(a,b){var c,d,e;for(d=new CS.UP((new CS.ZP(a)).b);CS.OL(d.a);){c=d.b=CS.PL(d.a);e=c.Fb();if(KD(b)===KD(e)||b!=null&&iS.uc(b,e)){return true}}return false};CS.dM=function dM(a,b,c){var d,e,f;for(e=new CS.UP((new CS.ZP(a)).b);CS.OL(e.a);){d=e.b=CS.PL(e.a);f=d.Eb();if(KD(b)===KD(f)||b!=null&&iS.uc(b,f)){if(c){d=new CS.fN(d.Eb(),d.Fb());CS.TP(e)}return d}}return null};CS.eM=function eM(a,b){return b===a?'(this Map)':b==null?PS:vH(b)};CS.fM=function fM(a){return new CS.NM(a)};CS.lM=function lM(a){return !a?null:a.Fb()};pH(176,1,{152:1});_.getOrDefault=function mM(a,b){var c;return c=this.get(a),c==null&&!this.containsKey(a)?b:c};_.putIfAbsent=function sM(a,b){var c;return c=this.get(a),c!=null?c:this.put(a,b)};_.replace=function vM(a,b){return this.containsKey(a)?this.put(a,b):null};_.clear=function gM(){this.Db().clear()};_.containsKey=function hM(a){return !!CS.dM(this,a,false)};_.containsValue=function iM(a){return CS.cM(this,a)};_.ab=function jM(a){var b,c,d;if(a===this){return true}if(!CD(a,42)){return false}d=a;if(this.c!=d.c){return false}for(c=new CS.UP((new CS.ZP(d)).b);CS.OL(c.a);){b=c.b=CS.PL(c.a);if(!CS.gN(this,b)){return false}}return true};_.get=function kM(a){return CS.lM(CS.dM(this,a,false))};_.cb=function nM(){return CS.UO(this.Db())};_.isEmpty=function oM(){return this.c==0};_.keySet=function pM(){return new CS.CM(this)};_.put=function qM(a,b){throw JG(new iS._K('Put not supported on this map'))};_.putAll=function rM(a){var b,c;lS.AR(a);for(c=new CS.UP(a.Db().b);CS.OL(c.a);){b=c.b=CS.PL(c.a);CS.CP(this,b.Eb(),b.Fb())}};_.remove=function uM(a){return CS.lM(CS.dM(this,a,true))};_.size=function wM(){return this.Db().b.c};_.db=function xM(){var a,b,c;c=new CS.sP('{','}');for(b=new CS.UP(this.Db().b);CS.OL(b.a);){a=b.b=CS.PL(b.a);CS.qP(c,CS.eM(this,a.Eb())+'='+CS.eM(this,a.Fb()))}return !c.a?c.c:iS.IK(c.e).length==0?c.a.a:c.a.a+(''+c.e)};_.values=function yM(){return CS.fM(this)};hS.dG=$I(176);pH(178,174,MU);_.ab=function zM(a){var b;if(a===this){return true}if(!CD(a,55)){return false}b=a;if(b.size()!=this.size()){return false}return CS.kL(this,b)};_.cb=function AM(){return CS.UO(this)};_.removeAll=function BM(a){var b,c,d,e;lS.AR(a);e=this.size();if(e<a.size()){for(b=this.xb();b.Ab();){c=b.Bb();a.contains(c)&&b.Cb()}}else{for(d=a.xb();d.Ab();){c=d.Bb();this.remove(c)}}return e!=this.size()};hS.iG=$I(178);CS.CM=function CM(a){this.a=a};pH(138,178,MU,CS.CM);_.clear=function DM(){CS.vP(this.a)};_.contains=function EM(a){return CS.hN(this.a,a)};_.xb=function FM(){var a;a=new CS.UP((new CS.ZP(this.a)).b);return new CS.IM(a)};_.remove=function GM(a){if(CS.hN(this.a,a)){CS.DP(this.a,a);return true}return false};_.size=function HM(){return this.a.c};hS.$F=$I(138);CS.IM=function IM(a){this.a=a};pH(139,1,{},CS.IM);_.Ab=function JM(){return CS.OL(this.a.a)};_.Bb=function KM(){var a;a=CS.SP(this.a);return a.Eb()};_.Cb=function LM(){CS.TP(this.a)};hS.ZF=$I(139);CS.MM=function MM(a){var b;b=new CS.UP((new CS.ZP(a.a)).b);return new CS.UM(b)};CS.NM=function NM(a){this.a=a};pH(105,174,{},CS.NM);_.clear=function OM(){CS.vP(this.a)};_.contains=function PM(a){return CS.cM(this.a,a)};_.xb=function QM(){return CS.MM(this)};_.size=function RM(){return this.a.c};hS.aG=$I(105);CS.SM=function SM(a){return CS.OL(a.a.a)};CS.TM=function TM(a){var b;b=CS.SP(a.a);return b.Fb()};CS.UM=function UM(a){this.a=a};pH(106,1,{},CS.UM);_.Ab=function VM(){return CS.SM(this)};_.Bb=function WM(){return CS.TM(this)};_.Cb=function XM(){CS.TP(this.a)};hS._F=$I(106);CS.YM=function YM(a){return a.c};CS.ZM=function ZM(a){return a.d};CS.$M=function $M(a,b){var c;c=a.d;a.d=b;return c};CS._M=function _M(a,b){this.c=a;this.d=b};pH(63,1,{63:1,65:1});_.ab=function aN(a){var b;if(!CD(a,65)){return false}b=a;return CS.fP(this.c,b.Eb())&&CS.fP(this.d,b.Fb())};_.Eb=function bN(){return CS.YM(this)};_.Fb=function cN(){return CS.ZM(this)};_.cb=function dN(){return CS.gP(this.c)^CS.gP(this.d)};_.db=function eN(){return this.c+'='+this.d};hS.bG=$I(63);CS.fN=function fN(a,b){CS._M.call(this,a,b)};pH(64,63,{63:1,64:1,65:1},CS.fN);hS.cG=$I(64);CS.gN=function gN(a,b){var c,d;c=b.Eb();d=CS.xP(a,c);return !!d&&CS.fP(d.d,b.Fb())};CS.hN=function hN(a,b){return !!CS.xP(a,b)};CS.iN=function iN(a,b){return CS.lM(CS.xP(a,b))};CS.jN=function jN(a){return new CS.wN(a)};pH(177,176,{152:1});_.containsKey=function kN(a){return CS.hN(this,a)};_.Db=function lN(){return new CS.qN(this)};_.get=function mN(a){return CS.iN(this,a)};_.keySet=function nN(){return CS.jN(this)};hS.hG=$I(177);CS.oN=function oN(a){return new CS.UP(a.b)};CS.pN=function pN(a){return a.b.c};CS.qN=function qN(a){this.b=a};pH(102,178,MU,CS.qN);_.contains=function rN(a){return CD(a,65)&&CS.gN(this.b,a)};_.xb=function sN(){return CS.oN(this)};_.remove=function tN(a){var b;if(CD(a,65)){b=a;return CS.EP(this.b,b)}return false};_.size=function uN(){return CS.pN(this)};hS.eG=$I(102);CS.vN=function vN(a){var b;b=new CS.UP((new CS.ZP(a.a)).b);return new CS.CN(b)};CS.wN=function wN(a){this.a=a};pH(103,178,MU,CS.wN);_.clear=function xN(){CS.vP(this.a)};_.contains=function yN(a){return CS.hN(this.a,a)};_.xb=function zN(){return CS.vN(this)};_.remove=function AN(a){if(CS.hN(this.a,a)){CS.DP(this.a,a);return true}return false};_.size=function BN(){return this.a.c};hS.gG=$I(103);CS.CN=function CN(a){this.a=a};pH(104,1,{},CS.CN);_.Ab=function DN(){return CS.OL(this.a.a)};_.Bb=function EN(){var a;a=CS.SP(this.a);return a.Eb()};_.Cb=function FN(){CS.TP(this.a)};hS.fG=$I(104);CS.GN=function GN(a){a.a=QC(hS.IF,DT,1,0,5,1)};CS.HN=function HN(a,b,c){lS.CR(b,a.a.length);lS.hR(a.a,b,c)};CS.IN=function IN(a,b){a.a[a.a.length]=b;return true};CS.JN=function JN(a,b,c){var d,e;lS.CR(b,a.a.length);d=c.toArray();e=d.length;if(e==0){return false}lS.iR(a.a,b,d);return true};CS.KN=function KN(a,b){var c,d;c=b.toArray();d=c.length;if(d==0){return false}lS.iR(a.a,a.a.length,c);return true};CS.LN=function LN(a){a.a=QC(hS.IF,DT,1,0,5,1)};CS.MN=function MN(a,b){return CS.PN(a,b,0)!=-1};CS.NN=function NN(a,b){lS.zR(b,a.a.length);return a.a[b]};CS.ON=function ON(a,b){return CS.PN(a,b,0)};CS.PN=function PN(a,b,c){for(;c<a.a.length;++c){if(CS.fP(b,a.a[c])){return c}}return -1};CS.QN=function QN(a){return new CS.vO(a)};CS.RN=function RN(a,b){return CS.SN(a,b,a.a.length-1)};CS.SN=function SN(a,b,c){for(;c>=0;--c){if(CS.fP(b,a.a[c])){return c}}return -1};CS.TN=function TN(a,b){var c;c=(lS.zR(b,a.a.length),a.a[b]);lS.jR(a.a,b,1);return c};CS.UN=function UN(a,b){var c;c=CS.PN(a,b,0);if(c==-1){return false}CS.TN(a,c);return true};CS.VN=function VN(a,b,c){var d;lS.DR(b,c,a.a.length);d=c-b;lS.jR(a.a,b,d)};CS.WN=function WN(a,b,c){var d;d=(lS.zR(b,a.a.length),a.a[b]);a.a[b]=c;return d};CS.XN=function XN(a){return a.a.length};CS.YN=function YN(a,b){CS.SO(a.a,a.a.length,b)};CS.ZN=function ZN(a){return lS.dR(a.a,a.a.length)};CS.$N=function $N(a,b){var c,d,e;e=a.a.length;b.length<e&&(b=(d=lS.fR(e),lS.mR(d,b)));for(c=0;c<e;++c){UC(b,c,a.a[c])}b.length>e&&hS.TC(b,e,null);return b};CS._N=function _N(){CS.GN(this)};pH(16,175,{4:1,82:1},CS._N);_.addAtIndex=function aO(a,b){CS.HN(this,a,b)};_.add=function bO(a){return CS.IN(this,a)};_.addAllAtIndex=function cO(a,b){return CS.JN(this,a,b)};_.addAll=function dO(a){return CS.KN(this,a)};_.clear=function eO(){CS.LN(this)};_.contains=function fO(a){return CS.MN(this,a)};_.getAtIndex=function gO(a){return CS.NN(this,a)};_.indexOf=function hO(a){return CS.ON(this,a)};_.isEmpty=function iO(){return this.a.length==0};_.xb=function jO(){return CS.QN(this)};_.lastIndexOf=function kO(a){return CS.RN(this,a)};_.removeAtIndex=function lO(a){return CS.TN(this,a)};_.remove=function mO(a){return CS.UN(this,a)};_.zb=function nO(a,b){CS.VN(this,a,b)};_.setAtIndex=function oO(a,b){return CS.WN(this,a,b)};_.size=function pO(){return CS.XN(this)};_.toArray=function qO(){return CS.ZN(this)};_.yb=function rO(a){return CS.$N(this,a)};hS.kG=$I(16);CS.sO=function sO(a){};CS.tO=function tO(a){return a.a<a.c.a.length};CS.uO=function uO(a){lS.yR(a.a<a.c.a.length);a.b=a.a++;return a.c.a[a.b]};CS.vO=function vO(a){this.c=a;CS.sO(this)};pH(21,1,{},CS.vO);_.Ab=function wO(){return CS.tO(this)};_.Bb=function xO(){return CS.uO(this)};_.Cb=function yO(){lS.ER(this.b!=-1);CS.TN(this.c,this.a=this.b);this.b=-1};_.a=0;_.b=-1;hS.jG=$I(21);CS.zO=function zO(a,b){var c,d;c=(d=lS.lR(a,0,b),lS.mR(d,a));lS.kR(c,b);return c};CS.AO=function AO(a,b){lS.xR(b);return CS.CO(a,QC(hS.QD,$S,5,b,15,1),b)};CS.BO=function BO(a,b){lS.xR(b);return CS.zO(a,b)};CS.CO=function CO(a,b,c){var d,e;e=lS.gR(a);d=c<e?c:e;lS.eR(a,0,b,0,d,true);return b};CS.DO=function DO(a){CS.GO(a,a.length)};CS.EO=function EO(a){CS.HO(a,a.length,-1)};CS.FO=function FO(a){CS.IO(a,a.length)};CS.GO=function GO(a,b){var c;for(c=0;c<b;++c){a[c]=-1}};CS.HO=function HO(a,b,c){var d;for(d=0;d<b;++d){a[d]=c}};CS.IO=function IO(a,b){var c;for(c=0;c<b;++c){a[c]=0}};CS.JO=function JO(a,b){var c;for(c=0;c<b;++c){a[c]=false}};CS.KO=function KO(a){var b,c,d,e;e=1;for(c=0,d=a.length;c<d;++c){b=a[c];e=31*e+(b!=null?iS.yc(b):0);e=e|0}return e};CS.LO=function LO(a,b,c,d){var e,f,g;for(e=b+1;e<c;++e){for(f=e;f>b&&d.eb(a[f-1],a[f])>0;--f){g=a[f];hS.TC(a,f,a[f-1]);hS.TC(a,f-1,g)}}};CS.MO=function MO(a,b,c,d,e,f,g,h){var i;i=c;while(f<g){i>=d||b<c&&h.eb(a[b],a[i])<=0?UC(e,f++,a[b++]):UC(e,f++,a[i++])}};CS.NO=function NO(a,b,c,d){var e;d=(CS.XO(),!d?CS.WO:d);e=lS.lR(a,b,c);CS.OO(e,a,b,c,-b,d)};CS.OO=function OO(a,b,c,d,e,f){var g,h,i,j;g=d-c;if(g<7){CS.LO(b,c,d,f);return}i=c+e;h=d+e;j=i+(h-i>>1);CS.OO(b,a,i,j,-e,f);CS.OO(b,a,j,h,-e,f);if(f.eb(a[j-1],a[j])<=0){while(c<d){UC(b,c++,a[i++])}return}CS.MO(a,i,j,h,b,c,d,f)};CS.PO=function PO(a,b){a.sort(b)};CS.QO=function QO(c){c.sort(function(a,b){return a-b})};CS.RO=function RO(a){CS.NO(a,0,a.length,null)};CS.SO=function SO(a,b,c){lS.wR(b,a.length);CS.NO(a,0,b,c)};CS.TO=function TO(a,b){CS.NO(a,0,a.length,b)};CS.UO=function UO(a){var b,c,d;d=0;for(c=a.xb();c.Ab();){b=c.Bb();d=d+(b!=null?iS.yc(b):0);d=d|0}return d};CS.VO=function VO(a){var b,c,d;d=1;for(c=a.xb();c.Ab();){b=c.Bb();d=31*d+(b!=null?iS.yc(b):0);d=d|0}return d};CS.XO=function XO(){CS.XO=rH;CS.WO=new CS.ZO};CS.YO=function YO(a,b){return lS.AR(a),iS.FI(a,(lS.AR(b),b))};CS.ZO=function ZO(){};pH(146,1,HT,CS.ZO);_.eb=function $O(a,b){return CS.YO(a,b)};_.ab=function _O(a){return this===a};hS.lG=$I(146);CS.eP=function eP(){iS.IA.call(this)};pH(150,26,TS,CS.eP);hS.mG=$I(150);CS.fP=function fP(a,b){return KD(a)===KD(b)||a!=null&&iS.uc(a,b)};CS.gP=function gP(a){return a!=null?iS.yc(a):0};CS.kP=function kP(){CS.kP=rH;var a,b,c,d;CS.hP=QC(hS.OD,bT,5,25,15,1);CS.iP=QC(hS.OD,bT,5,33,15,1);d=JU;for(b=32;b>=0;b--){CS.iP[b]=d;d*=0.5}c=1;for(a=24;a>=0;a--){CS.hP[a]=c;c*=0.5}};CS.lP=function lP(a,b){var c,d;lS.vR(b>0);if((b&-b)==b){return LD(b*CS.mP(a)*4.6566128730773926E-10)}do{c=CS.mP(a);d=c%b}while(c-d+(b-1)<0);return LD(d)};CS.mP=function mP(a){var b,c,d,e,f,g;e=a.a*NU+a.b*1502;g=a.b*NU+11;b=$wnd.Math.floor(g*OU);e+=b;g-=b*XT;e%=XT;a.a=e;a.b=g;d=a.a*128;f=$wnd.Math.floor(a.b*CS.iP[31]);c=d+f;c>=2147483648&&(c-=4294967296);return c};CS.nP=function nP(a,b,c){a.a=b^1502;a.b=c^NU};CS.oP=function oP(){CS.kP();var a,b,c;c=CS.jP+++lS.nR();a=LD($wnd.Math.floor(c*OU))&_S;b=LD(c-a*XT);this.a=a^1502;this.b=b^NU};CS.pP=function pP(a){CS.kP();CS.nP(this,eH(LG(bH(a,24),_S)),eH(LG(a,_S)))};pH(72,1,{},CS.oP,CS.pP);_.a=0;_.b=0;CS.jP=0;hS.nG=$I(72);CS.qP=function qP(a,b){!a.a?(a.a=new iS.VK(a.d)):iS.QK(a.a,a.b);iS.PK(a.a,b);return a};CS.rP=function rP(a){return !a.a?a.c:iS.IK(a.e).length==0?a.a.a:a.a.a+(''+a.e)};CS.sP=function sP(a,b){this.b=', ';this.d=a;this.e=b;this.c=this.d+(''+this.e)};pH(92,1,{},CS.sP);_.db=function tP(){return CS.rP(this)};hS.oG=$I(92);CS.uP=function uP(a){};CS.vP=function vP(a){a.b=null;a.c=0};CS.wP=function wP(a){return new CS.ZP(a)};CS.xP=function xP(a,b){var c,d,e;e=a.b;while(e){c=a.a.eb(b,e.c);if(c==0){return e}d=c<0?0:1;e=e.a[d]}return null};CS.yP=function yP(a,b,c,d,e,f,g,h){var i,j;if(!d){return}i=d.a[0];!!i&&CS.yP(a,b,c,i,e,f,g,h);CS.zP(a,c,d.c,e,f,g,h)&&b.add(d);j=d.a[1];!!j&&CS.yP(a,b,c,j,e,f,g,h)};CS.zP=function zP(a,b,c,d,e,f,g){var h,i;if(b.Gb()&&(i=a.a.eb(c,d),i<0||!e&&i==0)){return false}if(b.Hb()&&(h=a.a.eb(c,f),h>0||!g&&h==0)){return false}return true};CS.AP=function AP(a,b,c,d){var e,f;if(!b){return c}else{e=a.a.eb(c.c,b.c);if(e==0){d.d=CS.$M(b,c.d);d.b=true;return b}f=e<0?0:1;b.a[f]=CS.AP(a,b.a[f],c,d);if(CS.BP(b.a[f])){if(CS.BP(b.a[1-f])){b.b=true;b.a[0].b=false;b.a[1].b=false}else{CS.BP(b.a[f].a[f])?(b=CS.IP(b,1-f)):CS.BP(b.a[f].a[1-f])&&(b=CS.HP(b,1-f))}}}return b};CS.BP=function BP(a){return !!a&&a.b};CS.CP=function CP(a,b,c){var d,e;d=new CS.aQ(b,c);e=new CS.cQ;a.b=CS.AP(a,a.b,d,e);e.b||++a.c;a.b.b=false;return e.d};CS.DP=function DP(a,b){var c;c=new CS.cQ;CS.FP(a,b,c);return c.d};CS.EP=function EP(a,b){var c;c=new CS.cQ;c.c=true;c.d=b.Fb();return CS.FP(a,b.Eb(),c)};CS.FP=function FP(a,b,c){var d,e,f,g,h,i,j,k,l,m,n;if(!a.b){return false}g=null;m=null;i=new CS.aQ(null,null);e=1;i.a[1]=a.b;l=i;while(l.a[e]){j=e;h=m;m=l;l=l.a[e];d=a.a.eb(b,l.c);e=d<0?0:1;d==0&&(!c.c||CS.fP(l.d,c.d))&&(g=l);if(!(!!l&&l.b)&&!CS.BP(l.a[e])){if(CS.BP(l.a[1-e])){m=m.a[j]=CS.IP(l,e)}else if(!CS.BP(l.a[1-e])){n=m.a[1-j];if(n){if(!CS.BP(n.a[1-j])&&!CS.BP(n.a[j])){m.b=false;n.b=true;l.b=true}else{f=h.a[1]==m?1:0;CS.BP(n.a[j])?(h.a[f]=CS.HP(m,j)):CS.BP(n.a[1-j])&&(h.a[f]=CS.IP(m,j));l.b=h.a[f].b=true;h.a[f].a[0].b=false;h.a[f].a[1].b=false}}}}}if(g){c.b=true;c.d=g.d;if(l!=g){k=new CS.aQ(l.c,l.d);CS.GP(a,i,g,k);m==g&&(m=k)}m.a[m.a[1]==l?1:0]=l.a[!l.a[0]?1:0];--a.c}a.b=i.a[1];!!a.b&&(a.b.b=false);return c.b};CS.GP=function GP(a,b,c,d){var e,f;f=b;e=f.c==null||a.a.eb(c.c,f.c)>0?1:0;while(f.a[e]!=c){f=f.a[e];e=a.a.eb(c.c,f.c)>0?1:0}f.a[e]=d;d.b=c.b;d.a[0]=c.a[0];d.a[1]=c.a[1];c.a[0]=null;c.a[1]=null};CS.HP=function HP(a,b){var c;c=1-b;a.a[c]=CS.IP(a.a[c],c);return CS.IP(a,b)};CS.IP=function IP(a,b){var c,d;c=1-b;d=a.a[c];a.a[c]=d.a[b];d.a[b]=a;a.b=true;d.b=false;return d};CS.JP=function JP(a){return a.c};CS.KP=function KP(){CS.LP.call(this,null)};CS.LP=function LP(a){CS.uP(this);this.b=null;this.a=(CS.XO(),!a?CS.WO:a)};pH(42,177,{4:1,152:1,42:1},CS.KP,CS.LP);_.clear=function MP(){CS.vP(this)};_.Db=function NP(){return CS.wP(this)};_.put=function OP(a,b){return CS.CP(this,a,b)};_.remove=function PP(a){return CS.DP(this,a)};_.size=function QP(){return CS.JP(this)};_.c=0;hS.xG=$I(42);CS.RP=function RP(a){return CS.OL(a.a)};CS.SP=function SP(a){return a.b=CS.PL(a.a)};CS.TP=function TP(a){CS.QL(a.a);CS.EP(a.c,a.b);a.b=null};CS.UP=function UP(a){CS.VP.call(this,a,(CS.iQ(),CS.eQ))};CS.VP=function VP(a,b){var c;this.c=a;c=new CS._N;CS.yP(a,c,b,a.b,null,false,null,false);this.a=new CS.WL(c,0)};pH(31,1,{},CS.UP);_.Bb=function XP(){return CS.SP(this)};_.Ab=function WP(){return CS.RP(this)};_.Cb=function YP(){CS.TP(this)};hS.pG=$I(31);CS.ZP=function ZP(a){this.a=a;CS.qN.call(this,a)};pH(37,102,MU,CS.ZP);_.clear=function $P(){CS.vP(this.a)};hS.qG=$I(37);CS._P=function _P(a){a.a=QC(hS.rG,DT,49,2,0,1)};CS.aQ=function aQ(a,b){CS.bQ.call(this,a,b)};CS.bQ=function bQ(a,b){CS.fN.call(this,a,b);CS._P(this);this.b=true};pH(49,64,{63:1,64:1,65:1,49:1},CS.aQ);_.b=false;hS.rG=$I(49);CS.cQ=function cQ(){};pH(79,1,{},CS.cQ);_.db=function dQ(){return 'State: mv='+this.c+' value='+this.d+' done='+this.a+' found='+this.b};_.a=false;_.b=false;_.c=false;hS.sG=$I(79);CS.iQ=function iQ(){CS.iQ=rH;CS.eQ=new CS.jQ('All',0);CS.fQ=new CS.nQ;CS.gQ=new CS.pQ;CS.hQ=new CS.sQ};CS.jQ=function jQ(a,b){this.a=a;this.b=b};CS.mQ=function mQ(){CS.iQ();return YC(KC(hS.wG,1),KU,38,0,[CS.eQ,CS.fQ,CS.gQ,CS.hQ])};pH(38,46,PU,CS.jQ);_.Gb=function kQ(){return false};_.Hb=function lQ(){return false};hS.wG=_I(38,CS.mQ);CS.nQ=function nQ(){CS.jQ.call(this,'Head',1)};pH(135,38,PU,CS.nQ);_.Hb=function oQ(){return true};hS.tG=_I(135,null);CS.pQ=function pQ(){CS.jQ.call(this,'Range',2)};pH(136,38,PU,CS.pQ);_.Gb=function qQ(){return true};_.Hb=function rQ(){return true};hS.uG=_I(136,null);CS.sQ=function sQ(){CS.jQ.call(this,'Tail',3)};pH(137,38,PU,CS.sQ);_.Gb=function tQ(){return true};hS.vG=_I(137,null);CS.uQ=function uQ(a,b){return CS.CP(a.a,b,(iS.xI(),wI))==null};CS.vQ=function vQ(a){CS.vP(a.a)};CS.wQ=function wQ(a,b){return CS.hN(a.a,b)};CS.xQ=function xQ(a){this.a=new CS.LP(a)};pH(90,178,{4:1,55:1},CS.xQ);_.add=function yQ(a){return CS.uQ(this,a)};_.clear=function zQ(){CS.vQ(this)};_.contains=function AQ(a){return CS.wQ(this,a)};_.xb=function BQ(){var a;return a=new CS.UP((new CS.ZP((new CS.wN(this.a)).a)).b),new CS.CN(a)};_.remove=function CQ(a){return CS.DP(this.a,a)!=null};_.size=function DQ(){return this.a.c};hS.yG=$I(90);CS.EQ=function EQ(a,b){return CS.IN(a.a,b)};CS.FQ=function FQ(a){return a.a.a.length};CS.GQ=function GQ(a,b){return CS.$N(a.a,b)};CS.HQ=function HQ(){this.a=new CS._N};CS.MQ=function MQ(a,b){if(a<0||a>=b){throw JG(new iS.uI)}};pH(140,175,{4:1,82:1},CS.HQ);_.addAtIndex=function IQ(a,b){CS.MQ(a,this.a.a.length+1);CS.HN(this.a,a,b)};_.add=function JQ(a){return CS.EQ(this,a)};_.addAllAtIndex=function KQ(a,b){CS.MQ(a,this.a.a.length+1);return CS.JN(this.a,a,b)};_.addAll=function LQ(a){return CS.KN(this.a,a)};_.clear=function NQ(){this.a.a=QC(hS.IF,DT,1,0,5,1)};_.contains=function OQ(a){return CS.PN(this.a,a,0)!=-1};_.containsAll=function PQ(a){return CS.kL(this.a,a)};_.getAtIndex=function QQ(a){CS.MQ(a,this.a.a.length);return CS.NN(this.a,a)};_.indexOf=function RQ(a){return CS.PN(this.a,a,0)};_.isEmpty=function SQ(){return this.a.a.length==0};_.xb=function TQ(){return new CS.vO(this.a)};_.lastIndexOf=function UQ(a){return CS.RN(this.a,a)};_.removeAtIndex=function VQ(a){CS.MQ(a,this.a.a.length);return CS.TN(this.a,a)};_.removeAll=function WQ(a){return CS.lL(this.a,a)};_.zb=function XQ(a,b){CS.VN(this.a,a,b)};_.setAtIndex=function YQ(a,b){CS.MQ(a,this.a.a.length);return CS.WN(this.a,a,b)};_.size=function ZQ(){return CS.FQ(this)};_.subList=function $Q(a,b){return new CS.YL(this.a,a,b)};_.toArray=function _Q(){return CS.ZN(this.a)};_.yb=function aR(a){return CS.GQ(this,a)};_.db=function bR(){return CS.mL(this.a)};hS.zG=$I(140);lS.cR=function cR(a,b,c,d){Array.prototype.splice.apply(a,[b,c].concat(d))};lS.dR=function dR(a,b){var c;c=lS.lR(a,0,b);return lS.mR(c,a)};lS.eR=function eR(a,b,c,d,e,f){var g,h,i;if(KD(a)===KD(c)){a=lS.lR(a,b,b+e);b=0}for(h=b,i=b+e;h<i;){g=h+WS<i?h+WS:i;e=g-h;lS.cR(c,d,f?e:0,lS.lR(a,h,g));h=g;d+=e}};lS.fR=function fR(a){return new Array(a)};lS.gR=function gR(a){return a.length};lS.hR=function hR(a,b,c){a.splice(b,0,c)};lS.iR=function iR(a,b,c){lS.eR(c,0,a,b,c.length,false)};lS.jR=function jR(a,b,c){a.splice(b,c)};lS.kR=function kR(a,b){a.length=b};lS.lR=function lR(a,b,c){return a.slice(b,c)};lS.mR=function mR(a,b){return hS.ZC(a,b)};lS.nR=function nR(){if(Date.now){return Date.now()}return (new Date).getTime()};lS.oR=function oR(){lS.oR=rH;new lS.uR;new lS.qR('ISO-LATIN-1');new lS.qR('ISO-8859-1')};lS.pR=function pR(a){AS.bL.call(this,a)};pH(93,45,LU);hS.CG=$I(93);lS.qR=function qR(a){lS.pR.call(this,a)};pH(94,93,LU,lS.qR);hS.AG=$I(94);
lS.rR=function rR(a,b,c){var d,e,f,g,h,i,j,k;f=0;for(j=0;j<c;){++f;e=a[b+j];if((e&192)==128){throw JG(new iS.QJ(QU))}else if((e&128)==0){++j}else if((e&224)==192){j+=2}else if((e&240)==224){j+=3}else if((e&248)==240){j+=4}else{throw JG(new iS.QJ(QU))}if(j>c){throw JG(new iS.tI(QU))}}g=QC(hS.ND,HT,5,f,15,1);k=0;h=0;for(i=0;i<c;){e=a[b+i++];if((e&128)==0){h=1;e&=127}else if((e&224)==192){h=2;e&=31}else if((e&240)==224){h=3;e&=15}else if((e&248)==240){h=4;e&=7}else if((e&252)==248){h=5;e&=3}while(--h>0){d=a[b+i++];if((d&192)!=128){throw JG(new iS.QJ('Invalid UTF8 sequence at '+(b+i-1)+', byte='+iS.ZJ(d,16)))}e=e<<6|d&63}k+=OI(e,g,k)}return g};lS.sR=function sR(a,b,c){if(c<128){a[b]=(c&127)<<24>>24;return 1}else if(c<kT){a[b++]=(c>>6&31|192)<<24>>24;a[b]=(c&63|128)<<24>>24;return 2}else if(c<US){a[b++]=(c>>12&15|224)<<24>>24;a[b++]=(c>>6&63|128)<<24>>24;a[b]=(c&63|128)<<24>>24;return 3}else if(c<tT){a[b++]=(c>>18&7|240)<<24>>24;a[b++]=(c>>12&63|128)<<24>>24;a[b++]=(c>>6&63|128)<<24>>24;a[b]=(c&63|128)<<24>>24;return 4}else if(c<VT){a[b++]=(c>>24&3|248)<<24>>24;a[b++]=(c>>18&63|128)<<24>>24;a[b++]=(c>>12&63|128)<<24>>24;a[b++]=(c>>6&63|128)<<24>>24;a[b]=(c&63|128)<<24>>24;return 5}throw JG(new iS.QJ('Character out of range: '+c))};lS.tR=function tR(a){var b,c,d,e,f,g,h;g=iS.IK(a).length;b=0;for(f=0;f<g;){d=JI(a,f,iS.IK(a).length);f+=d>=US?2:1;d<128?++b:d<kT?(b+=2):d<US?(b+=3):d<tT?(b+=4):d<VT&&(b+=5)}c=QC(hS.MD,JT,5,b,15,1);h=0;for(e=0;e<g;){d=JI(a,e,iS.IK(a).length);e+=d>=US?2:1;h+=lS.sR(c,h,d)}return c};lS.uR=function uR(){lS.pR.call(this,'UTF-8')};pH(123,93,LU,lS.uR);hS.BG=$I(123);lS.UR=function UR(){return QG};hS.ND=aJ('C');hS.DG=aJ('S');hS.QD=aJ('I');hS.EG=aJ('Z');hS.OD=aJ('D');hS.PD=aJ('F');hS.MD=aJ('B');hS.RD=aJ('J');qS.ru();_=uH('OCL.Molecule',qS.uu);_.FISCHER_PROJECTION_LIMIT=qS.jr;_.STEREO_ANGLE_LIMIT=qS.kr;_.VALIDATION_ERRORS_STEREO=qS.lr;_.VALIDATION_ERROR_AMBIGUOUS_CONFIGURATION=qS.mr;_.VALIDATION_ERROR_ESR_CENTER_UNKNOWN=qS.nr;_.VALIDATION_ERROR_OVER_UNDER_SPECIFIED=qS.or;_.cAtomCIPParityNone=qS.pr;_.cAtomCIPParityProblem=qS.qr;_.cAtomCIPParityRorM=qS.rr;_.cAtomCIPParitySorP=qS.sr;_.cAtomColorBlue=qS.tr;_.cAtomColorDarkGreen=qS.ur;_.cAtomColorDarkRed=qS.vr;_.cAtomColorGreen=qS.wr;_.cAtomColorMagenta=qS.xr;_.cAtomColorNone=qS.yr;_.cAtomColorOrange=qS.zr;_.cAtomColorRed=qS.Ar;_.cAtomLabel=qS.Br;_.cAtomParity1=qS.Cr;_.cAtomParity2=qS.Dr;_.cAtomParityIsPseudo=qS.Er;_.cAtomParityNone=qS.Fr;_.cAtomParityUnknown=qS.Gr;_.cAtomQFAny=qS.Hr;_.cAtomQFAromState=qS.Ir;_.cAtomQFAromStateBits=qS.Jr;_.cAtomQFAromStateShift=qS.Kr;_.cAtomQFAromatic=qS.Lr;_.cAtomQFCharge=qS.Mr;_.cAtomQFChargeBits=qS.Nr;_.cAtomQFChargeShift=qS.Or;_.cAtomQFExcludeGroup=qS.Pr;_.cAtomQFFlatNitrogen=qS.Qr;_.cAtomQFHydrogen=qS.Rr;_.cAtomQFHydrogenBits=qS.Sr;_.cAtomQFHydrogenShift=qS.Tr;_.cAtomQFMatchStereo=qS.Ur;_.cAtomQFMoreNeighbours=qS.Vr;_.cAtomQFNarrowing=qS.Wr;_.cAtomQFNeighbourBits=qS.Xr;_.cAtomQFNeighbourShift=qS.Yr;_.cAtomQFNeighbours=qS.Zr;_.cAtomQFNoMoreNeighbours=qS.$r;_.cAtomQFNoOfBits=qS._r;_.cAtomQFNot0Hydrogen=qS.as;_.cAtomQFNot0Neighbours=qS.bs;_.cAtomQFNot0PiElectrons=qS.cs;_.cAtomQFNot1Hydrogen=qS.ds;_.cAtomQFNot1Neighbour=qS.es;_.cAtomQFNot1PiElectron=qS.fs;_.cAtomQFNot2Hydrogen=qS.gs;_.cAtomQFNot2Neighbours=qS.hs;_.cAtomQFNot2PiElectrons=qS.is;_.cAtomQFNot2RingBonds=qS.js;_.cAtomQFNot3Hydrogen=qS.ks;_.cAtomQFNot3Neighbours=qS.ls;_.cAtomQFNot3RingBonds=qS.ms;_.cAtomQFNot4Neighbours=qS.ns;_.cAtomQFNot4RingBonds=qS.os;_.cAtomQFNotAromatic=qS.ps;_.cAtomQFNotChain=qS.qs;_.cAtomQFNotCharge0=qS.rs;_.cAtomQFNotChargeNeg=qS.ss;_.cAtomQFNotChargePos=qS.ts;_.cAtomQFPiElectronBits=qS.us;_.cAtomQFPiElectronShift=qS.vs;_.cAtomQFPiElectrons=qS.ws;_.cAtomQFRingSize=qS.xs;_.cAtomQFRingSizeBits=qS.ys;_.cAtomQFRingSizeShift=qS.zs;_.cAtomQFRingState=qS.As;_.cAtomQFRingStateBits=qS.Bs;_.cAtomQFRingStateShift=qS.Cs;_.cAtomQFSimpleFeatures=qS.Ds;_.cAtomRadicalState=qS.Es;_.cAtomRadicalStateD=qS.Fs;_.cAtomRadicalStateNone=qS.Gs;_.cAtomRadicalStateS=qS.Hs;_.cAtomRadicalStateShift=qS.Is;_.cAtomRadicalStateT=qS.Js;_.cBondCIPParityEorP=qS.Ks;_.cBondCIPParityNone=qS.Ls;_.cBondCIPParityProblem=qS.Ms;_.cBondCIPParityZorM=qS.Ns;_.cBondParityEor1=qS.Os;_.cBondParityNone=qS.Ps;_.cBondParityUnknown=qS.Qs;_.cBondParityZor2=qS.Rs;_.cBondQFAllFeatures=qS.Ss;_.cBondQFAromState=qS.Ts;_.cBondQFAromStateBits=qS.Us;_.cBondQFAromStateShift=qS.Vs;_.cBondQFAromatic=qS.Ws;_.cBondQFBondTypes=qS.Xs;_.cBondQFBondTypesBits=qS.Ys;_.cBondQFBondTypesShift=qS.Zs;_.cBondQFBridge=qS.$s;_.cBondQFBridgeBits=qS._s;_.cBondQFBridgeMin=qS.at;_.cBondQFBridgeMinBits=qS.bt;_.cBondQFBridgeMinShift=qS.ct;_.cBondQFBridgeShift=qS.dt;_.cBondQFBridgeSpan=qS.et;_.cBondQFBridgeSpanBits=qS.ft;_.cBondQFBridgeSpanShift=qS.gt;_.cBondQFDelocalized=qS.ht;_.cBondQFDouble=qS.it;_.cBondQFMatchStereo=qS.jt;_.cBondQFMetalLigand=qS.kt;_.cBondQFNarrowing=qS.lt;_.cBondQFNoOfBits=qS.mt;_.cBondQFNotAromatic=qS.nt;_.cBondQFNotRing=qS.ot;_.cBondQFRing=qS.pt;_.cBondQFRingSize=qS.qt;_.cBondQFRingSizeBits=qS.rt;_.cBondQFRingSizeShift=qS.st;_.cBondQFRingState=qS.tt;_.cBondQFRingStateBits=qS.ut;_.cBondQFRingStateShift=qS.vt;_.cBondQFSimpleFeatures=qS.wt;_.cBondQFSingle=qS.xt;_.cBondQFTriple=qS.yt;_.cBondTypeCross=qS.zt;_.cBondTypeDeleted=qS.At;_.cBondTypeDelocalized=qS.Bt;_.cBondTypeDouble=qS.Ct;_.cBondTypeDown=qS.Dt;_.cBondTypeIncreaseOrder=qS.Et;_.cBondTypeMetalLigand=qS.Ft;_.cBondTypeSingle=qS.Gt;_.cBondTypeTriple=qS.Ht;_.cBondTypeUp=qS.It;_.cChiralityDiastereomers=qS.Jt;_.cChiralityEpimers=qS.Kt;_.cChiralityIsomerCountMask=qS.Lt;_.cChiralityKnownEnantiomer=qS.Mt;_.cChiralityMeso=qS.Nt;_.cChiralityNotChiral=qS.Ot;_.cChiralityRacemic=qS.Pt;_.cChiralityUnknown=qS.Qt;_.cChiralityUnknownEnantiomer=qS.Rt;_.cDefaultAtomValence=qS.St;_.cESRGroupBits=qS.Tt;_.cESRMaxGroups=qS.Ut;_.cESRTypeAbs=qS.Vt;_.cESRTypeAnd=qS.Wt;_.cESRTypeOr=qS.Xt;_.cHelperBitCIP=qS.Yt;_.cHelperBitIncludeNitrogenParities=qS.Zt;_.cHelperBitNeighbours=qS.$t;_.cHelperBitParities=qS._t;_.cHelperBitRings=qS.au;_.cHelperBitSymmetryDiastereotopic=qS.bu;_.cHelperBitSymmetryEnantiotopic=qS.cu;_.cHelperBitSymmetrySimple=qS.du;_.cHelperBitsStereo=qS.eu;_.cHelperCIP=qS.fu;_.cHelperNeighbours=qS.gu;_.cHelperNone=qS.hu;_.cHelperParities=qS.iu;_.cHelperRings=qS.ju;_.cHelperSymmetryDiastereotopic=qS.ku;_.cHelperSymmetryEnantiotopic=qS.lu;_.cHelperSymmetrySimple=qS.mu;_.cMaxAtomicNo=qS.nu;_.cMaxConnAtoms=qS.ou;_.cRoundedMass=qS.pu;_.fromIDCode=qS.hv;_.fromMolfile=qS.kv;_.fromSmiles=qS.lv;_.getAngle=qS.uv;_.getAngleDif=qS.vv;_.getAtomicNoFromLabel=qS.Vv;_.getDefaultAverageBondLength=qS.vw;_.isAtomicNoElectronegative=qS.vx;_.isAtomicNoElectropositive=qS.wx;_.setDefaultAverageBondLength=qS.Py;_=uH('OCL.SDFileParser',qS.nz);_=uH('OCL.SSSearcher',qS.yz);_=uH('OCL.SSSearcherWithIndex',qS.Ez);_.bitCount=qS.Fz;_.getHexStringFromIndex=qS.Hz;_.getIndexFromHexString=qS.Iz;_.getKeyIDCode=qS.Jz;_.getSimilarityAngleCosine=qS.Kz;_.getSimilarityTanimoto=qS.Lz;_=uH('OCL.Util',qS.Pz);_.getHoseCodesFromDiastereotopicID=qS.Qz;iS.xI();_=uH('java.lang.Boolean');_.$isInstance=DI;_=uH('java.lang.CharSequence');_.$isInstance=HI;_=uH('java.lang.Comparable');_.$isInstance=mJ;_=uH('java.lang.Double');_.$isInstance=zJ;_=uH('java.lang.Number');_.$isInstance=iS.oJ;_=uH('java.lang.String');_.$isInstance=AK;_=uH('java.lang.Throwable');_.of=DA;var gS=(kS.qB(),tB);var gwtOnLoad=gwtOnLoad=jH;hH(xH);kH('permProps',[[['locale','default'],['user.agent','safari']]]);$sendStats('moduleStartup', 'moduleEvalEnd');gwtOnLoad(__gwtModuleFunction.__errFn, __gwtModuleFunction.__moduleName, __gwtModuleFunction.__moduleBase, __gwtModuleFunction.__softPermutationId,__gwtModuleFunction.__computePropValue);$sendStats('moduleStartup', 'end');$gwt && $gwt.permProps && __gwtModuleFunction.__moduleStartupDone($gwt.permProps);


        // End GWT code

        var toReturn = $wnd["OCL"];

        toReturn.version = '5.1.2';

        return toReturn;
    }

    var isBrowser, globalEnv;

    if (typeof self !== 'undefined') { // Usual Browser Window or Web Worker
        isBrowser = true;
        globalEnv = self;
    } else if (typeof global !== 'undefined') { // Node.js
        isBrowser = false;
        globalEnv = global;
    } else { // Other environment (example: CouchDB)
        isBrowser = false;
        globalEnv = root;
    }

    var document = globalEnv.document || {};

    if (!document.compatMode) {
        document.compatMode = 'CSS1Compat';
    }

    var fakeWindow;
    if (isBrowser && !true) {
        fakeWindow = globalEnv;
    } else {
        fakeWindow = {};
        fakeWindow.setTimeout = globalEnv.setTimeout ? globalEnv.setTimeout.bind(globalEnv) : noop;
        fakeWindow.clearTimeout = globalEnv.clearTimeout ? globalEnv.clearTimeout.bind(globalEnv) : noop;
        fakeWindow.setInterval = globalEnv.setInterval ? globalEnv.setInterval.bind(globalEnv) : noop;
        fakeWindow.clearInterval = globalEnv.clearInterval ? globalEnv.clearInterval.bind(globalEnv) : noop;
        // required since GWT 2.8.0
        fakeWindow.Error = globalEnv.Error;
        fakeWindow.Math = globalEnv.Math;
        fakeWindow.RegExp = globalEnv.RegExp;
        fakeWindow.TypeError = globalEnv.TypeError;
    }

    if (!fakeWindow.document) {
        fakeWindow.document = document;
    }

    var exportedApi = getExports(fakeWindow);

    if (true) { // NodeJS
        fillExports(exportedApi, exports);
    } else if (typeof define === 'function' && define.amd) { // AMD
        define(function () {
            var exportsObj = {};
            fillExports(exportedApi, exportsObj);
            return exportsObj;
        });
    } else { // Global
        var path = ["OCL"];
        var l = path.length - 1;
        var obj = globalEnv;
        for (var i = 0; i < l; i++) {
            obj = obj[path[i]] || (obj[path[i]] = {});
        }
        obj[path[l]] = {};
        fillExports(exportedApi, obj[path[l]]);
    }

    function fillExports(obj, exports) {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            exports[keys[i]] = obj[keys[i]];
        }
    }

    function noop() {}

})(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(57);


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Papa Parse
	v4.1.4
	https://github.com/mholt/PapaParse
*/
(function(root, factory)
{
	if (true)
	{
		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	else if (typeof module === 'object' && module.exports)
	{
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	}
	else
	{
		// Browser globals (root is window)
		root.Papa = factory();
	}
}(this, function()
{
	'use strict';

	var global = (function () {
		// alternative method, similar to `Function('return this')()`
		// but without using `eval` (which is disabled when
		// using Content Security Policy).

		if (typeof self !== 'undefined') { return self; }
		if (typeof window !== 'undefined') { return window; }
		if (typeof global !== 'undefined') { return global; }

        // When running tests none of the above have been defined
        return {};
	})();


	var IS_WORKER = !global.document && !!global.postMessage,
		IS_PAPA_WORKER = IS_WORKER && /(\?|&)papaworker(=|&|$)/.test(global.location.search),
		LOADED_SYNC = false, AUTO_SCRIPT_PATH;
	var workers = {}, workerIdCounter = 0;

	var Papa = {};

	Papa.parse = CsvToJson;
	Papa.unparse = JsonToCsv;

	Papa.RECORD_SEP = String.fromCharCode(30);
	Papa.UNIT_SEP = String.fromCharCode(31);
	Papa.BYTE_ORDER_MARK = '\ufeff';
	Papa.BAD_DELIMITERS = ['\r', '\n', '"', Papa.BYTE_ORDER_MARK];
	Papa.WORKERS_SUPPORTED = !IS_WORKER && !!global.Worker;
	Papa.SCRIPT_PATH = null;	// Must be set by your code if you use workers and this lib is loaded asynchronously

	// Configurable chunk sizes for local and remote files, respectively
	Papa.LocalChunkSize = 1024 * 1024 * 10;	// 10 MB
	Papa.RemoteChunkSize = 1024 * 1024 * 5;	// 5 MB
	Papa.DefaultDelimiter = ',';			// Used if not specified and detection fails

	// Exposed for testing and development only
	Papa.Parser = Parser;
	Papa.ParserHandle = ParserHandle;
	Papa.NetworkStreamer = NetworkStreamer;
	Papa.FileStreamer = FileStreamer;
	Papa.StringStreamer = StringStreamer;

	if (global.jQuery)
	{
		var $ = global.jQuery;
		$.fn.parse = function(options)
		{
			var config = options.config || {};
			var queue = [];

			this.each(function(idx)
			{
				var supported = $(this).prop('tagName').toUpperCase() === 'INPUT'
								&& $(this).attr('type').toLowerCase() === 'file'
								&& global.FileReader;

				if (!supported || !this.files || this.files.length === 0)
					return true;	// continue to next input element

				for (var i = 0; i < this.files.length; i++)
				{
					queue.push({
						file: this.files[i],
						inputElem: this,
						instanceConfig: $.extend({}, config)
					});
				}
			});

			parseNextFile();	// begin parsing
			return this;		// maintains chainability


			function parseNextFile()
			{
				if (queue.length === 0)
				{
					if (isFunction(options.complete))
						options.complete();
					return;
				}

				var f = queue[0];

				if (isFunction(options.before))
				{
					var returned = options.before(f.file, f.inputElem);

					if (typeof returned === 'object')
					{
						if (returned.action === 'abort')
						{
							error('AbortError', f.file, f.inputElem, returned.reason);
							return;	// Aborts all queued files immediately
						}
						else if (returned.action === 'skip')
						{
							fileComplete();	// parse the next file in the queue, if any
							return;
						}
						else if (typeof returned.config === 'object')
							f.instanceConfig = $.extend(f.instanceConfig, returned.config);
					}
					else if (returned === 'skip')
					{
						fileComplete();	// parse the next file in the queue, if any
						return;
					}
				}

				// Wrap up the user's complete callback, if any, so that ours also gets executed
				var userCompleteFunc = f.instanceConfig.complete;
				f.instanceConfig.complete = function(results)
				{
					if (isFunction(userCompleteFunc))
						userCompleteFunc(results, f.file, f.inputElem);
					fileComplete();
				};

				Papa.parse(f.file, f.instanceConfig);
			}

			function error(name, file, elem, reason)
			{
				if (isFunction(options.error))
					options.error({name: name}, file, elem, reason);
			}

			function fileComplete()
			{
				queue.splice(0, 1);
				parseNextFile();
			}
		}
	}


	if (IS_PAPA_WORKER)
	{
		global.onmessage = workerThreadReceivedMessage;
	}
	else if (Papa.WORKERS_SUPPORTED)
	{
		AUTO_SCRIPT_PATH = getScriptPath();

		// Check if the script was loaded synchronously
		if (!document.body)
		{
			// Body doesn't exist yet, must be synchronous
			LOADED_SYNC = true;
		}
		else
		{
			document.addEventListener('DOMContentLoaded', function () {
				LOADED_SYNC = true;
			}, true);
		}
	}




	function CsvToJson(_input, _config)
	{
		_config = _config || {};
		_config.dynamicTyping = _config.dynamicTyping || false;

		if (_config.worker && Papa.WORKERS_SUPPORTED)
		{
			var w = newWorker();

			w.userStep = _config.step;
			w.userChunk = _config.chunk;
			w.userComplete = _config.complete;
			w.userError = _config.error;

			_config.step = isFunction(_config.step);
			_config.chunk = isFunction(_config.chunk);
			_config.complete = isFunction(_config.complete);
			_config.error = isFunction(_config.error);
			delete _config.worker;	// prevent infinite loop

			w.postMessage({
				input: _input,
				config: _config,
				workerId: w.id
			});

			return;
		}

		var streamer = null;
		if (typeof _input === 'string')
		{
			if (_config.download)
				streamer = new NetworkStreamer(_config);
			else
				streamer = new StringStreamer(_config);
		}
		else if ((global.File && _input instanceof File) || _input instanceof Object)	// ...Safari. (see issue #106)
			streamer = new FileStreamer(_config);

		return streamer.stream(_input);
	}






	function JsonToCsv(_input, _config)
	{
		var _output = '';
		var _fields = [];

		// Default configuration

		/** whether to surround every datum with quotes */
		var _quotes = false;

		/** whether to write headers */
		var _writeHeader = true;

		/** delimiting character */
		var _delimiter = ',';

		/** newline character(s) */
		var _newline = '\r\n';

		/** quote character */
		var _quoteChar = '"';

		unpackConfig();

		var quoteCharRegex = new RegExp(_quoteChar, 'g');

		if (typeof _input === 'string')
			_input = JSON.parse(_input);

		if (_input instanceof Array)
		{
			if (!_input.length || _input[0] instanceof Array)
				return serialize(null, _input);
			else if (typeof _input[0] === 'object')
				return serialize(objectKeys(_input[0]), _input);
		}
		else if (typeof _input === 'object')
		{
			if (typeof _input.data === 'string')
				_input.data = JSON.parse(_input.data);

			if (_input.data instanceof Array)
			{
				if (!_input.fields)
					_input.fields =  _input.meta && _input.meta.fields;

				if (!_input.fields)
					_input.fields =  _input.data[0] instanceof Array
									? _input.fields
									: objectKeys(_input.data[0]);

				if (!(_input.data[0] instanceof Array) && typeof _input.data[0] !== 'object')
					_input.data = [_input.data];	// handles input like [1,2,3] or ['asdf']
			}

			return serialize(_input.fields || [], _input.data || []);
		}

		// Default (any valid paths should return before this)
		throw 'exception: Unable to serialize unrecognized input';


		function unpackConfig()
		{
			if (typeof _config !== 'object')
				return;

			if (typeof _config.delimiter === 'string'
				&& _config.delimiter.length === 1
				&& Papa.BAD_DELIMITERS.indexOf(_config.delimiter) === -1)
			{
				_delimiter = _config.delimiter;
			}

			if (typeof _config.quotes === 'boolean'
				|| _config.quotes instanceof Array)
				_quotes = _config.quotes;

			if (typeof _config.newline === 'string')
				_newline = _config.newline;

			if (typeof _config.quoteChar === 'string')
				_quoteChar = _config.quoteChar;

			if (typeof _config.header === 'boolean')
				_writeHeader = _config.header;
		}


		/** Turns an object's keys into an array */
		function objectKeys(obj)
		{
			if (typeof obj !== 'object')
				return [];
			var keys = [];
			for (var key in obj)
				keys.push(key);
			return keys;
		}

		/** The double for loop that iterates the data and writes out a CSV string including header row */
		function serialize(fields, data)
		{
			var csv = '';

			if (typeof fields === 'string')
				fields = JSON.parse(fields);
			if (typeof data === 'string')
				data = JSON.parse(data);

			var hasHeader = fields instanceof Array && fields.length > 0;
			var dataKeyedByField = !(data[0] instanceof Array);

			// If there a header row, write it first
			if (hasHeader && _writeHeader)
			{
				for (var i = 0; i < fields.length; i++)
				{
					if (i > 0)
						csv += _delimiter;
					csv += safe(fields[i], i);
				}
				if (data.length > 0)
					csv += _newline;
			}

			// Then write out the data
			for (var row = 0; row < data.length; row++)
			{
				var maxCol = hasHeader ? fields.length : data[row].length;

				for (var col = 0; col < maxCol; col++)
				{
					if (col > 0)
						csv += _delimiter;
					var colIdx = hasHeader && dataKeyedByField ? fields[col] : col;
					csv += safe(data[row][colIdx], col);
				}

				if (row < data.length - 1)
					csv += _newline;
			}

			return csv;
		}

		/** Encloses a value around quotes if needed (makes a value safe for CSV insertion) */
		function safe(str, col)
		{
			if (typeof str === 'undefined' || str === null)
				return '';

			str = str.toString().replace(quoteCharRegex, _quoteChar+_quoteChar);

			var needsQuotes = (typeof _quotes === 'boolean' && _quotes)
							|| (_quotes instanceof Array && _quotes[col])
							|| hasAny(str, Papa.BAD_DELIMITERS)
							|| str.indexOf(_delimiter) > -1
							|| str.charAt(0) === ' '
							|| str.charAt(str.length - 1) === ' ';

			return needsQuotes ? _quoteChar + str + _quoteChar : str;
		}

		function hasAny(str, substrings)
		{
			for (var i = 0; i < substrings.length; i++)
				if (str.indexOf(substrings[i]) > -1)
					return true;
			return false;
		}
	}

	/** ChunkStreamer is the base prototype for various streamer implementations. */
	function ChunkStreamer(config)
	{
		this._handle = null;
		this._paused = false;
		this._finished = false;
		this._input = null;
		this._baseIndex = 0;
		this._partialLine = '';
		this._rowCount = 0;
		this._start = 0;
		this._nextChunk = null;
		this.isFirstChunk = true;
		this._completeResults = {
			data: [],
			errors: [],
			meta: {}
		};
		replaceConfig.call(this, config);

		this.parseChunk = function(chunk)
		{
			// First chunk pre-processing
			if (this.isFirstChunk && isFunction(this._config.beforeFirstChunk))
			{
				var modifiedChunk = this._config.beforeFirstChunk(chunk);
				if (modifiedChunk !== undefined)
					chunk = modifiedChunk;
			}
			this.isFirstChunk = false;

			// Rejoin the line we likely just split in two by chunking the file
			var aggregate = this._partialLine + chunk;
			this._partialLine = '';

			var results = this._handle.parse(aggregate, this._baseIndex, !this._finished);

			if (this._handle.paused() || this._handle.aborted())
				return;

			var lastIndex = results.meta.cursor;

			if (!this._finished)
			{
				this._partialLine = aggregate.substring(lastIndex - this._baseIndex);
				this._baseIndex = lastIndex;
			}

			if (results && results.data)
				this._rowCount += results.data.length;

			var finishedIncludingPreview = this._finished || (this._config.preview && this._rowCount >= this._config.preview);

			if (IS_PAPA_WORKER)
			{
				global.postMessage({
					results: results,
					workerId: Papa.WORKER_ID,
					finished: finishedIncludingPreview
				});
			}
			else if (isFunction(this._config.chunk))
			{
				this._config.chunk(results, this._handle);
				if (this._paused)
					return;
				results = undefined;
				this._completeResults = undefined;
			}

			if (!this._config.step && !this._config.chunk) {
				this._completeResults.data = this._completeResults.data.concat(results.data);
				this._completeResults.errors = this._completeResults.errors.concat(results.errors);
				this._completeResults.meta = results.meta;
			}

			if (finishedIncludingPreview && isFunction(this._config.complete) && (!results || !results.meta.aborted))
				this._config.complete(this._completeResults, this._input);

			if (!finishedIncludingPreview && (!results || !results.meta.paused))
				this._nextChunk();

			return results;
		};

		this._sendError = function(error)
		{
			if (isFunction(this._config.error))
				this._config.error(error);
			else if (IS_PAPA_WORKER && this._config.error)
			{
				global.postMessage({
					workerId: Papa.WORKER_ID,
					error: error,
					finished: false
				});
			}
		};

		function replaceConfig(config)
		{
			// Deep-copy the config so we can edit it
			var configCopy = copy(config);
			configCopy.chunkSize = parseInt(configCopy.chunkSize);	// parseInt VERY important so we don't concatenate strings!
			if (!config.step && !config.chunk)
				configCopy.chunkSize = null;  // disable Range header if not streaming; bad values break IIS - see issue #196
			this._handle = new ParserHandle(configCopy);
			this._handle.streamer = this;
			this._config = configCopy;	// persist the copy to the caller
		}
	}


	function NetworkStreamer(config)
	{
		config = config || {};
		if (!config.chunkSize)
			config.chunkSize = Papa.RemoteChunkSize;
		ChunkStreamer.call(this, config);

		var xhr;

		if (IS_WORKER)
		{
			this._nextChunk = function()
			{
				this._readChunk();
				this._chunkLoaded();
			};
		}
		else
		{
			this._nextChunk = function()
			{
				this._readChunk();
			};
		}

		this.stream = function(url)
		{
			this._input = url;
			this._nextChunk();	// Starts streaming
		};

		this._readChunk = function()
		{
			if (this._finished)
			{
				this._chunkLoaded();
				return;
			}

			xhr = new XMLHttpRequest();

			if (this._config.withCredentials)
			{
				xhr.withCredentials = this._config.withCredentials;
			}

			if (!IS_WORKER)
			{
				xhr.onload = bindFunction(this._chunkLoaded, this);
				xhr.onerror = bindFunction(this._chunkError, this);
			}

			xhr.open('GET', this._input, !IS_WORKER);

			if (this._config.chunkSize)
			{
				var end = this._start + this._config.chunkSize - 1;	// minus one because byte range is inclusive
				xhr.setRequestHeader('Range', 'bytes='+this._start+'-'+end);
				xhr.setRequestHeader('If-None-Match', 'webkit-no-cache'); // https://bugs.webkit.org/show_bug.cgi?id=82672
			}

			try {
				xhr.send();
			}
			catch (err) {
				this._chunkError(err.message);
			}

			if (IS_WORKER && xhr.status === 0)
				this._chunkError();
			else
				this._start += this._config.chunkSize;
		}

		this._chunkLoaded = function()
		{
			if (xhr.readyState != 4)
				return;

			if (xhr.status < 200 || xhr.status >= 400)
			{
				this._chunkError();
				return;
			}

			this._finished = !this._config.chunkSize || this._start > getFileSize(xhr);
			this.parseChunk(xhr.responseText);
		}

		this._chunkError = function(errorMessage)
		{
			var errorText = xhr.statusText || errorMessage;
			this._sendError(errorText);
		}

		function getFileSize(xhr)
		{
			var contentRange = xhr.getResponseHeader('Content-Range');
			if (contentRange === null) { // no content range, then finish!
        			return -1;
            		}
			return parseInt(contentRange.substr(contentRange.lastIndexOf('/') + 1));
		}
	}
	NetworkStreamer.prototype = Object.create(ChunkStreamer.prototype);
	NetworkStreamer.prototype.constructor = NetworkStreamer;


	function FileStreamer(config)
	{
		config = config || {};
		if (!config.chunkSize)
			config.chunkSize = Papa.LocalChunkSize;
		ChunkStreamer.call(this, config);

		var reader, slice;

		// FileReader is better than FileReaderSync (even in worker) - see http://stackoverflow.com/q/24708649/1048862
		// But Firefox is a pill, too - see issue #76: https://github.com/mholt/PapaParse/issues/76
		var usingAsyncReader = typeof FileReader !== 'undefined';	// Safari doesn't consider it a function - see issue #105

		this.stream = function(file)
		{
			this._input = file;
			slice = file.slice || file.webkitSlice || file.mozSlice;

			if (usingAsyncReader)
			{
				reader = new FileReader();		// Preferred method of reading files, even in workers
				reader.onload = bindFunction(this._chunkLoaded, this);
				reader.onerror = bindFunction(this._chunkError, this);
			}
			else
				reader = new FileReaderSync();	// Hack for running in a web worker in Firefox

			this._nextChunk();	// Starts streaming
		};

		this._nextChunk = function()
		{
			if (!this._finished && (!this._config.preview || this._rowCount < this._config.preview))
				this._readChunk();
		}

		this._readChunk = function()
		{
			var input = this._input;
			if (this._config.chunkSize)
			{
				var end = Math.min(this._start + this._config.chunkSize, this._input.size);
				input = slice.call(input, this._start, end);
			}
			var txt = reader.readAsText(input, this._config.encoding);
			if (!usingAsyncReader)
				this._chunkLoaded({ target: { result: txt } });	// mimic the async signature
		}

		this._chunkLoaded = function(event)
		{
			// Very important to increment start each time before handling results
			this._start += this._config.chunkSize;
			this._finished = !this._config.chunkSize || this._start >= this._input.size;
			this.parseChunk(event.target.result);
		}

		this._chunkError = function()
		{
			this._sendError(reader.error);
		}

	}
	FileStreamer.prototype = Object.create(ChunkStreamer.prototype);
	FileStreamer.prototype.constructor = FileStreamer;


	function StringStreamer(config)
	{
		config = config || {};
		ChunkStreamer.call(this, config);

		var string;
		var remaining;
		this.stream = function(s)
		{
			string = s;
			remaining = s;
			return this._nextChunk();
		}
		this._nextChunk = function()
		{
			if (this._finished) return;
			var size = this._config.chunkSize;
			var chunk = size ? remaining.substr(0, size) : remaining;
			remaining = size ? remaining.substr(size) : '';
			this._finished = !remaining;
			return this.parseChunk(chunk);
		}
	}
	StringStreamer.prototype = Object.create(StringStreamer.prototype);
	StringStreamer.prototype.constructor = StringStreamer;



	// Use one ParserHandle per entire CSV file or string
	function ParserHandle(_config)
	{
		// One goal is to minimize the use of regular expressions...
		var FLOAT = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;

		var self = this;
		var _stepCounter = 0;	// Number of times step was called (number of rows parsed)
		var _input;				// The input being parsed
		var _parser;			// The core parser being used
		var _paused = false;	// Whether we are paused or not
		var _aborted = false;   // Whether the parser has aborted or not
		var _delimiterError;	// Temporary state between delimiter detection and processing results
		var _fields = [];		// Fields are from the header row of the input, if there is one
		var _results = {		// The last results returned from the parser
			data: [],
			errors: [],
			meta: {}
		};

		if (isFunction(_config.step))
		{
			var userStep = _config.step;
			_config.step = function(results)
			{
				_results = results;

				if (needsHeaderRow())
					processResults();
				else	// only call user's step function after header row
				{
					processResults();

					// It's possbile that this line was empty and there's no row here after all
					if (_results.data.length === 0)
						return;

					_stepCounter += results.data.length;
					if (_config.preview && _stepCounter > _config.preview)
						_parser.abort();
					else
						userStep(_results, self);
				}
			};
		}

		/**
		 * Parses input. Most users won't need, and shouldn't mess with, the baseIndex
		 * and ignoreLastRow parameters. They are used by streamers (wrapper functions)
		 * when an input comes in multiple chunks, like from a file.
		 */
		this.parse = function(input, baseIndex, ignoreLastRow)
		{
			if (!_config.newline)
				_config.newline = guessLineEndings(input);

			_delimiterError = false;
			if (!_config.delimiter)
			{
				var delimGuess = guessDelimiter(input, _config.newline);
				if (delimGuess.successful)
					_config.delimiter = delimGuess.bestDelimiter;
				else
				{
					_delimiterError = true;	// add error after parsing (otherwise it would be overwritten)
					_config.delimiter = Papa.DefaultDelimiter;
				}
				_results.meta.delimiter = _config.delimiter;
			}
			else if(typeof _config.delimiter === 'function')
			{
				_config.delimiter = _config.delimiter(input);
				_results.meta.delimiter = _config.delimiter;
			}

			var parserConfig = copy(_config);
			if (_config.preview && _config.header)
				parserConfig.preview++;	// to compensate for header row

			_input = input;
			_parser = new Parser(parserConfig);
			_results = _parser.parse(_input, baseIndex, ignoreLastRow);
			processResults();
			return _paused ? { meta: { paused: true } } : (_results || { meta: { paused: false } });
		};

		this.paused = function()
		{
			return _paused;
		};

		this.pause = function()
		{
			_paused = true;
			_parser.abort();
			_input = _input.substr(_parser.getCharIndex());
		};

		this.resume = function()
		{
			_paused = false;
			self.streamer.parseChunk(_input);
		};

		this.aborted = function ()
		{
			return _aborted;
		};

		this.abort = function()
		{
			_aborted = true;
			_parser.abort();
			_results.meta.aborted = true;
			if (isFunction(_config.complete))
				_config.complete(_results);
			_input = '';
		};

		function processResults()
		{
			if (_results && _delimiterError)
			{
				addError('Delimiter', 'UndetectableDelimiter', 'Unable to auto-detect delimiting character; defaulted to \''+Papa.DefaultDelimiter+'\'');
				_delimiterError = false;
			}

			if (_config.skipEmptyLines)
			{
				for (var i = 0; i < _results.data.length; i++)
					if (_results.data[i].length === 1 && _results.data[i][0] === '')
						_results.data.splice(i--, 1);
			}

			if (needsHeaderRow())
				fillHeaderFields();

			return applyHeaderAndDynamicTyping();
		}

		function needsHeaderRow()
		{
			return _config.header && _fields.length === 0;
		}

		function fillHeaderFields()
		{
			if (!_results)
				return;
			for (var i = 0; needsHeaderRow() && i < _results.data.length; i++)
				for (var j = 0; j < _results.data[i].length; j++)
					_fields.push(_results.data[i][j]);
			_results.data.splice(0, 1);
		}

		function parseDynamic(field, value)
		{
			if ((_config.dynamicTyping[field] || _config.dynamicTyping) === true)
			{
				if (value === 'true' || value === 'TRUE')
					return true;
				else if (value === 'false' || value === 'FALSE')
					return false;
				else
					return tryParseFloat(value);
			}
			return value;
		}

		function applyHeaderAndDynamicTyping()
		{
			if (!_results || (!_config.header && !_config.dynamicTyping))
				return _results;

			for (var i = 0; i < _results.data.length; i++)
			{
				var row = _config.header ? {} : [];

				for (var j = 0; j < _results.data[i].length; j++)
				{
					var field = j;
					var value = _results.data[i][j];

					if (_config.header)
						field = j >= _fields.length ? '__parsed_extra' : _fields[j];

					value = parseDynamic(field, value);

					if (field === '__parsed_extra')
					{
						row[field] = row[field] || [];
						row[field].push(value);
					}
					else
						row[field] = value;
				}

				_results.data[i] = row;

				if (_config.header)
				{
					if (j > _fields.length)
						addError('FieldMismatch', 'TooManyFields', 'Too many fields: expected ' + _fields.length + ' fields but parsed ' + j, i);
					else if (j < _fields.length)
						addError('FieldMismatch', 'TooFewFields', 'Too few fields: expected ' + _fields.length + ' fields but parsed ' + j, i);
				}
			}

			if (_config.header && _results.meta)
				_results.meta.fields = _fields;
			return _results;
		}

		function guessDelimiter(input, newline)
		{
			var delimChoices = [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP];
			var bestDelim, bestDelta, fieldCountPrevRow;

			for (var i = 0; i < delimChoices.length; i++)
			{
				var delim = delimChoices[i];
				var delta = 0, avgFieldCount = 0;
				fieldCountPrevRow = undefined;

				var preview = new Parser({
					delimiter: delim,
					newline: newline,
					preview: 10
				}).parse(input);

				for (var j = 0; j < preview.data.length; j++)
				{
					var fieldCount = preview.data[j].length;
					avgFieldCount += fieldCount;

					if (typeof fieldCountPrevRow === 'undefined')
					{
						fieldCountPrevRow = fieldCount;
						continue;
					}
					else if (fieldCount > 1)
					{
						delta += Math.abs(fieldCount - fieldCountPrevRow);
						fieldCountPrevRow = fieldCount;
					}
				}

				if (preview.data.length > 0)
					avgFieldCount /= preview.data.length;

				if ((typeof bestDelta === 'undefined' || delta < bestDelta)
					&& avgFieldCount > 1.99)
				{
					bestDelta = delta;
					bestDelim = delim;
				}
			}

			_config.delimiter = bestDelim;

			return {
				successful: !!bestDelim,
				bestDelimiter: bestDelim
			}
		}

		function guessLineEndings(input)
		{
			input = input.substr(0, 1024*1024);	// max length 1 MB

			var r = input.split('\r');

			var n = input.split('\n');

			var nAppearsFirst = (n.length > 1 && n[0].length < r[0].length);

			if (r.length === 1 || nAppearsFirst)
				return '\n';

			var numWithN = 0;
			for (var i = 0; i < r.length; i++)
			{
				if (r[i][0] === '\n')
					numWithN++;
			}

			return numWithN >= r.length / 2 ? '\r\n' : '\r';
		}

		function tryParseFloat(val)
		{
			var isNumber = FLOAT.test(val);
			return isNumber ? parseFloat(val) : val;
		}

		function addError(type, code, msg, row)
		{
			_results.errors.push({
				type: type,
				code: code,
				message: msg,
				row: row
			});
		}
	}





	/** The core parser implements speedy and correct CSV parsing */
	function Parser(config)
	{
		// Unpack the config object
		config = config || {};
		var delim = config.delimiter;
		var newline = config.newline;
		var comments = config.comments;
		var step = config.step;
		var preview = config.preview;
		var fastMode = config.fastMode;
		var quoteChar = config.quoteChar || '"';

		// Delimiter must be valid
		if (typeof delim !== 'string'
			|| Papa.BAD_DELIMITERS.indexOf(delim) > -1)
			delim = ',';

		// Comment character must be valid
		if (comments === delim)
			throw 'Comment character same as delimiter';
		else if (comments === true)
			comments = '#';
		else if (typeof comments !== 'string'
			|| Papa.BAD_DELIMITERS.indexOf(comments) > -1)
			comments = false;

		// Newline must be valid: \r, \n, or \r\n
		if (newline != '\n' && newline != '\r' && newline != '\r\n')
			newline = '\n';

		// We're gonna need these at the Parser scope
		var cursor = 0;
		var aborted = false;

		this.parse = function(input, baseIndex, ignoreLastRow)
		{
			// For some reason, in Chrome, this speeds things up (!?)
			if (typeof input !== 'string')
				throw 'Input must be a string';

			// We don't need to compute some of these every time parse() is called,
			// but having them in a more local scope seems to perform better
			var inputLen = input.length,
				delimLen = delim.length,
				newlineLen = newline.length,
				commentsLen = comments.length;
			var stepIsFunction = typeof step === 'function';

			// Establish starting state
			cursor = 0;
			var data = [], errors = [], row = [], lastCursor = 0;

			if (!input)
				return returnable();

			if (fastMode || (fastMode !== false && input.indexOf(quoteChar) === -1))
			{
				var rows = input.split(newline);
				for (var i = 0; i < rows.length; i++)
				{
					var row = rows[i];
					cursor += row.length;
					if (i !== rows.length - 1)
						cursor += newline.length;
					else if (ignoreLastRow)
						return returnable();
					if (comments && row.substr(0, commentsLen) === comments)
						continue;
					if (stepIsFunction)
					{
						data = [];
						pushRow(row.split(delim));
						doStep();
						if (aborted)
							return returnable();
					}
					else
						pushRow(row.split(delim));
					if (preview && i >= preview)
					{
						data = data.slice(0, preview);
						return returnable(true);
					}
				}
				return returnable();
			}

			var nextDelim = input.indexOf(delim, cursor);
			var nextNewline = input.indexOf(newline, cursor);
			var quoteCharRegex = new RegExp(quoteChar+quoteChar, 'g');

			// Parser loop
			for (;;)
			{
				// Field has opening quote
				if (input[cursor] === quoteChar)
				{
					// Start our search for the closing quote where the cursor is
					var quoteSearch = cursor;

					// Skip the opening quote
					cursor++;

					for (;;)
					{
						// Find closing quote
						var quoteSearch = input.indexOf(quoteChar, quoteSearch+1);

						if (quoteSearch === -1)
						{
							if (!ignoreLastRow) {
								// No closing quote... what a pity
								errors.push({
									type: 'Quotes',
									code: 'MissingQuotes',
									message: 'Quoted field unterminated',
									row: data.length,	// row has yet to be inserted
									index: cursor
								});
							}
							return finish();
						}

						if (quoteSearch === inputLen-1)
						{
							// Closing quote at EOF
							var value = input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar);
							return finish(value);
						}

						// If this quote is escaped, it's part of the data; skip it
						if (input[quoteSearch+1] === quoteChar)
						{
							quoteSearch++;
							continue;
						}

						if (input[quoteSearch+1] === delim)
						{
							// Closing quote followed by delimiter
							row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
							cursor = quoteSearch + 1 + delimLen;
							nextDelim = input.indexOf(delim, cursor);
							nextNewline = input.indexOf(newline, cursor);
							break;
						}

						if (input.substr(quoteSearch+1, newlineLen) === newline)
						{
							// Closing quote followed by newline
							row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
							saveRow(quoteSearch + 1 + newlineLen);
							nextDelim = input.indexOf(delim, cursor);	// because we may have skipped the nextDelim in the quoted field

							if (stepIsFunction)
							{
								doStep();
								if (aborted)
									return returnable();
							}

							if (preview && data.length >= preview)
								return returnable(true);

							break;
						}
					}

					continue;
				}

				// Comment found at start of new line
				if (comments && row.length === 0 && input.substr(cursor, commentsLen) === comments)
				{
					if (nextNewline === -1)	// Comment ends at EOF
						return returnable();
					cursor = nextNewline + newlineLen;
					nextNewline = input.indexOf(newline, cursor);
					nextDelim = input.indexOf(delim, cursor);
					continue;
				}

				// Next delimiter comes before next newline, so we've reached end of field
				if (nextDelim !== -1 && (nextDelim < nextNewline || nextNewline === -1))
				{
					row.push(input.substring(cursor, nextDelim));
					cursor = nextDelim + delimLen;
					nextDelim = input.indexOf(delim, cursor);
					continue;
				}

				// End of row
				if (nextNewline !== -1)
				{
					row.push(input.substring(cursor, nextNewline));
					saveRow(nextNewline + newlineLen);

					if (stepIsFunction)
					{
						doStep();
						if (aborted)
							return returnable();
					}

					if (preview && data.length >= preview)
						return returnable(true);

					continue;
				}

				break;
			}


			return finish();


			function pushRow(row)
			{
				data.push(row);
				lastCursor = cursor;
			}

			/**
			 * Appends the remaining input from cursor to the end into
			 * row, saves the row, calls step, and returns the results.
			 */
			function finish(value)
			{
				if (ignoreLastRow)
					return returnable();
				if (typeof value === 'undefined')
					value = input.substr(cursor);
				row.push(value);
				cursor = inputLen;	// important in case parsing is paused
				pushRow(row);
				if (stepIsFunction)
					doStep();
				return returnable();
			}

			/**
			 * Appends the current row to the results. It sets the cursor
			 * to newCursor and finds the nextNewline. The caller should
			 * take care to execute user's step function and check for
			 * preview and end parsing if necessary.
			 */
			function saveRow(newCursor)
			{
				cursor = newCursor;
				pushRow(row);
				row = [];
				nextNewline = input.indexOf(newline, cursor);
			}

			/** Returns an object with the results, errors, and meta. */
			function returnable(stopped)
			{
				return {
					data: data,
					errors: errors,
					meta: {
						delimiter: delim,
						linebreak: newline,
						aborted: aborted,
						truncated: !!stopped,
						cursor: lastCursor + (baseIndex || 0)
					}
				};
			}

			/** Executes the user's step function and resets data & errors. */
			function doStep()
			{
				step(returnable());
				data = [], errors = [];
			}
		};

		/** Sets the abort flag */
		this.abort = function()
		{
			aborted = true;
		};

		/** Gets the cursor position */
		this.getCharIndex = function()
		{
			return cursor;
		};
	}


	// If you need to load Papa Parse asynchronously and you also need worker threads, hard-code
	// the script path here. See: https://github.com/mholt/PapaParse/issues/87#issuecomment-57885358
	function getScriptPath()
	{
		var scripts = document.getElementsByTagName('script');
		return scripts.length ? scripts[scripts.length - 1].src : '';
	}

	function newWorker()
	{
		if (!Papa.WORKERS_SUPPORTED)
			return false;
		if (!LOADED_SYNC && Papa.SCRIPT_PATH === null)
			throw new Error(
				'Script path cannot be determined automatically when Papa Parse is loaded asynchronously. ' +
				'You need to set Papa.SCRIPT_PATH manually.'
			);
		var workerUrl = Papa.SCRIPT_PATH || AUTO_SCRIPT_PATH;
		// Append 'papaworker' to the search string to tell papaparse that this is our worker.
		workerUrl += (workerUrl.indexOf('?') !== -1 ? '&' : '?') + 'papaworker';
		var w = new global.Worker(workerUrl);
		w.onmessage = mainThreadReceivedMessage;
		w.id = workerIdCounter++;
		workers[w.id] = w;
		return w;
	}

	/** Callback when main thread receives a message */
	function mainThreadReceivedMessage(e)
	{
		var msg = e.data;
		var worker = workers[msg.workerId];
		var aborted = false;

		if (msg.error)
			worker.userError(msg.error, msg.file);
		else if (msg.results && msg.results.data)
		{
			var abort = function() {
				aborted = true;
				completeWorker(msg.workerId, { data: [], errors: [], meta: { aborted: true } });
			};

			var handle = {
				abort: abort,
				pause: notImplemented,
				resume: notImplemented
			};

			if (isFunction(worker.userStep))
			{
				for (var i = 0; i < msg.results.data.length; i++)
				{
					worker.userStep({
						data: [msg.results.data[i]],
						errors: msg.results.errors,
						meta: msg.results.meta
					}, handle);
					if (aborted)
						break;
				}
				delete msg.results;	// free memory ASAP
			}
			else if (isFunction(worker.userChunk))
			{
				worker.userChunk(msg.results, handle, msg.file);
				delete msg.results;
			}
		}

		if (msg.finished && !aborted)
			completeWorker(msg.workerId, msg.results);
	}

	function completeWorker(workerId, results) {
		var worker = workers[workerId];
		if (isFunction(worker.userComplete))
			worker.userComplete(results);
		worker.terminate();
		delete workers[workerId];
	}

	function notImplemented() {
		throw 'Not implemented.';
	}

	/** Callback when worker thread receives a message */
	function workerThreadReceivedMessage(e)
	{
		var msg = e.data;

		if (typeof Papa.WORKER_ID === 'undefined' && msg)
			Papa.WORKER_ID = msg.workerId;

		if (typeof msg.input === 'string')
		{
			global.postMessage({
				workerId: Papa.WORKER_ID,
				results: Papa.parse(msg.input, msg.config),
				finished: true
			});
		}
		else if ((global.File && msg.input instanceof File) || msg.input instanceof Object)	// thank you, Safari (see issue #106)
		{
			var results = Papa.parse(msg.input, msg.config);
			if (results)
				global.postMessage({
					workerId: Papa.WORKER_ID,
					results: results,
					finished: true
				});
		}
	}

	/** Makes a deep copy of an array or object (mostly) */
	function copy(obj)
	{
		if (typeof obj !== 'object')
			return obj;
		var cpy = obj instanceof Array ? [] : {};
		for (var key in obj)
			cpy[key] = copy(obj[key]);
		return cpy;
	}

	function bindFunction(f, self)
	{
		return function() { f.apply(self, arguments); };
	}

	function isFunction(func)
	{
		return typeof func === 'function';
	}

	return Papa;
}));


/***/ }),
/* 60 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function parse(rxn) {
    if (typeof rxn !== 'string') {
        throw new TypeError('Parameter "rxn" must be a string');
    }
    // we will find the delimiter in order to be much faster and not use regular expression
    var header = rxn.substr(0, 1000);
    var crlf = '\n';
    if (header.indexOf('\r\n') > -1) {
        crlf = '\r\n';
    } else if (header.indexOf('\r') > -1) {
        crlf = '\r';
    }

    var rxnParts = rxn.split(crlf + '$MOL' + crlf);

    var reagents=[];
    var products=[];

    var result={};
    result.reagents=reagents;
    result.products=products;


    // the first part is expected to contain the number of reagents and products

    // First part should start with $RXN
    // and the fifth line should contain the number of reagents and products
    if (rxnParts.length===0) throw new Error('file looks empty');

    var header=rxnParts[0];
    if (header.indexOf("$RXN")!=0) throw new Error('file does not start with $RXN');

    var lines=header.split(crlf);
    if (lines.length<5) throw new Error('incorrect number of lines in header');

    var numberReagents=lines[4].substring(0,3) >> 0;
    var numberProducts=lines[4].substring(3,6) >> 0;

    if (numberReagents+numberProducts!=rxnParts.length-1) throw new Error('not the correct number of molecules');

    for (var i=1; i<rxnParts.length; i++) {
        if (i<=numberReagents) {
            reagents.push(rxnParts[i]);
        } else {
            products.push(rxnParts[i]);
        }
    }
    return result;

}

module.exports = parse;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// options: an object

function parse(sdf, options) {
    // we will find the delimiter in order to be much faster and not use regular expression
    var header = sdf.substr(0, 1000);
    var crlf = '\n';
    if (header.indexOf('\r\n') > -1) {
        crlf = '\r\n';
    } else if (header.indexOf('\r') > -1) {
        crlf = '\r';
    }

    var sdfParts = sdf.split(crlf + '$$$$' + crlf);
    var molecules = [];
    var labels = {};

    var start = Date.now();

    var i = 0, ii = sdfParts.length,
        sdfPart, parts, molecule, j, jj,
        lines, from, to, label, k, kk;
    for (; i < ii; i++) {
        sdfPart = sdfParts[i];
        parts = sdfPart.split(crlf + '>');
        if (parts.length > 0 && parts[0].length > 5) {
            molecule = {};
            molecules.push(molecule);
            molecule.molfile = {type: 'mol2d', value: parts[0] + crlf};
            jj = parts.length;
            for (j = 1; j < jj; j++) {
                lines = parts[j].split(crlf);
                from = lines[0].indexOf('<');
                to = lines[0].indexOf('>');
                label = lines[0].substring(from + 1, to);
                if (labels[label]) {
                    labels[label].counter++;
                } else {
                    labels[label] = {counter: 1, isNumeric: true};
                }
                kk = lines.length - 1;
                for (k = 1; k < kk; k++) {
                    if (molecule[label]) {
                        molecule[label] += crlf + lines[k];
                    } else {
                        molecule[label] = lines[k];
                    }
                }
                if (labels[label].isNumeric) {
                    if (!isFinite(molecule[label])) {
                        labels[label].isNumeric = false;
                    }
                }
            }
        }
    }

    // all numeric fields should be converted to numbers
    var numericFields=[];
    for (var label in labels) {
        var currentLabel=labels[label];
        if (currentLabel.isNumeric) {
            currentLabel.minValue=Number.MAX_VALUE;
            currentLabel.maxValue=Number.MIN_VALUE;
            for (var j=0; j < molecules.length; j++) {
                if (molecules[j][label]) {
                    var value=parseFloat(molecules[j][label]);
                    molecules[j][label]=value;
                    if (value>currentLabel.maxValue) currentLabel.maxValue=value;
                    if (value<currentLabel.minValue) currentLabel.minValue=value;
                }
            }
        }
    }

    // we check that a label is in all the records
    for (var key in labels) {
        if (labels[key].counter==molecules.length) {
            labels[key].always=true;
        } else {
            labels[key].always=false;
        }
    }

    var statistics = [];
    for (var key in labels) {
        var statistic=labels[key];
        statistic.label=key;
        statistics.push(statistic);
    }

    return {
        time: Date.now() - start,
        molecules: molecules,
        labels: Object.keys(labels),
        statistics: statistics
    };

}

module.exports = parse;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15), __webpack_require__(60)))

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Check if `fn` is a function.
 *
 * @param {Function} fn
 * @return {Boolean}
 * @api private
 */
var isObject = __webpack_require__(6);

function isFunction(fn) {
  var tag = isObject(fn) ? Object.prototype.toString.call(fn) : '';
  return tag === '[object Function]';
}

module.exports = isFunction;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = __webpack_require__(6);

/**
 * Expose `RequestBase`.
 */

module.exports = RequestBase;

/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in RequestBase.prototype) {
    obj[key] = RequestBase.prototype[key];
  }
  return obj;
}

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.clearTimeout = function _clearTimeout(){
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.parse = function parse(fn){
  this._parser = fn;
  return this;
};

/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.responseType = function(val){
  this._responseType = val;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.serialize = function serialize(fn){
  this._serializer = fn;
  return this;
};

/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, read, deadline}
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.timeout = function timeout(options){
  if (!options || 'object' !== typeof options) {
    this._timeout = options;
    this._responseTimeout = 0;
    return this;
  }

  for(var option in options) {
    switch(option) {
      case 'deadline':
        this._timeout = options.deadline;
        break;
      case 'response':
        this._responseTimeout = options.response;
        break;
      default:
        console.warn("Unknown timeout option", option);
    }
  }
  return this;
};

/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.retry = function retry(count){
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  return this;
};

/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */

RequestBase.prototype._retry = function() {
  this.clearTimeout();

  // node
  if (this.req) {
    this.req = null;
    this.req = this.request();
  }

  this._aborted = false;
  this.timedout = false;

  return this._end();
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */

RequestBase.prototype.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;
    if (this._endCalled) {
      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
    }
    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
      self.end(function(err, res){
        if (err) innerReject(err); else innerResolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
}

RequestBase.prototype.catch = function(cb) {
  return this.then(undefined, cb);
};

/**
 * Allow for extension
 */

RequestBase.prototype.use = function use(fn) {
  fn(this);
  return this;
}

RequestBase.prototype.ok = function(cb) {
  if ('function' !== typeof cb) throw Error("Callback required");
  this._okCallback = cb;
  return this;
};

RequestBase.prototype._isResponseOK = function(res) {
  if (!res) {
    return false;
  }

  if (this._okCallback) {
    return this._okCallback(res);
  }

  return res.status >= 200 && res.status < 300;
};


/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

RequestBase.prototype.get = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

RequestBase.prototype.getHeader = RequestBase.prototype.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */
RequestBase.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */
RequestBase.prototype.field = function(name, val) {

  // name should be either a string or an object.
  if (null === name ||  undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (this._data) {
    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObject(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }
    return this;
  }

  if (Array.isArray(val)) {
    for (var i in val) {
      this.field(name, val[i]);
    }
    return this;
  }

  // val should be defined now
  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }
  if ('boolean' === typeof val) {
    val = '' + val;
  }
  this._getFormData().append(name, val);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */
RequestBase.prototype.abort = function(){
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  this.xhr && this.xhr.abort(); // browser
  this.req && this.req.abort(); // node
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

RequestBase.prototype.withCredentials = function(on){
  // This is browser-only functionality. Node side is no-op.
  if(on==undefined) on = true;
  this._withCredentials = on;
  return this;
};

/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.redirects = function(n){
  this._maxRedirects = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

RequestBase.prototype.toJSON = function(){
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};


/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.send = function(data){
  var isObj = isObject(data);
  var type = this._header['content-type'];

  if (this._formData) {
    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObj && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw Error("Can't merge these send calls");
  }

  // merge
  if (isObj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!isObj || this._isHost(data)) {
    return this;
  }

  // default to json
  if (!type) this.type('json');
  return this;
};


/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.sortQuery = function(sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

RequestBase.prototype._timeoutError = function(reason, timeout, errno){
  if (this._aborted) {
    return;
  }
  var err = new Error(reason + timeout + 'ms exceeded');
  err.timeout = timeout;
  err.code = 'ECONNABORTED';
  err.errno = errno;
  this.timedout = true;
  this.abort();
  this.callback(err);
};

RequestBase.prototype._setTimeouts = function() {
  var self = this;

  // deadline
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  }
  // response timeout
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function(){
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
}


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var utils = __webpack_require__(68);

/**
 * Expose `ResponseBase`.
 */

module.exports = ResponseBase;

/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in ResponseBase.prototype) {
    obj[key] = ResponseBase.prototype[key];
  }
  return obj;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

ResponseBase.prototype.get = function(field){
    return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

ResponseBase.prototype._setHeaderProperties = function(header){
    // TODO: moar!
    // TODO: make this a util

    // content-type
    var ct = header['content-type'] || '';
    this.type = utils.type(ct);

    // params
    var params = utils.params(ct);
    for (var key in params) this[key] = params[key];

    this.links = {};

    // links
    try {
        if (header.link) {
            this.links = utils.parseLinks(header.link);
        }
    } catch (err) {
        // ignore
    }
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

ResponseBase.prototype._setStatusProperties = function(status){
    var type = status / 100 | 0;

    // status / class
    this.status = this.statusCode = status;
    this.statusType = type;

    // basics
    this.info = 1 == type;
    this.ok = 2 == type;
    this.redirect = 3 == type;
    this.clientError = 4 == type;
    this.serverError = 5 == type;
    this.error = (4 == type || 5 == type)
        ? this.toError()
        : false;

    // sugar
    this.accepted = 202 == status;
    this.noContent = 204 == status;
    this.badRequest = 400 == status;
    this.unauthorized = 401 == status;
    this.notAcceptable = 406 == status;
    this.forbidden = 403 == status;
    this.notFound = 404 == status;
};


/***/ }),
/* 67 */
/***/ (function(module, exports) {

var ERROR_CODES = [
  'ECONNRESET',
  'ETIMEDOUT',
  'EADDRINFO',
  'ESOCKETTIMEDOUT'
];

/**
 * Determine if a request should be retried.
 * (Borrowed from segmentio/superagent-retry)
 *
 * @param {Error} err
 * @param {Response} [res]
 * @returns {Boolean}
 */
module.exports = function shouldRetry(err, res) {
  if (err && err.code && ~ERROR_CODES.indexOf(err.code)) return true;
  if (res && res.status && res.status >= 500) return true;
  // Superagent timeout
  if (err && 'timeout' in err && err.code == 'ECONNABORTED') return true;
  return false;
};

/***/ }),
/* 68 */
/***/ (function(module, exports) {


/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = function(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = function(str){
  return str.split(/ *; */).reduce(function(obj, str){
    var parts = str.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = function(str){
  return str.split(/ *, */).reduce(function(obj, str){
    var parts = str.split(/ *; */);
    var url = parts[0].slice(1, -1);
    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
    obj[rel] = url;
    return obj;
  }, {});
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = function(header, shouldStripCookie){
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header['host'];
  if (shouldStripCookie) {
    delete header['cookie'];
  }
  return header;
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(63);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var superagent = __webpack_require__(7);

var normalizeOptions = __webpack_require__(3);
var queryByHose = __webpack_require__(16);
var spinus = __webpack_require__(17);
var twoD = __webpack_require__(18);

var defaultProtonUrl = 'https://raw.githubusercontent.com/cheminfo-js/nmr-predictor/master/data/h1.json';
var defaultCarbonUrl = 'https://raw.githubusercontent.com/cheminfo-js/nmr-predictor/master/data/nmrshiftdb2.json';

var databases = {};

function fetchProton() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultProtonUrl;
    var dbName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'proton';

    return fetch(url, dbName, 'proton');
}

function fetchCarbon() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultCarbonUrl;
    var dbName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'carbon';

    return fetch(url, dbName, 'carbon');
}

function fetch(url, dbName, type) {
    if (databases[dbName] && databases[dbName].type === type && databases[dbName].url === url) {
        if (databases[dbName].fetching) {
            return databases[dbName].fetching;
        }
        return Promise.resolve(databases[dbName].db);
    }
    var database = {
        type,
        url,
        db: null,
        fetching: null
    };
    databases[dbName] = database;
    var fetching = superagent.get(url).then(res => {
        var db = res.body ? res.body : JSON.parse(res.text);
        database.db = db;
        database.fetching = false;
        return db;
    }).catch(e => {
        delete databases[dbName];
        throw e;
    });
    database.fetching = fetching;
    return fetching;
}

function proton(molecule, options) {
    var _normalizeOptions = normalizeOptions(molecule, options);

    var _normalizeOptions2 = _slicedToArray(_normalizeOptions, 2);

    molecule = _normalizeOptions2[0];
    options = _normalizeOptions2[1];

    var db = getDb(options.db || 'proton', 'proton');
    options.atomLabel = 'H';
    return queryByHose(molecule, db, options);
}

function carbon(molecule, options) {
    var _normalizeOptions3 = normalizeOptions(molecule, options);

    var _normalizeOptions4 = _slicedToArray(_normalizeOptions3, 2);

    molecule = _normalizeOptions4[0];
    options = _normalizeOptions4[1];

    var db = getDb(options.db || 'carbon', 'carbon');
    options.atomLabel = 'C';
    return queryByHose(molecule, db, options);
}

function getDb(option, type) {
    if (typeof option === 'object') return option;
    if (typeof option !== 'string') throw new TypeError('database option must be a string or array');
    var db = databases[option];
    if (!db) throw new Error(`database ${option} does not exist. Did you forget to fetch it?`);
    if (db.fetching) throw new Error(`database ${option} is not fetched yet`);
    if (db.type !== type) throw new Error(`database ${option} is of type ${db.type} instead of ${type}`);
    return db.db;
}

module.exports = {
    fetchProton,
    fetchCarbon,
    proton,
    carbon,
    spinus,
    twoD
};

/***/ })
/******/ ]);
});