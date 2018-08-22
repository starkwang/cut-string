'use strict';

var stringWidth = require('string-width');

function cutString(str, limit) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
        emojiWidth: 2
    };

    var chars = [];
    for (var i = 0; i < str.length; i++) {
        // console.log(str.codePointAt(i).toString(16))
    }
    for (var _i = 0; _i < str.length;) {
        var codePoint = str.codePointAt(_i);
        var nextCodePoint = str.codePointAt(_i + 1);
        if (codePoint > 0xffff) {
            chars.push([codePoint]);
            _i += 2;
            continue;
        } else if (nextCodePoint === 0xfe0f || nextCodePoint === 0xfe0e) {
            chars.push([codePoint, nextCodePoint]);
            _i += 2;
            continue;
        } else {
            chars.push([codePoint]);
            _i++;
            continue;
        }
    }

    chars = combineZWJ(chars);

    // console.log(chars)
    chars = chars.map(function (codePoints) {
        var isEmoji = codePoints[0] > 0xffff || codePoints[1] === 0xfe0f || codePoints[1] === 0xfe0e;
        return {
            character: codePoints.map(function (codePoint) {
                return String.fromCodePoint(codePoint);
            }).join(''),
            width: isEmoji ? options.emojiWidth : stringWidth(String.fromCodePoint(codePoints[0]))
        };
    });

    var totalWidth = 0;
    var result = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = chars[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var char = _step.value;

            totalWidth += char.width;
            if (totalWidth <= limit) {
                result.push(char);
            } else {
                break;
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

    return result.map(function (char) {
        return char.character;
    }).join('');
}

function combineZWJ(chars) {
    var hasReadZWJ = false;
    var previous = [];
    var result = [];
    for (var i = 0; i < chars.length; i++) {
        if (chars[i][0] === 0x200d) {
            hasReadZWJ = true;
            previous = previous.concat(chars[i]);
        } else {
            if (previous.length > 0) {
                if (!hasReadZWJ) {
                    result.push(previous);
                    previous = [];
                } else {}
            }
            previous = previous.concat(chars[i]);
            hasReadZWJ = false;
        }
    }

    if (previous.length > 0) {
        result.push(previous);
    }
    return result;
}

module.exports = cutString;