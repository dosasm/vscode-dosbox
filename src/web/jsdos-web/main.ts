import * as vscode from 'vscode';
import { logger } from '../util/logger';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('dosbox.openJsdos', () => {
        console.log(context.extensionUri);
        const panel= vscode.window.createWebviewPanel("jsdos pannel",'jsdos'+new Date().toLocaleTimeString(),vscode.ViewColumn.One,{enableScripts:true});
        panel.webview.html=`<!doctype html>
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <style>
                 html, body, #jsdos {
                     width: 100%;
                     height: 100%;
                     margin: 0;
                     padding: 0;
                 }
                </style>
                <script src="/v7/build/releases/latest/emulators/emulators.js"></script>
                <script src="/v7/build/releases/latest/emulators-ui/emulators-ui.js"></script>
                <link rel="stylesheet" href="/v7/build/releases/latest/emulators-ui/emulators-ui.css">
            </head>
            <body>
                <div id="jsdos" />
                <script>
                 emulators.pathPrefix = "/v7/build/releases/latest/js-dos/";
                 Dos(document.getElementById("jsdos"))
                     .run("https://doszone-uploads.s3.dualstack.eu-central-1.amazonaws.com/original/2X/2/24b00b14f118580763440ecaddcc948f8cb94f14.jsdos")
                </script>
            </body>
        </html>`;
	});

	context.subscriptions.push(disposable);
}
