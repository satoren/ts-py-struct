import { FormatTokenTuple } from '../struct_type'

test('typecheck', () => {
  const v: FormatTokenTuple<'@2c'> = ['1', '3']
  expect(v).toStrictEqual(v)
})
