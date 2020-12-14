import { FormatTokenTuple } from './struct_type'
import { splitTokens, formatOrder } from './format'

class ReadStream {
  private dataView: DataView
  private le: boolean
  private offset = 0
  constructor(buffer: Uint8Array, offset: number, le: boolean) {
    this.dataView = new DataView(buffer.buffer, buffer.byteOffset + offset)
    this.le = le
  }
  readSInt<S extends number>(size: S): number | BigInt {
    const { offset, dataView, le } = this
    this.offset += size
    switch (size) {
      case 1:
        return dataView.getInt8(offset)
      case 2:
        return dataView.getInt16(offset, le)
      case 4:
        return dataView.getInt32(offset, le)
      case 8:
        return dataView.getBigInt64(offset, le)
    }
    return 0
  }
  readUInt8(): number {
    const { offset, dataView } = this
    this.offset += 1
    return dataView.getUint8(offset)
  }
  readUInt<S extends number>(size: S): number | BigInt {
    const { offset, dataView, le } = this
    this.offset += size
    switch (size) {
      case 1:
        return dataView.getUint8(offset)
      case 2:
        return dataView.getUint16(offset, le)
      case 4:
        return dataView.getUint32(offset, le)
      case 8:
        return dataView.getBigUint64(offset, le)
    }
    return 0
  }
  readFloat(size: number): number {
    const { offset, dataView, le } = this
    this.offset += size
    switch (size) {
      case 4:
        return dataView.getFloat32(offset, le)
      case 8:
        return dataView.getFloat64(offset, le)
    }
    return 0
  }
  aligngment(size: number) {
    const { offset } = this
    this.offset += (size - (offset % size)) % size
  }
  skip(size: number) {
    this.offset += size
  }
}

export type UnPacker<T extends string> = (
  buffer: Uint8Array,
  offset: number
) => FormatTokenTuple<T>
export const unpacker = <T extends string>(format: T): UnPacker<T> => {
  const f = formatOrder(format)
  const tokens = splitTokens(format)
  const sizeMap = f.sizeMap
  return (buffer: Uint8Array, bufferOffset: number): FormatTokenTuple<T> => {
    const stream = new ReadStream(buffer, bufferOffset, f.le)
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
