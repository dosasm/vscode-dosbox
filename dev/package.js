const vsce = require('vsce');
const fs = require('fs');
const pak = require('../package.json');
const path = require('path');

const cwd = path.resolve(__dirname, '..');

const targetIdx = process.argv.findIndex(val => val.includes('--target'));
const target = process.argv[targetIdx + 1].startsWith('web') ? 'web' : process.argv[targetIdx + 1];
const [platform, arch] = target.split('-');

const packagePath = `${pak.name}-${target}-${pak.version}.vsix`;
console.log(`
start creating package in platform:${process.platform},arch:${process.arch}
target: ${packagePath}
`, { target, platform, arch });

main();

async function main() {
    const ignorePath = path.resolve(cwd, '.vscodeignore');
    const _vscodeignore = await fs.promises.readFile(ignorePath, { encoding: 'utf-8' });

    let vscodeignore = _vscodeignore;

    if (platform === 'win32') {
        if (arch === 'ia32') {
            vscodeignore += `
        emu/dosbox_x
        emu/msdos_player
        !emu/dosbox_x/win32-ia32
        !emu/msdos_player/win32-ia32
        `;
        }

        if (arch === 'x64') {
            vscodeignore += `
            emu/dosbox_x
            emu/msdos_player
            !emu/dosbox_x/win32-x64
            !emu/msdos_player/win32-x64
            `;
        }

        if (arch === 'arm64') {
            vscodeignore += `
            emu/dosbox_x
            emu/msdos_player
            !emu/dosbox_x/win32-arm64
            !emu/msdos_player/win32-ia32
            `;
        }
    }
    else if (platform === 'web') {
        vscodeignore = vscodeignore
            .replace("!node_modules/emulators*/package.json", "")
            .replace("!node_modules/emulators*/dist/*.*", "");

        vscodeignore += `
        emu
        dist/extension.js`;
    }
    else if (platform === 'darwin') {
        vscodeignore += `
        emu/**/win*/
        `;
    }
    else {
        vscodeignore += `
        emu/**/win*/
        emu/**/zh-CN/**`;
    }
    await fs.promises.writeFile(ignorePath, vscodeignore);

    const files = await vsce.listFiles({ packageManager: vsce.PackageManager.Yarn });
    console.log(files);

    await vsce.createVSIX({ target, useYarn: true });

    await fs.promises.writeFile(ignorePath, _vscodeignore);
}

