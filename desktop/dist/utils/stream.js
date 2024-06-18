"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplexCopy = exports.addDataListener = exports.acknowledge = exports.waitForAcknowledge = exports.waitForMessage = void 0;
const stream_1 = require("stream");
const constants_1 = require("../constants");
const waitForMessage = (stream, filter, { returnFilterOutput = false } = {}) => {
    return new Promise((resolve) => {
        const listener = async (data) => {
            const isMatch = filter ? await filter(data) : Promise.resolve(true);
            if (isMatch) {
                stream.removeListener('data', listener);
                resolve(returnFilterOutput ? isMatch : data);
            }
        };
        stream.on('data', listener);
    });
};
exports.waitForMessage = waitForMessage;
const waitForAcknowledge = async (stream) => {
    await (0, exports.waitForMessage)(stream, (data) => Promise.resolve(data === constants_1.MESSAGE_ACKNOWLEDGE));
};
exports.waitForAcknowledge = waitForAcknowledge;
const acknowledge = (stream) => {
    stream.write(constants_1.MESSAGE_ACKNOWLEDGE);
};
exports.acknowledge = acknowledge;
const addDataListener = (stream, listener) => {
    stream.on('data', (data) => {
        if (data === constants_1.MESSAGE_ACKNOWLEDGE) {
            return;
        }
        listener(data);
    });
};
exports.addDataListener = addDataListener;
class DuplexCopy extends stream_1.Duplex {
    constructor(stream) {
        super({ objectMode: true });
        this.stream = stream;
        this.stream.on('data', (data) => {
            this.onMessage(data);
        });
    }
    onMessage(data) {
        this.push(data);
    }
    _read() {
        return null;
    }
    _write(msg, encoding, cb) {
        this.stream.write(msg, encoding, cb);
    }
}
exports.DuplexCopy = DuplexCopy;
//# sourceMappingURL=stream.js.map