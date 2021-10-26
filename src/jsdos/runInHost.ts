import * as vscode from 'vscode';
import { Emulators } from 'emulators/dist/types/emulators';

import 'emulators';

export const emulators: Emulators = (global as any).emulators ? (global as any).emulators : undefined;

if (emulators === undefined) {
    vscode.window.showErrorMessage("extension can't load jsdos");
    throw new Error("extension can't load jsdos");
}
