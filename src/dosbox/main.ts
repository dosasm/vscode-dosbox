import * as vscode from 'vscode';
import * as db from './dosbox';
import * as cp from 'child_process';
import { Conf } from './conf';

const fs = vscode.workspace.fs;

export async function activate(context: vscode.ExtensionContext) {

	const dosboxConfigurationFile = {
		box: vscode.Uri.joinPath(context.extensionUri, 'emu/win/dosbox/dosbox-0.74.conf'),
		boxX: vscode.Uri.joinPath(context.extensionUri, 'emu/win/dosbox_x/dosbox-x.reference.full.conf'),
		boxXzh: vscode.Uri.joinPath(context.extensionUri, 'emu/win/dosbox_x_zh/dosbox-x.conf')
	};

	const text = await fs.readFile(dosboxConfigurationFile.boxX);
	const conf = new Conf(text.toString());
	conf.update('sdl', 'output', 'ttf');
	conf.update('log', 'logfile', 'dosbox-x_zh.log');
	conf.update('config', 'country', '86,936');
	conf.update('ttf', 'font', context.asAbsolutePath('emu/win/dosbox_x_zh/simkai.ttf'));
	conf.update('dosbox', 'language', context.asAbsolutePath('emu/win/dosbox_x_zh/zh_CN.lng'));
	conf.update('dosbox', 'working directory option', 'noprompt');
	const newText = new TextEncoder().encode(conf.toString());
	await fs.writeFile(dosboxConfigurationFile.boxXzh, newText);

	const _cmd: string | undefined = vscode.workspace.getConfiguration('vscode-dosbox').get('command.dosbox');
	const cmd = _cmd ? _cmd : 'dosbox';
	const confpath = vscode.Uri.joinPath(context.globalStorageUri, 'dosbox.conf');
	const cwd = process.platform === 'win32' ? context.asAbsolutePath('emu/win/dosbox') : undefined;
	const dosbox = new db.DOSBox(cmd, confpath, cwd);
	await dosbox.setConf(dosboxConfigurationFile.box);

	const _xcmd: string | undefined = vscode.workspace.getConfiguration('vscode-dosbox').get('command.dosboxX');
	const xcmd = _xcmd ? _xcmd : 'dosbox-x';
	const xconfpath = vscode.Uri.joinPath(context.globalStorageUri, 'dosbox-x.conf');
	const xcwd = process.platform === 'win32' ? context.asAbsolutePath('emu/win/dosbox_x') : undefined;
	const dosboxX = new db.DOSBox(xcmd, xconfpath, xcwd);
	await dosboxX.setConf(dosboxConfigurationFile.boxXzh);

	let disposable1 = vscode.commands.registerCommand('dosbox.openDosbox', (params?: string[], cpHandler?: (p: cp.ChildProcess) => void) => {
		return dosbox.run(params, cpHandler);
	});
	let disposable2 = vscode.commands.registerCommand('dosbox.openDosboxX', (params?: string[], cpHandler?: (p: cp.ChildProcess) => void) => {
		return dosboxX.run(params, cpHandler);
	});

	context.subscriptions.push(disposable1, disposable2);

	return {
		dosboxConfigurationFile,
		dosbox, dosboxX,
	};
}