import { CommandInterface, Emulators } from 'emulators';
import * as vscode from 'vscode';
import { DosboxResult } from './dosbox/api';
import * as cp from 'child_process';

export interface API {
    /**
     * run jsdos in the webview
     * 
     * @param bundle the Uri of the jsdos bundle
     * @returns the webview running JSDos
     * 
     * **Note**: the process will be lost when hide the webview
     */
    jsdosWeb: (bundle: vscode.Uri) => vscode.Webview;
    /**
     * run jsdos in the VSCode's node environment
     */
    jsdos: (bundle?: vscode.Uri | undefined) => Promise<CommandInterface>;
    /**
     * the jsdos emulator class
     */
    emulators: Emulators;
    /**
     * run DOSBox via child_process
     * 
     * @param params the parameters passed to dosbox for 
     */
    dosbox: (params: string, cpHandler?: (p: cp.ChildProcess) => void) => Promise<DosboxResult>;
    /**
     * run DOSBox-x via child_process
     * 
     * @param params the parameters passed to dosbox for 
     */
    dosboxX: (params: string, cpHandler?: (p: cp.ChildProcess) => void) => Promise<DosboxResult>;
    /**
     * run msdos player via cmd.exe
     * 
     * @returns a terminal to control
     */
    msdosPlayer: () => vscode.Terminal;
}