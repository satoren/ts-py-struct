import { RepeatA } from './repeat'

type OrderType = '<' | '>' | '!' | '@' | '=' | ''

export type RepeatableFormatChar =
  | 'c'
  | 'b'
  | 'B'
  | '?'
  | 'h'
  | 'H'
  | 'i'
  | 'I'
  | 'l'
  | 'L'
  | 'n'
  | 'N'
  | 'q'
  | 'Q'
  | 'f'
  | 'd'
  | 'P'
export type LengthFormatChar = 'x' | 's'

export type FormatChar = RepeatableFormatChar | LengthFormatChar

type TokenCharTypeMap = {
  s: Uint8Array
  p: string
  x: never
  c: string
  b: number
  B: number
  '?': boolean
  h: number
  H: number
  i: number
  I: number
  l: number
  L: number
  n: number
  N: number
  q: BigInt
  Q: BigInt
  f: number
  d: number
  P: BigInt
}
type TokenType = TokenCharTypeMap[FormatChar]

type Digit = `${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
type Char = Digit | FormatChar

type Tail<T extends string> = T extends `${Char}${infer U}` ? U : never
type First<T extends string> = T extends `${infer U}${Tail<T>}` ? U : never

type NormalizeCountDigits<CountDigits extends string[]> = CountDigits extends []
  ? ['1']
  : CountDigits

type ToTypeTuple<
  T extends FormatChar,
  CountDigits extends string[]
> = T extends LengthFormatChar
  ? TokenCharTypeMap[T] extends never
    ? []
    : [TokenCharTypeMap[T]]
  : T extends RepeatableFormatChar
  ? RepeatA<TokenCharTypeMap[T], NormalizeCountDigits<CountDigits>>
  : never

type ParseTokenSub<
  T extends string,
  CountDigitsHolder extends string[] = []
> = T extends ''
  ? []
  : First<T> extends infer D
  ? D extends Digit
    ? ParseTokenSub<Tail<T>, [...CountDigitsHolder, D]>
    : D extends FormatChar
    ? { type: ToTypeTuple<D, CountDigitsHolder>; next: ParseTokenSub<Tail<T>> }
    : never
  : never

type Flatten<T> = T extends { type: infer TYPES }
  ? TYPES extends unknown[]
    ? T extends { next: infer U }
      ? [...TYPES, ...Flatten<Flatten2<U>>]
      : [...TYPES]
    : []
  : []

type Flatten2<T> = T extends {
  type: infer TYPES
  next: { type: infer TYPES2; next: infer U }
}
  ? TYPES extends unknown[]
    ? TYPES2 extends unknown[]
      ? { type: [...TYPES, ...TYPES2]; next: Flatten2<U> }
      : T
    : T
  : T

type ParseToken<T extends string> = Flatten<ParseTokenSub<T>>

export type FormatTokenTuple<T extends string> = string extends T
  ? TokenType[]
  : T extends `${OrderType}${infer U}`
  ? ParseToken<U>
  : never
