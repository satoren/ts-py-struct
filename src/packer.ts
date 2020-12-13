import { FormatTokenTuple } from './struct_type'
import { splitTokens, formatOrder } from './format'

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
    const dataView = new DataView(
      buffer.buffer,
      buffer.byteOffset + bufferOffset
    )
    let offset = 0
    const putSInt = (value: number | BigInt, size: number) => {
      switch (size) {
        case 1:
          dataView.setInt8(offset, Number(value))
          break
        case 2:
          dataView.setInt16(offset, Number(value), f.le)
          break
        case 4:
          dataView.setInt32(offset, Number(value), f.le)
          break
        case 8:
          dataView.setBigInt64(offset, BigInt(value), f.le)
          break
      }
    }
    const putUInt = (value: number | BigInt, size: number) => {
      switch (size) {
        case 1:
          dataView.setUint8(offset, Number(value))
          break
        case 2:
          dataView.setUint16(offset, Number(value), f.le)
          break
        case 4:
          dataView.setUint32(offset, Number(value), f.le)
          break
        case 8:
          dataView.setBigUint64(offset, BigInt(value), f.le)
          break
      }
    }
    tokens.forEach((token) => {
      switch (token.token) {
        case '?': {
          for (let i = 0; i < token.count; i++) {
            const v = args.shift()
            if (typeof v !== 'boolean') {
              throw Error('Invalid Argument type')
            }
            dataView.setInt8(offset, v ? 1 : 0)
            offset += 1
          }
          break
        }
        case 'x': {
          offset += token.count
          break
        }
        case 'c': {
          for (let i = 0; i < token.count; i++) {
            const v = args.shift()
            if (v instanceof Uint8Array) {
              dataView.setUint8(offset, v[0])
            } else if (typeof v === 'string') {
              dataView.setUint8(offset, v.charCodeAt(0))
            } else {
              throw Error('Invalid Argument type')
            }
            offset += 1
          }
          break
        }
        case 's': {
          const v = args.shift()
          if (!(v instanceof Uint8Array)) {
            throw Error('Invalid Argument type')
          }
          for (let i = 0; i < token.count; i++) {
            dataView.setUint8(offset, v[i] || 0)
            offset += 1
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
          for (let i = 0; i < token.count; i++) {
            const v = args.shift()
            if (typeof v !== 'number' && typeof v !== 'bigint') {
              throw Error('Invalid Argument type')
            }
            const padding = f.native ? (size - (offset % size)) % size : 0
            offset += padding
            putSInt(v, size)
            offset += size
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
          for (let i = 0; i < token.count; i++) {
            const v = args.shift()
            if (typeof v !== 'number' && typeof v !== 'bigint') {
              throw Error('Invalid Argument')
            }
            const padding = f.native ? (size - (offset % size)) % size : 0
            offset += padding
            putUInt(v, size)
            offset += size
          }
          break
        }
        case 'f':
        case 'd': {
          const size = sizeMap[token.token]
          for (let i = 0; i < token.count; i++) {
            const v = args.shift()
            if (typeof v !== 'number') {
              throw Error('Invalid Argument')
            }
            const padding = f.native ? (size - (offset % size)) % size : 0
            offset += padding
            switch (size) {
              case 4:
                dataView.setFloat32(offset, v, f.le)
                break
              case 8:
                dataView.setFloat64(offset, v, f.le)
                break
            }
            offset += size
          }
          break
        }
      }
    })
  }
}
