import * as vscode from 'vscode';
import * as dosbox from './dosbox/main';
import * as player from './msdos-player/main';
import * as jsdos from './jsdos/main';
import * as jsdosWeb from './jsdos-web/main';
export { API } from './api';
import * as D from './api';

export async function activate(context: vscode.ExtensionContext): Promise<D.API> {
	console.log('run in nonweb mode:' + context.extensionMode.toString());

	const api = {
		...await dosbox.activate(context),
		...player.activate(context),
		...jsdos.activate(context),
		...jsdosWeb.activate(context)
	};

	return api;
}

export function deactivate() { }
