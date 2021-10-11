import * as vscode from 'vscode';

class Logger{
    static channel=vscode.window.createOutputChannel('vscode-DOSBox');
    log=console.log;
    warn=console.warn;
    error=console.error;
    channel(text:string){
        Logger.channel.append(text.trim()+'\n');
        return Logger.channel;
    }
}

export const logger=new Logger();