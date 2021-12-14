import { WasmModule } from "../../../impl/modules";
import { TransportLayer, MessageHandler, ClientMessage } from "../../../protocol/protocol";
import { MessagesQueue } from "../../../protocol/messages-queue";
import { isBrowser, isNode, isWebWorker, isJsDom, isDeno } from "browser-or-node";
import { HTTPRequest } from "../../../http";

export async function dosWorker(workerUrl: string,
                                 wasmModule: WasmModule,
                                 sessionId: string): Promise<TransportLayer> {
    const messagesQueue = new MessagesQueue();
    let handler: MessageHandler = messagesQueue.handler.bind(messagesQueue);

    let worker:Worker

    //runs in webview: use fetch to download the file
    if(isBrowser){
        const res =await fetch(workerUrl)
        const blob=await  res.blob()
        const blobUrl = URL.createObjectURL(blob);
        worker = new Worker(blobUrl);
    }
    //runs in web extension host
    else if(isWebWorker){
        worker=new Worker(workerUrl);
    }
    //runs in nodejs extension host: not work now 
    else if(isNode){
        const {Worker} = eval("require")('worker_threads');
        worker=new Worker(workerUrl);
    }
    //others
    else{
        worker=new Worker(workerUrl);
    }
    
    worker.onerror = (e) => {
        handler("ws-err", { type: e.type, filename: e.filename, message: e.message });
    };
    worker.onmessage = (e) => {
        const data = e.data;
        if (data?.name !== undefined) {
            handler(data.name, data.props);
        }
    }

    await wasmModule.instantiate({});

    const transportLayer: TransportLayer = {
        sessionId,
        sendMessageToServer: (name: ClientMessage, props?: {[key: string]: any}) => {
            worker.postMessage({ name, props });
        },
        initMessageHandler: (newHandler: MessageHandler) => {
            handler = newHandler;
            messagesQueue.sendTo(handler);
        },
        exit: () => {
            worker.terminate();
        },
    };

    try {
        transportLayer.sendMessageToServer("wc-install", {
            module: (wasmModule as any).wasmModule,
            sessionId,
        });
    } catch (e) {
        transportLayer.sendMessageToServer("wc-install", { sessionId });
    }

    return transportLayer;
}
