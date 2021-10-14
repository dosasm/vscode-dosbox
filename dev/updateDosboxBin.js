const fs = require('fs');
const path = require('path');
const os = require('os');
const download = require('download');

//from https://raw.githubusercontent.com/joncampbell123/dosbox-x/master/INSTALL.md
const dosboxX = {
    arm64: {
        url: "https://github.com/joncampbell123/dosbox-x/releases/download/dosbox-x-v0.83.17/dosbox-x-vsbuild-arm64-20210831224158.zip",
        location: "bin/ARM64/Release/dosbox-x.exe"
    },
    ia32: {
        url: "https://github.com/joncampbell123/dosbox-x/releases/download/dosbox-x-v0.83.17/dosbox-x-vsbuild-win32-20210831224158.zip",
        location: "bin/Win32/Release/dosbox-x.exe"
    }
    ,
    x64: {
        url: "https://github.com/joncampbell123/dosbox-x/releases/download/dosbox-x-v0.83.17/dosbox-x-vsbuild-win64-20210831224158.zip",
        location: "bin/x64/Release/dosbox-x.exe"
    }
};

async function updateDosboxX(platform, arch) {
    if (platform === 'win32') {
        const dstFolder = `out/dosbox-x-bin`;
        const src = path.resolve(__dirname, '..', dstFolder, dosboxX[arch].location);
        const dst = path.resolve(__dirname, '..', 'emu/win/dosbox_x/dosbox-x.exe');

        await download(dosboxX[arch].url, dstFolder, { extract: true });
        if (!fs.existsSync(src)) {
            console.error('download Failed', src, fs.existsSync(src));
            process.exit(1);
        }

        console.log(`copy /Y ${src} ${dst}`);
        await fs.promises.copyFile(src, dst).catch(
            e => console.error(`${src} was not copied`, e)
        );
    }
}

async function updateDosboxBin() {
    let platform = os.platform();
    let arch = os.arch();
    console.log(
        `update binary files of dosbox...
    for target ${process.env.target} in ${platform} ${arch}`);
    if (process.env.target) {
        [platform, arch] = process.env.target.split('-');
    }
    await updateDosboxX(platform, arch);
}

updateDosboxBin();