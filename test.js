const cutString = require('.')
const ava = require('ava')

ava('cut string with default options', t => {
    const arr1 = [
        ['abcd', 3, 'abc'],
        ['ａｂｃｄ', 4, 'ａｂ'],
        ['👨‍👩‍👧', 0, ''],
        ['👨‍👩‍👧我😀❣️😸abc啊', 10, '👨‍👩‍👧我😀❣️😸'],
        ['\u001B\u001B古池や', 3, '\u001B\u001B古'],
        ['\u001B\u001B', 0, '\u001B\u001B'],
    ]

    arr1.forEach(([str, limit, result]) => {
        t.is(cutString(str, limit), result)
    })
})

ava('cut string with setting emojiWidth', t => {
    const arr2 = [
        ['👨‍👩‍👧我😀❣️😸abc啊', 10, '👨‍👩‍👧我😀'],
        ['a啊ＦＡ👨‍👩‍👧我😀❣️😸', 10, 'a啊ＦＡ👨‍👩‍👧']
    ]

    arr2.forEach(([str, limit, result]) => {
        t.is(cutString(str, limit, { emojiWidth: 3 }), result)
    })
})

ava('cut string with ellipsis', t => {
    const arr1 = [
        ['abcd', 3, 'a...'],
        ['ａｂｃｄ', 4, 'ａ...'],
        ['👨‍👩‍👧', 0, ''],
        ['👨‍👩‍👧我😀❣️😸abc啊', 10, '👨‍👩‍👧我😀❣️...'],
        ['\u001B\u001B古池や', 3, '\u001B\u001B...'],
        ['\u001B\u001B', 0, '\u001B\u001B'],
    ]

    arr1.forEach(([str, limit, result]) => {
        t.is(cutString(str, limit, { ellipsis: true }), result)
    })
})