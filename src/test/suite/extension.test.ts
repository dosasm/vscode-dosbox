import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../../extension';

suite('Web Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');
	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('get API', async () => {
		const a = await vscode.commands.executeCommand('dosbox.openDosbox');
		const extension = vscode.extensions.getExtension('xsro.vscode-dosbox');
		const api: myExtension.API | undefined = extension?.exports;
		assert.ok(api !== undefined, JSON.stringify(api));
		if (api) {
			const ci = await api.jsdos();
			assert.ok(ci.width() !== undefined);
		}
	});
});
