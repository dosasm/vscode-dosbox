import * as load from './loadJsdos';
import { _postMessage } from './onGetCi';

declare const jsdosconfig: {
    bundlePath: string | undefined
};

if (jsdosconfig.bundlePath) {
    log("auto loading from " + jsdosconfig);
    load.start(jsdosconfig.bundlePath);
    log("", false);
}

// Handle the message inside the webview
window.addEventListener('message', async event => {

    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
        case 'start':
            console.log("===bundle received===");
            if (typeof message.bundlePath === 'string' || typeof message.bundle === 'string') {
                const bundlePath = message.bundlePath === undefined ? message.bundle : message.bundlePath;
                log("bundle url: " + bundlePath);
                load.start(message.bundlePath);
                log("", false);
                break;
            }
            //since Uint8array is not works well in VSCode
            //try my best to make cold work will
            const _bundle = message.bundle;
            let bundleData: Uint8Array = Array.isArray(_bundle)
                ? Uint8Array.from(_bundle)//in nodejs env, the Uint8array is always received as an array {[id:number]:number}
                : Uint8Array.from(Object.values(_bundle));//in browser env, always received as an Object {[id:string]:number}
            //some times received as an object with data
            if (bundleData.length === 0 && _bundle.data) {
                bundleData = Uint8Array.from(_bundle.data);
                log("bundle type: " + _bundle.type);
            }
            log('bundle Array received lenghth: ' + bundleData.length);
            log("", false);
            load.start(bundleData);
            break;
    }
});

log('index.js loaded');
console.log("===loaded===");
_postMessage({
    command: 'loaded'
});


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



