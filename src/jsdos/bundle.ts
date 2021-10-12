//methods for manipute jsdos-bundles
import * as JSZip from 'jszip';
import * as vscode from 'vscode';

const fs = vscode.workspace.fs;

/**create a jsdos bundle file by add new files to the sample. powered by https://stuk.github.io/jszip/
 * 
 * @param conf: the dosbox config, the original one will be overwrited
 * @param sample: the base jsdos bundle
*/
export async function createBundle(conf?: string, sample?: string): Promise<JSZip> {
    const zip = new JSZip();
    if (sample) {
        const zipdata = await fs.readFile(vscode.Uri.file(sample));
        await zip.loadAsync(zipdata);
    }

    zip.file('.jsdos/dosbox.conf', conf ? conf : "");

    return zip;

    // return new Promise(
    //     resolve => {
    //         const filename = sample ? basename(sample, 'jsdos') : "";
    //         const dst = join(getTmpDir('jsdos-bundle'), filename + new Date().getTime().toString() + '.jsdos');

    //         zip
    //             .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    //             .pipe(fs.createWriteStream(dst))
    //             .on('finish', function () {
    //                 // JSZip generates a readable stream with a "end" event,
    //                 // but is piped here in a writable stream which emits a "finish" event.
    //                 console.log(dst + " written.");
    //                 resolve(dst);
    //             });
    //     }
    // );
}

