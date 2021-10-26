import * as vscode from 'vscode';
import { Jsdos } from '../jsdos/Jsdos';

export function activate(context: vscode.ExtensionContext) {
    const jsdos = new Jsdos(context);

    let disposable = vscode.commands.registerCommand('dosbox.openJsdos', (bundle?: vscode.Uri) => {
        if (bundle) {
            jsdos.setBundle(bundle);
        }
        jsdos.runInWebview();
    }
    );

    context.subscriptions.push(disposable);

    return { jsdos };
}
