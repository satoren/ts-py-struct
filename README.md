# ts-py-struct

port python's struct to typescript.

# Feature

- Infer the arguments of pack and the return value of unpack from the format.
- Native size (`@`) same to LP64

## Usage

```ts
import { pack, unpack } from 'ts-py-struct'
//const packed: Uint8Array = pack('<hHl',7777, 65534) // Compile Error: Expected 4 arguments, but got 3.
const packed: Uint8Array = pack('<hHl', 7777, 65534, 3123213)
//const unpacked: [number,  number] = unpack('<hHl',packed) // Compile Error: Type '[number, number, number]' is not assignable to type '[number]'.  Source has 3 element(s) but target allows only 1.ts(2322)
const unpacked: [number, number, number] = unpack('<hHl', packed)
```

### class interface

```ts
import { Struct } from 'ts-py-struct'
const s = new Struct('2c')
// const packed = s.pack('A', 22) // Compile Error:  Argument of type 'number' is not assignable to parameter of type 'string'.ts(2345)
const packed = s.pack('A', '0')
const unpacked = s.unpack(packed) // unpacked type is [string, string]
```

### Implementation limitations

- The maximum number of Repeat count is 999 for type collection now.

```ts
// Issue
const a = unpack('1000i', buffer) //  a is `never` because Cannot infer type.

// Workaround. Disable infer type by format.
const a = unpack('1000i' as string, buffer) // a is (string | number | boolean | Uint8Array | BigInt)[].
```
