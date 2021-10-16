import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../../extension';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

const testDir = path.join(os.tmpdir(), 'vscode-dosbox-test');
fs.mkdirSync(testDir, { recursive: true });
console.log(`use ${testDir} as test dir`);

suite('Web Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('test jsdos API', async () => {
		const extension = vscode.extensions.getExtension('xsro.vscode-dosbox');
		let api: myExtension.API | undefined = await extension?.activate();
		if (api === undefined) {
			api = extension?.exports;
		}

		assert.ok(api !== undefined, JSON.stringify(api));
		if (api) {
			const ci = await api.jsdos();
			assert.ok(typeof ci.width() === 'number');
			ci.exit();
		}
	});

	test('test dosbox API', async function () {

		if (process.platform !== 'win32') {
			this.skip();
		}
		const extension = vscode.extensions.getExtension('xsro.vscode-dosbox');
		let api: myExtension.API | undefined = await extension?.activate();

		assert.ok(api !== undefined, JSON.stringify(api));

		if (api) {
			const data = Math.random().toString();
			api.dosbox.updateAutoexec([
				`mount c ${testDir}`,
				'c:',
				`echo ${data} >dosbox.txt`,
				'exit']);
			await api.dosbox.run();
			const testFile = path.join(testDir, 'dosbox.txt');
			assert.ok(fs.existsSync(testFile));
			const data2 = fs.readFileSync(testFile, { encoding: 'utf-8' });
			assert.equal(data, data2.trim());
		}
	});

	test('test dosbox-x API', async function () {
		if (process.platform !== 'win32') {
			this.skip();
		}
		const extension = vscode.extensions.getExtension('xsro.vscode-dosbox');
		let api: myExtension.API | undefined = await extension?.activate();

		assert.ok(api !== undefined, JSON.stringify(api));

		if (api) {
			const data = Math.random().toString();
			api.dosboxX.updateAutoexec([
				`mount c ${testDir}`,
				'c:',
				`echo ${data} >dosboxx.txt`,
				'exit']);
			await api.dosboxX.run();
			const testFile = path.join(testDir, 'dosboxx.txt');
			assert.ok(fs.existsSync(testFile));
			const data2 = fs.readFileSync(testFile, { encoding: 'utf-8' });
			assert.equal(data, data2.trim());
		}
	});
});
