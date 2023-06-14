import mitt, {Emitter} from 'mitt';

class CustomEventBus {
    private static instance: CustomEventBus;

    private mitt: Emitter<any>

    private constructor() {
        this.mitt = mitt();
    }

    public static getInstance() {
        if (CustomEventBus.instance === undefined) {
            CustomEventBus.instance = new CustomEventBus();
        }

        return CustomEventBus.instance;
    }

    public publish(topic: string, data: any) {
        console.log("Event Published To: ", topic, data);
        this.mitt?.emit(topic, data);
    }

    public subscribe(topic: string, callback: (data: any) => void) {
        console.log("Subscribing to: ", topic);
        this.mitt?.on(topic, async (data) => {
            callback(await data);
        });
    }

    public unsubscribe(topic: string, callback: (data: any) => void) {
        this.mitt?.off(topic, callback);
    }
}

export default CustomEventBus
