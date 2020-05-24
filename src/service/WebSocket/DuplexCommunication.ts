// @ts-ignore
import SockJS from "sockjs-client";
// @ts-ignore
import Stomp from 'stompjs';

class DuplexCommunication {

    private static instance: DuplexCommunication;

    static socket: any;
    static stomp: any;

    public static getInstance() {
        if (! DuplexCommunication.instance)
            DuplexCommunication.instance = new DuplexCommunication();
        if (! DuplexCommunication.instance.isConnected())
            DuplexCommunication.instance.connect();
        return DuplexCommunication.instance;
    }

    private connect() {

        if (this.isConnected()) return;

        DuplexCommunication.socket = new SockJS("http://localhost:8082/retro-websocket");
        DuplexCommunication.stomp = Stomp.over(DuplexCommunication.socket);
        if (! this.isConnected()) {
            DuplexCommunication.stomp.connect({},
                (frame:any) => {},
                (success:any) => { console.log("Connected!"); },
                (error:any) => {
                    alert("Connection lost!!! Reload the page...");
                    window.location.reload();
                }
            );
        }
    }

    private isConnected() {
        return DuplexCommunication.socket && DuplexCommunication.stomp && DuplexCommunication.stomp.connected;
    }

    public subscribe(topic: string, callback: (data: any) => void) {

        console.log("trying subscribing to topic...")
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