import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as Jszip from 'jszip';
import * as myExtension from '../../extension';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

const testDir = path.join(os.tmpdir(), 'vscode-dosbox-test');
fs.mkdirSync(testDir, { recursive: true });
console.log(`use ${testDir} as test dir`);

let api: myExtension.API | undefined = undefined;

suite('test DOSBox-like API', function () {

    this.beforeEach(async function () {
        const extension = vscode.extensions.getExtension('xsro.vscode-dosbox');
        api = await extension?.activate();
        assert.ok(api !== undefined, api ? Object.keys(api).toString() : "api can't get");
    });

    test('test dosbox API', async function () {
        if (api) {
            const data = Math.random().toString();
            const fileName = 'DOSBOX.TXT';
            api.dosbox.updateAutoexec([
                `mount c ${testDir}`,
                'c:',
                `echo ${data} >${fileName}`,
                'exit']);
            await api.dosbox.run();
            const testFile = path.join(testDir, fileName);
            assert.ok(fs.existsSync(testFile));
            const data2 = fs.readFileSync(testFile, { encoding: 'utf-8' });
            assert.equal(data, data2.trim());
        }
    });

    test('test dosbox-x API', async function () {
        if (process.platform === 'linux') {
            this.skip();
        }

        if (api) {
            const data = Math.random().toString();
            const fileName = 'DOSBOXX.TXT';
            api.dosboxX.updateAutoexec([
                `mount c ${testDir}`,
                'c:',
                `echo ${data} > ${fileName}`,
                'exit']);
            await api.dosboxX.run();
            const testFile = path.join(testDir, fileName);
            assert.ok(fs.existsSync(testFile));
            const data2 = fs.readFileSync(testFile, { encoding: 'utf-8' });
            assert.equal(data, data2.trim());
        }
    });

    test('start from jsdos bundle', async function () {
        const zip = new Jszip();
        const data = Math.random().toString();
        const testFolder = vscode.Uri.file(path.resolve(testDir, 'dosbox-from-bundle'));
        const fileName = 'TEST.TXT';
        zip.file(".jsdos/dosbox.conf", `
        [autoexec]
        mount c .
        echo ${data} >C:\\${fileName}
        exit`);
        const bundleData = await zip.generateAsync({ type: "uint8array" });
        if (api) {
            await api.dosbox.fromBundle(bundleData, testFolder);
            await api.dosbox.run();
        }
        const testFile = path.join(testFolder.fsPath, fileName);
        assert.ok(fs.existsSync(testFile));
        const data2 = fs.readFileSync(testFile, { encoding: 'utf-8' });
        assert.equal(data, data2.trim());
    });
});
