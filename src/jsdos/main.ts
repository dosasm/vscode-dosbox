import * as vscode from 'vscode';
import { logger } from '../util/logger';
import { CommandInterface, Emulators } from 'emulators/dist/types/emulators';

import 'emulators';
const emulators: Emulators = (global as any).emulators ? (global as any).emulators : undefined;
const fs=vscode.workspace.fs;

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('dosbox.startJsdos', async (jsdosUrl?: vscode.Uri) => {
        logger.channel((global as any).emulators ? 'eeee' : "nnnn").show();
        if (emulators !== undefined) {
            emulators.pathPrefix = context.asAbsolutePath('/node_modules/emulators/dist/');
            const bundle=await fs.readFile(vscode.Uri.joinPath(context.extensionUri,'web/res/empty.jsdos'));
            const ci=await emulators.dosboxDirect(bundle);
 logger.channel(ci.width().toString()).show();
            return ci;
        }
    });
    context.subscriptions.push(disposable);
}