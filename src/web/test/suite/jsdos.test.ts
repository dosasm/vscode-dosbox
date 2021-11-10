import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../../extension';

let api: myExtension.API;

export const jsdosWebTestSuite = suite('test jsdos API', function () {

    this.beforeEach(async function () {
        const extension = vscode.extensions.getExtension('xsro.vscode-dosbox');
        if (api === undefined) {
            api = await extension?.activate();
        }
        assert.ok(api !== undefined, api ? Object.keys(api).toString() : "api can't get");
    });

    test('launch jsdos in extension host', async function () {
        if ((process as any).browser) {
            this.skip();
        }
        const ci = await api.jsdos.runInHost();
        assert.ok(typeof ci.width() === 'number');
        ci.exit();
    });

    test('launch jsdos in webview with empty bundle', async function () {
        const webview = await api.jsdos.runInWebview(null);

        const stdouts = await new Promise<string[]>((resolve, reject) => {
            const stdouts: string[] = [];
            webview.onDidReceiveMessage(e => {
                if (e.command === 'stdout') {
                    stdouts.push(e.value);
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
    });


    test('launch jsdos in webview with https url', async () => {
        const uri = vscode.Uri.parse("https://doszone-uploads.s3.dualstack.eu-central-1.amazonaws.com/original/2X/2/24b00b14f118580763440ecaddcc948f8cb94f14.jsdos");
        const webview = await api.jsdos.runInWebview(uri);

        const stdouts = await new Promise<string[]>((resolve, reject) => {
            const stdouts: string[] = [];
            webview.onDidReceiveMessage(e => {
                if (e.command === 'stdout') {
                    stdouts.push(e.value);
                    if (e.value.includes('C:\\>DIGGER.COM')) {
                        resolve(stdouts);
                    }
                }
                setTimeout(() => {
                    reject(stdouts);
                }, 5000);
            });
        });
        assert.ok(stdouts.length > 10, JSON.stringify(stdouts));
    });
});