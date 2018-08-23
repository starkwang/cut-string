const cutString = require('.')
const ava = require('ava')

ava('cut string with default options', t => {
    var arr1 = [
        ['abcd', 3, 'abc'],
        ['ａｂｃｄ', 4, 'ａｂ'],
        ['👨‍👩‍👧', 0, ''],
        ['👨‍👩‍👧我😀❣️😸abc啊', 10, '👨‍👩‍👧我😀❣️😸'],
        ['\u001B\u001B古池や', 3, '\u001B\u001B古'],
        ['\u001B\u001B', 0, '\u001B\u001B'],
        ['🇦🇺🇦🇺🇦🇺🇦🇺🇦🇺', 4, '🇦🇺🇦🇺'],
        ['0️⃣0️⃣0️⃣0️⃣', 6, '0️⃣0️⃣0️⃣']
    ]

    arr1.forEach(([str, limit, result]) => {
        t.is(cutString(str, limit), result)
    })
})

ava('cut string with setting emojiWidth', t => {
    var arr2 = [
        ['👨‍👩‍👧我😀❣️😸abc啊', 10, '👨‍👩‍👧我😀'],
        ['a啊ＦＡ👨‍👩‍👧我😀❣️😸', 10, 'a啊ＦＡ👨‍👩‍👧']
    ]

    arr2.forEach(([str, limit, result]) => {
        t.is(cutString(str, limit, { emojiWidth: 3 }), result)
    })
})

ava('cut string with ellipsis', t => {
    var arr = [
        ['abcd', 3, 'a...'],
        ['ａｂｃｄ', 4, 'ａ...'],
        ['👨‍👩‍👧', 0, ''],
        ['👨‍👩‍👧我😀❣️😸abc啊', 10, '👨‍👩‍👧我😀❣️...'],
        ['\u001B\u001B古池や', 3, '\u001B\u001B...'],
        ['\u001B\u001B', 0, '\u001B\u001B'],
    ]

    arr.forEach(([str, limit, result]) => {
        t.is(cutString(str, limit, { ellipsis: true }), result)
    })

    var arr = [
        ['abcd', 3, 'a……'],
        ['ａｂｃｄ', 4, 'ａ……'],
        ['👨‍👩‍👧', 0, ''],
        ['👨‍👩‍👧我😀❣️😸abc啊', 10, '👨‍👩‍👧我😀❣️……'],
        ['\u001B\u001B古池や', 3, '\u001B\u001B……'],
        ['\u001B\u001B', 0, '\u001B\u001B'],
    ]

    arr.forEach(([str, limit, result]) => {
        t.is(cutString(str, limit, { ellipsis: true, ellipsisText: '……' }), result)
    })

    var arr = [
        ['abcd', 3, '……'],
        ['ａｂｃｄ', 5, 'ａ……'],
        ['👨‍👩‍👧', 0, ''],
        ['👨‍👩‍👧我😀❣️😸abc啊', 10, '👨‍👩‍👧我😀……'],
    ]

    arr.forEach(([str, limit, result]) => {
        t.is(cutString(str, limit, { ellipsis: true, ellipsisText: '……', ellipsisWidth: 3 }), result)
    })
})

