import * as vscode from 'vscode';
import { CommandInterface, Emulators } from 'emulators/dist/types/emulators';

import 'emulators';
import { createBundle } from './bundle';
const emulators: Emulators = (global as any).emulators ? (global as any).emulators : undefined;
const fs = vscode.workspace.fs;

async function jsdos(bundle?: vscode.Uri) {
    if (emulators !== undefined) {
        const bundleData = bundle ?
            await fs.readFile(bundle)
            : await (await createBundle()).generateAsync({ type: "uint8array" });

        const ci = (process as any).browser ?
            await emulators.dosboxDirect(bundleData)
            : await emulators.dosboxDirect(bundleData);

        return ci;
    }
    else {
        vscode.window.showErrorMessage("extension can't load jsdos");
        throw new Error("extension can't load jsdos");
    }
}

export const api = {
    jsdos,
    emulators,
};