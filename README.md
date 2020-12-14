![CI](https://github.com/satoren/ts-py-struct/workflows/CI/badge.svg)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ea8562a4339243b68d9a3143db29fd4f)](https://app.codacy.com/gh/satoren/ts-py-struct?utm_source=github.com&utm_medium=referral&utm_content=satoren/ts-py-struct&utm_campaign=Badge_Grade)
[![Coverage Status](https://coveralls.io/repos/github/satoren/ts-py-struct/badge.svg?branch=main)](https://coveralls.io/github/satoren/ts-py-struct?branch=main)
[![npm version](https://badge.fury.io/js/ts-py-struct.svg)](https://badge.fury.io/js/ts-py-struct)

# ts-py-struct

port python's struct to typescript.

## Feature

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
