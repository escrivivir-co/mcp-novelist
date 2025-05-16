import { Socket } from 'socket.io-client';
export declare class SocketClient {
    name: string;
    url: string;
    namespace: string;
    autoConnect: boolean;
    io: Socket;
    initTriggers: (() => void)[];
    initTriggersDefinition: (() => void)[];
    interval: any;
    constructor(name?: string, url?: string, namespace?: string, autoConnect?: boolean);
    log(message: string, data?: any): void;
    room(event: string, data?: any, room?: string): void;
    roomP(payload: any): void;
}
