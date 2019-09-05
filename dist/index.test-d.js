"use strict";

var fs = _interopRequireWildcard(require("fs"));

var _tsd = require("tsd");

var _ = _interopRequireDefault(require("."));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

(0, _tsd.expectType)((0, _["default"])(new Buffer([0xff, 0xd8, 0xff])));
(0, _tsd.expectType)((0, _["default"])(new Uint8Array([0xff, 0xd8, 0xff])));
(0, _tsd.expectType)((0, _["default"])(new ArrayBuffer(42)));
var result = (0, _["default"])(new Buffer([0xff, 0xd8, 0xff]));

if (result !== undefined) {
  (0, _tsd.expectType)(result.ext);
  (0, _tsd.expectType)(result.mime);
}

(0, _tsd.expectType)(_["default"].minimumBytes);
(0, _tsd.expectType)(_["default"].extensions);
(0, _tsd.expectType)(_["default"].mimeTypes);
var readableStream = fs.createReadStream('file.png');

var streamWithFileType = _["default"].stream(readableStream);

(0, _tsd.expectType)(streamWithFileType); // expectType<FileTypeResult | undefined>((await streamWithFileType).fileType);