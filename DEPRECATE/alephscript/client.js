"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlephScriptClient = void 0;
const socket_client_1 = require("./socket-client");
class AlephScriptClient extends socket_client_1.SocketClient {
    constructor(name = "AlephClient", url = "http://localhost:3000", namespace = "/", autoConnect = true) {
        super(name, url, namespace, autoConnect);
        this.name = name;
        this.url = url;
        this.namespace = namespace;
        this.autoConnect = autoConnect;
    }
}
exports.AlephScriptClient = AlephScriptClient;
//# sourceMappingURL=client.js.map