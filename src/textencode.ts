/// https://developer.mozilla.org/ja/docs/Web/API/TextEncoder
export function textencode(str: string): Uint8Array {
  const len = str.length
  let resPos = -1
  // The Uint8Array's length must be at least 3x the length of the string because an invalid UTF-16
  //  takes up the equivelent space of 3 UTF-8 characters to encode it properly. However, Array's
  //  have an auto expanding length and 1.5x should be just the right balance for most uses.
  const resArr = new Uint8Array(len * 3)
  for (let i = 0; i !== len; ) {
    const firstcode = str.charCodeAt(i)
    i += 1
    if (firstcode >= 0xd800 && firstcode <= 0xdbff) {
      if (i === len) {
        resArr[(resPos += 1)] = 0xef /*0b11101111*/
        resArr[(resPos += 1)] = 0xbf /*0b10111111*/
        resArr[(resPos += 1)] = 0xbd /*0b10111101*/
        break
      }
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      const nextcode = str.charCodeAt(i)
      if (nextcode >= 0xdc00 && nextcode <= 0xdfff) {
        const codepoint =
          (firstcode - 0xd800) * 0x400 + nextcode - 0xdc00 + 0x10000
        i += 1
        resArr[(resPos += 1)] = (0x1e /*0b11110*/ << 3) | (codepoint >>> 18)
        resArr[(resPos += 1)] =
          (0x2 /*0b10*/ << 6) | ((codepoint >>> 12) & 0x3f) /*0b00111111*/
        resArr[(resPos += 1)] =
          (0x2 /*0b10*/ << 6) | ((codepoint >>> 6) & 0x3f) /*0b00111111*/
        resArr[(resPos += 1)] =
          (0x2 /*0b10*/ << 6) | (codepoint & 0x3f) /*0b00111111*/
        continue
      } else {
        resArr[(resPos += 1)] = 0xef /*0b11101111*/
        resArr[(resPos += 1)] = 0xbf /*0b10111111*/
        resArr[(resPos += 1)] = 0xbd /*0b10111101*/
        continue
      }
    }
    if (firstcode <= 0x007f) {
      resArr[(resPos += 1)] = (0x0 /*0b0*/ << 7) | firstcode
    } else if (firstcode <= 0x07ff) {
      resArr[(resPos += 1)] = (0x6 /*0b110*/ << 5) | (firstcode >>> 6)
      resArr[(resPos += 1)] =
        (0x2 /*0b10*/ << 6) | (firstcode & 0x3f) /*0b00111111*/
    } else {
      resArr[(resPos += 1)] = (0xe /*0b1110*/ << 4) | (firstcode >>> 12)
      resArr[(resPos += 1)] =
        (0x2 /*0b10*/ << 6) | ((firstcode >>> 6) & 0x3f) /*0b00111111*/
      resArr[(resPos += 1)] =
        (0x2 /*0b10*/ << 6) | (firstcode & 0x3f) /*0b00111111*/
    }
  }
  return resArr.subarray(0, resPos + 1)
}
