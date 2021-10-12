import * as vscode from 'vscode';
import * as cp from 'child_process';

export function activate(context: vscode.ExtensionContext) {

	let disposable1 = vscode.commands.registerCommand('dosbox.openDosbox', () => {
		const cwd = process.platform === 'win32' ? context.asAbsolutePath('emu/win/dosbox') : undefined;
		return cp.exec('dosbox', { cwd });
	});

	let disposable2 = vscode.commands.registerCommand('dosbox.openDosboxX', () => {
		const cwd = process.platform === 'win32' ? context.asAbsolutePath('emu/win/dosbox_x') : undefined;
		return cp.exec('dosbox-x', { cwd });
	});

	context.subscriptions.push(disposable1, disposable2);
}