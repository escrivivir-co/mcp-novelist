"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketClient = void 0;
const socket_io_client_1 = require("socket.io-client");
const message_1 = require("./message");
class SocketClient {
    constructor(name = "AlephClient", url = "http://localhost:3000", namespace = "/", autoConnect = true) {
        this.name = name;
        this.url = url;
        this.namespace = namespace;
        this.autoConnect = autoConnect;
        this.initTriggers = [];
        this.initTriggersDefinition = [];
        this.io = (0, socket_io_client_1.io)(url + namespace, { autoConnect });
        this.io.on("connect", () => {
            this.initTriggers = [...this.initTriggersDefinition];
            this.log("Conectado al back", "Socket: " + this.io.id);
            this.io.emit("CLIENT_REGISTER", { name: this.name });
            this.io.emit("CLIENT_SUSCRIBE", { room: "ENGINE_THREADS" });
            this.io.onAny((event, ...args) => {
                // console.log(event);
                const innerEvent = new message_1.Message(args, event).event;
                switch (event) {
                    case "room_joined":
                    case "room_left":
                        console.log("socket-client", event, args);
                        this.log(`${event}:> ${namespace}/${innerEvent}`);
                        return;
                    default:
                }
                if (!(0, message_1.isLogable)(innerEvent))
                    return;
                if (!(0, message_1.isLogable)(event))
                    return;
                this.log(namespace + "/Socket.OnAny" + "/" + innerEvent +
                    `:> ${event} with data:`, args);
            });
            this.interval = setInterval(() => {
                while (this.initTriggers.length > 0) {
                    const f = this.initTriggers.pop();
                    if (f)
                        f();
                }
                ;
            }, 1000);
        });
        this.io.on("disconnect", () => {
            this.log("OnDisconnect");
            clearInterval(this.interval);
        });
        this.io.on("connect_error", (error) => {
            this.log("Error de conexión:", error.message);
        });
        this.io.on("connect_timeout", () => {
            this.log("Tiempo de conexión excedido");
        });
        this.io.on("reconnect", (attemptNumber) => {
            this.log("Reconectado al servidor en el intento:", attemptNumber);
        });
        this.io.on("reconnect_attempt", (attemptNumber) => {
            this.log("Intento de reconexión:", attemptNumber);
        });
        this.io.on("reconnecting", (attemptNumber) => {
            this.log("Intentando reconectar:", attemptNumber);
        });
        this.io.on("reconnect_error", (error) => {
            this.log("Error al reconectar:", error);
        });
        this.io.on("ping", () => {
            this.log("Ping enviado al servidor");
        });
        this.io.on("pong", (latency) => {
            this.log("Pong recibido del servidor, latencia:", latency);
        });
        // this.io.connect();
        this.log("Conectando al backend...");
    }
    log(message, data = undefined) {
        console.log("\t - ", this.name, message, data ? data : "");
    }
    room(event, data = {}, room = "ENGINE_THREADS") {
        this.io.emit("ROOM_MESSAGE", {
            event,
            room,
            data
        });
    }
    roomP(payload) {
        this.io.emit("ROOM_MESSAGE", payload);
    }
}
exports.SocketClient = SocketClient;
//# sourceMappingURL=socket-client.js.map