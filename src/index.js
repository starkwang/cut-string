const stringWidth = require('string-width')
const { hasUnicode, unicodeToArray } = require('./utils')

function cut (str, limit, options) {
    options = {
        emojiWidth: 2,
        ellipsis: false,
        ellipsisText: '...',
        ellipsisWidth: 2,
        ...options
    }

    const chars = unicodeToArray(str).map(char => {
        return {
            character: char,
            width: hasUnicode(char) ? options.emojiWidth : stringWidth(char)
        }
    })

    var totalWidth = 0
    const result = []
    let hasEllipsis = false
    for (let char of chars) {
        if (totalWidth + char.width <= limit) {
            result.push(char)
            totalWidth += char.width
        } else {
            hasEllipsis = true
            break
        }
    }

    let deleteWidth = limit - totalWidth
    if (options.ellipsis && hasEllipsis && result.length > 0) {
        for (let i = result.length - 1; i >= 0; i--) {
            deleteWidth += result[i].width
            delete result[i]
            if (deleteWidth >= options.ellipsisWidth) {
                result.push({
                    character: options.ellipsisText,
                    width: options.ellipsisWidth
                })
                break
            }
        }
    }
    return result.map(char => char.character).join('')
}

module.exports = cut