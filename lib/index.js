'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var stringWidth = require('string-width');

var _require = require('./utils'),
    hasUnicode = _require.hasUnicode,
    unicodeToArray = _require.unicodeToArray;

function cut(str, limit, options) {
    options = _extends({
        emojiWidth: 2,
        ellipsis: false,
        ellipsisText: '...',
        ellipsisWidth: 2
    }, options);

    var chars = unicodeToArray(str).map(function (char) {
        return {
            character: char,
            width: hasUnicode(char) ? options.emojiWidth : stringWidth(char)
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
        for (var i = result.length - 1; i >= 0; i--) {
            deleteWidth += result[i].width;
            delete result[i];
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

module.exports = cut;