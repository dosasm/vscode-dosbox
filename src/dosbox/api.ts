import * as cp from 'child_process';

export interface DosboxResult {
    stdout: string,
    stderr: string,
    exitCode: number | null;
}

function run(cmd: string, params: string = "", cwd?: string, cpHandler?: (p: cp.ChildProcess) => void) {

    const command = cmd.includes('<params>') ? cmd.replace('<params>', params) : cmd + " " + params;
    return new Promise<DosboxResult>(
        (resolve, reject) => {
            const p = cp.exec(command, { cwd }, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve({ stdout, stderr, exitCode: p.exitCode });
                }
            });
            if (cpHandler) {
                cpHandler(p);
            }
        }
    );
}

export const api = {
    runDosboxLike: run,
};