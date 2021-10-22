import { Emulators } from 'emulators';
import { EmulatorsUi } from 'emulators-ui';

import { PostCi } from './postCi';

declare const bundlePath: string | undefined;
declare const emulators: Emulators;
declare const emulatorsUi: EmulatorsUi;
declare const acquireVsCodeApi: () => { postMessage: (val: unknown) => undefined };

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
let postMessage = (val: unknown) => console.log(val);

try {
    const vscode = acquireVsCodeApi();
    postMessage = vscode.postMessage;
} catch (e) {
    console.log(e);
}

const postCi = new PostCi(postMessage);

const ele = document.getElementById("root");

async function main(): Promise<void> {

    if (bundlePath) {
        const ci = await emulatorsUi.dos(ele as HTMLDivElement, {
            emulatorFunction: 'dosboxDirect'
        }).run(bundlePath);

        postCi.setCi(ci);
    }
}

main();

// Handle the message inside the webview
window.addEventListener('message', async event => {

    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
        case 'start':
            const bundle: Uint8Array = message.bundle;
            const layers = emulatorsUi.dom.layers(ele as HTMLDivElement);
            const ci = await emulators.dosboxDirect(bundle);
            postCi.setCi(ci);
            layers.hideLoadingLayer();
            emulatorsUi.graphics.webGl(layers, ci);
            emulatorsUi.controls.keyboard(layers, ci);
            break;
    }
});

