import { CommandInterface } from "../emulators/emulators";
import { emulatorFunction } from "./loadJsdos";
import { PostCi } from "./postCi";
declare const acquireVsCodeApi: () => { postMessage: (val: unknown) => undefined };

export let _postMessage = (val: unknown) => console.log(val);

try {
    const vscode = acquireVsCodeApi();
    _postMessage = vscode.postMessage;
} catch (e) {
    console.log(e);
}

const postCi = new PostCi(_postMessage);

const copyDosMemory = false;

export function onGetCi(ci: CommandInterface) {
    postCi.setCi(ci);
    const soundElement = document.getElementById("sound") as HTMLInputElement | null;
    if (soundElement) {
        soundElement.checked = true;
        soundElement.addEventListener(
            "input", e => {
                if ((e.target as any).checked) {
                    ci.unmute();
                } else {
                    ci.mute();
                }
            }
        );
    }

    document.getElementById("debug")?.addEventListener(
        "input", (e) => {
            if (e.target && (e.target as any).checked) {
                //access memory
                //https://js-dos.com/v7/build/docs/dosbox-direct#accessing-memory
                ci.pause();
                const text = document.getElementById("show");
                if (emulatorFunction === 'dosboxDirect') {
                    (ci as any).transport.module._dumpMemory(copyDosMemory);
                    const cts = (ci as any).transport.module.memoryContents;
                    if (text) {
                        text.innerHTML = JSON.stringify(cts, undefined, "\t");
                    }
                    _postMessage({ command: "memoryContents", value: cts });
                }

            } else {
                ci.resume();
            }
        }
    );
}