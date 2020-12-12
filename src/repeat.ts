// referenced https://techracho.bpsinc.jp/yoshi/2020_09_04/97108

type Digit = `${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
type TailDigit<T extends string> = T extends `${Digit}${infer U}` ? U : never
type FirstDigit<T extends string> = T extends `${infer U}${TailDigit<T>}`
  ? U
  : never
type Tile<T extends unknown[], N extends Digit | '10'> = [
  [],
  [...T],
  [...T, ...T],
  [...T, ...T, ...T],
  [...T, ...T, ...T, ...T],
  [...T, ...T, ...T, ...T, ...T],
  [...T, ...T, ...T, ...T, ...T, ...T],
  [...T, ...T, ...T, ...T, ...T, ...T, ...T],
  [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T],
  [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T],
  [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T]
][N]

type MakeTupleImpl<
  T,
  N extends string,
  X extends unknown[] = []
> = string extends N
  ? never
  : N extends ''
  ? X
  : FirstDigit<N> extends infer U
  ? U extends Digit
    ? MakeTupleImpl<T, TailDigit<N>, [...Tile<[T], U>, ...Tile<X, '10'>]>
    : never
  : never
export type Repeat<T, N extends number | string> = MakeTupleImpl<T, `${N}`>
