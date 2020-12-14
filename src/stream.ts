class StreamPosition {
  protected offset = 0

  aligngment(size: number) {
    const { offset } = this
    this.offset += (size - (offset % size)) % size
  }
  skip(size: number) {
    this.offset += size
  }
}
export class WriteDataViewStream extends StreamPosition {
  private dataView: DataView
  private le: boolean
  constructor(buffer: Uint8Array, offset: number, le: boolean) {
    super()
    this.dataView = new DataView(buffer.buffer, buffer.byteOffset + offset)
    this.le = le
  }
  writeSInt(value: number | BigInt, size: number): void {
    const { offset, dataView, le } = this
    this.offset += size
    switch (size) {
      case 1:
        return dataView.setInt8(offset, Number(value))
      case 2:
        return dataView.setInt16(offset, Number(value), le)
      case 4:
        return dataView.setInt32(offset, Number(value), le)
      case 8:
        return dataView.setBigInt64(offset, BigInt(value), le)
    }
  }
  writeUInt8(value: number): void {
    const { offset, dataView } = this
    this.offset += 1
    return dataView.setUint8(offset, value)
  }
  writeUInt(value: number | BigInt, size: number): void {
    const { offset, dataView, le } = this
    this.offset += size
    switch (size) {
      case 1:
        return dataView.setUint8(offset, Number(value))
      case 2:
        return dataView.setUint16(offset, Number(value), le)
      case 4:
        return dataView.setUint32(offset, Number(value), le)
      case 8:
        return dataView.setBigUint64(offset, BigInt(value), le)
    }
  }
  writeFloat(value: number, size: number): void {
    const { offset, dataView, le } = this
    this.offset += size
    switch (size) {
      case 4:
        return dataView.setFloat32(offset, value, le)
      case 8:
        return dataView.setFloat64(offset, value, le)
    }
  }
}

export class ReadDataViewStream extends StreamPosition {
  private dataView: DataView
  private le: boolean
  constructor(buffer: Uint8Array, offset: number, le: boolean) {
    super()
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
}
