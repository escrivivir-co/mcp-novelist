export declare function isLogable(innerEvent: string): boolean;
export declare class Message {
    namespace: string;
    socketid: string;
    event: string;
    data: any;
    date: Date;
    constructor(data: any, event: string);
    get(data: any, event: string): void;
}
