import { FormatTokenTuple } from './struct_type'
import { splitTokens, formatOrder } from './format'

import { ReadDataViewStream } from './stream'

export type UnPacker<T extends string> = (
  buffer: Uint8Array,
  offset: number
) => FormatTokenTuple<T>
export const unpacker = <T extends string>(format: T): UnPacker<T> => {
  const f = formatOrder(format)
  const tokens = splitTokens(format)
  const sizeMap = f.sizeMap
  return (buffer: Uint8Array, bufferOffset: number): FormatTokenTuple<T> => {
    const stream = new ReadDataViewStream(buffer, bufferOffset, f.le)
    const ret:
      | FormatTokenTuple<T>
      | (string | number | Uint8Array | BigInt | boolean)[] = []
    tokens.forEach((token) => {
      switch (token.token) {
        case '?': {
          for (let i = 0; i < token.count; i++) {
            ret.push(stream.readUInt8() ? true : false)
          }
          break
        }
        case 'x': {
          stream.skip(token.count)
          break
        }
        case 'c': {
          for (let i = 0; i < token.count; i++) {
            ret.push(String.fromCharCode(stream.readUInt8()))
          }
          break
        }
        case 's': {
          const buffer = new Uint8Array(token.count)
          const dv = new DataView(buffer.buffer)
          for (let i = 0; i < token.count; i++) {
            dv.setUint8(i, stream.readUInt8())
          }
          ret.push(buffer)
          break
        }
        case 'n':
        case 'b':
        case 'h':
        case 'i':
        case 'l':
        case 'q': {
          const size = sizeMap[token.token]
          if (f.native) {
            stream.aligngment(size)
          }
          for (let i = 0; i < token.count; i++) {
            ret.push(stream.readSInt(size))
          }
          break
        }

        case 'P':
        case 'N':
        case 'B':
        case 'H':
        case 'I':
        case 'L':
        case 'Q': {
          const size = sizeMap[token.token]
          if (f.native) {
            stream.aligngment(size)
          }
          for (let i = 0; i < token.count; i++) {
            ret.push(stream.readUInt(size))
          }
          break
        }
        case 'f':
        case 'd': {
          const size = sizeMap[token.token]
          if (f.native) {
            stream.aligngment(size)
          }
          for (let i = 0; i < token.count; i++) {
            ret.push(stream.readFloat(size))
          }
          break
        }
      }
    })
    return ret as FormatTokenTuple<T>
  }
}
