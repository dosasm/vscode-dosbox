import * as vscode from 'vscode';

export class JsdosWeb {
    constructor(
        private context: vscode.ExtensionContext
    ) { }

    start(bundle: vscode.Uri) {
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
                    vscode.Uri.joinPath(bundle, '..')
                ]
            }
        );
        const asWeb = (str: string): vscode.Uri => {
            const fullpath = vscode.Uri.joinPath(context.extensionUri, str);
            return panel.webview.asWebviewUri(fullpath);
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
    <script src="${asWeb("/node_modules/emulators/dist/emulators.js")}"></script>
    <script src="${asWeb("/node_modules/emulators-ui/dist/emulators-ui.js")}"></script>
    <link rel="stylesheet" href="${asWeb("/node_modules/emulators-ui/dist/emulators-ui.css")}">
</head>
    
<body>
    <div class="layout">
        <div id="root" style="width: 100%; height: 100%;"></div>
    </div>
    <script>
        emulators.pathPrefix = "${asWeb("/node_modules/emulators/dist/")}";
        bundlePath="${panel.webview.asWebviewUri(bundle)}"
    </script>
    <script src='${asWeb("web/dist/index.js")}'></script>
</body>
</html>`;
        return panel.webview;
    }
}
