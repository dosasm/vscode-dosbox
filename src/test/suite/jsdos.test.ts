import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../../extension';

let api: myExtension.API;

export const jsdosNodeTestSuite = suite('test jsdos API', function () {

    this.beforeEach(async function () {
        const extension = vscode.extensions.getExtension('xsro.vscode-dosbox');
        if (api === undefined) {
            api = await extension?.activate();
        }
        assert.ok(api !== undefined, api ? Object.keys(api).toString() : "api can't get");
    });

    test('launch jsdos in extension host', async function () {
        const ci = await api.jsdos.runInHost();
        assert.ok(typeof ci.width() === 'number');
        ci.exit();
    });
});



