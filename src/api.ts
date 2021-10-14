import { CommandInterface, Emulators } from 'emulators';
import * as vscode from 'vscode';
import { DosboxResult } from './dosbox/api';
import * as cp from 'child_process';

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
     * 
     * @param params the parameters passed to dosbox
     */
    dosbox: (params: string, cpHandler?: (p: cp.ChildProcess) => void) => Promise<DosboxResult>;
    /**
     * run DOSBox-x via child_process
     * 
     * @param params the parameters passed to dosbox-x
     */
    dosboxX: (params: string, cpHandler?: (p: cp.ChildProcess) => void) => Promise<DosboxResult>;
    /**
     * run msdos player via cmd.exe
     * 
     * @returns a terminal to control
     */
    msdosPlayer: () => vscode.Terminal;
}