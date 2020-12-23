import { WriteDataViewStream, ReadDataViewStream } from '../stream'

describe('WriteDataViewStream', () => {
  test('writeSInt', () => {
    const array = new Uint8Array(8)
    const stream = new WriteDataViewStream(array, 0, true)
    stream.writeSInt(14, 4)
    expect(array).toStrictEqual(Uint8Array.from([14, 0, 0, 0, 0, 0, 0, 0]))
  })
  test('writeUInt', () => {
    const array = new Uint8Array(8)
    const stream = new WriteDataViewStream(array, 0, true)
    stream.writeUInt(14, 4)
    expect(array).toStrictEqual(Uint8Array.from([14, 0, 0, 0, 0, 0, 0, 0]))
  })
  test('writeSInt with invalid size', () => {
    const array = new Uint8Array(8)
    const stream = new WriteDataViewStream(array, 0, true)
    expect(() => stream.writeSInt(14, 0)).toThrowError()
    expect(() => stream.writeSInt(14, 6)).toThrowError()
  })

  test('writeUInt with invalid size', () => {
    const array = new Uint8Array(8)
    const stream = new WriteDataViewStream(array, 0, true)
    expect(() => stream.writeUInt(14, 0)).toThrowError()
    expect(() => stream.writeUInt(14, 6)).toThrowError()
  })
  test('writeFloat with invalid size', () => {
    const array = new Uint8Array(8)
    const stream = new WriteDataViewStream(array, 0, true)
    expect(() => stream.writeFloat(14, 0)).toThrowError()
    expect(() => stream.writeFloat(14, 6)).toThrowError()
  })
})

describe('ReadDataViewStream', () => {
  test('readSInt', () => {
    const array = new Uint8Array(8)
    const stream = new ReadDataViewStream(array, 0, true)
    expect(stream.readSInt(4)).toStrictEqual(0)
  })
  test('writeSInt with invalid size', () => {
    const array = new Uint8Array(8)
    const stream = new ReadDataViewStream(array, 0, true)
    expect(() => stream.readSInt(0)).toThrowError()
    expect(() => stream.readSInt(6)).toThrowError()
  })

  test('readUInt with invalid size', () => {
    const array = new Uint8Array(8)
    const stream = new ReadDataViewStream(array, 0, true)
    expect(() => stream.readUInt(0)).toThrowError()
    expect(() => stream.readUInt(6)).toThrowError()
  })
  test('readFloat with invalid size', () => {
    const array = new Uint8Array(8)
    const stream = new ReadDataViewStream(array, 0, true)
    expect(() => stream.readFloat(0)).toThrowError()
    expect(() => stream.readFloat(6)).toThrowError()
  })
})
