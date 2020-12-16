import { FormatTokenTuple, TokenType } from './struct_type'
import { splitTokens, formatOrder, Token } from './format'

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

    const readBoolean = (t: Token) => {
      const ret = []
      for (let i = 0; i < t.count; i++) {
        ret.push(stream.readUInt8() ? true : false)
      }
      return ret
    }

    const skipPadding = (t: Token): TokenType[] => {
      stream.skip(t.count)
      return []
    }
    const readChar = (t: Token) => {
      const ret = []
      for (let i = 0; i < t.count; i++) {
        ret.push(String.fromCharCode(stream.readUInt8()))
      }
      return ret
    }
    const readString = (t: Token) => {
      const wb = new Uint8Array(t.count)
      const dv = new DataView(wb.buffer)
      for (let i = 0; i < t.count; i++) {
        dv.setUint8(i, stream.readUInt8())
      }
      return [wb]
    }

    const readSInt = (t: Token) => {
      const size = sizeMap[t.token]
      if (f.native) {
        stream.aligngment(size)
      }
      const ret = []
      for (let i = 0; i < t.count; i++) {
        ret.push(stream.readSInt(size))
      }
      return ret
    }

    const readUInt = (t: Token) => {
      const size = sizeMap[t.token]
      if (f.native) {
        stream.aligngment(size)
      }
      const ret = []
      for (let i = 0; i < t.count; i++) {
        ret.push(stream.readUInt(size))
      }
      return ret
    }

    const readFloat = (t: Token) => {
      const size = sizeMap[t.token]
      if (f.native) {
        stream.aligngment(size)
      }
      const ret = []
      for (let i = 0; i < t.count; i++) {
        ret.push(stream.readFloat(size))
      }
      return ret
    }

    const tokenReaderMap: Record<Token['token'], (t: Token) => TokenType[]> = {
      '?': readBoolean,
      x: skipPadding,
      c: readChar,
      s: readString,
      n: readSInt,
      b: readSInt,
      h: readSInt,
      i: readSInt,
      l: readSInt,
      q: readSInt,
      P: readUInt,
      N: readUInt,
      B: readUInt,
      H: readUInt,
      I: readUInt,
      L: readUInt,
      Q: readUInt,
      f: readFloat,
      d: readFloat,
    }

    return tokens.reduce(
      (prev, token) => [...prev, ...tokenReaderMap[token.token](token)],
      [] as TokenType[]
    ) as FormatTokenTuple<T>
  }
}
