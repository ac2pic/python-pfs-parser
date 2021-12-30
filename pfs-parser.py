#!/usr/bin/python3 

import struct

from io import BufferedReader
class PFS_HEADER():
    @classmethod
    def parse(cls, fh: BufferedReader):
        header = fh.read(80)
        version = struct.unpack_from("<q", header, 0x0)[0]
        magic = struct.unpack_from("<q", header, 0x8)[0]
        id = struct.unpack_from("<ll", header, 0x10)
        fmode = struct.unpack_from("<c", header, 0x18)[0]
        clean = struct.unpack_from("<c", header, 0x19)[0]
        ronly = struct.unpack_from("<c", header, 0x1A)[0]
        rsv = struct.unpack_from("<c", header, 0x1B)[0]
        mode = struct.unpack_from("<h", header, 0x1C)[0]
        unk1 = struct.unpack_from("<h", header, 0x1E)[0]
        blocksz = struct.unpack_from("<l", header, 0x20)[0]
        nbackup = struct.unpack_from("<l", header, 0x24)[0]
        nblock = struct.unpack_from("<q", header, 0x28)[0]
        ndinode = struct.unpack_from("<q", header, 0x30)[0]
        ndblock = struct.unpack_from("<q", header, 0x38)[0]
        ndinodeblock = struct.unpack_from("<q", header, 0x40)[0]
        superroot_ino = struct.unpack_from("<q", header, 0x48)[0]
        pass


with open('ManualSave.4.bak', 'rb') as file:
    PFS_HEADER.parse(file)

