import { CommandInterface, Emulators } from 'emulators';
import * as vscode from 'vscode';
import * as Jszip from 'jszip';

export interface DosboxResult {
    stdout: string,
    stderr: string,
    exitCode: number | null;
}

export interface Dosbox {
    updateConf(section: string, key: string, value: string | number | boolean): boolean,
    updateAutoexec(context: string[]): void,
    run(params?: string[]): Promise<DosboxResult>
}

export interface API {
    /**
     * run **jsdos in the webview**. This works in all platform including web
     * 
     * @param bundle the Uint8Array data of the jsdos bundle
     * @returns the vscode webview running JSDos
     */
    jsdosWeb: (bundle: Uint8Array | undefined) => vscode.Webview;
    /**
     * run jsdos in the VSCode's node environment
     * 
     * @param bundle the Uint8Array data of the jsdos bundle
     * @todo make this also work in web extension
     * @returns [CommandInterface](https://js-dos.com/v7/build/docs/command-interface)
     */
    jsdos: (bundle?: Uint8Array | undefined) => Promise<CommandInterface>;

    /**
     * [jsdos](https://js-dos.com/v7/build/) emulator 
     *  is the core of jsdos -- the simpliest API to run DOS games in browser
     * 
     * @see https://github.com/js-dos/emulators
     */
    emulators: Emulators;
    /**
     * [JSZip](https://stuk.github.io/jszip/)
     *  is a javascript library for creating, reading and editing .zip files, with a lovely and simple API.
     */
    jszip: typeof Jszip;

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