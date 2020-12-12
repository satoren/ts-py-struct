import { FormatTokenTuple } from './struct_type'
import { splitTokens, formatOrder } from './format'

export type UnPacker<T extends string> = (
  buffer: Uint8Array,
  offset: number
) => FormatTokenTuple<T>
export const unpacker = <T extends string>(format: T): UnPacker<T> => {
  const f = formatOrder(format)
  const tokens = splitTokens(format)
  const sizeMap = f.sizeMap
  return (buffer: Uint8Array, bufferOffset: number): FormatTokenTuple<T> => {
    const dataView = new DataView(
      buffer.buffer,
      buffer.byteOffset + bufferOffset
    )
    let offset = 0
    const ret:
      | FormatTokenTuple<T>
      | (string | number | Uint8Array | BigInt | boolean)[] = []
    const getSInt = (size: number): number | BigInt => {
      switch (size) {
        case 1:
          return dataView.getInt8(offset)
        case 2:
          return dataView.getInt16(offset, f.le)
        case 4:
          return dataView.getInt32(offset, f.le)
        case 8:
          return dataView.getBigInt64(offset, f.le)
      }
      return 0
    }
    const getUInt = (size: number): number | BigInt => {
      switch (size) {
        case 1:
          return dataView.getUint8(offset)
        case 2:
          return dataView.getUint16(offset, f.le)
        case 4:
          return dataView.getUint32(offset, f.le)
        case 8:
          return dataView.getBigUint64(offset, f.le)
      }
      return 0
    }
    tokens.forEach((token) => {
      switch (token.token) {
        case '?': {
          for (let i = 0; i < token.count; i++) {
            ret.push(dataView.getInt8(offset) ? true : false)
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
            ret.push(String.fromCharCode(dataView.getInt8(offset)))
            offset += 1
          }
          break
        }
        case 's': {
          const buffer = new Uint8Array(token.count)
          const dv = new DataView(buffer.buffer)
          for (let i = 0; i < token.count; i++) {
            dv.setUint8(i, dataView.getUint8(offset))
            offset += 1
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
          for (let i = 0; i < token.count; i++) {
            const padding = f.native ? (size - (offset % size)) % size : 0
            offset += padding
            ret.push(getSInt(size))
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
            const padding = f.native ? (size - (offset % size)) % size : 0
            offset += padding
            ret.push(getUInt(size))
            offset += size
          }
          break
        }
        case 'f':
        case 'd': {
          const size = sizeMap[token.token]
          for (let i = 0; i < token.count; i++) {
            const padding = f.native ? (size - (offset % size)) % size : 0
            offset += padding
            switch (size) {
              case 4:
                ret.push(dataView.getFloat32(offset, f.le))
                break
              case 8:
                ret.push(dataView.getFloat64(offset, f.le))
                break
            }
            offset += size
          }
          break
        }
      }
    })
    return ret as FormatTokenTuple<T>
  }
}
