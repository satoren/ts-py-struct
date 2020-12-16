"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpacker = void 0;
const format_1 = require("./format");
const stream_1 = require("./stream");
const unpacker = (format) => {
    const f = format_1.formatOrder(format);
    const tokens = format_1.splitTokens(format);
    const sizeMap = f.sizeMap;
    return (buffer, bufferOffset) => {
        const stream = new stream_1.ReadDataViewStream(buffer, bufferOffset, f.le);
        const readBoolean = (t) => {
            const ret = [];
            for (let i = 0; i < t.count; i++) {
                ret.push(stream.readUInt8() ? true : false);
            }
            return ret;
        };
        const skipPadding = (t) => {
            stream.skip(t.count);
            return [];
        };
        const readChar = (t) => {
            const ret = [];
            for (let i = 0; i < t.count; i++) {
                ret.push(String.fromCharCode(stream.readUInt8()));
            }
            return ret;
        };
        const readString = (t) => {
            const wb = new Uint8Array(t.count);
            const dv = new DataView(wb.buffer);
            for (let i = 0; i < t.count; i++) {
                dv.setUint8(i, stream.readUInt8());
            }
            return [wb];
        };
        const readSInt = (t) => {
            const size = sizeMap[t.token];
            if (f.native) {
                stream.aligngment(size);
            }
            const ret = [];
            for (let i = 0; i < t.count; i++) {
                ret.push(stream.readSInt(size));
            }
            return ret;
        };
        const readUInt = (t) => {
            const size = sizeMap[t.token];
            if (f.native) {
                stream.aligngment(size);
            }
            const ret = [];
            for (let i = 0; i < t.count; i++) {
                ret.push(stream.readUInt(size));
            }
            return ret;
        };
        const readFloat = (t) => {
            const size = sizeMap[t.token];
            if (f.native) {
                stream.aligngment(size);
            }
            const ret = [];
            for (let i = 0; i < t.count; i++) {
                ret.push(stream.readFloat(size));
            }
            return ret;
        };
        const tokenReaderMap = {
            '?': readBoolean,
            x: skipPadding,
            c: readChar,
            s: readString,
            n: readSInt,
            b: readSInt,
            h: readSInt,
            i: readSInt,
            l: readSInt,
            q: readSInt,
            P: readUInt,
            N: readUInt,
            B: readUInt,
            H: readUInt,
            I: readUInt,
            L: readUInt,
            Q: readUInt,
            f: readFloat,
            d: readFloat,
        };
        return tokens.reduce((prev, token) => [...prev, ...tokenReaderMap[token.token](token)], []);
    };
};
exports.unpacker = unpacker;
