import * as vscode from 'vscode';
import { Jsdos } from './Jsdos';

export function activate(context: vscode.ExtensionContext) {

    const jsdos = new Jsdos(context);

    let disposable = vscode.commands.registerCommand('dosbox.startJsdos', async (bundle: vscode.Uri) => {
        jsdos.setBundle(bundle);
        jsdos.runInHost();
    });
    context.subscriptions.push(disposable);

    return {
        jsdos
    };
}