//organize binary files in this script

const fs = require('fs');
const updateDosboxBin = require('./updateDosboxBin');
let vscodeignore = fs.readFileSync('.vscodeignore', { encoding: 'utf-8' });

async function main() {
    console.log(`do some for platform ${process.platform}`);
    if (process.platform === 'win32') {
        vscodeignore += '\n!emu/win';
        fs.writeFileSync('.vscodeignore', vscodeignore);
    }

    console.log(`do some for target ${process.env.target}`);
    if (process.env.target) {
        const [platform, arch] = process.env.target.split('-');
        await updateDosboxBin(platform, arch);
    }
}

main();