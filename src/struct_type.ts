import { Repeat } from './repeat'

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
type TokenType = TokenCharTypeMap[RepeatableFormatChar | LengthFormatChar]

type RepeatDigit = `${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | ''}`
type RepeatCount = Exclude<
  `${RepeatDigit}${RepeatDigit}${RepeatDigit}`,
  `0${string}`
>

type LengthFormatToken = `${RepeatCount}${LengthFormatChar}`
type RepeatableFormatToken = `${RepeatCount}${RepeatableFormatChar}`
type FormatToken = LengthFormatToken | RepeatableFormatToken

type NromalizeRepeatCount<T extends string> = T extends '' ? '1' : T

type LengthTokenTypeTuple<
  T extends LengthFormatChar
> = TokenCharTypeMap[T] extends never ? [] : [TokenCharTypeMap[T]]
type RepeatableTokenTypeTuple<
  T extends RepeatableFormatChar,
  Count extends string
> = Repeat<TokenCharTypeMap[T], NromalizeRepeatCount<Count>>

type TokenTypeTuple<
  T extends FormatToken
> = T extends `${RepeatCount}${infer TokenChar}`
  ? TokenChar extends LengthFormatChar
    ? LengthTokenTypeTuple<TokenChar>
    : TokenChar extends RepeatableFormatChar
    ? T extends `${infer Count}${TokenChar}`
      ? RepeatableTokenTypeTuple<TokenChar, Count>
      : never
    : never
  : never

type TailToken<T extends string> = T extends `${FormatToken}${infer U}`
  ? U
  : never
type FirstToken<T extends string> = T extends `${infer U}${TailToken<T>}`
  ? U
  : never

type FormatTokenTupleImpl<T extends string> = T extends ''
  ? []
  : [...TokenTypeTuple<FirstToken<T>>, ...FormatTokenTupleImpl<TailToken<T>>]

type FormatSplitImpl<T extends string> = T extends ''
  ? []
  : [FirstToken<T>, ...FormatSplitImpl<TailToken<T>>]

export type FormatTokenTuple<T extends string> = string extends T
  ? TokenType[]
  : T extends `${OrderType}${infer U}`
  ? FormatTokenTupleImpl<U> extends infer R
    ? R
    : TokenType[]
  : TokenType[]
export type FormatSplit<T extends string> = T extends `${OrderType}${infer U}`
  ? FormatSplitImpl<U> extends infer R
    ? R
    : TokenType[]
  : TokenType[]
