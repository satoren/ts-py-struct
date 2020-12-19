"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packer_1 = require("../packer");
describe('packer', () => {
    test('runtime typecheck', () => {
        expect(() => packer_1.packer('>c')(new Uint8Array(4), 0, 21)).toThrowError();
        expect(() => packer_1.packer('>?')(new Uint8Array(4), 0, 321)).toThrowError();
        expect(() => packer_1.packer('>s')(new Uint8Array(4), 0, 321)).toThrowError();
        expect(() => packer_1.packer('>i')(new Uint8Array(4), 0, '1')).toThrowError();
        expect(() => packer_1.packer('>I')(new Uint8Array(4), 0, '2')).toThrowError();
        expect(() => packer_1.packer('>f')(new Uint8Array(4), 0, '2')).toThrowError();
    });
    test('pack with array', () => {
        const b = new Uint8Array(10);
        packer_1.packer('>10s')(b, 0, [3, 4, 5]);
        expect(b).toStrictEqual(Uint8Array.of(3, 4, 5, 0, 0, 0, 0, 0, 0, 0));
    });
    test('pack with string', () => {
        const b = new Uint8Array(10);
        packer_1.packer('>10s')(b, 0, 'abcd');
        expect(b).toStrictEqual(Uint8Array.of(97, 98, 99, 100, 0, 0, 0, 0, 0, 0));
    });
});
