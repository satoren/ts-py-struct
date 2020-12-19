import { packer } from '../packer'

describe('packer', () => {
  test('runtime typecheck', () => {
    expect(() =>
      packer('>c' as string)(new Uint8Array(4), 0, 21)
    ).toThrowError()
    expect(() =>
      packer('>?' as string)(new Uint8Array(4), 0, 321)
    ).toThrowError()
    expect(() =>
      packer('>s' as string)(new Uint8Array(4), 0, 321)
    ).toThrowError()
    expect(() =>
      packer('>i' as string)(new Uint8Array(4), 0, '1')
    ).toThrowError()
    expect(() =>
      packer('>I' as string)(new Uint8Array(4), 0, '2')
    ).toThrowError()
    expect(() =>
      packer('>f' as string)(new Uint8Array(4), 0, '2')
    ).toThrowError()
  })

  test('pack with array', () => {
    const b = new Uint8Array(10)
    packer('>10s')(b, 0, [3, 4, 5])
    expect(b).toStrictEqual(Uint8Array.of(3, 4, 5, 0, 0, 0, 0, 0, 0, 0))
  })
  test('pack with string', () => {
    const b = new Uint8Array(10)
    packer('>10s')(b, 0, 'abcd')
    expect(b).toStrictEqual(Uint8Array.of(97, 98, 99, 100, 0, 0, 0, 0, 0, 0))
  })
})
