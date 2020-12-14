import { FormatTokenTuple } from './struct_type'
import { splitTokens, formatOrder } from './format'
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
    tokens.forEach((token) => {
      switch (token.token) {
        case '?': {
          for (let i = 0; i < token.count; i++) {
            const v = args.shift()
            if (typeof v !== 'boolean') {
              throw Error('Invalid Argument type')
            }
            stream.writeUInt8(v ? 1 : 0)
          }
          break
        }
        case 'x': {
          stream.skip(token.count)
          break
        }
        case 'c': {
          for (let i = 0; i < token.count; i++) {
            const v = args.shift()
            if (v instanceof Uint8Array) {
              stream.writeUInt8(v[0])
            } else if (typeof v === 'string') {
              stream.writeUInt8(v.charCodeAt(0))
            } else {
              throw Error('Invalid Argument type')
            }
          }
          break
        }
        case 's': {
          const v = args.shift()
          if (!(v instanceof Uint8Array)) {
            throw Error('Invalid Argument type')
          }
          for (let i = 0; i < token.count; i++) {
            stream.writeUInt8(v[i] || 0)
          }
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
            const v = args.shift()
            if (typeof v !== 'number' && typeof v !== 'bigint') {
              throw Error('Invalid Argument type')
            }
            stream.writeSInt(v, size)
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
            const v = args.shift()
            if (typeof v !== 'number' && typeof v !== 'bigint') {
              throw Error('Invalid Argument')
            }
            stream.writeUInt(v, size)
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
            const v = args.shift()
            if (typeof v !== 'number') {
              throw Error('Invalid Argument')
            }
            stream.writeFloat(v, size)
          }
          break
        }
      }
    })
  }
}
