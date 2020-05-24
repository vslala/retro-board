// @ts-ignore
import SockJS from "sockjs-client";
// @ts-ignore
import Stomp from 'stompjs';

class DuplexCommunication {

    public connect(topic:string, callback: (data:any) => void) {
        let socket = new SockJS("http://localhost:8082/retro-websocket");
        let stomp = Stomp.over(socket);
        stomp.connect({}, (frame) => {
            stomp.subscribe(topic, (data) => {
                callback(data);
            });
        });
    }
}

// @ts-ignore
export default DuplexCommunication;