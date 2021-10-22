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

	test('test jsdos Web API', async function () {
		this.timeout('99999999');
		const extension = vscode.extensions.getExtension('xsro.vscode-dosbox');
		let api: myExtension.API | undefined = await extension?.activate();
		if (api === undefined) {
			api = extension?.exports;
		}

		assert.ok(api !== undefined, JSON.stringify(api));
		if (api) {
			const webview = api.jsdosWeb(undefined);

			const stdouts = await new Promise<string[]>((resolve, reject) => {
				const stdouts: string[] = [];
				webview.onDidReceiveMessage(e => {
					if (e.command === 'stdout') {
						stdouts.push(e.value);
						console.log(e);
						if (e.value.includes('SET BLASTER=')) {
							resolve(stdouts);
						}
					}
					setTimeout(() => {
						reject(stdouts);
					}, 5000);
				});
			});
			assert.ok(stdouts.length > 10, JSON.stringify(stdouts));
		}
	});
});
