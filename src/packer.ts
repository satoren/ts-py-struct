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
    const checkSIntRange = (
      value: number | bigint,
      size: number,
      token: string
    ) => {
      switch (size) {
        case 1:
          if (-128 > value || value > 127) {
            throw Error(`'${token}' format requires -128 <= number <= 127`)
          }
          break
        case 2:
          if (-32768 > value || value > 32767) {
            throw Error(`'${token}' format requires -32768 <= number <= 32767`)
          }
          break
        case 4:
          if (-2147483648 > value || value > 2147483647) {
            throw Error(
              `'${token}' format requires -2147483648 <= number <= 2147483647`
            )
          }
          break
        case 8:
          if (
            BigInt('-9223372036854775808') > value ||
            value > BigInt('9223372036854775807')
          ) {
            throw Error(
              `'${token}' format requires -9223372036854775808 <= number <= 9223372036854775807`
            )
          }
          break
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
        checkSIntRange(v, size, t.token)
        stream.writeSInt(v, size)
      }
    }
    const checkUIntRange = (
      value: number | bigint,
      size: number,
      token: string
    ) => {
      switch (size) {
        case 1:
          if (0 > value || value > 255) {
            throw Error(`'${token}' format requires 0 <= number <= 255`)
          }
          break
        case 2:
          if (0 > value || value > 65535) {
            throw Error(`'${token}' format requires 0 <= number <= 65535`)
          }
          break
        case 4:
          if (0 > value || value > 4294967295) {
            throw Error(`'${token}' format requires 0 <= number <= 4294967295`)
          }
          break
        case 8:
          if (0 > value || value > BigInt('18446744073709551615')) {
            throw Error(
              `'${token}' format requires 0 <= number <= 18446744073709551615`
            )
          }
          break
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
        checkUIntRange(v, size, t.token)
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
