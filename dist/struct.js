"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Struct = exports.calcsize = exports.unpack_from = exports.unpack = exports.pack_into = exports.pack = void 0;
const format_1 = require("./format");
const packer_1 = require("./packer");
const unpacker_1 = require("./unpacker");
const pack = (format, ...args) => {
    const size = exports.calcsize(format);
    const buffer = new Uint8Array(size);
    packer_1.packer(format)(buffer, 0, ...args);
    return buffer;
};
exports.pack = pack;
const pack_into = (format, buffer, offset, ...args) => {
    packer_1.packer(format)(buffer, offset, ...args);
};
exports.pack_into = pack_into;
const unpack = (format, buffer) => {
    return unpacker_1.unpacker(format)(buffer, 0);
};
exports.unpack = unpack;
const unpack_from = (format, buffer, offset) => {
    return unpacker_1.unpacker(format)(buffer, offset);
};
exports.unpack_from = unpack_from;
const calcsize = (format) => {
    const f = format_1.formatOrder(format);
    const sizeMap = f.sizeMap;
    const tokens = format_1.splitTokens(format);
    return tokens.reduce((prev, token) => {
        const s = sizeMap[token.token];
        const padding = f.native ? (s - (prev % s)) % s : 0;
        return prev + padding + s * token.count;
    }, 0);
};
exports.calcsize = calcsize;
class Struct {
    constructor(format) {
        this.format = format;
        this.size = exports.calcsize(format);
        this.packer = packer_1.packer(format);
        this.unpacker = unpacker_1.unpacker(format);
    }
    pack(...arg) {
        const buffer = new Uint8Array(this.size);
        this.packer(buffer, 0, ...arg);
        return buffer;
    }
    pack_into(buffer, offset, ...arg) {
        if (buffer.length - offset < this.size) {
            throw Error('Not enough buffer.');
        }
        this.packer(buffer, offset, ...arg);
    }
    unpack(buffer) {
        return this.unpacker(buffer, 0);
    }
    unpack_from(buffer, offset) {
        return this.unpacker(buffer, offset);
    }
}
exports.Struct = Struct;
