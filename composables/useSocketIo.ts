import {connect as ioConnect, Socket} from "socket.io-client";

export let io: Socket

export default function useSocketIo() {
    const connect = async (options: { port: number } = {port: 8000}) => {
        io = ioConnect('ws://localhost:' + options.port, {
            transports: ['websocket']
        })
    }

    const disconnect = async () => {
        if (io != null && io.connected) {
            io.disconnect()
        }
    }

    const emit = async (event: string, ...args: any[]) => {
        return new Promise(resolve => {
            io.emit(event, ...args, (response: any) => {
                resolve(response)
            })
        })
    }

    const on = (event: string, callback: (...args: any[]) => void) => {
        io.on(event, callback)
    }

    return {
        connect,
        disconnect,
        emit,
        on
    }
}
