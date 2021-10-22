import JSZip = require('jszip');
import * as vscode from 'vscode';

const fs = vscode.workspace.fs;

export class JsdosWeb {
    constructor(
        private context: vscode.ExtensionContext
    ) { }

    jsdosWeb = this.start;
    start(bundle?: Uint8Array | vscode.Uri) {
        const context = this.context;

        const panel = vscode.window.createWebviewPanel(
            "jsdos pannel",
            'jsdos' + new Date().toLocaleTimeString(),
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                //hint: the below settings should be folder's uri
                localResourceRoots: [
                    vscode.Uri.joinPath(context.extensionUri, 'node_modules/emulators/dist'),
                    vscode.Uri.joinPath(context.extensionUri, 'node_modules/emulators-ui/dist'),
                    vscode.Uri.joinPath(context.extensionUri, 'web/dist'),
                ]
            }
        );
        const asWeb = (str: string): vscode.Uri => {
            const fullpath = vscode.Uri.joinPath(context.extensionUri, str);
            return panel.webview.asWebviewUri(fullpath);
        };

        const jsdosScript = (process as any).browser ?
            {
                emu: "https://js-dos.com/v7/build/releases/latest/emulators/emulators.js",
                emuDist: "https://js-dos.com/v7/build/releases/latest/js-dos/",
                ui: "https://js-dos.com/v7/build/releases/latest/emulators-ui/emulators-ui.js",
                uiCss: "https://js-dos.com/v7/build/releases/latest/emulators-ui/emulators-ui.css"
            } : {
                emu: asWeb("/node_modules/emulators/dist/emulators.js"),
                emuDist: asWeb("/node_modules/emulators/dist/"),
                ui: asWeb("/node_modules/emulators-ui/dist/emulators-ui.js"),
                uiCss: asWeb("/node_modules/emulators-ui/dist/emulators-ui.css")
            };

        panel.webview.html = `
<!DOCTYPE html>
<html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        html,
        body,
        #jsdos {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }
    </style>
    <script src="${jsdosScript.emu}"></script>
    <script src="${jsdosScript.ui}"></script>
    <link rel="stylesheet" href="${jsdosScript.uiCss}">
</head>
    
<body>
    <div class="layout">
        <div id="root" style="width: 100%; height: 100%;">
        <p id='loadingInfo'>loading</p>
        </div>
    </div>
    <script>
        emulators.pathPrefix = "${jsdosScript.emuDist}";
        bundlePath=undefined
    </script>
    <script src='${asWeb("web/dist/index.js")}'></script>
</body>
</html>`;

        async function getBundle(bundle?: Uint8Array | vscode.Uri) {
            if (Array.isArray(bundle)) {
                return bundle;
            }
            else {
                try {
                    const data = await fs.readFile(bundle as vscode.Uri);
                    return data;
                } catch (e) {

                }
            }
            const zip = new JSZip();
            zip.file('.jsdos/dosbox.conf', "");
            return zip.generateAsync({ type: "uint8array" });
        }

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'loaded':
                        getBundle(bundle).then(
                            data => panel.webview.postMessage({
                                command: 'start',
                                bundle: data
                            })
                        );
                        return;
                }
            },
            undefined,
            context.subscriptions
        );

        return panel.webview;
    }
}