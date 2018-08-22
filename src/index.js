'use strict'

const stringWidth = require('string-width')

function cutString (str, limit, options) {
    options = {
        emojiWidth: 2,
        ellipsis: false,
        ...options
    }
    let chars = []
    for (let i = 0; i < str.length; i++) {
        // console.log(str.codePointAt(i).toString(16))
    }
    for (let i = 0; i < str.length;) {
        const codePoint = str.codePointAt(i);
        const nextCodePoint = str.codePointAt(i + 1)
        if (codePoint > 0xffff) {
            chars.push([codePoint])
            i += 2
            continue
        } else if (nextCodePoint === 0xfe0f || nextCodePoint === 0xfe0e) {
            chars.push([codePoint, nextCodePoint])
            i += 2
            continue
        } else {
            chars.push([codePoint])
            i++
            continue
        }
    }

    chars = combineZWJ(chars)


    // console.log(chars)
    chars = chars.map(codePoints => {
        const isEmoji = codePoints[0] > 0xffff || codePoints[1] === 0xfe0f || codePoints[1] === 0xfe0e
        return {
            character: codePoints.map(codePoint => String.fromCodePoint(codePoint)).join(''),
            width: isEmoji ? options.emojiWidth : (stringWidth(String.fromCodePoint(codePoints[0])))
        }
    })

    var totalWidth = 0
    const result = []
    let hasEllipsis = false
    for (let char of chars) {
        totalWidth += char.width
        if (totalWidth <= limit) {
            result.push(char)
        } else {
            hasEllipsis = true
            break
        }
    }

    let deleteWidth = 0

    if (options.ellipsis && hasEllipsis && result.length > 0) {
        for (let i = result.length - 1; i >= 0; i--) {
            deleteWidth += result[i].width
            delete result[i]
            if (deleteWidth >= 2) {
                result.push({
                    character: '...',
                    width: 2
                })
                break
            }
        }
    }

    return result.map(char => char.character).join('')
}

function combineZWJ(chars) {
    let hasReadZWJ = false
    let previous = []
    const result = []
    for (let i = 0; i < chars.length; i++) {
        if (chars[i][0] === 0x200d) {
            hasReadZWJ = true
            previous = previous.concat(chars[i])
        } else {
            if (previous.length > 0) {
                if (!hasReadZWJ) {
                    result.push(previous)
                    previous = []
                } else {

                }
            }
            previous = previous.concat(chars[i])
            hasReadZWJ = false
        }
    }

    if (previous.length > 0) {
        result.push(previous)
    }
    return result;
}

module.exports = cutString
