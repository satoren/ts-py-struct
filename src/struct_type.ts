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

type StandardTokenCharTypeMap = {
  s: Uint8Array
  p: string
  x: void
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
  n: never
  N: never
  q: bigint
  Q: bigint
  f: number
  d: number
  P: never
}

type NativeTokenCharTypeMap = {
  s: Uint8Array
  p: string
  x: void
  c: string
  b: number
  B: number
  '?': boolean
  h: number
  H: number
  i: number
  I: number
  l: bigint
  L: bigint
  n: bigint
  N: bigint
  q: bigint
  Q: bigint
  f: number
  d: number
  P: bigint
}

export type TokenType = StandardTokenCharTypeMap[FormatChar]

type Digit = `${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
type Char = Digit | FormatChar

type Tail<T extends string> = T extends `${Char}${infer U}` ? U : never
type First<T extends string> = T extends `${infer U}${Tail<T>}` ? U : never

type NormalizeCountDigits<CountDigits extends string[]> = CountDigits extends []
  ? ['1']
  : CountDigits

type ChooseUnpackType<
  T extends FormatChar,
  StandardSize extends boolean
> = StandardSize extends true
  ? StandardTokenCharTypeMap[T]
  : NativeTokenCharTypeMap[T]

type TransformPackType<T> = T extends Uint8Array
  ? string | ArrayLike<number>
  : T

type ChooseType<
  T extends FormatChar,
  StandardSize extends boolean,
  forPack extends boolean
> = forPack extends true
  ? TransformPackType<ChooseUnpackType<T, StandardSize>>
  : ChooseUnpackType<T, StandardSize>

type ChooseTypeTuple<
  T extends FormatChar,
  StandardSize extends boolean,
  forPack extends boolean
> = ChooseType<T, StandardSize, forPack> extends void
  ? []
  : [ChooseType<T, StandardSize, forPack>]

type ToTypeTuple<
  T extends FormatChar,
  CountDigits extends string[],
  StandardSize extends boolean,
  forPack extends boolean
> = T extends LengthFormatChar
  ? ChooseTypeTuple<T, StandardSize, forPack>
  : T extends RepeatableFormatChar
  ? RepeatA<
      ChooseType<T, StandardSize, forPack>,
      NormalizeCountDigits<CountDigits>
    >
  : never

type ParseTokenSub<
  T extends string,
  StandardSize extends boolean,
  forPack extends boolean,
  CountDigitsHolder extends string[] = []
> = T extends ''
  ? []
  : First<T> extends infer D
  ? D extends Digit
    ? ParseTokenSub<Tail<T>, StandardSize, forPack, [...CountDigitsHolder, D]>
    : D extends FormatChar
    ? {
        type: ToTypeTuple<D, CountDigitsHolder, StandardSize, forPack>
        next: ParseTokenSub<Tail<T>, StandardSize, forPack>
      }
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

type ParseToken<
  T extends string,
  StandardSize extends boolean,
  forPack extends boolean
> = Flatten<ParseTokenSub<T, StandardSize, forPack>>

type IsStandardTypeFormat<T extends string> = T extends `${
  | '<'
  | '>'
  | '!'
  | '='}${string}`
  ? true
  : false

export type FormatTokenTuple<
  T extends string,
  forPack extends boolean = false
> = string extends T
  ? TokenType[]
  : T extends `${OrderType}${infer U}`
  ? ParseToken<U, IsStandardTypeFormat<T>, forPack>
  : never

export type FormatTokenTupleForWrite<T extends string> = FormatTokenTuple<
  T,
  true
>
