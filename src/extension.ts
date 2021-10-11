import * as vscode from 'vscode';
import { logger } from './util/logger';
import * as dosbox from './dosbox/main';
import * as player from './msdos-player/main';
import * as jsdos from './jsdos/main';
import * as jsdosWeb from './jsdos-web/main';

export function activate(context: vscode.ExtensionContext) {
	console.log('run in nonweb mode:'+context.extensionMode.toString());
	dosbox.activate(context);
	player.activate(context);
	jsdos.activate(context);
	jsdosWeb.activate(context);
}

export function deactivate() {}
