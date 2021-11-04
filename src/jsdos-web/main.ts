import * as vscode from 'vscode';
import { Jsdos } from '../jsdos/Jsdos';

const webresources = [
    {
        "name": "Input your url"
    },
    {
        "name": "empty (only load jsdos)"
    },
    {
        "name": "digger.com (jsdos demo)",
        "url": "https://doszone-uploads.s3.dualstack.eu-central-1.amazonaws.com/original/2X/2/24b00b14f118580763440ecaddcc948f8cb94f14.jsdos"
    }
];

export function activate(context: vscode.ExtensionContext) {
    const jsdos = new Jsdos(context);

    let disposable = vscode.commands.registerCommand('dosbox.openJsdos', async (bundle?: vscode.Uri) => {
        if (bundle) {
            jsdos.setBundle(bundle);
            jsdos.runInWebview();
        } else {
            const pickedName = await vscode.window.showQuickPick(webresources.map(val => val.name));
            const picked = pickedName === "Input your url"
                ? await vscode.window.showInputBox({ placeHolder: "Input your url" })
                : webresources.find(val => val.name === pickedName)?.url;
            if (picked) {
                const uri = vscode.Uri.parse(picked);
                jsdos.runInWebview(uri);
            }
        }
    }
    );

    context.subscriptions.push(disposable);

    return { jsdos };
}
