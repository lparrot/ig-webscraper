import {connect as io_connect, Socket} from "socket.io-client";

export let socket: Socket

export default function useSocketIo() {
    const connect = async (options: { port: number } = {port: 8000}) => {
        socket = io_connect('ws://localhost:' + options.port, {
            transports: ['websocket']
        })
    }

    const disconnect = async () => {
        if (socket != null && socket.connected) {
            socket.disconnect()
        }
    }

    return {
        connect,
        disconnect
    }
}
