import * as vscode from 'vscode';
import * as jw from './api';

export function activate(context: vscode.ExtensionContext) {
    const jsdos = new jw.JsdosWeb(context);

    let disposable = vscode.commands.registerCommand('dosbox.openJsdos', (bundle?: vscode.Uri) => {
        //const url = bundle ? bundle : vscode.Uri.joinPath(context.extensionUri, 'web/res/empty.jsdos');
        jsdos.start(bundle);
    }
    );

    context.subscriptions.push(disposable);

    return {
        jsdosWeb: function (bundle?: vscode.Uri | Uint8Array | undefined) {
            return jsdos.start(bundle);
        }
    };
}
