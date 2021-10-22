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

    }
    else if (platform === 'web') {
        vscodeignore = vscodeignore
            .replace("!node_modules/emulators*/package.json", "")
            .replace("!node_modules/emulators*/dist/*.*", "");

        vscodeignore += '\nemu\ndist/extension.js\n';
    }
    else if (platform === 'darwin') {
        vscodeignore += '\nemu/**/win\n';
    }
    else {
        vscodeignore += '\nemu/**/win\nemu/**/zh-CN/**\n';
    }
    await fs.promises.writeFile(ignorePath, vscodeignore);

    const files = await vsce.listFiles({ packageManager: vsce.PackageManager.Yarn });
    console.log(files);

    await vsce.createVSIX({ target, useYarn: true });

    await fs.promises.writeFile(ignorePath, _vscodeignore);
}

