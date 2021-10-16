import { CommandInterface, Emulators } from 'emulators';
import * as vscode from 'vscode';
import { DosboxResult } from './dosbox/dosbox';

export interface Dosbox {
    updateConf(section: string, key: string, value: string | number | boolean): boolean,
    updateAutoexec(context: string[]): void,
    run(params?: string[]): Promise<DosboxResult>
}

export interface API {
    /**
     * run **jsdos in the webview**. This works in all platform including web
     * 
     * @param bundle the Uri of the jsdos bundle
     * @returns the webview running JSDos
     * 
     * **Note**: the process will be lost when hide the webview and currently no way to resume
     */
    jsdosWeb: (bundle: vscode.Uri) => vscode.Webview;
    /**
     * run jsdos in the VSCode's node environment
     * 
     * @returns [CommandInterface](https://js-dos.com/v7/build/docs/command-interface)
     */
    jsdos: (bundle?: vscode.Uri | undefined) => Promise<CommandInterface>;
    /**
     * the jsdos emulator class of https://github.com/js-dos/emulators
     */
    emulators: Emulators;
    /**
     * run DOSBox via child_process
     */
    dosbox: Dosbox
    ;
    /**
     * run DOSBox-x via child_process
     */
    dosboxX: Dosbox;
    /**
     * run msdos player via cmd.exe
     * 
     * @returns a terminal to control
     */
    msdosPlayer: () => vscode.Terminal;
}