import * as vscode from 'vscode';
import { logger } from '../util/logger';
import { CommandInterface, Emulators } from 'emulators/dist/types/emulators';

import 'emulators';
const emulators: Emulators = (global as any).emulators ? (global as any).emulators : undefined;
const fs=vscode.workspace.fs;

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('dosbox.startJsdos', async (jsdosUrl?: vscode.Uri) => {
        if (emulators !== undefined) {
            emulators.pathPrefix = context.asAbsolutePath('/node_modules/emulators/dist/');
            const url=jsdosUrl?jsdosUrl:vscode.Uri.joinPath(context.extensionUri,'web/res/empty.jsdos');
            const bundle=await fs.readFile(url);
            const ci=await emulators.dosboxDirect(bundle);
            return ci;
        }
    });
    context.subscriptions.push(disposable);
}