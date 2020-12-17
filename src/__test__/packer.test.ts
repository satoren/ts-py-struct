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
})
