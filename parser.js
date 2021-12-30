regexp = /(char|int[0-9]+)\s+([\w\d]+)(\[\d+\])?/
matches = `
int64 version;
int64 magic;
int32 id[2];
char fmode;
char clean;
char ronly;
char rsv;
int16 mode;
int16 unk1;
int32 blocksz;
int32 nbackup;
int64 nblock;
int64 ndinode;
int64 ndblock;
int64 ndinodeblock;
int64 superroot_ino;
`.trim().split(';').map(e => e.trim()).filter(e => e.length).map(e => {
    [_, dt, varName, repeated ] = e.match(regexp);
    if (repeated == null) {
        return [dt, varName, 1];
    }
    return [dt, varName, Number(repeated.substring(1, repeated.length - 1))];
});

converters = {
    "char": ["c", 1],
    "int16": ["h", 2],
    "int32": ["l", 4],
    "int64": ["q", 8],
}

function convertToPythonLine(bufferName, piece, offset) {
    const [dt, varName, repeat] = piece;
    const dtChar = converters[dt][0];
    const line = `${varName} = struct.unpack_from("<${dtChar.repeat(repeat)}", ${bufferName}, 0x${offset.toString(16).toLocaleUpperCase()})` + (repeat === 1 ? `[0]` : '');
    return [line, converters[dt][1] * repeat];
}


function convertToPython(bufferName = 'buffer', pieces = []) {
    let offset = 0;
    const newPieces = [];
    for (let i = 0; i < pieces.length; i++) {
        const [line, deltaOffset] = convertToPythonLine(bufferName, pieces[i], offset);
        offset += deltaOffset;
        newPieces.push(line);
    }
    return newPieces.join('\n');
}

copy(convertToPython('header', matches))