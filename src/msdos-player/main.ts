import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('dosbox.openMsdosPlayer', async (params: boolean | undefined | string[]) => {
        if (process.platform === 'win32') {
            const t = vscode.window.createTerminal(
                'msdos-player',
                'cmd.exe',
                [
                    '/K',
                    context.asAbsolutePath('./emu/win/msdos_player/msdos.exe'),
                    context.asAbsolutePath('./emu/win/msdos_player/command.com')
                ]

            );
            t.show();
        } else {
            vscode.window.showErrorMessage('msdos player can only run in win32 system');
        }
    });

    context.subscriptions.push(disposable);
}