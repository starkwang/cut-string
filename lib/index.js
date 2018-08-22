'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var stringWidth = require('string-width');

function isRegionalIndicatorSymbol(codePoint) {
    return 0x1f1e6 <= codePoint && codePoint <= 0x1f1ff;
}

function cutString(str, limit, options) {
    options = _extends({
        emojiWidth: 2,
        ellipsis: false,
        ellipsisText: '...',
        ellipsisWidth: 2
    }, options);
    var chars = [];
    for (var i = 0; i < str.length; i++) {
        // console.log(str.codePointAt(i).toString(16))
    }
    for (var _i = 0; _i < str.length;) {
        var codePoint = str.codePointAt(_i);
        var nextCodePoint = str.codePointAt(_i + 1);
        if (codePoint > 0xffff) {
            if (isRegionalIndicatorSymbol(codePoint) && isRegionalIndicatorSymbol(str.codePointAt(_i + 2))) {
                // Regional Indicator Symbol
                chars.push([codePoint, str.codePointAt(_i + 2)]);
                _i += 4;
            } else {
                chars.push([codePoint]);
                _i += 2;
            }
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
    var hasEllipsis = false;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = chars[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var char = _step.value;

            if (totalWidth + char.width <= limit) {
                result.push(char);
                totalWidth += char.width;
            } else {
                hasEllipsis = true;
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

    var deleteWidth = limit - totalWidth;
    if (options.ellipsis && hasEllipsis && result.length > 0) {
        for (var _i2 = result.length - 1; _i2 >= 0; _i2--) {
            deleteWidth += result[_i2].width;
            delete result[_i2];
            if (deleteWidth >= options.ellipsisWidth) {
                result.push({
                    character: options.ellipsisText,
                    width: options.ellipsisWidth
                });
                break;
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