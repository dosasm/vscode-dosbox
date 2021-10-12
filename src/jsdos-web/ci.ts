import { CommandInterface, CommandInterfaceEvents } from "emulators";
import { DosConfig } from "emulators/dist/types/dos/bundle/dos-conf";
import * as vscode from 'vscode';

export class RemoteCi{
    constructor(
        public post:(msg:any)=>void,
        public onDidReceive:vscode.Event<any>
    ){

    }

    private remoteFunctionCount=0;
    public  remoteFunction(name:string,param:any[]):Promise<any>{
        const count=this.remoteFunctionCount;
        this.post({command:'remote-function',name,param,count});
        return new Promise<any>(
            resolve=>{
                this.onDidReceive(message=>{
                    if(message.command==='remote-function' && message.count===count){
                        resolve(message.value);
                    }
                });
            }            
        );
    }
}