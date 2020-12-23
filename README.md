![CI](https://github.com/satoren/ts-py-struct/workflows/CI/badge.svg)
[![npm version](https://badge.fury.io/js/ts-py-struct.svg)](https://badge.fury.io/js/ts-py-struct)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=satoren_ts-py-struct&metric=coverage)](https://sonarcloud.io/dashboard?id=satoren_ts-py-struct)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=satoren_ts-py-struct&metric=bugs)](https://sonarcloud.io/dashboard?id=satoren_ts-py-struct)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=satoren_ts-py-struct&metric=code_smells)](https://sonarcloud.io/dashboard?id=satoren_ts-py-struct)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=satoren_ts-py-struct&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=satoren_ts-py-struct)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=satoren_ts-py-struct&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=satoren_ts-py-struct)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=satoren_ts-py-struct&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=satoren_ts-py-struct)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=satoren_ts-py-struct&metric=security_rating)](https://sonarcloud.io/dashboard?id=satoren_ts-py-struct)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=satoren_ts-py-struct&metric=sqale_index)](https://sonarcloud.io/dashboard?id=satoren_ts-py-struct)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=satoren_ts-py-struct&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=satoren_ts-py-struct)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=satoren_ts-py-struct&metric=ncloc)](https://sonarcloud.io/dashboard?id=satoren_ts-py-struct)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ea8562a4339243b68d9a3143db29fd4f)](https://app.codacy.com/gh/satoren/ts-py-struct?utm_source=github.com&utm_medium=referral&utm_content=satoren/ts-py-struct&utm_campaign=Badge_Grade)

# ts-py-struct

port python's struct to typescript.

## Feature

-   <https://docs.python.org/3/library/struct.html>
-   Infer the arguments type of pack and the return value type of unpack from the format.
-   Native size (`@`) same to LP64
-   Omit 'p' format
-   's' format with string: encode with utf-8

## Requirements

-   Typescript 4.1.x or later

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
