import { SocketClient } from './socket-client';
export declare class AlephScriptClient extends SocketClient {
    name: string;
    url: string;
    namespace: string;
    autoConnect: boolean;
    constructor(name?: string, url?: string, namespace?: string, autoConnect?: boolean);
}
