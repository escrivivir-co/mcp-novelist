import { io, Socket } from 'socket.io-client';
import { isLogable, Message } from './message';

export class SocketClient {

	io: Socket;

	initTriggers: (() => void)[] = [];
	initTriggersDefinition: (() => void)[] = [];

	interval: any;

	constructor(
		public name = "AlephClient",
		public url: string = "http://localhost:3000",
		public namespace: string = "/",
		public autoConnect = true,
	) {

		this.io = io(url + namespace, { autoConnect });

		this.io.on("connect", () => {

			this.initTriggers = [...this.initTriggersDefinition];

			this.log("Conectado al back", "Socket: " + this.io.id)

			this.io.emit("CLIENT_REGISTER", { name: this.name });
			this.io.emit("CLIENT_SUSCRIBE", { room: "ENGINE_THREADS" });

			this.io.onAny((event, ...args: any) => {

				// console.log(event);

				const innerEvent = new Message(args, event).event;

				switch(event) {
					case "room_joined":
					case "room_left":
						console.log("socket-client", event, args)
						this.log(
							`${event}:> ${namespace}/${innerEvent}`
						)
						return;
					default:
				}
				if (!isLogable(innerEvent)) return;
				if (!isLogable(event)) return;

				this.log(
					namespace + "/Socket.OnAny" + "/" + innerEvent +
					`:> ${event} with data:`,
					args
				)
			});

			this.interval = setInterval(() => {

				while (this.initTriggers.length > 0) {
					const f = this.initTriggers.pop();
					if (f) f();
				};

			}, 1000)
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

		this.log("Conectando al backend...")
	}

	log(message: string, data: any = undefined) {
		console.log("\t - ", this.name, message, data ? data : "");
	}

	room(event: string, data: any = {}, room: string = "ENGINE_THREADS") {
		this.io.emit(
			"ROOM_MESSAGE",
			{
				event,
				room,
				data
			}
		);
	}

	roomP(payload: any) {
		this.io.emit(
			"ROOM_MESSAGE",
			payload
		);
	}
}