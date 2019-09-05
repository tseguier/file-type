'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

exports.stringToBytes = function (string) {
  return _toConsumableArray(string).map(function (character) {
    return character.charCodeAt(0);
  });
};

var uint8ArrayUtf8ByteString = function uint8ArrayUtf8ByteString(array, start, end) {
  return String.fromCharCode.apply(String, _toConsumableArray(array.slice(start, end)));
};

exports.readUInt64LE = function (buffer) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var n = buffer[offset];
  var mul = 1;
  var i = 0;

  while (++i < 8) {
    mul *= 0x100;
    n += buffer[offset + i] * mul;
  }

  return n;
};

exports.tarHeaderChecksumMatches = function (buffer) {
  if (buffer.length < 512) {
    // `tar` header size, cannot compute checksum without it
    return false;
  }

  var MASK_8TH_BIT = 0x80;
  var sum = 256; // Intitalize sum, with 256 as sum of 8 spaces in checksum field

  var signedBitSum = 0; // Initialize signed bit sum

  for (var i = 0; i < 148; i++) {
    var _byte = buffer[i];
    sum += _byte;
    signedBitSum += _byte & MASK_8TH_BIT; // Add signed bit to signed bit sum
  } // Skip checksum field


  for (var _i = 156; _i < 512; _i++) {
    var _byte2 = buffer[_i];
    sum += _byte2;
    signedBitSum += _byte2 & MASK_8TH_BIT; // Add signed bit to signed bit sum
  }

  var readSum = parseInt(uint8ArrayUtf8ByteString(buffer, 148, 154), 8); // Read sum in header
  // Some implementations compute checksum incorrectly using signed bytes

  return (// Checksum in header equals the sum we calculated
    readSum === sum || // Checksum in header equals sum we calculated plus signed-to-unsigned delta
    readSum === sum - (signedBitSum << 1)
  );
};

exports.multiByteIndexOf = function (buffer, bytesToSearch) {
  var startAt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  // `Buffer#indexOf()` can search for multiple bytes
  if (Buffer && Buffer.isBuffer(buffer)) {
    return buffer.indexOf(Buffer.from(bytesToSearch), startAt);
  }

  var nextBytesMatch = function nextBytesMatch(buffer, bytes, startIndex) {
    for (var i = 1; i < bytes.length; i++) {
      if (bytes[i] !== buffer[startIndex + i]) {
        return false;
      }
    }

    return true;
  }; // `Uint8Array#indexOf()` can search for only a single byte


  var index = buffer.indexOf(bytesToSearch[0], startAt);

  while (index >= 0) {
    if (nextBytesMatch(buffer, bytesToSearch, index)) {
      return index;
    }

    index = buffer.indexOf(bytesToSearch[0], index + 1);
  }

  return -1;
};

exports.uint8ArrayUtf8ByteString = uint8ArrayUtf8ByteString;