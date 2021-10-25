import * as vscode from 'vscode';
import { api } from './api';

const fs = vscode.workspace.fs;

export function activate(context: vscode.ExtensionContext) {
    api.emulators.pathPrefix = context.asAbsolutePath('/node_modules/emulators/dist/');

    let disposable = vscode.commands.registerCommand('dosbox.startJsdos', async (bundle?: vscode.Uri) => {
        const bundleData = bundle ? await fs.readFile(bundle) : undefined;
        api.jsdos(bundleData);
    });
    context.subscriptions.push(disposable);

    return api;
}