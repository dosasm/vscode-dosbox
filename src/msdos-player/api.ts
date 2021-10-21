import * as vscode from 'vscode';

export class MsdosPlayer {
    constructor(private context: vscode.ExtensionContext) { }

    start() {
        if (process.platform !== 'win32') {
            throw new Error('msdos player can only run in win32 system');
        }
        const context = this.context;

        const t = vscode.window.createTerminal(
            'msdos-player',
            'cmd.exe',
            [
                '/K',
                context.asAbsolutePath('./emu/msdos_player/win/msdos.exe'),
                context.asAbsolutePath('./emu/msdos_player/command.com')
            ]

        );
        t.show();
        return t;
    }
}