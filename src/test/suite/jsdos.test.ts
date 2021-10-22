import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../../extension';

suite('test jsdos API', () => {

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

    test('test jsdos Web API', async () => {
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
