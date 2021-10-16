import * as cp from 'child_process';
import * as vscode from 'vscode';
import { logger } from '../util/logger';
import { Conf } from './conf';
import * as api from '../api';

const fs = vscode.workspace.fs;

export interface DosboxResult {
    stdout: string,
    stderr: string,
    exitCode: number | null;
}

export class DOSBox implements api.Dosbox {
    private _conf: Conf = new Conf("");
    constructor(
        public readonly command: string,
        public dstConfPath: vscode.Uri,
        public cwd?: string,
    ) {

    }

    /** set the dosbox configuration file template
     * 
     * @param template the path of the reference.conf file
     */
    async setConf(template: vscode.Uri) {
        const text = await fs.readFile(template);
        this._conf = new Conf(text.toString());
    }

    updateConf = (section: string, key: string, value: string | number | boolean) => this._conf.update(section, key, value);
    updateAutoexec = (context: string[]) => this._conf.updateAutoexec(context);

    async run(params?: string[], cpHandler?: (p: cp.ChildProcess) => void) {
        const text = new TextEncoder().encode(this._conf.toString());
        await fs.writeFile(this.dstConfPath, text);
        const cmd = this.command;
        const parameter = Array.isArray(params) ? params.join(" ") : `-conf "${this.dstConfPath.fsPath}"`;
        const command = cmd.includes('<params>') ? cmd.replace('<params>', parameter) : cmd + " " + parameter;
        console.log(this.dstConfPath.fsPath, command);
        return new Promise<DosboxResult>(
            (resolve, reject) => {
                const p = cp.exec(command, { cwd: this.cwd }, (error, stdout, stderr) => {
                    if (error) {
                        logger.error(error);
                        vscode.window.showErrorMessage("can't open dosbox with command: " + command);
                        //reject(error);
                    }
                    else {
                        resolve({ stdout, stderr, exitCode: p.exitCode });
                    }
                });
                if (cpHandler) {
                    cpHandler(p);
                }
            });
    }
}