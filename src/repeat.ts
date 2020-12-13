// referenced https://techracho.bpsinc.jp/yoshi/2020_09_04/97108

type Digit = `${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`

type Tile10<T extends unknown[]> = [
  ...T,
  ...T,
  ...T,
  ...T,
  ...T,
  ...T,
  ...T,
  ...T,
  ...T,
  ...T
]

type Tile<T extends unknown[], N extends Digit> = [
  [],
  [...T],
  [...T, ...T],
  [...T, ...T, ...T],
  [...T, ...T, ...T, ...T],
  [...T, ...T, ...T, ...T, ...T],
  [...T, ...T, ...T, ...T, ...T, ...T],
  [...T, ...T, ...T, ...T, ...T, ...T, ...T],
  [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T],
  [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T]
][N]

type Tail<T extends unknown[]> = ((...t: T) => unknown) extends (
  _: T[0],
  ...tail: infer U
) => unknown
  ? U
  : []

export type RepeatA<
  T,
  N extends string[],
  X extends unknown[] = []
> = N extends []
  ? X
  : N[0] extends infer U
  ? U extends Digit
    ? RepeatA<T, Tail<N>, [...Tile<[T], U>, ...Tile10<X>]>
    : never
  : never
