import * as fs from 'fs';
import { expectType } from 'tsd';
import fileType from '.';
expectType(fileType(new Buffer([0xff, 0xd8, 0xff])));
expectType(fileType(new Uint8Array([0xff, 0xd8, 0xff])));
expectType(fileType(new ArrayBuffer(42)));
const result = fileType(new Buffer([0xff, 0xd8, 0xff]));
if (result !== undefined) {
    expectType(result.ext);
    expectType(result.mime);
}
expectType(fileType.minimumBytes);
expectType(fileType.extensions);
expectType(fileType.mimeTypes);
const readableStream = fs.createReadStream('file.png');
const streamWithFileType = fileType.stream(readableStream);
expectType(streamWithFileType);
// expectType<FileTypeResult | undefined>((await streamWithFileType).fileType);
//# sourceMappingURL=index.test-d.js.map