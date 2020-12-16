"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadDataViewStream = exports.WriteDataViewStream = void 0;
class StreamPosition {
    constructor(buffer, offset, le) {
        this.offset = 0;
        this.dataView = new DataView(buffer.buffer, buffer.byteOffset + offset);
        this.le = le;
    }
    aligngment(size) {
        const { offset } = this;
        this.offset += (size - (offset % size)) % size;
    }
    skip(size) {
        this.offset += size;
    }
}
class WriteDataViewStream extends StreamPosition {
    writeSInt(value, size) {
        const { offset, dataView, le } = this;
        this.offset += size;
        switch (size) {
            case 1:
                return dataView.setInt8(offset, Number(value));
            case 2:
                return dataView.setInt16(offset, Number(value), le);
            case 4:
                return dataView.setInt32(offset, Number(value), le);
            case 8:
                return dataView.setBigInt64(offset, BigInt(value), le);
        }
        throw Error('InvalidSize');
    }
    writeUInt8(value) {
        return this.writeUInt(value, 1);
    }
    writeUInt(value, size) {
        const { offset, dataView, le } = this;
        this.offset += size;
        switch (size) {
            case 1:
                return dataView.setUint8(offset, Number(value));
            case 2:
                return dataView.setUint16(offset, Number(value), le);
            case 4:
                return dataView.setUint32(offset, Number(value), le);
            case 8:
                return dataView.setBigUint64(offset, BigInt(value), le);
        }
        throw Error('InvalidSize');
    }
    writeFloat(value, size) {
        const { offset, dataView, le } = this;
        this.offset += size;
        switch (size) {
            case 4:
                return dataView.setFloat32(offset, value, le);
            case 8:
                return dataView.setFloat64(offset, value, le);
        }
        throw Error('InvalidSize');
    }
}
exports.WriteDataViewStream = WriteDataViewStream;
class ReadDataViewStream extends StreamPosition {
    readSInt(size) {
        const { offset, dataView, le } = this;
        this.offset += size;
        switch (size) {
            case 1:
                return dataView.getInt8(offset);
            case 2:
                return dataView.getInt16(offset, le);
            case 4:
                return dataView.getInt32(offset, le);
            case 8:
                return dataView.getBigInt64(offset, le);
        }
        throw Error('InvalidSize');
    }
    readUInt8() {
        return Number(this.readUInt(1));
    }
    readUInt(size) {
        const { offset, dataView, le } = this;
        this.offset += size;
        switch (size) {
            case 1:
                return dataView.getUint8(offset);
            case 2:
                return dataView.getUint16(offset, le);
            case 4:
                return dataView.getUint32(offset, le);
            case 8:
                return dataView.getBigUint64(offset, le);
        }
        throw Error('InvalidSize');
    }
    readFloat(size) {
        const { offset, dataView, le } = this;
        this.offset += size;
        switch (size) {
            case 4:
                return dataView.getFloat32(offset, le);
            case 8:
                return dataView.getFloat64(offset, le);
        }
        throw Error('InvalidSize');
    }
}
exports.ReadDataViewStream = ReadDataViewStream;
