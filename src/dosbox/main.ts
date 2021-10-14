import * as vscode from 'vscode';
import { api } from './api';
import * as cp from 'child_process';

export function activate(context: vscode.ExtensionContext) {
	const dosboxConfigurationFile = context.asAbsolutePath('emu/win/dosbox/dosbox-0.74.conf');
	function dosbox(params: string = "", cpHandler?: (p: cp.ChildProcess) => void) {
		const _cmd: string | undefined = vscode.workspace.getConfiguration('vscode-dosbox').get('command.dosbox');
		const cmd = _cmd ? _cmd : 'dosbox';
		const cwd = process.platform === 'win32' ? context.asAbsolutePath('emu/win/dosbox') : undefined;
		return api.runDosboxLike(cmd, params, cwd, cpHandler);
	}

	const dosboxxConfigurationFile = context.asAbsolutePath('emu/win/dosbox_x/dosbox-x.conf');
	function dosboxX(params: string = "", cpHandler?: (p: cp.ChildProcess) => void) {
		const _cmd: string | undefined = vscode.workspace.getConfiguration('vscode-dosbox').get('command.dosboxX');
		const cmd = _cmd ? _cmd : 'dosbox-x';
		const cwd = process.platform === 'win32' ? context.asAbsolutePath('emu/win/dosbox_x') : undefined;
		return api.runDosboxLike(cmd, params, cwd, cpHandler);
	}

	let disposable1 = vscode.commands.registerCommand('dosbox.openDosbox', dosbox);
	let disposable2 = vscode.commands.registerCommand('dosbox.openDosboxX', dosboxX);

	context.subscriptions.push(disposable1, disposable2);

	return { ...api, dosbox, dosboxX, dosboxConfigurationFile, dosboxxConfigurationFile };
}