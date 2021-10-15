import * as vscode from 'vscode';
import { api } from './api';
import * as cp from 'child_process';
import { Conf } from './conf';

const fs = vscode.workspace.fs;

export function activate(context: vscode.ExtensionContext) {

	function dosbox(params: string = "", cpHandler?: (p: cp.ChildProcess) => void) {
		const _cmd: string | undefined = vscode.workspace.getConfiguration('vscode-dosbox').get('command.dosbox');
		const cmd = _cmd ? _cmd : 'dosbox';
		const cwd = process.platform === 'win32' ? context.asAbsolutePath('emu/win/dosbox') : undefined;
		return api.runDosboxLike(cmd, params, cwd, cpHandler);
	}

	function dosboxX(params: string = "", cpHandler?: (p: cp.ChildProcess) => void) {
		const _cmd: string | undefined = vscode.workspace.getConfiguration('vscode-dosbox').get('command.dosboxX');
		const cmd = _cmd ? _cmd : 'dosbox-x';
		const cwd = process.platform === 'win32' ? context.asAbsolutePath('emu/win/dosbox_x') : undefined;
		return api.runDosboxLike(cmd, params, cwd, cpHandler);
	}

	let disposable1 = vscode.commands.registerCommand('dosbox.openDosbox', dosbox);
	let disposable2 = vscode.commands.registerCommand('dosbox.openDosboxX', dosboxX);

	context.subscriptions.push(disposable1, disposable2);

	const dosboxConfigurationFile = vscode.Uri.joinPath(context.extensionUri, 'emu/win/dosbox/dosbox-0.74.conf');
	const dosboxxConfigurationFile = vscode.Uri.joinPath(context.extensionUri, 'emu/win/dosbox_x/dosbox-x.conf');
	const dosboxxzhCNConfigurationFile = vscode.Uri.joinPath(context.extensionUri, 'emu/win/dosbox_x/dosbox-x.conf');

	generateDosboxXzhConf(context);
	return {
		...api, dosbox, dosboxX,
		dosboxConfigurationFile, dosboxxConfigurationFile, dosboxxzhCNConfigurationFile
	};
}

async function generateDosboxXzhConf(context: vscode.ExtensionContext) {
	const dosboxxConfigurationFile = vscode.Uri.joinPath(context.extensionUri, 'emu/win/dosbox_x/dosbox-x.conf');
	const dosboxxzhCNConfigurationFile = vscode.Uri.joinPath(context.extensionUri, 'emu/win/dosbox_x/dosbox-x.conf');

	const text = await fs.readFile(dosboxxConfigurationFile);
	const conf = new Conf(text.toString());
	conf.update('render', 'ttf.font', context.asAbsolutePath('emu/win/dosbox_x_zh/simkai.ttf'));
	conf.update('dosbox', 'language', context.asAbsolutePath('emu/win/dosbox_x_zh/zh_CN.lng'));
	conf.update('dosbox', 'working directory option', 'noprompt');
	const newText = new TextEncoder().encode(conf.toString());
	await fs.writeFile(dosboxxzhCNConfigurationFile, newText);
}