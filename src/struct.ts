import { FormatTokenTuple } from './struct_type'
import { splitTokens, formatOrder } from './format'

import { packer, Packer } from './packer'
import { unpacker, UnPacker } from './unpacker'

export const pack = <T extends string>(
  format: T,
  ...args: FormatTokenTuple<T>
): Uint8Array => {
  const size = calcsize(format)
  const buffer = new Uint8Array(size)
  packer(format)(buffer, 0, ...args)
  return buffer
}
export const pack_into = <T extends string>(
  format: T,
  buffer: Uint8Array,
  offset: number,
  ...args: FormatTokenTuple<T>
): void => {
  packer(format)(buffer, offset, ...args)
}
export const unpack = <T extends string>(
  format: T,
  buffer: Uint8Array
): FormatTokenTuple<T> => {
  return unpacker(format)(buffer, 0)
}
export const unpack_from = <T extends string>(
  format: T,
  buffer: Uint8Array,
  offset: number
): FormatTokenTuple<T> => {
  return unpacker(format)(buffer, offset)
}
export const calcsize = <T extends string>(format: T): number => {
  const f = formatOrder(format)
  const sizeMap = f.sizeMap
  const tokens = splitTokens(format)
  return tokens.reduce((prev, token) => {
    const s = sizeMap[token.token]
    const padding = f.native ? (s - (prev % s)) % s : 0
    return prev + padding + s * token.count
  }, 0)
}

export class Struct<T extends string> {
  readonly size: number
  private packer: Packer<T>
  private unpacker: UnPacker<T>
  constructor(readonly format: T) {
    this.size = calcsize(format)
    this.packer = packer(format)
    this.unpacker = unpacker(format)
  }
  pack(...arg: FormatTokenTuple<T>): Uint8Array {
    const buffer = new Uint8Array(this.size)
    this.packer(buffer, 0, ...arg)
    return buffer
  }
  pack_into(
    buffer: Uint8Array,
    offset: number,
    ...arg: FormatTokenTuple<T>
  ): void {
    if (buffer.length - offset < this.size) {
      throw Error('Not enough buffer.')
    }
    this.packer(buffer, offset, ...arg)
  }

  unpack(buffer: Uint8Array): FormatTokenTuple<T> {
    return this.unpacker(buffer, 0)
  }
  unpack_from(buffer: Uint8Array, offset: number): FormatTokenTuple<T> {
    return this.unpacker(buffer, offset)
  }
}
