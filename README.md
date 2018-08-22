# cut-string
Cut a string if too long. Support CJK and emoji❤️.


# Install

```bash
$ npm install cut-string
```

# Usage

```js
const cutString = require('cut-string')

cutString('ABCDEFG', 4)
//=> 'ABCD'

cutString('我在东北玩泥巴', 4)
//=> '我在'

cutString('👨‍👩‍👧😀❣️😸', 6)
//=> '👨‍👩‍👧😀❣️'

cutString('👨‍👩‍👧😀❣️😸', 6, { emojiWidth: 3 })
//=> '👨‍👩‍👧😀'

```