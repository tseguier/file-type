"use strict";

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _stream = _interopRequireDefault(require("stream"));

var _ava = _interopRequireDefault(require("ava"));

var _readChunk = _interopRequireDefault(require("read-chunk"));

var _pify = _interopRequireDefault(require("pify"));

var _noopStream = require("noop-stream");

var _ = _interopRequireDefault(require("."));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var supported = require('./supported');

var missingTests = ['asf', 'ogm', 'ogx', 'mpc'];
var types = supported.extensions.filter(function (ext) {
  return !missingTests.includes(ext);
}); // Define an entry here only if the fixture has a different
// name than `fixture` or if you want multiple fixtures

var names = {
  arw: ['fixture', 'fixture2', 'fixture3', 'fixture4'],
  dng: ['fixture', 'fixture2'],
  nef: ['fixture', 'fixture2'],
  '3gp': ['fixture', 'fixture2'],
  woff2: ['fixture', 'fixture-otto'],
  woff: ['fixture', 'fixture-otto'],
  eot: ['fixture', 'fixture-0x20001'],
  mov: ['fixture', 'fixture-mjpeg', 'fixture-moov'],
  mp2: ['fixture', 'fixture-mpa', 'fixture-faac-adts'],
  mp3: ['fixture', 'fixture-offset1-id3', 'fixture-offset1', 'fixture-mp2l3', 'fixture-ffe3'],
  mp4: ['fixture-imovie', 'fixture-isom', 'fixture-isomv2', 'fixture-mp4v2', 'fixture-dash', 'fixture-aac-adts'],
  tif: ['fixture-big-endian', 'fixture-little-endian'],
  gz: ['fixture.tar'],
  xz: ['fixture.tar'],
  lz: ['fixture.tar'],
  Z: ['fixture.tar'],
  mkv: ['fixture', 'fixture2'],
  mpg: ['fixture', 'fixture2'],
  heic: ['fixture-mif1', 'fixture-msf1', 'fixture-heic'],
  ape: ['fixture-monkeysaudio'],
  mpc: ['fixture-sv7', 'fixture-sv8'],
  pcap: ['fixture-big-endian', 'fixture-little-endian'],
  tar: ['fixture', 'fixture-v7'],
  mie: ['fixture-big-endian', 'fixture-little-endian']
}; // Define an entry here only if the file type has potential
// for false-positives

var falsePositives = {
  msi: ['fixture-ppt', 'fixture-doc', 'fixture-xls']
};

var checkBufferLike = function checkBufferLike(t, type, bufferLike) {
  var _ref = (0, _["default"])(bufferLike) || {},
      ext = _ref.ext,
      mime = _ref.mime;

  t.is(ext, type);
  t.is(_typeof(mime), 'string');
};

var testFile = function testFile(t, ext, name) {
  var file = _path["default"].join(__dirname, 'fixture', "".concat(name || 'fixture', ".").concat(ext));

  var chunk = _readChunk["default"].sync(file, 0, 4 + 4096);

  checkBufferLike(t, ext, chunk);
  checkBufferLike(t, ext, new Uint8Array(chunk));
  checkBufferLike(t, ext, chunk.buffer);
};

var testFalsePositive = function testFalsePositive(t, ext, name) {
  var file = _path["default"].join(__dirname, 'fixture', "".concat(name, ".").concat(ext));

  var chunk = _readChunk["default"].sync(file, 0, 4 + 4096);

  t.is((0, _["default"])(chunk), undefined);
  t.is((0, _["default"])(new Uint8Array(chunk)), undefined);
  t.is((0, _["default"])(chunk.buffer), undefined);
};

var testFileFromStream =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(t, ext, name) {
    var file, readableStream;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            file = _path["default"].join(__dirname, 'fixture', "".concat(name || 'fixture', ".").concat(ext));
            _context.next = 3;
            return _["default"].stream(_fs["default"].createReadStream(file));

          case 3:
            readableStream = _context.sent;
            t.deepEqual(readableStream.fileType, (0, _["default"])(_readChunk["default"].sync(file, 0, _["default"].minimumBytes)));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function testFileFromStream(_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var testStream =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(t, ext, name) {
    var file, readableStream, fileStream, loadEntireFile, _ref5, _ref6, bufferA, bufferB;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            file = _path["default"].join(__dirname, 'fixture', "".concat(name || 'fixture', ".").concat(ext));
            _context3.next = 3;
            return _["default"].stream(_fs["default"].createReadStream(file));

          case 3:
            readableStream = _context3.sent;
            fileStream = _fs["default"].createReadStream(file);

            loadEntireFile =
            /*#__PURE__*/
            function () {
              var _ref4 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2(readable) {
                var buffer, finished;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        buffer = [];
                        readable.on('data', function (chunk) {
                          buffer.push(Buffer.from(chunk));
                        });

                        if (!_stream["default"].finished) {
                          _context2.next = 8;
                          break;
                        }

                        finished = (0, _pify["default"])(_stream["default"].finished);
                        _context2.next = 6;
                        return finished(readable);

                      case 6:
                        _context2.next = 10;
                        break;

                      case 8:
                        _context2.next = 10;
                        return new Promise(function (resolve) {
                          return readable.on('end', resolve);
                        });

                      case 10:
                        return _context2.abrupt("return", Buffer.concat(buffer));

                      case 11:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function loadEntireFile(_x7) {
                return _ref4.apply(this, arguments);
              };
            }();

            _context3.next = 8;
            return Promise.all([loadEntireFile(readableStream), loadEntireFile(fileStream)]);

          case 8:
            _ref5 = _context3.sent;
            _ref6 = _slicedToArray(_ref5, 2);
            bufferA = _ref6[0];
            bufferB = _ref6[1];
            t["true"](bufferA.equals(bufferB));

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function testStream(_x4, _x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var i = 0;
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = types[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var type = _step.value;

    if (Object.prototype.hasOwnProperty.call(names, type)) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = names[type][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var name = _step4.value;
          (0, _ava["default"])("".concat(type, " ").concat(i++), testFile, type, name);
          (0, _ava["default"])(".stream() method - same fileType - ".concat(type, " ").concat(i++), testFileFromStream, type, name);
          (0, _ava["default"])(".stream() method - identical streams - ".concat(type, " ").concat(i++), testStream, type, name);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    } else {
      (0, _ava["default"])("".concat(type, " ").concat(i++), testFile, type);
      (0, _ava["default"])(".stream() method - same fileType - ".concat(type, " ").concat(i++), testFileFromStream, type);
      (0, _ava["default"])(".stream() method - identical streams - ".concat(type, " ").concat(i++), testStream, type);
    }

    if (Object.prototype.hasOwnProperty.call(falsePositives, type)) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = falsePositives[type][Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var falsePositiveFile = _step5.value;
          (0, _ava["default"])("false positive - ".concat(type, " ").concat(i++), testFalsePositive, type, falsePositiveFile);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
      _iterator["return"]();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

(0, _ava["default"])('.stream() method - empty stream',
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(t) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return t.throwsAsync(_["default"].stream((0, _noopStream.readableNoopStream)()), /Expected the `input` argument to be of type `Uint8Array` /);

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x8) {
    return _ref7.apply(this, arguments);
  };
}());
(0, _ava["default"])('.stream() method - error event',
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(t) {
    var errorMessage, readableStream;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            errorMessage = 'Fixture';
            readableStream = new _stream["default"].Readable({
              read: function read() {
                var _this = this;

                process.nextTick(function () {
                  _this.emit('error', new Error(errorMessage));
                });
              }
            });
            _context5.next = 4;
            return t.throwsAsync(_["default"].stream(readableStream), errorMessage);

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x9) {
    return _ref8.apply(this, arguments);
  };
}());
(0, _ava["default"])('fileType.minimumBytes', function (t) {
  t["true"](_["default"].minimumBytes > 4000);
});
(0, _ava["default"])('fileType.extensions.has', function (t) {
  t["true"](_["default"].extensions.has('jpg'));
  t["false"](_["default"].extensions.has('blah'));
});
(0, _ava["default"])('fileType.mimeTypes.has', function (t) {
  t["true"](_["default"].mimeTypes.has('video/mpeg'));
  t["false"](_["default"].mimeTypes.has('video/blah'));
});
(0, _ava["default"])('validate the input argument type', function (t) {
  t["throws"](function () {
    (0, _["default"])('x');
  }, /Expected the `input` argument to be of type `Uint8Array`/);
  t.notThrows(function () {
    (0, _["default"])(Buffer.from('x'));
  });
  t.notThrows(function () {
    (0, _["default"])(new Uint8Array());
  });
  t.notThrows(function () {
    (0, _["default"])(new ArrayBuffer());
  });
});
(0, _ava["default"])('validate the repo has all extensions and mimes in sync', function (t) {
  // File: index.js (base truth)
  function readIndexJS() {
    var index = _fs["default"].readFileSync('index.js', {
      encoding: 'utf8'
    });

    var extArray = index.match(/(?<=ext:\s')(.*)(?=',)/g);
    var mimeArray = index.match(/(?<=mime:\s')(.*)(?=')/g);
    var exts = new Set(extArray);
    var mimes = new Set(mimeArray);
    return {
      exts: exts,
      mimes: mimes
    };
  } // File: index.d.ts


  function readIndexDTS() {
    var index = _fs["default"].readFileSync('index.d.ts', {
      encoding: 'utf8'
    });

    var matches = index.match(/(?<=\|\s')(.*)(?=')/g);
    var extArray = [];
    var mimeArray = [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = matches[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var match = _step2.value;

        if (match.includes('/')) {
          mimeArray.push(match);
        } else {
          extArray.push(match);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return {
      extArray: extArray,
      mimeArray: mimeArray
    };
  } // File: package.json


  function readPackageJSON() {
    var index = _fs["default"].readFileSync('package.json', {
      encoding: 'utf8'
    });

    var _JSON$parse = JSON.parse(index),
        keywords = _JSON$parse.keywords;

    var allowedExtras = new Set(['mime', 'file', 'type', 'archive', 'image', 'img', 'pic', 'picture', 'flash', 'photo', 'video', 'detect', 'check', 'is', 'exif', 'binary', 'buffer', 'uint8array', 'webassembly']);
    var extArray = keywords.filter(function (keyword) {
      return !allowedExtras.has(keyword);
    });
    return extArray;
  } // File: readme.md


  function readReadmeMD() {
    var index = _fs["default"].readFileSync('readme.md', {
      encoding: 'utf8'
    });

    var extArray = index.match(/(?<=-\s\[`)(.*)(?=`)/g);
    return extArray;
  } // Helpers
  // Find extensions/mimes that are defined twice in a file


  function findDuplicates(input) {
    return input.reduce(function (accumulator, element, index, array) {
      if (array.indexOf(element) !== index && accumulator.indexOf(element) < 0) {
        accumulator.push(element);
      }

      return accumulator;
    }, []);
  } // Find extensions/mimes that are in another file but not in `index.js`


  function findExtras(array, set) {
    return array.filter(function (element) {
      return !set.has(element);
    });
  } // Find extensions/mimes that are in `index.js` but missing from another file


  function findMissing(array, set) {
    var missing = [];
    var other = new Set(array);
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = set[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var elemenet = _step3.value;

        if (!other.has(elemenet)) {
          missing.push(elemenet);
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
          _iterator3["return"]();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    return missing;
  } // Test runner


  function validate(found, baseTruth, fileName, extOrMime) {
    var duplicates = findDuplicates(found);
    var extras = findExtras(found, baseTruth);
    var missing = findMissing(found, baseTruth);
    t.is(duplicates.length, 0, "Found duplicate ".concat(extOrMime, ": ").concat(duplicates, " in ").concat(fileName, "."));
    t.is(extras.length, 0, "Extra ".concat(extOrMime, ": ").concat(extras, " in ").concat(fileName, "."));
    t.is(missing.length, 0, "Missing ".concat(extOrMime, ": ").concat(missing, " in ").concat(fileName, "."));
  } // Get the base truth of extensions and mimes supported from index.js


  var _readIndexJS = readIndexJS(),
      exts = _readIndexJS.exts,
      mimes = _readIndexJS.mimes; // Validate all extensions


  var filesWithExtensions = {
    'index.d.ts': readIndexDTS().extArray,
    'supported.js': supported.extensions,
    'package.json': readPackageJSON(),
    'readme.md': readReadmeMD()
  };

  for (var fileName in filesWithExtensions) {
    if (filesWithExtensions[fileName]) {
      var foundExtensions = filesWithExtensions[fileName];
      validate(foundExtensions, exts, fileName, 'extensions');
    }
  } // Validate all mimes


  var filesWithMimeTypes = {
    'index.d.ts': readIndexDTS().mimeArray,
    'supported.js': supported.mimeTypes
  };

  for (var _fileName in filesWithMimeTypes) {
    if (filesWithMimeTypes[_fileName]) {
      var foundMimeTypes = filesWithMimeTypes[_fileName];
      validate(foundMimeTypes, mimes, _fileName, 'mimes');
    }
  }
});