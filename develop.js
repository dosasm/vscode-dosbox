//organize binary files in this script

const fs = require('fs');
let vscodeignore = fs.readFileSync('.vscodeignore', { encoding: 'utf-8' });

if (process.platform === 'win32') {
    vscodeignore += '\n!emu/win';
}

fs.writeFileSync('.vscodeignore', vscodeignore);