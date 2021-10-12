import * as vscode from 'vscode';
import * as mp from './api';

export function activate(context: vscode.ExtensionContext) {
    const player = new mp.MsdosPlayer(context);

    let disposable = vscode.commands.registerCommand('dosbox.openMsdosPlayer', player.start);

    context.subscriptions.push(disposable);

    return {
        msdosPlayer: player.start
    };
}