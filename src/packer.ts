import { FormatTokenTuple } from './struct_type'
import { splitTokens, formatOrder, Token } from './format'
import { WriteDataViewStream } from './stream'

export type Packer<T extends string> = (
  buffer: Uint8Array,
  offset: number,
  ...args: FormatTokenTuple<T>
) => void
export const packer = <T extends string>(format: T): Packer<T> => {
  const f = formatOrder(format)
  const tokens = splitTokens(format)
  const sizeMap = f.sizeMap
  return (
    buffer: Uint8Array,
    bufferOffset: number,
    ...args: FormatTokenTuple<T>
  ) => {
    const stream = new WriteDataViewStream(buffer, bufferOffset, f.le)

    const writeBoolean = (t: Token): void => {
      for (let i = 0; i < t.count; i++) {
        const v = args.shift()
        if (typeof v !== 'boolean') {
          throw Error('Invalid Argument type')
        }
        stream.writeUInt8(v ? 1 : 0)
      }
    }
    const skipPadding = (t: Token): void => {
      stream.skip(t.count)
    }

    const writeChar = (t: Token): void => {
      for (let i = 0; i < t.count; i++) {
        const v = args.shift()
        if (v instanceof Uint8Array) {
          stream.writeUInt8(v[0])
        } else if (typeof v === 'string') {
          stream.writeUInt8(v.charCodeAt(0))
        } else {
          throw Error('Invalid Argument type')
        }
      }
    }
    const writeString = (t: Token): void => {
      const v = args.shift()
      if (!(v instanceof Uint8Array)) {
        throw Error('Invalid Argument type')
      }
      for (let i = 0; i < t.count; i++) {
        stream.writeUInt8(v[i] || 0)
      }
    }
    const writeSInt = (t: Token): void => {
      const size = sizeMap[t.token]
      if (f.native) {
        stream.aligngment(size)
      }
      for (let i = 0; i < t.count; i++) {
        const v = args.shift()
        if (typeof v !== 'number' && typeof v !== 'bigint') {
          throw Error('Invalid Argument type')
        }
        stream.writeSInt(v, size)
      }
    }
    const writeUInt = (t: Token): void => {
      const size = sizeMap[t.token]
      if (f.native) {
        stream.aligngment(size)
      }
      for (let i = 0; i < t.count; i++) {
        const v = args.shift()
        if (typeof v !== 'number' && typeof v !== 'bigint') {
          throw Error('Invalid Argument')
        }
        stream.writeUInt(v, size)
      }
    }
    const writeFloat = (t: Token): void => {
      const size = sizeMap[t.token]
      if (f.native) {
        stream.aligngment(size)
      }
      for (let i = 0; i < t.count; i++) {
        const v = args.shift()
        if (typeof v !== 'number') {
          throw Error('Invalid Argument')
        }
        stream.writeFloat(v, size)
      }
    }

    const tokenWriterMap: Record<Token['token'], (t: Token) => void> = {
      '?': writeBoolean,
      x: skipPadding,
      c: writeChar,
      s: writeString,
      n: writeSInt,
      b: writeSInt,
      h: writeSInt,
      i: writeSInt,
      l: writeSInt,
      q: writeSInt,
      P: writeUInt,
      N: writeUInt,
      B: writeUInt,
      H: writeUInt,
      I: writeUInt,
      L: writeUInt,
      Q: writeUInt,
      f: writeFloat,
      d: writeFloat,
    }

    tokens.forEach((t) => tokenWriterMap[t.token](t))
  }
}
