import * as vscode from 'vscode';
import { api } from './api';

export function activate(context: vscode.ExtensionContext) {
    api.emulators.pathPrefix = context.asAbsolutePath('/node_modules/emulators/dist/');

    let disposable = vscode.commands.registerCommand('dosbox.startJsdos', async (bundle?: vscode.Uri) => {
        // const url = bundle ? bundle : vscode.Uri.joinPath(context.extensionUri, 'web/res/empty.jsdos');
        api.jsdos(bundle);
    });
    context.subscriptions.push(disposable);

    return api;
}