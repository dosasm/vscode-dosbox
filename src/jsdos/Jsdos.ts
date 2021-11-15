import { CommandInterface } from 'emulators';
import * as vscode from 'vscode';
import * as api from '../api';
import { Conf } from '../dosbox/conf';
import * as Jszip from 'jszip';
import { emulators } from './runInHost';
import { runInWebview } from './runInWebview';

const fs = vscode.workspace.fs;

export class Jsdos implements api.Jsdos {

    public set pathPrefix(pathPrefix: string) { emulators.pathPrefix = pathPrefix; }
    public conf: Conf = new Conf("");
    public jszip: Jszip = new Jszip();

    constructor(private context: vscode.ExtensionContext) {
        this.pathPrefix = context.asAbsolutePath('/node_modules/emulators/dist/');
    }

    async setBundle(bundle: vscode.Uri | Uint8Array, updateConf?: boolean): Promise<void> {
        if ((bundle as vscode.Uri).fsPath) {
            const data = await fs.readFile(bundle as vscode.Uri);
            await this.jszip.loadAsync(data);
        }
        else {
            const data = new Uint8Array(bundle as Uint8Array);
            await this.jszip.loadAsync(data);
        }

        if (updateConf) {
            const text = await this.jszip.file('.jsdos/dosbox.conf')?.async("string");
            if (text) { this.conf = new Conf(text); }
        }
    }

    updateConf(section: string, key: string, value: string | number | boolean): boolean {
        const r = this.conf.update(section, key, value);
        return Boolean(r);
    }

    updateAutoexec(context: string[]): void {
        this.conf.updateAutoexec(context);
    }

    run = this.runInHost;

    async getBundleData(): Promise<Uint8Array> {
        const s = this.jszip.file('.jsdos/dosbox.conf', this.conf.toString());
        const bundleData = await this.jszip.generateAsync({ type: 'uint8array' });
        return bundleData;
    }
    async runInHost(): Promise<CommandInterface> {
        const bundleData = await this.getBundleData();
        return emulators.dosboxDirect(bundleData);
    }
    async runInWebview(bundle?: vscode.Uri | null | undefined): Promise<vscode.Webview> {
        const panel = await this.runInWebviewPanel(bundle);
        return panel.webview;
    }
    async runInWebviewPanel(bundle?: vscode.Uri | null | undefined): Promise<vscode.WebviewPanel> {
        if (bundle === undefined) {
            const bundleData = await this.getBundleData();
            return runInWebview(this.context, bundleData);
        }
        else if (bundle === null) {
            const bundleData = await new Jszip()
                .file(".jsdos/dosbox.conf", "")
                .generateAsync({ type: "uint8array" });
            return runInWebview(this.context, bundleData);
        }
        else if (bundle.scheme === "file") {
            const bundleData = await fs.readFile(bundle);
            return runInWebview(this.context, bundleData);
        }
        else if (bundle.scheme === "http" || bundle.scheme === "https") {
            return runInWebview(this.context, bundle.toString());
        }
        throw new Error("bundle uri is not a uri with schema file/http/https or undefined/null");
    };
}