import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

import { RemoteCi } from '../../jsdos-web/ci';

suite('Web Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');
	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
	test('remote Ci', async () => {
		const ci: RemoteCi | undefined = await vscode.commands.executeCommand('dosbox.openJsdos');
		assert.ok(ci !== undefined);
		if (ci) {
			ci.onDidReceive(msg => {
				console.log(msg);
			});
		}
	});
});
