import * as cp from 'child_process';

export interface DosboxResult {
    stdout: string,
    stderr: string,
    exitCode: number | null;
}

export function dosbox(command: string, cwd?: string, param?: string, on?: { stdout?: (val: string) => void, stderr?: (val: string) => void }) {
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
        }
    );
}