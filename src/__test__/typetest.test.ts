import { FormatTokenTuple } from '../struct_type'

import { Struct } from '../struct'

test('typecheck', () => {
  const v: FormatTokenTuple<'@2c'> = ['1', '3']
  expect(v).toStrictEqual(v)
})

test('@2c', () => {
  const st = new Struct('@2c')
  const v = st.unpack(st.pack('s', 'v'))
  expect(v).toStrictEqual(['s', 'v'])
})
test('@2l', () => {
  const st = new Struct('@2l')
  const v = st.unpack(st.pack(BigInt(3), BigInt(3)))
  expect(v).toStrictEqual([BigInt(3), BigInt(3)])
})
test('>2l', () => {
  const st = new Struct('>2l')
  const v = st.unpack(st.pack(3, 3))
  expect(v).toStrictEqual([3, 3])
})
