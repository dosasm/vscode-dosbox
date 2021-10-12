import * as vscode from 'vscode';
import * as db from './api';

export function activate(context: vscode.ExtensionContext) {


	let disposable1 = vscode.commands.registerCommand('dosbox.openDosbox', (param?: string) => {
		const cwd = process.platform === 'win32' ? context.asAbsolutePath('emu/win/dosbox') : undefined;
		return db.dosbox('dosbox', cwd, param);
	});

	let disposable2 = vscode.commands.registerCommand('dosbox.openDosboxX', (param?: string) => {
		const cwd = process.platform === 'win32' ? context.asAbsolutePath('emu/win/dosbox_x') : undefined;
		return db.dosbox('dosbox-x', cwd, param);
	});

	context.subscriptions.push(disposable1, disposable2);

	return {
		dosbox: db.dosbox
	};
}