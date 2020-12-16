"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitTokens = exports.formatOrder = void 0;
const isNativeLE = new DataView(Uint16Array.of(1).buffer).getUint16(0, true) === 1;
const formatOrder = (format) => {
    switch (format[0]) {
        case '<':
            return { le: true, native: false, sizeMap: standardSizeMap };
        case '>':
        case '!':
            return { le: false, native: false, sizeMap: standardSizeMap };
        case '=':
            return { le: isNativeLE, native: false, sizeMap: standardSizeMap };
        default:
            return { le: isNativeLE, native: true, sizeMap: nativeSizeMap };
    }
};
exports.formatOrder = formatOrder;
const standardSizeMap = {
    s: 1,
    x: 1,
    c: 1,
    b: 1,
    B: 1,
    '?': 1,
    h: 2,
    H: 2,
    i: 4,
    I: 4,
    l: 4,
    L: 4,
    n: 0,
    N: 0,
    q: 8,
    Q: 8,
    f: 4,
    d: 8,
    P: 0,
};
// Same with LP64
const nativeSizeMap = {
    s: 1,
    x: 1,
    c: 1,
    b: 1,
    B: 1,
    '?': 1,
    h: 2,
    H: 2,
    i: 4,
    I: 4,
    l: 8,
    L: 8,
    n: 8,
    N: 8,
    q: 8,
    Q: 8,
    f: 4,
    d: 8,
    P: 8,
};
const splitTokens = (format) => {
    const r = /(\d*)([cbB?hHiIlLqQefdxspP])/g;
    const a = [];
    let match = r.exec(format);
    while (match !== null) {
        const count = Number(match[1] || 1);
        const token = match[2];
        a.push({ count, token });
        match = r.exec(format);
    }
    return a;
};
exports.splitTokens = splitTokens;
