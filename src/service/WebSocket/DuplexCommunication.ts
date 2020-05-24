// @ts-ignore
import SockJS from "sockjs-client";
// @ts-ignore
import Stomp from 'stompjs';

class DuplexCommunication {

    static socket: any;
    static stomp: any;

    public connect() {
        if (DuplexCommunication.socket && DuplexCommunication.stomp)
            return;
        DuplexCommunication.socket = new SockJS("http://localhost:8082/retro-websocket");
        DuplexCommunication.stomp = Stomp.over(DuplexCommunication.socket);
        if (DuplexCommunication.stomp.status !== "CONNECTED") {
            DuplexCommunication.stomp.connect();
        }
    }

    public subscribe(topic: string, callback: (data: any) => void) {

        if (!DuplexCommunication.stomp)
            this.connect()

        // wait until the websocket connection has been established
        let subscribeInterval = setInterval(() => {
            if (DuplexCommunication.stomp.connected) {
                window.clearInterval(subscribeInterval);
                DuplexCommunication.stomp.subscribe(topic, (data: any) => {
                    callback(data);
                });
            }
        }, 1000);

    }
}

// @ts-ignore
export default DuplexCommunication;