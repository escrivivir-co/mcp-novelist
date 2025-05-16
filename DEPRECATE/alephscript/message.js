"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
exports.isLogable = isLogable;
const SYSTEM_TOPICS = [
    "SOCKET_CONNECTED", "CONFIG", "ALL_SOCKETS", "SERVER_STATS",
    "SOCKET_UPDATED", "event_sent", "event_received"
];
const BL_TOPICS = [
    "CLIENT_REGISTER", // Client gives its name and profile
    "CLIENT_SUSCRIBE", // Clients joins a room
    "ENGINE_THREADS", // Request for data
    "ROOM_MESSAGE", // Extends rooms feature to clients, payload { room: "", data: }
];
function isLogable(innerEvent) {
    if (innerEvent.substring(0, 4) == "SET_" ||
        innerEvent.substring(0, 4) == "GET_") {
        return false;
    }
    return SYSTEM_TOPICS.concat(BL_TOPICS)
        .map(t => t.toUpperCase()).indexOf(innerEvent.toUpperCase()) == -1;
}
class Message {
    constructor(data, event) {
        this.namespace = "";
        this.socketid = "";
        this.event = "";
        this.data = "";
        this.date = new Date();
        this.get(data, event);
    }
    get(data, event) {
        try {
            if (!Array.isArray(data) || data.length != 4) {
                this.event = event.toUpperCase();
                return;
            }
            this.namespace = data[0];
            this.date = new Date(data[3]);
            if (Array.isArray(data[2])) {
                this.socketid = data[1];
                this.event = data[2][0];
                this.data = data[2][1];
                this.date = new Date(data[3]);
            }
            else {
                this.namespace = data[0];
                this.event = data[1];
                this.socketid = data[2];
                this.data = data[2][1];
            }
        }
        catch (ex) {
            console.log("Failed to parse socket message", ex.message, data, this);
            console.log("THE DATA", data);
            console.log("THE THIS", this);
        }
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map