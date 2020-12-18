import { calcsize, pack, unpack, pack_into, unpack_from, Struct } from '../'
import { execSync } from 'child_process'

/*

function genRandomTestFormat(n: number,maxlen = 10): string[] {
    const ordertype = ['<' , '>' , '!' , '@' , '=' , '']
    
    const size = [
      '',...Array.from({length: 100},(_,k)=>`${k}`)
    ]
    const token = [
      'c',
      'b',
      'B',
      '?',
      'h',
      'H',
      'i',
      'I',
      'l',
      'L',
      'n',
      'N',
      'q',
      'Q',
      'f',
      'd',
      'P','x', 's'
    ]

    return Array.from({length: n},(_,k)=>k).map(()=> {
        const o = ordertype[Math.floor(Math.random() * ordertype.length)]

        const c = Math.floor(Math.random() * maxlen) + 1

        return [o,...Array.from({length: c},(_,k)=>k).map(()=> {
            const s = size[Math.floor(Math.random() * size.length)]
            const t = token[Math.floor(Math.random() * token.length)]
            return `${s}${t}`
        })].join('')
    })
}
 */

const calcsizeTestData = [
  ['>'],
  ['>ic'],
  ['>32h'],
  ['>32h'],
  ['>I4sIIBB'],
  ['>I4sIIBB'],
  ['>I4s IIBB'],
  ['>L'],
  ['<llh0l'],
  ['llh0l'],
  ['68b'],
  ['>75s14c98i48h37c87bb55L32l47b'],
  ['<81Q5H43f47f84l94x9d52Q75l82L'],
  ['<62x19i89c43b24I87b'],
  ['44?62xf78b30d79h43H'],
  ['!98B10I85Q40h55c'],
  ['@87i32q54I12x27f30f'],
  ['>21f33Q42c'],
  ['<86h44c97H80s74i14b96L11c'],
  ['@68l48s59H35q73q16x74h57l'],
  ['@13l32?26l'],
  ['<70i95?76H68b27x'],
  ['<6?63h'],
  ['@3I27l14i16L23Q98s'],
  ['!72x39x2L14f16H82l77h77s12Q96I'],
  ['>77f79?14L14q92d78H58i47B93H80b'],
  ['!15Q52i79b48?0h65Q23L27Q'],
  ['>40B81l2?71q29?'],
  ['!22Q44c48h44i40?4q51?79s42f'],
  ['<66?94s82H47i0Q95q73x6?60x'],
  ['=25i34i29B93B48h49i'],
  ['=78h'],
  ['74l6L97B28h77I42b17h'],
  ['!21Q45H29c88c43s84q49H12H'],
  ['6i97q88l72q43Q'],
  ['=34b85q0d46B4Q50Q75q94L'],
  ['<85f39c59H47x5f4f30s42q'],
  ['81x'],
  ['@27Q89L10s86x78x82f16l94b25h21B'],
  ['@74q46l'],
  ['@62b18H73i'],
  ['20f17L84h43Q34L62q72b36h'],
  ['<23l99h8b64l21x10lq63x'],
  ['=95h43x4B1f84d89I'],
  ['@3b26q6h52s64H54h85B86L'],
  ['@34?22PI38d31c'],
  ['11l13H4l55?11H12c'],
  ['=5x61d17f78d19f79h84I31x'],
  ['!3s13l69s62Q'],
  ['<33i49B'],
  ['=88q94Q'],
  ['<81i'],
  ['=83f16?92I21f52L85H'],
  ['>43f'],
  ['@24i90I64Q92d15d66s32f84i68q9?'],
  ['78q47i94?95f83b'],
  ['<56d44l13i31b48L54H7i8s90b76?'],
  ['!54B6i53Q56x79B78d25b94q'],
  ['>81d46B22d49b87B75d59c36x80?'],
  ['=0I10l95?13b24Q'],
  ['>16B46B'],
  ['77c87x5Q21s'],
  ['>89f39Q22i53I76s83i97l86?'],
  ['<85Q17Q94s42H12I56H'],
  ['73x43H3b52l49i30I77?'],
  ['!41f33h64s67s81?90L'],
  ['!83B85h79d95b36i41B'],
  ['>16q48l'],
  ['@18i5q54q10s'],
  ['=37H99Q2l24L80l28x1d'],
  ['=s40?i8Q71s93s61x12b'],
  ['@49q72s93c'],
  ['<67d65H'],
  ['@80f91d30c68B40i89x'],
  ['<27f85L65?94d76H74d'],
  ['<32x'],
  ['@95s70h34I64Q95Q45s24x10f'],
  ['97I53f86d78I64l94H61s10i65B'],
  ['@81B2c76f88L40c'],
  ['@41B32b23c88I99I11?0c38I45L7?'],
  ['>22b'],
  ['!64c62L74?79i61q'],
  ['>49l93?8f58b71H23h5l22?25s93x'],
  ['<42f'],
  ['<6b'],
  ['<93s5I69h91s'],
  ['!99c14c5l71Q29b24x25x'],
  ['!8L31I'],
  ['@16d98B81B15B70H54I25I'],
  ['!15L13I95I62q37Q55Q'],
  ['93h0x14Q'],
  ['@8x85I89Q90h5?51i'],
  ['@0l5?28i72B15s86?52q'],
  ['!27x10c14I70?19B35H1b'],
  ['!88I98d71Q'],
  ['>48I30Q'],
  ['<61h29H49q50f5s85b'],
  ['=9b'],
  ['=10L48x19h87l59b79x93l'],
  ['=42Ib94B69q'],
  ['=87b19L47f68Q14?'],
  ['@75i14i81f25H76d52f94h44H'],
  ['!29x51Q66I66B60B29L77?29I'],
  ['<67Q83d84i34c21i51f'],
  ['!91l2L93q37h'],
  ['=98?49B16d35l65i15L94L54Q99L'],
  ['>56i5d86H77l95?99i84H27f39Q'],
  ['=28Q50s56i91H18i18B81L0h39q'],
  ['@45Q70b76L9x29l94q48x99B94?'],
  ['>39q'],
] as const

test.each(calcsizeTestData)('calcsize compare with python(%s)', (f) => {
  const stdout = execSync(
    `python -c "import struct; print(struct.calcsize('${f}'))"`
  )
  expect(calcsize(f)).toBe(Number(stdout.toString('utf-8').trim()))
})

const toArray = (outtext: string): Uint8Array => {
  const a = []
  for (let i = 0; i < outtext.length; i += 3) {
    const hex = outtext.slice(i + 1, i + 3)
    a.push(parseInt(hex, 16))
  }
  return Uint8Array.from(a)
}
test('pack compare with python be', () => {
  const format = '>hhl'
  const stdout = execSync(
    `python -c "import struct; print(''.join(r'x{0:02x}'.format(ord(c)) for c in struct.pack('${format}', 1, 2, 3)))"`
  )

  const a = toArray(stdout.toString('utf-8').trim())
  expect(pack(format, 1, 2, 3)).toStrictEqual(a)
})
test('pack compare with python with native', () => {
  const format = 'hhl'
  const stdout = execSync(
    `python -c "import struct; print(''.join(r'x{0:02x}'.format(ord(c)) for c in struct.pack('${format}', 1, 2, 3)))"`
  )

  const a = toArray(stdout.toString('utf-8').trim())
  expect(pack(format, 1, 2, BigInt(3))).toStrictEqual(a)
})
type PackableType = number | Uint8Array | boolean | BigInt
const toPythonArgString = (...args: PackableType[]): string => {
  return args
    .map((a) => {
      if (typeof a === 'boolean') {
        return a ? 'True' : 'False'
      }
      if (typeof a === 'number') {
        return `${a}`
      }
      if (typeof a === 'string') {
        return `'${a}'`
      }
      if (typeof a === 'bigint') {
        return `${a}`
      }
      if (a instanceof Uint8Array) {
        const toHexString = (bytes: Uint8Array) =>
          bytes.reduce(
            (str, byte) => str + byte.toString(16).padStart(2, '0'),
            ''
          )
        return `binascii.unhexlify('${toHexString(a)}')`
      }
    })
    .join(',')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const packTestData: [string, any[]][] = [
  ['hHl', [7777, 65534, 3123213]],
  ['??', [true, false]],
  ['bB', [21, 212]],
  ['hH', [3432, 334]],
  ['iI', [2121213, 321232]],
  ['lL', [2121213, 321232]],
  ['qQ', [342434432432, 34243433432432]],
  ['fd', [321321.3212, 321432434321.3212]],
  ['2b2B', [-21, 122, 212, 12]],
  ['2h2H', [-3432, 31320, 334, 65535]],
  ['2i2I', [-2121213, 2121213, 321232, 42947294]],
  ['2l2L', [-2121213, 2121213, 321232, 32123232]],
  ['llh0lh', [-789, 456, 123, 321]],
  [
    '2q2Q',
    [
      BigInt(-342434432432),
      BigInt(342434432432),
      BigInt(34243433432432),
      BigInt(342434332433432432),
    ],
  ],
  ['2f2d', [-321321.3212, 321321.3212, -321432434321.3212, 321432434321.3212]],
  [
    '33x2fx2d3x',
    [-321321.3212, 321321.3212, -321432434321.3212, 321432434321.3212],
  ],
  [
    '102s',
    [Uint8Array.from([4, 23, 233, 43, 12, 76, 21, 68, 96, 31, 123, 144])],
  ],
  ['2c', [Uint8Array.from([4]), Uint8Array.from([54])]],
  ['2c', ['a', 'Z']],
]
test.each(packTestData)('native pack compare with python(%s)', (f, arg) => {
  const cmd = `python -c "import struct;import binascii; print(''.join(r'x{0:02x}'.format(ord(c)) for c in struct.pack('${f}',${toPythonArgString(
    ...arg
  )})))"`
  const stdout = execSync(cmd)
  const a = toArray(stdout.toString('utf-8').trim())
  expect(pack(f, ...arg)).toStrictEqual(a)
})

test.each(packTestData)('be pack compare with python(%s)', (f, arg) => {
  const format = `>${f}`
  const cmd = `python -c "import struct;import binascii; print(''.join(r'x{0:02x}'.format(ord(c)) for c in struct.pack('${format}',${toPythonArgString(
    ...arg
  )})))"`
  const stdout = execSync(cmd)
  const a = toArray(stdout.toString('utf-8').trim())
  expect(pack(format, ...arg)).toStrictEqual(a)
})

test.each(packTestData)('le pack compare with python(%s)', (f, arg) => {
  const format = `<${f}`
  const cmd = `python -c "import struct;import binascii; print(''.join(r'x{0:02x}'.format(ord(c)) for c in struct.pack('${format}',${toPythonArgString(
    ...arg
  )})))"`
  const stdout = execSync(cmd)
  const a = toArray(stdout.toString('utf-8').trim())
  expect(pack(format, ...arg)).toStrictEqual(a)
})

test.each(packTestData)('eq pack compare with python(%s)', (f, arg) => {
  const format = `=${f}`
  const cmd = `python -c "import struct;import binascii; print(''.join(r'x{0:02x}'.format(ord(c)) for c in struct.pack('${format}',${toPythonArgString(
    ...arg
  )})))"`
  const stdout = execSync(cmd)
  const a = toArray(stdout.toString('utf-8').trim())
  expect(pack(format, ...arg)).toStrictEqual(a)
})
test.each(packTestData)('nw pack compare with python(%s)', (f, arg) => {
  const format = `!${f}`
  const cmd = `python -c "import struct;import binascii; print(''.join(r'x{0:02x}'.format(ord(c)) for c in struct.pack('${format}',${toPythonArgString(
    ...arg
  )})))"`
  const stdout = execSync(cmd)
  const a = toArray(stdout.toString('utf-8').trim())
  expect(pack(format, ...arg)).toStrictEqual(a)
})
test.each(packTestData)('@native pack compare with python(%s)', (f, arg) => {
  const format = `@${f}`
  const cmd = `python -c "import struct;import binascii; print(''.join(r'x{0:02x}'.format(ord(c)) for c in struct.pack('${format}',${toPythonArgString(
    ...arg
  )})))"`
  const stdout = execSync(cmd)
  const a = toArray(stdout.toString('utf-8').trim())
  expect(pack(format, ...arg)).toStrictEqual(a)
})

test('native only pack compare with python', () => {
  const format = 'P'
  const arg = [BigInt(4431)] as const
  const cmd = `python -c "import struct;import binascii; print(''.join(r'x{0:02x}'.format(ord(c)) for c in struct.pack('${format}',${toPythonArgString(
    ...arg
  )})))"`
  const stdout = execSync(cmd)
  const a = toArray(stdout.toString('utf-8').trim())
  expect(pack(format, ...arg)).toStrictEqual(a)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unpackTestData: [string, any[]][] = [
  ['hHl', [7777, 65534, 3123213]],
  ['??', [true, false]],
  ['bB', [21, 212]],
  ['hH', [3432, 334]],
  ['iI', [2121213, 321232]],
  ['lL', [2121213, 321232]],
  ['fd', [321321.3125, 321432434321.3212]],
  ['2b2B', [-21, 122, 212, 12]],
  ['2h2H', [-3432, 31320, 334, 65535]],
  ['2i2I', [-2121213, 2121213, 321232, 42947294]],
  ['2l2L', [-2121213, 2121213, 321232, 32123232]],
  [
    '2q2Q',
    [BigInt(-2121213), BigInt(2121213), BigInt(321232), BigInt(32123232)],
  ],
  ['2f2d', [-321321.3125, 321321.3125, -321432434321.3125, 321432434321.3125]],
  ['llh0lh', [-789, 456, 123, 321]],
  ['llh0fh', [-789, 456, 123, 321]],
  [
    '33x2fx2d3x',
    [-321321.3125, 321321.3125, -321432434321.3212, 321432434321.3212],
  ],
  [
    '12s',
    [Uint8Array.from([4, 23, 233, 43, 12, 76, 21, 68, 96, 31, 123, 144])],
  ],
  ['2c', ['a', 'Z']],
]
test.each(unpackTestData)('le unpack compare with python(%s)', (f, arg) => {
  const format = `<${f}`
  const unpacked = unpack(format, pack(format, ...arg))
  expect(unpacked).toStrictEqual(arg)
})
test.each(unpackTestData)('be unpack compare with python(%s)', (f, arg) => {
  const format = `>${f}`
  const unpacked = unpack(format, pack(format, ...arg))
  expect(unpacked).toStrictEqual(arg)
})
test.each(unpackTestData)('neto unpack compare with python(%s)', (f, arg) => {
  const format = `!${f}`
  const unpacked = unpack(format, pack(format, ...arg))
  expect(unpacked).toStrictEqual(arg)
})
test.each(unpackTestData)('eq unpack compare with python(%s)', (f, arg) => {
  const format = `=${f}`
  const unpacked = unpack(format, pack(format, ...arg))
  expect(unpacked).toStrictEqual(arg)
})
test.each(unpackTestData)('eq unpack compare with python(%s)', (f, arg) => {
  const format = `${f}`
  // Skip l and L because that is bigint
  if (format.includes('l') || format.includes('L')) {
    return
  }
  const unpacked = unpack(format, pack(format, ...arg))
  expect(unpacked).toStrictEqual(arg)
})

const alignCheckTestData = [
  ['<b', [127]],
  ['<b', [-128]],
  ['<B', [255]],
  ['<B', [0]],
  ['<h', [32767]],
  ['<h', [-32768]],
  ['<H', [65535]],
  ['<H', [0]],
  ['<i', [2147483647]],
  ['<i', [-2147483648]],
  ['<I', [4294967295]],
  ['<I', [0]],
  ['<l', [2147483647]],
  ['<l', [-2147483648]],
  ['<L', [4294967295]],
  ['<L', [0]],
  ['<q', [BigInt('9223372036854775807')]],
  ['<q', [BigInt('-9223372036854775808')]],
  ['<Q', [BigInt('18446744073709551615')]],
  ['<Q', [BigInt(0)]],
] as const

test.each(alignCheckTestData)('align check%s %s', (f, v) => {
  expect(unpack(f, pack(f as string, v[0]))).toStrictEqual(v)
})

const OOLTestData = [
  ['<b', [127 + 1]],
  ['<b', [-128 - 1]],
  ['<B', [255 + 1]],
  ['<B', [0 - 1]],
  ['<h', [32767 + 1]],
  ['<h', [-32768 - 1]],
  ['<H', [65535 + 1]],
  ['<H', [0 - 1]],
  ['<i', [2147483647 + 1]],
  ['<i', [-2147483648 - 1]],
  ['<I', [4294967295 + 1]],
  ['<I', [0 - 1]],
  ['<l', [2147483647 + 1]],
  ['<l', [-2147483648 - 1]],
  ['<L', [4294967295 + 1]],
  ['<L', [0 - 1]],
  ['<q', [BigInt('9223372036854775807') + BigInt(1)]],
  ['<q', [BigInt('-9223372036854775808') - BigInt(1)]],
  ['<Q', [BigInt('18446744073709551615') + BigInt(1)]],
  ['<Q', [BigInt(0) - BigInt(1)]],
] as const

test.each(OOLTestData)('out of range(%s, %s)', (f, v) => {
  expect(() => pack(f, ...v)).toThrowError()
})

test('pack_into/unpack_from', () => {
  const buffer = new Uint8Array(10)
  const format = '2c'
  const packValues = ['A', '0'] as const
  pack_into(format, buffer, 8, ...packValues)
  const unpacked = unpack_from(format, buffer, 8)
  expect(unpacked[0]).toBe(packValues[0])
  expect(unpacked[1]).toBe(packValues[1])
})
test('pack string with 0 fill', () => {
  const format = '10s'
  const packValues = Uint8Array.from(
    '123456'.split('').map((c) => c.charCodeAt(0))
  )

  expect(pack(format, packValues)).toStrictEqual(
    Uint8Array.from([49, 50, 51, 52, 53, 54, 0, 0, 0, 0])
  )
})

describe('class interface', () => {
  test('BigInt', () => {
    const s = new Struct('2Q2q')
    const packValues = [
      BigInt(23),
      BigInt(320032),
      BigInt(-320032),
      BigInt(320032),
    ] as const
    const packed = s.pack(...packValues)
    const unpacked: [bigint, bigint, bigint, bigint] = s.unpack(packed)
    expect(unpacked[0]).toBe(packValues[0])
    expect(unpacked[1]).toBe(packValues[1])
    expect(unpacked[2]).toBe(packValues[2])
    expect(unpacked[3]).toBe(packValues[3])
  })
  test('c', () => {
    const s = new Struct('2c')
    const packValues = ['A', '0'] as const
    const packed = s.pack(...packValues)
    const unpacked: [string, string] = s.unpack(packed)
    expect(unpacked[0]).toBe(packValues[0])
    expect(unpacked[1]).toBe(packValues[1])
  })
  test('pack_into/unpack_from', () => {
    const buffer = new Uint8Array(10)
    const s = new Struct('2c')
    const packValues = ['A', '0'] as const
    s.pack_into(buffer, 8, ...packValues)
    const unpacked = s.unpack_from(buffer, 8)
    expect(unpacked[0]).toBe(packValues[0])
    expect(unpacked[1]).toBe(packValues[1])

    expect(() => s.pack_into(buffer, 10, ...packValues)).toThrowError(
      'Not enough buffer.'
    )
  })
})
