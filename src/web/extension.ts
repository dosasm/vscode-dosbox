// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as jsdosWeb from './jsdos-web/main';
import * as jsdos from './jsdos/main';
import { logger } from './util/logger';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "test-web" is now active in the web extension host!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('test-web.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		main(context);
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from test-web in a web extension host!');
	});

	context.subscriptions.push(disposable);

	jsdosWeb.activate(context);
	jsdos.activate(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}

const fs=vscode.workspace.fs;

async function main(ctx:vscode.ExtensionContext) {
	const uri=vscode.Uri.joinPath(ctx.extensionUri,'node_modules/emulators/dist/wdosbox.js');
    const a=await fs.stat(uri);
	const text=await fs.readFile(uri);
	const worker=new Worker(uri.path);
    logger.channel(JSON.stringify([uri,a,text.length]));
}
