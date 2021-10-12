import * as vscode from 'vscode';
import * as jd from './api';

export function activate(context: vscode.ExtensionContext) {
    jd.emulators.pathPrefix = context.asAbsolutePath('/node_modules/emulators/dist/');

    let disposable = vscode.commands.registerCommand('dosbox.startJsdos', async (bundle?: vscode.Uri) => {
        const url = bundle ? bundle : vscode.Uri.joinPath(context.extensionUri, 'web/res/empty.jsdos');
        jd.jsdos(url);
    });
    context.subscriptions.push(disposable);

    return {
        jsdos: jd.jsdos,
        emulators: jd.emulators
    };
}