import { Emulators } from 'emulators';
import { EmulatorsUi } from 'emulators-ui';
import { onGetCi, postMessage } from './onGetCi';

declare const bundlePath: string | undefined;
declare const emulators: Emulators;
declare const emulatorsUi: EmulatorsUi;

function log(msg: string, add: boolean = true) {
    const e = document.getElementById('loadingInfo');
    if (e?.innerHTML) {
        if (add) {
            e.innerHTML += ';' + msg;
        }
        else {
            e.innerHTML = msg;
        }
    }
}

const jsdosElement = document.getElementById("root");

async function main(bundle: string): Promise<void> {
    log("auto loading from " + bundlePath);
    const ci = await emulatorsUi.dos(jsdosElement as HTMLDivElement, {
        emulatorFunction: 'dosboxDirect'
    }).run(bundle);
    onGetCi(ci);
    log("", false);
}

if (bundlePath) {
    main(bundlePath);
}
// Handle the message inside the webview
window.addEventListener('message', async event => {

    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
        case 'start':
            if (typeof message.bundle === 'string') {
                log("bundle url: " + message.bundle);
                main(message.bundle);
                break;
            }
            console.log("===bundle received===");
            const bundle: Uint8Array = Uint8Array.from(
                message.bundle.data ? message.bundle.data : message.bundle
            );
            log('bundle Array received lenghth: ' + bundle.length + "type: " + message.bundle.type);
            const layers = emulatorsUi.dom.layers(jsdosElement as HTMLDivElement);
            const ci = await emulators.dosboxDirect(bundle);
            log("", false);
            layers.hideLoadingLayer();
            emulatorsUi.graphics.webGl(layers, ci);
            emulatorsUi.controls.keyboard(layers, ci);
            emulatorsUi.controls.mouse(layers, ci);
            document.getElementById("sound")?.addEventListener(
                "click", e => {
                    emulatorsUi.sound.audioNode(ci);
                }
            );
            onGetCi(ci);
            break;
    }
});

log('index.js loaded');
postMessage({
    command: 'loaded'
});



